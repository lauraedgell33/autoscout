<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoritesController extends Controller
{
    /**
     * Get all favorites for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $favorites = Favorite::where('user_id', Auth::id())
                ->with(['vehicle' => function ($query) {
                    $query->with(['dealer', 'seller'])
                        ->select([
                            'id', 'dealer_id', 'seller_id', 'category', 'make', 'model', 
                            'year', 'vin', 'price', 'currency', 'description', 'mileage',
                            'fuel_type', 'transmission', 'color', 'doors', 'seats',
                            'body_type', 'engine_size', 'power_hp', 'location_city',
                            'location_country', 'latitude', 'longitude', 'status',
                            'images', 'primary_image', 'created_at', 'updated_at'
                        ]);
                }])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $favorites,
                'count' => $favorites->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch favorites', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve favorites',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a vehicle to favorites
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'vehicle_id' => 'required|integer|exists:vehicles,id',
            ]);

            // Check if vehicle exists and is active
            $vehicle = Vehicle::find($validated['vehicle_id']);
            
            if (!$vehicle) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehicle not found',
                ], 404);
            }

            // Check if already favorited
            $existingFavorite = Favorite::where('user_id', Auth::id())
                ->where('vehicle_id', $validated['vehicle_id'])
                ->first();

            if ($existingFavorite) {
                return response()->json([
                    'success' => true,
                    'message' => 'Vehicle already in favorites',
                    'data' => $existingFavorite,
                ], 200);
            }

            // Create favorite
            $favorite = Favorite::create([
                'user_id' => Auth::id(),
                'vehicle_id' => $validated['vehicle_id'],
            ]);

            // Load vehicle relationship
            $favorite->load('vehicle');

            Log::info('Vehicle added to favorites', [
                'user_id' => Auth::id(),
                'vehicle_id' => $validated['vehicle_id'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle added to favorites',
                'data' => $favorite,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to add favorite', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add vehicle to favorites',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove a vehicle from favorites
     */
    public function destroy(Request $request, int $vehicle_id): JsonResponse
    {
        try {
            $favorite = Favorite::where('user_id', Auth::id())
                ->where('vehicle_id', $vehicle_id)
                ->first();

            if (!$favorite) {
                return response()->json([
                    'success' => false,
                    'message' => 'Favorite not found',
                ], 404);
            }

            $favorite->delete();

            Log::info('Vehicle removed from favorites', [
                'user_id' => Auth::id(),
                'vehicle_id' => $vehicle_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle removed from favorites',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to remove favorite', [
                'user_id' => Auth::id(),
                'vehicle_id' => $vehicle_id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove vehicle from favorites',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if a vehicle is favorited by the authenticated user
     */
    public function check(Request $request, int $vehicle_id): JsonResponse
    {
        try {
            $isFavorited = Favorite::where('user_id', Auth::id())
                ->where('vehicle_id', $vehicle_id)
                ->exists();

            return response()->json([
                'success' => true,
                'is_favorited' => $isFavorited,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to check favorite status', [
                'user_id' => Auth::id(),
                'vehicle_id' => $vehicle_id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check favorite status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
