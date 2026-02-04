@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">⏰ Payment Reminder</h2>
<p class="email-subtitle">Complete your payment to secure your vehicle</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>This is a friendly reminder that your payment for the vehicle below is still pending. To secure your purchase, please complete the payment before the deadline.</p>
    
    <div class="alert-box alert-warning" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">⏳</div>
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 18px;">Payment Due</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 14px;">
            Deadline: <strong>{{ $deadline ?? '48 hours' }}</strong>
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">🚗 Vehicle Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 15px;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Year:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ $vehicle->year }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 15px;">Amount Due:</td>
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 20px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">💳 Payment Instructions:</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px; line-height: 1.6;">
            Transfer the amount to our escrow account. Your payment will be held securely until you confirm delivery.
        </p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; margin-top: 12px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">Bank:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-weight: 600;">Deutsche Bank AG</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">IBAN:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace;">DE89 3704 0044 0532 0130 00</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">BIC:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace;">COBADEFFXXX</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">Reference:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace; font-weight: 700;">AS24-{{ $transaction->id }}</td>
                </tr>
            </table>
        </div>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-accent">
            💳 Complete Payment
        </a>
    </div>
    
    <div class="alert-box alert-danger">
        <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">⚠️ Important:</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            If payment is not received by the deadline, your reservation will be cancelled and the vehicle may be sold to another buyer.
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">🛡️ Escrow Protection:</p>
        <p style="margin: 0; color: #4B5563; font-size: 13px; line-height: 1.6;">
            Your payment is protected by our escrow system. Funds are only released to the seller after you confirm successful delivery.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions about payment? Contact our team at 
        <a href="mailto:payments@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            payments@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for choosing AutoScout24 SafeTrade!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
