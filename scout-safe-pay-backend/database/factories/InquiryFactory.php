<?php

namespace Database\Factories;

use App\Models\Inquiry;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inquiry>
 */
class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(),
            'user_id' => null,
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'message' => fake()->paragraph(),
            'request_type' => fake()->randomElement(['inquiry', 'test-drive', 'offer', 'inspection']),
            'status' => 'new',
            'admin_notes' => null,
            'read_at' => null,
            'replied_at' => null,
        ];
    }

    /**
     * Indicate that the inquiry is from a registered user.
     */
    public function fromUser(User $user = null): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user?->id ?? User::factory(),
            'name' => $user?->name ?? fake()->name(),
            'email' => $user?->email ?? fake()->safeEmail(),
        ]);
    }

    /**
     * Indicate that the inquiry has been read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'read',
            'read_at' => now(),
        ]);
    }

    /**
     * Indicate that the inquiry has been replied to.
     */
    public function replied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'replied',
            'read_at' => now()->subHours(2),
            'replied_at' => now(),
        ]);
    }

    /**
     * Indicate that the inquiry is closed.
     */
    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
            'read_at' => now()->subDays(2),
            'replied_at' => now()->subDay(),
        ]);
    }

    /**
     * Indicate a test drive request.
     */
    public function testDrive(): static
    {
        return $this->state(fn (array $attributes) => [
            'request_type' => 'test-drive',
            'message' => 'I would like to schedule a test drive for this vehicle.',
        ]);
    }

    /**
     * Indicate an offer request.
     */
    public function offer(): static
    {
        return $this->state(fn (array $attributes) => [
            'request_type' => 'offer',
            'message' => 'I would like to make an offer for this vehicle.',
        ]);
    }

    /**
     * Indicate an inspection request.
     */
    public function inspection(): static
    {
        return $this->state(fn (array $attributes) => [
            'request_type' => 'inspection',
            'message' => 'I would like to schedule an inspection for this vehicle.',
        ]);
    }
}
