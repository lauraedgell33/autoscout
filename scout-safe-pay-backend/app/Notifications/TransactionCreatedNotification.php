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
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your purchase request has been confirmed.')
            ->line('**Vehicle:** ' . $vehicle->make . ' ' . $vehicle->model)
            ->line('**Amount:** €' . number_format($this->transaction->amount, 2))
            ->line('**Status:** ' . ucfirst($this->transaction->status))
            ->line('Please generate and download your invoice from the transaction page.')
            ->action('View Transaction', url('/transaction/' . $this->transaction->id))
            ->line('After making the payment, upload your payment proof for verification.')
            ->line('Thank you for using AutoScout24 SafeTrade!');
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
