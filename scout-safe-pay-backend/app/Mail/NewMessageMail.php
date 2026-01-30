<?php

namespace App\Mail;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewMessageMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Message $message,
        public string $recipientName
    ) {}

    public function envelope(): Envelope
    {
        $senderName = $this->message->sender->name ?? 'Someone';
        
        return new Envelope(
            subject: "New Message from {$senderName}",
            from: config('mail.from.address'),
        );
    }

    public function content(): Content
    {
        $messagePreview = substr($this->message->content, 0, 100);
        if (strlen($this->message->content) > 100) {
            $messagePreview .= '...';
        }

        return new Content(
            view: 'emails.new-message',
            with: [
                'message' => $this->message,
                'senderName' => $this->message->sender->name ?? 'User',
                'messagePreview' => $messagePreview,
                'recipientName' => $this->recipientName,
                'actionUrl' => $this->getActionUrl(),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }

    private function getActionUrl(): string
    {
        return config('app.frontend_url') . "/en/messages/{$this->message->transaction_id}";
    }
}
