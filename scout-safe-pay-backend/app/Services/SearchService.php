<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\Message;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Laravel\Scout\Builder;

class SearchService
{
    /**
     * Search vehicles with filters and sorting
     *
     * @param string $query
     * @param array $filters
     * @param string $sort
     * @param string $direction
     * @param int $perPage
     * @param int $page
     * @return Paginator
     */
    public static function searchVehicles(
        string $query = '',
        array $filters = [],
        string $sort = 'created_at',
        string $direction = 'desc',
        int $perPage = 15,
        int $page = 1
    ): Paginator {
        $builder = Vehicle::query();

        // Apply full-text search if query provided
        if (!empty($query)) {
            $builder = Vehicle::search($query);
        }

        // Apply filters
        $builder = self::applyVehicleFilters($builder, $filters);

        // Apply sorting
        $builder = self::applySorting($builder, $sort, $direction);

        // Get paginated results
        $items = $builder->paginate($perPage, 'page', $page);

        return $items;
    }

    /**
     * Search transactions with filters and sorting
     *
     * @param string $query
     * @param array $filters
     * @param string $sort
     * @param string $direction
     * @param int $perPage
     * @param int $page
     * @return Paginator
     */
    public static function searchTransactions(
        string $query = '',
        array $filters = [],
        string $sort = 'created_at',
        string $direction = 'desc',
        int $perPage = 15,
        int $page = 1
    ): Paginator {
        $builder = Transaction::query();

        // Apply full-text search if query provided
        if (!empty($query)) {
            $builder = Transaction::search($query);
        }

        // Apply filters
        $builder = self::applyTransactionFilters($builder, $filters);

        // Apply sorting
        $builder = self::applySorting($builder, $sort, $direction);

        // Get paginated results
        $items = $builder->paginate($perPage, 'page', $page);

        return $items;
    }

    /**
     * Search messages with filters and sorting
     *
     * @param string $query
     * @param array $filters
     * @param string $sort
     * @param string $direction
     * @param int $perPage
     * @param int $page
     * @return Paginator
     */
    public static function searchMessages(
        string $query = '',
        array $filters = [],
        string $sort = 'created_at',
        string $direction = 'desc',
        int $perPage = 15,
        int $page = 1
    ): Paginator {
        $builder = Message::query();

        // Apply full-text search if query provided
        if (!empty($query)) {
            $builder = Message::search($query);
        }

        // Apply filters
        $builder = self::applyMessageFilters($builder, $filters);

        // Apply sorting
        $builder = self::applySorting($builder, $sort, $direction);

        // Get paginated results
        $items = $builder->paginate($perPage, 'page', $page);

        return $items;
    }

    /**
     * Apply vehicle-specific filters
     *
     * @param Vehicle|Builder $builder
     * @param array $filters
     * @return Vehicle|Builder
     */
    private static function applyVehicleFilters($builder, array $filters)
    {
        // Filter by status
        if (!empty($filters['status'])) {
            $builder = $builder->where('status', $filters['status']);
        }

        // Filter by make
        if (!empty($filters['make'])) {
            $builder = $builder->where('make', $filters['make']);
        }

        // Filter by category
        if (!empty($filters['category'])) {
            $builder = $builder->where('category', $filters['category']);
        }

        // Filter by year range
        if (!empty($filters['year_from'])) {
            $builder = $builder->where('year', '>=', $filters['year_from']);
        }

        if (!empty($filters['year_to'])) {
            $builder = $builder->where('year', '<=', $filters['year_to']);
        }

        // Filter by price range
        if (!empty($filters['price_from'])) {
            $builder = $builder->where('price', '>=', $filters['price_from']);
        }

        if (!empty($filters['price_to'])) {
            $builder = $builder->where('price', '<=', $filters['price_to']);
        }

        // Filter by fuel type
        if (!empty($filters['fuel_type'])) {
            $builder = $builder->where('fuel_type', $filters['fuel_type']);
        }

        // Filter by transmission
        if (!empty($filters['transmission'])) {
            $builder = $builder->where('transmission', $filters['transmission']);
        }

        // Filter by location
        if (!empty($filters['location_city'])) {
            $builder = $builder->where('location_city', 'like', '%' . $filters['location_city'] . '%');
        }

        if (!empty($filters['location_country'])) {
            $builder = $builder->where('location_country', $filters['location_country']);
        }

        // Filter by seller
        if (!empty($filters['seller_id'])) {
            $builder = $builder->where('seller_id', $filters['seller_id']);
        }

        return $builder;
    }

    /**
     * Apply transaction-specific filters
     *
     * @param Transaction|Builder $builder
     * @param array $filters
     * @return Transaction|Builder
     */
    private static function applyTransactionFilters($builder, array $filters)
    {
        // Filter by status
        if (!empty($filters['status'])) {
            $builder = $builder->where('status', $filters['status']);
        }

        // Filter by amount range
        if (!empty($filters['amount_from'])) {
            $builder = $builder->where('amount', '>=', $filters['amount_from']);
        }

        if (!empty($filters['amount_to'])) {
            $builder = $builder->where('amount', '<=', $filters['amount_to']);
        }

        // Filter by currency
        if (!empty($filters['currency'])) {
            $builder = $builder->where('currency', $filters['currency']);
        }

        // Filter by buyer
        if (!empty($filters['buyer_id'])) {
            $builder = $builder->where('buyer_id', $filters['buyer_id']);
        }

        // Filter by seller
        if (!empty($filters['seller_id'])) {
            $builder = $builder->where('seller_id', $filters['seller_id']);
        }

        // Filter by vehicle
        if (!empty($filters['vehicle_id'])) {
            $builder = $builder->where('vehicle_id', $filters['vehicle_id']);
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $builder = $builder->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $builder = $builder->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $builder;
    }

    /**
     * Apply message-specific filters
     *
     * @param Message|Builder $builder
     * @param array $filters
     * @return Message|Builder
     */
    private static function applyMessageFilters($builder, array $filters)
    {
        // Filter by transaction
        if (!empty($filters['transaction_id'])) {
            $builder = $builder->where('transaction_id', $filters['transaction_id']);
        }

        // Filter by sender
        if (!empty($filters['sender_id'])) {
            $builder = $builder->where('sender_id', $filters['sender_id']);
        }

        // Filter by receiver
        if (!empty($filters['receiver_id'])) {
            $builder = $builder->where('receiver_id', $filters['receiver_id']);
        }

        // Filter by read status
        if (isset($filters['is_read'])) {
            $builder = $builder->where('is_read', (bool) $filters['is_read']);
        }

        // Filter by system messages
        if (isset($filters['is_system_message'])) {
            $builder = $builder->where('is_system_message', (bool) $filters['is_system_message']);
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $builder = $builder->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $builder = $builder->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $builder;
    }

    /**
     * Apply sorting to query builder
     *
     * @param mixed $builder
     * @param string $sort
     * @param string $direction
     * @return mixed
     */
    private static function applySorting($builder, string $sort = 'created_at', string $direction = 'desc')
    {
        // Validate direction
        if (!in_array(strtolower($direction), ['asc', 'desc'])) {
            $direction = 'desc';
        }

        // Apply sorting if builder supports it (not Scout Builder)
        if (!($builder instanceof Builder)) {
            $builder = $builder->orderBy($sort, $direction);
        }

        return $builder;
    }

    /**
     * Get available filter options for vehicles
     *
     * @return array
     */
    public static function getVehicleFilterOptions(): array
    {
        return [
            'statuses' => Vehicle::distinct('status')->pluck('status')->toArray(),
            'makes' => Vehicle::distinct('make')->pluck('make')->toArray(),
            'categories' => Vehicle::distinct('category')->pluck('category')->toArray(),
            'fuelTypes' => Vehicle::distinct('fuel_type')->pluck('fuel_type')->toArray(),
            'transmissions' => Vehicle::distinct('transmission')->pluck('transmission')->toArray(),
            'countries' => Vehicle::distinct('location_country')->pluck('location_country')->toArray(),
            'years' => [
                'min' => Vehicle::min('year'),
                'max' => Vehicle::max('year'),
            ],
            'prices' => [
                'min' => Vehicle::min('price'),
                'max' => Vehicle::max('price'),
            ],
        ];
    }

    /**
     * Get available filter options for transactions
     *
     * @return array
     */
    public static function getTransactionFilterOptions(): array
    {
        return [
            'statuses' => Transaction::distinct('status')->pluck('status')->toArray(),
            'currencies' => Transaction::distinct('currency')->pluck('currency')->toArray(),
            'amounts' => [
                'min' => Transaction::min('amount'),
                'max' => Transaction::max('amount'),
            ],
        ];
    }
}
