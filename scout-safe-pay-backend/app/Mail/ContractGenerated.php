<?php

namespace App\Mail;

use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class ContractGenerated extends Mailable
{
    use Queueable, SerializesModels;

    public Transaction $transaction;

    /**
     * Create a new message instance.
     */
    public function __construct(Transaction $transaction)
    {
        $this->transaction = $transaction->load(['buyer', 'vehicle', 'dealer']);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Contractul dumneavoastră de achiziție - ' . $this->transaction->payment_reference,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contract-generated',
            with: [
                'buyerName' => $this->transaction->buyer->name,
                'vehicleTitle' => $this->transaction->vehicle->make . ' ' . $this->transaction->vehicle->model,
                'vehicleYear' => $this->transaction->vehicle->year,
                'amount' => number_format($this->transaction->amount, 2),
                'currency' => $this->transaction->currency,
                'reference' => $this->transaction->payment_reference,
                'contractUrl' => url($this->transaction->contract_url),
                'dealerName' => $this->transaction->dealer->name,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
