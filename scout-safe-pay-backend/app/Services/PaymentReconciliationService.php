<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentReconciliationService
{
    /**
     * Reconcile pending payments with bank statements
     */
    public static function reconcilePendingPayments(): array
    {
        $reconciled = [];
        $pending = Payment::where('status', 'submitted')
            ->where('created_at', '>=', now()->subDays(30))
            ->with('transaction')
            ->get();

        foreach ($pending as $payment) {
            $result = self::attemptReconciliation($payment);
            if ($result['reconciled']) {
                $reconciled[] = $result;
            }
        }

        return [
            'total_checked' => $pending->count(),
            'reconciled_count' => count($reconciled),
            'reconciled_payments' => $reconciled,
        ];
    }

    private static function attemptReconciliation(Payment $payment): array
    {
        $transaction = $payment->transaction;
        $paymentReference = $transaction->payment_reference;
        
        // Real bank API integration
        $bankApiResult = self::checkBankStatement($payment);
        
        if ($bankApiResult['found']) {
            $payment->update([
                'status' => 'verified',
                'verified_at' => now(),
                'admin_notes' => 'Auto-verified via bank API',
                'bank_api_response' => $bankApiResult,
            ]);
            
            return [
                'reconciled' => true,
                'action' => 'verified',
                'payment_id' => $payment->id,
                'amount_confirmed' => $bankApiResult['amount'],
            ];
        }

        // Check for duplicate payment references
        $duplicates = Payment::where('bank_transfer_reference', $paymentReference)
            ->where('id', '!=', $payment->id)
            ->where('status', 'verified')
            ->count();

        if ($duplicates > 0) {
            Log::warning('Duplicate payment reference detected', [
                'payment_id' => $payment->id,
                'reference' => $paymentReference,
            ]);

            return [
                'reconciled' => false,
                'reason' => 'duplicate_reference',
                'payment_id' => $payment->id,
            ];
        }

        // Check payment age (auto-reject after 14 days)
        if ($payment->created_at->lt(now()->subDays(14))) {
            $payment->update([
                'status' => 'rejected',
                'admin_notes' => 'Auto-rejected: No bank confirmation received within 14 days',
            ]);

            return [
                'reconciled' => true,
                'action' => 'rejected',
                'payment_id' => $payment->id,
                'reason' => 'timeout',
            ];
        }

        return [
            'reconciled' => false,
            'reason' => 'pending_manual_review',
            'payment_id' => $payment->id,
        ];
    }    
    /**
     * Check bank statement via API
     * Integrate with: Banking Circle, Railsbank, or bank's direct API
     */
    private static function checkBankStatement(Payment $payment): array
    {
        $bankApiUrl = config('services.bank.api_url');
        $bankApiKey = config('services.bank.api_key');
        
        if (!$bankApiUrl || !$bankApiKey) {
            Log::warning('Bank API not configured, skipping automatic reconciliation');
            return ['found' => false, 'reason' => 'api_not_configured'];
        }
        
        try {
            // Example API call structure (adjust based on your bank provider)
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$bankApiKey}",
                'Content-Type' => 'application/json',
            ])->post($bankApiUrl . '/statements/search', [
                'account_iban' => $payment->transaction->escrow_account_iban,
                'reference' => $payment->transaction->payment_reference,
                'amount' => $payment->transaction->total_amount,
                'date_from' => $payment->created_at->subDays(7)->format('Y-m-d'),
                'date_to' => now()->format('Y-m-d'),
            ]);
            
            if ($response->successful() && $response->json('found')) {
                return [
                    'found' => true,
                    'amount' => $response->json('amount'),
                    'date' => $response->json('date'),
                    'sender_iban' => $response->json('sender_iban'),
                    'reference' => $response->json('reference'),
                ];
            }
            
            return ['found' => false, 'reason' => 'not_found_in_statements'];
            
        } catch (\Exception $e) {
            Log::error('Bank API error', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
            
            return ['found' => false, 'reason' => 'api_error', 'error' => $e->getMessage()];
        }
    }
    /**
     * Match bank statement entries to transactions
     */
    public static function matchBankStatementEntry(array $statementEntry): ?Payment
    {
        $reference = $statementEntry['reference'] ?? null;
        $amount = $statementEntry['amount'] ?? 0;
        $date = $statementEntry['date'] ?? now();

        if (!$reference) {
            return null;
        }

        // Find transaction by payment reference
        $transaction = Transaction::where('payment_reference', $reference)
            ->where('status', 'awaiting_payment')
            ->first();

        if (!$transaction) {
            Log::warning('No matching transaction for bank statement entry', [
                'reference' => $reference,
                'amount' => $amount,
            ]);
            return null;
        }

        // Verify amount matches
        if (abs($amount - $transaction->amount) > 0.01) {
            Log::warning('Amount mismatch in bank statement', [
                'transaction_id' => $transaction->id,
                'expected' => $transaction->amount,
                'received' => $amount,
            ]);
            return null;
        }

        // Create or update payment
        $payment = Payment::firstOrCreate(
            ['transaction_id' => $transaction->id, 'type' => 'deposit'],
            [
                'amount' => $amount,
                'currency' => $transaction->currency,
                'status' => 'verified',
                'bank_transfer_reference' => $reference,
                'payment_date' => Carbon::parse($date),
                'verified_at' => now(),
            ]
        );

        // Update transaction status
        $transaction->update([
            'status' => 'payment_verified',
            'payment_verified_at' => now(),
        ]);

        Log::info('Bank statement entry matched and verified', [
            'transaction_id' => $transaction->id,
            'payment_id' => $payment->id,
        ]);

        return $payment;
    }

    /**
     * Generate reconciliation report
     */
    public static function generateReconciliationReport(Carbon $startDate, Carbon $endDate): array
    {
        $transactions = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->with('payments')
            ->get();

        $summary = [
            'period' => [
                'start' => $startDate->toDateString(),
                'end' => $endDate->toDateString(),
            ],
            'total_transactions' => $transactions->count(),
            'verified_payments' => 0,
            'pending_payments' => 0,
            'rejected_payments' => 0,
            'total_amount_received' => 0,
            'total_amount_pending' => 0,
            'discrepancies' => [],
        ];

        foreach ($transactions as $transaction) {
            foreach ($transaction->payments as $payment) {
                if ($payment->status === 'verified') {
                    $summary['verified_payments']++;
                    $summary['total_amount_received'] += $payment->amount;
                } elseif ($payment->status === 'submitted') {
                    $summary['pending_payments']++;
                    $summary['total_amount_pending'] += $payment->amount;
                } elseif ($payment->status === 'rejected') {
                    $summary['rejected_payments']++;
                }

                // Check for discrepancies
                if ($payment->amount !== $transaction->amount) {
                    $summary['discrepancies'][] = [
                        'transaction_id' => $transaction->id,
                        'payment_id' => $payment->id,
                        'expected' => $transaction->amount,
                        'received' => $payment->amount,
                        'difference' => $payment->amount - $transaction->amount,
                    ];
                }
            }
        }

        return $summary;
    }

    /**
     * Detect suspicious payment patterns
     */
    public static function detectSuspiciousPatterns(): array
    {
        $suspicious = [];

        // Multiple payments from same account in short time
        $recentPayments = DB::table('payments')
            ->select('bank_transfer_reference', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subHours(6))
            ->groupBy('bank_transfer_reference')
            ->having('count', '>', 3)
            ->get();

        foreach ($recentPayments as $pattern) {
            $suspicious[] = [
                'type' => 'high_frequency',
                'reference' => $pattern->bank_transfer_reference,
                'count' => $pattern->count,
                'severity' => 'high',
            ];
        }

        // Payments with unusual amounts (round numbers)
        $roundAmounts = Payment::where('status', 'submitted')
            ->whereRaw('amount % 5000 = 0')
            ->where('amount', '>', 10000)
            ->get();

        foreach ($roundAmounts as $payment) {
            $suspicious[] = [
                'type' => 'round_amount',
                'payment_id' => $payment->id,
                'amount' => $payment->amount,
                'severity' => 'medium',
            ];
        }

        // Payments outside business hours
        $afterHoursPayments = Payment::where('status', 'submitted')
            ->whereTime('created_at', '>=', '22:00:00')
            ->orWhereTime('created_at', '<=', '06:00:00')
            ->get();

        foreach ($afterHoursPayments as $payment) {
            $suspicious[] = [
                'type' => 'after_hours',
                'payment_id' => $payment->id,
                'time' => $payment->created_at->format('H:i:s'),
                'severity' => 'low',
            ];
        }

        return $suspicious;
    }

    /**
     * Auto-release verified payments
     */
    public static function autoReleaseEligiblePayments(): array
    {
        $released = [];

        $eligible = Transaction::where('status', 'ownership_transferred')
            ->where('payment_verified_at', '<=', now()->subDays(3))
            ->with('payments')
            ->get();

        foreach ($eligible as $transaction) {
            if (self::canAutoRelease($transaction)) {
                DB::transaction(function () use ($transaction, &$released) {
                    $transaction->update(['status' => 'completed']);
                    $transaction->vehicle->update(['status' => 'sold']);

                    $released[] = [
                        'transaction_id' => $transaction->id,
                        'amount' => $transaction->amount,
                        'released_at' => now()->toIso8601String(),
                    ];

                    Log::info('Payment auto-released', ['transaction_id' => $transaction->id]);
                });
            }
        }

        return $released;
    }

    private static function canAutoRelease(Transaction $transaction): bool
    {
        // Check if all conditions met for auto-release
        return $transaction->status === 'ownership_transferred'
            && $transaction->payment_verified_at
            && $transaction->payment_verified_at->lt(now()->subDays(3))
            && !$transaction->disputes()->where('status', 'open')->exists();
    }
}
