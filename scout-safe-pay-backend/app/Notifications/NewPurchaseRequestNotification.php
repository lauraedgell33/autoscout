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
            ->view('emails.transactions.new-purchase-request', [
                'transaction' => $this->transaction,
                'vehicle' => $vehicle,
                'buyer' => $buyer,
                'seller' => $notifiable,
            ]);
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
