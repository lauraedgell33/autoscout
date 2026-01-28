<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Vehicle;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;

class VehicleStatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalValue = Vehicle::where('status', 'active')->sum('price');
        
        // Format currency manually if intl extension is not available
        $formattedValue = extension_loaded('intl') 
            ? Number::currency($totalValue, 'EUR')
            : '€' . number_format($totalValue, 2, ',', '.');

        return [
            Stat::make('Total Vehicule', Vehicle::count())
                ->description('Toate vehiculele din sistem')
                ->descriptionIcon('heroicon-o-rectangle-stack')
                ->color('primary')
                ->chart([7, 12, 8, 15, 20, 18, Vehicle::count()]),
            
            Stat::make('Vehicule Active', Vehicle::where('status', 'active')->count())
                ->description('Disponibile pentru vânzare')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success')
                ->chart([5, 8, 10, 12, 15, Vehicle::where('status', 'active')->count()]),
            
            Stat::make('Vehicule Vândute', Vehicle::where('status', 'sold')->count())
                ->description('Tranzacții finalizate')
                ->descriptionIcon('heroicon-o-shopping-cart')
                ->color('info'),
            
            Stat::make('Valoare Stoc', $formattedValue)
                ->description('Valoare totală vehicule active')
                ->descriptionIcon('heroicon-o-currency-euro')
                ->color('warning'),
        ];
    }
}
