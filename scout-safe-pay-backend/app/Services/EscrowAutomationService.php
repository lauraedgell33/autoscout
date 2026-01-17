<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\Payment;
use App\Models\BankAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PaymentStatusNotification;

class EscrowAutomationService
{
    /**
     * Automatically release funds when conditions are met
     */
    public static function autoReleaseFunds(Transaction $transaction): bool
    {
        if (!self::canAutoRelease($transaction)) {
            return false;
        }

        DB::beginTransaction();
        try {
            // Release payment to seller
            $releasePayment = Payment::create([
                'transaction_id' => $transaction->id,
                'user_id' => $transaction->seller_id,
                'amount' => $transaction->amount - $transaction->service_fee - $transaction->dealer_commission,
                'currency' => $transaction->currency,
                'type' => 'release',
                'status' => 'completed',
                'processed_at' => now(),
                'completed_at' => now(),
            ]);

            // Create service fee payment
            if ($transaction->service_fee > 0) {
                Payment::create([
                    'transaction_id' => $transaction->id,
                    'user_id' => $transaction->seller_id,
                    'amount' => $transaction->service_fee,
                    'currency' => $transaction->currency,
                    'type' => 'service_fee',
                    'status' => 'completed',
                    'processed_at' => now(),
                    'completed_at' => now(),
                ]);
            }

            // Create dealer commission payment
            if ($transaction->dealer_commission > 0 && $transaction->dealer_id) {
                Payment::create([
                    'transaction_id' => $transaction->id,
                    'user_id' => $transaction->dealer->user_id,
                    'amount' => $transaction->dealer_commission,
                    'currency' => $transaction->currency,
                    'type' => 'dealer_commission',
                    'status' => 'completed',
                    'processed_at' => now(),
                    'completed_at' => now(),
                ]);
            }

            // Update transaction status
            $transaction->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Update vehicle status
            $transaction->vehicle->update(['status' => 'sold']);

            // Notify parties
            self::notifyFundsReleased($transaction);

            DB::commit();
            Log::info('Funds auto-released', ['transaction_id' => $transaction->id]);
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Auto-release failed', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private static function canAutoRelease(Transaction $transaction): bool
    {
        // Check all conditions for auto-release
        return $transaction->status === 'ownership_transferred'
            && $transaction->payment_verified_at !== null
            && $transaction->payment_verified_at->lt(now()->subDays(3))
            && !$transaction->disputes()->where('status', 'open')->exists()
            && $transaction->inspection_result === 'passed';
    }

    /**
     * Process scheduled inspections
     */
    public static function processScheduledInspections(): array
    {
        $processed = [];
        
        $dueInspections = Transaction::where('status', 'inspection_scheduled')
            ->where('inspection_date', '<=', now())
            ->get();

        foreach ($dueInspections as $transaction) {
            // Notify buyer to complete inspection
            $transaction->buyer->notify(new PaymentStatusNotification(
                'inspection_due',
                "Your vehicle inspection for {$transaction->vehicle->make} {$transaction->vehicle->model} is due.",
                $transaction
            ));

            $processed[] = [
                'transaction_id' => $transaction->id,
                'action' => 'inspection_reminder_sent',
            ];
        }

        // Auto-fail inspections overdue by 7 days
        $overdueInspections = Transaction::where('status', 'inspection_scheduled')
            ->where('inspection_date', '<=', now()->subDays(7))
            ->get();

        foreach ($overdueInspections as $transaction) {
            $transaction->update([
                'status' => 'inspection_failed',
                'inspection_result' => 'failed',
                'admin_notes' => 'Auto-failed: Inspection not completed within 7 days',
            ]);

            $processed[] = [
                'transaction_id' => $transaction->id,
                'action' => 'inspection_auto_failed',
            ];
        }

        return $processed;
    }

    /**
     * Process automatic refunds
     */
    public static function processRefunds(Transaction $transaction, string $reason): bool
    {
        if ($transaction->status !== 'payment_verified') {
            return false;
        }

        DB::beginTransaction();
        try {
            // Create refund payment
            Payment::create([
                'transaction_id' => $transaction->id,
                'user_id' => $transaction->buyer_id,
                'amount' => $transaction->amount,
                'currency' => $transaction->currency,
                'type' => 'refund',
                'status' => 'completed',
                'admin_notes' => "Refund reason: {$reason}",
                'processed_at' => now(),
                'completed_at' => now(),
            ]);

            // Update transaction
            $transaction->update([
                'status' => 'refunded',
                'refund_reason' => $reason,
                'refunded_at' => now(),
            ]);

            // Release vehicle
            $transaction->vehicle->update(['status' => 'active']);

            // Notify parties
            self::notifyRefundProcessed($transaction, $reason);

            DB::commit();
            Log::info('Refund processed', ['transaction_id' => $transaction->id, 'reason' => $reason]);
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Refund processing failed', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Calculate and distribute commissions
     */
    public static function distributeCommissions(Transaction $transaction): array
    {
        $distributions = [];

        // AutoScout24 Service Fee (2.5%)
        $serviceFee = $transaction->amount * 0.025;
        if ($serviceFee < 25) $serviceFee = 25; // Minimum €25

        $distributions['service_fee'] = [
            'amount' => $serviceFee,
            'recipient' => 'AutoScout24',
            'percentage' => 2.5,
        ];

        // Dealer Commission (3% if dealer involved)
        if ($transaction->dealer_id) {
            $dealerCommission = $transaction->amount * 0.03;
            $distributions['dealer_commission'] = [
                'amount' => $dealerCommission,
                'recipient' => $transaction->dealer->company_name,
                'percentage' => 3.0,
            ];
        } else {
            $dealerCommission = 0;
        }

        // Seller receives net amount
        $sellerAmount = $transaction->amount - $serviceFee - $dealerCommission;
        $distributions['seller_payout'] = [
            'amount' => $sellerAmount,
            'recipient' => $transaction->seller->name,
            'account' => self::getSellerBankAccount($transaction->seller_id),
        ];

        return $distributions;
    }

    private static function getSellerBankAccount(int $sellerId): ?array
    {
        $account = BankAccount::where('accountable_type', 'App\\Models\\User')
            ->where('accountable_id', $sellerId)
            ->where('is_primary', true)
            ->where('is_verified', true)
            ->first();

        if (!$account) {
            return null;
        }

        return [
            'iban_masked' => IbanValidationService::mask(decrypt($account->getAttributes()['iban'])),
            'bank_name' => $account->bank_name,
            'holder' => $account->account_holder_name,
        ];
    }

    /**
     * Schedule automatic payment reminders
     */
    public static function sendPaymentReminders(): array
    {
        $reminders = [];

        // Remind buyers who haven't paid within 48 hours
        $pending = Transaction::where('status', 'awaiting_payment')
            ->where('created_at', '<=', now()->subHours(48))
            ->where('created_at', '>=', now()->subDays(7))
            ->get();

        foreach ($pending as $transaction) {
            $transaction->buyer->notify(new PaymentStatusNotification(
                'payment_reminder',
                "Reminder: Payment pending for {$transaction->vehicle->make} {$transaction->vehicle->model}. Reference: {$transaction->payment_reference}",
                $transaction
            ));

            $reminders[] = [
                'transaction_id' => $transaction->id,
                'reminder_type' => 'payment_pending',
            ];
        }

        // Remind admin for unverified payments
        $submitted = Transaction::where('status', 'payment_submitted')
            ->where('updated_at', '<=', now()->subHours(24))
            ->get();

        foreach ($submitted as $transaction) {
            // TODO: Notify admin panel
            $reminders[] = [
                'transaction_id' => $transaction->id,
                'reminder_type' => 'admin_verification_needed',
            ];
        }

        return $reminders;
    }

    private static function notifyFundsReleased(Transaction $transaction): void
    {
        $transaction->seller->notify(new PaymentStatusNotification(
            'funds_released',
            "Funds released: €{$transaction->amount} for {$transaction->vehicle->make} {$transaction->vehicle->model}",
            $transaction
        ));

        $transaction->buyer->notify(new PaymentStatusNotification(
            'transaction_completed',
            "Transaction completed: {$transaction->vehicle->make} {$transaction->vehicle->model}",
            $transaction
        ));
    }

    private static function notifyRefundProcessed(Transaction $transaction, string $reason): void
    {
        $transaction->buyer->notify(new PaymentStatusNotification(
            'refund_processed',
            "Refund processed: €{$transaction->amount}. Reason: {$reason}",
            $transaction
        ));
    }
}
