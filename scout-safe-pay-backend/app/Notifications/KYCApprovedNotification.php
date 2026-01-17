<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KYCApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct()
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KYC Verification Approved - AutoScout24 SafeTrade')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! Your identity verification has been approved.')
            ->line('You can now proceed with purchasing vehicles on AutoScout24 SafeTrade.')
            ->action('Browse Vehicles', url('/marketplace'))
            ->line('Thank you for using AutoScout24 SafeTrade!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'kyc_approved',
            'message' => 'Your KYC verification has been approved. You can now make purchases.',
        ];
    }
}
