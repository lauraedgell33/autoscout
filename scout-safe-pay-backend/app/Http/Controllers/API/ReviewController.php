<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
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

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => $averageRating,
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
     * Create a review
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|exists:transactions,id',
            'reviewee_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
            'review_type' => 'required|in:buyer,seller,vehicle',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();
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
            'status' => 'approved', // Auto-approve (can add moderation later)
        ]);

        $review->load(['reviewee:id,name', 'reviewer:id,name']);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review,
        ], 201);
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
            'comment' => 'nullable|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $review->update($request->only(['rating', 'comment']));

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review,
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
     * Get pending reviews (admin only)
     */
    public function pending()
    {
        $reviews = Review::where('status', 'pending')
            ->with(['reviewer:id,name', 'reviewee:id,name', 'transaction.vehicle'])
            ->latest()
            ->paginate(20);

        return response()->json(['reviews' => $reviews]);
    }

    /**
     * Approve/reject review (admin only)
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
            'admin_note' => $request->admin_note,
        ]);

        return response()->json([
            'message' => 'Review moderated successfully',
            'review' => $review,
        ]);
    }
}
