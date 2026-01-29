<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public Transaction $transaction;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction->load(['buyer', 'vehicle', 'dealer']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Plata confirmată - Factură atașată - ' . $this->transaction->payment_reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-confirmed',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'amount' => number_format($this->transaction->amount, 2),
                'currency' => $this->transaction->currency,
                'invoiceNumber' => $this->transaction->invoice_number,
                'invoiceUrl' => url($this->transaction->invoice_url),
                'dealerName' => $this->transaction->dealer->name,
                'dealerPhone' => $this->transaction->dealer->phone,
            ],
        );
    }
}
