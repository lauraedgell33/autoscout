<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CookieService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CookieConsentController extends Controller
{
    protected $cookieService;

    public function __construct(CookieService $cookieService)
    {
        $this->cookieService = $cookieService;
    }

    /**
     * Get current cookie preferences
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $preference = $this->cookieService->getOrCreatePreference($request);

            $response = response()->json([
                'success' => true,
                'data' => [
                    'preferences' => [
                        'essential' => $preference->essential,
                        'functional' => $preference->functional,
                        'analytics' => $preference->analytics,
                        'marketing' => $preference->marketing,
                    ],
                    'accepted_at' => $preference->accepted_at?->toISOString(),
                    'expires_at' => $preference->expires_at?->toISOString(),
                    'needs_refresh' => $preference->needsRefresh(),
                    'is_expired' => $preference->isExpired(),
                ],
            ]);

            // Set cookie ID in response for anonymous users
            if (!$request->cookie('cookie_consent_id')) {
                $response->cookie(
                    'cookie_consent_id',
                    $preference->session_id,
                    525600, // 1 year
                    '/',
                    null,
                    false, // not HTTPS only for development
                    true,  // HttpOnly
                    false, // not raw
                    'lax'  // SameSite
                );
            }

            return $response;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cookie preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update cookie preferences
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'essential' => 'sometimes|boolean',
                'functional' => 'sometimes|boolean',
                'analytics' => 'sometimes|boolean',
                'marketing' => 'sometimes|boolean',
            ]);

            $preference = $this->cookieService->updatePreferences($request, $validated);

            $response = response()->json([
                'success' => true,
                'message' => 'Cookie preferences updated successfully',
                'data' => [
                    'preferences' => [
                        'essential' => $preference->essential,
                        'functional' => $preference->functional,
                        'analytics' => $preference->analytics,
                        'marketing' => $preference->marketing,
                    ],
                    'expires_at' => $preference->expires_at?->toISOString(),
                ],
            ]);

            // Set cookie ID in response
            if (!$request->cookie('cookie_consent_id')) {
                $response->cookie('cookie_consent_id', $preference->session_id, 525600, '/', null, false, true, false, 'lax');
            }

            return $response;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cookie preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Accept all cookies
     */
    public function acceptAll(Request $request): JsonResponse
    {
        try {
            $preference = $this->cookieService->acceptAll($request);

            $response = response()->json([
                'success' => true,
                'message' => 'All cookies accepted',
                'data' => [
                    'preferences' => [
                        'essential' => true,
                        'functional' => true,
                        'analytics' => true,
                        'marketing' => true,
                    ],
                    'expires_at' => $preference->expires_at?->toISOString(),
                ],
            ]);

            // Set cookie ID in response
            if (!$request->cookie('cookie_consent_id')) {
                $response->cookie('cookie_consent_id', $preference->session_id, 525600, '/', null, false, true, false, 'lax');
            }

            return $response;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept all cookies',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Accept only essential cookies
     */
    public function acceptEssential(Request $request): JsonResponse
    {
        try {
            $preference = $this->cookieService->acceptEssentialOnly($request);

            $response = response()->json([
                'success' => true,
                'message' => 'Only essential cookies accepted',
                'data' => [
                    'preferences' => [
                        'essential' => true,
                        'functional' => false,
                        'analytics' => false,
                        'marketing' => false,
                    ],
                    'expires_at' => $preference->expires_at?->toISOString(),
                ],
            ]);

            // Set cookie ID in response
            if (!$request->cookie('cookie_consent_id')) {
                $response->cookie('cookie_consent_id', $preference->session_id, 525600, '/', null, false, true, false, 'lax');
            }

            return $response;
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to accept essential cookies',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get cookie statistics (admin only)
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $stats = $this->cookieService->getStatistics();

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
