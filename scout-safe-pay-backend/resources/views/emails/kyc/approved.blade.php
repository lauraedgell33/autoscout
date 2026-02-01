@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✅ KYC Verification Approved!</h2>
<p class="email-subtitle">Your account is now fully verified</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Great news! Your KYC (Know Your Customer) verification has been <strong style="color: #10B981;">approved</strong>. You can now access all features of AutoScout24 SafeTrade!</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 18px;">Account Fully Activated!</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            You're all set to buy and sell vehicles securely
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 15px; margin-bottom: 12px;">✨ What you can do now:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #10B981; font-size: 20px; width: 40px;">✓</td>
                <td style="padding: 8px 0; color: #1F2937; font-size: 14px;">Browse and purchase vehicles</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #10B981; font-size: 20px;">✓</td>
                <td style="padding: 8px 0; color: #1F2937; font-size: 14px;">Make secure payments with escrow protection</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #10B981; font-size: 20px;">✓</td>
                <td style="padding: 8px 0; color: #1F2937; font-size: 14px;">List your vehicles for sale</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #10B981; font-size: 20px;">✓</td>
                <td style="padding: 8px 0; color: #1F2937; font-size: 14px;">Full transaction history and invoices</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #10B981; font-size: 20px;">✓</td>
                <td style="padding: 8px 0; color: #1F2937; font-size: 14px;">Premium buyer protection</td>
            </tr>
        </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/marketplace" class="button button-success">
            🚗 Browse Vehicles
        </a>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">💡 Pro Tip:</p>
        <p style="margin: 8px 0 0 0; color: #1E3A8A; font-size: 13px;">
            Set up your payment preferences now for faster checkouts. Visit your profile settings to add bank account details.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Have questions? Our support team is here to help at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Happy trading! 🎊<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
