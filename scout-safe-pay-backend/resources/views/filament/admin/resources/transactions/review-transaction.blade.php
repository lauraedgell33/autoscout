<div class="space-y-6">
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Review Transaction Details
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Parties -->
            <div>
                <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">Parties Involved</h4>
                <dl class="space-y-2">
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Buyer</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ $data['buyer_id'] ? \App\Models\User::find($data['buyer_id'])?->name : 'Not selected' }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Seller</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ $data['seller_id'] ? \App\Models\User::find($data['seller_id'])?->name : 'Not selected' }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Dealer</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ $data['dealer_id'] ? \App\Models\Dealer::find($data['dealer_id'])?->name : 'Not selected' }}
                        </dd>
                    </div>
                </dl>
            </div>
            
            <!-- Financial -->
            <div>
                <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-3">Financial Details</h4>
                <dl class="space-y-2">
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Transaction Code</dt>
                        <dd class="text-sm font-mono font-medium text-gray-900 dark:text-white">
                            {{ $data['transaction_code'] ?? 'TXN-XXXXXXXX' }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Amount</dt>
                        <dd class="text-lg font-bold text-orange-600 dark:text-orange-400">
                            €{{ number_format($data['amount'] ?? 0, 2) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Commission ({{ $data['commission_rate'] ?? 0 }}%)</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">
                            €{{ number_format($data['commission_amount'] ?? 0, 2) }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Payment Method</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ ucwords(str_replace('_', ' ', $data['payment_method'] ?? 'N/A')) }}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
        
        @if(isset($data['notes']) && $data['notes'])
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ $data['notes'] }}</p>
        </div>
        @endif
        
        <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
                @if(isset($data['requires_inspection']) && $data['requires_inspection'])
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    Inspection Required
                </span>
                @endif
                
                @if(isset($data['has_warranty']) && $data['has_warranty'])
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    Warranty Included
                </span>
                @endif
            </div>
        </div>
    </div>
    
    <div class="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950 p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Ready to create this transaction?
                </h3>
                <div class="mt-2 text-sm text-orange-700 dark:text-orange-300">
                    <p>Please review all details carefully before proceeding. Once created, you can edit the transaction details from the main transactions page.</p>
                </div>
            </div>
        </div>
    </div>
</div>
