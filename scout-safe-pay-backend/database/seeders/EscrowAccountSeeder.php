<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\BankAccount;
use Illuminate\Database\Seeder;

class EscrowAccountSeeder extends Seeder
{
    public function run(): void
    {
        // Create AutoScout24 system user for escrow account
        $systemUser = User::firstOrCreate(
            ['email' => 'escrow@autoscout24.com'],
            [
                'name' => 'AutoScout24 Escrow',
                'password' => bcrypt('secure-system-password-' . uniqid()),
                'user_type' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create AutoScout24 Escrow Bank Account
        BankAccount::firstOrCreate(
            ['accountable_id' => $systemUser->id, 'accountable_type' => User::class],
            [
                'account_holder_name' => 'AutoScout24 SafeTrade Escrow',
                'iban' => 'DE89370400440532013000', // Example IBAN - REPLACE WITH REAL
                'swift_bic' => 'COBADEFFXXX',
                'bank_name' => 'Commerzbank AG',
                'bank_country' => 'DE',
                'currency' => 'EUR',
                'is_verified' => true,
                'is_primary' => true,
                'verified_by' => $systemUser->id,
                'verified_at' => now(),
                'verification_notes' => 'Official AutoScout24 escrow account for SafeTrade transactions',
            ]
        );

        $this->command->info('✅ AutoScout24 Escrow account created successfully!');
        $this->command->warn('⚠️  IMPORTANT: Update IBAN with real escrow bank account details');
    }
}
