<?php

namespace Tests\Feature\Admin;

use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewModerationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $buyer;
    private User $seller;
    private Vehicle $vehicle;
    private Transaction $transaction;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'user_type' => 'admin',
            'email' => 'admin@autoscout.com',
        ]);
        
        $this->buyer = User::factory()->create(['user_type' => 'buyer']);
        $this->seller = User::factory()->create(['user_type' => 'seller']);
        
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
        ]);

        $this->transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'status' => 'completed',
        ]);
    }

    /** @test */
    public function test_admin_can_get_pending_reviews()
    {
        // Create pending reviews
        Review::factory()->count(3)->create([
            'moderation_status' => 'pending',
            'verified' => false,
        ]);

        // Create approved reviews (should not appear)
        Review::factory()->count(2)->create([
            'moderation_status' => 'approved',
            'verified' => true,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/reviews/pending');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'rating', 'comment', 'moderation_status']
                ]
            ]);

        $this->assertGreaterThanOrEqual(3, count($response->json('data')));
    }

    /** @test */
    public function test_admin_can_verify_review_manually()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 5,
            'comment' => 'Great transaction, very satisfied with the purchase and service.',
            'review_type' => 'seller',
            'verified' => false,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/reviews/{$review->id}/verify", [
                'verified' => true,
                'admin_note' => 'Manually verified - legitimate review',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'verified' => true,
            'moderation_status' => 'approved',
            'moderated_by' => $this->admin->id,
        ]);
    }

    /** @test */
    public function test_admin_can_reject_review_with_reason()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 1,
            'comment' => 'Spam content that should be rejected by the moderator.',
            'review_type' => 'seller',
            'verified' => false,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/reviews/{$review->id}/reject", [
                'reason' => 'Spam content detected',
                'moderation_notes' => 'This review violates our community guidelines',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'moderation_status' => 'rejected',
            'moderated_by' => $this->admin->id,
        ]);
    }

    /** @test */
    public function test_admin_can_get_flagged_reviews()
    {
        // Create flagged reviews
        Review::factory()->count(3)->create([
            'flagged' => true,
            'flag_count' => 5,
            'moderation_status' => 'approved',
        ]);

        // Create non-flagged reviews
        Review::factory()->count(2)->create([
            'flagged' => false,
            'flag_count' => 0,
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/reviews/flagged');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'flagged', 'flag_count']
                ]
            ]);

        foreach ($response->json('data') as $review) {
            $this->assertTrue($review['flagged']);
            $this->assertGreaterThan(0, $review['flag_count']);
        }
    }

    /** @test */
    public function test_admin_can_get_review_statistics()
    {
        // Create various reviews with different statuses
        Review::factory()->count(5)->create(['moderation_status' => 'pending']);
        Review::factory()->count(10)->create(['moderation_status' => 'approved', 'verified' => true]);
        Review::factory()->count(2)->create(['moderation_status' => 'rejected']);
        Review::factory()->count(3)->create(['flagged' => true]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/reviews/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_reviews',
                'pending_reviews',
                'approved_reviews',
                'rejected_reviews',
                'flagged_reviews',
                'verified_reviews',
            ]);

        $stats = $response->json();
        $this->assertGreaterThanOrEqual(5, $stats['pending_reviews']);
        $this->assertGreaterThanOrEqual(10, $stats['approved_reviews']);
        $this->assertGreaterThanOrEqual(2, $stats['rejected_reviews']);
    }

    /** @test */
    public function test_non_admin_cannot_access_moderation_endpoints()
    {
        $review = Review::create([
            'transaction_id' => $this->transaction->id,
            'reviewer_id' => $this->buyer->id,
            'reviewee_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'rating' => 5,
            'comment' => 'Review content that non-admin should not be able to moderate.',
            'review_type' => 'seller',
            'moderation_status' => 'pending',
        ]);

        // Try to access pending reviews as buyer
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/admin/reviews/pending');
        $response->assertStatus(403);

        // Try to verify review as buyer
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/admin/reviews/{$review->id}/verify");
        $response->assertStatus(403);

        // Try to get statistics as seller
        $response = $this->actingAs($this->seller, 'sanctum')
            ->getJson('/api/admin/reviews/statistics');
        $response->assertStatus(403);
    }
}
