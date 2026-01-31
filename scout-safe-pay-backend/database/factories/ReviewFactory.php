<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'reviewer_id' => User::factory(),
            'reviewee_id' => User::factory(),
            'vehicle_id' => Vehicle::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->paragraph(),
            'review_type' => $this->faker->randomElement(['buyer_to_seller', 'seller_to_buyer']),
            'status' => 'pending',
            'verified' => false,
            'flag_count' => 0,
            'helpful_count' => 0,
            'not_helpful_count' => 0,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'moderation_status' => 'approved',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'moderation_status' => 'pending',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'moderation_status' => 'rejected',
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verified' => true,
            'verified_at' => now(),
            'verification_method' => 'admin',
        ]);
    }

    public function flagged(): static
    {
        return $this->state(fn (array $attributes) => [
            'flagged' => true,
            'flag_count' => $this->faker->numberBetween(1, 5),
        ]);
    }
}
