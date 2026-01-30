<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Payment $payment,
        public string $type,
        public ?string $message = null
    ) {}

    public function envelope(): Envelope
    {
        $typeLabel = match($this->type) {
            'received' => 'Payment Received',
            'verified' => 'Payment Verified',
            'failed' => 'Payment Failed',
            'refunded' => 'Payment Refunded',
            default => ucfirst(str_replace('_', ' ', $this->type)),
        };

        return new Envelope(
            subject: "Payment Update: {$typeLabel}",
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-status',
            with: [
                'payment' => $this->payment,
                'type' => $this->type,
                'typeLabel' => $this->getTypeLabel(),
                'message' => $this->message,
                'amount' => $this->payment->amount,
                'currency' => $this->payment->currency ?? 'EUR',
                'actionUrl' => $this->getActionUrl(),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }

    private function getTypeLabel(): string
    {
        return match($this->type) {
            'received' => 'Payment Received',
            'verified' => 'Payment Verified',
            'failed' => 'Payment Failed',
            'refunded' => 'Payment Refunded',
            default => ucfirst(str_replace('_', ' ', $this->type)),
        };
    }

    private function getActionUrl(): string
    {
        return config('app.frontend_url') . "/en/transactions/{$this->payment->transaction_id}";
    }
}
