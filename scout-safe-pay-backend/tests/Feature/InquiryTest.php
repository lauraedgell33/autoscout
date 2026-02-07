<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\VehicleInquiryNotification;
use Tests\TestCase;

class InquiryTest extends TestCase
{
    use RefreshDatabase;

    private User $seller;
    private Vehicle $vehicle;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a seller with a vehicle
        $this->seller = User::factory()->create([
            'user_type' => 'seller',
            'email' => 'seller@test.com',
        ]);
        
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'make' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
            'price' => 50000,
            'status' => 'active',
        ]);
    }

    public function test_inquiry_is_saved_to_database_when_contact_form_submitted(): void
    {
        Notification::fake();

        $inquiryData = [
            'name' => 'John Buyer',
            'email' => 'buyer@test.com',
            'phone' => '+32123456789',
            'message' => 'I am interested in this vehicle. Is it still available?',
            'requestType' => 'inquiry',
        ];

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", $inquiryData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Your inquiry has been sent successfully',
            ])
            ->assertJsonStructure(['inquiry_id']);

        // CRITICAL: Verify inquiry is actually saved in database
        $this->assertDatabaseHas('inquiries', [
            'vehicle_id' => $this->vehicle->id,
            'name' => 'John Buyer',
            'email' => 'buyer@test.com',
            'phone' => '+32123456789',
            'message' => 'I am interested in this vehicle. Is it still available?',
            'request_type' => 'inquiry',
            'status' => 'new',
        ]);

        // Verify notification was sent
        Notification::assertSentTo($this->seller, VehicleInquiryNotification::class);
    }

    public function test_inquiry_saved_for_test_drive_request(): void
    {
        Notification::fake();

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Test Driver',
            'email' => 'driver@test.com',
            'phone' => '+32987654321',
            'message' => 'I would like to schedule a test drive.',
            'requestType' => 'test-drive',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inquiries', [
            'vehicle_id' => $this->vehicle->id,
            'email' => 'driver@test.com',
            'request_type' => 'test-drive',
        ]);
    }

    public function test_inquiry_saved_for_offer_request(): void
    {
        Notification::fake();

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Offer Maker',
            'email' => 'offer@test.com',
            'message' => 'I would like to make an offer of 45000 EUR.',
            'requestType' => 'offer',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inquiries', [
            'vehicle_id' => $this->vehicle->id,
            'email' => 'offer@test.com',
            'request_type' => 'offer',
        ]);
    }

    public function test_inquiry_saved_for_inspection_request(): void
    {
        Notification::fake();

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Inspector',
            'email' => 'inspect@test.com',
            'phone' => '+32111222333',
            'message' => 'I want to schedule a vehicle inspection.',
            'requestType' => 'inspection',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inquiries', [
            'vehicle_id' => $this->vehicle->id,
            'email' => 'inspect@test.com',
            'request_type' => 'inspection',
        ]);
    }

    public function test_inquiry_validates_required_fields(): void
    {
        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'message', 'requestType']);
    }

    public function test_inquiry_validates_email_format(): void
    {
        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Test User',
            'email' => 'invalid-email',
            'message' => 'Test message',
            'requestType' => 'inquiry',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_inquiry_validates_request_type(): void
    {
        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'message' => 'Test message',
            'requestType' => 'invalid-type',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['requestType']);
    }

    public function test_inquiry_returns_404_for_non_existent_vehicle(): void
    {
        $response = $this->postJson("/api/vehicles/99999/contact", [
            'name' => 'Test User',
            'email' => 'test@test.com',
            'message' => 'Test message',
            'requestType' => 'inquiry',
        ]);

        $response->assertStatus(404);
    }

    public function test_inquiry_can_be_submitted_without_phone(): void
    {
        Notification::fake();

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'No Phone User',
            'email' => 'nophone@test.com',
            'message' => 'Message without phone number',
            'requestType' => 'inquiry',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inquiries', [
            'email' => 'nophone@test.com',
            'phone' => null,
        ]);
    }

    public function test_inquiry_links_to_user_if_authenticated(): void
    {
        Notification::fake();

        $buyer = User::factory()->create(['user_type' => 'buyer']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
                'name' => $buyer->name,
                'email' => $buyer->email,
                'message' => 'Authenticated inquiry',
                'requestType' => 'inquiry',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('inquiries', [
            'vehicle_id' => $this->vehicle->id,
            'user_id' => $buyer->id,
        ]);
    }

    public function test_inquiry_user_id_is_null_if_not_authenticated(): void
    {
        Notification::fake();

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Anonymous User',
            'email' => 'anon@test.com',
            'message' => 'Anonymous inquiry',
            'requestType' => 'inquiry',
        ]);

        $response->assertStatus(200);

        $inquiry = Inquiry::where('email', 'anon@test.com')->first();
        $this->assertNotNull($inquiry);
        $this->assertNull($inquiry->user_id);
    }

    public function test_inquiry_can_be_marked_as_read(): void
    {
        $inquiry = Inquiry::factory()->create([
            'vehicle_id' => $this->vehicle->id,
            'status' => 'new',
            'read_at' => null,
        ]);

        $inquiry->markAsRead();

        $this->assertEquals('read', $inquiry->fresh()->status);
        $this->assertNotNull($inquiry->fresh()->read_at);
    }

    public function test_inquiry_can_be_marked_as_replied(): void
    {
        $inquiry = Inquiry::factory()->create([
            'vehicle_id' => $this->vehicle->id,
            'status' => 'read',
        ]);

        $inquiry->markAsReplied();

        $this->assertEquals('replied', $inquiry->fresh()->status);
        $this->assertNotNull($inquiry->fresh()->replied_at);
    }

    public function test_inquiry_belongs_to_vehicle(): void
    {
        $inquiry = Inquiry::factory()->create([
            'vehicle_id' => $this->vehicle->id,
        ]);

        $this->assertInstanceOf(Vehicle::class, $inquiry->vehicle);
        $this->assertEquals($this->vehicle->id, $inquiry->vehicle->id);
    }

    public function test_inquiry_belongs_to_user_when_set(): void
    {
        $buyer = User::factory()->create();
        
        $inquiry = Inquiry::factory()->create([
            'vehicle_id' => $this->vehicle->id,
            'user_id' => $buyer->id,
        ]);

        $this->assertInstanceOf(User::class, $inquiry->user);
        $this->assertEquals($buyer->id, $inquiry->user->id);
    }

    public function test_multiple_inquiries_can_be_sent_to_same_vehicle(): void
    {
        Notification::fake();

        // First inquiry
        $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'User One',
            'email' => 'one@test.com',
            'message' => 'First inquiry',
            'requestType' => 'inquiry',
        ])->assertStatus(200);

        // Second inquiry
        $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'User Two',
            'email' => 'two@test.com',
            'message' => 'Second inquiry',
            'requestType' => 'test-drive',
        ])->assertStatus(200);

        // Third inquiry
        $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'User Three',
            'email' => 'three@test.com',
            'message' => 'Third inquiry',
            'requestType' => 'offer',
        ])->assertStatus(200);

        $this->assertEquals(3, Inquiry::where('vehicle_id', $this->vehicle->id)->count());
    }

    public function test_inquiry_message_is_truncated_if_too_long(): void
    {
        Notification::fake();

        $longMessage = str_repeat('A', 2001); // Over 2000 character limit

        $response = $this->postJson("/api/vehicles/{$this->vehicle->id}/contact", [
            'name' => 'Long Message User',
            'email' => 'long@test.com',
            'message' => $longMessage,
            'requestType' => 'inquiry',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }
}
