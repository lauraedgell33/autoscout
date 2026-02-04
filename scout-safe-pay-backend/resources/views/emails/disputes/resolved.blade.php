@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✅ Dispute Resolved</h2>
<p class="email-subtitle">Your dispute case has been closed</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>We have completed our review of your dispute case. Below you'll find our resolution decision and the next steps.</p>
    
    <div class="alert-box alert-success" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">✓</div>
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 18px;">Case Resolved</p>
        <p style="margin: 8px 0 0 0; color: #065F46; font-size: 14px;">
            Dispute #{{ $dispute->id }} has been closed
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Case Summary:</p>
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
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Filed On:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $dispute->created_at->format('d M Y') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Resolved On:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    {{ $dispute->resolved_at ? $dispute->resolved_at->format('d M Y') : now()->format('d M Y') }}
                </td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px;">Resolution:</td>
                <td style="padding: 8px 0;">
                    <span class="badge badge-success">{{ ucfirst($dispute->resolution_type ?? 'Resolved') }}</span>
                </td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-info">
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 15px; margin-bottom: 12px;">⚖️ Resolution Decision:</p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; color: #1F2937; font-size: 14px; line-height: 1.7;">
                {{ $dispute->resolution ?? 'The dispute has been resolved based on the evidence provided by both parties. Please see the transaction details for the final outcome.' }}
            </p>
        </div>
    </div>
    
    @if(isset($refundAmount) && $refundAmount > 0)
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 15px; margin-bottom: 8px;">💰 Refund Processed:</p>
        <p style="margin: 0; color: #065F46; font-size: 14px;">
            A refund of <strong>€{{ number_format($refundAmount, 2, ',', '.') }}</strong> has been processed to your account. Please allow 3-5 business days for the funds to appear.
        </p>
    </div>
    @endif
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/disputes/{{ $dispute->id }}" class="button button-primary">
            📊 View Full Details
        </a>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📝 What's Next:</p>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #4B5563; font-size: 13px; line-height: 1.6;">
            @if(isset($refundAmount) && $refundAmount > 0)
            <li style="margin-bottom: 6px;">Your refund will be processed within 3-5 business days</li>
            @endif
            <li style="margin-bottom: 6px;">All case documentation is available in your dispute history</li>
            <li style="margin-bottom: 6px;">You may appeal this decision within 14 days if you disagree</li>
            <li style="margin-bottom: 6px;">Your transaction history has been updated accordingly</li>
        </ul>
    </div>
    
    <div class="alert-box alert-warning">
        <p style="margin: 0; color: #92400E; font-weight: 600; font-size: 14px;">❓ Questions About This Decision?</p>
        <p style="margin: 8px 0 0 0; color: #78350F; font-size: 13px; line-height: 1.6;">
            If you believe we made an error or have new evidence to present, you can submit an appeal within 14 days of this resolution. Contact our dispute team for guidance.
        </p>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Need clarification? Contact our resolution team at 
        <a href="mailto:disputes@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            disputes@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Thank you for your patience during this process.<br>
        <strong>The AutoScout24 SafeTrade Dispute Resolution Team</strong>
    </p>
</div>
@endsection
