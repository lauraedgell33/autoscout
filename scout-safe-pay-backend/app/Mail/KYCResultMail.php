<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KYCResultMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public string $status,
        public ?string $rejectionReason = null
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = match($this->status) {
            'verified' => 'KYC Verification Approved',
            'rejected' => 'KYC Verification Rejected',
            'pending' => 'KYC Verification Pending',
            default => 'KYC Verification Update',
        };

        return new Envelope(
            subject: $statusLabel,
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.kyc-result',
            with: [
                'user' => $this->user,
                'status' => $this->status,
                'statusLabel' => $this->getStatusLabel(),
                'rejectionReason' => $this->rejectionReason,
                'isApproved' => $this->status === 'verified',
                'isRejected' => $this->status === 'rejected',
                'actionUrl' => $this->getActionUrl(),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }

    private function getStatusLabel(): string
    {
        return match($this->status) {
            'verified' => 'KYC Verification Approved',
            'rejected' => 'KYC Verification Rejected',
            'pending' => 'KYC Verification Pending',
            default => 'KYC Verification Update',
        };
    }

    private function getActionUrl(): string
    {
        if ($this->status === 'rejected') {
            return config('app.frontend_url') . '/en/kyc';
        }
        return config('app.frontend_url') . '/en/dashboard';
    }
}
