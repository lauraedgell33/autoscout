<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use App\Models\User;
use App\Models\Dealer;
use App\Models\Vehicle;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    
    protected static ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        return [
            // Revenue Today
            Stat::make('Revenue Today', function () {
                $revenue = Transaction::whereDate('created_at', today())
                    ->whereIn('status', ['completed', 'success'])
                    ->sum('amount');
                return '€' . number_format($revenue, 2);
            })
                ->description('Total revenue today')
                ->descriptionIcon('heroicon-o-currency-euro')
                ->color('success')
                ->chart($this->getRevenueChart(7)),

            // Revenue This Month
            Stat::make('Revenue This Month', function () {
                $revenue = Transaction::whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->whereIn('status', ['completed', 'success'])
                    ->sum('amount');
                return '€' . number_format($revenue, 2);
            })
                ->description('Total revenue this month')
                ->descriptionIcon('heroicon-o-calendar')
                ->color('success')
                ->chart($this->getRevenueChart(30)),

            // Active Transactions
            Stat::make('Active Transactions', function () {
                return Transaction::whereIn('status', ['pending', 'processing', 'escrow'])
                    ->count();
            })
                ->description('Transactions in progress')
                ->descriptionIcon('heroicon-o-arrow-path')
                ->color('warning')
                ->chart($this->getTransactionChart(7)),

            // Total Users
            Stat::make('Total Users', function () {
                $total = User::count();
                $newToday = User::whereDate('created_at', today())->count();
                return $total . ($newToday > 0 ? ' (+' . $newToday . ' today)' : '');
            })
                ->description('Registered users')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary')
                ->chart($this->getUserChart(7)),

            // Active Dealers
            Stat::make('Active Dealers', function () {
                $total = Dealer::where('verification_status', 'verified')->count();
                $pending = Dealer::where('verification_status', 'pending')->count();
                return $total . ($pending > 0 ? ' (' . $pending . ' pending)' : '');
            })
                ->description('Verified dealers')
                ->descriptionIcon('heroicon-o-building-storefront')
                ->color('info')
                ->chart($this->getDealerChart(7)),

            // Active Vehicles
            Stat::make('Active Vehicles', function () {
                $total = Vehicle::where('status', 'active')->count();
                $sold = Vehicle::where('status', 'sold')->whereDate('updated_at', '>=', now()->subDays(7))->count();
                return $total . ($sold > 0 ? ' (' . $sold . ' sold this week)' : '');
            })
                ->description('Listed vehicles')
                ->descriptionIcon('heroicon-o-truck')
                ->color('info')
                ->chart($this->getVehicleChart(7)),
        ];
    }

    private function getRevenueChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $revenue = Transaction::whereDate('created_at', $date)
                ->whereIn('status', ['completed', 'success'])
                ->sum('amount');
            $data[] = (float) $revenue;
        }
        return $data;
    }

    private function getTransactionChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Transaction::whereDate('created_at', $date)->count();
            $data[] = $count;
        }
        return $data;
    }

    private function getUserChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = User::whereDate('created_at', $date)->count();
            $data[] = $count;
        }
        return $data;
    }

    private function getDealerChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Dealer::whereDate('created_at', $date)->count();
            $data[] = $count;
        }
        return $data;
    }

    private function getVehicleChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $count = Vehicle::whereDate('created_at', $date)->count();
            $data[] = $count;
        }
        return $data;
    }
}
