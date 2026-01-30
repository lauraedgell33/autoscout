<?php

namespace Tests;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;

trait TestHelpers
{
    /**
     * Create an authenticated user of specified type
     *
     * @param string $type User type: 'buyer', 'seller', 'dealer', or 'admin'
     * @return User
     */
    protected function createAuthenticatedUser(string $type = 'buyer'): User
    {
        $userData = ['user_type' => $type];

        // Add admin-specific attributes if needed
        if ($type === 'admin') {
            $userData['email'] = 'admin-' . uniqid() . '@autoscout.com';
        }

        return User::factory()->create($userData);
    }

    /**
     * Create a vehicle with seller
     *
     * @param array $attributes Additional attributes for the vehicle
     * @return Vehicle
     */
    protected function createVehicleWithSeller(array $attributes = []): Vehicle
    {
        $seller = User::factory()->create(['user_type' => 'seller']);

        return Vehicle::factory()->create(array_merge([
            'seller_id' => $seller->id,
            'status' => 'active',
            'price' => 15000,
            'currency' => 'EUR',
        ], $attributes));
    }

    /**
     * Create a completed transaction
     *
     * @param User $buyer
     * @param Vehicle $vehicle
     * @return Transaction
     */
    protected function createCompletedTransaction(User $buyer, Vehicle $vehicle): Transaction
    {
        return Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $vehicle->seller_id,
            'vehicle_id' => $vehicle->id,
            'amount' => $vehicle->price,
            'currency' => $vehicle->currency ?? 'EUR',
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /**
     * Create a pending transaction
     *
     * @param User $buyer
     * @param Vehicle $vehicle
     * @return Transaction
     */
    protected function createPendingTransaction(User $buyer, Vehicle $vehicle): Transaction
    {
        return Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $vehicle->seller_id,
            'vehicle_id' => $vehicle->id,
            'amount' => $vehicle->price,
            'currency' => $vehicle->currency ?? 'EUR',
            'status' => 'pending',
        ]);
    }

    /**
     * Create multiple vehicles with random sellers
     *
     * @param int $count Number of vehicles to create
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function createMultipleVehicles(int $count): \Illuminate\Database\Eloquent\Collection
    {
        $vehicles = collect();
        
        for ($i = 0; $i < $count; $i++) {
            $vehicles->push($this->createVehicleWithSeller());
        }
        
        return $vehicles;
    }

    /**
     * Authenticate as user and return authentication token
     *
     * @param User $user
     * @return string
     */
    protected function getAuthToken(User $user): string
    {
        return $user->createToken('test-token')->plainTextToken;
    }

    /**
     * Make authenticated request with bearer token
     *
     * @param string $method HTTP method
     * @param string $uri Request URI
     * @param User $user Authenticated user
     * @param array $data Request data
     * @return \Illuminate\Testing\TestResponse
     */
    protected function authenticatedRequest(string $method, string $uri, User $user, array $data = [])
    {
        return $this->actingAs($user, 'sanctum')
            ->json($method, $uri, $data);
    }

    /**
     * Assert that response has pagination structure
     *
     * @param \Illuminate\Testing\TestResponse $response
     * @return void
     */
    protected function assertHasPaginationStructure($response): void
    {
        $response->assertJsonStructure([
            'data',
            'meta' => [
                'current_page',
                'per_page',
                'total',
            ],
            'links',
        ]);
    }

    /**
     * Assert database has record with soft delete support
     *
     * @param string $table
     * @param array $data
     * @param bool $withTrashed Include soft deleted records
     * @return void
     */
    protected function assertDatabaseHasRecord(string $table, array $data, bool $withTrashed = false): void
    {
        if ($withTrashed) {
            $this->assertDatabaseHas($table, $data);
        } else {
            $query = \DB::table($table)->where($data);
            
            if (\Schema::hasColumn($table, 'deleted_at')) {
                $query->whereNull('deleted_at');
            }
            
            $this->assertTrue($query->exists());
        }
    }
}
