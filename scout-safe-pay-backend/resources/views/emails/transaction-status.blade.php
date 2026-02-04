@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.transaction_status.title') }}</h2>
<p class="email-subtitle">{{ __('emails.transaction_status.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $userName]) }}</p>
    
    @if($status === 'completed')
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✓ {{ __('emails.transaction_status.status_completed') }}</p>
        <p style="margin: 0; color: #065F46; font-size: 14px;">{{ __('emails.transaction_status.completed_message') }}</p>
    </div>
    @elseif($status === 'in_progress')
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 16px; margin-bottom: 8px;">🔄 {{ __('emails.transaction_status.status_in_progress') }}</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px;">{{ __('emails.transaction_status.in_progress_message') }}</p>
    </div>
    @elseif($status === 'cancelled')
    <div class="alert-box alert-error">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✗ {{ __('emails.transaction_status.status_cancelled') }}</p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px;">{{ __('emails.transaction_status.cancelled_message') }}</p>
    </div>
    @elseif($status === 'pending_payment')
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 16px; margin-bottom: 8px;">⏳ {{ __('emails.transaction_status.status_pending_payment') }}</p>
        <p style="margin: 0; color: #78350F; font-size: 14px;">{{ __('emails.transaction_status.pending_payment_message') }}</p>
    </div>
    @else
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 16px; margin-bottom: 8px;">ℹ {{ __('emails.transaction_status.status_updated') }}</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px;">{{ __('emails.transaction_status.status_updated_message', ['status' => $statusLabel ?? $status]) }}</p>
    </div>
    @endif
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.transaction_status.transaction_details') }}</p>
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
                <td style="padding: 10px 0; color: #111827; font-weight: 700; font-size: 16px; border-bottom: 1px solid #E5E7EB;">{{ $amount }}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px; border-bottom: 1px solid #E5E7EB;">{{ __('emails.transaction_status.current_status') }}:</td>
                <td style="padding: 10px 0; font-size: 14px; border-bottom: 1px solid #E5E7EB;">
                    @if($status === 'completed')
                    <span style="background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">{{ $statusLabel ?? __('emails.transaction_status.label_completed') }}</span>
                    @elseif($status === 'cancelled')
                    <span style="background: #FEE2E2; color: #991B1B; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">{{ $statusLabel ?? __('emails.transaction_status.label_cancelled') }}</span>
                    @elseif($status === 'pending_payment')
                    <span style="background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">{{ $statusLabel ?? __('emails.transaction_status.label_pending_payment') }}</span>
                    @else
                    <span style="background: #DBEAFE; color: #1E40AF; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 12px;">{{ $statusLabel ?? __('emails.transaction_status.label_in_progress') }}</span>
                    @endif
                </td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #6B7280; font-size: 13px;">{{ __('emails.transaction_status.last_update') }}:</td>
                <td style="padding: 10px 0; color: #111827; font-size: 14px;">{{ $updateDate }}</td>
            </tr>
        </table>
    </div>
    
    @if(isset($statusMessage) && $statusMessage)
    <div class="card" style="background: #F8FAFC;">
        <p style="margin: 0; color: #6B7280; font-size: 12px; margin-bottom: 4px;">{{ __('emails.transaction_status.additional_info') }}:</p>
        <p style="margin: 0; color: #374151; font-size: 14px;">{{ $statusMessage }}</p>
    </div>
    @endif
    
    <div style="text-align: center; margin-top: 24px;">
        <a href="{{ $dashboardUrl ?? '#' }}" class="button">{{ __('emails.transaction_status.view_details') }}</a>
    </div>
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        {{ __('emails.transaction_status.questions') }}
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
