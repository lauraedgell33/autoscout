@component('mail::message')
# Transaction Update

Hello {{ $transaction->buyer->name ?? 'User' }},

## {{ $statusLabel }}

Your transaction has been updated with the following status:

**Transaction Reference:** {{ $transaction->reference_number }}  
**Vehicle:** {{ $transaction->vehicle->year ?? '' }} {{ $transaction->vehicle->make ?? '' }} {{ $transaction->vehicle->model ?? '' }}  
**Amount:** €{{ number_format($transaction->amount, 2) }}  
**Status:** {{ $statusLabel }}

@if($message)
**Details:** {{ $message }}
@endif

@switch($status)
    @case('payment_received')
        We have received your payment. Our team will verify it shortly and notify you once confirmed.
        @break
    @case('payment_verified')
        Your payment has been verified and approved. The seller has been notified to prepare the vehicle for delivery.
        @break
    @case('funds_released')
        The funds have been released to the seller. The vehicle should be delivered soon. Please check your messages for delivery details.
        @break
    @case('delivery_confirmed')
        The vehicle has been delivered and confirmed. Thank you for using our platform!
        @break
    @case('completed')
        Your transaction has been completed successfully. We hope you're satisfied with your purchase!
        @break
    @case('cancelled')
        Your transaction has been cancelled. If you have any questions, please contact our support team.
        @break
    @case('disputed')
        A dispute has been opened on your transaction. Our team will review this and contact you shortly.
        @break
@endswitch

@component('mail::button', ['url' => $actionUrl])
View Transaction
@endcomponent

If you have any questions, please reply to this email or contact our support team.

Best regards,  
{{ config('app.name') }} Team
@endcomponent
