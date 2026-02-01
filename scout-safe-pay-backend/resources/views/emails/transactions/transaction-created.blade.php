@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🎉 Order Confirmed!</h2>
<p class="email-subtitle">Thank you for your purchase</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Your order has been confirmed! We're processing your transaction and will keep you updated at every step.</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 16px; margin-bottom: 4px;">✓ Order #{{ $transaction->id }}</p>
        <p style="margin: 0; color: #047857; font-size: 13px;">Status: <strong>{{ strtoupper($transaction->status) }}</strong></p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">🚗 Vehicle Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Year:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ $vehicle->year }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Mileage:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ number_format($vehicle->mileage, 0, ',', '.') }} km
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">VIN:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    {{ $vehicle->vin }}
                </td>
            </tr>
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #6B7280; font-size: 13px;">Vehicle Price:</td>
                <td style="padding: 12px 0; color: #111827; font-weight: 600; font-size: 15px;">
                    €{{ number_format($transaction->amount - ($transaction->amount * 0.19), 2, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">VAT (19%):</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    €{{ number_format($transaction->amount * 0.19, 2, ',', '.') }}
                </td>
            </tr>
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 15px;">Total Amount:</td>
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 18px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">📋 Next Steps:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">Review and sign the purchase contract (will be sent separately)</li>
            <li style="margin-bottom: 8px;">Complete payment using our secure escrow system</li>
            <li style="margin-bottom: 8px;">Await vehicle preparation and inspection</li>
            <li style="margin-bottom: 8px;">Coordinate delivery or pickup</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-primary">
            📊 View Order Details
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">🛡️ Your Protection:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            Your payment is held securely in escrow until you confirm delivery. This ensures complete protection for both buyer and seller throughout the transaction.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions about your order? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for choosing AutoScout24 SafeTrade!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
