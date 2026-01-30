<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * ErrorLogController
 * 
 * FREE error tracking alternative to Sentry
 * Receives frontend errors and security violations for centralized logging
 */
class ErrorLogController extends Controller
{
    /**
     * Log frontend error
     * 
     * POST /api/errors
     */
    public function log(Request $request)
    {
        $errorData = [
            'message' => $request->input('message'),
            'error' => $request->input('error'),
            'metadata' => $request->input('metadata'),
            'url' => $request->input('url'),
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
            'timestamp' => $request->input('timestamp', now()->toISOString()),
            'user_id' => auth()->id() ?? null,
        ];

        Log::error('Frontend Error', $errorData);

        return response()->json(['status' => 'logged'], 200);
    }

    /**
     * Log security violation (CSP, etc.)
     * 
     * POST /api/security/violations
     */
    public function logViolation(Request $request)
    {
        $violationData = [
            'type' => 'CSP_VIOLATION',
            'documentUri' => $request->input('documentUri'),
            'violatedDirective' => $request->input('violatedDirective'),
            'effectiveDirective' => $request->input('effectiveDirective'),
            'originalPolicy' => $request->input('originalPolicy'),
            'blockedURI' => $request->input('blockedURI'),
            'statusCode' => $request->input('statusCode'),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'timestamp' => $request->input('timestamp', now()->toISOString()),
        ];

        Log::warning('Security Violation', $violationData);

        return response()->json(['status' => 'logged'], 200);
    }

    /**
     * Get recent errors (admin only)
     * 
     * GET /api/admin/errors
     */
    public function index(Request $request)
    {
        $logFile = storage_path('logs/laravel.log');
        
        if (!file_exists($logFile)) {
            return response()->json([
                'errors' => [],
                'total' => 0,
                'message' => 'No log file found'
            ], 200);
        }

        // Read last N lines from log file
        $lines = $this->tailFile($logFile, $request->input('lines', 100));
        
        // Filter only ERROR lines
        $errors = array_filter($lines, function($line) {
            return str_contains($line, 'ERROR') || str_contains($line, 'CRITICAL');
        });

        // Parse errors
        $parsedErrors = array_map(function($line) {
            return [
                'raw' => $line,
                'timestamp' => $this->extractTimestamp($line),
                'message' => $this->extractMessage($line),
            ];
        }, array_values($errors));

        return response()->json([
            'errors' => $parsedErrors,
            'total' => count($parsedErrors),
            'source_file' => 'laravel.log',
        ], 200);
    }

    /**
     * Get specific error details (admin only)
     * 
     * GET /api/admin/errors/{index}
     */
    public function show(Request $request, int $index)
    {
        $logFile = storage_path('logs/laravel.log');
        
        if (!file_exists($logFile)) {
            return response()->json(['message' => 'Log file not found'], 404);
        }

        $lines = $this->tailFile($logFile, 1000);
        $errors = array_filter($lines, function($line) {
            return str_contains($line, 'ERROR');
        });

        $errors = array_values($errors);
        
        if (!isset($errors[$index])) {
            return response()->json(['message' => 'Error not found'], 404);
        }

        return response()->json([
            'error' => [
                'index' => $index,
                'raw' => $errors[$index],
                'timestamp' => $this->extractTimestamp($errors[$index]),
                'message' => $this->extractMessage($errors[$index]),
            ],
        ], 200);
    }

    /**
     * Get error statistics (admin only)
     * 
     * GET /api/admin/errors/statistics
     */
    public function statistics()
    {
        $logFile = storage_path('logs/laravel.log');
        
        if (!file_exists($logFile)) {
            return response()->json([
                'total_errors' => 0,
                'errors_today' => 0,
                'errors_this_week' => 0,
            ], 200);
        }

        $lines = $this->tailFile($logFile, 10000);
        $errors = array_filter($lines, function($line) {
            return str_contains($line, 'ERROR');
        });

        $today = now()->format('Y-m-d');
        $weekAgo = now()->subDays(7)->format('Y-m-d');

        $errorsToday = count(array_filter($errors, function($line) use ($today) {
            return str_contains($line, $today);
        }));

        $errorsThisWeek = count(array_filter($errors, function($line) use ($weekAgo) {
            $timestamp = $this->extractTimestamp($line);
            return $timestamp && $timestamp >= $weekAgo;
        }));

        return response()->json([
            'total_errors' => count($errors),
            'errors_today' => $errorsToday,
            'errors_this_week' => $errorsThisWeek,
            'log_file_size' => filesize($logFile),
        ], 200);
    }

    /**
     * Tail file (read last N lines)
     */
    private function tailFile(string $filepath, int $lines = 100): array
    {
        $file = new \SplFileObject($filepath, 'r');
        $file->seek(PHP_INT_MAX);
        $lastLine = $file->key();
        $offset = max(0, $lastLine - $lines);
        
        $result = [];
        $file->seek($offset);
        
        while (!$file->eof()) {
            $result[] = rtrim($file->fgets());
        }
        
        return array_filter($result);
    }

    /**
     * Extract timestamp from log line
     */
    private function extractTimestamp(string $line): ?string
    {
        preg_match('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $matches);
        return $matches[1] ?? null;
    }

    /**
     * Extract error message from log line
     */
    private function extractMessage(string $line): string
    {
        // Remove timestamp and log level
        $message = preg_replace('/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/', '', $line);
        $message = preg_replace('/^.*?ERROR:/', '', $message);
        return trim($message);
    }
}
