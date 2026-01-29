<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReadyForDelivery extends Mailable
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
            subject: 'Vehiculul dumneavoastră este pregătit pentru livrare - ' . $this->transaction->payment_reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ready-for-delivery',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'deliveryDate' => $this->transaction->delivery_date?->format('d.m.Y'),
                'deliveryAddress' => $this->transaction->delivery_address,
                'deliveryContact' => $this->transaction->delivery_contact,
                'dealerName' => $this->transaction->dealer->name,
                'dealerPhone' => $this->transaction->dealer->phone,
                'dealerAddress' => $this->transaction->dealer->address . ', ' . $this->transaction->dealer->city,
            ],
        );
    }
}
