@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">⚠️ Action Required</h2>
<p class="email-subtitle">{{ $actionTitle }}</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>{{ $actionDescription }}</p>
    
    <div class="info-box" style="background-color: #FFFBEB; border-left-color: #F59E0B;">
        <p style="margin: 0 0 8px 0; color: #92400E; font-weight: 600;">
            🕒 Time Sensitive
        </p>
        <p style="margin: 0; color: #78350F; font-size: 14px;">
            Please complete this action {{ $deadline ?? 'as soon as possible' }}.
        </p>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ $actionUrl }}" class="button button-warning">
            ▶️ {{ $actionButtonText ?? 'Take Action Now' }}
        </a>
    </div>
</div>
@endsection
