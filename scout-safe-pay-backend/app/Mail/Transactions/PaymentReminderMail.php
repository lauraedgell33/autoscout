<?php

namespace App\Mail\Transactions;

use App\Mail\LocalizedMailable;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PaymentReminderMail extends LocalizedMailable
{
    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public Transaction $transaction,
        public string $deadline = '48 hours'
    ) {
        // Set locale from user preference
        $this->locale = $user->preferred_language ?? $user->locale ?? 'en';
    }

    /**
     * Build the email content.
     */
    protected function buildContent()
    {
        return $this->view('emails.transactions.payment-reminder')
            ->with($this->getLocalizedViewData([
                'user' => $this->user,
                'vehicle' => $this->transaction->vehicle,
                'transaction' => $this->transaction,
                'deadline' => $this->deadline,
            ]))
            ->subject(__('emails.payment_reminder.title'));
    }
}
