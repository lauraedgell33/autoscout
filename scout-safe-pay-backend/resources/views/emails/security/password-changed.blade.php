@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✅ Password Changed Successfully</h2>
<p class="email-subtitle">Security confirmation</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Your AutoScout24 SafeTrade password has been successfully changed. This email confirms the update.</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🔐</div>
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 18px;">Password Updated</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            {{ now()->format('d M Y, H:i') }} UTC
        </p>
    </div>
    
    <div class="info-box" style="background-color: #F9FAFB;">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Change Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 120px;">Changed At:</td>
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
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Location:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $location ?? 'Unknown location' }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✓ Made this change?</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px;">
            Great! Your account is secure - no further action needed.
        </p>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 8px;">⚠️ Didn't make this change?</p>
        <p style="margin: 8px 0 12px 0; color: #7F1D1D; font-size: 14px;">
            <strong>Your account may be compromised.</strong> Take immediate action:
        </p>
        <ol style="margin: 0; padding-left: 20px; color: #7F1D1D; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;"><strong>Use password reset immediately</strong> - this will lock out anyone else</li>
            <li style="margin-bottom: 8px;">Contact our security team right away</li>
            <li style="margin-bottom: 8px;">Review all recent account activity and transactions</li>
            <li style="margin-bottom: 8px;">Check for any unauthorized changes to your profile</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/reset-password" class="button button-warning" style="margin-right: 8px;">
            🔒 Reset Password
        </a>
        <a href="mailto:security@autoscout24safetrade.com" class="button" style="background-color: #EF4444; color: white;">
            🚨 Report Issue
        </a>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">🛡️ Security Best Practices:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Use a unique password for every account</li>
            <li style="margin-bottom: 6px;">Enable two-factor authentication (2FA)</li>
            <li style="margin-bottom: 6px;">Use a password manager to generate strong passwords</li>
            <li style="margin-bottom: 6px;">Never share your password with anyone</li>
            <li style="margin-bottom: 6px;">Change passwords regularly (every 3-6 months)</li>
            <li style="margin-bottom: 6px;">Be wary of phishing attempts</li>
        </ul>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">💡 Pro Tip:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            Enable two-factor authentication (2FA) for an extra layer of security. Even if someone gets your password, they won't be able to access your account without your second factor.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        <strong>Security concerns or questions?</strong> Contact us 24/7 at 
        <a href="mailto:security@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            security@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Stay secure!<br>
        <strong>The AutoScout24 SafeTrade Security Team</strong>
    </p>
    
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB;">
        <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.6;">
            <strong>Why did I receive this email?</strong> We send security notifications for important account changes to help protect you. This is a standard security measure and helps alert you to any unauthorized access attempts.
        </p>
    </div>
</div>
@endsection
