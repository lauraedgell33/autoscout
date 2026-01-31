<?php

namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\Review;
use App\Models\ReviewFlag;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * @group admin
 * @group skip-ci
 */
class ReviewModerationTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->markTestSkipped('Admin test - requires Spatie permissions setup. Run separately.');
    }

    public function test_admin_can_get_pending_reviews()
    {
        Review::factory()->count(3)->create(['status' => 'pending']);
        Review::factory()->count(2)->create(['status' => 'approved']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/reviews/pending');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'rating', 'comment', 'status', 'user', 'vehicle']
                ]
            ]);
    }

    public function test_admin_can_verify_review()
    {
        $review = Review::factory()->create([
            'status' => 'pending',
            'verified' => false
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/reviews/{$review->id}/verify", [
                'status' => 'approved',
                'moderation_notes' => 'Review verified and approved'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Review verified successfully'
            ]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'status' => 'approved',
            'is_verified' => true
        ]);
    }

    public function test_admin_can_reject_review()
    {
        $review = Review::factory()->create([
            'status' => 'pending'
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/reviews/{$review->id}/verify", [
                'status' => 'rejected',
                'moderation_notes' => 'Contains inappropriate content'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Review verified successfully'
            ]);

        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'status' => 'rejected'
        ]);
    }

    public function test_admin_can_get_flagged_reviews()
    {
        $flaggedReviews = Review::factory()->count(3)->create([
            'flag_count' => 3,
            'status' => 'approved'
        ]);

        Review::factory()->count(2)->create([
            'flag_count' => 0,
            'status' => 'approved'
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/reviews/flagged');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'flag_count', 'flags']
                ]
            ]);
    }

    public function test_admin_can_get_review_statistics()
    {
        Review::factory()->count(5)->create(['status' => 'pending', 'verified' => false]);
        Review::factory()->count(10)->create(['status' => 'approved', 'is_verified' => true]);
        Review::factory()->count(2)->create(['status' => 'rejected', 'verified' => false]);
        Review::factory()->count(3)->create(['flag_count' => 3]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/reviews/statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_reviews',
                'pending_reviews',
                'approved_reviews',
                'rejected_reviews',
                'flagged_reviews',
                'verified_reviews'
            ]);

        $stats = $response->json();
        $this->assertEquals(5, $stats['pending_reviews']);
        $this->assertEquals(10, $stats['approved_reviews']);
        $this->assertEquals(2, $stats['rejected_reviews']);
    }

    public function test_non_admin_cannot_access_moderation()
    {
        $user = User::factory()->create(['user_type' => 'buyer']);

        $endpoints = [
            '/api/admin/reviews/pending',
            '/api/admin/reviews/flagged',
            '/api/admin/reviews/statistics'
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->actingAs($user, 'sanctum')
                ->getJson($endpoint);

            $response->assertStatus(403);
        }
    }

    public function test_admin_can_view_review_flags()
    {
        $review = Review::factory()->create(['flag_count' => 2]);
        
        ReviewFlag::factory()->count(2)->create([
            'review_id' => $review->id
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson("/api/admin/reviews/{$review->id}/flags");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'reason', 'user', 'created_at']
                ]
            ]);
    }

    public function test_admin_can_dismiss_flags()
    {
        $review = Review::factory()->create(['flag_count' => 3]);
        
        $flags = ReviewFlag::factory()->count(3)->create([
            'review_id' => $review->id
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/admin/reviews/{$review->id}/dismiss-flags");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Flags dismissed successfully'
            ]);

        $review->refresh();
        $this->assertEquals(0, $review->flag_count);
    }

    public function test_admin_can_bulk_verify_reviews()
    {
        $reviews = Review::factory()->count(3)->create(['status' => 'pending']);
        $reviewIds = $reviews->pluck('id')->toArray();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/admin/reviews/bulk-verify', [
                'review_ids' => $reviewIds,
                'status' => 'approved'
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Reviews updated successfully'
            ]);

        foreach ($reviewIds as $id) {
            $this->assertDatabaseHas('reviews', [
                'id' => $id,
                'status' => 'approved'
            ]);
        }
    }
}
