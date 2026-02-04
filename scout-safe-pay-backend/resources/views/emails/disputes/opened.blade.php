@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">⚠️ Dispute Case Opened</h2>
<p class="email-subtitle">A dispute has been filed for your transaction</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>A dispute has been opened regarding transaction #{{ $transaction->id }}. Our support team will review the case and work with both parties to reach a fair resolution.</p>
    
    <div class="alert-box alert-warning" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
        <p style="margin: 0; color: #92400E; font-weight: 700; font-size: 18px;">Dispute Case #{{ $dispute->id }}</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 14px;">
            Status: <span class="badge badge-warning">Under Review</span>
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Dispute Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">Case ID:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px; font-family: monospace;">
                    #{{ $dispute->id }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Transaction:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">
                    #{{ $transaction->id }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Vehicle:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 600; font-size: 14px;">
                    {{ $vehicle->make }} {{ $vehicle->model }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Amount:</td>
                <td style="padding: 8px 0; color: #003281; font-weight: 700; font-size: 15px;">
                    €{{ number_format($transaction->amount, 2, ',', '.') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Filed On:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $dispute->created_at->format('d M Y, H:i') }}
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-danger">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 15px; margin-bottom: 8px;">📝 Reason for Dispute:</p>
        <p style="margin: 0; color: #7F1D1D; font-size: 14px; line-height: 1.6;">
            {{ $dispute->reason }}
        </p>
        @if($dispute->description)
        <div style="background-color: #ffffff; padding: 12px; border-radius: 8px; margin-top: 12px;">
            <p style="margin: 0; color: #1F2937; font-size: 13px; line-height: 1.6;">
                "{{ $dispute->description }}"
            </p>
        </div>
        @endif
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">🔄 What Happens Next:</p>
        <ol style="margin: 0; padding-left: 20px; color: #1E3A8A; font-size: 14px; line-height: 1.8;">
            <li style="margin-bottom: 8px;">Our team will review all transaction details and evidence</li>
            <li style="margin-bottom: 8px;">Both parties may be contacted for additional information</li>
            <li style="margin-bottom: 8px;">A resolution will be proposed within 5-7 business days</li>
            <li style="margin-bottom: 8px;">Funds remain in escrow until the dispute is resolved</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/disputes/{{ $dispute->id }}" class="button button-primary" style="margin-right: 8px;">
            📊 View Dispute
        </a>
        <a href="{{ config('app.frontend_url') }}/en/disputes/{{ $dispute->id }}/respond" class="button button-warning">
            💬 Respond
        </a>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">💡 Tips for Resolution:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            <li style="margin-bottom: 6px;">Provide clear evidence to support your position</li>
            <li style="margin-bottom: 6px;">Keep all communication professional and factual</li>
            <li style="margin-bottom: 6px;">Respond promptly to requests from our team</li>
            <li style="margin-bottom: 6px;">Consider reasonable compromise solutions</li>
        </ul>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Need help with your dispute? Contact our resolution team at 
        <a href="mailto:disputes@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            disputes@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        We're here to help!<br>
        <strong>The AutoScout24 SafeTrade Dispute Resolution Team</strong>
    </p>
</div>
@endsection
