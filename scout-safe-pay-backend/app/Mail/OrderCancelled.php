<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class OrderCancelled extends Mailable
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
            subject: __('emails.order_cancelled.subject'),
        );
    }

    public function content(): Content
    {
        App::setLocale($this->locale);
        
        return new Content(
            view: 'emails.order-cancelled',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'vehicleYear' => $this->transaction->vehicle->year,
                'transactionCode' => $this->transaction->transaction_code,
                'cancellationReason' => $this->transaction->cancellation_reason,
                'cancelledAt' => $this->transaction->cancelled_at?->format('d.m.Y H:i'),
                'supportUrl' => config('app.frontend_url') . '/support',
                'searchUrl' => config('app.frontend_url') . '/vehicles/search',
                'locale' => $this->locale,
            ],
        );
    }
}
