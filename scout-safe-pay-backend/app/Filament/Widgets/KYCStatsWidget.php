<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class KYCStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $pendingKYC = User::whereNotNull('kyc_submitted_at')
            ->where('kyc_status', 'pending')
            ->count();

        $approvedKYC = User::where('kyc_status', 'approved')->count();
        
        $rejectedKYC = User::where('kyc_status', 'rejected')->count();

        return [
            Stat::make('Pending KYC', $pendingKYC)
                ->description('Awaiting verification')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning')
                ->url(route('filament.admin.resources.kyc-verification.index')),

            Stat::make('Approved KYC', $approvedKYC)
                ->description('Verified users')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Rejected KYC', $rejectedKYC)
                ->description('Failed verification')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
        ];
    }
}
