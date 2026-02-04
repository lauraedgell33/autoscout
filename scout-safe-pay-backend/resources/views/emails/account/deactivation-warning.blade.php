@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">⚠️ Account Deactivation Notice</h2>
<p class="email-subtitle">Your account will be deactivated soon</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>We noticed your AutoScout24 SafeTrade account has been inactive for a while. To maintain the security and quality of our platform, inactive accounts are scheduled for deactivation.</p>
    
    <div class="alert-box alert-warning" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">⏰</div>
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 18px;">Account Scheduled for Deactivation</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 14px;">
            Deactivation Date: <strong>{{ $deactivationDate ?? 'in 30 days' }}</strong>
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Account Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 140px;">Account Email:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $user->email }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Member Since:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $user->created_at->format('d M Y') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Last Active:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $lastActive ?? 'More than 6 months ago' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Account Status:</td>
                <td style="padding: 8px 0;">
                    <span class="badge badge-warning">Pending Deactivation</span>
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 15px; margin-bottom: 12px;">✅ Keep Your Account Active</p>
        <p style="margin: 0; color: #065F46; font-size: 14px; margin-bottom: 12px;">
            To prevent deactivation, simply log in to your account. Your account will remain active as long as you sign in before the deactivation date.
        </p>
        <div style="text-align: center;">
            <a href="{{ config('app.frontend_url') }}/en/login" class="button button-success" style="margin: 0;">
                🔓 Log In Now
            </a>
        </div>
    </div>
    
    <div class="alert-box alert-danger">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 15px; margin-bottom: 12px;">⚠️ What Happens After Deactivation:</p>
        <ul style="margin: 0; padding-left: 20px; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">You won't be able to log in to your account</li>
            <li style="margin-bottom: 6px;">Your vehicle listings will be hidden from the marketplace</li>
            <li style="margin-bottom: 6px;">Your saved searches and preferences will be deleted</li>
            <li style="margin-bottom: 6px;">Transaction history will be retained for legal compliance</li>
        </ul>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📧 Need to Reactivate Later?</p>
        <p style="margin: 0; color: #4B5563; font-size: 13px; line-height: 1.6;">
            If your account is deactivated, you can request reactivation within 90 days by contacting our support team. After 90 days, account data may be permanently deleted in accordance with GDPR.
        </p>
    </div>
    
    <div class="card" style="background-color: #DBEAFE; border: 1px solid #3B82F6;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🚗 Don't Miss Out!</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px; line-height: 1.6;">
            There are over <strong>{{ $activeListings ?? '50,000' }}</strong> vehicles on AutoScout24 SafeTrade right now. Log in to browse the latest deals with our secure escrow protection.
        </p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/login" class="button button-primary" style="margin-right: 8px;">
            🔓 Keep My Account
        </a>
        <a href="{{ config('app.frontend_url') }}/en/marketplace" class="button button-accent">
            🚗 Browse Vehicles
        </a>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions about your account? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        We hope to see you again soon!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
