<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminTransactionAlert extends Notification implements ShouldQueue
{
    use Queueable;

    protected Transaction $transaction;
    protected array $reasons;

    public function __construct(Transaction $transaction, array $reasons)
    {
        $this->transaction = $transaction;
        $this->reasons = $reasons;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $reasonsText = implode(', ', array_map(function ($reason) {
            return ucwords(str_replace('_', ' ', $reason));
        }, $this->reasons));

        return (new MailMessage)
            ->subject('🚨 Transaction Requires Attention: ' . $this->transaction->reference_number)
            ->line('A new transaction has been flagged for admin review.')
            ->line('**Transaction ID:** ' . $this->transaction->reference_number)
            ->line('**Amount:** €' . number_format($this->transaction->total_amount, 2))
            ->line('**Reasons:** ' . $reasonsText)
            ->line('**Buyer:** ' . $this->transaction->buyer->name)
            ->line('**Seller:** ' . $this->transaction->seller->name)
            ->action('View Transaction', url('/admin/transactions/' . $this->transaction->id))
            ->line('Please review this transaction as soon as possible.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'admin_transaction_alert',
            'transaction_id' => $this->transaction->id,
            'reference_number' => $this->transaction->reference_number,
            'amount' => $this->transaction->total_amount,
            'reasons' => $this->reasons,
            'buyer_name' => $this->transaction->buyer->name,
            'seller_name' => $this->transaction->seller->name,
        ];
    }
}
