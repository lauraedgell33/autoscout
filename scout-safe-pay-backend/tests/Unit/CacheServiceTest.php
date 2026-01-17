<?php

namespace Tests\Unit;

use App\Services\CacheService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class CacheServiceTest extends TestCase
{
    protected CacheService $cacheService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cacheService = new CacheService();
        Cache::flush();
    }

    public function test_can_cache_and_retrieve_data(): void
    {
        $key = 'test-key';
        $value = 'test-value';
        
        $result = $this->cacheService->remember($key, 60, function() use ($value) {
            return $value;
        });
        
        $this->assertEquals($value, $result);
    }

    public function test_can_forget_cache_key(): void
    {
        $key = 'test-key';
        
        Cache::put($key, 'test-value', 60);
        $this->assertTrue(Cache::has($key));
        
        $this->cacheService->forget($key);
        $this->assertFalse(Cache::has($key));
    }

    public function test_generates_correct_vehicle_list_key(): void
    {
        $filters = ['make' => 'BMW', 'year' => 2023];
        $key = $this->cacheService->vehiclesListKey($filters);
        
        $this->assertStringStartsWith('vehicles:list:', $key);
        $this->assertIsString($key);
    }

    public function test_generates_correct_vehicle_key(): void
    {
        $vehicleId = 123;
        $key = $this->cacheService->vehicleKey($vehicleId);
        
        $this->assertEquals("vehicle:{$vehicleId}", $key);
    }

    public function test_generates_correct_user_key(): void
    {
        $userId = 456;
        $key = $this->cacheService->userKey($userId);
        
        $this->assertEquals("user:{$userId}", $key);
    }

    public function test_generates_correct_transaction_key(): void
    {
        $transactionId = 789;
        $key = $this->cacheService->transactionKey($transactionId);
        
        $this->assertEquals("transaction:{$transactionId}", $key);
    }

    public function test_cache_keys_are_consistent(): void
    {
        $filters = ['make' => 'BMW', 'model' => 'X5'];
        $key1 = $this->cacheService->vehiclesListKey($filters);
        $key2 = $this->cacheService->vehiclesListKey($filters);
        
        $this->assertEquals($key1, $key2);
    }

    public function test_different_filters_generate_different_keys(): void
    {
        $filters1 = ['make' => 'BMW'];
        $filters2 = ['make' => 'Mercedes'];
        
        $key1 = $this->cacheService->vehiclesListKey($filters1);
        $key2 = $this->cacheService->vehiclesListKey($filters2);
        
        $this->assertNotEquals($key1, $key2);
    }

    public function test_remember_forever_caches_without_expiry(): void
    {
        $key = 'permanent-key';
        $value = 'permanent-value';
        
        $result = $this->cacheService->rememberForever($key, function() use ($value) {
            return $value;
        });
        
        $this->assertEquals($value, $result);
        $this->assertTrue(Cache::has($key));
    }

    protected function tearDown(): void
    {
        Cache::flush();
        parent::tearDown();
    }
}
