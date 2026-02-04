@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✅ Delivery Confirmed!</h2>
<p class="email-subtitle">Your vehicle has been successfully delivered</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Great news! The delivery of your vehicle has been confirmed. Your transaction is now complete!</p>
    
    <div class="alert-box alert-success" style="text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">🎉</div>
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 20px;">Delivery Complete!</p>
        <p style="margin: 8px 0 0 0; color: #065F46; font-size: 14px;">
            Confirmed on {{ now()->format('d M Y, H:i') }}
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Transaction Summary:</p>
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
                    {{ $vehicle->make }} {{ $vehicle->model }} ({{ $vehicle->year }})
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">VIN:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    {{ $vehicle->vin }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Delivery Date:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ now()->format('d M Y') }}
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
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">📄 Your Documents:</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px; margin-bottom: 12px;">
            All transaction documents are available in your account:
        </p>
        <ul style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">✓ Purchase contract (signed)</li>
            <li style="margin-bottom: 6px;">✓ Official invoice</li>
            <li style="margin-bottom: 6px;">✓ Delivery confirmation</li>
            <li style="margin-bottom: 6px;">✓ Vehicle ownership transfer</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-primary" style="margin-right: 8px;">
            📊 View Transaction
        </a>
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}/documents" class="button button-success">
            📄 Download Documents
        </a>
    </div>
    
    <div style="background-color: #FEF3C7; border: 2px solid #F59E0B; padding: 24px; margin: 24px 0; border-radius: 12px; text-align: center;">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 16px; margin-bottom: 12px;">⭐ Rate Your Experience</p>
        <p style="margin: 0 0 16px 0; color: #78350F; font-size: 14px;">
            Help us improve! Share your feedback about this transaction.
        </p>
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}/review" class="button button-warning" style="margin: 0;">
            ⭐ Leave a Review
        </a>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">🎁 Next Steps:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Register the vehicle with your local authorities</li>
            <li style="margin-bottom: 6px;">Arrange insurance coverage</li>
            <li style="margin-bottom: 6px;">Schedule regular maintenance</li>
            <li style="margin-bottom: 6px;">Keep all documents safe for your records</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Need help with anything? Contact us at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px; font-size: 15px;">
        Congratulations on your new vehicle! 🚗✨<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
