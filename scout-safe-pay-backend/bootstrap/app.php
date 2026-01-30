<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectGuestsTo(function ($request) {
            if ($request->is('api/*')) {
                abort(401, 'Unauthenticated');
            }
            if ($request->is('admin*')) {
                return '/admin/login';
            }
            return '/login';
        });
        
        // Add custom middleware
        $middleware->append(\App\Http\Middleware\OptimizeResponse::class);
        $middleware->append(\App\Http\Middleware\SetLocale::class);
        
        // Apply cookie middleware only to web routes (not API)
        $middleware->web(append: [
            \App\Http\Middleware\AutoRefreshCookies::class,
        ]);
        
        // Alias for rate limiting and role checking
        $middleware->alias([
            'rate.limit.ip' => \App\Http\Middleware\RateLimitByIP::class,
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        // Send inspection reminders every hour
        $schedule->command('inspections:send-reminders')->hourly();
        
        // Refresh cookie preferences daily at 2 AM
        $schedule->command('cookies:refresh --cleanup')->dailyAt('02:00');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
