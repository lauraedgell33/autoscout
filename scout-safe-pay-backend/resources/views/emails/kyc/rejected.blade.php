@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">❌ KYC Verification Requires Attention</h2>
<p class="email-subtitle">Additional information needed</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>We've reviewed your KYC (Know Your Customer) verification submission, but unfortunately we need some additional information or clarification to complete the process.</p>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 15px; margin-bottom: 8px;">📋 Reason for Review:</p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px; line-height: 1.6;">
            {{ $reason ?? 'The documents provided require clarification. Please ensure all information is clear, legible, and matches your account details.' }}
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 15px; margin-bottom: 12px;">✅ What to check:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 14px; line-height: 1.8;">
            <li>All document images are clear and fully visible</li>
            <li>Identity document is valid and not expired</li>
            <li>Name matches exactly as on your ID document</li>
            <li>Selfie photo clearly shows your face</li>
            <li>Document edges are not cut off in photos</li>
            <li>All required fields are completed</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/profile/kyc" class="button button-warning">
            🔄 Resubmit Verification
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">💡 Tips for successful verification:</p>
        <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #78350F; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Use good lighting when taking photos</li>
            <li style="margin-bottom: 6px;">Ensure documents are flat and no glare</li>
            <li style="margin-bottom: 6px;">Take photos against a plain background</li>
            <li style="margin-bottom: 6px;">Make sure all corners of the document are visible</li>
        </ul>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">📝 Accepted Documents:</p>
        <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #1E3A8A; font-size: 13px;">
            <li>Passport (recommended)</li>
            <li>National ID Card</li>
            <li>Driver's License</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        <strong>Need help?</strong> Our verification team is ready to assist you. Contact us at 
        <a href="mailto:kyc@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            kyc@autoscout24safetrade.com
        </a>
        or
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        We look forward to helping you get verified!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
