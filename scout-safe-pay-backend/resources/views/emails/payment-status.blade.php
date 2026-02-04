@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.payment_status.title') }}</h2>
<p class="email-subtitle">{{ __('emails.payment_status.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $userName]) }}</p>
    
    @if($status === 'completed')
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✓ {{ __('emails.payment_status.status_completed') }}</p>
        <p style="margin: 0; color: #065F46; font-size: 14px;">{{ __('emails.payment_status.completed_message', ['amount' => $amount]) }}</p>
    </div>
    @elseif($status === 'pending')
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 16px; margin-bottom: 8px;">⏳ {{ __('emails.payment_status.status_pending') }}</p>
        <p style="margin: 0; color: #78350F; font-size: 14px;">{{ __('emails.payment_status.pending_message') }}</p>
    </div>
    @elseif($status === 'failed')
    <div class="alert-box alert-error">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✗ {{ __('emails.payment_status.status_failed') }}</p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px;">{{ __('emails.payment_status.failed_message') }}</p>
    </div>
    @else
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 16px; margin-bottom: 8px;">ℹ {{ __('emails.payment_status.status_processing') }}</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px;">{{ __('emails.payment_status.processing_message') }}</p>
    </div>
    @endif
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.payment_status.payment_details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; width: 140px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.order_number') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $orderNumber }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.common.amount') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 16px; border-bottom: 1px solid #E5E7EB;">{{ $amount }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.payment_status.payment_method') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $paymentMethod ?? __('emails.payment_status.bank_transfer') }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.payment_status.date') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; border-bottom: 1px solid #E5E7EB;">{{ $paymentDate }}</td>
            </tr>
            @if(isset($transactionId) && $transactionId)
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.payment_status.transaction_id') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: monospace;">{{ $transactionId }}</td>
            </tr>
            @endif
        </table>
    </div>
    
    @if($status === 'failed')
    <div style="text-align: center; margin-top: 24px;">
        <a href="{{ $retryUrl ?? '#' }}" class="button">{{ __('emails.payment_status.retry_button') }}</a>
    </div>
    @endif
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        {{ __('emails.payment_status.questions') }}
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
