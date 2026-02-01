@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🔐 New Login Detected</h2>
<p class="email-subtitle">Security notification</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>We detected a new login to your AutoScout24 SafeTrade account. If this was you, you can safely ignore this email.</p>
    
    <div class="info-box" style="background-color: #F9FAFB;">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Login Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 120px;">Date & Time:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ now()->format('d M Y, H:i:s') }} UTC
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">IP Address:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    {{ $ipAddress ?? 'Unknown' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Device:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $device ?? 'Unknown device' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Browser:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $browser ?? 'Unknown browser' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Location:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $location ?? 'Unknown location' }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✓ Was this you?</p>
        <p style="margin: 0; color: #047857; font-size: 14px;">
            No action needed - your account is secure
        </p>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 8px;">⚠️ Didn't recognize this login?</p>
        <p style="margin: 8px 0 12px 0; color: #7F1D1D; font-size: 14px;">
            If you didn't log in, your account may be compromised. Take immediate action:
        </p>
        <ol style="margin: 0; padding-left: 20px; color: #7F1D1D; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 6px;">Change your password immediately</li>
            <li style="margin-bottom: 6px;">Review recent account activity</li>
            <li style="margin-bottom: 6px;">Contact our security team</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/profile/security" class="button button-warning" style="margin-right: 8px;">
            🔒 Change Password
        </a>
        <a href="{{ config('app.frontend_url') }}/en/profile/activity" class="button button-primary">
            📊 View Activity
        </a>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">🛡️ Security Tips:</p>
        <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #1E3A8A; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Use a strong, unique password</li>
            <li style="margin-bottom: 6px;">Enable two-factor authentication</li>
            <li style="margin-bottom: 6px;">Never share your password</li>
            <li style="margin-bottom: 6px;">Be cautious of phishing emails</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Security concerns? Contact us immediately at 
        <a href="mailto:security@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            security@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Stay safe!<br>
        <strong>The AutoScout24 SafeTrade Security Team</strong>
    </p>
    
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.6;">
            <strong>Note:</strong> This is an automated security notification. We send these alerts to help protect your account. If you didn't attempt to log in and didn't recognize this activity, please secure your account immediately.
        </p>
    </div>
</div>
@endsection
