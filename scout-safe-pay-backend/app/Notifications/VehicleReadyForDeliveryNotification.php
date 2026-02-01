<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VehicleReadyForDeliveryNotification extends Notification implements ShouldQueue
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
            ->subject('Vehicle Ready for Delivery - Transaction #' . $this->transaction->id)
            ->view('emails.transactions.ready-for-delivery', [
                'user' => $notifiable,
                'transaction' => $this->transaction,
                'vehicle' => $vehicle
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ready_for_delivery',
            'transaction_id' => $this->transaction->id,
            'message' => 'Your vehicle is ready for delivery',
            'vehicle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
        ];
    }
}
