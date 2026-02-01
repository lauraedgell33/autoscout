@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">New Login Detected 🔐</h2>
<p class="email-subtitle">Someone just logged into your account</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>We detected a new login to your AutoScout24 SafeTrade account:</p>
    
    <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <table style="width: 100%; font-size: 14px; color: #4B5563;">
            <tr>
                <td style="padding: 8px 0;"><strong>📅 Time:</strong></td>
                <td style="padding: 8px 0;">{{ $loginTime }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>📍 Location:</strong></td>
                <td style="padding: 8px 0;">{{ $location ?? 'Unknown' }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>💻 Device:</strong></td>
                <td style="padding: 8px 0;">{{ $device ?? 'Unknown' }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0;"><strong>🌐 IP Address:</strong></td>
                <td style="padding: 8px 0;">{{ $ipAddress }}</td>
            </tr>
        </table>
    </div>
    
    <div class="info-box" style="background-color: #ECFDF5; border-left-color: #10B981;">
        <p style="margin: 0; color: #065F46; font-size: 14px;">
            <strong>✅ Was this you?</strong><br>
            If you recognize this login, no action is needed.
        </p>
    </div>
    
    <div class="info-box" style="background-color: #FEF2F2; border-left-color: #EF4444; margin-top: 16px;">
        <p style="margin: 0 0 12px 0; color: #991B1B; font-size: 14px; font-weight: 600;">
            ⚠️ Didn't recognize this login?
        </p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px;">
            Secure your account immediately:
        </p>
        <ul style="color: #7F1D1D; font-size: 14px; margin: 8px 0 0 0; padding-left: 20px;">
            <li>Change your password right away</li>
            <li>Review recent account activity</li>
            <li>Enable two-factor authentication</li>
            <li>Contact our support team</li>
        </ul>
        <div style="text-align: center; margin-top: 16px;">
            <a href="{{ config('app.url') }}/settings/security" class="button button-warning" style="font-size: 14px; padding: 10px 24px;">
                🔒 Secure My Account
            </a>
        </div>
    </div>
</div>
@endsection
