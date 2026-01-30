<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Transaction $transaction,
        public string $status,
        public ?string $message = null
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = match($this->status) {
            'payment_received' => 'Payment Received',
            'payment_verified' => 'Payment Verified',
            'funds_released' => 'Funds Released',
            'delivery_confirmed' => 'Delivery Confirmed',
            'completed' => 'Transaction Completed',
            'cancelled' => 'Transaction Cancelled',
            'disputed' => 'Transaction Disputed',
            default => ucfirst(str_replace('_', ' ', $this->status)),
        };

        return new Envelope(
            subject: "Transaction Update: {$statusLabel}",
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.transaction-status',
            with: [
                'transaction' => $this->transaction,
                'status' => $this->status,
                'statusLabel' => $this->getStatusLabel(),
                'message' => $this->message,
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
            'payment_received' => 'Payment Received',
            'payment_verified' => 'Payment Verified',
            'funds_released' => 'Funds Released',
            'delivery_confirmed' => 'Delivery Confirmed',
            'completed' => 'Transaction Completed',
            'cancelled' => 'Transaction Cancelled',
            'disputed' => 'Transaction Disputed',
            default => ucfirst(str_replace('_', ' ', $this->status)),
        };
    }

    private function getActionUrl(): string
    {
        return config('app.frontend_url') . "/en/transactions/{$this->transaction->id}";
    }
}
