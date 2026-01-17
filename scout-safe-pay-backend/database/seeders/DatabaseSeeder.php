<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users
        $buyer = User::factory()->create([
            'name' => 'Test Buyer',
            'email' => 'buyer@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'buyer',
            'country' => 'DE',
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'user_type' => 'admin',
            'country' => 'DE',
        ]);

        // Call other seeders
        $this->call([
            VehicleSeeder::class,
            LegalDocumentSeeder::class,
        ]);

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('👤 Buyer: buyer@test.com / password');
        $this->command->info('👤 Seller: seller@test.com / password');
        $this->command->info('👤 Admin: admin@test.com / password');
    }
}
