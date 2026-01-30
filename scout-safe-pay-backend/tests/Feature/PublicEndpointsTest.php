<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicEndpointsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test health endpoint returns correct status
     */
    public function test_health_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'timestamp',
            ])
            ->assertJson([
                'status' => 'ok',
            ]);
    }

    /**
     * Test settings endpoint returns application settings
     */
    public function test_settings_endpoint_returns_application_settings(): void
    {
        $response = $this->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                // Add expected settings structure based on your app
                // Example: 'app_name', 'version', etc.
            ]);
    }

    /**
     * Test frontend settings endpoint returns frontend-specific settings
     */
    public function test_frontend_settings_endpoint_returns_frontend_settings(): void
    {
        $response = $this->getJson('/api/frontend/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                // Add expected frontend settings structure
                // Example: 'features', 'api_version', etc.
            ]);
    }

    /**
     * Test vehicles-featured endpoint returns featured vehicles
     */
    public function test_vehicles_featured_endpoint_returns_featured_vehicles(): void
    {
        // Create a seller user
        $seller = User::factory()->create([
            'user_type' => 'seller',
        ]);

        // Create some active vehicles
        Vehicle::factory()->count(5)->create([
            'seller_id' => $seller->id,
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/vehicles-featured');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'vehicles' => [
                    '*' => [
                        'id',
                        'make',
                        'model',
                        'year',
                        'price',
                        'status',
                        // Add other expected vehicle fields
                    ],
                ],
            ]);
    }

    /**
     * Test vehicles-statistics endpoint returns correct statistics
     */
    public function test_vehicles_statistics_endpoint_returns_statistics(): void
    {
        // Create a seller user
        $seller = User::factory()->create([
            'user_type' => 'seller',
        ]);

        // Create vehicles with different statuses
        Vehicle::factory()->count(10)->create([
            'seller_id' => $seller->id,
            'status' => 'active',
        ]);
        
        Vehicle::factory()->count(3)->create([
            'seller_id' => $seller->id,
            'status' => 'sold',
        ]);
        
        Vehicle::factory()->count(2)->create([
            'seller_id' => $seller->id,
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/vehicles-statistics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total',
                'active',
                'sold',
                'draft',
                'average_price',
                // Add other expected statistics fields
            ])
            ->assertJson([
                'total' => 15,
                'active' => 10,
                'sold' => 3,
                'draft' => 2,
            ]);
    }

    /**
     * Test public vehicles list endpoint
     */
    public function test_vehicles_endpoint_returns_paginated_list(): void
    {
        // Create a seller user
        $seller = User::factory()->create([
            'user_type' => 'seller',
        ]);

        // Create some vehicles
        Vehicle::factory()->count(15)->create([
            'seller_id' => $seller->id,
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/vehicles');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'make',
                        'model',
                        'year',
                        'price',
                        'status',
                    ],
                ],
                'current_page',
                'per_page',
                'total',
                'last_page',
            ]);
    }

    /**
     * Test vehicles endpoint with filters
     */
    public function test_vehicles_endpoint_accepts_filters(): void
    {
        // Create a seller user
        $seller = User::factory()->create([
            'user_type' => 'seller',
        ]);

        // Create vehicles with different makes
        Vehicle::factory()->count(5)->create([
            'seller_id' => $seller->id,
            'status' => 'active',
            'make' => 'BMW',
        ]);
        
        Vehicle::factory()->count(3)->create([
            'seller_id' => $seller->id,
            'status' => 'active',
            'make' => 'Mercedes',
        ]);

        // Test filtering by make
        $response = $this->getJson('/api/vehicles?make=BMW');

        $response->assertStatus(200);
        
        // All returned vehicles should be BMW
        $vehicles = $response->json('data');
        foreach ($vehicles as $vehicle) {
            $this->assertEquals('BMW', $vehicle['make']);
        }
    }

    /**
     * Test CORS headers are present
     */
    public function test_api_endpoints_include_cors_headers(): void
    {
        $response = $this->get('/api/health', [
            'Origin' => 'https://autoscout24safetrade.com',
        ]);

        // Check for CORS headers
        $response->assertHeader('Access-Control-Allow-Origin');
        $response->assertHeader('Access-Control-Allow-Credentials', 'true');
    }
}
