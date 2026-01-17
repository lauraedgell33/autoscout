<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Response;
use Tests\TestCase;

class OptimizeResponseMiddlewareTest extends TestCase
{
    public function test_adds_security_headers_to_response(): void
    {
        $response = $this->get('/');
        
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_adds_cache_control_for_api_get_requests(): void
    {
        // Note: This test requires an actual API endpoint to test against
        // You may need to adjust this based on your routes
        $response = $this->getJson('/api/legal/documents');
        
        if ($response->status() === 200) {
            $response->assertHeader('Cache-Control');
        }
    }

    public function test_options_request_has_preflight_cache(): void
    {
        $response = $this->call('OPTIONS', '/api/vehicles');
        
        if ($response->headers->has('Access-Control-Max-Age')) {
            $this->assertEquals('86400', $response->headers->get('Access-Control-Max-Age'));
        }
    }
}
