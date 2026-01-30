<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VehicleTest extends TestCase
{
    use RefreshDatabase;

    private User $buyer;
    private User $seller;
    private Vehicle $vehicle;

    protected function setUp(): void
    {
        parent::setUp();

        $this->buyer = User::factory()->create(['user_type' => 'buyer']);
        $this->seller = User::factory()->create(['user_type' => 'seller']);
        
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
            'price' => 15000,
            'make' => 'BMW',
            'model' => 'X5',
        ]);
    }

    /** @test */
    public function test_get_all_vehicles_paginated()
    {
        Vehicle::factory()->count(15)->create(['status' => 'active']);

        $response = $this->getJson('/api/vehicles?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'make', 'model', 'price', 'status']
                ],
                'meta',
                'links'
            ]);

        $this->assertCount(10, $response->json('data'));
    }

    /** @test */
    public function test_get_single_vehicle_by_id()
    {
        $response = $this->getJson("/api/vehicles/{$this->vehicle->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $this->vehicle->id,
                'make' => 'BMW',
                'model' => 'X5',
                'price' => '15000.00',
            ]);
    }

    /** @test */
    public function test_filter_vehicles_by_price_range()
    {
        Vehicle::factory()->create(['price' => 5000, 'status' => 'active']);
        Vehicle::factory()->create(['price' => 25000, 'status' => 'active']);
        Vehicle::factory()->create(['price' => 50000, 'status' => 'active']);

        $response = $this->getJson('/api/vehicles?min_price=10000&max_price=30000');

        $response->assertStatus(200);
        
        foreach ($response->json('data') as $vehicle) {
            $this->assertGreaterThanOrEqual(10000, $vehicle['price']);
            $this->assertLessThanOrEqual(30000, $vehicle['price']);
        }
    }

    /** @test */
    public function test_filter_vehicles_by_make_and_model()
    {
        Vehicle::factory()->create(['make' => 'Audi', 'model' => 'A4', 'status' => 'active']);
        Vehicle::factory()->create(['make' => 'Mercedes', 'model' => 'C-Class', 'status' => 'active']);

        $response = $this->getJson('/api/vehicles?make=BMW&model=X5');

        $response->assertStatus(200);
        
        foreach ($response->json('data') as $vehicle) {
            $this->assertEquals('BMW', $vehicle['make']);
            $this->assertEquals('X5', $vehicle['model']);
        }
    }

    /** @test */
    public function test_search_vehicles_by_keyword()
    {
        Vehicle::factory()->create([
            'make' => 'Tesla',
            'model' => 'Model S',
            'description' => 'Electric luxury sedan',
            'status' => 'active'
        ]);

        $response = $this->getJson('/api/search/vehicles?query=Tesla');

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('data'));
    }

    /** @test */
    public function test_seller_can_create_vehicle()
    {
        $vehicleData = [
            'make' => 'Volkswagen',
            'model' => 'Golf',
            'year' => 2020,
            'price' => 18000,
            'currency' => 'EUR',
            'mileage' => 50000,
            'fuel_type' => 'Diesel',
            'transmission' => 'Manual',
            'description' => 'Well maintained Golf',
            'color' => 'Blue',
            'vin' => 'WVWZZZ1JZXW123456',
            'status' => 'active',
        ];

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson('/api/vehicles', $vehicleData);

        $response->assertStatus(201)
            ->assertJsonFragment(['make' => 'Volkswagen']);

        $this->assertDatabaseHas('vehicles', [
            'make' => 'Volkswagen',
            'model' => 'Golf',
            'seller_id' => $this->seller->id,
        ]);
    }

    /** @test */
    public function test_buyer_cannot_create_vehicle()
    {
        $vehicleData = [
            'make' => 'Volkswagen',
            'model' => 'Golf',
            'year' => 2020,
            'price' => 18000,
            'description' => 'Test vehicle',
        ];

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/vehicles', $vehicleData);

        $response->assertStatus(403);
    }

    /** @test */
    public function test_seller_can_update_own_vehicle()
    {
        $response = $this->actingAs($this->seller, 'sanctum')
            ->putJson("/api/vehicles/{$this->vehicle->id}", [
                'price' => 14000,
                'description' => 'Updated description',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('vehicles', [
            'id' => $this->vehicle->id,
            'price' => 14000,
        ]);
    }

    /** @test */
    public function test_seller_cannot_update_others_vehicle()
    {
        $otherSeller = User::factory()->create(['user_type' => 'seller']);
        $otherVehicle = Vehicle::factory()->create([
            'seller_id' => $otherSeller->id,
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->putJson("/api/vehicles/{$otherVehicle->id}", [
                'price' => 10000,
            ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function test_seller_can_delete_own_vehicle()
    {
        $response = $this->actingAs($this->seller, 'sanctum')
            ->deleteJson("/api/vehicles/{$this->vehicle->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('vehicles', [
            'id' => $this->vehicle->id,
        ]);
    }

    /** @test */
    public function test_upload_vehicle_images()
    {
        Storage::fake('public');

        $image = UploadedFile::fake()->image('vehicle.jpg', 800, 600);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/vehicles/{$this->vehicle->id}/images", [
                'image' => $image,
            ]);

        $response->assertStatus(200);

        // Verify image was stored
        $images = $response->json('images');
        $this->assertNotEmpty($images);
    }

    /** @test */
    public function test_validation_on_required_fields()
    {
        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson('/api/vehicles', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['make', 'model', 'year', 'price']);
    }
}
