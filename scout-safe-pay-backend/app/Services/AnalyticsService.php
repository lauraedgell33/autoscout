<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Payment;
use App\Models\Dispute;
use App\Models\Verification;
use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get overall dashboard statistics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getOverallStats(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        return [
            'total_transactions' => self::getTotalTransactions($startDate, $endDate),
            'completed_transactions' => self::getCompletedTransactions($startDate, $endDate),
            'pending_transactions' => self::getPendingTransactions($startDate, $endDate),
            'cancelled_transactions' => self::getCancelledTransactions($startDate, $endDate),
            'total_volume' => self::getTotalVolume($startDate, $endDate),
            'average_transaction_value' => self::getAverageTransactionValue($startDate, $endDate),
            'active_vehicles' => Vehicle::where('status', 'active')->count(),
            'total_users' => User::whereNotNull('email_verified_at')->count(),
            'active_sellers' => User::where('role', 'seller')->whereNotNull('email_verified_at')->count(),
            'active_buyers' => User::where('role', 'buyer')->whereNotNull('email_verified_at')->count(),
            'verified_users' => Verification::where('status', 'verified')->count(),
            'pending_verifications' => Verification::where('status', 'pending')->count(),
        ];
    }

    /**
     * Get transaction statistics for a date range
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getTransactionStats(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $transactionsByStatus = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('status, COUNT(*) as count, SUM(amount) as total_amount')
            ->groupBy('status')
            ->get();

        $transactionsByDay = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(amount) as total_amount')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return [
            'by_status' => $transactionsByStatus->mapWithKeys(fn($item) => [
                $item->status => [
                    'count' => $item->count,
                    'total_amount' => (float) $item->total_amount,
                ]
            ])->toArray(),
            'by_day' => $transactionsByDay->map(fn($item) => [
                'date' => $item->date,
                'count' => $item->count,
                'total_amount' => (float) $item->total_amount,
            ])->toArray(),
            'total' => self::getTotalTransactions($startDate, $endDate),
            'completion_rate' => self::getCompletionRate($startDate, $endDate),
            'cancellation_rate' => self::getCancellationRate($startDate, $endDate),
        ];
    }

    /**
     * Get revenue analytics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getRevenueAnalytics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $revenueByDay = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->selectRaw('DATE(created_at) as date, SUM(service_fee) as platform_fee, SUM(dealer_commission) as dealer_commission')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $revenueByCurrency = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->selectRaw('currency, COUNT(*) as transactions, SUM(amount) as total_volume, SUM(service_fee) as platform_fee')
            ->groupBy('currency')
            ->get();

        $totalPlatformFee = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->sum('service_fee');

        $totalDealerCommission = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->sum('dealer_commission');

        $totalGrossVolume = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->sum('amount');

        return [
            'total_platform_fee' => (float) $totalPlatformFee,
            'total_dealer_commission' => (float) $totalDealerCommission,
            'total_gross_volume' => (float) $totalGrossVolume,
            'average_fee_percentage' => $totalGrossVolume > 0 
                ? (($totalPlatformFee / $totalGrossVolume) * 100)
                : 0,
            'by_day' => $revenueByDay->map(fn($item) => [
                'date' => $item->date,
                'platform_fee' => (float) $item->platform_fee,
                'dealer_commission' => (float) $item->dealer_commission,
            ])->toArray(),
            'by_currency' => $revenueByCurrency->map(fn($item) => [
                'currency' => $item->currency,
                'transactions' => $item->transactions,
                'total_volume' => (float) $item->total_volume,
                'platform_fee' => (float) $item->platform_fee,
            ])->toArray(),
        ];
    }

    /**
     * Get user analytics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getUserAnalytics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $newUsersByDay = User::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $usersByRole = User::whereNotNull('email_verified_at')
            ->selectRaw('role, COUNT(*) as count')
            ->groupBy('role')
            ->get();

        $topSellers = User::where('role', 'seller')
            ->with('sellerTransactions')
            ->selectRaw('users.id, users.name, users.email, COUNT(transactions.id) as transaction_count, SUM(transactions.amount) as total_volume')
            ->join('transactions', 'users.id', '=', 'transactions.seller_id')
            ->whereBetween('transactions.created_at', [$startDate, $endDate])
            ->where('transactions.status', 'completed')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderBy('total_volume', 'desc')
            ->limit(10)
            ->get();

        return [
            'new_users_registered' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
            'verified_users' => User::whereNotNull('email_verified_at')->count(),
            'by_role' => $usersByRole->mapWithKeys(fn($item) => [
                $item->role => $item->count
            ])->toArray(),
            'new_users_by_day' => $newUsersByDay->map(fn($item) => [
                'date' => $item->date,
                'count' => $item->count,
            ])->toArray(),
            'top_sellers' => $topSellers->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'transaction_count' => $user->transaction_count,
                'total_volume' => (float) $user->total_volume,
            ])->toArray(),
        ];
    }

    /**
     * Get vehicle market analytics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getVehicleAnalytics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $vehiclesByStatus = Vehicle::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $vehiclesByCategory = Vehicle::selectRaw('category, COUNT(*) as count, AVG(price) as avg_price')
            ->groupBy('category')
            ->get();

        $vehiclesByMake = Vehicle::where('status', 'active')
            ->selectRaw('make, COUNT(*) as count, AVG(price) as avg_price')
            ->groupBy('make')
            ->orderBy('count', 'desc')
            ->limit(15)
            ->get();

        $soldVehicles = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->count();

        $priceStatistics = Vehicle::where('status', 'active')
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price, AVG(price) as avg_price, STDDEV(price) as stddev_price')
            ->first();

        return [
            'total_active' => Vehicle::where('status', 'active')->count(),
            'total_sold' => Vehicle::where('status', 'sold')->count(),
            'total_inactive' => Vehicle::where('status', 'inactive')->count(),
            'sold_this_period' => $soldVehicles,
            'by_status' => $vehiclesByStatus->mapWithKeys(fn($item) => [
                $item->status => $item->count
            ])->toArray(),
            'by_category' => $vehiclesByCategory->map(fn($item) => [
                'category' => $item->category,
                'count' => $item->count,
                'avg_price' => (float) $item->avg_price,
            ])->toArray(),
            'top_makes' => $vehiclesByMake->map(fn($item) => [
                'make' => $item->make,
                'count' => $item->count,
                'avg_price' => (float) $item->avg_price,
            ])->toArray(),
            'price_statistics' => [
                'min' => (float) $priceStatistics->min_price,
                'max' => (float) $priceStatistics->max_price,
                'average' => (float) $priceStatistics->avg_price,
                'stddev' => (float) ($priceStatistics->stddev_price ?? 0),
            ],
        ];
    }

    /**
     * Get dispute and compliance analytics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getComplianceAnalytics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $disputesByStatus = Dispute::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $kycByStatus = KYCVerification::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $averageKYCTime = KYCVerification::where('status', 'verified')
            ->whereNotNull('verified_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, verified_at)) as avg_hours')
            ->first();

        $rejectedKYC = KYCVerification::where('status', 'rejected')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        return [
            'active_disputes' => Dispute::where('status', 'open')->count(),
            'resolved_disputes' => Dispute::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'resolved')
                ->count(),
            'disputes_this_period' => Dispute::whereBetween('created_at', [$startDate, $endDate])->count(),
            'disputes_by_status' => $disputesByStatus->mapWithKeys(fn($item) => [
                $item->status => $item->count
            ])->toArray(),
            'kyc_verification' => [
                'pending' => KYCVerification::where('status', 'pending')->count(),
                'verified' => KYCVerification::where('status', 'verified')->count(),
                'rejected' => $rejectedKYC,
                'verification_rate' => KYCVerification::count() > 0
                    ? (KYCVerification::where('status', 'verified')->count() / KYCVerification::count() * 100)
                    : 0,
                'average_verification_time_hours' => $averageKYCTime->avg_hours ?? 0,
            ],
            'kyc_by_status' => $kycByStatus->mapWithKeys(fn($item) => [
                $item->status => $item->count
            ])->toArray(),
        ];
    }

    /**
     * Get communication and engagement analytics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getEngagementAnalytics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $messagesByDay = Message::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total, SUM(CASE WHEN is_read = true THEN 1 ELSE 0 END) as read_count')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        $transactionMessages = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('transactions.id, COUNT(messages.id) as message_count, transactions.status')
            ->leftJoin('messages', 'transactions.id', '=', 'messages.transaction_id')
            ->groupBy('transactions.id', 'transactions.status')
            ->get();

        $avgMessagesPerTransaction = $transactionMessages->avg('message_count') ?? 0;

        $unreadMessages = Message::where('is_read', false)->count();

        $systemMessages = Message::whereBetween('created_at', [$startDate, $endDate])
            ->where('is_system_message', true)
            ->count();

        return [
            'total_messages' => Message::whereBetween('created_at', [$startDate, $endDate])->count(),
            'total_unread' => $unreadMessages,
            'system_messages' => $systemMessages,
            'user_messages' => Message::whereBetween('created_at', [$startDate, $endDate])
                ->where('is_system_message', false)
                ->count(),
            'read_rate' => Message::whereBetween('created_at', [$startDate, $endDate])->count() > 0
                ? (Message::whereBetween('created_at', [$startDate, $endDate])
                    ->where('is_read', true)
                    ->count() / Message::whereBetween('created_at', [$startDate, $endDate])->count() * 100)
                : 0,
            'avg_messages_per_transaction' => (float) $avgMessagesPerTransaction,
            'messages_by_day' => $messagesByDay->map(fn($item) => [
                'date' => $item->date,
                'total' => $item->total,
                'read' => $item->read_count,
                'unread' => $item->total - $item->read_count,
            ])->toArray(),
        ];
    }

    /**
     * Get payment method analytics
     *
     * @param Carbon|null $startDate
     * @param Carbon|null $endDate
     * @return array
     */
    public static function getPaymentAnalytics(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $startDate = $startDate ?? Carbon::now()->subMonths(1);
        $endDate = $endDate ?? Carbon::now();

        $paymentsByStatus = Payment::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('status, COUNT(*) as count, SUM(amount) as total_amount')
            ->groupBy('status')
            ->get();

        $paymentsByMethod = Payment::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total_amount, AVG(amount) as avg_amount')
            ->groupBy('payment_method')
            ->get();

        $totalSuccessfulPayments = Payment::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'verified')
            ->sum('amount');

        $paymentSuccessRate = Payment::whereBetween('created_at', [$startDate, $endDate])->count() > 0
            ? (Payment::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'verified')
                ->count() / Payment::whereBetween('created_at', [$startDate, $endDate])->count() * 100)
            : 0;

        return [
            'total_payments' => Payment::whereBetween('created_at', [$startDate, $endDate])->count(),
            'successful_payments' => Payment::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'verified')
                ->count(),
            'failed_payments' => Payment::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'failed')
                ->count(),
            'pending_payments' => Payment::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'pending')
                ->count(),
            'total_successful_amount' => (float) $totalSuccessfulPayments,
            'success_rate' => (float) $paymentSuccessRate,
            'by_status' => $paymentsByStatus->map(fn($item) => [
                'status' => $item->status,
                'count' => $item->count,
                'total_amount' => (float) $item->total_amount,
            ])->toArray(),
            'by_method' => $paymentsByMethod->map(fn($item) => [
                'method' => $item->payment_method,
                'count' => $item->count,
                'total_amount' => (float) $item->total_amount,
                'avg_amount' => (float) $item->avg_amount,
            ])->toArray(),
        ];
    }

    /**
     * Helper: Get total transactions
     */
    private static function getTotalTransactions(Carbon $startDate, Carbon $endDate): int
    {
        return Transaction::whereBetween('created_at', [$startDate, $endDate])->count();
    }

    /**
     * Helper: Get completed transactions
     */
    private static function getCompletedTransactions(Carbon $startDate, Carbon $endDate): int
    {
        return Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->count();
    }

    /**
     * Helper: Get pending transactions
     */
    private static function getPendingTransactions(Carbon $startDate, Carbon $endDate): int
    {
        return Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('status', ['pending', 'payment_verified', 'escrow_held'])
            ->count();
    }

    /**
     * Helper: Get cancelled transactions
     */
    private static function getCancelledTransactions(Carbon $startDate, Carbon $endDate): int
    {
        return Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'cancelled')
            ->count();
    }

    /**
     * Helper: Get total volume
     */
    private static function getTotalVolume(Carbon $startDate, Carbon $endDate): float
    {
        return (float) Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->sum('amount');
    }

    /**
     * Helper: Get average transaction value
     */
    private static function getAverageTransactionValue(Carbon $startDate, Carbon $endDate): float
    {
        $average = Transaction::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'completed')
            ->avg('amount');

        return (float) ($average ?? 0);
    }

    /**
     * Helper: Get completion rate
     */
    private static function getCompletionRate(Carbon $startDate, Carbon $endDate): float
    {
        $total = self::getTotalTransactions($startDate, $endDate);
        $completed = self::getCompletedTransactions($startDate, $endDate);

        return $total > 0 ? (($completed / $total) * 100) : 0;
    }

    /**
     * Helper: Get cancellation rate
     */
    private static function getCancellationRate(Carbon $startDate, Carbon $endDate): float
    {
        $total = self::getTotalTransactions($startDate, $endDate);
        $cancelled = self::getCancelledTransactions($startDate, $endDate);

        return $total > 0 ? (($cancelled / $total) * 100) : 0;
    }
}
