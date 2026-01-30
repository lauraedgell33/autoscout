<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\CookiePreference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CookieConsentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test cookie consent show endpoint returns cookie in response
     */
    public function test_show_preferences_returns_cookie(): void
    {
        $response = $this->getJson('/api/cookies/preferences');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'preferences' => [
                        'essential',
                        'functional',
                        'analytics',
                        'marketing',
                    ],
                    'accepted_at',
                    'expires_at',
                    'needs_refresh',
                    'is_expired',
                ],
            ])
            ->assertJson([
                'success' => true,
            ]);

        // Verify cookie is set in response
        $response->assertCookie('cookie_consent_id');
    }

    /**
     * Test update preferences returns cookie in response
     */
    public function test_update_preferences_returns_cookie(): void
    {
        $response = $this->postJson('/api/cookies/preferences', [
            'essential' => true,
            'functional' => true,
            'analytics' => false,
            'marketing' => false,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'preferences',
                    'expires_at',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Cookie preferences updated successfully',
            ]);

        // Verify cookie is set in response
        $response->assertCookie('cookie_consent_id');
    }

    /**
     * Test accept all returns cookie in response
     */
    public function test_accept_all_returns_cookie(): void
    {
        $response = $this->postJson('/api/cookies/accept-all');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'preferences',
                    'expires_at',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'All cookies accepted',
                'data' => [
                    'preferences' => [
                        'essential' => true,
                        'functional' => true,
                        'analytics' => true,
                        'marketing' => true,
                    ],
                ],
            ]);

        // Verify cookie is set in response
        $response->assertCookie('cookie_consent_id');
    }

    /**
     * Test accept essential returns cookie in response
     */
    public function test_accept_essential_returns_cookie(): void
    {
        $response = $this->postJson('/api/cookies/accept-essential');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'preferences',
                    'expires_at',
                ],
            ])
            ->assertJson([
                'success' => true,
                'message' => 'Only essential cookies accepted',
                'data' => [
                    'preferences' => [
                        'essential' => true,
                        'functional' => false,
                        'analytics' => false,
                        'marketing' => false,
                    ],
                ],
            ]);

        // Verify cookie is set in response
        $response->assertCookie('cookie_consent_id');
    }

    /**
     * Test cookie preferences persist across requests
     */
    public function test_cookie_preferences_persist(): void
    {
        // First request - accept all
        $response1 = $this->postJson('/api/cookies/accept-all');
        $response1->assertStatus(200);
        
        // Extract cookie from first response
        $cookies = $response1->headers->getCookies();
        $cookieValue = null;
        foreach ($cookies as $cookie) {
            if ($cookie->getName() === 'cookie_consent_id') {
                $cookieValue = $cookie->getValue();
                break;
            }
        }

        $this->assertNotNull($cookieValue, 'Cookie consent ID should be set');

        // Second request with cookie - try using server variables
        $response2 = $this->call(
            'GET',
            '/api/cookies/preferences',
            [],
            ['cookie_consent_id' => $cookieValue], // cookies parameter
            [],
            $this->transformHeadersToServerVars([])
        );

        $response2->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'preferences' => [
                        'essential' => true,
                        'functional' => true,
                        'analytics' => true,
                        'marketing' => true,
                    ],
                ],
            ]);
    }
}
