@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🎉 Order Completed!</h2>
<p class="email-subtitle">Congratulations on your new vehicle!</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Fantastic news! Your order has been successfully completed. We hope you enjoy your new {{ $vehicle->make }} {{ $vehicle->model }}!</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">🚗✨</div>
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 20px;">Transaction Complete!</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            Order #{{ $transaction->id }} has been successfully delivered
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Order Summary:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 140px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 15px;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Year:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ $vehicle->year }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">VIN:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">{{ $vehicle->vin }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Delivered On:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ now()->format('d M Y') }}</td>
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
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">📄 Important Documents:</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px; margin-bottom: 12px;">
            All your transaction documents are available in your account:
        </p>
        <ul style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">✓ Purchase contract (signed)</li>
            <li style="margin-bottom: 6px;">✓ Official invoice</li>
            <li style="margin-bottom: 6px;">✓ Delivery confirmation</li>
            <li style="margin-bottom: 6px;">✓ Vehicle ownership transfer documents</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-primary" style="margin-right: 8px;">
            📊 View Transaction
        </a>
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}/invoice" class="button button-success">
            📄 Download Invoice
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border: 2px solid #FFC107; padding: 24px; margin: 24px 0; border-radius: 12px; text-align: center;">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 16px; margin-bottom: 12px;">⭐ Rate Your Experience</p>
        <p style="margin: 0 0 16px 0; color: #78350F; font-size: 14px;">
            Help us improve! Share your feedback about this transaction.
        </p>
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}/review" class="button button-warning">
            ⭐ Leave a Review
        </a>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">🎁 What's Next?</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Register the vehicle with your local authorities</li>
            <li style="margin-bottom: 6px;">Arrange insurance coverage</li>
            <li style="margin-bottom: 6px;">Schedule regular maintenance</li>
            <li style="margin-bottom: 6px;">Keep all transaction documents for your records</li>
        </ul>
    </div>
    
    <div style="background-color: #F3F4F6; border-left: 4px solid #6B7280; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #374151; font-weight: 600; font-size: 14px;">💡 Refer & Earn:</p>
        <p style="margin: 8px 0 0 0; color: #4B5563; font-size: 13px; line-height: 1.6;">
            Know someone looking to buy or sell a vehicle? Refer them to AutoScout24 SafeTrade and earn rewards! Contact us for details about our referral program.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Need help with registration or have questions? We're here for you at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px; font-size: 15px;">
        Congratulations once again and safe travels! 🎊🚗<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
    
    <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #E5E7EB; text-align: center;">
        <p style="margin: 0; color: #6B7280; font-size: 12px;">
            Thank you for choosing AutoScout24 SafeTrade - Europe's most trusted vehicle marketplace
        </p>
    </div>
</div>
@endsection
