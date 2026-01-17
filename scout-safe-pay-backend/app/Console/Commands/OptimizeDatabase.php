<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OptimizeDatabase extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:optimize 
                            {--analyze : Run ANALYZE TABLE on all tables}
                            {--check : Run CHECK TABLE on all tables}
                            {--optimize : Run OPTIMIZE TABLE on all tables}';

    /**
     * The console command description.
     */
    protected $description = 'Optimize database tables for better performance';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting database optimization...');
        
        $connection = DB::connection();
        $tables = $this->getTables($connection);
        
        if ($this->option('analyze')) {
            $this->analyzeTables($connection, $tables);
        }
        
        if ($this->option('check')) {
            $this->checkTables($connection, $tables);
        }
        
        if ($this->option('optimize')) {
            $this->optimizeTables($connection, $tables);
        }
        
        if (!$this->option('analyze') && !$this->option('check') && !$this->option('optimize')) {
            $this->info('Please specify an option: --analyze, --check, or --optimize');
        }
        
        $this->info('Database optimization completed!');
        
        return Command::SUCCESS;
    }
    
    /**
     * Get all tables from the database
     */
    protected function getTables($connection): array
    {
        $database = $connection->getDatabaseName();
        $tables = $connection->select("SHOW TABLES");
        
        $tableKey = "Tables_in_{$database}";
        
        return array_map(function($table) use ($tableKey) {
            return $table->$tableKey;
        }, $tables);
    }
    
    /**
     * Analyze tables
     */
    protected function analyzeTables($connection, array $tables): void
    {
        $this->info('Analyzing tables...');
        
        foreach ($tables as $table) {
            $this->line("  - Analyzing {$table}");
            $connection->statement("ANALYZE TABLE {$table}");
        }
    }
    
    /**
     * Check tables
     */
    protected function checkTables($connection, array $tables): void
    {
        $this->info('Checking tables...');
        
        foreach ($tables as $table) {
            $this->line("  - Checking {$table}");
            $result = $connection->select("CHECK TABLE {$table}");
            
            foreach ($result as $row) {
                if ($row->Msg_text !== 'OK') {
                    $this->warn("    Warning: {$row->Msg_text}");
                }
            }
        }
    }
    
    /**
     * Optimize tables
     */
    protected function optimizeTables($connection, array $tables): void
    {
        $this->info('Optimizing tables...');
        
        foreach ($tables as $table) {
            $this->line("  - Optimizing {$table}");
            $connection->statement("OPTIMIZE TABLE {$table}");
        }
    }
}
