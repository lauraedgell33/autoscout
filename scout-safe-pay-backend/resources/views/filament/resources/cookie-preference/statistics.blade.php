<div class="space-y-6 p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Preferences -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Preferences</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['total'] }}</p>
                </div>
                <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <svg class="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Active Preferences -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                    <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ $stats['active'] }}</p>
                </div>
                <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <svg class="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Expired -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
                    <p class="text-3xl font-bold text-red-600 dark:text-red-400">{{ $stats['expired'] }}</p>
                </div>
                <div class="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                    <svg class="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Needs Refresh -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Needs Refresh</p>
                    <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ $stats['needs_refresh'] }}</p>
                </div>
                <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <svg class="w-8 h-8 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Acceptance Rates -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cookie Category Acceptance Rates</h3>
        <div class="space-y-4">
            @php
                $total = max($stats['total'], 1); // Avoid division by zero
                $categories = [
                    'functional' => ['label' => 'Functional Cookies', 'color' => 'blue'],
                    'analytics' => ['label' => 'Analytics Cookies', 'color' => 'purple'],
                    'marketing' => ['label' => 'Marketing Cookies', 'color' => 'pink'],
                ];
            @endphp

            @foreach($categories as $key => $category)
                @php
                    $count = $stats['acceptance_rates'][$key];
                    $percentage = round(($count / $total) * 100, 1);
                @endphp
                <div>
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $category['label'] }}</span>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $count }} ({{ $percentage }}%)</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div class="bg-{{ $category['color'] }}-600 h-2.5 rounded-full" style="width: {{ $percentage }}%"></div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Summary -->
    <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">Cookie Preferences Summary</h3>
                <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>
                        Cookie preferences are automatically refreshed when they are about to expire (within 7 days).
                        The scheduled task runs daily at 2:00 AM to refresh all expiring preferences.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
