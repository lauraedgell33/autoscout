<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seller_id' => User::factory(),
            'category' => $this->faker->randomElement(['car', 'motorcycle', 'van', 'truck', 'trailer', 'caravan']),
            'make' => $this->faker->word(),
            'model' => $this->faker->word(),
            'year' => $this->faker->year(),
            'color' => $this->faker->colorName(),
            'mileage' => $this->faker->numberBetween(0, 200000),
            'price' => $this->faker->numberBetween(5000, 50000),
            'description' => $this->faker->paragraph(),
            'status' => 'active',
        ];
    }
}
