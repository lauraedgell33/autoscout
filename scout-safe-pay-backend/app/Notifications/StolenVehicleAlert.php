<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StolenVehicleAlert extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $vin;
    protected string $source;

    public function __construct(string $vin, string $source)
    {
        $this->vin = $vin;
        $this->source = $source;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🚨 CRITICAL: Stolen Vehicle Detected')
            ->line('A stolen vehicle has been detected in the system!')
            ->line('**VIN:** ' . $this->vin)
            ->line('**Source:** ' . ucwords($this->source))
            ->line('**Detection Time:** ' . now()->toDateTimeString())
            ->line('The transaction has been automatically blocked.')
            ->action('View Details', url('/admin/security/alerts'))
            ->line('⚠️ This alert has been logged and may be reported to authorities.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'stolen_vehicle_alert',
            'vin' => $this->vin,
            'source' => $this->source,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
