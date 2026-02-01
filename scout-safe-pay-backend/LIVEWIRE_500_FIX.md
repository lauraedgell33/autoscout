# Livewire 500 Error Fix Guide for Forge

## The Problem
You're getting `POST https://adminautoscout.dev/livewire/update 500 (Internal Server Error)` on your Laravel Filament admin panel.

## Most Common Causes (in order of likelihood):

### 1. **SESSION/CACHE ISSUES** (90% of cases)
Livewire stores component state in sessions. If sessions are corrupt or the cache is stale, you get 500 errors.

**FIX - Run on Forge server via SSH:**
```bash
cd /home/forge/adminautoscout.dev
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear
php artisan optimize
```

### 2. **STORAGE PERMISSIONS** (5% of cases)
Sessions are stored in `storage/framework/sessions/` and need write permissions.

**FIX - Run on Forge:**
```bash
cd /home/forge/adminautoscout.dev
chmod -R 775 storage bootstrap/cache
chown -R forge:www-data storage bootstrap/cache
```

### 3. **ENVIRONMENT MISMATCH** (3% of cases)
Your `.env` on Forge might have wrong settings.

**CHECK on Forge:**
```bash
cd /home/forge/adminautoscout.dev
cat .env | grep -E "(SESSION_|APP_DEBUG|APP_ENV|SESSION_DOMAIN)"
```

**Should be:**
```
APP_ENV=production
APP_DEBUG=false
SESSION_DRIVER=database  (or file)
SESSION_DOMAIN=.adminautoscout.dev
SESSION_SECURE_COOKIE=true
```

### 4. **MISSING DATABASE SESSIONS TABLE** (1% of cases)
If using `SESSION_DRIVER=database`, the sessions table might not exist.

**FIX on Forge:**
```bash
cd /home/forge/adminautoscout.dev
php artisan session:table
php artisan migrate
```

### 5. **COMPOSER AUTOLOAD ISSUE** (1% of cases)
**FIX on Forge:**
```bash
cd /home/forge/adminautoscout.dev
composer dump-autoload --optimize
php artisan optimize
```

## Quick Fix Script

**Run this ONE command on Forge to fix 95% of Livewire issues:**
```bash
cd /home/forge/adminautoscout.dev && php artisan cache:clear && php artisan config:clear && php artisan view:clear && php artisan route:clear && chmod -R 775 storage bootstrap/cache && php artisan optimize && echo "✅ Done! Try the admin panel now"
```

## To See Actual Error

**SSH into Forge and run:**
```bash
cd /home/forge/adminautoscout.dev
tail -50 storage/logs/laravel.log
```

Or enable debug mode temporarily (DISABLE after checking):
```bash
# Edit .env on Forge
APP_DEBUG=true

# Try the admin panel again, see the error
# Then DISABLE debug:
APP_DEBUG=false
```

## Prevention

Add this to your `deploy-forge.sh` deployment script:
```bash
# After composer install
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
chmod -R 775 storage bootstrap/cache
```

## Still Not Working?

1. Check Forge site logs: Forge Dashboard → Your Site → Logs
2. Check PHP error logs: `/var/log/nginx/adminautoscout.dev-error.log`
3. Check PHP-FPM logs: `sudo journalctl -u php8.3-fpm -n 100`
