@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.order_completed.title') }}</h2>
<p class="email-subtitle">{{ __('emails.order_completed.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 18px; margin-bottom: 8px;">🎉 {{ __('emails.order_completed.congratulations') }}</p>
        <p style="margin: 0; color: #065F46; font-size: 14px;">{{ __('emails.order_completed.intro', ['vehicle' => $vehicleTitle]) }}</p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.order_completed.order_summary') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; width: 140px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.vehicle') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $vehicleTitle }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.order_number') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $orderNumber }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.amount') }}:</td>
                <td style="padding: 10px 0; color: #10B981; font-weight: 700; font-size: 16px; border-bottom: 1px solid #E5E7EB;">{{ $totalAmount }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.order_completed.completion_date') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $completionDate }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.contract_generated.dealer') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px;">{{ $dealerName }}</td>
            </tr>
        </table>
    </div>
    
    <div class="card" style="background: #F0FDF4; border: 1px solid #86EFAC;">
        <p style="margin: 0; color: #166534; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.order_completed.whats_next') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.order_completed.next_documents') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.order_completed.next_delivery') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.order_completed.next_support') }}</li>
        </ul>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px; text-align: center;">
        {{ __('emails.order_completed.thank_you') }}
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
