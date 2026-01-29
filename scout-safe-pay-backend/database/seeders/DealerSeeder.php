<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Dealer;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DealerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dealers = [
            [
                'name' => 'Premium Auto Munich',
                'company_name' => 'Premium Auto Munich GmbH',
                'type' => 'independent',
                'address' => 'Maximilianstraße 45',
                'city' => 'Munich',
                'postal_code' => '80539',
                'country' => 'DE',
                'phone' => '+49 89 1234567',
                'email' => 'info@premiumautomunich.de',
                'website' => 'https://premiumautomunich.de',
                'vat_number' => 'DE123456789',
                'registration_number' => 'HRB123456',
                'logo_url' => null,
                'is_verified' => true,
                'status' => 'active',
                'verified_at' => now(),
                'max_active_listings' => 100,
            ],
            [
                'name' => 'Berlin Auto Center',
                'company_name' => 'Berlin Auto Center GmbH',
                'type' => 'franchise',
                'address' => 'Kurfürstendamm 100',
                'city' => 'Berlin',
                'postal_code' => '10709',
                'country' => 'DE',
                'phone' => '+49 30 9876543',
                'email' => 'contact@berlinautocenter.de',
                'website' => 'https://berlinautocenter.de',
                'vat_number' => 'DE987654321',
                'registration_number' => 'HRB654321',
                'logo_url' => null,
                'is_verified' => true,
                'status' => 'active',
                'verified_at' => now(),
                'max_active_listings' => 75,
            ],
            [
                'name' => 'Stuttgart Sports Cars',
                'company_name' => 'Stuttgart Sports Cars AG',
                'type' => 'manufacturer',
                'address' => 'Porscheplatz 1',
                'city' => 'Stuttgart',
                'postal_code' => '70435',
                'country' => 'DE',
                'phone' => '+49 711 5555555',
                'email' => 'info@stuttgartsportscars.de',
                'website' => 'https://stuttgartsportscars.de',
                'vat_number' => 'DE555555555',
                'registration_number' => 'HRB555555',
                'logo_url' => null,
                'is_verified' => true,
                'status' => 'active',
                'verified_at' => now(),
                'max_active_listings' => 150,
            ],
            [
                'name' => 'Hamburg Classic Cars',
                'company_name' => 'Hamburg Classic Cars GmbH',
                'type' => 'independent',
                'address' => 'Elbchaussee 50',
                'city' => 'Hamburg',
                'postal_code' => '22765',
                'country' => 'DE',
                'phone' => '+49 40 3333333',
                'email' => 'info@hamburgclassiccars.de',
                'website' => 'https://hamburgclassiccars.de',
                'vat_number' => 'DE333333333',
                'registration_number' => 'HRB333333',
                'logo_url' => null,
                'is_verified' => true,
                'status' => 'active',
                'verified_at' => now(),
                'max_active_listings' => 50,
            ],
            [
                'name' => 'Cologne Family Motors',
                'company_name' => 'Cologne Family Motors GmbH',
                'type' => 'franchise',
                'address' => 'Hohe Straße 75',
                'city' => 'Cologne',
                'postal_code' => '50667',
                'country' => 'DE',
                'phone' => '+49 221 7777777',
                'email' => 'info@colognefamilymotors.de',
                'website' => 'https://colognefamilymotors.de',
                'vat_number' => 'DE777777777',
                'registration_number' => 'HRB777777',
                'logo_url' => null,
                'is_verified' => true,
                'status' => 'active',
                'verified_at' => now(),
                'max_active_listings' => 60,
            ],
        ];

        foreach ($dealers as $dealerData) {
            // Check if dealer with this email already exists
            $existingDealer = Dealer::where('email', $dealerData['email'])->first();
            if ($existingDealer) {
                echo "Dealer with email {$dealerData['email']} already exists (ID: {$existingDealer->id})\n";
                continue;
            }

            // Create dealer
            $dealer = Dealer::create($dealerData);

            // Create a user for this dealer (for login and vehicle management)
            $userName = str_replace(' ', '', $dealerData['company_name']);
            $user = User::create([
                'name' => $dealerData['company_name'],
                'email' => 'dealer' . $dealer->id . '@' . str_replace(['https://', 'http://'], '', $dealerData['website']),
                'password' => Hash::make('password123'),
                'user_type' => 'dealer',
                'dealer_id' => $dealer->id,
                'email_verified_at' => now(),
            ]);

            echo "Created dealer: {$dealerData['company_name']} (ID: {$dealer->id}) with user: {$user->email}\n";
        }
    }
}
