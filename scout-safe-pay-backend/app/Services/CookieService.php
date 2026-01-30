<?php

namespace App\Services;

use App\Models\CookiePreference;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CookieService
{
    /**
     * Get or create cookie preference for current user/session
     */
    public function getOrCreatePreference(Request $request): CookiePreference
    {
        $userId = Auth::id();
        
        // Use cookie ID instead of session ID for API routes
        $sessionId = $request->cookie('cookie_consent_id');
        
        // Generate new ID if not present
        if (!$sessionId) {
            $sessionId = Str::uuid()->toString();
        }

        $preference = CookiePreference::where(function($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->active()->first();

        if (!$preference) {
            $preference = CookiePreference::create([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'essential' => true,
                'functional' => false,
                'analytics' => false,
                'marketing' => false,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'expires_at' => now()->addYear(),
            ]);
        }

        return $preference;
    }

    /**
     * Update cookie preferences
     */
    public function updatePreferences(Request $request, array $preferences): CookiePreference
    {
        $preference = $this->getOrCreatePreference($request);

        $preference->update([
            'essential' => $preferences['essential'] ?? true,
            'functional' => $preferences['functional'] ?? false,
            'analytics' => $preferences['analytics'] ?? false,
            'marketing' => $preferences['marketing'] ?? false,
            'accepted_at' => now(),
            'expires_at' => now()->addYear(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $preference;
    }

    /**
     * Accept all cookies
     */
    public function acceptAll(Request $request): CookiePreference
    {
        return $this->updatePreferences($request, [
            'essential' => true,
            'functional' => true,
            'analytics' => true,
            'marketing' => true,
        ]);
    }

    /**
     * Accept only essential cookies
     */
    public function acceptEssentialOnly(Request $request): CookiePreference
    {
        return $this->updatePreferences($request, [
            'essential' => true,
            'functional' => false,
            'analytics' => false,
            'marketing' => false,
        ]);
    }

    /**
     * Auto-refresh expired or expiring preferences
     */
    public function autoRefreshPreferences(): int
    {
        $preferences = CookiePreference::query()->needsRefresh()->get();
        
        foreach ($preferences as $preference) {
            $preference->refresh();
        }

        return $preferences->count();
    }

    /**
     * Clean up expired preferences (older than 1 year)
     */
    public function cleanupExpired(): int
    {
        return CookiePreference::where('expires_at', '<', now()->subYear())->delete();
    }

    /**
     * Get statistics about cookie preferences
     */
    public function getStatistics(): array
    {
        $total = CookiePreference::count();
        $active = CookiePreference::query()->active()->count();
        $expired = CookiePreference::query()->expired()->count();
        $needsRefresh = CookiePreference::query()->needsRefresh()->count();

        return [
            'total' => $total,
            'active' => $active,
            'expired' => $expired,
            'needs_refresh' => $needsRefresh,
            'acceptance_rates' => [
                'functional' => CookiePreference::where('functional', true)->count(),
                'analytics' => CookiePreference::where('analytics', true)->count(),
                'marketing' => CookiePreference::where('marketing', true)->count(),
            ],
        ];
    }
}
