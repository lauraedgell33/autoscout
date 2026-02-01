@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">⚡ Action Required</h2>
<p class="email-subtitle">Please complete the following action</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>{{ $message ?? 'We need you to take action on your AutoScout24 SafeTrade account.' }}</p>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 18px;">Action Needed</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 14px;">
            {{ $actionTitle ?? 'Complete the required action' }}
        </p>
    </div>
    
    @if(isset($actionDetails))
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 12px;">📋 Details:</p>
        <p style="margin: 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
            {{ $actionDetails }}
        </p>
    </div>
    @endif
    
    @if(isset($deadline))
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">⏰ Deadline:</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 14px; font-weight: 600;">
            {{ $deadline }}
        </p>
    </div>
    @endif
    
    @if(isset($steps) && is_array($steps) && count($steps) > 0)
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">📝 What to do:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            @foreach($steps as $step)
            <li style="margin-bottom: 8px;">{{ $step }}</li>
            @endforeach
        </ol>
    </div>
    @endif
    
    <div style="text-align: center; margin: 32px 0;">
        @if(isset($actionUrl))
        <a href="{{ $actionUrl }}" class="button button-primary">
            {{ $actionButtonText ?? '✓ Take Action' }}
        </a>
        @else
        <a href="{{ config('app.frontend_url') }}/en/dashboard" class="button button-primary">
            Go to Dashboard
        </a>
        @endif
    </div>
    
    @if(isset($consequences))
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">⚠️ Important:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            {{ $consequences }}
        </p>
    </div>
    @endif
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Need help? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for your prompt attention!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
