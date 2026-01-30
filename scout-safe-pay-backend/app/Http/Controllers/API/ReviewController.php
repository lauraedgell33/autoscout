<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewHelpfulVote;
use App\Models\Transaction;
use App\Models\User;
use App\Services\ReviewVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    protected ReviewVerificationService $verificationService;

    public function __construct(ReviewVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    /**
     * Get reviews with filters
     */
    public function index(Request $request)
    {
        $query = Review::query();

        // Filter by verified only
        if ($request->boolean('verified_only')) {
            $query->verified();
        }

        // Filter by reviewable type and ID
        if ($request->has('reviewable_type') && $request->has('reviewable_id')) {
            switch ($request->reviewable_type) {
                case 'vehicle':
                    $query->where('vehicle_id', $request->reviewable_id);
                    break;
                case 'user':
                    $query->forUser($request->reviewable_id);
                    break;
            }
        }

        // Only show approved reviews to public
        $query->approved();

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        switch ($sortBy) {
            case 'helpful':
                $query->orderBy('helpful_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            default:
                $query->latest();
        }

        // Load relationships
        $query->with(['reviewer:id,name', 'vehicle:id,make,model,year']);

        $reviews = $query->paginate(15);

        return response()->json($reviews);
    }

    /**
     * Get reviews for a user
     */
    public function getUserReviews($userId)
    {
        $reviews = Review::approved()
            ->forUser($userId)
            ->with(['reviewer:id,name', 'transaction.vehicle:id,make,model,year'])
            ->latest()
            ->paginate(15);

        $stats = [
            'average_rating' => Review::getAverageRatingForUser($userId),
            'total_reviews' => Review::getReviewCountForUser($userId),
            'verified_count' => Review::approved()->verified()->forUser($userId)->count(),
            'rating_breakdown' => Review::approved()
                ->forUser($userId)
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray(),
        ];

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Get reviews for a vehicle
     */
    public function getVehicleReviews($vehicleId)
    {
        $reviews = Review::approved()
            ->where('vehicle_id', $vehicleId)
            ->where('review_type', 'vehicle')
            ->with(['reviewer:id,name', 'transaction:id,amount'])
            ->latest()
            ->paginate(15);

        $averageRating = Review::approved()
            ->where('vehicle_id', $vehicleId)
            ->where('review_type', 'vehicle')
            ->avg('rating') ?? 0.0;

        $verifiedCount = Review::approved()
            ->verified()
            ->where('vehicle_id', $vehicleId)
            ->where('review_type', 'vehicle')
            ->count();

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $averageRating,
            'verified_count' => $verifiedCount,
        ]);
    }

    /**
     * Get reviews by authenticated user
     */
    public function myReviews()
    {
        $userId = auth()->id();

        $reviews = Review::byUser($userId)
            ->with(['reviewee:id,name', 'transaction.vehicle:id,make,model'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'reviews' => $reviews,
        ]);
    }

    /**
     * Create a review with auto-verification
     */
    public function store(Request $request)
    {
        $userId = auth()->id();

        // Rate limiting: max 5 reviews per day
        $key = 'reviews:' . $userId;
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Too many reviews submitted. Please try again later.',
                'retry_after' => $seconds,
            ], 429);
        }

        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|exists:transactions,id',
            'reviewee_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:20|max:1000',
            'review_type' => 'required|in:buyer,seller,vehicle',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $transaction = Transaction::findOrFail($request->transaction_id);

        // Verify user is part of the transaction
        if ($transaction->buyer_id !== $userId && $transaction->seller_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if review already exists
        $existingReview = Review::where('transaction_id', $request->transaction_id)
            ->where('reviewer_id', $userId)
            ->where('review_type', $request->review_type)
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already submitted a review for this transaction'
            ], 422);
        }

        // Create review
        $review = Review::create([
            'transaction_id' => $request->transaction_id,
            'reviewer_id' => $userId,
            'reviewee_id' => $request->reviewee_id,
            'vehicle_id' => $transaction->vehicle_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'review_type' => $request->review_type,
            'status' => 'approved', // Keep for backwards compatibility
            'moderation_status' => 'pending', // New status
        ]);

        // Attempt auto-verification
        $autoVerified = $this->verificationService->autoVerify($review);

        // Increment rate limiter
        RateLimiter::hit($key, 86400); // 24 hours

        $review->load(['reviewee:id,name', 'reviewer:id,name']);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review->fresh(),
            'auto_verified' => $autoVerified,
        ], 201);
    }

    /**
     * Flag a review
     */
    public function flag(Request $request, Review $review)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|in:spam,inappropriate,fake,offensive,misleading,other',
            'details' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        
        $flagged = $this->verificationService->flag(
            $review,
            $user,
            $request->reason,
            $request->details ?? ''
        );

        if (!$flagged) {
            return response()->json([
                'message' => 'You have already flagged this review'
            ], 422);
        }

        return response()->json([
            'message' => 'Review flagged successfully'
        ]);
    }

    /**
     * Vote on review helpfulness
     */
    public function vote(Request $request, Review $review)
    {
        $validator = Validator::make($request->all(), [
            'is_helpful' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();

        // Check if already voted
        $existingVote = ReviewHelpfulVote::where('review_id', $review->id)
            ->where('user_id', $userId)
            ->first();

        if ($existingVote) {
            // Update existing vote if different
            if ($existingVote->is_helpful !== $request->boolean('is_helpful')) {
                // Decrement old counter
                if ($existingVote->is_helpful) {
                    $review->decrement('helpful_count');
                } else {
                    $review->decrement('not_helpful_count');
                }

                // Increment new counter
                if ($request->boolean('is_helpful')) {
                    $review->increment('helpful_count');
                } else {
                    $review->increment('not_helpful_count');
                }

                $existingVote->update(['is_helpful' => $request->boolean('is_helpful')]);
            }
        } else {
            // Create new vote
            ReviewHelpfulVote::create([
                'review_id' => $review->id,
                'user_id' => $userId,
                'is_helpful' => $request->boolean('is_helpful'),
            ]);

            // Increment counter
            if ($request->boolean('is_helpful')) {
                $review->increment('helpful_count');
            } else {
                $review->increment('not_helpful_count');
            }
        }

        return response()->json([
            'message' => 'Vote recorded successfully',
            'helpful_count' => $review->fresh()->helpful_count,
            'not_helpful_count' => $review->fresh()->not_helpful_count,
        ]);
    }

    /**
     * Update a review
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // Only reviewer can update their own review
        if ($review->reviewer_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|min:20|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $review->update($request->only(['rating', 'comment']));

        // Re-attempt auto-verification if comment changed
        if ($request->has('comment')) {
            $this->verificationService->autoVerify($review);
        }

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review->fresh(),
        ]);
    }

    /**
     * Delete a review
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        // Only reviewer can delete their own review
        if ($review->reviewer_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ]);
    }

    /**
     * Get pending reviews (admin only) - kept for backwards compatibility
     */
    public function pending()
    {
        $reviews = Review::pending()
            ->with(['reviewer:id,name', 'reviewee:id,name', 'transaction.vehicle'])
            ->latest()
            ->paginate(20);

        return response()->json(['reviews' => $reviews]);
    }

    /**
     * Approve/reject review (admin only) - kept for backwards compatibility
     */
    public function moderate(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $review = Review::findOrFail($id);
        $review->update([
            'status' => $request->status,
            'moderation_status' => $request->status,
            'admin_note' => $request->admin_note,
            'moderation_notes' => $request->admin_note,
            'moderated_by' => auth()->id(),
            'moderated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Review moderated successfully',
            'review' => $review,
        ]);
    }
}
