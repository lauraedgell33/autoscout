<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceivedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $vehicle = $this->transaction->vehicle;
        
        return (new MailMessage)
            ->subject('Payment Received - Transaction #' . $this->transaction->id)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your payment has been verified and received.')
            ->line('**Vehicle:** ' . $vehicle->make . ' ' . $vehicle->model)
            ->line('**Amount Paid:** €' . number_format($this->transaction->amount, 2))
            ->line('The seller will contact you soon to arrange delivery.')
            ->action('View Transaction', url('/transaction/' . $this->transaction->id))
            ->line('You can download your invoice and contract from the transaction page.')
            ->line('Thank you for choosing AutoScout24 SafeTrade!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'payment_received',
            'transaction_id' => $this->transaction->id,
            'message' => 'Payment verified for transaction #' . $this->transaction->id,
            'amount' => $this->transaction->amount,
        ];
    }
}

