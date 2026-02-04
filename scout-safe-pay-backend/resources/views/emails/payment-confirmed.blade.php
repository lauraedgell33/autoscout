@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.payment_confirmed.title') }}</h2>
<p class="email-subtitle">{{ __('emails.payment_confirmed.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <div class="alert-box alert-success" style="text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">✅</div>
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 18px;">{{ __('emails.payment_confirmed.success') }}</p>
        <p style="margin: 8px 0 0 0; color: #065F46; font-size: 14px;">{{ $vehicleTitle }}</p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.payment_confirmed.invoice_title') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 140px;">{{ __('emails.payment_confirmed.invoice_number') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px; font-family: monospace;">{{ $invoiceNumber }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">{{ __('emails.payment_confirmed.amount_paid') }}:</td>
                <td style="padding: 8px 0; color: #003281; font-weight: 700; font-size: 18px;">{{ $amount }} {{ $currency }}</td>
            </tr>
        </table>
        <div style="text-align: center; margin-top: 16px;">
            <a href="{{ $invoiceUrl }}" class="button button-primary" style="margin: 0;">
                {{ __('emails.payment_confirmed.download_invoice') }}
            </a>
        </div>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.payment_confirmed.next_steps_title') }}</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.payment_confirmed.step1') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_confirmed.step2', ['dealer' => $dealerName]) }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_confirmed.step3') }}</li>
        </ol>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">{{ __('emails.payment_confirmed.dealer_contact') }}</p>
        <p style="margin: 0; color: #4B5563; font-size: 14px;">
            <strong>{{ $dealerName }}</strong><br>
            {{ __('emails.inquiry.phone') }}: {{ $dealerPhone }}
        </p>
    </div>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
