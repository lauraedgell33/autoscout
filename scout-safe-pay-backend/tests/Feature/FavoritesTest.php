<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Favorite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoritesTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Vehicle $vehicle;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user
        $this->user = User::factory()->create([
            'user_type' => 'buyer',
        ]);

        // Create a seller user
        $seller = User::factory()->create([
            'user_type' => 'seller',
        ]);

        // Create a test vehicle
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $seller->id,
            'status' => 'active',
        ]);
    }

    /**
     * Test authenticated user can view favorites list
     */
    public function test_authenticated_user_can_view_favorites(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/favorites');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'count',
            ])
            ->assertJson([
                'success' => true,
                'count' => 0,
            ]);
    }

    /**
     * Test unauthenticated user cannot access favorites
     */
    public function test_unauthenticated_user_cannot_access_favorites(): void
    {
        $response = $this->getJson('/api/favorites');

        $response->assertStatus(401);
    }

    /**
     * Test user can add vehicle to favorites
     */
    public function test_user_can_add_vehicle_to_favorites(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/favorites', [
                'vehicle_id' => $this->vehicle->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'user_id',
                    'vehicle_id',
                    'vehicle',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Vehicle added to favorites',
                'data' => [
                    'user_id' => $this->user->id,
                    'vehicle_id' => $this->vehicle->id,
                ],
            ]);

        // Verify favorite exists in database
        $this->assertDatabaseHas('favorites', [
            'user_id' => $this->user->id,
            'vehicle_id' => $this->vehicle->id,
        ]);
    }

    /**
     * Test adding same vehicle twice returns existing favorite
     */
    public function test_adding_duplicate_favorite_returns_existing(): void
    {
        // Add favorite first time
        Favorite::create([
            'user_id' => $this->user->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        // Try to add again
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/favorites', [
                'vehicle_id' => $this->vehicle->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vehicle already in favorites',
            ]);

        // Should still have only one favorite
        $this->assertEquals(1, Favorite::where('user_id', $this->user->id)->count());
    }

    /**
     * Test user can remove vehicle from favorites
     */
    public function test_user_can_remove_vehicle_from_favorites(): void
    {
        // First add to favorites
        Favorite::create([
            'user_id' => $this->user->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        // Remove from favorites
        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/favorites/{$this->vehicle->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vehicle removed from favorites',
            ]);

        // Verify favorite removed from database
        $this->assertDatabaseMissing('favorites', [
            'user_id' => $this->user->id,
            'vehicle_id' => $this->vehicle->id,
        ]);
    }

    /**
     * Test removing non-existent favorite returns 404
     */
    public function test_removing_non_existent_favorite_returns_404(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/favorites/{$this->vehicle->id}");

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Favorite not found',
            ]);
    }

    /**
     * Test check favorite status
     */
    public function test_user_can_check_if_vehicle_is_favorited(): void
    {
        // Add to favorites
        Favorite::create([
            'user_id' => $this->user->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/favorites/check/{$this->vehicle->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'is_favorited' => true,
            ]);
    }

    /**
     * Test check returns false for non-favorited vehicle
     */
    public function test_check_returns_false_for_non_favorited_vehicle(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/favorites/check/{$this->vehicle->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'is_favorited' => false,
            ]);
    }

    /**
     * Test adding favorite for non-existent vehicle returns error
     */
    public function test_adding_non_existent_vehicle_to_favorites_fails(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/favorites', [
                'vehicle_id' => 99999,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['vehicle_id']);
    }

    /**
     * Test favorites include vehicle relationship data
     */
    public function test_favorites_include_vehicle_data(): void
    {
        // Add to favorites
        Favorite::create([
            'user_id' => $this->user->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/favorites');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 1,
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'user_id',
                        'vehicle_id',
                        'vehicle' => [
                            'id',
                            'make',
                            'model',
                            'year',
                            'price',
                            'status',
                        ],
                    ],
                ],
            ]);
    }
}
