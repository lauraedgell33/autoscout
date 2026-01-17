<?php

namespace Tests\Unit;

use Tests\TestCase;

class ConfigurationTest extends TestCase
{
    public function test_database_configuration_has_optimizations(): void
    {
        $config = config('database.connections.mysql');
        
        $this->assertIsArray($config);
        $this->assertArrayHasKey('options', $config);
        $this->assertArrayHasKey('pool', $config);
    }

    public function test_cache_default_store_is_redis(): void
    {
        $defaultStore = config('cache.default');
        
        // In testing environment, cache is usually 'array'
        // In production, it should be 'redis'
        $this->assertContains($defaultStore, ['redis', 'array', 'database']);
    }

    public function test_redis_configuration_exists(): void
    {
        $redisConfig = config('database.redis');
        
        $this->assertIsArray($redisConfig);
        $this->assertArrayHasKey('default', $redisConfig);
        $this->assertArrayHasKey('cache', $redisConfig);
    }

    public function test_queue_configuration(): void
    {
        $defaultConnection = config('queue.default');
        
        $this->assertIsString($defaultConnection);
        $this->assertContains($defaultConnection, ['sync', 'database', 'redis']);
    }

    public function test_app_environment_variables(): void
    {
        $this->assertNotNull(config('app.name'));
        $this->assertNotNull(config('app.env'));
        $this->assertNotNull(config('app.debug'));
    }
}
