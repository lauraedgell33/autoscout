<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VehicleDataController extends Controller
{
    /**
     * Get all vehicle categories
     */
    public function categories(): JsonResponse
    {
        $categories = config('vehicles.categories');
        
        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get makes for a specific category
     */
    public function makes(string $category): JsonResponse
    {
        $category = strtolower($category);
        $makes = config("vehicles.makes.{$category}");
        
        if (!$makes) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }
        
        // Format the makes array for easier frontend consumption
        $formattedMakes = [];
        foreach ($makes as $id => $make) {
            $formattedMakes[] = [
                'id' => $id,
                'name' => $make['name'],
                'country' => $make['country'],
            ];
        }
        
        // Sort by name
        usort($formattedMakes, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        return response()->json([
            'success' => true,
            'data' => $formattedMakes,
        ]);
    }

    /**
     * Get models for a specific make in a category
     */
    public function models(string $category, string $makeId): JsonResponse
    {
        $category = strtolower($category);
        $make = config("vehicles.makes.{$category}.{$makeId}");
        
        if (!$make) {
            return response()->json([
                'success' => false,
                'message' => 'Make not found in this category',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'make' => [
                    'id' => $makeId,
                    'name' => $make['name'],
                    'country' => $make['country'],
                ],
                'models' => $make['models'],
            ],
        ]);
    }

    /**
     * Get all makes and models for a category (for initial form load)
     */
    public function categoryData(string $category): JsonResponse
    {
        $category = strtolower($category);
        $makes = config("vehicles.makes.{$category}");
        
        if (!$makes) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }
        
        // Format with full data including models
        $formattedMakes = [];
        foreach ($makes as $id => $make) {
            $formattedMakes[] = [
                'id' => $id,
                'name' => $make['name'],
                'country' => $make['country'],
                'models' => $make['models'],
            ];
        }
        
        // Sort by name
        usort($formattedMakes, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        return response()->json([
            'success' => true,
            'data' => $formattedMakes,
        ]);
    }

    /**
     * Search makes across all categories
     */
    public function searchMakes(Request $request): JsonResponse
    {
        $query = strtolower($request->get('q', ''));
        
        if (strlen($query) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'Query must be at least 2 characters',
            ], 400);
        }
        
        $results = [];
        $allMakes = config('vehicles.makes');
        
        foreach ($allMakes as $category => $makes) {
            foreach ($makes as $id => $make) {
                if (stripos($make['name'], $query) !== false) {
                    $results[] = [
                        'id' => $id,
                        'name' => $make['name'],
                        'country' => $make['country'],
                        'category' => $category,
                    ];
                }
            }
        }
        
        // Sort by name
        usort($results, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }
}
