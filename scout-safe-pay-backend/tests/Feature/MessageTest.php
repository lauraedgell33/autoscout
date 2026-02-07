<?php

namespace Tests\Feature;

use App\Models\Message;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    private User $buyer;
    private User $seller;
    private Vehicle $vehicle;
    private Transaction $transaction;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seller = User::factory()->create([
            'user_type' => 'seller',
            'email' => 'seller@test.com',
        ]);
        
        $this->buyer = User::factory()->create([
            'user_type' => 'buyer',
            'email' => 'buyer@test.com',
        ]);
        
        $this->vehicle = Vehicle::factory()->create([
            'seller_id' => $this->seller->id,
            'make' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
            'price' => 50000,
            'status' => 'active',
        ]);

        $this->transaction = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => $this->seller->id,
            'vehicle_id' => $this->vehicle->id,
            'amount' => 50000,
            'status' => 'pending',
        ]);
    }

    public function test_buyer_can_send_message_in_transaction(): void
    {
        Notification::fake();

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages", [
                'message' => 'Hello, I have a question about the vehicle.',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Message sent successfully',
            ])
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'transaction_id',
                    'sender',
                    'receiver',
                    'message',
                    'created_at',
                ],
            ]);

        // CRITICAL: Verify message is saved in database
        $this->assertDatabaseHas('messages', [
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
            'message' => 'Hello, I have a question about the vehicle.',
        ]);
    }

    public function test_seller_can_send_message_in_transaction(): void
    {
        Notification::fake();

        $response = $this->actingAs($this->seller, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages", [
                'message' => 'Thank you for your interest! How can I help?',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('messages', [
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
            'message' => 'Thank you for your interest! How can I help?',
        ]);
    }

    public function test_non_participant_cannot_send_message(): void
    {
        $stranger = User::factory()->create();

        $response = $this->actingAs($stranger, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages", [
                'message' => 'Trying to send unauthorized message.',
            ]);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('messages', [
            'transaction_id' => $this->transaction->id,
            'sender_id' => $stranger->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_send_message(): void
    {
        $response = $this->postJson("/api/transactions/{$this->transaction->id}/messages", [
            'message' => 'Unauthorized message.',
        ]);

        $response->assertStatus(401);
    }

    public function test_buyer_can_retrieve_messages(): void
    {
        // Create some messages
        Message::factory()->count(3)->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/transactions/{$this->transaction->id}/messages");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'messages',
                'transaction',
            ]);

        $this->assertCount(3, $response->json('messages'));
    }

    public function test_seller_can_retrieve_messages(): void
    {
        Message::factory()->count(2)->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->getJson("/api/transactions/{$this->transaction->id}/messages");

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('messages'));
    }

    public function test_non_participant_cannot_retrieve_messages(): void
    {
        $stranger = User::factory()->create();

        $response = $this->actingAs($stranger, 'sanctum')
            ->getJson("/api/transactions/{$this->transaction->id}/messages");

        $response->assertStatus(403);
    }

    public function test_messages_are_marked_as_read_when_retrieved(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
            'is_read' => false,
            'read_at' => null,
        ]);

        $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/transactions/{$this->transaction->id}/messages");

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'is_read' => true,
        ]);

        $this->assertNotNull($message->fresh()->read_at);
    }

    public function test_sender_messages_not_marked_read_when_retrieved(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
            'is_read' => false,
        ]);

        // Buyer retrieves their own sent messages - should NOT be marked as read
        // (only receiver's messages should be marked as read)
        $this->actingAs($this->buyer, 'sanctum')
            ->getJson("/api/transactions/{$this->transaction->id}/messages");

        // Message should still be unread (buyer is the sender)
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'is_read' => false,
        ]);
    }

    public function test_mark_single_message_as_read(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages/{$message->id}/read");

        $response->assertStatus(200);

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'is_read' => true,
        ]);
    }

    public function test_sender_cannot_mark_own_message_as_read(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages/{$message->id}/read");

        $response->assertStatus(403);
    }

    public function test_mark_all_messages_as_read(): void
    {
        Message::factory()->count(3)->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages/read-all");

        $response->assertStatus(200)
            ->assertJsonStructure(['count']);

        $this->assertEquals(3, $response->json('count'));

        // Verify all are marked as read
        $unreadCount = Message::where('transaction_id', $this->transaction->id)
            ->where('receiver_id', $this->buyer->id)
            ->where('is_read', false)
            ->count();

        $this->assertEquals(0, $unreadCount);
    }

    public function test_get_unread_count(): void
    {
        Message::factory()->count(5)->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
            'is_read' => false,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/messages/unread-count');

        $response->assertStatus(200)
            ->assertJson(['unread_count' => 5]);
    }

    public function test_get_all_conversations(): void
    {
        // Create another transaction/conversation
        $transaction2 = Transaction::factory()->create([
            'buyer_id' => $this->buyer->id,
            'seller_id' => User::factory()->create(['user_type' => 'seller'])->id,
            'vehicle_id' => Vehicle::factory()->create(['seller_id' => $this->seller->id])->id,
        ]);

        Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->seller->id,
            'receiver_id' => $this->buyer->id,
        ]);

        Message::factory()->create([
            'transaction_id' => $transaction2->id,
            'sender_id' => $transaction2->seller_id,
            'receiver_id' => $this->buyer->id,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->getJson('/api/messages/conversations');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'conversations' => [
                    '*' => [
                        'transaction_id',
                        'transaction',
                        'other_party',
                        'last_message',
                        'unread_count',
                    ],
                ],
            ]);

        $this->assertCount(2, $response->json('conversations'));
    }

    public function test_sender_can_delete_own_message(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
        ]);

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->deleteJson("/api/transactions/{$this->transaction->id}/messages/{$message->id}");

        $response->assertStatus(200);

        // Soft deleted
        $this->assertSoftDeleted('messages', ['id' => $message->id]);
    }

    public function test_receiver_cannot_delete_message(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
        ]);

        $response = $this->actingAs($this->seller, 'sanctum')
            ->deleteJson("/api/transactions/{$this->transaction->id}/messages/{$message->id}");

        $response->assertStatus(403);

        // Not deleted
        $this->assertDatabaseHas('messages', ['id' => $message->id, 'deleted_at' => null]);
    }

    public function test_message_validates_content(): void
    {
        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages", [
                'message' => '', // Empty message
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }

    public function test_message_validates_max_length(): void
    {
        $longMessage = str_repeat('A', 5001); // Over 5000 limit

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages", [
                'message' => $longMessage,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }

    public function test_message_can_include_attachments(): void
    {
        Notification::fake();

        $response = $this->actingAs($this->buyer, 'sanctum')
            ->postJson("/api/transactions/{$this->transaction->id}/messages", [
                'message' => 'Here are some documents.',
                'attachments' => [
                    'https://example.com/doc1.pdf',
                    'https://example.com/image.jpg',
                ],
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('messages', [
            'transaction_id' => $this->transaction->id,
            'message' => 'Here are some documents.',
        ]);

        $message = Message::where('transaction_id', $this->transaction->id)->first();
        $this->assertNotNull($message->attachments);
        $this->assertCount(2, $message->attachments);
    }

    public function test_message_belongs_to_transaction(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
        ]);

        $this->assertInstanceOf(Transaction::class, $message->transaction);
        $this->assertEquals($this->transaction->id, $message->transaction->id);
    }

    public function test_message_belongs_to_sender_and_receiver(): void
    {
        $message = Message::factory()->create([
            'transaction_id' => $this->transaction->id,
            'sender_id' => $this->buyer->id,
            'receiver_id' => $this->seller->id,
        ]);

        $this->assertInstanceOf(User::class, $message->sender);
        $this->assertInstanceOf(User::class, $message->receiver);
        $this->assertEquals($this->buyer->id, $message->sender->id);
        $this->assertEquals($this->seller->id, $message->receiver->id);
    }
}
