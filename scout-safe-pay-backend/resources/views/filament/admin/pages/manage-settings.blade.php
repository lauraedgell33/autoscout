<x-filament-panels::page>
    <form wire:submit="save">
        {{ $this->form }}

        <div class="mt-6 flex justify-end">
            <x-filament::button type="submit">
                <x-filament::icon 
                    icon="heroicon-o-check" 
                    class="mr-2 h-5 w-5"
                />
                Save Settings
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
