@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">⚠️ Suspicious Activity Detected</h2>
<p class="email-subtitle">We noticed unusual activity on your account</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>Our security system detected unusual activity on your AutoScout24 SafeTrade account that requires your attention.</p>
    
    <div class="info-box" style="background-color: #FFFBEB; border-left-color: #F59E0B;">
        <p style="margin: 0 0 8px 0; color: #92400E; font-weight: 600;">
            🔍 Activity Details:
        </p>
        <p style="margin: 0; color: #78350F; font-size: 14px;">
            {{ $activityDescription ?? 'Multiple failed login attempts detected' }}
        </p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.url') }}/settings/security" class="button button-warning">
            🔒 Review Security Settings
        </a>
    </div>
    
    <div style="background-color: #FEF2F2; border: 2px solid #EF4444; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0 0 12px 0; color: #991B1B; font-weight: 600; font-size: 15px;">
            🛡️ Immediate Actions Recommended:
        </p>
        <ol style="color: #7F1D1D; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Change your password immediately</li>
            <li>Review recent account activity</li>
            <li>Enable two-factor authentication</li>
            <li>Check linked payment methods</li>
            <li>Verify your contact information</li>
        </ol>
    </div>
    
    <p style="font-size: 14px; color: #6B7280;">
        If you have any questions or need assistance, our security team is available 24/7.
    </p>
</div>
@endsection
