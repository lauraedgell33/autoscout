@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">Order Confirmed! 🎉</h2>
<p class="email-subtitle">Your order #{{ $order->id }} has been received</p>

<div class="email-content">
    <p>Hi <strong>{{ $user->name }}</strong>,</p>
    
    <p>Great news! We've received your order and it's being processed.</p>
    
    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; padding: 24px; margin: 24px 0; border-radius: 12px;">
        <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px;">Order Summary</h3>
        <table style="width: 100%; font-size: 14px;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280;">Order Number:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">#{{ $order->id }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">{{ $vehicle->make }} {{ $vehicle->model }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280;">Price:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600;">€{{ number_format($order->amount, 2) }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280;">Order Date:</td>
                <td style="padding: 8px 0; color: #111827;">{{ $order->created_at->format('F j, Y') }}</td>
            </tr>
        </table>
    </div>
    
    <div class="info-box" style="background-color: #EFF6FF; border-left-color: #003281;">
        <p style="margin: 0; color: #1E40AF; font-size: 14px;">
            <strong>📋 Next Steps:</strong><br>
            1. Complete payment verification<br>
            2. Seller prepares vehicle for delivery<br>
            3. Schedule inspection (if applicable)<br>
            4. Receive your vehicle
        </p>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ config('app.url') }}/orders/{{ $order->id }}" class="button button-primary">
            📦 View Order Details
        </a>
    </div>
</div>
@endsection
