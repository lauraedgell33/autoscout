<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Dealer;
use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\BankAccount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds for comprehensive testing.
     */
    public function run(): void
    {
        $this->command->info('🧪 Creating test users for comprehensive testing...');

        // Create roles if they don't exist
        $this->createRoles();

        // Create Test Buyer
        $buyer = $this->createBuyer();
        
        // Create Test Seller
        $seller = $this->createSeller();
        
        // Create Test Admin (using provided credentials)
        $admin = $this->createAdmin();
        
        // Create Test Dealer
        $dealer = $this->createDealer();
        
        // Create additional test users for different scenarios
        $this->createAdditionalTestUsers();
        
        // Create test vehicles
        $this->createTestVehicles($seller);
        
        // Create test transactions
        $this->createTestTransactions($buyer, $seller);

        $this->command->info('');
        $this->command->info('✅ Test users created successfully!');
        $this->command->info('');
        $this->command->info('📋 Test Credentials:');
        $this->command->info('─────────────────────────────────────────────────────');
        $this->command->info('👤 BUYER:    buyer.test@autoscout.dev    | BuyerPass123!');
        $this->command->info('👤 SELLER:   seller.test@autoscout.dev   | SellerPass123!');
        $this->command->info('👤 ADMIN:    admin@autoscout.dev         | Admin123!@#');
        $this->command->info('🏢 DEALER:   dealer.test@autoscout.dev   | DealerPass123!');
        $this->command->info('─────────────────────────────────────────────────────');
    }

    private function createRoles(): void
    {
        $roles = ['admin', 'buyer', 'seller', 'dealer'];
        
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }

    private function createBuyer(): User
    {
        $buyer = User::updateOrCreate(
            ['email' => 'buyer.test@autoscout.dev'],
            [
                'name' => 'Test Buyer',
                'email' => 'buyer.test@autoscout.dev',
                'password' => Hash::make('BuyerPass123!'),
                'user_type' => 'buyer',
                'phone' => '+49123456001',
                'country' => 'DE',
                'address' => '123 Buyer Street, Berlin, Germany',
                'email_verified_at' => now(),
                'kyc_verified_at' => now(),
            ]
        );

        $buyer->assignRole('buyer');

        // Create bank account for buyer (using polymorphic relationship)
        BankAccount::updateOrCreate(
            ['accountable_type' => User::class, 'accountable_id' => $buyer->id, 'iban' => 'DE89370400440532013001'],
            [
                'accountable_type' => User::class,
                'accountable_id' => $buyer->id,
                'account_holder_name' => 'Test Buyer',
                'iban' => 'DE89370400440532013001',
                'swift_bic' => 'COBADEFFXXX',
                'bank_name' => 'Commerzbank',
                'bank_country' => 'DE',
                'currency' => 'EUR',
                'is_verified' => true,
                'is_primary' => true,
                'verified_at' => now(),
            ]
        );

        return $buyer;
    }

    private function createSeller(): User
    {
        $seller = User::updateOrCreate(
            ['email' => 'seller.test@autoscout.dev'],
            [
                'name' => 'Test Seller',
                'email' => 'seller.test@autoscout.dev',
                'password' => Hash::make('SellerPass123!'),
                'user_type' => 'seller',
                'phone' => '+49123456002',
                'country' => 'DE',
                'address' => '456 Seller Avenue, Munich, Germany',
                'email_verified_at' => now(),
                'kyc_verified_at' => now(),
            ]
        );

        $seller->assignRole('seller');

        // Create bank account for seller (using polymorphic relationship)
        BankAccount::updateOrCreate(
            ['accountable_type' => User::class, 'accountable_id' => $seller->id, 'iban' => 'DE89370400440532013002'],
            [
                'accountable_type' => User::class,
                'accountable_id' => $seller->id,
                'account_holder_name' => 'Test Seller',
                'iban' => 'DE89370400440532013002',
                'swift_bic' => 'COBADEFFXXX',
                'bank_name' => 'Commerzbank',
                'bank_country' => 'DE',
                'currency' => 'EUR',
                'is_verified' => true,
                'is_primary' => true,
                'verified_at' => now(),
            ]
        );

        return $seller;
    }

    private function createAdmin(): User
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@autoscout.dev'],
            [
                'name' => 'Admin User',
                'email' => 'admin@autoscout.dev',
                'password' => Hash::make('Admin123!@#'),
                'user_type' => 'admin',
                'phone' => '+49123456000',
                'country' => 'DE',
                'address' => 'Admin Office, Frankfurt, Germany',
                'email_verified_at' => now(),
                'kyc_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        return $admin;
    }

    private function createDealer(): User
    {
        // Create dealer company first
        $dealer = Dealer::updateOrCreate(
            ['email' => 'info@autotest.de'],
            [
                'name' => 'AutoTest',
                'company_name' => 'AutoTest GmbH',
                'registration_number' => 'HRB123456',
                'vat_number' => 'DE123456789',
                'address' => '789 Dealer Boulevard',
                'city' => 'Hamburg',
                'postal_code' => '20095',
                'country' => 'DE',
                'phone' => '+49123456003',
                'email' => 'info@autotest.de',
                'website' => 'https://autotest.de',
                'type' => 'franchise',
                'status' => 'active',
                'is_verified' => true,
                'verified_at' => now(),
            ]
        );

        // Create dealer user account
        $dealerUser = User::updateOrCreate(
            ['email' => 'dealer.test@autoscout.dev'],
            [
                'name' => 'Test Dealer',
                'email' => 'dealer.test@autoscout.dev',
                'password' => Hash::make('DealerPass123!'),
                'user_type' => 'dealer',
                'phone' => '+49123456003',
                'country' => 'DE',
                'address' => '789 Dealer Boulevard, Hamburg, Germany',
                'email_verified_at' => now(),
                'kyc_verified_at' => now(),
                'dealer_id' => $dealer->id,
            ]
        );

        $dealerUser->assignRole('dealer');

        return $dealerUser;
    }

    private function createAdditionalTestUsers(): void
    {
        // Create unverified buyer
        $unverifiedBuyer = User::updateOrCreate(
            ['email' => 'unverified.buyer@autoscout.dev'],
            [
                'name' => 'Unverified Buyer',
                'email' => 'unverified.buyer@autoscout.dev',
                'password' => Hash::make('TestPass123!'),
                'user_type' => 'buyer',
                'phone' => '+49123456010',
                'country' => 'DE',
                'email_verified_at' => null,
            ]
        );

        // Create inactive seller (for testing different scenarios)
        $inactiveSeller = User::updateOrCreate(
            ['email' => 'inactive.seller@autoscout.dev'],
            [
                'name' => 'Inactive Seller',
                'email' => 'inactive.seller@autoscout.dev',
                'password' => Hash::make('TestPass123!'),
                'user_type' => 'seller',
                'phone' => '+49123456011',
                'country' => 'DE',
                'email_verified_at' => now(),
            ]
        );

        // Create second buyer for transaction testing
        $buyer2 = User::updateOrCreate(
            ['email' => 'buyer2.test@autoscout.dev'],
            [
                'name' => 'Second Test Buyer',
                'email' => 'buyer2.test@autoscout.dev',
                'password' => Hash::make('BuyerPass123!'),
                'user_type' => 'buyer',
                'phone' => '+49123456012',
                'country' => 'AT',
                'address' => '123 Vienna Street, Vienna, Austria',
                'email_verified_at' => now(),
                'kyc_verified_at' => now(),
            ]
        );
        $buyer2->assignRole('buyer');

        // Create second seller
        $seller2 = User::updateOrCreate(
            ['email' => 'seller2.test@autoscout.dev'],
            [
                'name' => 'Second Test Seller',
                'email' => 'seller2.test@autoscout.dev',
                'password' => Hash::make('SellerPass123!'),
                'user_type' => 'seller',
                'phone' => '+49123456013',
                'country' => 'CH',
                'address' => '456 Zurich Avenue, Zurich, Switzerland',
                'email_verified_at' => now(),
                'kyc_verified_at' => now(),
            ]
        );
        $seller2->assignRole('seller');
    }

    private function createTestVehicles(User $seller): void
    {
        $vehicles = [
            [
                'seller_id' => $seller->id,
                'make' => 'BMW',
                'model' => 'X5',
                'year' => 2022,
                'price' => 55000,
                'mileage' => 25000,
                'fuel_type' => 'diesel',
                'transmission' => 'automatic',
                'body_type' => 'suv',
                'color' => 'black',
                'vin' => 'WBAPH5C55BA123456',
                'description' => 'Excellent condition BMW X5 for testing',
                'status' => 'active',
                'location_city' => 'Munich',
                'location_country' => 'DE',
            ],
            [
                'seller_id' => $seller->id,
                'make' => 'Mercedes-Benz',
                'model' => 'E-Class',
                'year' => 2021,
                'price' => 45000,
                'mileage' => 35000,
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'body_type' => 'sedan',
                'color' => 'silver',
                'vin' => 'WDD2130421A234567',
                'description' => 'Beautiful Mercedes E-Class for testing',
                'status' => 'active',
                'location_city' => 'Berlin',
                'location_country' => 'DE',
            ],
            [
                'seller_id' => $seller->id,
                'make' => 'Audi',
                'model' => 'A4',
                'year' => 2023,
                'price' => 38000,
                'mileage' => 10000,
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'body_type' => 'sedan',
                'color' => 'white',
                'vin' => 'WAUZZZ8V8NA345678',
                'description' => 'Nearly new Audi A4 for testing',
                'status' => 'active',
                'location_city' => 'Frankfurt',
                'location_country' => 'DE',
            ],
            [
                'seller_id' => $seller->id,
                'make' => 'Volkswagen',
                'model' => 'Golf',
                'year' => 2020,
                'price' => 22000,
                'mileage' => 45000,
                'fuel_type' => 'diesel',
                'transmission' => 'manual',
                'body_type' => 'hatchback',
                'color' => 'blue',
                'vin' => 'WVWZZZ1KZAW456789',
                'description' => 'Reliable VW Golf for testing',
                'status' => 'active',
                'location_city' => 'Hamburg',
                'location_country' => 'DE',
            ],
            [
                'seller_id' => $seller->id,
                'make' => 'Porsche',
                'model' => '911',
                'year' => 2022,
                'price' => 125000,
                'mileage' => 5000,
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'body_type' => 'coupe',
                'color' => 'red',
                'vin' => 'WP0ZZZ99ZNS567890',
                'description' => 'Premium Porsche 911 for high-value testing',
                'status' => 'active',
                'location_city' => 'Stuttgart',
                'location_country' => 'DE',
            ],
        ];

        foreach ($vehicles as $vehicleData) {
            Vehicle::updateOrCreate(
                ['vin' => $vehicleData['vin']],
                $vehicleData
            );
        }
    }

    private function createTestTransactions(User $buyer, User $seller): void
    {
        $vehicles = Vehicle::where('seller_id', $seller->id)->get();
        
        if ($vehicles->isEmpty()) {
            return;
        }

        // Transaction in different states for testing (using valid status values)
        $statuses = [
            'pending' => null,
            'completed' => 'payment_proof.pdf',
        ];

        $index = 0;
        foreach ($statuses as $status => $paymentProof) {
            if ($index >= $vehicles->count()) break;
            
            $vehicle = $vehicles[$index];
            
            Transaction::updateOrCreate(
                ['vehicle_id' => $vehicle->id, 'buyer_id' => $buyer->id],
                [
                    'buyer_id' => $buyer->id,
                    'seller_id' => $seller->id,
                    'vehicle_id' => $vehicle->id,
                    'amount' => $vehicle->price,
                    'currency' => 'EUR',
                    'service_fee' => $vehicle->price * 0.025,
                    'status' => $status,
                    'payment_proof' => $paymentProof,
                    'payment_proof_uploaded_at' => $paymentProof ? now() : null,
                    'payment_verified_at' => in_array($status, ['payment_verified', 'inspection_scheduled', 'completed']) ? now() : null,
                    'completed_at' => $status === 'completed' ? now() : null,
                ]
            );
            
            $index++;
        }
    }
}
