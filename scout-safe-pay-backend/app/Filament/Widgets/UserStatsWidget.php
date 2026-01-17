<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalUsers = User::count();
        $buyers = User::where('user_type', 'buyer')->count();
        $sellers = User::where('user_type', 'seller')->count();
        $admins = User::where('user_type', 'admin')->count();
        
        $verifiedUsers = User::where('is_verified', true)->count();
        $verificationRate = $totalUsers > 0 ? ($verifiedUsers / $totalUsers) * 100 : 0;

        $newUsersToday = User::whereDate('created_at', today())->count();
        $newUsersThisWeek = User::whereBetween('created_at', [now()->startOfWeek(), now()])->count();
        $newUsersLastWeek = User::whereBetween('created_at', [now()->subWeek()->startOfWeek(), now()->subWeek()->endOfWeek()])->count();

        $growth = $newUsersLastWeek > 0 
            ? (($newUsersThisWeek - $newUsersLastWeek) / $newUsersLastWeek) * 100 
            : 0;

        return [
            Stat::make('Total Users', $totalUsers)
                ->description('All registered users')
                ->descriptionIcon('heroicon-m-users')
                ->color('info')
                ->chart([
                    $totalUsers - 20,
                    $totalUsers - 15,
                    $totalUsers - 10,
                    $totalUsers - 5,
                    $totalUsers - 2,
                    $totalUsers,
                ])
                ->url(route('filament.admin.resources.users.index')),

            Stat::make('Buyers', $buyers)
                ->description(number_format(($buyers / $totalUsers) * 100, 1) . '% of total')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('info'),

            Stat::make('Sellers', $sellers)
                ->description(number_format(($sellers / $totalUsers) * 100, 1) . '% of total')
                ->descriptionIcon('heroicon-m-building-storefront')
                ->color('warning'),

            Stat::make('New This Week', $newUsersThisWeek)
                ->description($growth >= 0 ? '+' . number_format($growth, 1) . '% from last week' : number_format($growth, 1) . '% from last week')
                ->descriptionIcon($growth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($growth >= 0 ? 'success' : 'danger')
                ->chart([
                    $newUsersLastWeek,
                    $newUsersLastWeek + 2,
                    $newUsersLastWeek + 4,
                    $newUsersThisWeek - 3,
                    $newUsersThisWeek - 1,
                    $newUsersThisWeek,
                ]),

            Stat::make('Email Verified', number_format($verificationRate, 1) . '%')
                ->description($verifiedUsers . ' out of ' . $totalUsers . ' users')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color($verificationRate > 80 ? 'success' : ($verificationRate > 50 ? 'warning' : 'danger'))
                ->chart([70, 75, 80, 82, 85, $verificationRate]),

            Stat::make('New Today', $newUsersToday)
                ->description('Registered today')
                ->descriptionIcon('heroicon-m-user-plus')
                ->color('success'),
        ];
    }
}
