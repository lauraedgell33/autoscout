<?php

namespace App\Observers;

use App\Models\Vehicle;
use App\Services\GeocodeService;
use Illuminate\Support\Facades\Log;

class VehicleObserver
{
    /**
     * Handle the Vehicle "creating" event.
     * Geocode location BEFORE saving (so coordinates are included in INSERT)
     */
    public function creating(Vehicle $vehicle): void
    {
        $this->geocodeLocation($vehicle);
    }

    /**
     * Handle the Vehicle "updating" event.
     * Geocode location if city/country changed
     */
    public function updating(Vehicle $vehicle): void
    {
        // Only geocode if location changed
        if ($vehicle->isDirty(['location_city', 'location_country'])) {
            $this->geocodeLocation($vehicle);
        }
    }

    /**
     * Geocode vehicle location (city → latitude/longitude)
     */
    private function geocodeLocation(Vehicle $vehicle): void
    {
        // Skip if already has coordinates
        if ($vehicle->latitude && $vehicle->longitude) {
            return;
        }

        // Skip if no city
        if (!$vehicle->location_city) {
            return;
        }

        try {
            $geocodeService = app(GeocodeService::class);
            $coordinates = $geocodeService->geocode(
                $vehicle->location_city,
                $vehicle->location_country ?? 'DE'
            );

            if ($coordinates) {
                $vehicle->latitude = $coordinates['latitude'];
                $vehicle->longitude = $coordinates['longitude'];

                Log::info('Vehicle geocoded', [
                    'vehicle_id' => $vehicle->id ?? 'new',
                    'city' => $vehicle->location_city,
                    'country' => $vehicle->location_country,
                    'coordinates' => $coordinates,
                ]);
            } else {
                Log::warning('Vehicle geocoding failed', [
                    'vehicle_id' => $vehicle->id ?? 'new',
                    'city' => $vehicle->location_city,
                    'country' => $vehicle->location_country,
                ]);
            }
        } catch (\Exception $e) {
            // Don't fail vehicle creation if geocoding fails
            Log::error('Vehicle geocoding exception', [
                'vehicle_id' => $vehicle->id ?? 'new',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
