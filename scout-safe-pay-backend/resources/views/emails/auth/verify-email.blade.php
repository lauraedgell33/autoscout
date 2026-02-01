@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✉️ Verify Your Email Address</h2>
<p class="email-subtitle">Welcome to AutoScout24 SafeTrade!</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Thank you for registering with AutoScout24 SafeTrade! To complete your registration and start buying or selling vehicles securely, please verify your email address.</p>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ $verificationUrl }}" class="button button-primary">
            ✓ Verify Email Address
        </a>
    </div>
    
    <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">⏱️ This link will expire in 60 minutes</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px;">
            If you didn't create an account, please ignore this email or contact our support team.
        </p>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">🔐 Why verify?</p>
        <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #1E3A8A; font-size: 14px;">
            <li style="margin-bottom: 8px;">Secure your account</li>
            <li style="margin-bottom: 8px;">Enable transaction notifications</li>
            <li style="margin-bottom: 8px;">Start buying or selling vehicles</li>
            <li style="margin-bottom: 8px;">Access all platform features</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 13px;">
        <strong>Having trouble clicking the button?</strong> Copy and paste this URL into your browser:<br>
        <a href="{{ $verificationUrl }}" style="color: #003281; word-break: break-all; font-size: 12px;">
            {{ $verificationUrl }}
        </a>
    </p>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        Need help? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Welcome aboard! 🚗<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
