<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

// Trigger geocoding for vehicle 1
$vehicle = \App\Models\Vehicle::find(1);
if ($vehicle && !$vehicle->latitude) {
    echo "🔄 Triggering geocoding for vehicle 1...\n";
    $geocoder = new \App\Services\GeocodeService();
    try {
        $result = $geocoder->geocode($vehicle->location_city . ', ' . $vehicle->location_country);
        if ($result) {
            $vehicle->latitude = $result['lat'];
            $vehicle->longitude = $result['lon'];
            $vehicle->save();
            echo "✅ Geocoding done: " . $result['lat'] . ", " . $result['lon'] . "\n";
        }
    } catch (\Exception $e) {
        echo "❌ Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "✅ Already has coordinates or not found\n";
}
