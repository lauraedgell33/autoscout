<?php

namespace App\Services;

use App\Models\Review;
use App\Models\ReviewFlag;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReviewVerificationService
{
    /**
     * List of blacklisted profanity words
     */
    private array $profanityBlacklist = [
        'fuck', 'shit', 'damn', 'bitch', 'asshole', 'bastard', 'crap',
        'piss', 'dick', 'cock', 'pussy', 'cunt', 'slut', 'whore'
    ];

    /**
     * Attempt to auto-verify a review based on transaction history
     */
    public function autoVerify(Review $review): bool
    {
        try {
            // Check if user completed a transaction with this vehicle
            if (!$this->hasCompletedTransaction($review)) {
                Log::info('Review auto-verification failed: No completed transaction', [
                    'review_id' => $review->id,
                    'user_id' => $review->reviewer_id,
                    'vehicle_id' => $review->vehicle_id
                ]);
                return false;
            }

            // Check if review is within 90 days of transaction completion
            if (!$this->isWithinTimeframe($review)) {
                Log::info('Review auto-verification failed: Outside 90-day timeframe', [
                    'review_id' => $review->id
                ]);
                return false;
            }

            // Pass automated content screening
            if (!$this->passesAutomatedScreening($review)) {
                Log::info('Review auto-verification failed: Did not pass content screening', [
                    'review_id' => $review->id
                ]);
                return false;
            }

            // All checks passed - auto-verify
            $review->update([
                'verified' => true,
                'verified_at' => now(),
                'verification_method' => 'transaction',
                'moderation_status' => 'approved',
                'moderated_at' => now(),
            ]);

            Log::info('Review auto-verified successfully', [
                'review_id' => $review->id
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error during review auto-verification', [
                'review_id' => $review->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Check if user has completed transaction with the vehicle
     */
    private function hasCompletedTransaction(Review $review): bool
    {
        if (!$review->transaction_id || !$review->vehicle_id) {
            return false;
        }

        $transaction = Transaction::where('id', $review->transaction_id)
            ->where('vehicle_id', $review->vehicle_id)
            ->where(function ($query) use ($review) {
                $query->where('buyer_id', $review->reviewer_id)
                    ->orWhere('seller_id', $review->reviewer_id);
            })
            ->where('status', 'completed')
            ->first();

        return $transaction !== null;
    }

    /**
     * Check if review is within 90 days of transaction completion
     */
    private function isWithinTimeframe(Review $review): bool
    {
        if (!$review->transaction_id) {
            return false;
        }

        $transaction = Transaction::find($review->transaction_id);
        
        if (!$transaction || !$transaction->completed_at) {
            return false;
        }

        $daysSinceCompletion = Carbon::parse($transaction->completed_at)->diffInDays(now());
        
        return $daysSinceCompletion <= 90;
    }

    /**
     * Perform automated content screening
     */
    public function passesAutomatedScreening(Review $review): bool
    {
        $comment = strtolower($review->comment ?? '');

        // Check minimum length (20 characters)
        if (strlen(trim($comment)) < 20) {
            return false;
        }

        // Check profanity filter
        foreach ($this->profanityBlacklist as $word) {
            if (str_contains($comment, $word)) {
                return false;
            }
        }

        // Check for spam patterns (repeated characters)
        if (preg_match('/(.)\1{10,}/', $comment)) {
            return false;
        }

        // Check for excessive URLs (max 2)
        $urlCount = preg_match_all('/https?:\/\/[^\s]+/', $comment);
        if ($urlCount > 2) {
            return false;
        }

        return true;
    }

    /**
     * Manually verify a review (admin action)
     */
    public function manualVerify(Review $review, User $admin, string $notes = ''): bool
    {
        try {
            $review->update([
                'verified' => true,
                'verified_at' => now(),
                'verification_method' => 'manual',
                'moderation_status' => 'approved',
                'moderation_notes' => $notes,
                'moderated_by' => $admin->id,
                'moderated_at' => now(),
                'flagged' => false,
            ]);

            Log::info('Review manually verified', [
                'review_id' => $review->id,
                'admin_id' => $admin->id
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error during manual review verification', [
                'review_id' => $review->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Reject a review (admin action)
     */
    public function reject(Review $review, User $admin, string $reason): bool
    {
        try {
            $review->update([
                'verified' => false,
                'moderation_status' => 'rejected',
                'moderation_notes' => $reason,
                'moderated_by' => $admin->id,
                'moderated_at' => now(),
            ]);

            Log::info('Review rejected', [
                'review_id' => $review->id,
                'admin_id' => $admin->id,
                'reason' => $reason
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error during review rejection', [
                'review_id' => $review->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Flag a review
     */
    public function flag(Review $review, User $user, string $reason, string $details = ''): bool
    {
        try {
            // Check if user already flagged this review
            $existingFlag = ReviewFlag::where('review_id', $review->id)
                ->where('user_id', $user->id)
                ->first();

            if ($existingFlag) {
                return false;
            }

            // Create flag
            ReviewFlag::create([
                'review_id' => $review->id,
                'user_id' => $user->id,
                'reason' => $reason,
                'details' => $details,
                'ip_address' => request()->ip(),
            ]);

            // Increment flag count
            $review->increment('flag_count');

            // Auto-flag if threshold reached (3 flags)
            if ($review->flag_count >= 3) {
                $review->update([
                    'flagged' => true,
                    'moderation_status' => 'flagged',
                ]);

                Log::warning('Review auto-flagged due to multiple reports', [
                    'review_id' => $review->id,
                    'flag_count' => $review->flag_count
                ]);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error flagging review', [
                'review_id' => $review->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Calculate user trust score based on review history
     */
    public function calculateUserTrustScore(User $user): float
    {
        $reviews = Review::where('reviewer_id', $user->id)->get();

        if ($reviews->isEmpty()) {
            return 0.0;
        }

        $totalReviews = $reviews->count();
        $verifiedReviews = $reviews->where('verified', true)->count();
        $approvedReviews = $reviews->where('moderation_status', 'approved')->count();
        $rejectedReviews = $reviews->where('moderation_status', 'rejected')->count();

        // Calculate score (0-100)
        $verificationRate = $totalReviews > 0 ? ($verifiedReviews / $totalReviews) : 0;
        $approvalRate = $totalReviews > 0 ? ($approvedReviews / $totalReviews) : 0;
        $rejectionPenalty = $totalReviews > 0 ? ($rejectedReviews / $totalReviews) * 0.5 : 0;

        $score = (($verificationRate * 0.5) + ($approvalRate * 0.5) - $rejectionPenalty) * 100;

        return max(0, min(100, $score));
    }
}
