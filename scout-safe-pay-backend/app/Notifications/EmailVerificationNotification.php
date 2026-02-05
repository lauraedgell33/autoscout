<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class EmailVerificationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The verification token.
     */
    protected string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url', 'https://www.autoscout24safetrade.com');
        $verificationUrl = $frontendUrl . '/verify-email?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject(__('Verify Your Email Address - AutoScout24 SafeTrade'))
            ->greeting(__('Hello :name!', ['name' => $notifiable->name]))
            ->line(__('Thank you for registering with AutoScout24 SafeTrade. Please click the button below to verify your email address.'))
            ->action(__('Verify Email Address'), $verificationUrl)
            ->line(__('This verification link will expire in 24 hours.'))
            ->line(__('If you did not create an account, no further action is required.'))
            ->salutation(__('Best regards, AutoScout24 SafeTrade Team'));
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'email_verification',
            'message' => 'Please verify your email address',
        ];
    }
}
