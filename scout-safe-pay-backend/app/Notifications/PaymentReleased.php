<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReleased extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Transaction $transaction,
        public float $amount
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $isSeller = $notifiable->id === $this->transaction->seller_id;
        $vehicle = $this->transaction->vehicle;
        
        if ($isSeller) {
            // For seller: payment released
            return (new MailMessage)
                ->subject('Payment Released - ' . $this->transaction->reference_number)
                ->view('emails.notifications.action-required', [
                    'user' => $notifiable,
                    'message' => 'Congratulations! The buyer has confirmed delivery and your payment has been released from escrow.',
                    'actionTitle' => 'Payment Released',
                    'actionDetails' => 'Amount: €' . number_format($this->amount, 2) . ' for ' . $vehicle->make . ' ' . $vehicle->model . '. Funds will be transferred to your bank account within 2-3 business days.',
                    'actionUrl' => config('app.frontend_url') . '/en/transaction/' . $this->transaction->id,
                    'actionButtonText' => 'View Transaction'
                ]);
        } else {
            // For buyer: order completed
            return (new MailMessage)
                ->subject('Transaction Completed - ' . $this->transaction->reference_number)
                ->view('emails.transactions.order-completed', [
                    'user' => $notifiable,
                    'transaction' => $this->transaction,
                    'vehicle' => $vehicle
                ]);
        }
    }

    public function toArray(object $notifiable): array
    {
        return [
            'transaction_id' => $this->transaction->id,
            'reference_number' => $this->transaction->reference_number,
            'amount' => $this->amount,
            'vehicle_id' => $this->transaction->vehicle_id,
            'vehicle_name' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
            'message' => 'Payment of €' . number_format($this->amount, 2) . ' released from escrow',
            'type' => 'payment_released',
            'url' => '/dashboard/transactions/' . $this->transaction->id
        ];
    }
}
