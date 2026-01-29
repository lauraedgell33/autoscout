<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Controller;

/**
 * System Health & Monitoring Controller
 * Provides endpoints for monitoring application health
 */
class HealthController extends Controller
{
    /**
     * Basic health check
     * Used by load balancers and monitoring tools
     * 
     * GET /api/health
     */
    public function health()
    {
        try {
            $checks = [
                'status' => 'ok',
                'timestamp' => now()->toIso8601String(),
                'uptime' => $this->getUptime(),
                'version' => config('app.version', '1.0.0'),
                'checks' => [
                    'database' => $this->checkDatabase(),
                    'cache' => $this->checkCache(),
                    'storage' => $this->checkStorage(),
                    'queue' => $this->checkQueue(),
                ],
            ];

            // Determine overall status
            foreach ($checks['checks'] as $check) {
                if ($check['status'] === 'error') {
                    return response()->json($checks, 503);
                }
            }

            return response()->json($checks, 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 503);
        }
    }

    /**
     * Detailed health check with performance metrics
     * GET /api/health/detailed
     */
    public function detailed()
    {
        $startTime = microtime(true);

        try {
            $health = [
                'status' => 'ok',
                'timestamp' => now()->toIso8601String(),
                'version' => config('app.version', '1.0.0'),
                'performance' => [
                    'uptime' => $this->getUptime(),
                    'memory_usage' => $this->getMemoryUsage(),
                    'cpu_usage' => $this->getCpuUsage(),
                ],
                'components' => [
                    'database' => $this->getDatabaseHealth(),
                    'cache' => $this->getCacheHealth(),
                    'storage' => $this->getStorageHealth(),
                    'email' => $this->getEmailHealth(),
                    'queue' => $this->getQueueHealth(),
                    'files' => $this->getFileHealth(),
                ],
                'metrics' => [
                    'orders' => $this->countOrders(),
                    'pending_payments' => $this->countPendingPayments(),
                    'failed_emails' => $this->countFailedEmails(),
                    'queued_jobs' => $this->countQueuedJobs(),
                ],
                'response_time_ms' => round((microtime(true) - $startTime) * 1000, 2),
            ];

            // Overall status
            if ($this->hasErrors($health['components'])) {
                $health['status'] = 'warning';
                $statusCode = 200;
            } else {
                $statusCode = 200;
            }

            return response()->json($health, $statusCode);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'timestamp' => now()->toIso8601String(),
            ], 503);
        }
    }

    /**
     * Get database health
     */
    private function getDatabaseHealth()
    {
        try {
            $startTime = microtime(true);
            DB::connection()->getPdo();
            $responseTime = microtime(true) - $startTime;

            // Check database size
            $result = DB::select("SELECT SUM(data_length + index_length) as size FROM information_schema.tables WHERE table_schema = ?", [env('DB_DATABASE')]);
            $dbSize = $result[0]->size ?? 0;

            return [
                'status' => 'ok',
                'connection' => 'connected',
                'response_time_ms' => round($responseTime * 1000, 2),
                'size_mb' => round($dbSize / 1024 / 1024, 2),
                'tables_count' => DB::select('SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ?', [env('DB_DATABASE')])[0]->count,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'connection' => 'disconnected',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get cache health
     */
    private function getCacheHealth()
    {
        try {
            $testKey = 'health_check_' . time();
            $testValue = 'ok';

            Cache::put($testKey, $testValue, 60);
            $retrieved = Cache::get($testKey);
            Cache::forget($testKey);

            if ($retrieved === $testValue) {
                return [
                    'status' => 'ok',
                    'driver' => config('cache.default'),
                    'working' => true,
                ];
            } else {
                return [
                    'status' => 'error',
                    'driver' => config('cache.default'),
                    'error' => 'Cache write/read failed',
                ];
            }
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get storage health
     */
    private function getStorageHealth()
    {
        try {
            $disk = \Storage::disk('local');
            $path = storage_path('app');

            if (!is_dir($path)) {
                return [
                    'status' => 'error',
                    'error' => 'Storage directory not found',
                ];
            }

            // Check disk space
            $space = disk_free_space($path);
            $total = disk_total_space($path);
            $usagePercent = round(($total - $space) / $total * 100, 2);

            $status = $usagePercent > 90 ? 'error' : ($usagePercent > 75 ? 'warning' : 'ok');

            return [
                'status' => $status,
                'free_mb' => round($space / 1024 / 1024, 2),
                'total_mb' => round($total / 1024 / 1024, 2),
                'usage_percent' => $usagePercent,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get email health
     */
    private function getEmailHealth()
    {
        try {
            $mailer = config('mail.mailer');
            $host = config('mail.host');

            // Try to connect to SMTP server
            if ($mailer === 'smtp') {
                $connection = @fsockopen(
                    $host,
                    config('mail.port'),
                    $errno,
                    $errstr,
                    5
                );

                if (!$connection) {
                    return [
                        'status' => 'error',
                        'mailer' => $mailer,
                        'host' => $host,
                        'error' => "SMTP connection failed: $errstr ($errno)",
                    ];
                }
                fclose($connection);
            }

            return [
                'status' => 'ok',
                'mailer' => $mailer,
                'host' => $host,
                'connected' => true,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get queue health
     */
    private function getQueueHealth()
    {
        try {
            $queueConnection = config('queue.default');
            $pendingCount = DB::table('jobs')->count();
            $failedCount = DB::table('failed_jobs')->count();

            $status = $failedCount > 0 ? 'warning' : ($pendingCount > 100 ? 'warning' : 'ok');

            return [
                'status' => $status,
                'connection' => $queueConnection,
                'pending_jobs' => $pendingCount,
                'failed_jobs' => $failedCount,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get file health (PDFs, uploads)
     */
    private function getFileHealth()
    {
        try {
            $uploadsPath = storage_path('app/uploads');
            $pdfsPath = storage_path('app/pdfs');

            $uploadsSize = $this->getDirectorySize($uploadsPath);
            $pdfsSize = $this->getDirectorySize($pdfsPath);

            return [
                'status' => 'ok',
                'uploads_mb' => round($uploadsSize / 1024 / 1024, 2),
                'pdfs_mb' => round($pdfsSize / 1024 / 1024, 2),
                'total_mb' => round(($uploadsSize + $pdfsSize) / 1024 / 1024, 2),
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check database
     */
    private function checkDatabase()
    {
        try {
            DB::connection()->getPdo();
            return [
                'status' => 'ok',
                'message' => 'Connected',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check cache
     */
    private function checkCache()
    {
        try {
            Cache::put('test', 1, 60);
            return [
                'status' => 'ok',
                'message' => 'Working',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check storage
     */
    private function checkStorage()
    {
        try {
            $space = disk_free_space(storage_path());
            if ($space === false || $space < 100 * 1024 * 1024) { // Less than 100MB
                return [
                    'status' => 'warning',
                    'message' => 'Low disk space',
                ];
            }
            return [
                'status' => 'ok',
                'message' => 'Available',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check queue
     */
    private function checkQueue()
    {
        try {
            $count = DB::table('jobs')->count();
            return [
                'status' => 'ok',
                'message' => "$count jobs in queue",
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get uptime in seconds
     */
    private function getUptime()
    {
        try {
            return intval(microtime(true) - LARAVEL_START);
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Get memory usage
     */
    private function getMemoryUsage()
    {
        $usage = memory_get_usage(true);
        $peak = memory_get_peak_usage(true);
        $limit = ini_get('memory_limit');

        return [
            'current_mb' => round($usage / 1024 / 1024, 2),
            'peak_mb' => round($peak / 1024 / 1024, 2),
            'limit' => $limit,
        ];
    }

    /**
     * Get CPU usage
     */
    private function getCpuUsage()
    {
        if (!function_exists('sys_getloadavg')) {
            return null;
        }

        $load = sys_getloadavg();
        return [
            '1_min' => $load[0],
            '5_min' => $load[1],
            '15_min' => $load[2],
        ];
    }

    /**
     * Count total orders
     */
    private function countOrders()
    {
        try {
            return DB::table('transactions')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Count pending payments
     */
    private function countPendingPayments()
    {
        try {
            return DB::table('transactions')
                ->where('status', 'awaiting_bank_transfer')
                ->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Count failed emails
     */
    private function countFailedEmails()
    {
        try {
            return DB::table('failed_jobs')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Count queued jobs
     */
    private function countQueuedJobs()
    {
        try {
            return DB::table('jobs')->count();
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Check if components have errors
     */
    private function hasErrors($components)
    {
        foreach ($components as $component) {
            if ($component['status'] === 'error') {
                return true;
            }
        }
        return false;
    }

    /**
     * Get directory size recursively
     */
    private function getDirectorySize($path)
    {
        $size = 0;
        if (!is_dir($path)) {
            return 0;
        }

        foreach (glob(rtrim($path, '/') . '/*', GLOB_NOSORT) as $each) {
            if (is_dir($each)) {
                $size += $this->getDirectorySize($each);
            } else {
                $size += filesize($each);
            }
        }
        return $size;
    }
}
