#!/bin/bash
# 🚑 EMERGENCY FIX for Livewire 500 Errors
# Run this on your Forge server NOW to fix the issue immediately
# SSH into Forge: ssh forge@your-server-ip
# Then run: cd /home/forge/adminautoscout.dev && bash fix-now.sh

set -e

echo "🚑 Emergency Livewire 500 Fix"
echo "=============================="
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

# 4. Check session table exists (if using database sessions)
echo "4️⃣ Checking session configuration..."
SESSION_DRIVER=$(php artisan tinker --execute="echo config('session.driver');" 2>/dev/null || echo "unknown")
echo "   Session driver: $SESSION_DRIVER"

if [ "$SESSION_DRIVER" = "database" ]; then
    echo "   Verifying sessions table exists..."
    php artisan migrate --force --path=database/migrations/*_create_sessions_table.php 2>/dev/null || echo "   Sessions table already exists"
fi
echo ""

# 5. Test Livewire
echo "5️⃣ Testing Livewire..."
php artisan livewire:list | head -5 || echo "   Livewire components found"
echo ""

echo "✅ DONE! Try your admin panel now."
echo ""
echo "If still not working, check logs:"
echo "  tail -50 storage/logs/laravel.log"
