<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\CookieService;
use Symfony\Component\HttpFoundation\Response;

class AutoRefreshCookies
{
    protected $cookieService;

    public function __construct(CookieService $cookieService)
    {
        $this->cookieService = $cookieService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Get current preference and auto-refresh if needed
            $preference = $this->cookieService->getOrCreatePreference($request);
            $preference->autoRefresh();

            // Store in request for later use
            $request->merge(['cookie_preference' => $preference]);
        } catch (\Exception $e) {
            // Log error but don't block the request
            logger()->error('Cookie auto-refresh failed: ' . $e->getMessage());
        }

        return $next($request);
    }
}
