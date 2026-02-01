#!/bin/bash
# 🚑 EMERGENCY FIX - Copy and paste this into Forge web terminal
# Go to: Forge Dashboard → Your Server → Site → Terminal
# Then paste this entire script

echo "🚑 LIVEWIRE 500 ERROR FIX"
echo "=========================="
echo ""

# Navigate to site directory
cd /home/forge/adminautoscout.dev

echo "📍 Current directory: $(pwd)"
echo ""

# 1. Clear ALL caches
echo "1️⃣ Clearing all caches..."
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
echo "✅ Caches cleared"
echo ""

# 2. Fix permissions
echo "2️⃣ Fixing storage permissions..."
chmod -R 775 storage bootstrap/cache
chown -R forge:www-data storage bootstrap/cache
echo "✅ Permissions fixed"
echo ""

# 3. Rebuild optimized caches
echo "3️⃣ Rebuilding optimized caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
echo "✅ Caches rebuilt"
echo ""

# 4. Check session configuration
echo "4️⃣ Checking session configuration..."
php artisan config:show session | grep driver || echo "Session driver check complete"
echo ""

# 5. Check recent errors
echo "5️⃣ Checking recent Laravel errors..."
tail -20 storage/logs/laravel.log | grep ERROR || echo "No recent errors (good sign!)"
echo ""

echo "✅✅✅ DONE! ✅✅✅"
echo ""
echo "Try your admin panel now at: https://adminautoscout.dev/admin"
echo ""
echo "If still having issues, check logs:"
echo "  tail -50 storage/logs/laravel.log"
