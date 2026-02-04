@extends('emails.layouts.base')

@section('content')
<h2 class="email-title">✅ Profile Updated</h2>
<p class="email-subtitle">Your account information has been changed</p>

<div class="email-content">
    <p>Hello <strong>{{ $user->name }}</strong>,</p>
    
    <p>This email confirms that changes have been made to your AutoScout24 SafeTrade profile. If you made these changes, no action is required.</p>
    
    <div class="alert-box alert-info" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: 12px;">👤</div>
        <p style="margin: 0; color: #1E40AF; font-weight: 700; font-size: 18px;">Profile Updated</p>
        <p style="margin: 8px 0 0 0; color: #1E3A8A; font-size: 14px;">
            {{ now()->format('d M Y, H:i') }} UTC
        </p>
    </div>
    
    <div class="card">
        <p style="margin: 0; color: #111827; font-weight: 700; font-size: 16px; margin-bottom: 16px;">📋 Changes Made:</p>
        <table style="width: 100%; border-collapse: collapse;">
            @foreach($changes ?? [] as $field => $change)
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 13px; width: 130px;">{{ ucfirst(str_replace('_', ' ', $field)) }}:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                    <span style="text-decoration: line-through; color: #9CA3AF;">{{ $change['old'] ?? '—' }}</span>
                    →
                    <span style="color: #10B981; font-weight: 600;">{{ $change['new'] ?? '—' }}</span>
                </td>
            </tr>
            @endforeach
            @if(empty($changes))
            <tr>
                <td colspan="2" style="padding: 8px 0; color: #6B7280; font-size: 14px;">
                    Profile information has been updated.
                </td>
            </tr>
            @endif
        </table>
    </div>
    
    <div class="info-box">
        <p style="margin: 0; color: #111827; font-weight: 600; font-size: 14px; margin-bottom: 8px;">📍 Change Details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 4px 0; color: #6B7280; font-size: 13px; width: 100px;">Time:</td>
                <td style="padding: 4px 0; color: #111827; font-size: 13px;">{{ now()->format('d M Y, H:i:s') }} UTC</td>
            </tr>
            <tr>
                <td style="padding: 4px 0; color: #6B7280; font-size: 13px;">IP Address:</td>
                <td style="padding: 4px 0; color: #111827; font-size: 13px; font-family: monospace;">{{ $ipAddress ?? 'Unknown' }}</td>
            </tr>
            <tr>
                <td style="padding: 4px 0; color: #6B7280; font-size: 13px;">Device:</td>
                <td style="padding: 4px 0; color: #111827; font-size: 13px;">{{ $device ?? 'Unknown device' }}</td>
            </tr>
        </table>
    </div>
    
    <div class="alert-box alert-success">
        <p style="margin: 0; color: #047857; font-weight: 700; font-size: 14px;">✓ Was this you?</p>
        <p style="margin: 8px 0 0 0; color: #065F46; font-size: 13px;">
            No action needed - your profile has been successfully updated.
        </p>
    </div>
    
    <div class="alert-box alert-danger">
        <p style="margin: 0; color: #991B1B; font-weight: 700; font-size: 14px;">⚠️ Didn't make these changes?</p>
        <p style="margin: 8px 0 0 0; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            If you didn't make these changes, your account may be compromised. Please:
        </p>
        <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #7F1D1D; font-size: 13px; line-height: 1.6;">
            <li>Change your password immediately</li>
            <li>Review your profile settings</li>
            <li>Contact our security team</li>
        </ol>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
        <a href="{{ config('app.frontend_url') }}/en/profile" class="button button-primary" style="margin-right: 8px;">
            👤 View Profile
        </a>
        <a href="{{ config('app.frontend_url') }}/en/profile/security" class="button button-warning">
            🔒 Security Settings
        </a>
    </div>
    
    <p style="margin-top: 32px; color: #6B7280; font-size: 14px;">
        Questions or security concerns? Contact us at 
        <a href="mailto:security@autoscout24safetrade.com" style="color: #003281; text-decoration: none;">
            security@autoscout24safetrade.com
        </a>
    </p>
    
    <p style="margin-top: 24px;">
        Stay secure!<br>
        <strong>The AutoScout24 SafeTrade Team</strong>
    </p>
</div>
@endsection
