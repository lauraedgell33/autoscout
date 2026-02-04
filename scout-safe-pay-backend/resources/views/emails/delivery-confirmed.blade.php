@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.delivery_confirmed.title') }}</h2>
<p class="email-subtitle">{{ __('emails.delivery_confirmed.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 18px; margin-bottom: 8px;">🚗 {{ __('emails.delivery_confirmed.congratulations') }}</p>
        <p style="margin: 0; color: #065F46; font-size: 14px;">{{ __('emails.delivery_confirmed.intro', ['vehicle' => $vehicleTitle]) }}</p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.delivery_confirmed.delivery_details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; width: 140px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.vehicle') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $vehicleTitle }} ({{ $vehicleYear }})</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.delivery_confirmed.vin') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: monospace; border-bottom: 1px solid #E5E7EB;">{{ $vin }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.order_number') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $transactionCode }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.delivery_confirmed.delivered_at') }}:</td>
                <td style="padding: 10px 0; color: #10B981; font-weight: 600; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $deliveredAt }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.contract_generated.dealer') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px;">{{ $dealerName }}</td>
            </tr>
        </table>
    </div>
    
    <div class="card" style="background: #FFF7ED; border: 1px solid #FED7AA;">
        <p style="margin: 0; color: #9A3412; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.delivery_confirmed.important_reminders') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #7C2D12; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.delivery_confirmed.reminder_documents') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.delivery_confirmed.reminder_registration') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.delivery_confirmed.reminder_insurance') }}</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin-top: 32px;">
        <a href="{{ $documentsUrl }}" class="btn-primary" style="margin-right: 12px;">{{ __('emails.delivery_confirmed.view_documents') }}</a>
    </div>
    
    <div class="card" style="background: #F0FDF4; border: 1px solid #86EFAC; margin-top: 24px; text-align: center;">
        <p style="margin: 0; color: #166534; font-weight: 700; font-size: 15px; margin-bottom: 8px;">{{ __('emails.delivery_confirmed.rate_experience') }}</p>
        <p style="margin: 0; color: #166534; font-size: 13px; margin-bottom: 16px;">{{ __('emails.delivery_confirmed.feedback_help') }}</p>
        <a href="{{ $reviewUrl }}" style="display: inline-block; background: #FFA500; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">⭐ {{ __('emails.delivery_confirmed.leave_review') }}</a>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 13px; text-align: center;">
        {{ __('emails.delivery_confirmed.questions') }} <a href="{{ $supportUrl }}" style="color: #003281;">{{ __('emails.common.contact_support') }}</a>
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
