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
            ->view('emails.kyc.approved', [
                'user' => $notifiable
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'kyc_approved',
            'message' => 'Your KYC verification has been approved. You can now make purchases.',
        ];
    }
}
