<?php

namespace App\Services;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ComplianceService
{
    /**
     * Perform KYC verification check
     */
    public static function performKycCheck(User $user): array
    {
        $checks = [
            'identity_verified' => false,
            'address_verified' => false,
            'document_verified' => false,
            'pep_screening' => false,
            'sanctions_screening' => false,
            'risk_level' => 'unknown',
        ];

        // Identity verification (mock - integrate with provider like Onfido, Jumio)
        if ($user->email_verified_at && $user->phone_verified_at) {
            $checks['identity_verified'] = true;
        }

        // Document verification
        if ($user->kyc_status === 'verified') {
            $checks['document_verified'] = true;
        }

        // PEP (Politically Exposed Person) screening
        $checks['pep_screening'] = self::checkPepDatabase($user);

        // Sanctions screening
        $checks['sanctions_screening'] = self::checkSanctionsLists($user);

        // Calculate overall risk level
        $checks['risk_level'] = self::calculateKycRiskLevel($checks);

        // Store result
        $user->update([
            'kyc_data' => array_merge($user->kyc_data ?? [], [
                'last_check' => now()->toIso8601String(),
                'checks' => $checks,
            ]),
        ]);

        return $checks;
    }

    private static function checkPepDatabase(User $user): bool
    {
        $pepProvider = config('services.compliance.pep_provider'); // worldcheck, dowjones, or complyadvantage
        
        if (!$pepProvider || !config('services.compliance.pep_api_key')) {
            Log::info('PEP screening not configured, skipping check');
            return true; // Pass by default if not configured
        }
        
        try {
            switch ($pepProvider) {
                case 'worldcheck':
                    return self::checkWorldCheck($user);
                case 'dowjones':
                    return self::checkDowJones($user);
                case 'complyadvantage':
                    return self::checkComplyAdvantage($user);
                default:
                    return self::checkLocalPepList($user);
            }
        } catch (\Exception $e) {
            Log::error('PEP screening failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return false; // Fail closed for security
        }
    }
    
    private static function checkWorldCheck(User $user): bool
    {
        $apiKey = config('services.compliance.pep_api_key');
        $apiUrl = config('services.compliance.pep_api_url', 'https://api.refinitiv.com/compliance/v1/screening');
        
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post($apiUrl, [
            'name' => $user->name,
            'date_of_birth' => $user->date_of_birth,
            'country' => $user->country,
            'screening_types' => ['PEP', 'SIP', 'RCA'], // Politically Exposed Person, Special Interest Person, Relative/Close Associate
        ]);
        
        if ($response->successful()) {
            $results = $response->json('results', []);
            
            // If any PEP match found
            if (!empty($results)) {
                Log::warning('PEP match found', [
                    'user_id' => $user->id,
                    'matches' => count($results),
                ]);
                
                // Store for audit
                $user->update([
                    'kyc_data' => array_merge($user->kyc_data ?? [], [
                        'pep_check' => [
                            'date' => now()->toIso8601String(),
                            'provider' => 'worldcheck',
                            'result' => 'match_found',
                            'matches' => $results,
                        ],
                    ]),
                ]);
                
                return false; // Failed - requires manual review
            }
            
            return true; // Passed
        }
        
        throw new \Exception('World-Check API returned error: ' . $response->body());
    }
    
    private static function checkDowJones(User $user): bool
    {
        // Similar implementation for Dow Jones Watchlist
        $apiKey = config('services.compliance.pep_api_key');
        $apiUrl = 'https://api.dowjones.com/risk/entities/v2/search';
        
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->get($apiUrl, [
            'name' => $user->name,
            'country' => $user->country,
        ]);
        
        if ($response->successful() && $response->json('total_results', 0) > 0) {
            Log::warning('Dow Jones PEP match', ['user_id' => $user->id]);
            return false;
        }
        
        return true;
    }
    
    private static function checkComplyAdvantage(User $user): bool
    {
        $apiKey = config('services.compliance.pep_api_key');
        $apiUrl = 'https://api.complyadvantage.com/searches';
        
        $response = Http::withHeaders([
            'Authorization' => "Token {$apiKey}",
        ])->post($apiUrl, [
            'search_term' => $user->name,
            'fuzziness' => 0.6,
            'filters' => [
                'types' => ['pep'],
            ],
        ]);
        
        if ($response->successful() && $response->json('data.total', 0) > 0) {
            Log::warning('ComplyAdvantage PEP match', ['user_id' => $user->id]);
            return false;
        }
        
        return true;
    }
    
    private static function checkLocalPepList(User $user): bool
    {
        // Fallback: check local database of known PEPs
        $pepExists = DB::table('pep_watchlist')
            ->whereRaw('LOWER(name) = ?', [strtolower($user->name)])
            ->orWhere('passport_number', $user->passport_number)
            ->exists();
            
        return !$pepExists;
    }

    private static function checkSanctionsLists(User $user): bool
    {
        $sanctionsProvider = config('services.compliance.sanctions_provider'); // ofac, dowjones, or complyadvantage
        
        if (!$sanctionsProvider || !config('services.compliance.sanctions_api_key')) {
            Log::info('Sanctions screening not configured, performing local check');
            return self::checkLocalSanctionsList($user);
        }
        
        try {
            // Check multiple sanctions lists
            $checks = [
                'ofac' => self::checkOFAC($user),
                'eu' => self::checkEUSanctions($user),
                'un' => self::checkUNSanctions($user),
            ];
            
            // If any check fails, entire screening fails
            foreach ($checks as $list => $passed) {
                if (!$passed) {
                    Log::critical('SANCTIONS HIT', [
                        'user_id' => $user->id,
                        'list' => $list,
                        'name' => $user->name,
                    ]);
                    
                    // Store for audit trail
                    $user->update([
                        'kyc_data' => array_merge($user->kyc_data ?? [], [
                            'sanctions_check' => [
                                'date' => now()->toIso8601String(),
                                'result' => 'hit',
                                'list' => $list,
                            ],
                        ]),
                    ]);
                    
                    return false;
                }
            }
            
            return true; // Passed all checks
            
        } catch (\Exception $e) {
            Log::error('Sanctions screening failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return false; // Fail closed
        }
    }
    
    private static function checkOFAC(User $user): bool
    {
        // OFAC (Office of Foreign Assets Control) - US Treasury
        $apiKey = config('services.compliance.sanctions_api_key');
        $apiUrl = 'https://api.treasury.gov/ofac/sanctions/search';
        
        // Note: OFAC has a public SDN list that can be downloaded
        // For real-time: use commercial API like Dow Jones or ComplyAdvantage
        
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->get($apiUrl, [
            'name' => $user->name,
            'country' => $user->country,
            'dob' => $user->date_of_birth,
        ]);
        
        if ($response->successful()) {
            return $response->json('total_hits', 0) === 0;
        }
        
        // Fallback to local database
        return !DB::table('ofac_sdn_list')
            ->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($user->name) . '%'])
            ->exists();
    }
    
    private static function checkEUSanctions(User $user): bool
    {
        // EU Consolidated Sanctions List
        return !DB::table('eu_sanctions_list')
            ->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($user->name) . '%'])
            ->exists();
    }
    
    private static function checkUNSanctions(User $user): bool
    {
        // UN Security Council Sanctions List
        return !DB::table('un_sanctions_list')
            ->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($user->name) . '%'])
            ->exists();
    }
    
    private static function checkLocalSanctionsList(User $user): bool
    {
        // Fallback: check consolidated local database
        $name = strtolower($user->name);
        
        // Critical keywords that always trigger
        $criticalKeywords = ['terrorist', 'sanctioned', 'blocked', 'embargo'];
        
        foreach ($criticalKeywords as $keyword) {
            if (strpos($name, $keyword) !== false) {
                Log::critical('SANCTIONS KEYWORD HIT', [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'keyword' => $keyword,
                ]);
                return false;
            }
        }
        
        // Check local consolidated list
        return !DB::table('sanctions_watchlist')
            ->whereRaw('LOWER(name) = ?', [$name])
            ->orWhere('email', $user->email)
            ->exists();
    }

    private static function calculateKycRiskLevel(array $checks): string
    {
        if (!$checks['sanctions_screening'] || !$checks['pep_screening']) {
            return 'high';
        }

        if (!$checks['identity_verified'] || !$checks['document_verified']) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * AML (Anti-Money Laundering) transaction monitoring
     */
    public static function performAmlCheck(Transaction $transaction): array
    {
        $flags = [];
        $riskScore = 0;

        // Large transaction threshold (€10,000+)
        if ($transaction->amount >= 10000) {
            $flags[] = 'large_transaction';
            $riskScore += 20;
        }

        // Very large transaction (€50,000+)
        if ($transaction->amount >= 50000) {
            $flags[] = 'very_large_transaction';
            $riskScore += 30;
        }

        // Rapid succession of transactions
        $recentTransactions = Transaction::where('buyer_id', $transaction->buyer_id)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        if ($recentTransactions > 3) {
            $flags[] = 'high_frequency';
            $riskScore += 25;
        }

        // Structuring (multiple transactions just below reporting threshold)
        $recentTotal = Transaction::where('buyer_id', $transaction->buyer_id)
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('amount');

        if ($recentTotal > 40000 && $transaction->amount < 10000) {
            $flags[] = 'potential_structuring';
            $riskScore += 35;
        }

        // Cross-border transaction
        $buyerCountry = $transaction->buyer->country ?? 'DE';
        $sellerCountry = $transaction->seller->country ?? 'DE';
        
        if ($buyerCountry !== $sellerCountry) {
            $flags[] = 'cross_border';
            $riskScore += 15;
        }

        // High-risk countries
        $highRiskCountries = ['AF', 'IR', 'KP', 'SY', 'YE'];
        if (in_array($buyerCountry, $highRiskCountries) || in_array($sellerCountry, $highRiskCountries)) {
            $flags[] = 'high_risk_country';
            $riskScore += 50;
        }

        // Customer risk profile
        $buyerKyc = $transaction->buyer->kyc_data ?? [];
        if (isset($buyerKyc['checks']['risk_level']) && $buyerKyc['checks']['risk_level'] === 'high') {
            $flags[] = 'high_risk_customer';
            $riskScore += 30;
        }

        $result = [
            'aml_flags' => $flags,
            'risk_score' => min(100, $riskScore),
            'risk_level' => self::getAmlRiskLevel($riskScore),
            'requires_reporting' => $transaction->amount >= 10000 || $riskScore >= 60,
            'requires_sar' => $riskScore >= 80, // Suspicious Activity Report
        ];

        // Log high-risk transactions
        if ($result['requires_sar']) {
            Log::warning('HIGH AML RISK TRANSACTION', [
                'transaction_id' => $transaction->id,
                'buyer_id' => $transaction->buyer_id,
                'amount' => $transaction->amount,
                'flags' => $flags,
            ]);
        }

        return $result;
    }

    private static function getAmlRiskLevel(int $score): string
    {
        if ($score < 30) return 'low';
        if ($score < 60) return 'medium';
        if ($score < 80) return 'high';
        return 'critical';
    }

    /**
     * Generate compliance report
     */
    public static function generateComplianceReport(\DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        $transactions = Transaction::whereBetween('created_at', [$startDate, $endDate])->get();

        $report = [
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'summary' => [
                'total_transactions' => $transactions->count(),
                'total_volume' => $transactions->sum('amount'),
                'large_transactions' => $transactions->where('amount', '>=', 10000)->count(),
                'flagged_transactions' => 0,
                'reports_filed' => 0,
            ],
            'kyc_summary' => [
                'verified_users' => User::where('kyc_status', 'verified')->count(),
                'pending_verification' => User::where('kyc_status', 'pending')->count(),
                'failed_verification' => User::where('kyc_status', 'rejected')->count(),
            ],
            'high_risk_transactions' => [],
        ];

        foreach ($transactions as $transaction) {
            $amlCheck = self::performAmlCheck($transaction);
            
            if ($amlCheck['risk_level'] === 'high' || $amlCheck['risk_level'] === 'critical') {
                $report['summary']['flagged_transactions']++;
                $report['high_risk_transactions'][] = [
                    'transaction_id' => $transaction->id,
                    'transaction_code' => $transaction->transaction_code,
                    'amount' => $transaction->amount,
                    'risk_level' => $amlCheck['risk_level'],
                    'flags' => $amlCheck['aml_flags'],
                ];
            }

            if ($amlCheck['requires_reporting']) {
                $report['summary']['reports_filed']++;
            }
        }

        return $report;
    }

    /**
     * Check if user is allowed to transact
     */
    public static function canUserTransact(User $user, float $amount): array
    {
        $reasons = [];
        $allowed = true;

        // KYC requirement
        if ($user->kyc_status !== 'verified') {
            $allowed = false;
            $reasons[] = 'KYC verification required';
        }

        // Email verification
        if (!$user->email_verified_at) {
            $allowed = false;
            $reasons[] = 'Email verification required';
        }

        // Transaction limits
        $dailyLimit = 50000; // €50,000
        $monthlyLimit = 200000; // €200,000

        $dailyTotal = Transaction::where('buyer_id', $user->id)
            ->where('created_at', '>=', now()->subDay())
            ->sum('amount');

        if ($dailyTotal + $amount > $dailyLimit) {
            $allowed = false;
            $reasons[] = 'Daily transaction limit exceeded';
        }

        $monthlyTotal = Transaction::where('buyer_id', $user->id)
            ->where('created_at', '>=', now()->subMonth())
            ->sum('amount');

        if ($monthlyTotal + $amount > $monthlyLimit) {
            $allowed = false;
            $reasons[] = 'Monthly transaction limit exceeded';
        }

        return [
            'allowed' => $allowed,
            'reasons' => $reasons,
        ];
    }
}
