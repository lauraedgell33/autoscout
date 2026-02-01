@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">Welcome Aboard! 🚗✨</h2>
<p class="email-subtitle">Your account is now active and ready to use</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>🎉 Congratulations! Your email has been verified and your AutoScout24 SafeTrade account is now fully activated.</p>
    
    <div style="text-align: center;">
        <a href="{{ config('app.url') }}/dashboard/{{ $user->user_type }}" class="button button-success">
            🚀 Go to Dashboard
        </a>
    </div>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0 0 12px 0; color: #065F46; font-weight: 600; font-size: 15px;">
            🎯 Get Started in 3 Simple Steps:
        </p>
        <ol style="color: #047857; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
            <li><strong>Complete your profile</strong> - Add your details and preferences</li>
            <li><strong>Browse vehicles</strong> - Find your perfect match from thousands of listings</li>
            <li><strong>Start trading</strong> - Buy or sell with complete peace of mind</li>
        </ol>
    </div>
    
    <div style="border-top: 1px solid #E5E7EB; margin: 32px 0; padding-top: 24px;">
        <p style="font-size: 15px; color: #1F2937; font-weight: 600; margin-bottom: 12px;">
            🔒 Why AutoScout24 SafeTrade?
        </p>
        <ul style="color: #4B5563; font-size: 14px; line-height: 1.8;">
            <li><strong>Secure Escrow System</strong> - Your money is protected until delivery</li>
            <li><strong>Vehicle Verification</strong> - All listings are thoroughly checked</li>
            <li><strong>24/7 Support</strong> - Our team is always here to help</li>
            <li><strong>Buyer Protection</strong> - Safe and transparent transactions</li>
        </ul>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
            <strong>💡 Need Help Getting Started?</strong><br>
            Visit our <a href="{{ config('app.url') }}/support/help" style="color: #003281; font-weight: 600;">Help Center</a> 
            or contact our support team anytime.
        </p>
    </div>
    
    <p style="margin-top: 32px;">
        Happy trading! 🚗💨
    </p>
</div>
@endsection
