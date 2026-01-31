<?php

namespace Tests;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\Dealer;
use Illuminate\Support\Facades\Hash;

trait TestHelpers
{
    /**
     * Create an authenticated user with the specified type and optionally authenticate them
     * 
     * @param string $type buyer|seller|dealer|admin
     * @param bool $authenticate Whether to authenticate the user
     * @return User
     */
    protected function createAuthenticatedUser(string $type = 'buyer', bool $authenticate = false): User
    {
        $user = User::factory()->create([
            'user_type' => $type,
            'email' => $type . '_' . uniqid() . '@test.com',
            'password' => Hash::make('password123')
        ]);

        if ($type === 'admin') {
            $user->assignRole('admin');
        }

        if ($type === 'dealer') {
            $dealer = Dealer::factory()->create([
                'user_id' => $user->id,
                'is_verified' => true
            ]);
            $user->dealer_id = $dealer->id;
            $user->save();
        }

        if ($authenticate) {
            $this->actingAs($user, 'sanctum');
        }

        return $user;
    }

    /**
     * Create a vehicle with a seller
     * 
     * @param array $attributes Additional attributes for the vehicle
     * @return array ['vehicle' => Vehicle, 'seller' => User]
     */
    protected function createVehicleWithSeller(array $attributes = []): array
    {
        $seller = User::factory()->create(['user_type' => 'seller']);

        $vehicle = Vehicle::factory()->create(array_merge([
            'seller_id' => $seller->id,
            'status' => 'active'
        ], $attributes));

        return [
            'vehicle' => $vehicle,
            'seller' => $seller
        ];
    }

    /**
     * Create a completed transaction between buyer and seller for a vehicle
     * 
     * @param User|null $buyer
     * @param Vehicle|null $vehicle
     * @return Transaction
     */
    protected function createCompletedTransaction(?User $buyer = null, ?Vehicle $vehicle = null): Transaction
    {
        if (!$buyer) {
            $buyer = User::factory()->create(['user_type' => 'buyer']);
        }

        if (!$vehicle) {
            $data = $this->createVehicleWithSeller();
            $vehicle = $data['vehicle'];
        }

        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $vehicle->seller_id,
            'vehicle_id' => $vehicle->id,
            'status' => 'completed',
            'amount' => $vehicle->price,
            'payment_verified_at' => now()
        ]);

        return $transaction;
    }

    /**
     * Create a pending transaction
     * 
     * @param User|null $buyer
     * @param Vehicle|null $vehicle
     * @return Transaction
     */
    protected function createPendingTransaction(?User $buyer = null, ?Vehicle $vehicle = null): Transaction
    {
        if (!$buyer) {
            $buyer = User::factory()->create(['user_type' => 'buyer']);
        }

        if (!$vehicle) {
            $data = $this->createVehicleWithSeller();
            $vehicle = $data['vehicle'];
        }

        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'seller_id' => $vehicle->seller_id,
            'vehicle_id' => $vehicle->id,
            'status' => 'pending',
            'amount' => $vehicle->price
        ]);

        return $transaction;
    }

    /**
     * Create a verified dealer with user account
     * 
     * @return array ['dealer' => Dealer, 'user' => User]
     */
    protected function createVerifiedDealer(): array
    {
        $user = User::factory()->create(['user_type' => 'dealer']);
        
        $dealer = Dealer::factory()->create([
            'user_id' => $user->id,
            'is_verified' => true,
            'kyc_verified_at' => now()
        ]);

        $user->dealer_id = $dealer->id;
        $user->save();

        return [
            'dealer' => $dealer,
            'user' => $user
        ];
    }

    /**
     * Create multiple vehicles with different statuses
     * 
     * @param int $count
     * @param string $status
     * @return \Illuminate\Support\Collection
     */
    protected function createMultipleVehicles(int $count = 5, string $status = 'active')
    {
        return Vehicle::factory()->count($count)->create([
            'status' => $status
        ]);
    }

    /**
     * Authenticate a user and return the bearer token
     * 
     * @param User $user
     * @return string
     */
    protected function authenticateUserWithToken(User $user): string
    {
        $token = $user->createToken('test-token')->plainTextToken;
        
        return $token;
    }

    /**
     * Assert that a vehicle belongs to a specific seller
     * 
     * @param Vehicle $vehicle
     * @param User $seller
     * @return void
     */
    protected function assertVehicleBelongsToSeller(Vehicle $vehicle, User $seller): void
    {
        $this->assertEquals($seller->id, $vehicle->seller_id);
        $this->assertEquals('seller', $seller->user_type);
    }

    /**
     * Assert that a transaction is in the expected status
     * 
     * @param Transaction $transaction
     * @param string $expectedStatus
     * @return void
     */
    protected function assertTransactionStatus(Transaction $transaction, string $expectedStatus): void
    {
        $transaction->refresh();
        $this->assertEquals($expectedStatus, $transaction->status);
    }

    /**
     * Create sample vehicles with price range for filtering tests
     * 
     * @return void
     */
    protected function createVehiclesWithPriceRange(): void
    {
        Vehicle::factory()->create(['price' => 10000, 'status' => 'active']);
        Vehicle::factory()->create(['price' => 25000, 'status' => 'active']);
        Vehicle::factory()->create(['price' => 50000, 'status' => 'active']);
        Vehicle::factory()->create(['price' => 75000, 'status' => 'active']);
        Vehicle::factory()->create(['price' => 100000, 'status' => 'active']);
    }
}
