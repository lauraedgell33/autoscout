@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🔐 Reset Your Password</h2>
<p class="email-subtitle">Password Reset Request</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>We received a request to reset your password for your AutoScout24 SafeTrade account. Click the button below to create a new password:</p>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ $resetUrl }}" class="button button-primary">
            🔑 Reset Password
        </a>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">⏱️ This link will expire in 60 minutes</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px;">
            For security reasons, this password reset link is only valid for 1 hour.
        </p>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">❓ Didn't request this?</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged. 
            You may also want to review your account security settings.
        </p>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">🛡️ Security Tips:</p>
        <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #1E3A8A; font-size: 13px;">
            <li style="margin-bottom: 6px;">Use a strong, unique password</li>
            <li style="margin-bottom: 6px;">Don't reuse passwords from other sites</li>
            <li style="margin-bottom: 6px;">Consider using a password manager</li>
            <li style="margin-bottom: 6px;">Enable two-factor authentication (coming soon)</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 13px;">
        <strong>Having trouble clicking the button?</strong> Copy and paste this URL into your browser:<br>
        <a href="{{ $resetUrl }}" style="color: #003281; word-break: break-all; font-size: 12px;">
            {{ $resetUrl }}
        </a>
    </p>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        Questions or concerns? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Stay secure!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
