<?php

namespace Tests\Feature;

use App\Models\Favorite;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    private User $buyer;
    private User $seller;
    private User $dealer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->buyer = User::factory()->create(['user_type' => 'buyer']);
        $this->seller = User::factory()->create(['user_type' => 'seller']);
        $this->dealer = User::factory()->create(['user_type' => 'dealer']);
    }

    /** @test */
    public function test_buyer_can_get_dashboard_stats()
    {
        // Create purchases
        $vehicle1 = Vehicle::factory()->create(['seller_id' => $this->seller->id, 'price' => 10000]);
        $vehicle2 = Vehicle::factory()->create(['seller_id' => $this->seller->id, 'price' => 15000]);

        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $vehicle1->id,
            'amount' => 10000,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $vehicle2->id,
            'amount' => 15000,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Create favorites
        Favorite::factory()->count(5)->create(['user_id' => $this->buyer->id]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'purchases',
                'total_spent',
                'active_transactions',
                'favorites_count',
            ]);

        $stats = $response->json();
        $this->assertEquals(2, $stats['purchases']);
        $this->assertEquals('25000.00', $stats['total_spent']);
        $this->assertEquals(5, $stats['favorites_count']);
    }

    /** @test */
    public function test_seller_can_get_dashboard_stats()
    {
        // Create vehicles
        Vehicle::factory()->count(3)->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
        ]);

        Vehicle::factory()->count(2)->create([
            'seller_id' => $this->seller->id,
            'status' => 'sold',
        ]);

        // Create sales
        $vehicle1 = Vehicle::factory()->create(['seller_id' => $this->seller->id, 'price' => 20000]);
        $vehicle2 = Vehicle::factory()->create(['seller_id' => $this->seller->id, 'price' => 30000]);

        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $vehicle1->id,
            'amount' => 20000,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $vehicle2->id,
            'amount' => 30000,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'sales',
                'total_revenue',
                'active_listings',
                'pending_transactions',
            ]);

        $stats = $response->json();
        $this->assertEquals(2, $stats['sales']);
        $this->assertEquals('50000.00', $stats['total_revenue']);
        $this->assertGreaterThanOrEqual(3, $stats['active_listings']);
    }

    /** @test */
    public function test_dealer_can_get_dashboard_stats()
    {
        // Create dealer-related vehicles
        $vehicle1 = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'dealer_id' => 1,
            'status' => 'active',
            'price' => 25000,
        ]);

        $vehicle2 = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'dealer_id' => 1,
            'status' => 'sold',
            'price' => 35000,
        ]);

        // Create dealer transactions
        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'dealer_id' => 1,
            'vehicle_id' => $vehicle2->id,
            'amount' => 35000,
            'dealer_commission' => 1750, // 5% commission
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($this->dealer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'inventory_count',
                'total_commission',
                'sold_vehicles',
                'active_listings',
            ]);

        $stats = $response->json();
        $this->assertIsInt($stats['inventory_count']);
        $this->assertIsNumeric($stats['total_commission']);
        $this->assertIsInt($stats['sold_vehicles']);
    }

    /** @test */
    public function test_stats_return_real_data_not_mock_values()
    {
        // Create specific data for buyer
        $vehicle = Vehicle::factory()->create(['seller_id' => $this->seller->id, 'price' => 12345]);

        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $vehicle->id,
            'amount' => 12345,
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        Favorite::factory()->count(7)->create(['user_id' => $this->buyer->id]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/dashboard/stats');

        $response->assertStatus(200);

        $stats = $response->json();
        
        // Verify actual values, not mock data
        $this->assertEquals(1, $stats['purchases']);
        $this->assertEquals('12345.00', $stats['total_spent']);
        $this->assertEquals(7, $stats['favorites_count']);

        // Ensure values are not hardcoded mock values
        $this->assertNotEquals(0, $stats['purchases']);
        $this->assertNotEquals('0.00', $stats['total_spent']);
        $this->assertNotEquals(0, $stats['favorites_count']);
    }
}
