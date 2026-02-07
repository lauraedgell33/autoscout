<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ScrapedVehiclesSeeder extends Seeder
{
    protected string $jsonFile = 'database/seeders/scraped_vehicles.json';
    protected string $scrapedPath = '/home/x/Documents/scrapautoscout-main/test_10_vehicles/listings';

    public function run(): void
    {
        // Get or create a seller user
        $seller = User::firstOrCreate(
            ['email' => 'seller@autoscout24safetrade.com'],
            [
                'name' => 'AutoScout Seller',
                'password' => bcrypt('password123'),
                'user_type' => 'seller',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info("Using seller: {$seller->email}");

        // Try to load from JSON file first (for deployment)
        $jsonPath = base_path($this->jsonFile);
        
        if (File::exists($jsonPath)) {
            $this->command->info("Loading from JSON file: {$this->jsonFile}");
            $listings = json_decode(File::get($jsonPath), true);
            
            if (is_array($listings)) {
                $this->command->info("Found " . count($listings) . " vehicles in JSON");
                
                foreach ($listings as $listing) {
                    $this->importVehicleFromJson($listing, $seller);
                }
                
                $this->command->info("Import completed!");
                return;
            }
        }
        
        // Fallback to directory scanning (for local development)
        if (File::isDirectory($this->scrapedPath)) {
            $directories = File::directories($this->scrapedPath);
            $this->command->info("Found " . count($directories) . " vehicle directories");

            foreach ($directories as $directory) {
                $this->importVehicleFromDirectory($directory, $seller);
            }
            
            $this->command->info("Import completed!");
            return;
        }
        
        $this->command->error("No vehicle data source found!");
    }

    protected function importVehicleFromDirectory(string $directory, User $seller): void
    {
        $detailsFile = $directory . '/details.json';
        
        if (!File::exists($detailsFile)) {
            $this->command->warn("No details.json in: " . basename($directory));
            return;
        }

        $json = json_decode(File::get($detailsFile), true);
        
        if (!$json || !isset($json['props']['pageProps']['listingDetails'])) {
            $this->command->warn("Invalid JSON structure in: " . basename($directory));
            return;
        }

        $listing = $json['props']['pageProps']['listingDetails'];
        $this->importVehicleData($listing, $seller, $directory);
    }

    protected function importVehicleFromJson(array $listing, User $seller): void
    {
        $this->importVehicleData($listing, $seller, null);
    }

    protected function importVehicleData(array $listing, User $seller, ?string $directory): void
    {
        $vehicle = $listing['vehicle'] ?? [];
        $prices = $listing['prices'] ?? [];
        $location = $listing['location'] ?? [];
        $originalId = $listing['id'] ?? 'unknown';

        // Check if already imported
        if (Vehicle::where('autoscout_listing_id', $originalId)->exists()) {
            $this->command->info("Skipping already imported: $originalId");
            return;
        }

        // Extract data
        $make = $vehicle['make'] ?? 'Unknown';
        $model = $vehicle['model'] ?? 'Unknown';
        $year = $this->extractYear($vehicle['firstRegistrationDateRaw'] ?? null);
        $price = $prices['public']['priceRaw'] ?? $prices['dealer']['priceRaw'] ?? 0;
        $mileage = $vehicle['mileageInKmRaw'] ?? 0;
        
        // Map fuel type
        $fuelType = $this->mapFuelType($vehicle['fuelCategory']['raw'] ?? null);
        
        // Map transmission
        $transmission = $this->mapTransmission($vehicle['transmissionType'] ?? null);
        
        // Map body type
        $bodyType = $this->mapBodyType($vehicle['bodyType'] ?? null);
        
        // Get description (clean HTML)
        $description = strip_tags(html_entity_decode($listing['description'] ?? ''));
        $description = str_replace(['<br />', '<br>', '<br/>'], "\n", $listing['description'] ?? '');
        $description = strip_tags(html_entity_decode($description));
        
        // Get images - use original URLs or copy local files
        $images = $this->getImages($listing, $directory);
        
        if (empty($images)) {
            $this->command->warn("No images for: $originalId");
            return;
        }

        // Create vehicle
        $newVehicle = Vehicle::create([
            'autoscout_listing_id' => $originalId,
            'seller_id' => $seller->id,
            'make' => $make,
            'model' => $model,
            'year' => $year,
            'price' => $price,
            'currency' => 'EUR',
            'mileage' => $mileage,
            'fuel_type' => $fuelType,
            'transmission' => $transmission,
            'body_type' => $bodyType,
            'color' => $vehicle['bodyColor'] ?? null,
            'doors' => $vehicle['numberOfDoors'] ?? null,
            'seats' => $vehicle['numberOfSeats'] ?? null,
            'engine_size' => $vehicle['rawDisplacementInCCM'] ?? null,
            'power_hp' => $vehicle['rawPowerInHp'] ?? null,
            'description' => $description,
            'location_city' => $location['city'] ?? null,
            'location_country' => $location['countryCode'] ?? null,
            'images' => $images,
            'primary_image' => $images[0] ?? null,
            'status' => 'active',
        ]);

        $this->command->info("Imported: {$make} {$model} ({$year}) - €{$price} with " . count($images) . " images");
    }

    protected function extractYear(?string $dateRaw): int
    {
        if (!$dateRaw) {
            return (int) date('Y');
        }
        
        // Format: "2006-01-01"
        $parts = explode('-', $dateRaw);
        return (int) ($parts[0] ?? date('Y'));
    }

    protected function mapFuelType(?string $raw): ?string
    {
        $map = [
            'D' => 'diesel',
            'B' => 'petrol',
            'E' => 'electric',
            'H' => 'hybrid',
            'L' => 'lpg',
            'C' => 'cng',
        ];
        
        return $map[$raw] ?? null;
    }

    protected function mapTransmission(?string $raw): ?string
    {
        $map = [
            'Manual' => 'manual',
            'Automatic' => 'automatic',
            'Semi-automatic' => 'semi_automatic',
        ];
        
        return $map[$raw] ?? null;
    }

    protected function mapBodyType(?string $raw): ?string
    {
        $map = [
            'Sedans' => 'sedan',
            'Sedan' => 'sedan',
            'Hatchback' => 'hatchback',
            'Hatchbacks' => 'hatchback',
            'SUV' => 'suv',
            'SUVs' => 'suv',
            'Coupe' => 'coupe',
            'Coupes' => 'coupe',
            'Convertible' => 'convertible',
            'Convertibles' => 'convertible',
            'Wagon' => 'wagon',
            'Wagons' => 'wagon',
            'Estate' => 'wagon',
            'Van' => 'van',
            'Vans' => 'van',
            'Truck' => 'truck',
            'Trucks' => 'truck',
            'Minivan' => 'minivan',
            'Minivans' => 'minivan',
        ];
        
        return $map[$raw] ?? null;
    }

    protected function getImages(array $listing, ?string $directory): array
    {
        // First try to use original AutoScout24 URLs
        $originalUrls = $listing['images'] ?? [];
        
        if (!empty($originalUrls)) {
            // Use original URLs and limit to 10
            $images = array_slice($originalUrls, 0, 10);
            return $images;
        }
        
        // Fallback: copy local files if directory available
        if ($directory) {
            $vehicleId = $listing['id'] ?? basename($directory);
            return $this->copyLocalImages($directory, $vehicleId);
        }
        
        return [];
    }

    protected function copyLocalImages(string $directory, string $vehicleId): array
    {
        $images = [];
        
        // Get only large JPG images (best quality for primary display)
        $jpgFiles = File::glob($directory . '/image_*_large.jpg');
        
        if (empty($jpgFiles)) {
            return [];
        }
        
        // Limit to 10 images
        $jpgFiles = array_slice($jpgFiles, 0, 10);
        
        // Create vehicle directory in storage
        $storagePath = "vehicles/{$vehicleId}";
        Storage::disk('public')->makeDirectory($storagePath);
        
        foreach ($jpgFiles as $index => $jpgFile) {
            $filename = sprintf('image_%02d.jpg', $index + 1);
            $destinationPath = "{$storagePath}/{$filename}";
            
            // Copy file to storage
            $content = File::get($jpgFile);
            Storage::disk('public')->put($destinationPath, $content);
            
            // Add URL to images array
            $images[] = Storage::url($destinationPath);
        }
        
        return $images;
    }
}
