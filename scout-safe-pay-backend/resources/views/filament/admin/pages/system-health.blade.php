<x-filament-panels::page>
    {{-- Health Checks --}}
    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                <x-heroicon-o-heart class="w-5 h-5 text-danger-500" />
                Health Checks
            </div>
        </x-slot>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @foreach($checks as $key => $check)
            <div class="p-4 rounded-lg border {{ $check['status'] === 'ok' ? 'border-success-500 bg-success-50 dark:bg-success-500/10' : ($check['status'] === 'warning' ? 'border-warning-500 bg-warning-50 dark:bg-warning-500/10' : 'border-danger-500 bg-danger-50 dark:bg-danger-500/10') }}">
                <div class="flex items-center gap-3">
                    <div class="{{ $check['status'] === 'ok' ? 'text-success-600' : ($check['status'] === 'warning' ? 'text-warning-600' : 'text-danger-600') }}">
                        @if($check['status'] === 'ok')
                            <x-heroicon-o-check-circle class="w-8 h-8" />
                        @elseif($check['status'] === 'warning')
                            <x-heroicon-o-exclamation-triangle class="w-8 h-8" />
                        @else
                            <x-heroicon-o-x-circle class="w-8 h-8" />
                        @endif
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">{{ $check['name'] }}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ $check['message'] }}</p>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </x-filament::section>

    <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {{-- System Information --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-information-circle class="w-5 h-5 text-info-500" />
                    System Information
                </div>
            </x-slot>
            
            <dl class="space-y-3">
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">PHP Version</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['php_version'] }}</dd>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Laravel Version</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['laravel_version'] }}</dd>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Server</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['server_software'] }}</dd>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Timezone</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['timezone'] }}</dd>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Memory Limit</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['memory_limit'] }}</dd>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Max Execution Time</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['max_execution_time'] }}</dd>
                </div>
                <div class="flex justify-between py-2 border-b dark:border-gray-700">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">Upload Max Size</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['upload_max_filesize'] }}</dd>
                </div>
                <div class="flex justify-between py-2">
                    <dt class="text-sm text-gray-500 dark:text-gray-400">OPcache</dt>
                    <dd class="text-sm font-semibold">{{ $systemInfo['opcache_enabled'] }}</dd>
                </div>
            </dl>
        </x-filament::section>

        {{-- Database Statistics --}}
        <x-filament::section>
            <x-slot name="heading">
                <div class="flex items-center gap-2">
                    <x-heroicon-o-circle-stack class="w-5 h-5 text-primary-500" />
                    Database Statistics
                </div>
            </x-slot>
            
            @if(isset($databaseStats['error']))
                <p class="text-danger-600">{{ $databaseStats['error'] }}</p>
            @else
                <dl class="space-y-3">
                    <div class="flex justify-between py-2 border-b dark:border-gray-700">
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Driver</dt>
                        <dd class="text-sm font-semibold">{{ $databaseStats['driver'] }}</dd>
                    </div>
                    @if(isset($databaseStats['size']))
                    <div class="flex justify-between py-2 border-b dark:border-gray-700">
                        <dt class="text-sm text-gray-500 dark:text-gray-400">Database Size</dt>
                        <dd class="text-sm font-semibold">{{ $databaseStats['size'] }}</dd>
                    </div>
                    @endif
                    
                    <div class="pt-2">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Record Counts</h4>
                        <div class="grid grid-cols-2 gap-3">
                            @foreach($databaseStats['tables'] as $table => $count)
                            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ $table }}</p>
                                <p class="text-lg font-semibold">{{ number_format($count) }}</p>
                            </div>
                            @endforeach
                        </div>
                    </div>
                </dl>
            @endif
        </x-filament::section>
    </div>

    {{-- Quick Actions --}}
    <x-filament::section class="mt-6">
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                <x-heroicon-o-wrench-screwdriver class="w-5 h-5" />
                Quick Actions
            </div>
        </x-slot>
        
        <div class="flex flex-wrap gap-3">
            <a href="{{ route('filament.admin.pages.settings') }}" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                <x-heroicon-o-cog-6-tooth class="w-5 h-5 mr-2" />
                Settings
            </a>
            <a href="{{ route('filament.admin.pages.reports') }}" class="inline-flex items-center px-4 py-2 bg-info-600 text-white rounded-lg hover:bg-info-700 transition">
                <x-heroicon-o-chart-bar class="w-5 h-5 mr-2" />
                Reports
            </a>
            <a href="{{ route('filament.admin.resources.users.index') }}" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                <x-heroicon-o-users class="w-5 h-5 mr-2" />
                Manage Users
            </a>
        </div>
    </x-filament::section>
</x-filament-panels::page>
