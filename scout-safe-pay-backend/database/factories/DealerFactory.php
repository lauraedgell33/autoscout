<?php

namespace Database\Factories;

use App\Models\Dealer;
use Illuminate\Database\Eloquent\Factories\Factory;

class DealerFactory extends Factory
{
    protected $model = Dealer::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'company_name' => $this->faker->company(),
            'vat_number' => 'DE' . $this->faker->numerify('#########'),
            'registration_number' => $this->faker->numerify('HRB #####'),
            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'country' => $this->faker->randomElement(['DE', 'AT', 'CH', 'NL', 'BE']),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'website' => $this->faker->optional()->url(),
            'type' => $this->faker->randomElement(['independent', 'franchise', 'manufacturer']),
            'status' => 'active',
            'max_active_listings' => $this->faker->numberBetween(10, 100),
            'is_verified' => false,
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }
}
