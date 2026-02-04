@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">💰 Funds Released!</h2>
<p class="email-subtitle">Payment has been transferred to your account</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Excellent news! The buyer has confirmed delivery, and the funds from your sale have been released to your bank account.</p>
    
    <div class="alert-box alert-success" style="text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">💸</div>
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 20px;">Payment Released!</p>
        <p style="margin: 8px 0 0 0; color: #065F46; font-size: 24px; font-weight: 700;">
            €{{ number_format($amount, 2, ',', '.') }}
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Payment Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 150px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Vehicle Sold:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ $vehicle->make }} {{ $vehicle->model }} ({{ $vehicle->year }})
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Sale Price:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Platform Fee:</td>
                <td style="padding: 8px 0; color: #EF4444; font-size: 14px;">
                    - €{{ number_format($platformFee ?? ($transaction->amount * 0.025), 2, ',', '.') }}
                </td>
            </tr>
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #10B981; font-weight: 700; font-size: 15px;">Net Payout:</td>
                <td style="padding: 12px 0; color: #10B981; font-weight: 700; font-size: 20px;">
                    €{{ number_format($amount, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🏦 Bank Transfer Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 6px 0; color: #1E40AF; font-size: 13px; width: 150px;">Destination Bank:</td>
                <td style="padding: 6px 0; color: #1E3A8A; font-size: 14px; font-weight: 600;">
                    {{ $bankAccount->bank_name ?? 'Your registered bank' }}
                </td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #1E40AF; font-size: 13px;">Account Ending:</td>
                <td style="padding: 6px 0; color: #1E3A8A; font-size: 14px; font-family: monospace;">
                    ****{{ substr($bankAccount->iban ?? '0000', -4) }}
                </td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #1E40AF; font-size: 13px;">Processing Time:</td>
                <td style="padding: 6px 0; color: #1E3A8A; font-size: 14px;">
                    1-3 business days
                </td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #1E40AF; font-size: 13px;">Reference:</td>
                <td style="padding: 6px 0; color: #1E3A8A; font-size: 14px; font-family: monospace; font-weight: 600;">
                    AS24-PAYOUT-{{ $transaction->id }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/dashboard/transactions" class="button button-primary" style="margin-right: 8px;">
            📊 View Transactions
        </a>
        <a href="{{ config('app.frontend_url') }}/en/dashboard/earnings" class="button button-success">
            💰 View Earnings
        </a>
    </div>
    
    <div class="card" style="background-color: #D1FAE5; border: 1px solid #10B981;">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🎊 Congratulations on Your Sale!</p>
        <p style="margin: 0; color: #065F46; font-size: 14px; line-height: 1.6;">
            Thank you for using AutoScout24 SafeTrade. Your successful sale helps build trust in our platform. Consider leaving a review for the buyer!
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📝 Your Records:</p>
        <p style="margin: 0; color: #4B5563; font-size: 13px; line-height: 1.6;">
            An official invoice and transaction report have been generated and are available in your dashboard. Keep these for your tax records.
        </p>
    </div>
    
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">💡 Sell More:</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            Have more vehicles to sell? List them now and reach millions of buyers across Europe with our secure escrow protection.
        </p>
        <div style="margin-top: 12px;">
            <a href="{{ config('app.frontend_url') }}/en/vehicles/create" style="color: #003281; text-decoration: none; font-weight: 600; font-size: 14px;">
                + List Another Vehicle →
            </a>
        </div>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions about your payout? Contact our finance team at 
        <a href="mailto:payments@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            payments@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for selling with AutoScout24 SafeTrade!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
