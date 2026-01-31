<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    /**
     * Cache duration constants (in seconds)
     */
    const SHORT_CACHE = 300;      // 5 minutes
    const MEDIUM_CACHE = 3600;    // 1 hour
    const LONG_CACHE = 86400;     // 24 hours
    const EXTRA_LONG_CACHE = 604800; // 7 days

    /**
     * Remember a value in cache with automatic key generation
     */
    public function remember(string $key, int $ttl, callable $callback)
    {
        try {
            return Cache::remember($key, $ttl, $callback);
        } catch (\Exception $e) {
            Log::error("Cache error for key {$key}: " . $e->getMessage());
            return $callback();
        }
    }

    /**
     * Remember forever (until manually cleared)
     */
    public function rememberForever(string $key, callable $callback)
    {
        try {
            return Cache::rememberForever($key, $callback);
        } catch (\Exception $e) {
            Log::error("Cache forever error for key {$key}: " . $e->getMessage());
            return $callback();
        }
    }

    /**
     * Forget a specific cache key
     */
    public function forget(string $key): bool
    {
        try {
            return Cache::forget($key);
        } catch (\Exception $e) {
            Log::error("Cache forget error for key {$key}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Forget keys by pattern (for Redis, no-op for other drivers)
     */
    public function forgetByPattern(string $pattern): void
    {
        try {
            // Only works with Redis driver
            $store = Cache::getStore();
            if (method_exists($store, 'getRedis')) {
                $redis = $store->getRedis();
                $keys = $redis->keys($pattern);
                if (!empty($keys)) {
                    $redis->del($keys);
                }
            }
            // For non-Redis drivers, pattern-based deletion is not supported
            // Consider using cache tags instead for better support across drivers
        } catch (\Exception $e) {
            Log::error("Cache pattern forget error for pattern {$pattern}: " . $e->getMessage());
        }
    }

    /**
     * Generate a cache key for vehicles list
     */
    public function vehiclesListKey(array $filters = []): string
    {
        ksort($filters);
        return 'vehicles:list:' . md5(json_encode($filters));
    }

    /**
     * Generate a cache key for a single vehicle
     */
    public function vehicleKey(int $vehicleId): string
    {
        return "vehicle:{$vehicleId}";
    }

    /**
     * Generate a cache key for user data
     */
    public function userKey(int $userId): string
    {
        return "user:{$userId}";
    }

    /**
     * Generate a cache key for transactions
     */
    public function transactionKey(int $transactionId): string
    {
        return "transaction:{$transactionId}";
    }

    /**
     * Clear all vehicle-related caches
     */
    public function clearVehicleCaches(): void
    {
        $this->forgetByPattern('vehicles:*');
    }

    /**
     * Clear all user-related caches
     */
    public function clearUserCaches(int $userId): void
    {
        $this->forget($this->userKey($userId));
        $this->forgetByPattern("user:{$userId}:*");
    }

    /**
     * Clear all transaction-related caches
     */
    public function clearTransactionCaches(int $transactionId): void
    {
        $this->forget($this->transactionKey($transactionId));
        $this->forgetByPattern("transaction:{$transactionId}:*");
    }
}
