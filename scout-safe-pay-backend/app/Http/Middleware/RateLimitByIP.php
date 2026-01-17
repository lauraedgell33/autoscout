<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RateLimitByIP
{
    /**
     * Handle an incoming request with rate limiting
     */
    public function handle(Request $request, Closure $next, int $maxAttempts = 60, int $decayMinutes = 1): Response
    {
        $key = $this->resolveRequestSignature($request);
        
        $cache = app('cache');
        $attempts = $cache->get($key, 0);
        
        if ($attempts >= $maxAttempts) {
            Log::warning('Rate limit exceeded', [
                'ip' => $request->ip(),
                'path' => $request->path(),
                'attempts' => $attempts
            ]);
            
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
                'retry_after' => $decayMinutes * 60
            ], 429);
        }
        
        $cache->put($key, $attempts + 1, now()->addMinutes($decayMinutes));
        
        $response = $next($request);
        
        // Add rate limit headers
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => max(0, $maxAttempts - $attempts - 1),
        ]);
        
        return $response;
    }
    
    /**
     * Resolve request signature
     */
    protected function resolveRequestSignature(Request $request): string
    {
        return sha1(
            $request->method() .
            '|' . $request->path() .
            '|' . $request->ip()
        );
    }
}
