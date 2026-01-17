<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class VehicleController extends Controller
{
    protected $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Display a listing of vehicles with filters and search
     */
    public function index(Request $request)
    {
        // Generate cache key based on filters
        $filters = $request->except(['page']);
        $cacheKey = $this->cacheService->vehiclesListKey($filters);

        // Cache the query results
        $vehicles = Cache::remember($cacheKey, CacheService::SHORT_CACHE, function () use ($request) {
            // Use Scout search if search query is provided
            if ($request->has('search') && !empty($request->search)) {
                $query = Vehicle::search($request->search)
                    ->query(function ($builder) use ($request) {
                        $builder->with(['dealer:id,company_name', 'seller:id,name,email']);
                        
                        // Apply filters to Scout query
                        if ($request->has('status')) {
                            $builder->where('status', $request->status);
                        } else {
                            // Default: only show active vehicles for public
                            if (!auth()->check() || auth()->user()->user_type !== 'admin') {
                                $builder->where('status', 'active');
                            }
                        }

                        if ($request->has('category')) {
                            $builder->where('category', $request->category);
                        }
                        if ($request->has('fuel_type')) {
                            $builder->where('fuel_type', $request->fuel_type);
                        }
                        if ($request->has('transmission')) {
                            $builder->where('transmission', $request->transmission);
                        }
                        if ($request->has('body_type')) {
                            $builder->where('body_type', $request->body_type);
                        }
                        if ($request->has('year_from')) {
                            $builder->where('year', '>=', $request->year_from);
                        }
                        if ($request->has('year_to')) {
                            $builder->where('year', '<=', $request->year_to);
                        }
                        if ($request->has('price_min')) {
                            $builder->where('price', '>=', $request->price_min);
                        }
                        if ($request->has('price_max')) {
                            $builder->where('price', '<=', $request->price_max);
                        }
                        if ($request->has('mileage_max')) {
                            $builder->where('mileage', '<=', $request->mileage_max);
                        }
                        if ($request->has('location_city')) {
                            $builder->where('location_city', 'like', '%' . $request->location_city . '%');
                        }
                        if ($request->has('location_country')) {
                            $builder->where('location_country', $request->location_country);
                        }
                        if ($request->has('dealer_id')) {
                            $builder->where('dealer_id', $request->dealer_id);
                        }
                        if ($request->has('seller_id')) {
                            $builder->where('seller_id', $request->seller_id);
                        }

                        return $builder;
                    });

                // Pagination
                $perPage = $request->get('per_page', 15);
                return $query->paginate($perPage);
            }

            // Standard database query if no search
            $query = Vehicle::with(['dealer:id,company_name', 'seller:id,name,email']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                // Default: only show active vehicles for public
                if (!auth()->check() || auth()->user()->user_type !== 'admin') {
                    $query->where('status', 'active');
                }
            }

            // Filter by category
            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

        // Filter by make
        if ($request->has('make')) {
            $query->where('make', 'like', '%' . $request->make . '%');
        }

        // Filter by model
        if ($request->has('model')) {
            $query->where('model', 'like', '%' . $request->model . '%');
        }

        // Filter by year range
        if ($request->has('year_from')) {
            $query->where('year', '>=', $request->year_from);
        }
        if ($request->has('year_to')) {
            $query->where('year', '<=', $request->year_to);
        }

        // Filter by price range
        if ($request->has('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->has('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // Filter by mileage
        if ($request->has('mileage_max')) {
            $query->where('mileage', '<=', $request->mileage_max);
        }

        // Filter by fuel type
        if ($request->has('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }

        // Filter by transmission
        if ($request->has('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        // Filter by body type
        if ($request->has('body_type')) {
            $query->where('body_type', $request->body_type);
        }

        // Filter by location
        if ($request->has('location_city')) {
            $query->where('location_city', 'like', '%' . $request->location_city . '%');
        }
        if ($request->has('location_country')) {
            $query->where('location_country', $request->location_country);
        }

        // Filter by dealer
        if ($request->has('dealer_id')) {
            $query->where('dealer_id', $request->dealer_id);
        }

        // Filter by seller
        if ($request->has('seller_id')) {
            $query->where('seller_id', $request->seller_id);
        }

        // Search query (searches in make, model, description)
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('make', 'like', '%' . $search . '%')
                  ->orWhere('model', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['price', 'year', 'mileage', 'created_at', 'make', 'model'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        return $query->paginate($perPage);
        });

        return response()->json($vehicles);
    }

    /**
     * Store a newly created vehicle
     */
    public function store(StoreVehicleRequest $request)
    {
        $validated = $request->validated();
        
        // Set seller_id to authenticated user
        $validated['seller_id'] = auth()->id();
        
        // If user is a dealer, set dealer_id
        if (auth()->user()->dealer_id) {
            $validated['dealer_id'] = auth()->user()->dealer_id;
        }

        $vehicle = Vehicle::create($validated);

        // Clear vehicle list caches
        $this->cacheService->clearVehicleCaches();

        return response()->json([
            'message' => 'Vehicle created successfully',
            'vehicle' => $vehicle->load(['dealer', 'seller'])
        ], 201);
    }

    /**
     * Display the specified vehicle
     */
    public function show($id)
    {
        $cacheKey = $this->cacheService->vehicleKey($id);
        
        $vehicle = Cache::remember($cacheKey, CacheService::MEDIUM_CACHE, function () use ($id) {
            return Vehicle::with(['dealer:id,company_name', 'seller:id,name,email'])
                ->findOrFail($id);
        });

        // Check if user can view this vehicle
        if ($vehicle->status !== 'active') {
            if (!auth()->check()) {
                return response()->json(['message' => 'Vehicle not found'], 404);
            }
            
            $user = auth()->user();
            if ($user->user_type !== 'admin' && 
                $user->id !== $vehicle->seller_id && 
                $user->dealer_id !== $vehicle->dealer_id) {
                return response()->json(['message' => 'Vehicle not found'], 404);
            }
        }

        return response()->json(['vehicle' => $vehicle]);
    }

    /**
     * Update the specified vehicle
     */
    public function update(UpdateVehicleRequest $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        // Authorization check
        $user = auth()->user();
        if ($user->user_type !== 'admin' && 
            $user->id !== $vehicle->seller_id && 
            $user->dealer_id !== $vehicle->dealer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validated();
        $vehicle->update($validated);

        // Clear caches
        $this->cacheService->forget($this->cacheService->vehicleKey($id));
        $this->cacheService->clearVehicleCaches();

        return response()->json([
            'message' => 'Vehicle updated successfully',
            'vehicle' => $vehicle->load(['dealer', 'seller'])
        ]);
    }

    /**
     * Remove the specified vehicle (soft delete)
     */
    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);

        // Authorization check
        $user = auth()->user();
        if ($user->user_type !== 'admin' && 
            $user->id !== $vehicle->seller_id && 
            $user->dealer_id !== $vehicle->dealer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vehicle->delete();

        // Clear caches
        $this->cacheService->forget($this->cacheService->vehicleKey($id));
        $this->cacheService->clearVehicleCaches();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }

    /**
     * Upload vehicle images
     */
    public function uploadImages(Request $request, $id)
    {
        $vehicle = Vehicle::findOrFail($id);

        // Authorization check
        $user = auth()->user();
        if ($user->user_type !== 'admin' && 
            $user->id !== $vehicle->seller_id && 
            $user->dealer_id !== $vehicle->dealer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'primary' => 'nullable|integer|min:0'
        ]);

        $uploadedImages = [];
        
        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('vehicles/' . $vehicle->id, 'public');
            $uploadedImages[] = Storage::url($path);
        }

        // Merge with existing images
        $existingImages = $vehicle->images ?? [];
        $allImages = array_merge($existingImages, $uploadedImages);
        
        $vehicle->images = $allImages;

        // Set primary image if specified
        if ($request->has('primary')) {
            $primaryIndex = $request->primary;
            if (isset($allImages[$primaryIndex])) {
                $vehicle->primary_image = $allImages[$primaryIndex];
            }
        } elseif (empty($vehicle->primary_image) && !empty($allImages)) {
            // Set first image as primary if none set
            $vehicle->primary_image = $allImages[0];
        }

        $vehicle->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'images' => $vehicle->images,
            'primary_image' => $vehicle->primary_image
        ]);
    }

    /**
     * Get my vehicles (for authenticated seller)
     */
    public function myVehicles(Request $request)
    {
        $user = auth()->user();
        
        $query = Vehicle::where('seller_id', $user->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 15);
        $vehicles = $query->with(['dealer'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($vehicles);
    }

    /**
     * Get featured vehicles
     */
    public function featured()
    {
        $vehicles = Vehicle::where('status', 'active')
            ->with(['dealer', 'seller'])
            ->latest()
            ->limit(12)
            ->get();

        return response()->json(['vehicles' => $vehicles]);
    }

    /**
     * Get vehicle statistics
     */
    public function statistics()
    {
        $stats = [
            'total' => Vehicle::count(),
            'active' => Vehicle::where('status', 'active')->count(),
            'sold' => Vehicle::where('status', 'sold')->count(),
            'draft' => Vehicle::where('status', 'draft')->count(),
            'average_price' => Vehicle::where('status', 'active')->avg('price'),
            'by_fuel_type' => Vehicle::where('status', 'active')
                ->selectRaw('fuel_type, COUNT(*) as count')
                ->groupBy('fuel_type')
                ->get(),
            'by_transmission' => Vehicle::where('status', 'active')
                ->selectRaw('transmission, COUNT(*) as count')
                ->groupBy('transmission')
                ->get(),
        ];

        return response()->json($stats);
    }
}
