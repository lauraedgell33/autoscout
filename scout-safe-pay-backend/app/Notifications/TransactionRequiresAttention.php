<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionRequiresAttention extends Notification implements ShouldQueue
{
    use Queueable;

    protected Transaction $transaction;
    protected string $oldStatus;
    protected string $newStatus;

    public function __construct(Transaction $transaction, string $oldStatus, string $newStatus)
    {
        $this->transaction = $transaction;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('⚠️ Transaction Requires Immediate Attention')
            ->line('A transaction requires admin intervention.')
            ->line('**Transaction ID:** ' . $this->transaction->reference_number)
            ->line('**Status Changed:** ' . ucwords(str_replace('_', ' ', $this->oldStatus)) . ' → ' . ucwords(str_replace('_', ' ', $this->newStatus)))
            ->line('**Buyer:** ' . $this->transaction->buyer->name)
            ->line('**Seller:** ' . $this->transaction->seller->name)
            ->line('**Amount:** €' . number_format($this->transaction->total_amount, 2))
            ->action('Review Transaction', url('/admin/transactions/' . $this->transaction->id))
            ->line('Please take action as soon as possible.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'transaction_requires_attention',
            'transaction_id' => $this->transaction->id,
            'reference_number' => $this->transaction->reference_number,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'amount' => $this->transaction->total_amount,
        ];
    }
}
