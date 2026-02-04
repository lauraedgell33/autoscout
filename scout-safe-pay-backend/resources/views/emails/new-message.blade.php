@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.new_message.title') }}</h2>
<p class="email-subtitle">{{ __('emails.new_message.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $recipientName]) }}</p>
    
    <p>{{ __('emails.new_message.intro', ['sender' => $senderName]) }}</p>
    
    <div class="card" style="border-left: 4px solid #003281;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style="width: 40px; height: 40px; background: #003281; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 12px;">
                <span style="color: white; font-weight: 700; font-size: 16px;">{{ substr($senderName, 0, 1) }}</span>
            </div>
            <div>
                <p style="margin: 0; color: #111827; font-weight: 700; font-size: 14px;">{{ $senderName }}</p>
                <p style="margin: 0; color: #6B7280; font-size: 12px;">{{ $messageDate ?? now()->format('d.m.Y H:i') }}</p>
            </div>
        </div>
        <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin-top: 8px;">
            <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">{{ $messageContent }}</p>
        </div>
    </div>
    
    @if(isset($vehicleTitle) && $vehicleTitle)
    <div class="card" style="background: #F8FAFC;">
        <p style="margin: 0; color: #6B7280; font-size: 12px; margin-bottom: 4px;">{{ __('emails.new_message.regarding') }}:</p>
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px;">{{ $vehicleTitle }}</p>
        @if(isset($orderNumber) && $orderNumber)
        <p style="margin: 4px 0 0 0; color: #6B7280; font-size: 12px;">{{ __('emails.common.order_number') }}: {{ $orderNumber }}</p>
        @endif
    </div>
    @endif
    
    <div style="text-align: center; margin-top: 24px;">
        <a href="{{ $replyUrl ?? '#' }}" class="button">{{ __('emails.new_message.reply_button') }}</a>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 13px; text-align: center;">
        {{ __('emails.new_message.quick_reply_note') }}
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
