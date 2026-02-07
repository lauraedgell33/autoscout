<?php

namespace Database\Factories;

use App\Models\Dispute;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dispute>
 */
class DisputeFactory extends Factory
{
    protected $model = Dispute::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'raised_by' => User::factory(),
            'reason' => fake()->randomElement([
                'Vehicle not as described',
                'Payment issues',
                'Delivery problems',
                'Documentation issues',
                'Quality concerns',
            ]),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['open', 'under_review', 'resolved', 'closed']),
            'resolution' => null,
            'resolved_at' => null,
        ];
    }

    /**
     * Indicate that the dispute is open.
     */
    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
            'resolution' => null,
            'resolved_at' => null,
        ]);
    }

    /**
     * Indicate that the dispute is under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'under_review',
        ]);
    }

    /**
     * Indicate that the dispute is resolved.
     */
    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'resolution' => fake()->paragraph(),
            'resolved_at' => now(),
        ]);
    }
}
