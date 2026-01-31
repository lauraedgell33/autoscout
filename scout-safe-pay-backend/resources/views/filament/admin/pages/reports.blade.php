<x-filament-panels::page>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {{-- User Statistics --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-users class="w-5 h-5 text-primary-500" />
                    Users
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Users</dt>
                    <dd class="text-sm font-semibold">{{ number_format($totalUsers) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">New This Month</dt>
                    <dd class="text-sm font-semibold text-success-600">+{{ number_format($newUsersThisMonth) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Verified</dt>
                    <dd class="text-sm font-semibold">{{ number_format($verifiedUsers) }}</dd>
                </div>
                @foreach($usersByType as $type => $count)
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ $type }}</dt>
                    <dd class="text-sm font-semibold">{{ number_format($count) }}</dd>
                </div>
                @endforeach
            </dl>
        </x-filament::section>

        {{-- Transaction Statistics --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-shopping-cart class="w-5 h-5 text-warning-500" />
                    Transactions
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total</dt>
                    <dd class="text-sm font-semibold">{{ number_format($totalTransactions) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">This Month</dt>
                    <dd class="text-sm font-semibold">{{ number_format($transactionsThisMonth) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Last Month</dt>
                    <dd class="text-sm font-semibold">{{ number_format($transactionsLastMonth) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Completed</dt>
                    <dd class="text-sm font-semibold text-success-600">{{ number_format($completedTransactions) }}</dd>
                </div>
            </dl>
        </x-filament::section>

        {{-- Revenue Statistics --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-currency-euro class="w-5 h-5 text-success-500" />
                    Revenue
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</dt>
                    <dd class="text-sm font-semibold">€{{ number_format($totalRevenue, 2) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">This Month</dt>
                    <dd class="text-sm font-semibold text-success-600">€{{ number_format($revenueThisMonth, 2) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Escrow Balance</dt>
                    <dd class="text-sm font-semibold text-primary-600">€{{ number_format($escrowBalance, 2) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Payments</dt>
                    <dd class="text-sm font-semibold">€{{ number_format($totalPaymentAmount, 2) }}</dd>
                </div>
            </dl>
        </x-filament::section>

        {{-- Vehicle Statistics --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-truck class="w-5 h-5 text-info-500" />
                    Vehicles
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Vehicles</dt>
                    <dd class="text-sm font-semibold">{{ number_format($totalVehicles) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Active Listings</dt>
                    <dd class="text-sm font-semibold text-success-600">{{ number_format($activeVehicles) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Sold</dt>
                    <dd class="text-sm font-semibold">{{ number_format($soldVehicles) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Avg. Price</dt>
                    <dd class="text-sm font-semibold">€{{ number_format($averagePrice, 0) }}</dd>
                </div>
            </dl>
        </x-filament::section>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-3">
        {{-- Dealers --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-building-storefront class="w-5 h-5 text-primary-500" />
                    Dealers
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Dealers</dt>
                    <dd class="text-sm font-semibold">{{ number_format($totalDealers) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Active</dt>
                    <dd class="text-sm font-semibold text-success-600">{{ number_format($activeDealers) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Pending Approval</dt>
                    <dd class="text-sm font-semibold text-warning-600">{{ number_format($pendingDealers) }}</dd>
                </div>
            </dl>
        </x-filament::section>

        {{-- Disputes & KYC --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-shield-exclamation class="w-5 h-5 text-danger-500" />
                    Disputes & KYC
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Disputes</dt>
                    <dd class="text-sm font-semibold">{{ number_format($totalDisputes) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Open Disputes</dt>
                    <dd class="text-sm font-semibold text-danger-600">{{ number_format($openDisputes) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Resolved</dt>
                    <dd class="text-sm font-semibold text-success-600">{{ number_format($resolvedDisputes) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Pending KYC</dt>
                    <dd class="text-sm font-semibold text-warning-600">{{ number_format($pendingVerifications) }}</dd>
                </div>
            </dl>
        </x-filament::section>

        {{-- Reviews --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-star class="w-5 h-5 text-warning-500" />
                    Reviews
                </div>
            </x-slot>
            <dl class="space-y-2">
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Total Reviews</dt>
                    <dd class="text-sm font-semibold">{{ number_format($totalReviews) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Pending Moderation</dt>
                    <dd class="text-sm font-semibold text-warning-600">{{ number_format($pendingReviews) }}</dd>
                </div>
                <div class="flex justify-between">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Average Rating</dt>
                    <dd class="text-sm font-semibold">{{ $averageRating }} / 5</dd>
                </div>
            </dl>
        </x-filament::section>
    </div>

    {{-- Monthly Trends --}}
    <x-filament::section class="mt-6">
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                <x-heroicon-o-chart-bar class="w-5 h-5" />
                Monthly Trends (Last 6 Months)
            </div>
        </x-slot>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b dark:border-gray-700">
                        <th class="py-2 text-left font-medium text-gray-500 dark:text-gray-400">Month</th>
                        <th class="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Transactions</th>
                        <th class="py-2 text-right font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                        <th class="py-2 text-right font-medium text-gray-500 dark:text-gray-400">New Users</th>
                        <th class="py-2 text-right font-medium text-gray-500 dark:text-gray-400">New Vehicles</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($monthlyData as $data)
                    <tr class="border-b dark:border-gray-700">
                        <td class="py-2 font-medium">{{ $data['month'] }}</td>
                        <td class="py-2 text-right">{{ number_format($data['transactions']) }}</td>
                        <td class="py-2 text-right">€{{ number_format($data['revenue'], 2) }}</td>
                        <td class="py-2 text-right">{{ number_format($data['users']) }}</td>
                        <td class="py-2 text-right">{{ number_format($data['vehicles']) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </x-filament::section>

    {{-- Transaction Status Breakdown --}}
    @if(count($transactionsByStatus) > 0)
    <x-filament::section class="mt-6">
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                <x-heroicon-o-queue-list class="w-5 h-5" />
                Transaction Status Breakdown
            </div>
        </x-slot>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            @foreach($transactionsByStatus as $status => $count)
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ str_replace('_', ' ', $status) }}</p>
                <p class="text-lg font-semibold">{{ number_format($count) }}</p>
            </div>
            @endforeach
        </div>
    </x-filament::section>
    @endif
</x-filament-panels::page>
