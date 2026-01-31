<?php

namespace App\Filament\Admin\Pages;

use App\Models\Dealer;
use App\Models\Dispute;
use App\Models\Payment;
use App\Models\Review;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Verification;
use Filament\Pages\Page;
use Illuminate\Support\Carbon;

class Reports extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $navigationLabel = 'Reports & Analytics';

    protected static ?string $title = 'Reports & Analytics';

    protected static ?string $slug = 'reports';

    public function getView(): string
    {
        return 'filament.admin.pages.reports';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'System';
    }

    public static function getNavigationSort(): ?int
    {
        return 90;
    }

    public function getViewData(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // User statistics
        $totalUsers = User::count();
        $newUsersThisMonth = User::where('created_at', '>=', $startOfMonth)->count();
        $verifiedUsers = User::where('is_verified', true)->count();
        $usersByType = User::selectRaw('user_type, count(*) as count')
            ->groupBy('user_type')
            ->pluck('count', 'user_type')
            ->toArray();

        // Transaction statistics
        $totalTransactions = Transaction::count();
        $transactionsThisMonth = Transaction::where('created_at', '>=', $startOfMonth)->count();
        $transactionsLastMonth = Transaction::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $completedTransactions = Transaction::where('status', 'completed')->count();
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount');
        $revenueThisMonth = Transaction::where('status', 'completed')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('amount');
        $transactionsByStatus = Transaction::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Vehicle statistics
        $totalVehicles = Vehicle::count();
        $activeVehicles = Vehicle::where('status', 'active')->count();
        $soldVehicles = Vehicle::where('status', 'sold')->count();
        $averagePrice = Vehicle::where('status', 'active')->avg('price') ?? 0;
        $vehiclesByStatus = Vehicle::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Dealer statistics
        $totalDealers = Dealer::count();
        $activeDealers = Dealer::where('status', 'active')->count();
        $pendingDealers = Dealer::where('status', 'pending')->count();

        // Payment statistics
        $totalPayments = Payment::count();
        $pendingPayments = Payment::where('status', 'pending')->count();
        $completedPayments = Payment::where('status', 'completed')->count();
        $totalPaymentAmount = Payment::where('status', 'completed')->sum('amount');
        $escrowBalance = Payment::whereIn('status', ['pending', 'processing'])->sum('amount');

        // Dispute statistics
        $totalDisputes = Dispute::count();
        $openDisputes = Dispute::whereIn('status', ['open', 'in_progress', 'under_review'])->count();
        $resolvedDisputes = Dispute::where('status', 'resolved')->count();

        // KYC statistics
        $pendingVerifications = Verification::where('status', 'pending')->count();
        $approvedVerifications = Verification::where('status', 'approved')->count();

        // Review statistics
        $totalReviews = Review::count();
        $pendingReviews = Review::where('moderation_status', 'pending')->count();
        $averageRating = Review::where('moderation_status', 'approved')->avg('rating') ?? 0;

        // Monthly trends (last 6 months)
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $monthlyData[] = [
                'month' => $month->format('M Y'),
                'transactions' => Transaction::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'revenue' => Transaction::where('status', 'completed')
                    ->whereBetween('created_at', [$monthStart, $monthEnd])
                    ->sum('amount'),
                'users' => User::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'vehicles' => Vehicle::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        return [
            // User stats
            'totalUsers' => $totalUsers,
            'newUsersThisMonth' => $newUsersThisMonth,
            'verifiedUsers' => $verifiedUsers,
            'usersByType' => $usersByType,

            // Transaction stats
            'totalTransactions' => $totalTransactions,
            'transactionsThisMonth' => $transactionsThisMonth,
            'transactionsLastMonth' => $transactionsLastMonth,
            'completedTransactions' => $completedTransactions,
            'totalRevenue' => $totalRevenue,
            'revenueThisMonth' => $revenueThisMonth,
            'transactionsByStatus' => $transactionsByStatus,

            // Vehicle stats
            'totalVehicles' => $totalVehicles,
            'activeVehicles' => $activeVehicles,
            'soldVehicles' => $soldVehicles,
            'averagePrice' => $averagePrice,
            'vehiclesByStatus' => $vehiclesByStatus,

            // Dealer stats
            'totalDealers' => $totalDealers,
            'activeDealers' => $activeDealers,
            'pendingDealers' => $pendingDealers,

            // Payment stats
            'totalPayments' => $totalPayments,
            'pendingPayments' => $pendingPayments,
            'completedPayments' => $completedPayments,
            'totalPaymentAmount' => $totalPaymentAmount,
            'escrowBalance' => $escrowBalance,

            // Dispute stats
            'totalDisputes' => $totalDisputes,
            'openDisputes' => $openDisputes,
            'resolvedDisputes' => $resolvedDisputes,

            // KYC stats
            'pendingVerifications' => $pendingVerifications,
            'approvedVerifications' => $approvedVerifications,

            // Review stats
            'totalReviews' => $totalReviews,
            'pendingReviews' => $pendingReviews,
            'averageRating' => round($averageRating, 1),

            // Monthly trends
            'monthlyData' => $monthlyData,
        ];
    }
}
