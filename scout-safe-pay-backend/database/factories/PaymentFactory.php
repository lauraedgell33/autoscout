<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'transaction_id' => Transaction::factory(),
            'payer_id' => User::factory(),
            'payment_method' => $this->faker->randomElement(['bank_transfer', 'credit_card', 'debit_card']),
            'amount' => $this->faker->numberBetween(10000, 100000),
            'currency' => 'EUR',
            'status' => 'pending',
            'payment_reference' => $this->faker->unique()->bothify('PAY-?????-#####'),
            'payment_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'processed_date' => null,
            'metadata' => [
                'payment_method_details' => $this->faker->creditCardNumber(),
                'processor' => 'stripe',
            ],
        ];
    }

    /**
     * Indicate that the payment is completed.
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
                'processed_date' => $this->faker->dateTime(),
            ];
        });
    }

    /**
     * Indicate that the payment is failed.
     */
    public function failed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'failed',
            ];
        });
    }

    /**
     * Indicate that the payment is refunded.
     */
    public function refunded(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'refunded',
                'processed_date' => $this->faker->dateTime(),
            ];
        });
    }
}
