<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'reviewer_id' => User::factory()->create(['user_type' => 'buyer'])->id,
            'reviewee_id' => User::factory()->create(['user_type' => 'seller'])->id,
            'vehicle_id' => Vehicle::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->paragraph(3),
            'review_type' => $this->faker->randomElement(['buyer', 'seller', 'vehicle']),
            'status' => 'active',
            'verified' => $this->faker->boolean(70),
            'verified_at' => $this->faker->boolean(70) ? now() : null,
            'verification_method' => $this->faker->randomElement(['transaction', 'manual', null]),
            'moderation_status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
            'flagged' => false,
            'flag_count' => 0,
            'helpful_count' => $this->faker->numberBetween(0, 50),
            'not_helpful_count' => $this->faker->numberBetween(0, 10),
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verified' => true,
            'verified_at' => now(),
            'verification_method' => 'transaction',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'moderation_status' => 'pending',
            'verified' => false,
            'verified_at' => null,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'moderation_status' => 'approved',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'moderation_status' => 'rejected',
        ]);
    }

    public function flagged(): static
    {
        return $this->state(fn (array $attributes) => [
            'flagged' => true,
            'flag_count' => $this->faker->numberBetween(3, 10),
        ]);
    }
}
