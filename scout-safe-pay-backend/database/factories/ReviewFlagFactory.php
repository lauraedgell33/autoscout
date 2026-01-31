<?php

namespace Database\Factories;

use App\Models\ReviewFlag;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFlagFactory extends Factory
{
    protected $model = ReviewFlag::class;

    public function definition(): array
    {
        return [
            'review_id' => Review::factory(),
            'user_id' => User::factory(),
            'reason' => $this->faker->randomElement([
                'inappropriate',
                'spam',
                'fake',
                'offensive',
                'misleading',
                'other'
            ]),
            'details' => $this->faker->optional()->sentence(),
            'ip_address' => $this->faker->ipv4(),
        ];
    }
}
