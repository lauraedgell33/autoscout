<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\CookieService;

class RefreshCookiePreferences extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cookies:refresh 
                            {--cleanup : Also cleanup expired preferences}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto-refresh cookie preferences that are expiring soon';

    /**
     * Execute the console command.
     */
    public function handle(CookieService $cookieService)
    {
        $this->info('Starting cookie preferences auto-refresh...');
        
        // Refresh expiring preferences
        $count = $cookieService->autoRefreshPreferences();
        $this->info("✓ Refreshed {$count} cookie preferences.");
        
        // Cleanup old expired preferences if option is set
        if ($this->option('cleanup')) {
            $this->info('Cleaning up expired preferences...');
            $cleaned = $cookieService->cleanupExpired();
            $this->info("✓ Cleaned up {$cleaned} expired preferences.");
        }
        
        // Show statistics
        $stats = $cookieService->getStatistics();
        $this->newLine();
        $this->info('Statistics:');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Preferences', $stats['total']],
                ['Active', $stats['active']],
                ['Expired', $stats['expired']],
                ['Needs Refresh', $stats['needs_refresh']],
                ['Functional Accepted', $stats['acceptance_rates']['functional']],
                ['Analytics Accepted', $stats['acceptance_rates']['analytics']],
                ['Marketing Accepted', $stats['acceptance_rates']['marketing']],
            ]
        );
        
        return Command::SUCCESS;
    }
}
