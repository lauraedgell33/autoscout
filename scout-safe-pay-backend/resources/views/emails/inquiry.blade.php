@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🔔 New Vehicle Inquiry</h2>
<p class="email-subtitle">A potential buyer is interested in your vehicle</p>

<div class="email-content">
    <p>Hello,</p>
    
    <p>Great news! You have received a new inquiry about your vehicle listing on AutoScout24 SafeTrade.</p>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">🚗 Vehicle Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 100px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 15px;">
                    {{ $vehicleTitle }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Price:</td>
                <td style="padding: 8px 0; color: #003281; font-weight: 700; font-size: 16px;">
                    €{{ $vehiclePrice }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Listing ID:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    #{{ $vehicleId }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">💬 Message from Potential Buyer:</p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; margin-top: 8px;">
            <p style="margin: 0; color: #1F2937; font-size: 14px; line-height: 1.7;">
                {!! nl2br(e($buyerMessage)) !!}
            </p>
        </div>
    </div>
    
    <div class="card" style="background-color: #D1FAE5; border: 1px solid #10B981;">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">👤 Contact Information</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 6px 0; color: #047857; font-size: 13px; width: 80px;">Name:</td>
                <td style="padding: 6px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ $senderName }}
                </td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #047857; font-size: 13px;">Email:</td>
                <td style="padding: 6px 0; color: #111827; font-size: 14px;">
                    <a href="mailto:{{ $senderEmail }}" style="color: #003281; text-decoration: none;">
                        {{ $senderEmail }}
                    </a>
                </td>
            </tr>
            @if($senderPhone)
            <tr>
                <td style="padding: 6px 0; color: #047857; font-size: 13px;">Phone:</td>
                <td style="padding: 6px 0; color: #111827; font-size: 14px;">
                    <a href="tel:{{ $senderPhone }}" style="color: #003281; text-decoration: none;">
                        {{ $senderPhone }}
                    </a>
                </td>
            </tr>
            @endif
        </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="mailto:{{ $senderEmail }}" class="button button-accent">
            ✉️ Reply to Inquiry
        </a>
    </div>
    
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">💡 Quick Response Tip:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            Responding quickly to inquiries increases your chances of making a sale. Buyers appreciate prompt communication - try to respond within a few hours!
        </p>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        Need help managing your listings? Visit your 
        <a href="{{ config('app.frontend_url') }}/en/dashboard/vehicles" style="color: #003281; text-decoration: none;">
            vehicle dashboard
        </a>
        to update your listing or mark it as sold.
    </p>
    
    <p style="margin-top: 24px;">
        Happy selling!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
