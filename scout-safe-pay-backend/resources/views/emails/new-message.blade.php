@component('mail::message')
# New Message Notification

Hello {{ $recipientName }},

You have received a new message from **{{ $senderName }}** on {{ config('app.name') }}.

## Message Preview

> {{ $messagePreview }}

## View Full Message

Click the button below to view the complete message and reply:

@component('mail::button', ['url' => $actionUrl])
View Message
@endcomponent

## Quick Info

- **From:** {{ $senderName }}
- **Received:** {{ $message->created_at->format('M d, Y \a\t H:i') }}
- **Transaction:** {{ $message->transaction->reference_number }}

You can reply to this message directly from your {{ config('app.name') }} account or through this link.

Best regards,  
{{ config('app.name') }} Team

---

*You're receiving this email because you have message notifications enabled. To manage your notification preferences, visit your account settings.*
@endcomponent
