@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🎉 Purchase Confirmed!</h2>
<p class="email-subtitle">Transaction #{{ $transaction->id }}</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Your purchase request has been confirmed successfully! Here are the details:</p>
    
    <div class="info-box">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Year:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">
                    {{ $vehicle->year }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Amount:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 700; font-size: 18px; text-align: right;">
                    €{{ number_format($transaction->amount, 2) }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Status:</td>
                <td style="padding: 8px 0; text-align: right;">
                    <span style="background-color: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        {{ ucfirst(str_replace('_', ' ', $transaction->status)) }}
                    </span>
                </td>
            </tr>
        </table>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-primary">
            📄 View Transaction Details
        </a>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 600; font-size: 14px;">💳 Next Steps:</p>
        <ol style="margin: 12px 0 0 0; padding-left: 20px; color: #1E3A8A; font-size: 14px;">
            <li style="margin-bottom: 8px;">Download the contract from the transaction page</li>
            <li style="margin-bottom: 8px;">Make the bank transfer using the provided payment reference</li>
            <li style="margin-bottom: 8px;">Upload your payment proof for verification</li>
        </ol>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        If you have any questions, our support team is available 24/7 at 
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for choosing <strong>AutoScout24 SafeTrade</strong>!
    </p>
</div>
@endsection
