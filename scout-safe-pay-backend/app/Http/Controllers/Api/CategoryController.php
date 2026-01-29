<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all vehicle categories with descriptions
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = [
            [
                'id' => 1,
                'name' => 'Car',
                'slug' => 'car',
                'description' => 'Passenger cars and sedans'
            ],
            [
                'id' => 2,
                'name' => 'Motorcycle',
                'slug' => 'motorcycle',
                'description' => 'Motorcycles and scooters'
            ],
            [
                'id' => 3,
                'name' => 'Van',
                'slug' => 'van',
                'description' => 'Vans and commercial vehicles'
            ],
            [
                'id' => 4,
                'name' => 'Truck',
                'slug' => 'truck',
                'description' => 'Trucks and heavy vehicles'
            ],
            [
                'id' => 5,
                'name' => 'Trailer',
                'slug' => 'trailer',
                'description' => 'Trailers and towing equipment'
            ],
            [
                'id' => 6,
                'name' => 'Caravan',
                'slug' => 'caravan',
                'description' => 'Caravans and camping trailers'
            ],
            [
                'id' => 7,
                'name' => 'Motorhome',
                'slug' => 'motorhome',
                'description' => 'Motorhomes and RVs'
            ],
            [
                'id' => 8,
                'name' => 'Construction Machinery',
                'slug' => 'construction',
                'description' => 'Construction and heavy machinery'
            ],
            [
                'id' => 9,
                'name' => 'Agricultural Machinery',
                'slug' => 'agricultural',
                'description' => 'Agricultural equipment and tractors'
            ],
            [
                'id' => 10,
                'name' => 'Forklift',
                'slug' => 'forklift',
                'description' => 'Forklifts and warehouse equipment'
            ],
            [
                'id' => 11,
                'name' => 'Boat',
                'slug' => 'boat',
                'description' => 'Boats and watercraft'
            ],
            [
                'id' => 12,
                'name' => 'ATV',
                'slug' => 'atv',
                'description' => 'All-terrain vehicles'
            ],
            [
                'id' => 13,
                'name' => 'Quad',
                'slug' => 'quad',
                'description' => 'Quad bikes and four-wheelers'
            ],
        ];

        return response()->json([
            'data' => $categories,
            'total' => count($categories),
            'success' => true
        ]);
    }

    /**
     * Get a single category by slug
     *
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        $categories = $this->index()->getData()->data;
        
        $category = collect($categories)->firstWhere('slug', $slug);

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'data' => $category,
            'success' => true
        ]);
    }
}
