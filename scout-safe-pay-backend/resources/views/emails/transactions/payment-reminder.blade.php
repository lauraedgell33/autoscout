@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">{{ __('emails.payment_reminder.title') }}</h2>
<p class="email-subtitle">{{ __('emails.payment_reminder.subtitle') }}</p>

<div class="email-content">
    <p>{{ __('emails.common.greeting', ['name' => $user->name]) }}</p>
    
    <p>{{ __('emails.payment_reminder.intro') }}</p>
    
    <div class="alert-box alert-warning" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">⏳</div>
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 18px;">{{ __('emails.payment_reminder.payment_due') }}</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 14px;">
            {{ __('emails.payment_reminder.deadline') }}: <strong>{{ $deadline ?? '48 hours' }}</strong>
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">{{ __('emails.payment_reminder.vehicle_details') }}</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">{{ __('emails.common.vehicle') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 15px;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">{{ __('emails.payment_reminder.year') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ $vehicle->year }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">{{ __('emails.common.transaction_id') }}:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 15px;">{{ __('emails.payment_reminder.amount_due') }}:</td>
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 20px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">{{ __('emails.payment_reminder.payment_instructions') }}</p>
        <p style="margin: 0; color: #1E3A8A; font-size: 14px; line-height: 1.6;">
            {{ __('emails.payment_reminder.transfer_instructions') }}
        </p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; margin-top: 12px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">{{ __('emails.payment_reminder.bank') }}:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-weight: 600;">Deutsche Bank AG</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">{{ __('emails.payment_reminder.iban') }}:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace;">DE89 3704 0044 0532 0130 00</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">{{ __('emails.payment_reminder.bic') }}:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace;">COBADEFFXXX</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; color: #1E40AF; font-size: 12px;">{{ __('emails.common.reference') }}:</td>
                    <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace; font-weight: 700;">AS24-{{ $transaction->id }}</td>
                </tr>
            </table>
        </div>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/{{ $locale ?? 'en' }}/transaction/{{ $transaction->id }}" class="button button-accent">
            {{ __('emails.payment_reminder.complete_payment') }}
        </a>
    </div>
    
    <div class="alert-box alert-danger">
        <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">{{ __('emails.payment_reminder.important') }}</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            {{ __('emails.payment_reminder.deadline_warning') }}
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">{{ __('emails.payment_reminder.escrow_title') }}</p>
        <p style="margin: 0; color: #4B5563; font-size: 13px; line-height: 1.6;">
            {{ __('emails.common.escrow_protection') }}
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        {{ __('emails.payment_reminder.questions_payment') }}
        <a href="mailto:payments@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            payments@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        {{ __('emails.common.regards') }}<br>
        <strong>{{ __('emails.common.team') }}</strong>
    </p>
</div>
@endsection
