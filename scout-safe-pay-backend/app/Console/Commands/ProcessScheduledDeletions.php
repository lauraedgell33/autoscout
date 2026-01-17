<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessScheduledDeletions extends Command
{
    protected $signature = 'gdpr:process-deletions';
    protected $description = 'Process scheduled account deletions (GDPR compliance)';

    public function handle(): int
    {
        $this->info('Processing scheduled account deletions...');
        
        // Find users scheduled for deletion
        $usersToDelete = User::whereNotNull('deletion_scheduled_at')
            ->where('deletion_scheduled_at', '<=', now())
            ->get();
            
        if ($usersToDelete->isEmpty()) {
            $this->info('No accounts scheduled for deletion.');
            return 0;
        }
        
        $this->info("Found {$usersToDelete->count()} accounts to delete.");
        
        $deleted = 0;
        $failed = 0;
        
        foreach ($usersToDelete as $user) {
            try {
                $this->deleteUserData($user);
                $deleted++;
                $this->info("✓ Deleted account: {$user->email} (ID: {$user->id})");
            } catch (\Exception $e) {
                $failed++;
                $this->error("✗ Failed to delete {$user->email}: {$e->getMessage()}");
                Log::error('GDPR deletion failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
        
        $this->info("\nDeletion complete:");
        $this->info("  Deleted: {$deleted}");
        $this->info("  Failed: {$failed}");
        
        return $failed > 0 ? 1 : 0;
    }
    
    private function deleteUserData(User $user): void
    {
        DB::transaction(function () use ($user) {
            // 1. Export final data snapshot (7-year retention for legal compliance)
            $this->createFinalSnapshot($user);
            
            // 2. Anonymize completed transactions (retain for accounting)
            $this->anonymizeTransactions($user);
            
            // 3. Delete user-uploaded files
            $this->deleteUserFiles($user);
            
            // 4. Delete notifications
            $user->notifications()->delete();
            
            // 5. Anonymize reviews
            DB::table('reviews')
                ->where('user_id', $user->id)
                ->update([
                    'user_name' => 'Deleted User',
                    'reviewer_id' => null,
                ]);
            
            // 6. Delete messages
            DB::table('messages')->where('sender_id', $user->id)->delete();
            
            // 7. Delete user vehicles
            $user->vehicles()->delete();
            
            // 8. Delete KYC documents
            if ($user->id_document_path) {
                Storage::delete($user->id_document_path);
            }
            if ($user->proof_of_address_path) {
                Storage::delete($user->proof_of_address_path);
            }
            
            // 9. Finally, delete the user account
            $user->delete();
            
            Log::info('GDPR account deletion completed', [
                'user_id' => $user->id,
                'email' => $user->email,
                'deletion_date' => now()->toIso8601String(),
            ]);
        });
    }
    
    private function createFinalSnapshot(User $user): void
    {
        // Export minimal data for legal retention (7 years)
        $snapshot = [
            'user_id' => $user->id,
            'email_hash' => hash('sha256', $user->email), // Hashed for privacy
            'deletion_date' => now()->toIso8601String(),
            'transaction_count' => $user->buyerTransactions()->count() + $user->sellerTransactions()->count(),
            'total_spent' => $user->buyerTransactions()->sum('total_amount'),
            'total_earned' => $user->sellerTransactions()->sum('total_amount'),
        ];
        
        // Store in secure archival storage
        $filename = "deleted_user_{$user->id}_" . now()->format('Y-m-d') . '.json';
        Storage::put("gdpr/archives/{filename}", json_encode($snapshot));
    }
    
    private function anonymizeTransactions(User $user): void
    {
        // Anonymize but keep transaction records for accounting/legal
        $user->buyerTransactions()->update([
            'buyer_name' => 'Deleted User',
            'buyer_email' => 'deleted@example.com',
            'buyer_phone' => null,
            'buyer_address' => '[REDACTED]',
        ]);
        
        $user->sellerTransactions()->update([
            'seller_name' => 'Deleted User',
            'seller_email' => 'deleted@example.com',
            'seller_phone' => null,
        ]);
    }
    
    private function deleteUserFiles(User $user): void
    {
        // Delete all user-uploaded files
        $directories = [
            "users/{$user->id}",
            "kyc/{$user->id}",
            "vehicles/{$user->id}",
            "payments/{$user->id}",
        ];
        
        foreach ($directories as $dir) {
            if (Storage::exists($dir)) {
                Storage::deleteDirectory($dir);
            }
        }
    }
}
