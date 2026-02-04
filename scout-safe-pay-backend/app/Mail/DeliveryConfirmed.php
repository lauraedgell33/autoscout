<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class DeliveryConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public Transaction $transaction;
    public string $locale;

    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction->load(['buyer', 'vehicle', 'dealer']);
        $this->locale = $transaction->buyer->preferred_language ?? 'en';
    }

    public function envelope(): Envelope
    {
        App::setLocale($this->locale);
        
        return new Envelope(
            subject: __('emails.delivery_confirmed.subject'),
        );
    }

    public function content(): Content
    {
        App::setLocale($this->locale);
        
        return new Content(
            view: 'emails.delivery-confirmed',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'vehicleYear' => $this->transaction->vehicle->year,
                'vin' => $this->transaction->vehicle->vin,
                'transactionCode' => $this->transaction->transaction_code,
                'deliveredAt' => $this->transaction->delivered_at?->format('d.m.Y H:i'),
                'dealerName' => $this->transaction->dealer?->company_name ?? $this->transaction->dealer?->name,
                'reviewUrl' => config('app.frontend_url') . '/reviews/create/' . $this->transaction->dealer_id,
                'documentsUrl' => config('app.frontend_url') . '/transactions/' . $this->transaction->id . '/documents',
                'supportUrl' => config('app.frontend_url') . '/support',
                'locale' => $this->locale,
            ],
        );
    }
}
