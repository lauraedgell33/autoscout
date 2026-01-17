<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@autoscout24.com',
            'password' => Hash::make('admin123456'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Test Seller
        User::create([
            'name' => 'John Seller',
            'email' => 'seller@test.com',
            'password' => Hash::make('password123'),
            'role' => 'seller',
            'phone' => '+49 30 1234567',
            'email_verified_at' => now(),
        ]);

        // Test Buyer
        User::create([
            'name' => 'Jane Buyer',
            'email' => 'buyer@test.com',
            'password' => Hash::make('password123'),
            'role' => 'buyer',
            'phone' => '+49 30 7654321',
            'email_verified_at' => now(),
        ]);

        echo "✅ Created 3 test users:\n";
        echo "   Admin: admin@autoscout24.com / admin123456\n";
        echo "   Seller: seller@test.com / password123\n";
        echo "   Buyer: buyer@test.com / password123\n";
    }
}
