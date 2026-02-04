@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.order_cancelled.title') }}</h2>
<p class="email-subtitle">{{ __('emails.order_cancelled.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 16px; margin-bottom: 8px;">{{ __('emails.order_cancelled.notice') }}</p>
        <p style="margin: 0; color: #78350F; font-size: 14px;">{{ __('emails.order_cancelled.intro', ['vehicle' => $vehicleTitle]) }}</p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.order_cancelled.order_details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; width: 140px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.vehicle') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $vehicleTitle }} ({{ $vehicleYear }})</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.order_number') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $transactionCode }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.order_cancelled.cancelled_at') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $cancelledAt }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.order_cancelled.reason') }}:</td>
                <td style="padding: 10px 0; color: #DC2626; font-weight: 600; font-size: 14px;">{{ $cancellationReason }}</td>
            </tr>
        </table>
    </div>
    
    <div class="card" style="background: #EFF6FF; border: 1px solid #93C5FD;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.order_cancelled.whats_next') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.order_cancelled.next_search') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.order_cancelled.next_support') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.order_cancelled.next_refund') }}</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin-top: 32px;">
        <a href="{{ $searchUrl }}" class="btn-primary">{{ __('emails.order_cancelled.browse_vehicles') }}</a>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 13px; text-align: center;">
        {{ __('emails.order_cancelled.questions') }} <a href="{{ $supportUrl }}" style="color: #003281;">{{ __('emails.order_cancelled.contact_support') }}</a>
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
