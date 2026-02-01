@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">Welcome to AutoScout24 SafeTrade! 🎉</h2>
<p class="email-subtitle">Please verify your email address to get started</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>Thank you for joining AutoScout24 SafeTrade! We're excited to have you as part of our secure vehicle trading community.</p>
    
    <p>To complete your registration and unlock all features, please verify your email address by clicking the button below:</p>
    
    <div style="text-align: center;">
        <a href="{{ $verificationUrl }}" class="button button-primary">
            ✓ Verify Email Address
        </a>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
            <strong>🔒 Secure Link</strong><br>
            This verification link will expire in <strong>60 minutes</strong> for your security.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #6B7280;">
        If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="word-break: break-all; font-size: 13px; color: #9CA3AF;">
        {{ $verificationUrl }}
    </p>
    
    <div style="border-top: 1px solid #E5E7EB; margin: 32px 0; padding-top: 24px;">
        <p style="font-size: 14px; color: #6B7280;">
            <strong>What happens after verification?</strong>
        </p>
        <ul style="color: #4B5563; font-size: 14px; line-height: 1.8;">
            <li>✅ Full access to buy and sell vehicles</li>
            <li>✅ Secure escrow payment protection</li>
            <li>✅ Direct messaging with sellers/buyers</li>
            <li>✅ Transaction history and tracking</li>
        </ul>
    </div>
    
    <p style="font-size: 13px; color: #9CA3AF; margin-top: 24px;">
        Didn't create an account? You can safely ignore this email.
    </p>
</div>
@endsection
