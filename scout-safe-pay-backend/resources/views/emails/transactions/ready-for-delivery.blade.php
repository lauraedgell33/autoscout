@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🚚 Vehicle Ready for Delivery!</h2>
<p class="email-subtitle">Your vehicle is prepared and ready</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>Exciting news! Your {{ $vehicle->make }} {{ $vehicle->model }} has been prepared and is now ready for delivery or pickup.</p>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 56px; margin-bottom: 12px;">🚗✨</div>
        <p style="margin: 0; color: #065F46; font-weight: 700; font-size: 20px;">Ready for Delivery!</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 14px;">
            Final preparations complete - almost yours!
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">🚗 Vehicle Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 15px;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Year:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">{{ $vehicle->year }}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Mileage:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ number_format($vehicle->mileage, 0, ',', '.') }} km
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">VIN:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    {{ $vehicle->vin }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">📋 Next Steps:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">The seller will contact you within 24 hours to arrange delivery/pickup</li>
            <li style="margin-bottom: 8px;">Choose your preferred delivery date and time</li>
            <li style="margin-bottom: 8px;">Prepare necessary documents (ID, driver's license)</li>
            <li style="margin-bottom: 8px;">Inspect the vehicle carefully upon delivery</li>
            <li style="margin-bottom: 8px;">Confirm delivery in your dashboard to release payment</li>
        </ol>
    </div>
    
    <div class="info-box" style="background-color: #F9FAFB;">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📍 Delivery Options:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 12px 0; vertical-align: top; width: 40px;">
                    <span style="font-size: 24px;">🏢</span>
                </td>
                <td style="padding: 12px 0;">
                    <strong style="color: #111827; font-size: 14px;">Pickup at Dealership</strong><br>
                    <span style="color: #6B7280; font-size: 13px;">Visit the seller's location to collect your vehicle</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 0; vertical-align: top;">
                    <span style="font-size: 24px;">🚚</span>
                </td>
                <td style="padding: 12px 0;">
                    <strong style="color: #111827; font-size: 14px;">Professional Delivery</strong><br>
                    <span style="color: #6B7280; font-size: 13px;">Have the vehicle delivered directly to your address</span>
                </td>
            </tr>
        </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}" class="button button-primary" style="margin-right: 8px;">
            📊 View Transaction
        </a>
        <a href="{{ config('app.frontend_url') }}/en/transaction/{{ $transaction->id }}/contact" class="button button-success">
            💬 Contact Seller
        </a>
    </div>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 15px; margin-bottom: 12px;">✅ Delivery Checklist:</p>
        <ul style="margin: 0; padding-left: 20px; color: #78350F; font-size: 13px; line-height: 1.8;">
            <li style="margin-bottom: 6px;">Valid ID or passport</li>
            <li style="margin-bottom: 6px;">Driver's license (if driving away)</li>
            <li style="margin-bottom: 6px;">Insurance confirmation (required before driving)</li>
            <li style="margin-bottom: 6px;">Signed purchase contract (you should have this)</li>
            <li style="margin-bottom: 6px;">Payment confirmation/invoice</li>
        </ul>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 14px; margin-bottom: 8px;">⚠️ Important - Vehicle Inspection:</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            <strong>Thoroughly inspect the vehicle before accepting delivery.</strong> Check exterior, interior, engine, and test drive if possible. Report any issues immediately before confirming delivery in the system. Once confirmed, the payment is released to the seller.
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">🔍 What to Check:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">✓</td>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">Exterior condition (paint, body, tires)</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">✓</td>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">Interior condition (seats, dashboard, electronics)</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">✓</td>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">Engine and mechanical systems</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">✓</td>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">All features and equipment work properly</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">✓</td>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">VIN matches documentation</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">✓</td>
                <td style="padding: 6px 0; color: #4B5563; font-size: 13px;">Service history and documents included</td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #065F46; font-weight: 600; font-size: 14px;">🛡️ Your Protection:</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 13px; line-height: 1.6;">
            Your payment remains in escrow until YOU confirm delivery. If there are any issues with the vehicle, do not confirm delivery and contact our support team immediately.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions about delivery? Contact us at 
        <a href="mailto:delivery@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            delivery@autoscout24safetrade.com
        </a>
        or
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Almost there - enjoy your new vehicle!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
