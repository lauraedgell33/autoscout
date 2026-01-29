<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderCompleted extends Mailable
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
            subject: 'Comanda finalizată - Mulțumim pentru achiziție!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-completed',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'dealerName' => $this->transaction->dealer->name,
                'reviewUrl' => url("/reviews/create/{$this->transaction->dealer_id}"),
            ],
        );
    }
}
