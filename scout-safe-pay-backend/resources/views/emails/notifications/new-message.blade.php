@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">💬 New Message</h2>
<p class="email-subtitle">You have a new message from {{ $sender->name }}</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p><strong>{{ $sender->name }}</strong> sent you a message regarding <strong>{{ $subject }}</strong>:</p>
    
    <div style="background-color: #F9FAFB; border-left: 4px solid #003281; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1F2937; font-size: 15px; line-height: 1.6;">
            "{{ Str::limit($message->content, 200) }}"
        </p>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ config('app.url') }}/messages/{{ $message->id }}" class="button button-primary">
            💬 Reply to Message
        </a>
    </div>
    
    <p style="font-size: 13px; color: #9CA3AF; margin-top: 24px;">
        You can manage your notification preferences in your account settings.
    </p>
</div>
@endsection
