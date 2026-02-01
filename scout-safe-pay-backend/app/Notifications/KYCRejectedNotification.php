<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class KYCRejectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $reason;

    public function __construct(string $reason)
    {
        $this->reason = $reason;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('KYC Verification - Additional Information Required')
            ->view('emails.kyc.rejected', [
                'user' => $notifiable,
                'reason' => $this->reason
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'kyc_rejected',
            'message' => 'Your KYC verification was rejected. Please resubmit your documents.',
            'reason' => $this->reason,
        ];
    }
}
