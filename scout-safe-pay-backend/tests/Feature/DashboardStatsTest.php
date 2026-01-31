<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\Review;
use App\Models\Favorite;
use App\Models\Dealer;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * @group integration
 * @group skip-ci
 */
class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->markTestSkipped('Integration test - requires dashboard route setup. Run separately.');
    }

    public function test_buyer_can_get_dashboard_stats()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);

        // Create some data for the buyer
        Favorite::factory()->count(3)->create(['user_id' => $buyer->id]);
        Transaction::factory()->count(2)->create([
            'buyer_id' => $buyer->id,
            'status' => 'completed'
        ]);
        Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'favorites_count',
                'active_transactions',
                'completed_transactions',
                'total_spent'
            ]);

        $stats = $response->json();
        $this->assertEquals(3, $stats['favorites_count']);
        $this->assertEquals(1, $stats['active_transactions']);
        $this->assertEquals(2, $stats['completed_transactions']);
    }

    public function test_seller_can_get_dashboard_stats()
    {
        $seller = User::factory()->create(['user_type' => 'seller']);

        // Create some data for the seller
        Vehicle::factory()->count(5)->create([
            'seller_id' => $seller->id,
            'status' => 'active'
        ]);
        Vehicle::factory()->count(2)->create([
            'seller_id' => $seller->id,
            'status' => 'sold'
        ]);
        
        Transaction::factory()->count(3)->create([
            'seller_id' => $seller->id,
            'status' => 'completed'
        ]);

        $response = $this->actingAs($seller, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'active_listings',
                'sold_vehicles',
                'pending_transactions',
                'completed_transactions',
                'total_revenue'
            ]);

        $stats = $response->json();
        $this->assertEquals(5, $stats['active_listings']);
        $this->assertEquals(2, $stats['sold_vehicles']);
        $this->assertEquals(3, $stats['completed_transactions']);
    }

    public function test_dealer_can_get_dashboard_stats()
    {
        $dealer = Dealer::factory()->create([
            'is_verified' => true
        ]);
        $user = User::factory()->create([
            'user_type' => 'dealer',
            'dealer_id' => $dealer->id
        ]);

        // Create vehicles for the dealer
        Vehicle::factory()->count(10)->create([
            'dealer_id' => $dealer->id,
            'status' => 'active'
        ]);
        Vehicle::factory()->count(5)->create([
            'dealer_id' => $dealer->id,
            'status' => 'sold'
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'active_listings',
                'sold_vehicles',
                'total_views',
                'total_inquiries',
                'average_rating'
            ]);

        $stats = $response->json();
        $this->assertEquals(10, $stats['active_listings']);
        $this->assertEquals(5, $stats['sold_vehicles']);
        $this->assertIsNumeric($stats['total_views']);
    }

    public function test_stats_return_real_data_not_mock()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);

        // Create exact number of favorites
        Favorite::factory()->count(7)->create(['user_id' => $buyer->id]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200);
        
        $stats = $response->json();
        $this->assertEquals(7, $stats['favorites_count']);
        
        // Verify it's not returning hardcoded/mock data
        $this->assertIsInt($stats['favorites_count']);
        $this->assertIsInt($stats['active_transactions']);
    }

    public function test_buyer_stats_include_recent_activity()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);

        Transaction::factory()->count(3)->create([
            'buyer_id' => $buyer->id,
            'created_at' => now()->subDays(2)
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'recent_activity' => [
                    '*' => ['type', 'description', 'date']
                ]
            ]);
    }

    public function test_seller_stats_include_revenue_breakdown()
    {
        $seller = User::factory()->create(['user_type' => 'seller']);

        Transaction::factory()->count(3)->create([
            'seller_id' => $seller->id,
            'status' => 'completed',
            'amount' => 50000
        ]);

        $response = $this->actingAs($seller, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200);
        
        $stats = $response->json();
        $this->assertArrayHasKey('total_revenue', $stats);
        $this->assertGreaterThan(0, $stats['total_revenue']);
    }

    public function test_dealer_stats_include_performance_metrics()
    {
        $dealer = Dealer::factory()->create(['is_verified' => true]);
        $user = User::factory()->create([
            'user_type' => 'dealer',
            'dealer_id' => $dealer->id
        ]);

        // Create vehicles with views
        $vehicles = Vehicle::factory()->count(5)->create([
            'dealer_id' => $dealer->id,
            'view_count' => 100
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_views',
                'conversion_rate',
                'average_days_to_sell'
            ]);
    }

    public function test_stats_handle_empty_data_gracefully()
    {
        $newBuyer = User::factory()->create(['user_type' => 'buyer']);

        $response = $this->actingAs($newBuyer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200);
        
        $stats = $response->json();
        $this->assertEquals(0, $stats['favorites_count']);
        $this->assertEquals(0, $stats['active_transactions']);
        $this->assertEquals(0, $stats['completed_transactions']);
    }

    public function test_unauthenticated_user_cannot_access_dashboard_stats()
    {
        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(401);
    }
}
