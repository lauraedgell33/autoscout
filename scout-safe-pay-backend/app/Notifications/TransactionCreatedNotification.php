<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Transaction $transaction
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $vehicle = $this->transaction->vehicle;
        
        return (new MailMessage)
            ->subject('Purchase Confirmed - Transaction #' . $this->transaction->id)
            ->view('emails.transactions.transaction-created', [
                'transaction' => $this->transaction,
                'vehicle' => $vehicle,
                'user' => $notifiable,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'transaction_code' => $this->transaction->transaction_code,
            'amount' => $this->transaction->amount,
            'buyer_name' => $this->transaction->buyer->name,
            'seller_name' => $this->transaction->seller->name,
            'message' => 'New transaction ' . $this->transaction->transaction_code . ' created',
        ];
    }
}
