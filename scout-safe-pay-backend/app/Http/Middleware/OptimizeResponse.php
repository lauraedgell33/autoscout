<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OptimizeResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Enable compression headers (server will handle actual compression)
        $response->headers->set('Vary', 'Accept-Encoding');
        
        // Add cache control for API responses
        if ($request->is('api/*')) {
            if ($request->method() === 'GET') {
                // Cache GET requests for 60 seconds
                $response->headers->set('Cache-Control', 'public, max-age=60, s-maxage=60');
            } else {
                // Don't cache other methods
                $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate');
            }
        }

        // Add CORS preflight cache
        if ($request->method() === 'OPTIONS') {
            $response->headers->set('Access-Control-Max-Age', '86400');
        }

        return $response;
    }
}
