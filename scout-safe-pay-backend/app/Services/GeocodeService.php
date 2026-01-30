<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * GeocodeService
 * 
 * FREE geocoding service using OpenStreetMap Nominatim API
 * Converts city names to latitude/longitude coordinates
 * 
 * FREE Alternative to:
 * - Google Maps Geocoding API (~$5-10/1000 requests)
 * - Mapbox Geocoding (~$0.50/1000 requests)
 * 
 * Nominatim Usage Policy:
 * - Max 1 request per second
 * - Provide User-Agent header
 * - Cache results heavily
 * - For production, consider self-hosting Nominatim
 */
class GeocodeService
{
    /**
     * Nominatim API endpoint
     */
    private const API_URL = 'https://nominatim.openstreetmap.org/search';

    /**
     * User-Agent header (required by Nominatim ToS)
     */
    private const USER_AGENT = 'ScoutSafePay/1.0 (auto trading platform)';

    /**
     * Cache duration (30 days - coordinates don't change)
     */
    private const CACHE_DURATION = 60 * 60 * 24 * 30; // 30 days

    /**
     * Rate limit: 1 request per second
     */
    private const RATE_LIMIT_KEY = 'geocode_last_request';

    /**
     * Geocode a city name to coordinates
     * 
     * @param string $city City name (e.g., "Berlin", "München")
     * @param string $country Country code (e.g., "DE", "AT", "CH")
     * @return array|null ['latitude' => float, 'longitude' => float] or null if not found
     */
    public function geocode(string $city, string $country = 'DE'): ?array
    {
        // Validate input
        if (empty($city)) {
            return null;
        }

        // Generate cache key
        $cacheKey = $this->getCacheKey($city, $country);

        // Check cache first
        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            Log::info('Geocode cache HIT', ['city' => $city, 'country' => $country]);
            return $cached;
        }

        // Rate limiting: ensure 1 second between requests
        $this->respectRateLimit();

        // Make API request
        try {
            $response = Http::withHeaders([
                'User-Agent' => self::USER_AGENT,
            ])->timeout(5)->get(self::API_URL, [
                'q' => $city,
                'countrycodes' => strtolower($country),
                'format' => 'json',
                'limit' => 1,
                'addressdetails' => 0,
            ]);

            if ($response->failed()) {
                Log::warning('Geocode API failed', [
                    'city' => $city,
                    'country' => $country,
                    'status' => $response->status(),
                ]);
                return null;
            }

            $data = $response->json();

            // No results found
            if (empty($data) || !isset($data[0]['lat']) || !isset($data[0]['lon'])) {
                Log::info('Geocode no results', ['city' => $city, 'country' => $country]);
                // Cache null result to avoid repeated API calls
                Cache::put($cacheKey, null, self::CACHE_DURATION);
                return null;
            }

            // Extract coordinates
            $result = [
                'latitude' => (float) $data[0]['lat'],
                'longitude' => (float) $data[0]['lon'],
            ];

            // Cache result
            Cache::put($cacheKey, $result, self::CACHE_DURATION);

            Log::info('Geocode success', [
                'city' => $city,
                'country' => $country,
                'coordinates' => $result,
            ]);

            return $result;

        } catch (\Exception $e) {
            Log::error('Geocode exception', [
                'city' => $city,
                'country' => $country,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Batch geocode multiple cities (with rate limiting)
     * 
     * @param array $locations Array of ['city' => string, 'country' => string]
     * @return array Results with city as key, coordinates as value
     */
    public function batchGeocode(array $locations): array
    {
        $results = [];

        foreach ($locations as $location) {
            $city = $location['city'] ?? null;
            $country = $location['country'] ?? 'DE';

            if ($city) {
                $coordinates = $this->geocode($city, $country);
                $results[$city] = $coordinates;
            }
        }

        return $results;
    }

    /**
     * Reverse geocode: coordinates → city name
     * (Not needed for current use case, but included for completeness)
     * 
     * @param float $latitude
     * @param float $longitude
     * @return string|null City name or null
     */
    public function reverseGeocode(float $latitude, float $longitude): ?string
    {
        $cacheKey = "reverse_geocode:{$latitude},{$longitude}";

        $cached = Cache::get($cacheKey);
        if ($cached !== null) {
            return $cached;
        }

        $this->respectRateLimit();

        try {
            $response = Http::withHeaders([
                'User-Agent' => self::USER_AGENT,
            ])->timeout(5)->get('https://nominatim.openstreetmap.org/reverse', [
                'lat' => $latitude,
                'lon' => $longitude,
                'format' => 'json',
                'addressdetails' => 1,
            ]);

            if ($response->failed()) {
                return null;
            }

            $data = $response->json();
            $city = $data['address']['city'] 
                ?? $data['address']['town'] 
                ?? $data['address']['village'] 
                ?? null;

            Cache::put($cacheKey, $city, self::CACHE_DURATION);

            return $city;

        } catch (\Exception $e) {
            Log::error('Reverse geocode exception', [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Get cache key for city/country pair
     */
    private function getCacheKey(string $city, string $country): string
    {
        return 'geocode:' . strtolower($city) . ':' . strtolower($country);
    }

    /**
     * Respect rate limit: 1 request per second
     */
    private function respectRateLimit(): void
    {
        $lastRequest = Cache::get(self::RATE_LIMIT_KEY);

        if ($lastRequest !== null) {
            $elapsed = microtime(true) - $lastRequest;
            if ($elapsed < 1.0) {
                // Sleep for remaining time
                usleep((int) ((1.0 - $elapsed) * 1000000));
            }
        }

        // Update last request timestamp
        Cache::put(self::RATE_LIMIT_KEY, microtime(true), 60);
    }

    /**
     * Preload common EU cities into cache
     * Run this once to speed up geocoding for popular locations
     */
    public function preloadCommonCities(): array
    {
        $commonCities = [
            // Germany
            ['city' => 'Berlin', 'country' => 'DE'],
            ['city' => 'München', 'country' => 'DE'],
            ['city' => 'Hamburg', 'country' => 'DE'],
            ['city' => 'Frankfurt', 'country' => 'DE'],
            ['city' => 'Köln', 'country' => 'DE'],
            ['city' => 'Stuttgart', 'country' => 'DE'],
            ['city' => 'Düsseldorf', 'country' => 'DE'],
            ['city' => 'Dortmund', 'country' => 'DE'],
            
            // Austria
            ['city' => 'Wien', 'country' => 'AT'],
            ['city' => 'Graz', 'country' => 'AT'],
            ['city' => 'Salzburg', 'country' => 'AT'],
            
            // Switzerland
            ['city' => 'Zürich', 'country' => 'CH'],
            ['city' => 'Genève', 'country' => 'CH'],
            ['city' => 'Bern', 'country' => 'CH'],
        ];

        Log::info('Preloading common cities...');
        $results = $this->batchGeocode($commonCities);
        Log::info('Preloaded ' . count($results) . ' cities');

        return $results;
    }
}
