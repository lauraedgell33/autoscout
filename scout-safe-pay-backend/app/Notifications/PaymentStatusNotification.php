<?php

namespace App\Notifications;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class PaymentStatusNotification extends Notification
{
    use Queueable;

    private string $type;
    private string $message;
    private Transaction $transaction;

    public function __construct(string $type, string $message, Transaction $transaction)
    {
        $this->type = $type;
        $this->message = $message;
        $this->transaction = $transaction;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $subject = $this->getEmailSubject();
        $greeting = "Hello {$notifiable->name},";

        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($this->message)
            ->line($this->getAdditionalInfo())
            ->action('View Transaction', url("/transactions/{$this->transaction->id}"))
            ->line('Thank you for using AutoScout24 SafePay!');
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => $this->type,
            'message' => $this->message,
            'transaction_id' => $this->transaction->id,
            'transaction_code' => $this->transaction->transaction_code,
            'amount' => $this->transaction->amount,
            'currency' => $this->transaction->currency,
            'timestamp' => now()->toIso8601String(),
        ];
    }

    private function getEmailSubject(): string
    {
        return match ($this->type) {
            'payment_reminder' => 'Payment Reminder - AutoScout24 SafePay',
            'payment_verified' => 'Payment Verified - AutoScout24 SafePay',
            'funds_released' => 'Funds Released - AutoScout24 SafePay',
            'refund_processed' => 'Refund Processed - AutoScout24 SafePay',
            'inspection_due' => 'Vehicle Inspection Due - AutoScout24 SafePay',
            'transaction_completed' => 'Transaction Completed - AutoScout24 SafePay',
            default => 'Transaction Update - AutoScout24 SafePay',
        };
    }

    private function getAdditionalInfo(): string
    {
        return sprintf(
            "Transaction Code: %s\nVehicle: %s %s\nAmount: €%s",
            $this->transaction->transaction_code,
            $this->transaction->vehicle->make ?? 'N/A',
            $this->transaction->vehicle->model ?? 'N/A',
            number_format($this->transaction->amount, 2)
        );
    }
}
