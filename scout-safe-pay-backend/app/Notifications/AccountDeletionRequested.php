<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountDeletionRequested extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Account Deletion Requested')
            ->line('We have received your request to delete your Scout Safe Pay account.')
            ->line('**Grace Period:** 30 days')
            ->line('**Scheduled Deletion:** ' . $notifiable->deletion_scheduled_at->format('F j, Y'))
            ->line('During this grace period, you can still cancel the deletion request by logging in to your account.')
            ->action('Cancel Deletion', url('/dashboard/settings'))
            ->line('After the grace period expires, your account and all associated data will be permanently deleted.')
            ->line('Thank you for using Scout Safe Pay.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'account_deletion_requested',
            'scheduled_at' => $notifiable->deletion_scheduled_at->toIso8601String(),
            'grace_period_days' => 30,
        ];
    }
}
