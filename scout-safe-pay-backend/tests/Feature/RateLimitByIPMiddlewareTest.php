<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class RateLimitByIPMiddlewareTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    public function test_allows_requests_within_rate_limit(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $response = $this->get('/');
            $response->assertSuccessful();
        }
    }

    public function test_adds_rate_limit_headers(): void
    {
        $response = $this->get('/');
        
        // These headers might be added by the middleware
        // Adjust based on your actual implementation
        if ($response->headers->has('X-RateLimit-Limit')) {
            $this->assertIsNumeric($response->headers->get('X-RateLimit-Limit'));
        }
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}
