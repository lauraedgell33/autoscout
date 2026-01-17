<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewPurchaseRequestNotification extends Notification implements ShouldQueue
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
        $buyer = $this->transaction->buyer;
        
        return (new MailMessage)
            ->subject('New Purchase Request - Transaction #' . $this->transaction->id)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have received a new purchase request for your vehicle.')
            ->line('**Vehicle:** ' . $vehicle->make . ' ' . $vehicle->model)
            ->line('**Buyer:** ' . $buyer->name)
            ->line('**Amount:** €' . number_format($this->transaction->amount, 2))
            ->line('The buyer will complete the payment process. You will be notified once payment is verified.')
            ->action('View Transaction', url('/admin'))
            ->line('Please prepare the vehicle for delivery once payment is confirmed.')
            ->line('Thank you for using AutoScout24 SafeTrade!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_purchase_request',
            'transaction_id' => $this->transaction->id,
            'message' => 'New purchase request for ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
            'buyer_name' => $this->transaction->buyer->name,
            'amount' => $this->transaction->amount,
        ];
    }
}
