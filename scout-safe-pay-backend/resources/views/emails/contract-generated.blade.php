@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.contract_generated.title') }}</h2>
<p class="email-subtitle">{{ __('emails.contract_generated.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <p>{{ __('emails.contract_generated.intro', ['vehicle' => $vehicleTitle . ' (' . $vehicleYear . ')']) }}</p>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.contract_generated.details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">{{ __('emails.common.vehicle') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 15px;">{{ $vehicleTitle }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">{{ __('emails.common.amount') }}:</td>
                <td style="padding: 8px 0; color: #003281; font-weight: 700; font-size: 16px;">{{ $amount }} {{ $currency }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">{{ __('emails.common.reference') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">{{ $reference }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">{{ __('emails.contract_generated.dealer') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ $dealerName }}</td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.contract_generated.next_steps_title') }}</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.contract_generated.step1') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.contract_generated.step2') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.contract_generated.step3') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.contract_generated.step4') }}</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ $contractUrl }}" class="button button-primary">
            {{ __('emails.contract_generated.download_contract') }}
        </a>
    </div>
    
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">{{ __('emails.contract_generated.important') }}</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            {{ __('emails.contract_generated.deadline_warning') }}
        </p>
    </div>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
