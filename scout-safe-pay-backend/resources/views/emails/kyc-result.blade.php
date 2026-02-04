@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.kyc.title') }}</h2>
<p class="email-subtitle">{{ __('emails.kyc.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $userName]) }}</p>
    
    @if($status === 'approved')
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✓ {{ __('emails.kyc.status_approved') }}</p>
        <p style="margin: 0; color: #065F46; font-size: 14px;">{{ __('emails.kyc.approved_message') }}</p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.kyc.next_steps') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.kyc.approved_step1') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.kyc.approved_step2') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.kyc.approved_step3') }}</li>
        </ul>
    </div>
    
    @elseif($status === 'pending')
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 16px; margin-bottom: 8px;">⏳ {{ __('emails.kyc.status_pending') }}</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px;">{{ __('emails.kyc.pending_message') }}</p>
    </div>
    
    <p style="color: #6B7280; font-size: 14px;">{{ __('emails.kyc.review_time') }}</p>
    
    @else
    <div class="alert-box alert-error">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 16px; margin-bottom: 8px;">✗ {{ __('emails.kyc.status_rejected') }}</p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px;">{{ __('emails.kyc.rejected_message') }}</p>
    </div>
    
    @if(isset($rejectionReason) && $rejectionReason)
    <div class="card" style="border-left: 4px solid #EF4444;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 14px; margin-bottom: 8px;">{{ __('emails.kyc.rejection_reason') }}:</p>
        <p style="margin: 0; color: #374151; font-size: 14px;">{{ $rejectionReason }}</p>
    </div>
    @endif
    
    <div class="card">
        <p style="margin: 0; color: #003281; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.kyc.how_to_fix') }}</p>
        <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">{{ __('emails.kyc.fix_step1') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.kyc.fix_step2') }}</li>
            <li style="margin-bottom: 8px;">{{ __('emails.kyc.fix_step3') }}</li>
        </ul>
    </div>
    
    <div style="text-align: center; margin-top: 24px;">
        <a href="{{ $retryUrl ?? '#' }}" class="button">{{ __('emails.kyc.resubmit_button') }}</a>
    </div>
    @endif
    
    <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        {{ __('emails.kyc.support_message') }}
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
