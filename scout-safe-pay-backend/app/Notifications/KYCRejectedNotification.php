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
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('We were unable to verify your identity documents at this time.')
            ->line('**Reason:** ' . $this->reason)
            ->line('Please resubmit your documents with the following in mind:')
            ->line('• Ensure all documents are clear and readable')
            ->line('• Make sure your face is clearly visible in the selfie')
            ->line('• Use valid, non-expired identification documents')
            ->action('Resubmit Documents', url('/dashboard'))
            ->line('If you have questions, please contact our support team.');
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
