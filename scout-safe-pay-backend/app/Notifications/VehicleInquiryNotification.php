<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VehicleInquiryNotification extends Notification
{
    use Queueable;

    protected array $inquiryData;

    public function __construct(array $inquiryData)
    {
        $this->inquiryData = $inquiryData;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $requestTypeLabels = [
            'inquiry' => 'General Inquiry',
            'test-drive' => 'Test Drive Request',
            'offer' => 'Purchase Offer',
            'inspection' => 'Inspection Request',
        ];

        $requestType = $requestTypeLabels[$this->inquiryData['request_type']] ?? 'Inquiry';

        return (new MailMessage)
            ->subject("New {$requestType} - {$this->inquiryData['vehicle_title']}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("You have received a new inquiry about your vehicle:")
            ->line("**Vehicle:** {$this->inquiryData['vehicle_title']}")
            ->line("**Type:** {$requestType}")
            ->line("**From:** {$this->inquiryData['from_name']}")
            ->line("**Email:** {$this->inquiryData['from_email']}")
            ->line("**Phone:** {$this->inquiryData['from_phone']}")
            ->line("**Message:**")
            ->line($this->inquiryData['message'])
            ->action('View Vehicle', url("/admin/vehicles/{$this->inquiryData['vehicle_id']}"))
            ->line('Please respond to the customer as soon as possible.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'vehicle_inquiry',
            'vehicle_id' => $this->inquiryData['vehicle_id'],
            'vehicle_title' => $this->inquiryData['vehicle_title'],
            'from_name' => $this->inquiryData['from_name'],
            'from_email' => $this->inquiryData['from_email'],
            'from_phone' => $this->inquiryData['from_phone'],
            'message' => $this->inquiryData['message'],
            'request_type' => $this->inquiryData['request_type'],
        ];
    }
}
