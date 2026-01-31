<?php

namespace App\Filament\Admin\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class SystemHealth extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-server-stack';

    protected static ?string $navigationLabel = 'System Health';

    protected static ?string $title = 'System Health';

    protected static ?string $slug = 'system-health';

    public function getView(): string
    {
        return 'filament.admin.pages.system-health';
    }

    public static function getNavigationGroup(): ?string
    {
        return 'System';
    }

    public static function getNavigationSort(): ?int
    {
        return 95;
    }

    public function getViewData(): array
    {
        return [
            'checks' => $this->runHealthChecks(),
            'systemInfo' => $this->getSystemInfo(),
            'databaseStats' => $this->getDatabaseStats(),
        ];
    }

    protected function runHealthChecks(): array
    {
        $checks = [];

        // Database check
        try {
            DB::connection()->getPdo();
            $checks['database'] = [
                'name' => 'Database',
                'status' => 'ok',
                'message' => 'Connected to ' . config('database.default'),
                'icon' => 'heroicon-o-circle-stack',
            ];
        } catch (\Exception $e) {
            $checks['database'] = [
                'name' => 'Database',
                'status' => 'error',
                'message' => 'Connection failed: ' . $e->getMessage(),
                'icon' => 'heroicon-o-circle-stack',
            ];
        }

        // Cache check
        try {
            Cache::put('health_check', true, 10);
            $cacheWorking = Cache::get('health_check') === true;
            Cache::forget('health_check');
            
            $checks['cache'] = [
                'name' => 'Cache',
                'status' => $cacheWorking ? 'ok' : 'warning',
                'message' => $cacheWorking ? 'Cache driver: ' . config('cache.default') : 'Cache not responding correctly',
                'icon' => 'heroicon-o-bolt',
            ];
        } catch (\Exception $e) {
            $checks['cache'] = [
                'name' => 'Cache',
                'status' => 'error',
                'message' => 'Cache error: ' . $e->getMessage(),
                'icon' => 'heroicon-o-bolt',
            ];
        }

        // Storage check
        try {
            $disk = Storage::disk('local');
            $testFile = 'health_check_' . time() . '.txt';
            $disk->put($testFile, 'test');
            $exists = $disk->exists($testFile);
            $disk->delete($testFile);
            
            $checks['storage'] = [
                'name' => 'Storage',
                'status' => $exists ? 'ok' : 'warning',
                'message' => $exists ? 'Local storage is writable' : 'Storage write test failed',
                'icon' => 'heroicon-o-folder',
            ];
        } catch (\Exception $e) {
            $checks['storage'] = [
                'name' => 'Storage',
                'status' => 'error',
                'message' => 'Storage error: ' . $e->getMessage(),
                'icon' => 'heroicon-o-folder',
            ];
        }

        // Queue check
        try {
            $queueConnection = config('queue.default');
            $checks['queue'] = [
                'name' => 'Queue',
                'status' => 'ok',
                'message' => 'Queue driver: ' . $queueConnection,
                'icon' => 'heroicon-o-queue-list',
            ];
        } catch (\Exception $e) {
            $checks['queue'] = [
                'name' => 'Queue',
                'status' => 'warning',
                'message' => 'Queue check failed: ' . $e->getMessage(),
                'icon' => 'heroicon-o-queue-list',
            ];
        }

        // Mail configuration check
        $mailDriver = config('mail.default');
        $checks['mail'] = [
            'name' => 'Mail',
            'status' => $mailDriver !== 'log' ? 'ok' : 'warning',
            'message' => 'Mail driver: ' . $mailDriver,
            'icon' => 'heroicon-o-envelope',
        ];

        // App environment
        $isProduction = app()->environment('production');
        $debugMode = config('app.debug');
        $checks['environment'] = [
            'name' => 'Environment',
            'status' => ($isProduction && !$debugMode) || !$isProduction ? 'ok' : 'warning',
            'message' => 'Environment: ' . app()->environment() . ($debugMode ? ' (Debug ON)' : ''),
            'icon' => 'heroicon-o-cog-6-tooth',
        ];

        // SSL/HTTPS check
        $isSecure = request()->secure() || config('app.env') === 'local';
        $checks['ssl'] = [
            'name' => 'SSL/HTTPS',
            'status' => $isSecure ? 'ok' : 'warning',
            'message' => $isSecure ? 'Connection is secure' : 'Running without HTTPS',
            'icon' => 'heroicon-o-lock-closed',
        ];

        return $checks;
    }

    protected function getSystemInfo(): array
    {
        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'timezone' => config('app.timezone'),
            'locale' => config('app.locale'),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time') . 's',
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'opcache_enabled' => function_exists('opcache_get_status') && opcache_get_status() ? 'Yes' : 'No',
        ];
    }

    protected function getDatabaseStats(): array
    {
        try {
            $driver = config('database.default');
            $stats = [];

            if ($driver === 'sqlite') {
                $dbPath = config('database.connections.sqlite.database');
                if (file_exists($dbPath)) {
                    $stats['size'] = $this->formatBytes(filesize($dbPath));
                }
                $stats['driver'] = 'SQLite';
            } else {
                $stats['driver'] = ucfirst($driver);
            }

            // Count records in main tables
            $stats['tables'] = [
                'users' => DB::table('users')->count(),
                'vehicles' => DB::table('vehicles')->count(),
                'transactions' => DB::table('transactions')->count(),
                'payments' => DB::table('payments')->count(),
                'dealers' => DB::table('dealers')->count(),
            ];

            return $stats;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    protected function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        return round($bytes / pow(1024, $pow), $precision) . ' ' . $units[$pow];
    }
}
