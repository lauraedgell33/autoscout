<?php

namespace App\Filament\Widgets;

use App\Models\Dispute;
use App\Models\Review;
use App\Models\BankAccount;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ModerationStatsWidget extends BaseWidget
{
    protected static ?int $sort = 5;
    
    protected static ?string $pollingInterval = '30s';

    protected function getStats(): array
    {
        return [
            // Pending Reviews
            Stat::make('Pending Reviews', function () {
                return Review::where('status', 'pending')->count();
            })
                ->description('Awaiting moderation')
                ->descriptionIcon('heroicon-o-star')
                ->color('warning')
                ->url(route('filament.admin.resources.reviews.index', ['tableFilters' => ['status' => ['pending']]])),

            // Open Disputes
            Stat::make('Open Disputes', function () {
                $open = Dispute::where('status', 'open')->count();
                $investigating = Dispute::where('status', 'investigating')->count();
                return $open + $investigating;
            })
                ->description('Requires attention')
                ->descriptionIcon('heroicon-o-exclamation-triangle')
                ->color('danger')
                ->url(route('filament.admin.resources.disputes.index', ['tableFilters' => ['status' => ['open', 'investigating']]])),

            // Unverified Bank Accounts
            Stat::make('Unverified Accounts', function () {
                return BankAccount::where('is_verified', false)->count();
            })
                ->description('Pending verification')
                ->descriptionIcon('heroicon-o-building-library')
                ->color('warning')
                ->url(route('filament.admin.resources.bank-accounts.index', ['tableFilters' => ['is_verified' => false]])),

            // Flagged Content
            Stat::make('Flagged Content', function () {
                $flaggedReviews = Review::where('is_flagged', true)->count();
                $fraudDisputes = Dispute::where('type', 'fraud')->where('status', '!=', 'resolved')->count();
                return $flaggedReviews + $fraudDisputes;
            })
                ->description('Requires review')
                ->descriptionIcon('heroicon-o-flag')
                ->color('danger'),
        ];
    }
}
