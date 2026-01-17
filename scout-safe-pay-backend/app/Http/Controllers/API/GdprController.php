<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use ZipArchive;

class GdprController extends Controller
{
    /**
     * Export all user data (GDPR Article 15 - Right of Access)
     */
    public function exportData(Request $request): JsonResponse
    {
        $user = $request->user();
        
        try {
            // Gather all user data
            $userData = $this->gatherUserData($user);
            
            // Create JSON export
            $jsonData = json_encode($userData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
            // Store temporarily
            $filename = "user_data_{$user->id}_" . now()->format('Y-m-d_His') . '.json';
            $path = "exports/{$filename}";
            Storage::put($path, $jsonData);
            
            // Generate download URL (expires in 1 hour)
            $downloadUrl = Storage::temporaryUrl($path, now()->addHour());
            
            // Log export request
            Log::info('GDPR data export requested', ['user_id' => $user->id]);
            
            return response()->json([
                'message' => 'Your data export is ready',
                'download_url' => $downloadUrl,
                'expires_at' => now()->addHour()->toIso8601String(),
                'file_size' => strlen($jsonData),
            ]);
            
        } catch (\Exception $e) {
            Log::error('GDPR data export failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            
            return response()->json([
                'message' => 'Failed to export data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Request account deletion (GDPR Article 17 - Right to Erasure)
     */
    public function requestDeletion(Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
            'reason' => 'nullable|string|max:500',
        ]);
        
        $user = $request->user();
        
        // Verify password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid password',
            ], 401);
        }
        
        // Check for active transactions
        $activeTransactions = $user->buyerTransactions()
            ->whereIn('status', ['pending', 'payment_uploaded', 'payment_verified', 'vehicle_delivered'])
            ->count();
            
        $activeTransactions += $user->sellerTransactions()
            ->whereIn('status', ['pending', 'payment_uploaded', 'payment_verified', 'vehicle_delivered'])
            ->count();
            
        if ($activeTransactions > 0) {
            return response()->json([
                'message' => 'Cannot delete account with active transactions',
                'active_transactions' => $activeTransactions,
                'details' => 'Please complete or cancel all active transactions before deleting your account.',
            ], 422);
        }
        
        // Mark account for deletion (30-day grace period)
        $user->update([
            'deletion_requested_at' => now(),
            'deletion_reason' => $request->reason,
            'deletion_scheduled_at' => now()->addDays(30),
        ]);
        
        // Log deletion request
        Log::warning('GDPR account deletion requested', [
            'user_id' => $user->id,
            'email' => $user->email,
            'reason' => $request->reason,
        ]);
        
        // Send confirmation email
        $user->notify(new \App\Notifications\AccountDeletionRequested());
        
        return response()->json([
            'message' => 'Account deletion requested',
            'deletion_scheduled_at' => $user->deletion_scheduled_at->toIso8601String(),
            'grace_period_days' => 30,
            'notice' => 'You have 30 days to cancel this request. After that, your account will be permanently deleted.',
        ]);
    }
    
    /**
     * Cancel account deletion request
     */
    public function cancelDeletion(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if (!$user->deletion_requested_at) {
            return response()->json([
                'message' => 'No deletion request found',
            ], 404);
        }
        
        $user->update([
            'deletion_requested_at' => null,
            'deletion_reason' => null,
            'deletion_scheduled_at' => null,
        ]);
        
        Log::info('GDPR account deletion cancelled', ['user_id' => $user->id]);
        
        return response()->json([
            'message' => 'Account deletion request cancelled successfully',
        ]);
    }
    
    /**
     * Get privacy settings
     */
    public function getPrivacySettings(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'data_retention_days' => config('gdpr.data_retention_days', 2555), // 7 years default
            'can_export_data' => true,
            'can_delete_account' => !$this->hasActiveTransactions($user),
            'marketing_consent' => $user->marketing_consent ?? false,
            'data_sharing_consent' => $user->data_sharing_consent ?? false,
            'deletion_requested' => $user->deletion_requested_at !== null,
            'deletion_scheduled_at' => $user->deletion_scheduled_at?->toIso8601String(),
        ]);
    }
    
    /**
     * Update consent preferences
     */
    public function updateConsent(Request $request): JsonResponse
    {
        $request->validate([
            'marketing_consent' => 'required|boolean',
            'data_sharing_consent' => 'required|boolean',
        ]);
        
        $user = $request->user();
        
        $user->update([
            'marketing_consent' => $request->marketing_consent,
            'data_sharing_consent' => $request->data_sharing_consent,
            'consent_updated_at' => now(),
        ]);
        
        // Log consent changes
        Log::info('User consent updated', [
            'user_id' => $user->id,
            'marketing' => $request->marketing_consent,
            'data_sharing' => $request->data_sharing_consent,
        ]);
        
        return response()->json([
            'message' => 'Consent preferences updated successfully',
            'marketing_consent' => $user->marketing_consent,
            'data_sharing_consent' => $user->data_sharing_consent,
        ]);
    }
    
    /**
     * Gather all user data for export
     */
    private function gatherUserData($user): array
    {
        return [
            'export_date' => now()->toIso8601String(),
            'user_info' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'user_type' => $user->user_type,
                'country' => $user->country,
                'created_at' => $user->created_at->toIso8601String(),
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'kyc_status' => $user->kyc_status,
                'kyc_verified' => $user->kyc_verified,
            ],
            'transactions' => [
                'as_buyer' => $user->buyerTransactions->map(fn($t) => [
                    'id' => $t->id,
                    'reference_number' => $t->reference_number,
                    'status' => $t->status,
                    'amount' => $t->total_amount,
                    'created_at' => $t->created_at->toIso8601String(),
                    'vehicle_id' => $t->vehicle_id,
                ]),
                'as_seller' => $user->sellerTransactions->map(fn($t) => [
                    'id' => $t->id,
                    'reference_number' => $t->reference_number,
                    'status' => $t->status,
                    'amount' => $t->total_amount,
                    'created_at' => $t->created_at->toIso8601String(),
                    'vehicle_id' => $t->vehicle_id,
                ]),
            ],
            'vehicles' => $user->vehicles->map(fn($v) => [
                'id' => $v->id,
                'make' => $v->make,
                'model' => $v->model,
                'year' => $v->year,
                'price' => $v->price,
                'status' => $v->status,
                'created_at' => $v->created_at->toIso8601String(),
            ]),
            'notifications' => $user->notifications->map(fn($n) => [
                'type' => $n->type,
                'data' => $n->data,
                'read_at' => $n->read_at?->toIso8601String(),
                'created_at' => $n->created_at->toIso8601String(),
            ]),
            'consents' => [
                'marketing_consent' => $user->marketing_consent,
                'data_sharing_consent' => $user->data_sharing_consent,
                'consent_updated_at' => $user->consent_updated_at?->toIso8601String(),
            ],
            'activity_log' => \Spatie\Activitylog\Models\Activity::where('causer_id', $user->id)
                ->latest()
                ->limit(100)
                ->get()
                ->map(fn($a) => [
                    'description' => $a->description,
                    'properties' => $a->properties,
                    'created_at' => $a->created_at->toIso8601String(),
                ]),
        ];
    }
    
    private function hasActiveTransactions($user): bool
    {
        $activeStatuses = ['pending', 'payment_uploaded', 'payment_verified', 'vehicle_delivered'];
        
        return $user->buyerTransactions()->whereIn('status', $activeStatuses)->exists()
            || $user->sellerTransactions()->whereIn('status', $activeStatuses)->exists();
    }
}
