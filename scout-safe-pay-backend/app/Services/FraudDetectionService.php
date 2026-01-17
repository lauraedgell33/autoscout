<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class FraudDetectionService
{
    /**
     * Calculate comprehensive fraud risk score (0-100)
     */
    public static function calculateRiskScore(Transaction $transaction, Payment $payment): array
    {
        $factors = [];
        $score = 0;

        // User behavior analysis
        $userRisk = self::analyzeUserBehavior($transaction->buyer_id);
        $score += $userRisk['score'];
        $factors[] = $userRisk;

        // Transaction pattern analysis
        $transactionRisk = self::analyzeTransactionPattern($transaction);
        $score += $transactionRisk['score'];
        $factors[] = $transactionRisk;

        // Payment velocity check
        $velocityRisk = self::checkPaymentVelocity($transaction->buyer_id);
        $score += $velocityRisk['score'];
        $factors[] = $velocityRisk;

        // Amount anomaly detection
        $amountRisk = self::detectAmountAnomaly($transaction);
        $score += $amountRisk['score'];
        $factors[] = $amountRisk;

        // Device fingerprint analysis
        $deviceRisk = self::analyzeDeviceFingerprint($transaction->buyer_id);
        $score += $deviceRisk['score'];
        $factors[] = $deviceRisk;

        // Seller reputation check
        $sellerRisk = self::checkSellerReputation($transaction->seller_id);
        $score += $sellerRisk['score'];
        $factors[] = $sellerRisk;

        return [
            'risk_score' => min(100, $score),
            'risk_level' => self::getRiskLevel($score),
            'factors' => $factors,
            'recommendation' => self::getActionRecommendation($score),
            'requires_manual_review' => $score >= 60,
        ];
    }

    private static function analyzeUserBehavior(int $userId): array
    {
        $user = User::find($userId);
        $score = 0;
        $indicators = [];

        // New user (< 7 days)
        if ($user->created_at->gt(now()->subDays(7))) {
            $score += 15;
            $indicators[] = 'new_account';
        }

        // KYC not verified
        if ($user->kyc_status !== 'verified') {
            $score += 25;
            $indicators[] = 'kyc_not_verified';
        }

        // No previous successful transactions
        $successfulTransactions = Transaction::where('buyer_id', $userId)
            ->where('status', 'completed')
            ->count();

        if ($successfulTransactions === 0) {
            $score += 20;
            $indicators[] = 'first_transaction';
        }

        // Multiple failed transactions
        $failedTransactions = Transaction::where('buyer_id', $userId)
            ->whereIn('status', ['cancelled', 'refunded'])
            ->count();

        if ($failedTransactions > 2) {
            $score += 10 * min(3, $failedTransactions);
            $indicators[] = 'multiple_failed_transactions';
        }

        return [
            'category' => 'user_behavior',
            'score' => $score,
            'indicators' => $indicators,
        ];
    }

    private static function analyzeTransactionPattern(Transaction $transaction): array
    {
        $score = 0;
        $indicators = [];

        // High-value transaction (> €50k)
        if ($transaction->amount > 50000) {
            $score += 15;
            $indicators[] = 'high_value_transaction';
        }

        // Cross-border transaction
        $buyerCountry = $transaction->buyer->country ?? 'DE';
        $sellerCountry = $transaction->seller->country ?? 'DE';
        if ($buyerCountry !== $sellerCountry) {
            $score += 10;
            $indicators[] = 'cross_border';
        }

        // Unusual hour (2 AM - 5 AM)
        $hour = now()->hour;
        if ($hour >= 2 && $hour <= 5) {
            $score += 8;
            $indicators[] = 'unusual_hour';
        }

        // Vehicle age vs price anomaly
        if ($transaction->vehicle) {
            $vehicleAge = now()->year - $transaction->vehicle->year;
            if ($vehicleAge > 10 && $transaction->amount > 30000) {
                $score += 12;
                $indicators[] = 'price_age_mismatch';
            }
        }

        return [
            'category' => 'transaction_pattern',
            'score' => $score,
            'indicators' => $indicators,
        ];
    }

    private static function checkPaymentVelocity(int $userId): array
    {
        $score = 0;
        $indicators = [];

        // Multiple transactions in 24h
        $recentTransactions = Transaction::where('buyer_id', $userId)
            ->where('created_at', '>=', now()->subDay())
            ->count();

        if ($recentTransactions > 3) {
            $score += 25;
            $indicators[] = 'high_transaction_velocity';
        }

        // Multiple payments to same seller in 48h
        $recentPaymentsToSameSeller = Transaction::where('buyer_id', $userId)
            ->where('seller_id', Transaction::find($userId)->seller_id ?? 0)
            ->where('created_at', '>=', now()->subDays(2))
            ->count();

        if ($recentPaymentsToSameSeller > 1) {
            $score += 15;
            $indicators[] = 'repeated_seller_payments';
        }

        return [
            'category' => 'payment_velocity',
            'score' => $score,
            'indicators' => $indicators,
        ];
    }

    private static function detectAmountAnomaly(Transaction $transaction): array
    {
        $score = 0;
        $indicators = [];

        // Get average transaction amount for similar vehicles
        $avgPrice = DB::table('vehicles')
            ->where('make', $transaction->vehicle->make ?? '')
            ->where('year', '>=', ($transaction->vehicle->year ?? now()->year) - 2)
            ->avg('price');

        if ($avgPrice && $transaction->amount > $avgPrice * 1.5) {
            $score += 20;
            $indicators[] = 'price_above_market';
        }

        if ($avgPrice && $transaction->amount < $avgPrice * 0.5) {
            $score += 25;
            $indicators[] = 'price_below_market';
        }

        // Round number (potential red flag)
        if ($transaction->amount % 1000 === 0) {
            $score += 5;
            $indicators[] = 'round_amount';
        }

        return [
            'category' => 'amount_anomaly',
            'score' => $score,
            'indicators' => $indicators,
        ];
    }

    private static function analyzeDeviceFingerprint(int $userId): array
    {
        $score = 0;
        $indicators = [];

        // Check for multiple accounts from same IP (cached)
        $cacheKey = "device_fingerprint_{$userId}";
        $deviceData = Cache::get($cacheKey, []);

        if (isset($deviceData['multiple_accounts'])) {
            $score += 20;
            $indicators[] = 'shared_device';
        }

        if (isset($deviceData['vpn_detected'])) {
            $score += 15;
            $indicators[] = 'vpn_usage';
        }

        return [
            'category' => 'device_fingerprint',
            'score' => $score,
            'indicators' => $indicators,
        ];
    }

    private static function checkSellerReputation(int $sellerId): array
    {
        $score = 0;
        $indicators = [];

        $seller = User::find($sellerId);
        if (!$seller) {
            return ['category' => 'seller_reputation', 'score' => 0, 'indicators' => []];
        }

        // New seller
        if ($seller->created_at->gt(now()->subDays(30))) {
            $score += 10;
            $indicators[] = 'new_seller';
        }

        // High cancellation rate
        $totalSales = Transaction::where('seller_id', $sellerId)->count();
        $cancelledSales = Transaction::where('seller_id', $sellerId)
            ->where('status', 'cancelled')
            ->count();

        if ($totalSales > 5 && ($cancelledSales / $totalSales) > 0.3) {
            $score += 15;
            $indicators[] = 'high_cancellation_rate';
        }

        // Disputed transactions
        $disputes = DB::table('disputes')
            ->join('transactions', 'disputes.transaction_id', '=', 'transactions.id')
            ->where('transactions.seller_id', $sellerId)
            ->count();

        if ($disputes > 2) {
            $score += 12;
            $indicators[] = 'multiple_disputes';
        }

        return [
            'category' => 'seller_reputation',
            'score' => $score,
            'indicators' => $indicators,
        ];
    }

    private static function getRiskLevel(int $score): string
    {
        if ($score < 30) return 'low';
        if ($score < 60) return 'medium';
        if ($score < 80) return 'high';
        return 'critical';
    }

    private static function getActionRecommendation(int $score): string
    {
        if ($score < 30) return 'auto_approve';
        if ($score < 50) return 'standard_verification';
        if ($score < 70) return 'enhanced_verification';
        if ($score < 85) return 'manual_review_required';
        return 'block_transaction';
    }

    /**
     * Check if transaction should be blocked
     */
    public static function shouldBlockTransaction(Transaction $transaction): bool
    {
        // Blacklisted users
        if (self::isBlacklisted($transaction->buyer_id)) {
            return true;
        }

        // Stolen vehicle check
        if ($transaction->vehicle && self::isStolenVehicle($transaction->vehicle->vin)) {
            return true;
        }

        return false;
    }

    private static function isBlacklisted(int $userId): bool
    {
        return Cache::remember("user_blacklist_{$userId}", 3600, function () use ($userId) {
            return DB::table('user_blacklist')->where('user_id', $userId)->exists();
        });
    }

    private static function isStolenVehicle(?string $vin): bool
    {
        if (!$vin) return false;
        
        return Cache::remember("stolen_vin_{$vin}", 86400, function () use ($vin) {
            try {
                // Check multiple stolen vehicle databases
                $checks = [
                    'local' => self::checkLocalStolenDatabase($vin),
                    'interpol' => self::checkInterpolStolenVehicles($vin),
                    'police' => self::checkNationalPoliceDatabase($vin),
                ];
                
                foreach ($checks as $source => $isStolen) {
                    if ($isStolen) {
                        Log::critical('STOLEN VEHICLE DETECTED', [
                            'vin' => $vin,
                            'source' => $source,
                        ]);
                        
                        // Alert authorities
                        self::alertAuthorities($vin, $source);
                        
                        return true;
                    }
                }
                
                return false;
                
            } catch (\Exception $e) {
                Log::error('Stolen vehicle check failed', [
                    'vin' => $vin,
                    'error' => $e->getMessage(),
                ]);
                
                // Fail safe: check local DB only
                return DB::table('stolen_vehicles')->where('vin', $vin)->exists();
            }
        });
    }
    
    private static function checkLocalStolenDatabase(string $vin): bool
    {
        return DB::table('stolen_vehicles')
            ->where('vin', $vin)
            ->where('status', 'active')
            ->exists();
    }
    
    private static function checkInterpolStolenVehicles(string $vin): bool
    {
        $interpolApiKey = config('services.interpol.api_key');
        $interpolApiUrl = config('services.interpol.api_url');
        
        if (!$interpolApiKey || !$interpolApiUrl) {
            Log::info('Interpol API not configured');
            return false;
        }
        
        try {
            // Interpol Stolen Motor Vehicle (SMV) database
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$interpolApiKey}",
                'Accept' => 'application/json',
            ])->get($interpolApiUrl . '/stolen-vehicles', [
                'vin' => $vin,
                'format' => 'json',
            ]);
            
            if ($response->successful()) {
                $results = $response->json('results', []);
                return count($results) > 0;
            }
            
            return false;
            
        } catch (\Exception $e) {
            Log::error('Interpol API error', ['vin' => $vin, 'error' => $e->getMessage()]);
            return false;
        }
    }
    
    private static function checkNationalPoliceDatabase(string $vin): bool
    {
        // Integration with national police databases
        // Example: Germany (Bundeskriminalamt), France (Police Nationale), etc.
        
        $policeApiKey = config('services.police.api_key');
        $policeApiUrl = config('services.police.api_url');
        
        if (!$policeApiKey || !$policeApiUrl) {
            return false;
        }
        
        try {
            $response = Http::withHeaders([
                'X-API-Key' => $policeApiKey,
            ])->post($policeApiUrl . '/check-stolen', [
                'vin' => $vin,
                'check_type' => 'vehicle_theft',
            ]);
            
            if ($response->successful()) {
                return $response->json('stolen', false);
            }
            
            return false;
            
        } catch (\Exception $e) {
            Log::error('Police API error', ['vin' => $vin, 'error' => $e->getMessage()]);
            return false;
        }
    }
    
    private static function alertAuthorities(string $vin, string $source): void
    {
        // Send alert to authorities and admins
        try {
            // Log to security log
            Log::channel('security')->critical('STOLEN VEHICLE TRANSACTION ATTEMPT', [
                'vin' => $vin,
                'source' => $source,
                'timestamp' => now()->toIso8601String(),
                'ip' => request()->ip(),
            ]);
            
            // Notify admin users immediately
            $admins = User::where('user_type', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\StolenVehicleAlert($vin, $source));
            }
            
            // Optional: API call to law enforcement
            if (config('services.police.auto_report_enabled')) {
                Http::post(config('services.police.report_url'), [
                    'vin' => $vin,
                    'platform' => 'Scout Safe Pay',
                    'timestamp' => now()->toIso8601String(),
                ]);
            }
            
        } catch (\Exception $e) {
            Log::error('Failed to alert authorities', ['error' => $e->getMessage()]);
        }
    }
}
