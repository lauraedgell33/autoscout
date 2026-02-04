@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.ready_for_delivery.title') }}</h2>
<p class="email-subtitle">{{ __('emails.ready_for_delivery.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $buyerName]) }}</p>
    
    <p>{{ __('emails.ready_for_delivery.intro', ['vehicle' => $vehicleTitle]) }}</p>
    
    <div class="card" style="border: 2px solid #3B82F6;">
        <p style="margin: 0; color: #3B82F6; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.ready_for_delivery.delivery_details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; width: 140px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.ready_for_delivery.delivery_date') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 600; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $deliveryDate }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.ready_for_delivery.delivery_address') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $deliveryAddress }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.ready_for_delivery.delivery_contact') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $deliveryContact }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.contract_generated.dealer') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px;">
                    <strong>{{ $dealerName }}</strong><br>
                    {{ __('emails.inquiry.phone') }}: {{ $dealerPhone }}<br>
                    {{ $dealerAddress }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.ready_for_delivery.preparation_title') }}</p>
        <p style="margin: 0 0 8px 0; color: #78350F; font-size: 14px;">{{ __('emails.ready_for_delivery.preparation_intro') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #78350F; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.doc_id') }}</li>
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.doc_contract') }}</li>
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.doc_payment') }}</li>
        </ul>
    </div>
    
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.ready_for_delivery.you_will_receive') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #065F46; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.receive_registration') }}</li>
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.receive_keys') }}</li>
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.receive_manual') }}</li>
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.receive_service') }}</li>
            <li style="margin-bottom: 6px;">{{ __('emails.ready_for_delivery.receive_accessories') }}</li>
        </ul>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        {{ __('emails.ready_for_delivery.schedule_changes') }}
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.ready_for_delivery.looking_forward') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
