@component('mail::message')
# Payment Update

Hello {{ $payment->user->name ?? 'User' }},

## {{ $typeLabel }}

Your payment has been processed with the following update:

**Payment Reference:** {{ $payment->reference_number }}  
**Amount:** {{ $currency }} {{ number_format($amount, 2) }}  
**Transaction:** {{ $payment->transaction->reference_number }}  
**Status:** {{ $typeLabel }}

@if($message)
**Details:** {{ $message }}
@endif

@switch($type)
    @case('received')
        We have received your payment of {{ $currency }} {{ number_format($amount, 2) }}. Our team will verify it and notify you once confirmed.
        @break
    @case('verified')
        Your payment has been verified and approved. The seller has been notified and will prepare for delivery.
        @break
    @case('failed')
        Unfortunately, your payment could not be processed. Please check your payment details and try again. You can reach our support team if you need assistance.
        @break
    @case('refunded')
        Your payment of {{ $currency }} {{ number_format($amount, 2) }} has been refunded. The funds should appear in your account within 3-5 business days.
        @break
@endswitch

@component('mail::button', ['url' => $actionUrl])
View Payment Details
@endcomponent

If you have any questions about your payment, please reply to this email or contact our support team.

Best regards,  
{{ config('app.name') }} Team
@endcomponent
