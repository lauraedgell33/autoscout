<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KYCController extends Controller
{
    /**
     * Submit KYC documents
     */
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:50',
            'date_of_birth' => 'required|date|before:today',
            'street' => 'required|string|max:255',
            'house_number' => 'required|string|max:50',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|size:2',
            'id_document_type' => 'required|in:passport,id_card,drivers_license',
            'id_document_number' => 'required|string|max:50',
            'id_document_image' => 'required|image|max:10240', // 10MB
            'selfie_image' => 'required|image|max:10240', // 10MB
        ]);

        $user = $request->user();

        // Check if user is dealer (dealers don't need KYC)
        if ($user->dealer_id) {
            return response()->json([
                'message' => 'Dealers do not require KYC verification'
            ], 400);
        }

        // Check if already verified
        if ($user->kyc_status === 'approved') {
            return response()->json([
                'message' => 'KYC already verified'
            ], 400);
        }

        // Store ID document image
        $idDocumentPath = $request->file('id_document_image')->store(
            "kyc/{$user->id}/documents",
            'public'
        );

        // Store selfie image
        $selfiePath = $request->file('selfie_image')->store(
            "kyc/{$user->id}/selfies",
            'public'
        );

        // Update user with all KYC data
        $user->update([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'date_of_birth' => $validated['date_of_birth'],
            'street' => $validated['street'],
            'house_number' => $validated['house_number'],
            'city' => $validated['city'],
            'postal_code' => $validated['postal_code'],
            'country' => $validated['country'],
            'id_document_type' => $validated['id_document_type'],
            'id_document_number' => $validated['id_document_number'],
            'id_document_image' => $idDocumentPath,
            'selfie_image' => $selfiePath,
            'kyc_status' => 'pending',
            'kyc_submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'KYC documents submitted successfully. Awaiting verification.',
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Get KYC status
     */
    public function status(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'kyc_status' => $user->kyc_status,
            'kyc_submitted_at' => $user->kyc_submitted_at,
            'kyc_verified_at' => $user->kyc_verified_at,
            'is_dealer' => $user->dealer_id !== null,
            'requires_kyc' => $user->dealer_id === null,
        ]);
    }

    /**
     * Verify KYC (Admin only)
     */
    public function verify(Request $request, $userId)
    {
        $validated = $request->validate([
            'approved' => 'required|boolean',
            'notes' => 'nullable|string|max:500',
        ]);

        $admin = $request->user();
        
        // Check if admin
        if ($admin->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = \App\Models\User::findOrFail($userId);

        if ($validated['approved']) {
            $user->update([
                'kyc_status' => 'approved',
                'kyc_verified_at' => now(),
                'kyc_verified_by' => $admin->id,
                'is_verified' => true,
            ]);

            // Send approval notification
            $user->notify(new \App\Notifications\KYCApprovedNotification());

            // Send approval email
            EmailNotificationService::sendKYCResult($user, 'verified');

            $message = 'KYC approved successfully';
        } else {
            $rejectionReason = $validated['notes'] ?? 'Documents did not meet verification requirements';
            
            $user->update([
                'kyc_status' => 'rejected',
                'kyc_rejection_reason' => $rejectionReason,
                'kyc_verified_at' => now(),
                'kyc_verified_by' => $admin->id,
                // Clear images so user can resubmit
                'id_document_image' => null,
                'selfie_image' => null,
            ]);

            // Send rejection notification
            $user->notify(new \App\Notifications\KYCRejectedNotification($rejectionReason));

            // Send rejection email
            EmailNotificationService::sendKYCResult($user, 'rejected', $rejectionReason);

            $message = 'KYC rejected. User can resubmit.';
        }

        return response()->json([
            'message' => $message,
            'user' => $user->fresh(),
        ]);
    }

    /**
     * Get pending KYC submissions (Admin only)
     */
    public function pending(Request $request)
    {
        $admin = $request->user();
        
        if ($admin->user_type !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = \App\Models\User::where('kyc_status', 'pending')
            ->whereNotNull('kyc_submitted_at')
            ->orderBy('kyc_submitted_at', 'desc')
            ->paginate(20);

        return response()->json($users);
    }
}
