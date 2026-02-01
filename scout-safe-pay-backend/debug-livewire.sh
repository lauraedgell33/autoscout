#!/bin/bash
# Livewire 500 Error Diagnostic Script for Forge
# Run this on your Forge server

echo "=== Livewire Debug Script ==="
echo ""

echo "1. Checking Laravel logs (last 50 errors)..."
tail -100 storage/logs/laravel.log | grep -A5 "ERROR"

echo ""
echo "2. Checking storage permissions..."
ls -la storage/framework/sessions/
ls -la storage/framework/cache/
ls -la storage/framework/views/

echo ""
echo "3. Checking session configuration..."
php artisan config:show session

echo ""
echo "4. Testing Livewire..."
php artisan livewire:list

echo ""
echo "5. Checking Filament components..."
php artisan filament:list

echo ""
echo "=== Common fixes for Livewire 500 errors ==="
echo "Run these commands on Forge:"
echo ""
echo "# Clear all caches"
echo "php artisan cache:clear"
echo "php artisan config:clear"
echo "php artisan view:clear"
echo "php artisan route:clear"
echo ""
echo "# Fix storage permissions"
echo "chmod -R 775 storage bootstrap/cache"
echo "chown -R forge:www-data storage bootstrap/cache"
echo ""
echo "# Optimize for production"
echo "php artisan optimize"
echo ""
echo "# Check session driver works"
echo "php artisan tinker"
echo "> \\Session::put('test', 'value');"
echo "> \\Session::get('test');"
echo ""
