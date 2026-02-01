@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🎉 Welcome to AutoScout24 SafeTrade!</h2>
<p class="email-subtitle">Your account is ready</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Welcome aboard! We're thrilled to have you as part of Europe's most trusted vehicle trading platform. Your account is now active and ready to use.</p>
    
    <div style="background-color: #EFF6FF; border: 2px solid #3B82F6; padding: 24px; margin: 24px 0; border-radius: 12px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🚗</div>
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 18px;">Start Your Journey Today</p>
        <p style="margin: 8px 0 0 0; color: #1E3A8A; font-size: 14px;">
            Browse thousands of verified vehicles or list your own
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 15px; margin-bottom: 16px;">✨ What makes us different:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; vertical-align: top; width: 40px;">
                    <span style="font-size: 24px;">🛡️</span>
                </td>
                <td style="padding: 10px 0;">
                    <strong style="color: #111827; font-size: 14px;">Escrow Protection</strong><br>
                    <span style="color: #6B7280; font-size: 13px;">Your funds are held securely until delivery is confirmed</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 0; vertical-align: top;">
                    <span style="font-size: 24px;">✓</span>
                </td>
                <td style="padding: 10px 0;">
                    <strong style="color: #111827; font-size: 14px;">Verified Sellers</strong><br>
                    <span style="color: #6B7280; font-size: 13px;">All dealers and sellers are verified through KYC</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 0; vertical-align: top;">
                    <span style="font-size: 24px;">📄</span>
                </td>
                <td style="padding: 10px 0;">
                    <strong style="color: #111827; font-size: 14px;">Legal Documentation</strong><br>
                    <span style="color: #6B7280; font-size: 13px;">Complete contracts, invoices, and ownership transfer</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 0; vertical-align: top;">
                    <span style="font-size: 24px;">🚚</span>
                </td>
                <td style="padding: 10px 0;">
                    <strong style="color: #111827; font-size: 14px;">Secure Delivery</strong><br>
                    <span style="color: #6B7280; font-size: 13px;">Professional delivery service across Europe</span>
                </td>
            </tr>
        </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/marketplace" class="button button-primary" style="margin-right: 8px;">
            🔍 Browse Vehicles
        </a>
        <a href="{{ config('app.frontend_url') }}/en/how-it-works" class="button button-success">
            📚 How It Works
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">🚀 Quick Start Guide:</p>
        <ol style="margin: 12px 0 0 0; padding-left: 20px; color: #78350F; font-size: 13px; line-height: 1.8;">
            <li>Complete your profile and KYC verification</li>
            <li>Browse vehicles or list your own</li>
            <li>Make secure offers with escrow protection</li>
            <li>Finalize transactions with legal documentation</li>
        </ol>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Have questions? Our support team is available 24/7 at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Happy trading!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
