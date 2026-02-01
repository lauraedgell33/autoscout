@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">Payment Received! ✅</h2>
<p class="email-subtitle">Your payment has been securely received</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>We've successfully received your payment. Your funds are now held securely in escrow.</p>
    
    <div style="background-color: #ECFDF5; border: 3px solid #10B981; padding: 24px; margin: 24px 0; border-radius: 12px; text-align: center;">
        <p style="font-size: 48px; margin: 0;">✓</p>
        <p style="margin: 12px 0 0 0; color: #065F46; font-size: 20px; font-weight: 700;">
            €{{ number_format($payment->amount, 2) }}
        </p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            Payment Confirmed
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
            <strong>🔒 Secure Escrow Protection</strong><br>
            Your payment is held safely until you confirm delivery and satisfaction with the vehicle.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #6B7280;">
        <strong>What happens now?</strong>
    </p>
    <ul style="font-size: 14px; color: #4B5563; line-height: 1.8;">
        <li>Seller will prepare the vehicle for delivery</li>
        <li>You'll be notified when it's ready for pickup/delivery</li>
        <li>Inspect the vehicle upon delivery</li>
        <li>Confirm satisfaction to release funds</li>
    </ul>
</div>
@endsection
