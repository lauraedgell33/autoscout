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
        
        if ($isSeller) {
            return (new MailMessage)
                ->subject('Payment Released - ' . $this->transaction->reference_number)
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('🎉 **Congratulations! Payment Released**')
                ->line('The buyer has confirmed acceptance and funds have been released from escrow.')
                ->line('**Transaction:** ' . $this->transaction->reference_number)
                ->line('**Amount:** €' . number_format($this->amount, 2))
                ->line('**Vehicle:** ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model)
                ->line('')
                ->line('The funds will be transferred to your registered bank account within 2-3 business days.')
                ->line('**Bank Transfer Details:**')
                ->line('- Account: ' . substr($notifiable->bank_account ?? 'On file', -4))
                ->line('- Reference: ' . $this->transaction->reference_number)
                ->action('View Transaction', url('/dashboard/transactions/' . $this->transaction->id))
                ->line('Thank you for selling with AutoScout24 SafeTrade!');
        } else {
            return (new MailMessage)
                ->subject('Transaction Completed - ' . $this->transaction->reference_number)
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('✅ **Transaction Completed Successfully**')
                ->line('Thank you for confirming the vehicle. The payment has been released to the seller.')
                ->line('**Transaction:** ' . $this->transaction->reference_number)
                ->line('**Amount:** €' . number_format($this->amount, 2))
                ->line('**Vehicle:** ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model)
                ->action('View Transaction', url('/dashboard/transactions/' . $this->transaction->id))
                ->line('We hope you enjoy your new vehicle!')
                ->line('Thank you for buying with AutoScout24 SafeTrade!');
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
