<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\SearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    /**
     * Search vehicles
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function searchVehicles(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'q' => 'nullable|string|max:255',
                'status' => 'nullable|string',
                'make' => 'nullable|string',
                'category' => 'nullable|string',
                'year_from' => 'nullable|integer|min:1900',
                'year_to' => 'nullable|integer|max:2100',
                'price_from' => 'nullable|numeric|min:0',
                'price_to' => 'nullable|numeric|min:0',
                'fuel_type' => 'nullable|string',
                'transmission' => 'nullable|string',
                'location_city' => 'nullable|string|max:100',
                'location_country' => 'nullable|string|max:100',
                'seller_id' => 'nullable|integer|exists:users,id',
                'sort' => 'nullable|string|in:created_at,price,year,mileage',
                'direction' => 'nullable|string|in:asc,desc',
                'per_page' => 'nullable|integer|min:1|max:100',
                'page' => 'nullable|integer|min:1',
            ]);

            $query = $validated['q'] ?? '';
            $sort = $validated['sort'] ?? 'created_at';
            $direction = $validated['direction'] ?? 'desc';
            $perPage = $validated['per_page'] ?? 15;
            $page = $validated['page'] ?? 1;

            // Remove pagination fields from filters
            $filters = collect($validated)
                ->except(['q', 'sort', 'direction', 'per_page', 'page'])
                ->filter(fn($value) => !is_null($value))
                ->toArray();

            $results = SearchService::searchVehicles($query, $filters, $sort, $direction, $perPage, $page);

            return response()->json([
                'success' => true,
                'data' => $results->items(),
                'pagination' => [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                    'from' => $results->firstItem(),
                    'to' => $results->lastItem(),
                ],
                'filters' => SearchService::getVehicleFilterOptions(),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Vehicle search error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search transactions
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function searchTransactions(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'q' => 'nullable|string|max:255',
                'status' => 'nullable|string',
                'amount_from' => 'nullable|numeric|min:0',
                'amount_to' => 'nullable|numeric|min:0',
                'currency' => 'nullable|string',
                'buyer_id' => 'nullable|integer|exists:users,id',
                'seller_id' => 'nullable|integer|exists:users,id',
                'vehicle_id' => 'nullable|integer|exists:vehicles,id',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date',
                'sort' => 'nullable|string|in:created_at,amount,status',
                'direction' => 'nullable|string|in:asc,desc',
                'per_page' => 'nullable|integer|min:1|max:100',
                'page' => 'nullable|integer|min:1',
            ]);

            $query = $validated['q'] ?? '';
            $sort = $validated['sort'] ?? 'created_at';
            $direction = $validated['direction'] ?? 'desc';
            $perPage = $validated['per_page'] ?? 15;
            $page = $validated['page'] ?? 1;

            // Remove pagination fields from filters
            $filters = collect($validated)
                ->except(['q', 'sort', 'direction', 'per_page', 'page'])
                ->filter(fn($value) => !is_null($value))
                ->toArray();

            $results = SearchService::searchTransactions($query, $filters, $sort, $direction, $perPage, $page);

            return response()->json([
                'success' => true,
                'data' => $results->items(),
                'pagination' => [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                    'from' => $results->firstItem(),
                    'to' => $results->lastItem(),
                ],
                'filters' => SearchService::getTransactionFilterOptions(),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Transaction search error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search messages
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function searchMessages(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'q' => 'nullable|string|max:255',
                'transaction_id' => 'nullable|integer|exists:transactions,id',
                'sender_id' => 'nullable|integer|exists:users,id',
                'receiver_id' => 'nullable|integer|exists:users,id',
                'is_read' => 'nullable|boolean',
                'is_system_message' => 'nullable|boolean',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date',
                'sort' => 'nullable|string|in:created_at,sender_id,receiver_id',
                'direction' => 'nullable|string|in:asc,desc',
                'per_page' => 'nullable|integer|min:1|max:100',
                'page' => 'nullable|integer|min:1',
            ]);

            $query = $validated['q'] ?? '';
            $sort = $validated['sort'] ?? 'created_at';
            $direction = $validated['direction'] ?? 'desc';
            $perPage = $validated['per_page'] ?? 15;
            $page = $validated['page'] ?? 1;

            // Remove pagination fields from filters
            $filters = collect($validated)
                ->except(['q', 'sort', 'direction', 'per_page', 'page'])
                ->filter(fn($value) => !is_null($value))
                ->toArray();

            $results = SearchService::searchMessages($query, $filters, $sort, $direction, $perPage, $page);

            return response()->json([
                'success' => true,
                'data' => $results->items(),
                'pagination' => [
                    'total' => $results->total(),
                    'per_page' => $results->perPage(),
                    'current_page' => $results->currentPage(),
                    'last_page' => $results->lastPage(),
                    'from' => $results->firstItem(),
                    'to' => $results->lastItem(),
                ],
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Message search error: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get global search filters
     *
     * @return JsonResponse
     */
    public function getFilters(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'vehicles' => SearchService::getVehicleFilterOptions(),
                    'transactions' => SearchService::getTransactionFilterOptions(),
                ],
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Get filters error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve filters',
            ], 500);
        }
    }
}
