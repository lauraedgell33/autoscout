<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PaymentStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $pendingPayments = Transaction::whereNotNull('payment_proof')
            ->where('status', 'pending')
            ->count();

        $verifiedToday = Transaction::where('status', 'payment_received')
            ->whereDate('payment_verified_at', today())
            ->count();

        $totalVerified = Transaction::where('status', 'payment_received')
            ->whereNotNull('payment_verified_at')
            ->count();

        $pendingAmount = Transaction::whereNotNull('payment_proof')
            ->where('status', 'pending')
            ->sum('amount');

        return [
            Stat::make('Pending Verification', $pendingPayments)
                ->description('Awaiting payment verification')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning')
                ->chart([7, 3, 4, 5, 6, 3, $pendingPayments])
                ->url(route('filament.admin.resources.payment-verification.index')),

            Stat::make('Verified Today', $verifiedToday)
                ->description('Payments verified today')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success')
                ->chart([2, 5, 3, 8, 4, 6, $verifiedToday]),

            Stat::make('Pending Amount', '€' . number_format($pendingAmount, 0))
                ->description('Total value awaiting verification')
                ->descriptionIcon('heroicon-m-currency-euro')
                ->color('info'),

            Stat::make('Total Verified', $totalVerified)
                ->description('All-time verified payments')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),
        ];
    }
}
