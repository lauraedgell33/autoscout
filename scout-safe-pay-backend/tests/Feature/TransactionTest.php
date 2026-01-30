<?php

namespace Tests\Feature;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    private User $buyer;
    private User $seller;
    private User $admin;
    private Vehicle $vehicle;

    protected function setUp(): void
    {
        parent::setUp();

        $this->buyer = User::factory()->create(['user_type' => 'buyer']);
        $this->seller = User::factory()->create(['user_type' => 'seller']);
        $this->admin = User::factory()->create(['user_type' => 'admin']);
        
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'active',
            'price' => 15000,
        ]);
    }

    /** @test */
    public function test_buyer_can_create_transaction()
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/transactions', [
                'vehicle_id' => $this->vehicle->id,
                'seller_id' => $this->seller->id,
                'amount' => 15000,
                'currency' => 'EUR',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'id',
                    'transaction_code',
                    'payment_reference',
                    'buyer_id',
                    'seller_id',
                    'vehicle_id',
                    'amount',
                    'status',
                ]
            ]);

        $this->assertDatabaseHas('transactions', [
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'amount' => 15000,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function test_buyer_can_upload_payment_proof()
    {
        Storage::fake('public');

        $transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'status' => 'pending',
        ]);

        $file = UploadedFile::fake()->image('payment_proof.jpg');

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/payment-proof", [
                'payment_proof' => $file,
                'notes' => 'Bank transfer completed',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'status' => 'payment_pending_verification',
        ]);

        $this->assertNotNull($transaction->fresh()->payment_proof);
    }

    /** @test */
    public function test_seller_can_confirm_transaction()
    {
        $transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'status' => 'payment_verified',
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/confirm", [
                'confirmed' => true,
                'notes' => 'Ready for delivery',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
            'status' => 'confirmed',
        ]);
    }

    /** @test */
    public function test_admin_can_complete_transaction()
    {
        $transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/complete", [
                'notes' => 'Transaction verified and completed',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $transaction->refresh();
        $this->assertEquals('completed', $transaction->status);
        $this->assertNotNull($transaction->completed_at);
    }

    /** @test */
    public function test_user_cannot_access_others_transactions()
    {
        $otherBuyer = User::factory()->create(['user_type' => 'buyer']);
        
        $transaction = Transaction::factory()->create([
            'buyer_id' => $otherBuyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        // Buyer tries to access another buyer's transaction
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(403);

        // Buyer tries to upload payment proof for another buyer's transaction
        Storage::fake('public');
        $file = UploadedFile::fake()->image('payment_proof.jpg');

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/payment-proof", [
                'payment_proof' => $file,
            ]);

        $response->assertStatus(403);
    }
}
