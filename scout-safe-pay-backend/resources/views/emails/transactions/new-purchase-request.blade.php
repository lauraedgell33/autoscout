@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🛒 New Purchase Request!</h2>
<p class="email-subtitle">Transaction #{{ $transaction->id }}</p>

<div class="email-content">
    <p>Hello <strong>{{ $seller->name }}</strong>,</p>
    
    <p>Great news! You have received a new purchase request for your vehicle.</p>
    
    <div class="info-box">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">
                    {{ $vehicle->make }} {{ $vehicle->model }} ({{ $vehicle->year }})
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Buyer:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">
                    {{ $buyer->name }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Amount:</td>
                <td style="padding: 8px 0; color: #10B981; font-weight: 700; font-size: 18px; text-align: right;">
                    €{{ number_format($transaction->amount, 2) }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Payment Reference:</td>
                <td style="padding: 8px 0; color: #111827; font-family: monospace; font-size: 13px; text-align: right;">
                    {{ $transaction->payment_reference }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ config('app.url') }}/admin/transactions/{{ $transaction->id }}/edit" class="button button-success">
            📊 View in Admin Dashboard
        </a>
    </div>
    
    <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">⏳ What happens next:</p>
        <ol style="margin: 12px 0 0 0; padding-left: 20px; color: #78350F; font-size: 14px;">
            <li style="margin-bottom: 8px;">The buyer will complete KYC verification</li>
            <li style="margin-bottom: 8px;">Buyer makes the bank transfer</li>
            <li style="margin-bottom: 8px;">Payment is verified by our team</li>
            <li style="margin-bottom: 8px;">You prepare the vehicle for delivery</li>
        </ol>
    </div>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #065F46; font-weight: 600; font-size: 14px;">✅ Your funds are secure:</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 13px;">
            Payment will be held in escrow and released to you after successful vehicle delivery and buyer confirmation.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Need assistance? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for selling with <strong>AutoScout24 SafeTrade</strong>!
    </p>
</div>
@endsection
