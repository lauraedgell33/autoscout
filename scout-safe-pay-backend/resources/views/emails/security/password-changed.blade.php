@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">Password Successfully Changed ✅</h2>
<p class="email-subtitle">Your password has been updated</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>This is a confirmation that your AutoScout24 SafeTrade account password was successfully changed.</p>
    
    <div style="background-color: #ECFDF5; border: 2px solid #10B981; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <p style="font-size: 48px; margin: 0;">✓</p>
        <p style="margin: 12px 0 0 0; color: #065F46; font-weight: 600;">
            Password Updated Successfully
        </p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            Changed on {{ now()->format('F j, Y \a\t g:i A') }}
        </p>
    </div>
    
    <div class="info-box" style="background-color: #FEF2F2; border-left-color: #EF4444;">
        <p style="margin: 0 0 8px 0; color: #991B1B; font-weight: 600;">
            ⚠️ Didn't change your password?
        </p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px;">
            If you didn't make this change, your account may have been compromised. 
            Please contact our support team immediately.
        </p>
        <div style="text-align: center; margin-top: 12px;">
            <a href="{{ config('app.url') }}/support" class="button button-danger" style="font-size: 14px; padding: 10px 24px;">
                🆘 Report Unauthorized Change
            </a>
        </div>
    </div>
    
    <p style="font-size: 14px; color: #6B7280; margin-top: 24px;">
        <strong>Security Tips:</strong>
    </p>
    <ul style="font-size: 14px; color: #4B5563; line-height: 1.8;">
        <li>Never share your password with anyone</li>
        <li>Use a unique password for your AutoScout24 account</li>
        <li>Enable two-factor authentication for extra security</li>
        <li>Change your password regularly</li>
    </ul>
</div>
@endsection
