@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">🛎️ New Purchase Request!</h2>
<p class="email-subtitle">You have a new buyer for your vehicle</p>

<div class="email-content">
    <p>Hello <strong>{{ $seller->name }}</strong>,</p>
    
    <p>Great news! A buyer has submitted a purchase request for your vehicle. Please review the details below and take action in your dashboard.</p>
    
    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 24px; margin: 24px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">🎯</div>
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 18px;">Action Required</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 14px;">
            Review and approve this transaction to proceed
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
            <tr style="border-top: 2px solid #E5E7EB;">
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 15px;">Sale Price:</td>
                <td style="padding: 12px 0; color: #003281; font-weight: 700; font-size: 18px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="info-box" style="background-color: #F9FAFB;">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">👤 Buyer Information:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">Name:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ $buyer->name }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Email:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    <a href="mailto:{{ $buyer->email }}" style="color: #003281; text-decoration: none;">
                        {{ $buyer->email }}
                    </a>
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Transaction ID:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Request Date:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ now()->format('d M Y, H:i') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">KYC Status:</td>
                <td style="padding: 8px 0;">
                    <span style="background-color: #10B981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ✓ VERIFIED
                    </span>
                </td>
            </tr>
        </table>
    </div>
    
    <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">📋 Next Steps for You:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">Review the transaction in your dashboard</li>
            <li style="margin-bottom: 8px;">Generate and send the purchase contract to the buyer</li>
            <li style="margin-bottom: 8px;">Wait for buyer payment (held in secure escrow)</li>
            <li style="margin-bottom: 8px;">Prepare vehicle for delivery once payment is confirmed</li>
            <li style="margin-bottom: 8px;">Coordinate delivery or pickup with the buyer</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/admin/transactions/{{ $transaction->id }}" class="button button-primary" style="margin-right: 8px;">
            📊 View Transaction
        </a>
        <a href="{{ config('app.frontend_url') }}/en/admin/transactions/{{ $transaction->id }}/contract" class="button button-success">
            📄 Generate Contract
        </a>
    </div>
    
    <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #065F46; font-weight: 600; font-size: 14px;">🛡️ Seller Protection:</p>
        <p style="margin: 8px 0 0 0; color: #047857; font-size: 13px; line-height: 1.6;">
            The buyer's payment will be held securely in escrow until you mark the vehicle as delivered. This ensures you're protected throughout the entire transaction process.
        </p>
    </div>
    
    <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; color: #991B1B; font-weight: 600; font-size: 14px;">⚡ Time-Sensitive Action:</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            Please respond within 48 hours. If no action is taken, this request may expire and the buyer may look at alternative options.
        </p>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">💰 Payment Timeline:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Buyer makes payment (held in escrow)</li>
            <li style="margin-bottom: 6px;">You prepare and deliver the vehicle</li>
            <li style="margin-bottom: 6px;">Buyer confirms successful delivery</li>
            <li style="margin-bottom: 6px;">Funds are released to your account (minus platform fee)</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions about this transaction? Our seller support team is ready to help at 
        <a href="mailto:sellers@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            sellers@autoscout24safetrade.com
        </a>
        or general support at
        <a href="mailto:support@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            support@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Good luck with your sale!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
