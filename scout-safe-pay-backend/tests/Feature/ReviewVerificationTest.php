<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\ReviewFlag;
use App\Models\ReviewHelpfulVote;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\ReviewVerificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected ReviewVerificationService $verificationService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->verificationService = new ReviewVerificationService();
    }

    /** @test */
    public function user_can_submit_review_after_purchase()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $seller->id]);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
            'completed_at' => now()->subDays(10),
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/reviews', [
            'transaction_id' => $transaction->id,
            'reviewee_id' => $seller->id,
            'rating' => 5,
            'comment' => 'Great seller, excellent communication and vehicle condition!',
            'review_type' => 'seller',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'review', 'auto_verified']);
    }

    /** @test */
    public function review_auto_verified_with_completed_transaction()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $seller->id]);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
            'completed_at' => now()->subDays(10),
        ]);

        $review = Review::factory()->create([
            'transaction_id' => $transaction->id,
            'reviewer_id' => $buyer->id,
            'reviewee_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'rating' => 5,
            'comment' => 'Great seller, excellent communication and vehicle condition!',
            'review_type' => 'seller',
            'moderation_status' => 'pending',
        ]);

        $result = $this->verificationService->autoVerify($review);

        $this->assertTrue($result);
        $this->assertTrue($review->fresh()->verified);
        $this->assertEquals('transaction', $review->fresh()->verification_method);
        $this->assertEquals('approved', $review->fresh()->moderation_status);
    }

    /** @test */
    public function review_pending_without_transaction()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();

        $review = Review::factory()->create([
            'transaction_id' => null,
            'reviewer_id' => $buyer->id,
            'reviewee_id' => $seller->id,
            'vehicle_id' => null,
            'rating' => 5,
            'comment' => 'Great seller, excellent communication!',
            'review_type' => 'seller',
            'moderation_status' => 'pending',
        ]);

        $result = $this->verificationService->autoVerify($review);

        $this->assertFalse($result);
        $this->assertFalse($review->fresh()->verified);
    }

    /** @test */
    public function profanity_filter_prevents_auto_verification()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $seller->id]);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
            'completed_at' => now()->subDays(10),
        ]);

        $review = Review::factory()->create([
            'transaction_id' => $transaction->id,
            'reviewer_id' => $buyer->id,
            'reviewee_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'rating' => 1,
            'comment' => 'This is shit and the seller is a bastard!',
            'review_type' => 'seller',
            'moderation_status' => 'pending',
        ]);

        $result = $this->verificationService->autoVerify($review);

        $this->assertFalse($result);
        $this->assertFalse($review->fresh()->verified);
    }

    /** @test */
    public function admin_can_manually_verify_review()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $review = Review::factory()->create([
            'moderation_status' => 'pending',
            'verified' => false,
        ]);

        $result = $this->verificationService->manualVerify($review, $admin, 'Manually verified after inspection');

        $this->assertTrue($result);
        $this->assertTrue($review->fresh()->verified);
        $this->assertEquals('manual', $review->fresh()->verification_method);
        $this->assertEquals('approved', $review->fresh()->moderation_status);
        $this->assertEquals($admin->id, $review->fresh()->moderated_by);
    }

    /** @test */
    public function user_cannot_review_same_vehicle_twice()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $seller->id]);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
        ]);

        // First review
        Review::factory()->create([
            'transaction_id' => $transaction->id,
            'reviewer_id' => $buyer->id,
            'reviewee_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'review_type' => 'seller',
        ]);

        // Attempt second review
        $response = $this->actingAs($buyer)->postJson('/api/reviews', [
            'transaction_id' => $transaction->id,
            'reviewee_id' => $seller->id,
            'rating' => 5,
            'comment' => 'Another great experience with this seller!',
            'review_type' => 'seller',
        ]);

        $response->assertStatus(422)
            ->assertJson(['message' => 'You have already submitted a review for this transaction']);
    }

    /** @test */
    public function user_can_flag_suspicious_review()
    {
        $user = User::factory()->create();
        $review = Review::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/reviews/{$review->id}/flag", [
            'reason' => 'spam',
            'details' => 'This looks like a fake review',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Review flagged successfully']);

        $this->assertEquals(1, $review->fresh()->flag_count);
        $this->assertDatabaseHas('review_flags', [
            'review_id' => $review->id,
            'user_id' => $user->id,
            'reason' => 'spam',
        ]);
    }

    /** @test */
    public function review_auto_flagged_after_threshold()
    {
        $review = Review::factory()->create(['flagged' => false, 'flag_count' => 2]);
        $user = User::factory()->create();

        // Third flag should auto-flag the review
        $this->verificationService->flag($review, $user, 'spam', 'This is suspicious');

        $this->assertTrue($review->fresh()->flagged);
        $this->assertEquals('flagged', $review->fresh()->moderation_status);
        $this->assertEquals(3, $review->fresh()->flag_count);
    }

    /** @test */
    public function rate_limiting_prevents_spam()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $seller->id]);

        // Create 5 transactions
        for ($i = 0; $i < 5; $i++) {
            $transaction = Transaction::factory()->create([
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
                'vehicle_id' => $vehicle->id,
                'status' => 'completed',
            ]);

            $response = $this->actingAs($buyer)->postJson('/api/reviews', [
                'transaction_id' => $transaction->id,
                'reviewee_id' => $seller->id,
                'rating' => 5,
                'comment' => 'Great seller number ' . ($i + 1) . ', excellent communication!',
                'review_type' => 'seller',
            ]);

            $response->assertStatus(201);
        }

        // 6th review should be rate limited
        $transaction6 = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/reviews', [
            'transaction_id' => $transaction6->id,
            'reviewee_id' => $seller->id,
            'rating' => 5,
            'comment' => 'Great seller number 6, excellent communication!',
            'review_type' => 'seller',
        ]);

        $response->assertStatus(429);
    }

    /** @test */
    public function user_can_vote_review_helpful()
    {
        $user = User::factory()->create();
        $review = Review::factory()->create(['helpful_count' => 0]);

        $response = $this->actingAs($user)->postJson("/api/reviews/{$review->id}/vote", [
            'is_helpful' => true,
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Vote recorded successfully'])
            ->assertJsonStructure(['helpful_count', 'not_helpful_count']);

        $this->assertEquals(1, $review->fresh()->helpful_count);
        $this->assertDatabaseHas('review_helpful_votes', [
            'review_id' => $review->id,
            'user_id' => $user->id,
            'is_helpful' => true,
        ]);
    }

    /** @test */
    public function short_comments_fail_validation()
    {
        $buyer = User::factory()->create();
        $seller = User::factory()->create();
        $vehicle = Vehicle::factory()->create(['user_id' => $seller->id]);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($buyer)->postJson('/api/reviews', [
            'transaction_id' => $transaction->id,
            'reviewee_id' => $seller->id,
            'rating' => 5,
            'comment' => 'Too short', // Less than 20 characters
            'review_type' => 'seller',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['comment']);
    }
}
