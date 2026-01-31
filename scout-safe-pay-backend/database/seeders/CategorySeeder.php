<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Car',
                'slug' => 'car',
                'description' => 'Passenger cars and sedans',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Motorcycle',
                'slug' => 'motorcycle',
                'description' => 'Motorcycles and bikes',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Van',
                'slug' => 'van',
                'description' => 'Cargo and passenger vans',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Truck',
                'slug' => 'truck',
                'description' => 'Commercial trucks',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Trailer',
                'slug' => 'trailer',
                'description' => 'Trailers and semi-trailers',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Caravan',
                'slug' => 'caravan',
                'description' => 'Caravans and travel trailers',
                'icon' => 'heroicon-o-home',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'Motorhome',
                'slug' => 'motorhome',
                'description' => 'Motorhomes and RVs',
                'icon' => 'heroicon-o-home',
                'sort_order' => 7,
                'is_active' => true,
            ],
            [
                'name' => 'Construction Machinery',
                'slug' => 'construction_machinery',
                'description' => 'Excavators, bulldozers, cranes',
                'icon' => 'heroicon-o-wrench-screwdriver',
                'sort_order' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Agricultural Machinery',
                'slug' => 'agricultural_machinery',
                'description' => 'Tractors, harvesters, farming equipment',
                'icon' => 'heroicon-o-wrench-screwdriver',
                'sort_order' => 9,
                'is_active' => true,
            ],
            [
                'name' => 'Forklift',
                'slug' => 'forklift',
                'description' => 'Forklifts and warehouse equipment',
                'icon' => 'heroicon-o-cube',
                'sort_order' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Boat',
                'slug' => 'boat',
                'description' => 'Boats and watercraft',
                'icon' => 'heroicon-o-lifebuoy',
                'sort_order' => 11,
                'is_active' => true,
            ],
            [
                'name' => 'ATV',
                'slug' => 'atv',
                'description' => 'All-terrain vehicles',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Quad',
                'slug' => 'quad',
                'description' => 'Quad bikes and four-wheelers',
                'icon' => 'heroicon-o-truck',
                'sort_order' => 13,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        $this->command->info('Categories seeded successfully!');
    }
}
