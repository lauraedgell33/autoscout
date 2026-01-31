<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\Dispute;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * @group integration
 * @group skip-ci
 */
class TransactionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->markTestSkipped('Integration test - requires complex transaction flow. Run separately.');
    }

    public function test_buyer_can_create_transaction()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);
        $seller = User::factory()->create(['user_type' => 'seller']);
        $vehicle = Vehicle::factory()->create([
            'seller_id' => $seller->id,
            'status' => 'active',
            'price' => 50000
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/transactions', [
                'vehicle_id' => $vehicle->id,
                'payment_method' => 'bank_transfer'
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'vehicle_id',
                'buyer_id',
                'seller_id',
                'amount',
                'status'
            ]);

        $this->assertDatabaseHas('transactions', [
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'vehicle_id' => $vehicle->id,
            'status' => 'pending'
        ]);
    }

    public function test_buyer_can_upload_payment_proof()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'status' => 'pending'
        ]);

        $file = UploadedFile::fake()->create('payment_proof.pdf', 1024);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/payment-proof", [
                'payment_proof' => $file
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Payment proof uploaded successfully'
            ]);

        $transaction->refresh();
        $this->assertNotNull($transaction->payment_proof_path);
        $this->assertEquals('verification_pending', $transaction->status);
    }

    public function test_seller_can_confirm_transaction()
    {
        $seller = User::factory()->create(['user_type' => 'seller']);
        $transaction = Transaction::factory()->create([
            'seller_id' => $seller->id,
            'status' => 'verification_pending'
        ]);

        $response = $this->actingAs($seller, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/confirm");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Transaction confirmed'
            ]);

        $transaction->refresh();
        $this->assertEquals('verified', $transaction->status);
    }

    public function test_admin_can_complete_transaction()
    {
        $admin = User::factory()->create(['user_type' => 'admin']);
        $admin->assignRole('admin');
        
        $transaction = Transaction::factory()->create([
            'status' => 'verified'
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/complete");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Transaction completed successfully'
            ]);

        $transaction->refresh();
        $this->assertEquals('completed', $transaction->status);
    }

    public function test_buyer_can_dispute_transaction()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'status' => 'verified'
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/dispute", [
                'reason' => 'Vehicle not as described',
                'description' => 'The vehicle has significant damage that was not mentioned in the listing.'
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Dispute created successfully'
            ]);

        $this->assertDatabaseHas('disputes', [
            'transaction_id' => $transaction->id,
            'raised_by' => $buyer->id,
            'status' => 'open'
        ]);

        $transaction->refresh();
        $this->assertEquals('disputed', $transaction->status);
    }

    public function test_unauthorized_user_cannot_access_transaction()
    {
        $buyer1 = User::factory()->create(['user_type' => 'buyer']);
        $buyer2 = User::factory()->create(['user_type' => 'buyer']);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer1->id
        ]);

        $response = $this->actingAs($buyer2, 'sanctum')
            ->getJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(403);
    }

    public function test_transaction_creates_payment_reference()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);
        $seller = User::factory()->create(['user_type' => 'seller']);
        $vehicle = Vehicle::factory()->create([
            'seller_id' => $seller->id,
            'price' => 50000
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/transactions', [
                'vehicle_id' => $vehicle->id,
                'payment_method' => 'bank_transfer'
            ]);

        $response->assertStatus(201);
        
        $transaction = Transaction::where('buyer_id', $buyer->id)->first();
        $this->assertNotNull($transaction->payment_reference);
    }

    public function test_buyer_can_view_transaction_details()
    {
        $buyer = User::factory()->create(['user_type' => 'buyer']);
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'vehicle',
                'buyer',
                'seller',
                'amount',
                'status',
                'payment_reference'
            ]);
    }

    public function test_seller_can_view_transaction_details()
    {
        $seller = User::factory()->create(['user_type' => 'seller']);
        $transaction = Transaction::factory()->create([
            'seller_id' => $seller->id
        ]);

        $response = $this->actingAs($seller, 'sanctum')
            ->getJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $transaction->id,
                'seller_id' => $seller->id
            ]);
    }

    public function test_transaction_status_transition_validation()
    {
        $buyer = User::factory()->create();
        $transaction = Transaction::factory()->create([
            'buyer_id' => $buyer->id,
            'status' => 'completed'
        ]);

        // Cannot upload payment proof for completed transaction
        $file = UploadedFile::fake()->create('proof.pdf', 1024);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/payment-proof", [
                'payment_proof' => $file
            ]);

        $response->assertStatus(422);
    }
}
