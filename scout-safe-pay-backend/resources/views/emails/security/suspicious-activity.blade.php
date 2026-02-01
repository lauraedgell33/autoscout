@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🚨 Suspicious Activity Detected</h2>
<p class="email-subtitle">Urgent security alert</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Our security system has detected unusual activity on your AutoScout24 SafeTrade account that requires your immediate attention.</p>
    
    <div style="background-color: #FEF2F2; border: 3px solid #EF4444; padding: 24px; margin: 24px 0; border-radius: 12px; text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">⚠️</div>
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 20px;">SECURITY ALERT</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 14px;">
            Unusual activity detected on your account
        </p>
    </div>
    
    <div class="info-box" style="background-color: #FEF2F2; border-left: 4px solid #EF4444;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 16px;">🔍 Detected Activity:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #7F1D1D; font-size: 13px; width: 140px;">Activity Type:</td>
                <td style="padding: 8px 0; color: #991B1B; font-weight: 600; font-size: 14px;">
                    {{ $activityType ?? 'Multiple failed login attempts' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #7F1D1D; font-size: 13px;">Detected At:</td>
                <td style="padding: 8px 0; color: #991B1B; font-size: 14px;">
                    {{ now()->format('d M Y, H:i:s') }} UTC
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #7F1D1D; font-size: 13px;">IP Address:</td>
                <td style="padding: 8px 0; color: #991B1B; font-size: 14px; font-family: monospace;">
                    {{ $ipAddress ?? 'Unknown' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #7F1D1D; font-size: 13px;">Location:</td>
                <td style="padding: 8px 0; color: #991B1B; font-size: 14px;">
                    {{ $location ?? 'Unknown location' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #7F1D1D; font-size: 13px;">Risk Level:</td>
                <td style="padding: 8px 0;">
                    <span style="background-color: #EF4444; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">
                        ⚠️ HIGH
                    </span>
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 12px;">⚡ IMMEDIATE ACTION REQUIRED:</p>
        <ol style="margin: 0; padding-left: 20px; color: #7F1D1D; font-size: 14px; line-height: 1.8; font-weight: 600;">
            <li style="margin-bottom: 10px;">Change your password immediately</li>
            <li style="margin-bottom: 10px;">Review all recent account activity and transactions</li>
            <li style="margin-bottom: 10px;">Check for unauthorized changes to your profile</li>
            <li style="margin-bottom: 10px;">Enable two-factor authentication (if not already enabled)</li>
            <li style="margin-bottom: 10px;">Contact our security team</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/reset-password" class="button" style="background-color: #EF4444; color: white; margin-right: 8px;">
            🔒 Change Password Now
        </a>
        <a href="mailto:security@autoscout24safetrade.com" class="button button-warning">
            🚨 Report to Security
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🛡️ Protecting Your Account:</p>
        <ul style="margin: 0; padding-left: 20px; color: #78350F; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;"><strong>Change your password:</strong> Use a strong, unique password you haven't used elsewhere</li>
            <li style="margin-bottom: 8px;"><strong>Enable 2FA:</strong> Add an extra layer of security to your account</li>
            <li style="margin-bottom: 8px;"><strong>Check active sessions:</strong> Log out any unrecognized devices</li>
            <li style="margin-bottom: 8px;"><strong>Review transactions:</strong> Look for any unauthorized activity</li>
            <li style="margin-bottom: 8px;"><strong>Update email/phone:</strong> Ensure your contact info is current</li>
        </ul>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🔍 Types of Suspicious Activity:</p>
        <ul style="margin: 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Multiple failed login attempts</li>
            <li style="margin-bottom: 6px;">Login from unusual location or device</li>
            <li style="margin-bottom: 6px;">Unusual transaction patterns</li>
            <li style="margin-bottom: 6px;">Profile information changes from unknown source</li>
            <li style="margin-bottom: 6px;">Password reset requests you didn't initiate</li>
        </ul>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">📞 Need Help?</p>
        <p style="margin: 8px 0 0 0; color: #1E3A8A; font-size: 13px; line-height: 1.6;">
            Our security team is available 24/7 to help you secure your account. Don't wait - contact us immediately if you believe your account has been compromised.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        <strong>Urgent security assistance:</strong><br>
        Email: <a href="mailto:security@autoscout24safetrade.com" style="color: #EF4444; text-decoration: none; font-weight: 600;">security@autoscout24safetrade.com</a><br>
        Phone: <a href="tel:+498912345678" style="color: #EF4444; text-decoration: none; font-weight: 600;">+49 89 1234 5678</a> (24/7)
    </p>
    
    <p style="margin-top: 24px;">
        Stay vigilant!<br>
        <strong>The AutoScout24 SafeTrade Security Team</strong>
    </p>
    
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.6;">
            <strong>This is a critical security alert.</strong> If you didn't perform the flagged activity, someone may be trying to access your account. Do not ignore this email. Take action immediately to protect your account and personal information.
        </p>
    </div>
</div>
@endsection
