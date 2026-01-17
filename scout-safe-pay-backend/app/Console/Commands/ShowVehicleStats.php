<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use Illuminate\Console\Command;

class ShowVehicleStats extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'vehicles:stats
                            {--detailed : Show detailed vehicle list}';

    /**
     * The console command description.
     */
    protected $description = 'Display vehicle statistics';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚗 VEHICLE STATISTICS');
        $this->line(str_repeat('=', 80));

        // Total count
        $total = Vehicle::count();
        $this->info("📊 Total Vehicles: {$total}");
        $this->newLine();

        // By Status
        $this->info('Status Distribution:');
        Vehicle::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->each(function ($stat) {
                $icon = match($stat->status) {
                    'active' => '✅',
                    'sold' => '💰',
                    'reserved' => '🔒',
                    'draft' => '📝',
                    default => '❓'
                };
                $this->line("  {$icon} {$stat->status}: {$stat->count}");
            });
        $this->newLine();

        // By Make
        $this->info('Top Brands:');
        Vehicle::selectRaw('make, COUNT(*) as count')
            ->groupBy('make')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->each(function ($stat) {
                $this->line("  🏷️  {$stat->make}: {$stat->count}");
            });
        $this->newLine();

        // By Fuel Type
        $this->info('Fuel Types:');
        Vehicle::selectRaw('fuel_type, COUNT(*) as count')
            ->groupBy('fuel_type')
            ->orderByDesc('count')
            ->get()
            ->each(function ($stat) {
                $icon = match($stat->fuel_type) {
                    'electric' => '⚡',
                    'hybrid' => '🔋',
                    'diesel' => '⛽',
                    'petrol' => '⛽',
                    default => '🚗'
                };
                $this->line("  {$icon} {$stat->fuel_type}: {$stat->count}");
            });
        $this->newLine();

        // Price Range
        $avgPrice = Vehicle::avg('price');
        $minPrice = Vehicle::min('price');
        $maxPrice = Vehicle::max('price');
        
        $this->info('Price Range:');
        $this->line("  💶 Average: €" . number_format($avgPrice, 2));
        $this->line("  📉 Minimum: €" . number_format($minPrice, 2));
        $this->line("  📈 Maximum: €" . number_format($maxPrice, 2));
        $this->newLine();

        // Detailed list if requested
        if ($this->option('detailed')) {
            $this->info('📋 Detailed Vehicle List:');
            $this->line(str_repeat('-', 80));
            
            Vehicle::orderBy('make')->orderBy('model')->get()->each(function ($vehicle) {
                $statusIcon = match($vehicle->status) {
                    'active' => '✅',
                    'sold' => '💰',
                    'reserved' => '🔒',
                    'draft' => '📝',
                    default => '❓'
                };
                
                $this->line(sprintf(
                    "  %s [%2d] %-18s %-23s %d - €%s (%s)",
                    $statusIcon,
                    $vehicle->id,
                    $vehicle->make,
                    $vehicle->model,
                    $vehicle->year,
                    number_format($vehicle->price, 0, ',', '.'),
                    $vehicle->location_city
                ));
            });
            $this->newLine();
        }

        $this->line(str_repeat('=', 80));
        
        return Command::SUCCESS;
    }
}
