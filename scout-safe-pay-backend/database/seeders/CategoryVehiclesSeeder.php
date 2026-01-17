<?php

namespace Database\Seeders;

use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategoryVehiclesSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::where('email', 'seller@test.com')->first();
        
        if (!$seller) {
            $this->command->error('Seller not found. Please run DatabaseSeeder first.');
            return;
        }

        $vehicles = [
            // Cars
            [
                'category' => 'car',
                'make' => 'BMW',
                'model' => 'X5',
                'year' => 2022,
                'price' => 68500,
                'description' => 'Luxury SUV with premium features',
                'mileage' => 25000,
                'fuel_type' => 'diesel',
                'transmission' => 'automatic',
                'body_type' => 'suv',
                'images' => ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
            ],
            
            // Motorcycles
            [
                'category' => 'motorcycle',
                'make' => 'Harley-Davidson',
                'model' => 'Street Glide',
                'year' => 2023,
                'price' => 28900,
                'description' => 'Classic American cruiser motorcycle',
                'mileage' => 1200,
                'fuel_type' => 'petrol',
                'transmission' => 'manual',
                'engine_size' => 1868,
                'power_hp' => 92,
                'images' => ['https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800'],
            ],
            [
                'category' => 'motorcycle',
                'make' => 'Ducati',
                'model' => 'Panigale V4',
                'year' => 2024,
                'price' => 35500,
                'description' => 'High-performance sports motorcycle',
                'mileage' => 500,
                'fuel_type' => 'petrol',
                'transmission' => 'manual',
                'engine_size' => 1103,
                'power_hp' => 214,
                'images' => ['https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800'],
            ],
            
            // Vans
            [
                'category' => 'van',
                'make' => 'Mercedes-Benz',
                'model' => 'Sprinter 316',
                'year' => 2021,
                'price' => 42000,
                'description' => 'Professional cargo van with high roof',
                'mileage' => 78000,
                'fuel_type' => 'diesel',
                'transmission' => 'manual',
                'body_type' => 'van',
                'images' => ['https://images.unsplash.com/photo-1527016021513-b09758b777bd?w=800'],
            ],
            
            // Trucks
            [
                'category' => 'truck',
                'make' => 'MAN',
                'model' => 'TGX 18.500',
                'year' => 2020,
                'price' => 78900,
                'description' => '18-ton truck with Euro 6 engine',
                'mileage' => 245000,
                'fuel_type' => 'diesel',
                'transmission' => 'automatic',
                'engine_size' => 12419,
                'power_hp' => 500,
                'images' => ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800'],
            ],
            
            // Motorhome
            [
                'category' => 'motorhome',
                'make' => 'Hymer',
                'model' => 'B-Klasse DL',
                'year' => 2022,
                'price' => 125000,
                'description' => 'Luxury motorhome with all amenities',
                'mileage' => 12000,
                'fuel_type' => 'diesel',
                'transmission' => 'automatic',
                'seats' => 4,
                'images' => ['https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800'],
            ],
            
            // Construction Machinery
            [
                'category' => 'construction_machinery',
                'make' => 'Caterpillar',
                'model' => '320 GC',
                'year' => 2021,
                'price' => 185000,
                'description' => 'Hydraulic excavator 20-ton class',
                'mileage' => 2400, // operating hours
                'fuel_type' => 'diesel',
                'engine_size' => 4400,
                'power_hp' => 121,
                'images' => ['https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800'],
            ],
            
            // Agricultural Machinery
            [
                'category' => 'agricultural_machinery',
                'make' => 'John Deere',
                'model' => '6155R',
                'year' => 2020,
                'price' => 145000,
                'description' => 'Agricultural tractor with front loader',
                'mileage' => 3200, // operating hours
                'fuel_type' => 'diesel',
                'engine_size' => 6800,
                'power_hp' => 155,
                'images' => ['https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800'],
            ],
            
            // Forklift
            [
                'category' => 'forklift',
                'make' => 'Linde',
                'model' => 'H30T',
                'year' => 2023,
                'price' => 38500,
                'description' => '3-ton diesel forklift truck',
                'mileage' => 800, // operating hours
                'fuel_type' => 'diesel',
                'engine_size' => 3300,
                'images' => ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
            ],
            
            // ATV
            [
                'category' => 'atv',
                'make' => 'Polaris',
                'model' => 'Sportsman 570',
                'year' => 2024,
                'price' => 12800,
                'description' => 'All-terrain vehicle for work and leisure',
                'mileage' => 350,
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'engine_size' => 567,
                'power_hp' => 44,
                'images' => ['https://images.unsplash.com/photo-1558980663-3685c1d673c4?w=800'],
            ],
            
            // Quad
            [
                'category' => 'quad',
                'make' => 'Yamaha',
                'model' => 'YFZ450R',
                'year' => 2023,
                'price' => 9500,
                'description' => 'Sport quad bike for racing',
                'mileage' => 1200,
                'fuel_type' => 'petrol',
                'transmission' => 'manual',
                'engine_size' => 449,
                'power_hp' => 39,
                'images' => ['https://images.unsplash.com/photo-1593642532400-2682810df593?w=800'],
            ],
        ];

        foreach ($vehicles as $vehicleData) {
            Vehicle::create(array_merge($vehicleData, [
                'seller_id' => $seller->id,
                'dealer_id' => $seller->dealer_id ?? null,
                'status' => 'active',
                'currency' => 'EUR',
                'location_city' => 'Berlin',
                'location_country' => 'DE',
                'color' => 'black',
            ]));
        }

        $this->command->info('Category vehicles seeded successfully!');
    }
}
