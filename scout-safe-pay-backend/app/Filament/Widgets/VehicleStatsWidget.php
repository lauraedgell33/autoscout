<?php

namespace App\Filament\Widgets;

use App\Models\Vehicle;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class VehicleStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalVehicles = Vehicle::count();
        $activeVehicles = Vehicle::where('status', 'active')->count();
        $soldVehicles = Vehicle::where('status', 'sold')->count();
        $draftVehicles = Vehicle::where('status', 'draft')->count();

        $averagePrice = Vehicle::where('status', 'active')->avg('price');
        
        $categoryCounts = Vehicle::where('status', 'active')
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->first();

        $topCategory = $categoryCounts ? ucfirst(str_replace('_', ' ', $categoryCounts->category)) : 'N/A';

        return [
            Stat::make('Total Vehicles', $totalVehicles)
                ->description('All vehicles in system')
                ->descriptionIcon('heroicon-m-truck')
                ->color('info')
                ->chart([
                    $totalVehicles - 10,
                    $totalVehicles - 8,
                    $totalVehicles - 5,
                    $totalVehicles - 3,
                    $totalVehicles - 1,
                    $totalVehicles,
                ])
                ->url(route('filament.admin.resources.vehicles.index')),

            Stat::make('Active Listings', $activeVehicles)
                ->description('Available for purchase')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Draft', $draftVehicles)
                ->description('Unpublished vehicles')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('warning')
                ->url(route('filament.admin.resources.vehicles.index')),

            Stat::make('Sold', $soldVehicles)
                ->description('Successfully sold')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Average Price', '€' . number_format($averagePrice, 0))
                ->description('For active listings')
                ->descriptionIcon('heroicon-m-currency-euro')
                ->color('info'),

            Stat::make('Top Category', $topCategory)
                ->description('Most listed category')
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),
        ];
    }
}
