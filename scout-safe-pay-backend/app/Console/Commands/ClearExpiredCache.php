<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearExpiredCache extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cache:clear-expired
                            {--tags=* : Cache tags to clear}
                            {--pattern= : Redis key pattern to match}';

    /**
     * The console command description.
     */
    protected $description = 'Clear expired cache entries';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Clearing expired cache entries...');
        
        if ($pattern = $this->option('pattern')) {
            $this->clearByPattern($pattern);
        }
        
        if ($tags = $this->option('tags')) {
            $this->clearByTags($tags);
        }
        
        if (!$pattern && empty($tags)) {
            // Clear all expired entries
            Cache::flush();
            $this->info('All cache cleared!');
        }
        
        $this->info('Cache cleanup completed!');
        
        return Command::SUCCESS;
    }
    
    /**
     * Clear cache by pattern
     */
    protected function clearByPattern(string $pattern): void
    {
        $this->info("Clearing cache with pattern: {$pattern}");
        
        try {
            $redis = Cache::getRedis();
            $keys = $redis->keys($pattern);
            
            if (empty($keys)) {
                $this->info('No keys found matching the pattern.');
                return;
            }
            
            $deleted = $redis->del($keys);
            $this->info("Deleted {$deleted} cache entries.");
        } catch (\Exception $e) {
            $this->error("Error clearing cache: {$e->getMessage()}");
        }
    }
    
    /**
     * Clear cache by tags
     */
    protected function clearByTags(array $tags): void
    {
        $this->info('Clearing cache by tags: ' . implode(', ', $tags));
        
        try {
            Cache::tags($tags)->flush();
            $this->info('Tagged cache entries cleared!');
        } catch (\Exception $e) {
            $this->error("Error clearing tagged cache: {$e->getMessage()}");
        }
    }
}
