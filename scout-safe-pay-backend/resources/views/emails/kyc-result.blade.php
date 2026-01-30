@component('mail::message')
# KYC Verification Result

Hello {{ $user->name }},

## {{ $statusLabel }}

We have completed the review of your KYC (Know Your Customer) verification documents.

@if($isApproved)
**Result:** ✅ Approved

Your identity verification has been successfully completed and approved. You now have full access to all platform features including:
- Buying and selling vehicles
- Making transactions
- Using payment methods
- Accessing all seller/buyer tools

You can now start using all features of {{ config('app.name') }} without restrictions.
@elseif($isRejected)
**Result:** ❌ Rejected

Unfortunately, your KYC verification was not approved for the following reason:

{{ $rejectionReason }}

**What you can do:**
1. Review the rejection reason above
2. Prepare the corrected documents
3. Resubmit your KYC verification

We're here to help! If you believe this was an error or need clarification, please contact our support team.
@else
**Status:** Pending Review

Your KYC verification documents have been received and are currently under review. We will notify you as soon as the review is complete.

**What to expect:**
- Review time: 1-3 business days
- You'll receive an email notification with the results
- If documents are needed, we'll contact you for resubmission
@endif

@component('mail::button', ['url' => $actionUrl])
@if($isRejected)
Resubmit KYC
@else
View Account
@endif
@endcomponent

If you have any questions about your KYC verification, please reply to this email or contact our support team at support@{{ config('app.url') }}.

Best regards,  
{{ config('app.name') }} Verification Team
@endcomponent
