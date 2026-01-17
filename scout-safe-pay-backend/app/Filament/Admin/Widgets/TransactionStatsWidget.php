<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Transaction;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TransactionStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $pendingPayment = Transaction::where('status', 'payment_pending')->count();
        $paymentVerified = Transaction::where('status', 'payment_verified')->count();
        $completed = Transaction::where('status', 'completed')->count();
        $totalEscrow = Transaction::whereIn('status', ['payment_verified', 'payment_pending'])
            ->sum('amount');
        
        return [
            Stat::make('Awaiting Payment Confirmation', $pendingPayment)
                ->description('Bank transfers to verify')
                ->descriptionIcon('heroicon-o-clock')
                ->color('warning'),
                
            Stat::make('Ready to Release', $paymentVerified)
                ->description('Funds verified, awaiting release')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('info'),
                
            Stat::make('Total in Escrow', '€' . number_format($totalEscrow, 2))
                ->description('Funds held in escrow')
                ->descriptionIcon('heroicon-o-lock-closed')
                ->color('primary'),
                
            Stat::make('Completed This Month', $completed)
                ->description('Successfully completed transactions')
                ->descriptionIcon('heroicon-o-check-badge')
                ->color('success'),
        ];
    }
}
