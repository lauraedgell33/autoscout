<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Dealer;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->description('Registered users')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success')
                ->chart([7, 12, 18, 15, 22, 28, User::count()]),
            
            Stat::make('Active Dealers', Dealer::where('status', 'active')->count())
                ->description('Verified dealers')
                ->descriptionIcon('heroicon-m-building-storefront')
                ->color('primary')
                ->chart([3, 5, 7, 9, 11, 14, Dealer::where('status', 'active')->count()]),
            
            Stat::make('Total Transactions', Transaction::count())
                ->description('All time')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('warning')
                ->chart([10, 15, 20, 25, 30, 35, Transaction::count()]),
            
            Stat::make('Completed Transactions', Transaction::where('status', 'completed')->count())
                ->description('Successfully completed')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
            
            Stat::make('Total Revenue', '€' . number_format(Transaction::where('status', 'completed')->sum('amount'), 2))
                ->description('From completed transactions')
                ->descriptionIcon('heroicon-m-currency-euro')
                ->color('success'),
            
            Stat::make('Pending Payments', Payment::where('status', 'pending')->count())
                ->description('Awaiting verification')
                ->descriptionIcon('heroicon-m-clock')
                ->color('danger'),
        ];
    }
}
