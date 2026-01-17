<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Notifications\TransactionCreatedNotification;

class TransactionObserver
{
    public function created(Transaction $transaction): void
    {
        // Send notification to buyer and seller
        if ($transaction->buyer) {
            $transaction->buyer->notify(new TransactionCreatedNotification($transaction));
        }
        
        if ($transaction->seller) {
            $transaction->seller->notify(new TransactionCreatedNotification($transaction));
        }
        
        // Notify admin users for high-value or flagged transactions
        $this->notifyAdminsIfNeeded($transaction);
    }

    public function updated(Transaction $transaction): void
    {
        // Check if status changed
        if ($transaction->wasChanged('status')) {
            $oldStatus = $transaction->getOriginal('status');
            $newStatus = $transaction->status;
            
            // Notify buyer and seller of status change
            if ($transaction->buyer) {
                $transaction->buyer->notify(
                    new \App\Notifications\TransactionStatusChanged($transaction, $oldStatus, $newStatus)
                );
            }
            
            if ($transaction->seller) {
                $transaction->seller->notify(
                    new \App\Notifications\TransactionStatusChanged($transaction, $oldStatus, $newStatus)
                );
            }
            
            // Notify admins for critical status changes
            $this->notifyAdminsForStatusChange($transaction, $oldStatus, $newStatus);
        }
    }
    
    private function notifyAdminsIfNeeded(Transaction $transaction): void
    {
        $shouldNotify = false;
        $reason = [];
        
        // High-value transaction (> €50,000)
        if ($transaction->total_amount > 50000) {
            $shouldNotify = true;
            $reason[] = 'high_value';
        }
        
        // High fraud risk score
        if (isset($transaction->fraud_score) && $transaction->fraud_score > 70) {
            $shouldNotify = true;
            $reason[] = 'high_fraud_risk';
        }
        
        // Cross-border transaction
        $buyerCountry = $transaction->buyer->country ?? 'DE';
        $sellerCountry = $transaction->seller->country ?? 'DE';
        if ($buyerCountry !== $sellerCountry) {
            $shouldNotify = true;
            $reason[] = 'cross_border';
        }
        
        if ($shouldNotify) {
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(
                    new \App\Notifications\AdminTransactionAlert($transaction, $reason)
                );
            }
            
            \Log::info('Admin notified for transaction', [
                'transaction_id' => $transaction->id,
                'reasons' => $reason,
            ]);
        }
    }
    
    private function notifyAdminsForStatusChange(Transaction $transaction, string $oldStatus, string $newStatus): void
    {
        // Critical status changes that require admin attention
        $criticalStatuses = [
            'disputed',
            'cancelled',
            'refund_requested',
            'payment_failed',
        ];
        
        if (in_array($newStatus, $criticalStatuses)) {
            $admins = \App\Models\User::where('user_type', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(
                    new \App\Notifications\TransactionRequiresAttention($transaction, $oldStatus, $newStatus)
                );
            }
        }
    }
}
