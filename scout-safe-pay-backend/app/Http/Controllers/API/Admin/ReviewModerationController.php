<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewFlag;
use App\Services\ReviewVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewModerationController extends Controller
{
    protected ReviewVerificationService $verificationService;

    public function __construct(ReviewVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Get pending reviews for moderation
     */
    public function pending(Request $request)
    {
        $reviews = Review::pending()
            ->with([
                'reviewer:id,name,email',
                'reviewee:id,name',
                'vehicle:id,make,model,year',
                'transaction:id,transaction_code,status'
            ])
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json($reviews);
    }

    /**
     * Get flagged reviews
     */
    public function flagged(Request $request)
    {
        $reviews = Review::flagged()
            ->with([
                'reviewer:id,name,email',
                'reviewee:id,name',
                'vehicle:id,make,model,year',
                'flags.user:id,name',
                'transaction:id,transaction_code'
            ])
            ->latest('updated_at')
            ->paginate($request->get('per_page', 20));

        return response()->json($reviews);
    }

    /**
     * Manually verify a review
     */
    public function verify(Request $request, Review $review)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $admin = auth()->user();
        $notes = $request->get('notes', '');

        $verified = $this->verificationService->manualVerify($review, $admin, $notes);

        if (!$verified) {
            return response()->json([
                'message' => 'Failed to verify review'
            ], 500);
        }

        return response()->json([
            'message' => 'Review verified successfully',
            'review' => $review->fresh()->load(['reviewer:id,name', 'moderator:id,name'])
        ]);
    }

    /**
     * Reject a review
     */
    public function reject(Request $request, Review $review)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|min:10|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $admin = auth()->user();
        $reason = $request->get('reason');

        $rejected = $this->verificationService->reject($review, $admin, $reason);

        if (!$rejected) {
            return response()->json([
                'message' => 'Failed to reject review'
            ], 500);
        }

        return response()->json([
            'message' => 'Review rejected successfully',
            'review' => $review->fresh()->load(['reviewer:id,name', 'moderator:id,name'])
        ]);
    }

    /**
     * Get review moderation statistics
     */
    public function statistics()
    {
        $stats = [
            'total_reviews' => Review::count(),
            'verified_reviews' => Review::verified()->count(),
            'pending_reviews' => Review::pending()->count(),
            'flagged_reviews' => Review::flagged()->count(),
            'rejected_reviews' => Review::where('moderation_status', 'rejected')->count(),
            'approved_reviews' => Review::approved()->count(),
            
            'verification_rate' => $this->calculateVerificationRate(),
            'auto_verification_rate' => $this->calculateAutoVerificationRate(),
            
            'total_flags' => ReviewFlag::count(),
            'unique_flagged_reviews' => Review::flagged()->count(),
            
            'reviews_by_verification_method' => Review::selectRaw('verification_method, COUNT(*) as count')
                ->groupBy('verification_method')
                ->pluck('count', 'verification_method')
                ->toArray(),
            
            'reviews_by_moderation_status' => Review::selectRaw('moderation_status, COUNT(*) as count')
                ->groupBy('moderation_status')
                ->pluck('count', 'moderation_status')
                ->toArray(),
            
            'recent_activity' => [
                'reviews_last_24h' => Review::where('created_at', '>=', now()->subDay())->count(),
                'verified_last_24h' => Review::where('verified_at', '>=', now()->subDay())->count(),
                'flagged_last_24h' => ReviewFlag::where('created_at', '>=', now()->subDay())->count(),
            ],
            
            'top_flag_reasons' => ReviewFlag::selectRaw('reason, COUNT(*) as count')
                ->groupBy('reason')
                ->orderByDesc('count')
                ->limit(5)
                ->pluck('count', 'reason')
                ->toArray(),
        ];

        return response()->json($stats);
    }

    /**
     * Calculate overall verification rate
     */
    private function calculateVerificationRate(): float
    {
        $total = Review::count();
        if ($total === 0) {
            return 0.0;
        }
        
        $verified = Review::verified()->count();
        return round(($verified / $total) * 100, 2);
    }

    /**
     * Calculate auto-verification rate
     */
    private function calculateAutoVerificationRate(): float
    {
        $total = Review::count();
        if ($total === 0) {
            return 0.0;
        }
        
        $autoVerified = Review::where('verification_method', 'transaction')->count();
        return round(($autoVerified / $total) * 100, 2);
    }
}
