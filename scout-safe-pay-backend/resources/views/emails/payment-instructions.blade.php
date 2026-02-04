@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.payment_instructions.title') }}</h2>
<p class="email-subtitle">{{ __('emails.payment_instructions.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <p>{{ __('emails.payment_instructions.intro', ['vehicle' => $vehicleTitle]) }}</p>
    
    <p>{{ __('emails.payment_instructions.transfer_intro') }}</p>
    
    <div class="card" style="border: 2px solid #003281;">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.payment_instructions.bank_details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; width: 130px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.payment_reminder.iban') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: monospace; font-weight: 600; border-bottom: 1px solid #E5E7EB;">{{ $iban }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.payment_instructions.beneficiary') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; font-weight: 600; border-bottom: 1px solid #E5E7EB;">{{ $holder }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.payment_reminder.bank') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $bank }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.amount') }}:</td>
                <td style="padding: 10px 0; color: #003281; font-size: 20px; font-weight: 700; border-bottom: 1px solid #E5E7EB;">{{ $amount }} {{ $currency }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.reference') }}:</td>
                <td style="padding: 10px 0; color: #FFA500; font-size: 16px; font-weight: 700; font-family: monospace; border-bottom: 1px solid #E5E7EB;">{{ $reference }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.payment_instructions.deadline') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px;">{{ $deadline }} ({{ __('emails.payment_instructions.days_remaining', ['days' => $daysRemaining]) }})</td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-danger">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.payment_instructions.very_important') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 8px;"><strong>{{ __('emails.payment_instructions.include_reference', ['reference' => $reference]) }}</strong></li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.payment_deadline', ['days' => $daysRemaining]) }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.confirmation_time') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.invoice_after') }}</li>
        </ul>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.payment_instructions.steps_title') }}:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.step1') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.step2') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.step3', ['reference' => $reference]) }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.payment_instructions.step4') }}</li>
        </ol>
    </div>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
