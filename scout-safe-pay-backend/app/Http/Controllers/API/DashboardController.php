<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get overall dashboard statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getOverallStats(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $stats = AnalyticsService::getOverallStats($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $stats,
                'period' => [
                    'start_date' => $startDate?->toDateString() ?? Carbon::now()->subMonths(1)->toDateString(),
                    'end_date' => $endDate?->toDateString() ?? Carbon::now()->toDateString(),
                ]
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Dashboard stats error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve dashboard statistics',
            ], 500);
        }
    }

    /**
     * Get transaction analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getTransactionAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getTransactionStats($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Transaction analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve transaction analytics',
            ], 500);
        }
    }

    /**
     * Get revenue analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getRevenueAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getRevenueAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Revenue analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve revenue analytics',
            ], 500);
        }
    }

    /**
     * Get user analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getUserAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('User analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user analytics',
            ], 500);
        }
    }

    /**
     * Get vehicle analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getVehicleAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getVehicleAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Vehicle analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve vehicle analytics',
            ], 500);
        }
    }

    /**
     * Get compliance and dispute analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getComplianceAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getComplianceAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Compliance analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve compliance analytics',
            ], 500);
        }
    }

    /**
     * Get engagement analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getEngagementAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getEngagementAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Engagement analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve engagement analytics',
            ], 500);
        }
    }

    /**
     * Get payment analytics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getPaymentAnalytics(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $analytics = AnalyticsService::getPaymentAnalytics($startDate, $endDate);

            return response()->json([
                'success' => true,
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Payment analytics error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment analytics',
            ], 500);
        }
    }

    /**
     * Get comprehensive dashboard report
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getComprehensiveReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $report = [
                'overall' => AnalyticsService::getOverallStats($startDate, $endDate),
                'transactions' => AnalyticsService::getTransactionStats($startDate, $endDate),
                'revenue' => AnalyticsService::getRevenueAnalytics($startDate, $endDate),
                'users' => AnalyticsService::getUserAnalytics($startDate, $endDate),
                'vehicles' => AnalyticsService::getVehicleAnalytics($startDate, $endDate),
                'compliance' => AnalyticsService::getComplianceAnalytics($startDate, $endDate),
                'engagement' => AnalyticsService::getEngagementAnalytics($startDate, $endDate),
                'payments' => AnalyticsService::getPaymentAnalytics($startDate, $endDate),
            ];

            return response()->json([
                'success' => true,
                'data' => $report,
                'period' => [
                    'start_date' => $startDate?->toDateString() ?? Carbon::now()->subMonths(1)->toDateString(),
                    'end_date' => $endDate?->toDateString() ?? Carbon::now()->toDateString(),
                ]
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Comprehensive report error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate comprehensive report',
            ], 500);
        }
    }

    /**
     * Export dashboard data as CSV or JSON
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function exportReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date|date_format:Y-m-d',
                'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
                'format' => 'required|in:json,csv',
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date'])->startOfDay() : null;
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date'])->endOfDay() : null;

            $report = [
                'overall' => AnalyticsService::getOverallStats($startDate, $endDate),
                'transactions' => AnalyticsService::getTransactionStats($startDate, $endDate),
                'revenue' => AnalyticsService::getRevenueAnalytics($startDate, $endDate),
                'users' => AnalyticsService::getUserAnalytics($startDate, $endDate),
            ];

            if ($validated['format'] === 'json') {
                return response()->json([
                    'success' => true,
                    'data' => $report,
                ], 200);
            }

            // CSV export would typically trigger a file download
            // Here we return a JSON response indicating export is available
            return response()->json([
                'success' => true,
                'message' => 'CSV export generated',
                'download_url' => '/api/admin/dashboard/export-csv',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Export error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to export report',
            ], 500);
        }
    }
}
