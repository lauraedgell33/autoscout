<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TransactionStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalTransactions = Transaction::count();
        $pendingTransactions = Transaction::where('status', 'pending')->count();
        $completedTransactions = Transaction::where('status', 'completed')->count();
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount');
        
        $thisMonthRevenue = Transaction::where('status', 'completed')
            ->whereMonth('completed_at', now()->month)
            ->sum('amount');

        $lastMonthRevenue = Transaction::where('status', 'completed')
            ->whereMonth('completed_at', now()->subMonth()->month)
            ->sum('amount');

        $revenueChange = $lastMonthRevenue > 0 
            ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        return [
            Stat::make('Total Transactions', $totalTransactions)
                ->description('All time transactions')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info')
                ->chart([12, 15, 18, 22, 25, 30, $totalTransactions])
                ->url(route('filament.admin.resources.transactions.index')),

            Stat::make('Pending', $pendingTransactions)
                ->description('Awaiting payment')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning')
                ->url(route('filament.admin.resources.transactions.index')),

            Stat::make('Completed', $completedTransactions)
                ->description('Successfully completed')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Monthly Revenue', '€' . number_format($thisMonthRevenue, 0))
                ->description($revenueChange >= 0 ? '+' . number_format($revenueChange, 1) . '% increase' : number_format($revenueChange, 1) . '% decrease')
                ->descriptionIcon($revenueChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueChange >= 0 ? 'success' : 'danger')
                ->chart([
                    $lastMonthRevenue,
                    $lastMonthRevenue * 1.1,
                    $lastMonthRevenue * 1.2,
                    $thisMonthRevenue * 0.8,
                    $thisMonthRevenue * 0.9,
                    $thisMonthRevenue,
                ]),
        ];
    }
}
