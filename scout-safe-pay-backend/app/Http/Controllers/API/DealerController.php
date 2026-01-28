<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Dealer;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DealerController extends Controller
{
    /**
     * Get all verified dealers
     */
    public function index(Request $request)
    {
        $query = Dealer::where('is_verified', true)
            ->where('status', 'active');

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Filter by city
        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $dealers = $query->with(['users:id,name,email', 'vehicles' => function ($q) {
            $q->where('status', 'active')->select('id', 'dealer_id', 'make', 'model', 'year', 'price');
        }])
        ->withCount(['vehicles' => function ($q) {
            $q->where('status', 'active');
        }])
        ->paginate(15);

        // Add review stats for each dealer
        $dealers->getCollection()->transform(function ($dealer) {
            $dealerUsers = $dealer->users->pluck('id');
            $dealer->review_stats = [
                'average_rating' => Review::approved()
                    ->whereIn('reviewee_id', $dealerUsers)
                    ->avg('rating') ?? 0.0,
                'total_reviews' => Review::approved()
                    ->whereIn('reviewee_id', $dealerUsers)
                    ->count(),
            ];
            return $dealer;
        });

        return response()->json([
            'dealers' => $dealers,
        ]);
    }

    /**
     * Get a specific dealer
     */
    public function show($id)
    {
        $dealer = Dealer::where('is_verified', true)
            ->where('status', 'active')
            ->with(['users:id,name,email', 'vehicles' => function ($q) {
                $q->where('status', 'active')
                  ->select('id', 'dealer_id', 'make', 'model', 'year', 'price', 'images', 'created_at')
                  ->latest()
                  ->limit(10);
            }])
            ->findOrFail($id);

        // Get review stats for dealer users
        $dealerUsers = $dealer->users->pluck('id');
        $reviews = Review::approved()
            ->whereIn('reviewee_id', $dealerUsers)
            ->with(['reviewer:id,name', 'transaction.vehicle:id,make,model,year'])
            ->latest()
            ->paginate(10);

        $reviewStats = [
            'average_rating' => Review::approved()
                ->whereIn('reviewee_id', $dealerUsers)
                ->avg('rating') ?? 0.0,
            'total_reviews' => Review::approved()
                ->whereIn('reviewee_id', $dealerUsers)
                ->count(),
            'rating_breakdown' => Review::approved()
                ->whereIn('reviewee_id', $dealerUsers)
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray(),
        ];

        return response()->json([
            'dealer' => $dealer,
            'reviews' => $reviews,
            'review_stats' => $reviewStats,
        ]);
    }

    /**
     * Create a new dealer (admin only)
     */
    public function store(Request $request)
    {
        $this->authorize('create', Dealer::class);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'vat_number' => 'nullable|string|max:50',
            'registration_number' => 'nullable|string|max:50',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:dealers,email',
            'website' => 'nullable|url',
            'type' => 'required|in:individual,company',
            'max_active_listings' => 'nullable|integer|min:1',
            'bank_account_holder' => 'nullable|string|max:255',
            'bank_iban' => 'nullable|string|max:34',
            'bank_swift' => 'nullable|string|max:11',
            'bank_name' => 'nullable|string|max:255',
            'business_license_url' => 'nullable|url',
            'tax_certificate_url' => 'nullable|url',
            'logo_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $dealer = Dealer::create(array_merge($request->all(), [
            'status' => 'pending',
            'is_verified' => false,
        ]));

        return response()->json([
            'message' => 'Dealer created successfully',
            'dealer' => $dealer,
        ], 201);
    }

    /**
     * Update a dealer (admin only)
     */
    public function update(Request $request, $id)
    {
        $dealer = Dealer::findOrFail($id);
        $this->authorize('update', $dealer);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'company_name' => 'sometimes|required|string|max:255',
            'vat_number' => 'nullable|string|max:50',
            'registration_number' => 'nullable|string|max:50',
            'address' => 'sometimes|required|string|max:500',
            'city' => 'sometimes|required|string|max:100',
            'postal_code' => 'sometimes|required|string|max:20',
            'country' => 'sometimes|required|string|max:100',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|unique:dealers,email,' . $id,
            'website' => 'nullable|url',
            'type' => 'sometimes|required|in:individual,company',
            'status' => 'sometimes|in:active,inactive,suspended',
            'max_active_listings' => 'nullable|integer|min:1',
            'bank_account_holder' => 'nullable|string|max:255',
            'bank_iban' => 'nullable|string|max:34',
            'bank_swift' => 'nullable|string|max:11',
            'bank_name' => 'nullable|string|max:255',
            'business_license_url' => 'nullable|url',
            'tax_certificate_url' => 'nullable|url',
            'logo_url' => 'nullable|url',
            'is_verified' => 'sometimes|boolean',
            'verified_at' => 'nullable|date',
            'verified_by' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $dealer->update($request->all());

        return response()->json([
            'message' => 'Dealer updated successfully',
            'dealer' => $dealer,
        ]);
    }

    /**
     * Delete a dealer (admin only)
     */
    public function destroy($id)
    {
        $dealer = Dealer::findOrFail($id);
        $this->authorize('delete', $dealer);

        $dealer->delete();

        return response()->json([
            'message' => 'Dealer deleted successfully',
        ]);
    }

    /**
     * Get dealer statistics
     */
    public function statistics()
    {
        $stats = [
            'total_dealers' => Dealer::where('is_verified', true)->count(),
            'active_dealers' => Dealer::where('is_verified', true)->where('status', 'active')->count(),
            'dealers_by_city' => Dealer::where('is_verified', true)
                ->selectRaw('city, COUNT(*) as count')
                ->groupBy('city')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
            'dealers_by_type' => Dealer::where('is_verified', true)
                ->selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->get(),
        ];

        return response()->json($stats);
    }
}
