@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">💬 New Message Received</h2>
<p class="email-subtitle">You have a new message</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>You have received a new message on AutoScout24 SafeTrade{{ isset($senderName) ? ' from ' . $senderName : '' }}.</p>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 24px; margin: 24px 0; border-radius: 8px;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
            <div style="background-color: #3B82F6; color: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; margin-right: 16px;">
                {{ isset($senderName) ? strtoupper(substr($senderName, 0, 1)) : '👤' }}
            </div>
            <div>
                <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px;">
                    {{ $senderName ?? 'AutoScout24 User' }}
                </p>
                <p style="margin: 4px 0 0 0; color: #3B82F6; font-size: 13px;">
                    {{ now()->format('d M Y, H:i') }}
                </p>
            </div>
        </div>
        
        @if(isset($subject))
        <p style="margin: 0 0 12px 0; color: #1E40AF; font-weight: 600; font-size: 14px;">
            Re: {{ $subject }}
        </p>
        @endif
        
        <div style="background-color: white; padding: 16px; border-radius: 8px; margin-top: 12px;">
            <p style="margin: 0; color: #1F2937; font-size: 14px; line-height: 1.6;">
                {{ Str::limit($messagePreview ?? 'You have a new message waiting for you.', 200) }}
            </p>
        </div>
    </div>
    
    @if(isset($vehicleInfo))
    <div class="info-box" style="background-color: #F9FAFB;">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🚗 Regarding:</p>
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
            <strong>{{ $vehicleInfo['make'] ?? '' }} {{ $vehicleInfo['model'] ?? '' }}</strong>
            @if(isset($vehicleInfo['year']))
            <span style="color: #6B7280;"> ({{ $vehicleInfo['year'] }})</span>
            @endif
        </p>
        @if(isset($vehicleInfo['price']))
        <p style="margin: 8px 0 0 0; color: #003281; font-weight: 600; font-size: 15px;">
            €{{ number_format($vehicleInfo['price'], 2, ',', '.') }}
        </p>
        @endif
    </div>
    @endif
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ $messageUrl ?? config('app.frontend_url') . '/en/messages' }}" class="button button-primary">
            📬 Read Message
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">💡 Pro Tip:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            Quick responses help build trust and close deals faster. Try to reply within 24 hours for the best experience.
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">🔔 Message Notifications:</p>
        <p style="margin: 0; color: #4B5563; font-size: 13px; line-height: 1.6;">
            You're receiving this because you have message notifications enabled. 
            <a href="{{ config('app.frontend_url') }}/en/profile/notifications" style="color: #003281; text-decoration: none;">
                Manage your notification preferences
            </a>
        </p>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">⚠️ Safety Reminder:</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            Keep all communication within the AutoScout24 SafeTrade platform. Never share personal financial information, passwords, or make payments outside our secure system.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions or concerns? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Happy messaging!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
