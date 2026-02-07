<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'sender_id' => User::factory(),
            'receiver_id' => User::factory(),
            'message' => fake()->paragraph(),
            'attachments' => null,
            'is_read' => false,
            'read_at' => null,
            'is_system_message' => false,
            'metadata' => null,
        ];
    }

    /**
     * Indicate that the message has been read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Indicate that this is a system message.
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_system_message' => true,
            'message' => 'System notification: Transaction status updated.',
        ]);
    }

    /**
     * Add attachments to the message.
     */
    public function withAttachments(array $urls = null): static
    {
        return $this->state(fn (array $attributes) => [
            'attachments' => $urls ?? [
                'https://example.com/document.pdf',
                'https://example.com/image.jpg',
            ],
        ]);
    }
}
