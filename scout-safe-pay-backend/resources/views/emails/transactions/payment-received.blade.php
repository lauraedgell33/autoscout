@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✅ Payment Received!</h2>
<p class="email-subtitle">Your transaction is being processed</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Excellent news! We've received your payment and it's now being verified by our finance team. Your transaction is progressing smoothly!</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">💰</div>
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 18px;">Payment Confirmed</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            Amount: <strong>€{{ number_format($transaction->amount, 2, ',', '.') }}</strong>
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Payment Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 150px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Payment Method:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ ucfirst($transaction->payment_method ?? 'Bank Transfer') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Received At:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ now()->format('d M Y, H:i') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ $vehicle->make }} {{ $vehicle->model }} ({{ $vehicle->year }})
                </td>
            </tr>
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 15px;">Total Paid:</td>
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 18px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🔄 What Happens Next:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">Our finance team will verify your payment (usually within 1 business day)</li>
            <li style="margin-bottom: 8px;">The seller will prepare the vehicle for delivery</li>
            <li style="margin-bottom: 8px;">You'll receive an invoice and delivery schedule</li>
            <li style="margin-bottom: 8px;">Your funds are held securely in escrow until delivery confirmation</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-primary">
            📊 Track Your Order
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">🛡️ Escrow Protection Active:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            Your payment is securely held and will only be released to the seller after you confirm successful delivery. This protects both parties throughout the transaction process.
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📧 Upcoming Communications:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Payment verification confirmation</li>
            <li style="margin-bottom: 6px;">Official invoice (for your records)</li>
            <li style="margin-bottom: 6px;">Vehicle ready for delivery notification</li>
            <li style="margin-bottom: 6px;">Delivery scheduling details</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Have questions about your payment? Contact our finance team at 
        <a href="mailto:payments@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            payments@autoscout24safetrade.com
        </a>
        or general support at
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for your trust in AutoScout24 SafeTrade!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
