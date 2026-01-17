<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VehicleControllerOptimizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    public function test_vehicle_index_returns_successful_response(): void
    {
        $response = $this->getJson('/api/vehicles');
        
        $response->assertStatus(200);
    }

    public function test_vehicle_index_uses_cache(): void
    {
        // First request
        $response1 = $this->getJson('/api/vehicles');
        $response1->assertStatus(200);
        
        // Second request should hit cache
        $response2 = $this->getJson('/api/vehicles');
        $response2->assertStatus(200);
        
        // Responses should be identical
        $this->assertEquals(
            $response1->json(),
            $response2->json()
        );
    }

    public function test_vehicle_show_returns_404_for_nonexistent_vehicle(): void
    {
        $response = $this->getJson('/api/vehicles/99999');
        
        $response->assertStatus(404);
    }

    public function test_vehicle_index_with_filters(): void
    {
        $response = $this->getJson('/api/vehicles?make=BMW&year_from=2020');
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'current_page',
            'per_page',
            'total'
        ]);
    }

    public function test_vehicle_index_with_sorting(): void
    {
        $response = $this->getJson('/api/vehicles?sort_by=price&sort_order=asc');
        
        $response->assertStatus(200);
    }

    public function test_vehicle_index_with_pagination(): void
    {
        $response = $this->getJson('/api/vehicles?per_page=10&page=1');
        
        $response->assertStatus(200);
        $response->assertJsonPath('per_page', 10);
    }

    public function test_featured_vehicles_endpoint(): void
    {
        $response = $this->getJson('/api/vehicles-featured');
        
        $response->assertStatus(200);
    }

    public function test_vehicle_statistics_endpoint(): void
    {
        $response = $this->getJson('/api/vehicles-statistics');
        
        $response->assertStatus(200);
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}
