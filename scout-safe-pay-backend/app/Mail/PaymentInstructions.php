<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentInstructions extends Mailable
{
    use Queueable, SerializesModels;

    public Transaction $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction->load(['buyer', 'vehicle']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Instrucțiuni de plată - ' . $this->transaction->payment_reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-instructions',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'iban' => $this->transaction->bank_account_iban,
                'holder' => $this->transaction->bank_account_holder,
                'bank' => $this->transaction->bank_name,
                'amount' => number_format($this->transaction->amount, 2),
                'currency' => $this->transaction->currency,
                'reference' => $this->transaction->payment_reference,
                'deadline' => $this->transaction->payment_deadline->format('d.m.Y H:i'),
                'daysRemaining' => now()->diffInDays($this->transaction->payment_deadline, false),
            ],
        );
    }
}
