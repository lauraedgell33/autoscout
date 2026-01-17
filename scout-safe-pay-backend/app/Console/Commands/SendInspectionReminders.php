<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use App\Notifications\InspectionReminder;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendInspectionReminders extends Command
{
    protected $signature = 'inspections:send-reminders';

    protected $description = 'Send inspection period reminders to buyers';

    public function handle()
    {
        $this->info('Checking for inspection period reminders...');
        
        $now = Carbon::now();
        
        // Find transactions in inspection period
        $transactions = Transaction::with(['buyer', 'vehicle'])
            ->where('status', 'inspection_period')
            ->whereNotNull('inspection_deadline')
            ->get();
        
        $remindersSent = 0;
        
        foreach ($transactions as $transaction) {
            $deadline = Carbon::parse($transaction->inspection_deadline);
            $hoursRemaining = $now->diffInHours($deadline, false);
            
            // Send reminder at 24 hours, 12 hours, and 6 hours before deadline
            if (in_array(round($hoursRemaining), [24, 12, 6])) {
                $transaction->buyer->notify(new InspectionReminder(
                    $transaction,
                    (int) round($hoursRemaining)
                ));
                
                $remindersSent++;
                $this->info("Sent reminder for transaction {$transaction->reference_number} ({$hoursRemaining}h remaining)");
            }
            
            // Auto-release if deadline passed
            if ($hoursRemaining <= 0 && $transaction->status === 'inspection_period') {
                $transaction->update([
                    'status' => 'completed',
                    'completed_at' => now()
                ]);
                
                $this->warn("Auto-completed transaction {$transaction->reference_number} (deadline passed)");
            }
        }
        
        $this->info("Total reminders sent: {$remindersSent}");
        
        return Command::SUCCESS;
    }
}
