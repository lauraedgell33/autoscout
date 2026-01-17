<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransactionStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Transaction $transaction,
        public string $oldStatus,
        public string $newStatus
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusMessages = [
            'pending' => 'Your transaction is pending payment',
            'payment_pending' => 'Waiting for bank transfer confirmation',
            'payment_confirmed' => 'Payment confirmed! Funds are in escrow',
            'in_transit' => 'Vehicle is being delivered',
            'inspection_period' => 'Inspection period started',
            'completed' => 'Transaction completed successfully',
            'refunded' => 'Transaction refunded',
            'cancelled' => 'Transaction cancelled',
            'disputed' => 'Transaction is under dispute review'
        ];

        $message = (new MailMessage)
            ->subject('Transaction Status Updated - ' . $this->transaction->reference_number)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your transaction status has been updated.')
            ->line('**Transaction:** ' . $this->transaction->reference_number)
            ->line('**Vehicle:** ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model)
            ->line('**Previous Status:** ' . ucfirst(str_replace('_', ' ', $this->oldStatus)))
            ->line('**New Status:** ' . ucfirst(str_replace('_', ' ', $this->newStatus)))
            ->line($statusMessages[$this->newStatus] ?? '');

        if ($this->newStatus === 'payment_pending') {
            $message->action('View Payment Instructions', url('/dashboard/transactions/' . $this->transaction->id));
        } elseif ($this->newStatus === 'inspection_period') {
            $message->action('Start Inspection', url('/dashboard/transactions/' . $this->transaction->id . '/inspect'));
        } else {
            $message->action('View Transaction', url('/dashboard/transactions/' . $this->transaction->id));
        }

        return $message->line('Thank you for using AutoScout24 SafeTrade!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'reference_number' => $this->transaction->reference_number,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'vehicle_id' => $this->transaction->vehicle_id,
            'vehicle_name' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
            'amount' => $this->transaction->price,
            'message' => 'Transaction status changed from ' . $this->oldStatus . ' to ' . $this->newStatus,
            'url' => '/dashboard/transactions/' . $this->transaction->id
        ];
    }
}
