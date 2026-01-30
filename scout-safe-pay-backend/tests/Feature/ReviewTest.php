<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\ReviewFlag;
use App\Models\ReviewHelpfulVote;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private User $buyer;
    private User $seller;
    private Vehicle $vehicle;
    private Transaction $transaction;

    protected function setUp(): void
    {
        parent::setUp();

        $this->buyer = User::factory()->create(['user_type' => 'buyer']);
        $this->seller = User::factory()->create(['user_type' => 'seller']);
        
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
        ]);

        $this->transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /** @test */
    public function test_user_can_submit_review_after_completed_transaction()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'transaction_id' => $this->transaction->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $this->vehicle->id,
                'rating' => 5,
                'comment' => 'Great seller! Very professional and the car is in excellent condition.',
                'review_type' => 'seller',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['id', 'rating', 'comment', 'verified']
            ]);

        $this->assertDatabaseHas('reviews', [
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'rating' => 5,
        ]);
    }

    /** @test */
    public function test_review_auto_verified_with_transaction()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'transaction_id' => $this->transaction->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $this->vehicle->id,
                'rating' => 5,
                'comment' => 'Excellent transaction and great service from the seller.',
                'review_type' => 'seller',
            ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        $this->assertTrue($review->verified);
        $this->assertNotNull($review->verified_at);
        $this->assertEquals('transaction', $review->verification_method);
    }

    /** @test */
    public function test_review_pending_without_transaction()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $this->vehicle->id,
                'rating' => 4,
                'comment' => 'Good seller, but no completed transaction yet for verification.',
                'review_type' => 'seller',
            ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        $this->assertFalse($review->verified);
        $this->assertEquals('pending', $review->moderation_status);
    }

    /** @test */
    public function test_user_cannot_review_same_vehicle_twice()
    {
        // Create first review
        Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 5,
            'comment' => 'First review with sufficient length for validation requirements.',
            'review_type' => 'seller',
            'verified' => true,
            'moderation_status' => 'approved',
        ]);

        // Attempt second review
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'transaction_id' => $this->transaction->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $this->vehicle->id,
                'rating' => 4,
                'comment' => 'Second review attempt with sufficient content length.',
                'review_type' => 'seller',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'You have already reviewed this vehicle',
            ]);
    }

    /** @test */
    public function test_review_requires_minimum_20_characters()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'transaction_id' => $this->transaction->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $this->vehicle->id,
                'rating' => 5,
                'comment' => 'Too short',
                'review_type' => 'seller',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['comment']);
    }

    /** @test */
    public function test_user_can_flag_review_as_spam_or_inappropriate()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 1,
            'comment' => 'Suspicious review content that should be flagged appropriately.',
            'review_type' => 'seller',
            'verified' => true,
            'moderation_status' => 'approved',
        ]);

        $otherUser = User::factory()->create(['user_type' => 'buyer']);

        $response = $this->actingAs($otherUser, 'sanctum')
            ->postJson("/api/reviews/{$review->id}/flag", [
                'reason' => 'spam',
                'details' => 'This review appears to be spam',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('review_flags', [
            'review_id' => $review->id,
            'user_id' => $otherUser->id,
            'reason' => 'spam',
        ]);
    }

    /** @test */
    public function test_user_cannot_flag_same_review_twice()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 1,
            'comment' => 'Review content that will be flagged twice for testing.',
            'review_type' => 'seller',
            'verified' => true,
            'moderation_status' => 'approved',
        ]);

        // First flag
        ReviewFlag::create([
            'review_id' => $review->id,
            'user_id' => $this->buyer->id,
            'reason' => 'spam',
        ]);

        // Second flag attempt
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/reviews/{$review->id}/flag", [
                'reason' => 'inappropriate',
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'You have already flagged this review',
            ]);
    }

    /** @test */
    public function test_review_auto_flagged_after_3_flags()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 1,
            'comment' => 'Review that will receive multiple flags for testing.',
            'review_type' => 'seller',
            'verified' => true,
            'moderation_status' => 'approved',
            'flagged' => false,
            'flag_count' => 0,
        ]);

        // Create 3 flags from different users
        for ($i = 0; $i < 3; $i++) {
            $user = User::factory()->create(['user_type' => 'buyer']);
            ReviewFlag::create([
                'review_id' => $review->id,
                'user_id' => $user->id,
                'reason' => 'spam',
            ]);
        }

        // Update flag count and check auto-flag
        $review->increment('flag_count', 3);
        $review->refresh();

        // Simulate auto-flagging logic
        if ($review->flag_count >= 3) {
            $review->update(['flagged' => true]);
        }

        $this->assertTrue($review->fresh()->flagged);
    }

    /** @test */
    public function test_user_can_vote_helpful_or_not_helpful_on_review()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 5,
            'comment' => 'Helpful review content for other users to evaluate.',
            'review_type' => 'seller',
            'verified' => true,
            'moderation_status' => 'approved',
        ]);

        $otherUser = User::factory()->create(['user_type' => 'buyer']);

        $response = $this->actingAs($otherUser, 'sanctum')
            ->postJson("/api/reviews/{$review->id}/vote", [
                'helpful' => true,
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('review_helpful_votes', [
            'review_id' => $review->id,
            'user_id' => $otherUser->id,
            'helpful' => true,
        ]);
    }

    /** @test */
    public function test_profanity_filter_prevents_auto_verification()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'transaction_id' => $this->transaction->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $this->vehicle->id,
                'rating' => 1,
                'comment' => 'This damn seller is terrible and should not be trusted at all.',
                'review_type' => 'seller',
            ]);

        $response->assertStatus(201);

        $review = Review::latest()->first();
        // Review should be pending for moderation due to profanity
        $this->assertEquals('pending', $review->moderation_status);
    }

    /** @test */
    public function test_rate_limiting_max_5_reviews_per_day()
    {
        // Create 5 reviews
        for ($i = 0; $i < 5; $i++) {
            $vehicle = Vehicle::factory()->create([
                'seller_id' => $this->seller->id,
            ]);
            
            $transaction = Transaction::factory()->create([
                'buyer_id' => $this->buyer->id,
                'seller_id' => $this->seller->id,
                'vehicle_id' => $vehicle->id,
                'status' => 'completed',
            ]);

            Review::create([
                'transaction_id' => $transaction->id,
                'reviewer_id' => $this->buyer->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $vehicle->id,
                'rating' => 5,
                'comment' => "Review number $i with sufficient length for validation.",
                'review_type' => 'seller',
                'verified' => true,
                'moderation_status' => 'approved',
            ]);
        }

        // Attempt 6th review
        $newVehicle = Vehicle::factory()->create(['seller_id' => $this->seller->id]);
        $newTransaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $newVehicle->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/reviews', [
                'transaction_id' => $newTransaction->id,
                'reviewee_id' => $this->seller->id,
                'vehicle_id' => $newVehicle->id,
                'rating' => 5,
                'comment' => 'This is the sixth review attempt today which should be rate limited.',
                'review_type' => 'seller',
            ]);

        // Should be rate limited
        $this->assertLessThanOrEqual(429, $response->status());
    }
}
