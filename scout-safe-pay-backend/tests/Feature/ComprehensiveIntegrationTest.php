<?php

namespace Tests\Feature;

use Tests\TestCase;
use Tests\TestHelpers;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\Favorite;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

/**
 * Comprehensive Integration Tests
 */
class ComprehensiveIntegrationTest extends TestCase
{
    use RefreshDatabase, TestHelpers;

    protected User $buyer;
    protected User $seller;
    protected User $admin;
    protected Vehicle $vehicle;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->setupTestUsers();
    }

    protected function setupTestUsers(): void
    {
        $this->buyer = User::factory()->create([
            'name' => 'Test Buyer',
            'email' => 'buyer.test@autoscout.dev',
            'password' => Hash::make('BuyerPass123!'),
            'user_type' => 'buyer',
            'email_verified_at' => now(),
        ]);

        $this->seller = User::factory()->create([
            'name' => 'Test Seller',
            'email' => 'seller.test@autoscout.dev',
            'password' => Hash::make('SellerPass123!'),
            'user_type' => 'seller',
            'email_verified_at' => now(),
        ]);

        $this->admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@autoscout.dev',
            'password' => Hash::make('Admin123!@#'),
            'user_type' => 'admin',
            'email_verified_at' => now(),
        ]);
        $this->admin->assignRole('admin');

        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'make' => 'BMW',
            'model' => 'X5',
            'year' => 2022,
            'price' => 55000,
            'status' => 'active',
        ]);
    }

    // AUTHENTICATION
    public function test_buyer_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'New Buyer',
            'email' => 'newbuyer@test.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'user_type' => 'buyer',
            'phone' => '+49123456789',
            'country' => 'DE',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'newbuyer@test.com']);
    }

    public function test_user_can_login(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'buyer.test@autoscout.dev',
            'password' => 'BuyerPass123!',
        ]);

        $response->assertStatus(200)->assertJsonStructure(['token']);
    }

    public function test_admin_can_login(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'admin@autoscout.dev',
            'password' => 'Admin123!@#',
        ]);

        $response->assertStatus(200)->assertJsonStructure(['token']);
    }

    public function test_user_can_get_profile(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')->getJson('/api/user');
        $response->assertStatus(200);
    }

    public function test_user_can_logout(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')->postJson('/api/logout');
        $response->assertStatus(200);
    }

    public function test_invalid_credentials_rejected(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'buyer.test@autoscout.dev',
            'password' => 'WrongPassword',
        ]);
        $response->assertStatus(422);
    }

    // VEHICLES
    public function test_can_list_vehicles(): void
    {
        $response = $this->getJson('/api/vehicles');
        $response->assertStatus(200)->assertJsonStructure(['data']);
    }

    public function test_can_view_vehicle(): void
    {
        $response = $this->getJson("/api/vehicles/{$this->vehicle->id}");
        $response->assertStatus(200);
    }

    public function test_seller_can_create_vehicle(): void
    {
        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson('/api/vehicles', [
                'make' => 'Audi',
                'model' => 'A4',
                'year' => 2023,
                'price' => 45000,
                'mileage' => 10000,
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'body_type' => 'sedan',
                'color' => 'white',
                'description' => 'Test car',
            ]);

        $response->assertStatus(201);
    }

    public function test_seller_can_update_vehicle(): void
    {
        $response = $this->actingAs($this->seller, 'sanctum')
            ->putJson("/api/vehicles/{$this->vehicle->id}", [
                'price' => 52000,
            ]);

        $response->assertStatus(200);
    }

    public function test_seller_can_delete_vehicle(): void
    {
        $vehicle = Vehicle::factory()->create(['seller_id' => $this->seller->id]);
        $response = $this->actingAs($this->seller, 'sanctum')
            ->deleteJson("/api/vehicles/{$vehicle->id}");
        $response->assertStatus(200);
    }

    // TRANSACTIONS
    public function test_buyer_can_view_transactions(): void
    {
        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')->getJson('/api/transactions');
        $response->assertStatus(200);
    }

    public function test_seller_can_view_transactions(): void
    {
        Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')->getJson('/api/transactions');
        $response->assertStatus(200);
    }

    public function test_unauthorized_cannot_access_transaction(): void
    {
        $transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $otherUser = User::factory()->create(['user_type' => 'buyer']);
        $response = $this->actingAs($otherUser, 'sanctum')
            ->getJson("/api/transactions/{$transaction->id}");
        $response->assertStatus(403);
    }

    // FAVORITES
    public function test_can_add_favorite(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson('/api/favorites', ['vehicle_id' => $this->vehicle->id]);
        $response->assertStatus(201);
    }

    public function test_can_view_favorites(): void
    {
        Favorite::create(['user_id' => $this->buyer->id, 'vehicle_id' => $this->vehicle->id]);
        $response = $this->actingAs($this->buyer, 'sanctum')->getJson('/api/favorites');
        $response->assertStatus(200);
    }

    public function test_can_remove_favorite(): void
    {
        Favorite::create(['user_id' => $this->buyer->id, 'vehicle_id' => $this->vehicle->id]);
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->deleteJson("/api/favorites/{$this->vehicle->id}");
        $response->assertStatus(200);
    }

    // ADMIN
    public function test_admin_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard/overall');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/admin/dashboard/overall');
        $response->assertStatus(403);
    }

    // MESSAGING
    public function test_can_send_message(): void
    {
        $transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$transaction->id}/messages", [
                'message' => 'Hello, I have a question.',
            ]);
        $response->assertStatus(201);
    }

    public function test_can_view_messages(): void
    {
        $transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
        ]);

        Message::create([
            'transaction_id' => $transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
            'message' => 'Test message',
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->getJson("/api/transactions/{$transaction->id}/messages");
        $response->assertStatus(200);
    }

    // PUBLIC ENDPOINTS
    public function test_health_check(): void
    {
        $response = $this->getJson('/api/health');
        $response->assertStatus(200)->assertJson(['status' => 'ok']);
    }

    public function test_categories(): void
    {
        $response = $this->getJson('/api/categories');
        $response->assertStatus(200);
    }

    public function test_legal_documents(): void
    {
        $response = $this->getJson('/api/legal-documents');
        $response->assertStatus(200);
    }

    public function test_frontend_settings(): void
    {
        $response = $this->getJson('/api/frontend/settings');
        $response->assertStatus(200);
    }

    public function test_locales(): void
    {
        $response = $this->getJson('/api/locale/available');
        $response->assertStatus(200);
    }

    // NOTIFICATIONS
    public function test_can_view_notifications(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')->getJson('/api/notifications');
        $response->assertStatus(200);
    }

    public function test_can_get_unread_count(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/notifications/unread-count');
        $response->assertStatus(200);
    }
}
