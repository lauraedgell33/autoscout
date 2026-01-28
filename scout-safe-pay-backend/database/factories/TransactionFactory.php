<?php

namespace Database\Factories;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'transaction_code' => 'TXN-' . $this->faker->bothify('?????#?#?#'),
            'buyer_id' => User::factory(),
            'seller_id' => User::factory(),
            'vehicle_id' => Vehicle::factory(),
            'dealer_id' => null,
            'amount' => $this->faker->numberBetween(10000, 100000),
            'currency' => 'EUR',
            'service_fee' => function (array $attributes) {
                return $attributes['amount'] * 0.025; // 2.5%
            },
            'dealer_commission' => 0,
            'payment_reference' => 'AS24-' . $this->faker->bothify('?????#?#?#'),
            'status' => 'pending',
            'escrow_account_iban' => $this->faker->iban('DE'),
            'escrow_account_country' => 'DE',
            'metadata' => [
                'buyer_name' => $this->faker->name(),
                'buyer_email' => $this->faker->email(),
                'seller_name' => $this->faker->name(),
                'vehicle_title' => $this->faker->words(3, true),
            ],
        ];
    }

    /**
     * Indicate that the transaction is completed.
     */
    public function completed(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'completed',
            ];
        });
    }

    /**
     * Indicate that the transaction is pending.
     */
    public function pending(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
            ];
        });
    }

    /**
     * Indicate that the transaction is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'cancelled',
            ];
        });
    }
}
