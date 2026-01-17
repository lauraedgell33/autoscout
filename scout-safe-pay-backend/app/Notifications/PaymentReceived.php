<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceived extends Notification implements ShouldQueue
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
        $isBuyer = $notifiable->id === $this->transaction->buyer_id;
        
        if ($isBuyer) {
            return (new MailMessage)
                ->subject('Payment Received - ' . $this->transaction->reference_number)
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('✅ **Payment Confirmed!**')
                ->line('We have received your bank transfer and the funds are now safely held in escrow.')
                ->line('**Transaction:** ' . $this->transaction->reference_number)
                ->line('**Amount:** €' . number_format($this->amount, 2))
                ->line('**Vehicle:** ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model)
                ->line('')
                ->line('**Next Steps:**')
                ->line('1. The seller will arrange delivery or pickup')
                ->line('2. You will have ' . config('app.inspection_period_days', 3) . ' days to inspect the vehicle')
                ->line('3. If satisfied, confirm acceptance')
                ->line('4. If issues found, open a dispute within the inspection period')
                ->action('View Transaction', url('/dashboard/transactions/' . $this->transaction->id))
                ->line('Your money is protected until you confirm the vehicle is as described.')
                ->line('Thank you for using AutoScout24 SafeTrade!');
        } else {
            return (new MailMessage)
                ->subject('Buyer Payment Received - ' . $this->transaction->reference_number)
                ->greeting('Hello ' . $notifiable->name . '!')
                ->line('✅ **Great News! Payment Confirmed**')
                ->line('The buyer has completed the bank transfer and funds are in escrow.')
                ->line('**Transaction:** ' . $this->transaction->reference_number)
                ->line('**Amount:** €' . number_format($this->amount, 2))
                ->line('**Vehicle:** ' . $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model)
                ->line('')
                ->line('**Next Steps:**')
                ->line('1. Arrange delivery or pickup with the buyer')
                ->line('2. Buyer will have inspection period to verify the vehicle')
                ->line('3. Once buyer confirms, funds will be released to you')
                ->action('View Transaction', url('/dashboard/transactions/' . $this->transaction->id))
                ->line('Thank you for selling with AutoScout24 SafeTrade!');
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
            'message' => 'Payment of €' . number_format($this->amount, 2) . ' received and held in escrow',
            'type' => 'payment_received',
            'url' => '/dashboard/transactions/' . $this->transaction->id
        ];
    }
}
