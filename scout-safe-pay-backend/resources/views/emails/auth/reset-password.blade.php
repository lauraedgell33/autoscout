@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">Reset Your Password 🔑</h2>
<p class="email-subtitle">We received a request to reset your password</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>We received a request to reset the password for your AutoScout24 SafeTrade account.</p>
    
    <p>Click the button below to choose a new password:</p>
    
    <div style="text-align: center;">
        <a href="{{ $resetUrl }}" class="button button-primary">
            🔐 Reset Password
        </a>
    </div>
    
    <div class="info-box" style="background-color: #FFFBEB; border-left-color: #F59E0B;">
        <p style="margin: 0; color: #92400E; font-size: 14px;">
            <strong>⚠️ Security Notice</strong><br>
            This password reset link will expire in <strong>60 minutes</strong>.<br>
            For your security, we recommend using a strong, unique password.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #6B7280;">
        If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="word-break: break-all; font-size: 13px; color: #9CA3AF;">
        {{ $resetUrl }}
    </p>
    
    <div style="border-top: 1px solid #E5E7EB; margin: 32px 0; padding-top: 24px;">
        <p style="font-size: 14px; color: #EF4444; font-weight: 600;">
            ⚠️ Didn't request a password reset?
        </p>
        <p style="font-size: 14px; color: #6B7280;">
            If you didn't request this password reset, please ignore this email. 
            Your password will remain unchanged. If you're concerned about your account security, 
            please contact our support team immediately.
        </p>
    </div>
</div>
@endsection
