<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Available locales
        $availableLocales = ['en', 'de', 'es', 'it', 'ro', 'fr'];
        
        // Try to get locale from different sources (priority order)
        $locale = $request->header('Accept-Language')
            ?? $request->get('locale')
            ?? $request->get('lang')
            ?? session('locale')
            ?? config('app.locale');
        
        // Extract primary language code (e.g., 'en-US' -> 'en')
        $locale = strtolower(substr($locale, 0, 2));
        
        // Validate locale
        if (!in_array($locale, $availableLocales)) {
            $locale = config('app.locale');
        }
        
        // Set the application locale
        App::setLocale($locale);
        
        // Store in session for subsequent requests
        session(['locale' => $locale]);
        
        // Add locale to response headers
        $response = $next($request);
        $response->headers->set('Content-Language', $locale);
        
        return $response;
    }
}
