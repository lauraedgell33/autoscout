import preset from './vendor/filament/support/tailwind.config.preset'

export default {
    presets: [preset],
    content: [
        './app/Filament/**/*.php',
        './resources/views/filament/**/*.blade.php',
        './vendor/filament/**/*.blade.php',
    ],
    theme: {
        extend: {
            colors: {
                'autoscout': {
                    50: '#FFF7ED',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    300: '#FDBA74',
                    400: '#FB923C',
                    500: '#FF6C0C',
                    600: '#E55F00',
                    700: '#C2410C',
                    800: '#9A3412',
                    900: '#7C2D12',
                },
            },
        },
    },
}
