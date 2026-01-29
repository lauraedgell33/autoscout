# 🚀 Deployment Guide - Settings System to Production

**Date**: January 29, 2026  
**Target**: Laravel Forge (adminautoscout.dev)  
**Priority**: HIGH - API endpoints needed for frontend

---

## 📋 Pre-Deployment Checklist

- [x] Code committed to GitHub
- [x] Git push successful (commit: aa399d4)
- [ ] SSH access to Forge server
- [ ] Database backup created
- [ ] Maintenance mode enabled

---

## 🔐 Access Information

### Forge Dashboard
- URL: https://forge.laravel.com
- Server: adminautoscout.dev
- Application: Laravel 12

### SSH Access
```bash
ssh forge@adminautoscout.dev
```

### GitHub Repository
- Owner: lauraedgell33
- Repo: autoscout
- Branch: main
- Latest commit: aa399d4

---

## 📦 Deployment Steps

### Step 1: Backup Database

```bash
# SSH to server
ssh forge@adminautoscout.dev

# Navigate to application directory
cd /home/forge/adminautoscout.dev

# Create backup
php artisan backup:run --only-db

# Or manual backup
php artisan db:dump backups/backup-$(date +%Y%m%d-%H%M%S).sql
```

### Step 2: Enable Maintenance Mode

```bash
# Put application in maintenance mode
php artisan down --retry=60

# Verify
curl https://adminautoscout.dev
# Should return 503 Service Unavailable
```

### Step 3: Pull Latest Code

```bash
# Check current branch
git branch

# Pull latest changes from GitHub
git pull origin main

# Verify latest commit
git log --oneline -1
# Should show: aa399d4 feat: Add Settings management system...
```

### Step 4: Install Dependencies

```bash
# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Verify critical packages
composer show | grep filament
# Should show: filament/filament v4.5.2
```

### Step 5: Run Database Migrations

```bash
# Test migration first (dry run)
php artisan migrate:status

# Run migrations
php artisan migrate --force

# Expected output:
# Running migrations:
# 2026_01_29_132748_create_settings_table ... DONE

# Verify table created
php artisan tinker --execute="Schema::hasTable('settings')"
# Should return: true
```

### Step 6: Seed Default Settings

```bash
# Seed settings table
php artisan db:seed --class=SettingsSeeder --force

# Verify settings created
php artisan tinker --execute="App\Models\Settings::count()"
# Should return: 22

# Check public settings
php artisan tinker --execute="json_encode(App\Models\Settings::getPublic(), JSON_PRETTY_PRINT)"
```

### Step 7: Clear All Caches

```bash
# Clear application caches
php artisan optimize:clear

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Filament specific
php artisan filament:optimize

# Verify settings API route exists
php artisan route:list --path=api/settings
# Should show:
# GET|HEAD api/settings/public
# GET|HEAD api/settings/group/{group}
```

### Step 8: Restart Services

```bash
# Restart queue workers
php artisan queue:restart

# Restart Octane (if using)
php artisan octane:reload

# Or restart PHP-FPM
sudo systemctl restart php8.3-fpm

# Restart Nginx
sudo systemctl restart nginx
```

### Step 9: Disable Maintenance Mode

```bash
# Bring application back online
php artisan up

# Verify
curl https://adminautoscout.dev
# Should return 200 OK
```

### Step 10: Verify Deployment

```bash
# Test Settings API
curl https://adminautoscout.dev/api/settings/public

# Expected output (JSON):
# {
#   "success": true,
#   "data": {
#     "frontend_url": "https://autoscout.dev",
#     "site_name": "AutoScout SafePay",
#     ...
#   }
# }

# Test specific group
curl https://adminautoscout.dev/api/settings/group/frontend

# Test admin panel
curl -I https://adminautoscout.dev/admin/settings
# Should return 302 (redirect to login)
```

---

## 🧪 Post-Deployment Testing

### Test API Endpoints

```bash
# From local machine
./test-production-enhanced.sh

# Or manual tests
curl https://adminautoscout.dev/api/settings/public | jq
curl https://adminautoscout.dev/api/settings/group/contact | jq
curl https://adminautoscout.dev/api/settings/group/email | jq
```

### Test Admin Panel

1. Navigate to: https://adminautoscout.dev/admin/login
2. Login with admin credentials
3. Navigate to: Settings (System group)
4. Verify all 22 settings are visible
5. Test editing a setting
6. Test creating a new setting
7. Test filtering by group

### Test Frontend Integration

1. Navigate to: https://www.autoscout24safetrade.com
2. Open browser DevTools → Network
3. Check for API call to `/api/settings/public`
4. Verify settings loaded successfully
5. Test contact information display
6. Test social media links

---

## 🔍 Troubleshooting

### Issue: Settings API returns 404

**Solution**:
```bash
# Clear route cache
php artisan route:clear
php artisan route:cache

# Verify route exists
php artisan route:list --path=api/settings
```

### Issue: Database migration fails

**Solution**:
```bash
# Check database connection
php artisan tinker --execute="DB::connection()->getPdo()"

# Check pending migrations
php artisan migrate:status

# Rollback and retry
php artisan migrate:rollback --step=1
php artisan migrate --force
```

### Issue: Settings not returned by API

**Solution**:
```bash
# Check if settings exist
php artisan tinker --execute="App\Models\Settings::all()->count()"

# Re-seed if needed
php artisan db:seed --class=SettingsSeeder --force

# Clear cache
php artisan cache:clear
```

### Issue: Admin panel can't access Settings

**Solution**:
```bash
# Optimize Filament
php artisan filament:optimize

# Clear Filament cache
php artisan filament:clear-cached-components

# Rebuild cache
php artisan filament:cache-components
```

---

## 📊 Monitoring

### Check Logs

```bash
# Application logs
tail -f storage/logs/laravel.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PHP-FPM logs
sudo tail -f /var/log/php8.3-fpm.log
```

### Monitor Performance

```bash
# Check response times
time curl -s https://adminautoscout.dev/api/settings/public > /dev/null

# Check database queries
php artisan telescope:clear
# Then monitor at: https://adminautoscout.dev/telescope
```

---

## 🔄 Rollback Plan

### If deployment fails:

```bash
# 1. Rollback database migration
php artisan migrate:rollback --step=1

# 2. Revert to previous commit
git reset --hard c54518e  # Previous commit
git pull origin main      # Re-sync

# 3. Clear caches
php artisan optimize:clear

# 4. Restore database backup (if needed)
php artisan db:restore backups/backup-YYYYMMDD-HHMMSS.sql

# 5. Restart services
php artisan queue:restart
sudo systemctl restart php8.3-fpm
```

---

## ✅ Success Criteria

Deployment is successful when:

- [ ] Settings API returns 200 OK
- [ ] Public settings JSON is valid
- [ ] Group settings endpoints work
- [ ] Admin panel Settings page loads
- [ ] 22 settings visible in admin
- [ ] Cache is working (fast response times)
- [ ] No errors in logs
- [ ] Frontend can fetch settings

---

## 📞 Support Contacts

**Server Issues**
- Laravel Forge Dashboard: https://forge.laravel.com
- Support: forge@laravel.com

**Database Issues**
- Check Forge DB panel
- Verify connection in `.env`

**Application Issues**
- Check logs: `storage/logs/laravel.log`
- Enable debug: `APP_DEBUG=true` (temporarily)

---

## 📝 Deployment Log Template

```markdown
## Deployment Log: Settings System

**Date**: _____________________
**Time**: _____________________
**Deployed By**: ______________

### Pre-Deployment
- [ ] Database backup created: ___________
- [ ] Git commit verified: aa399d4
- [ ] Maintenance mode enabled

### Deployment Steps
- [ ] Step 1: Backup completed
- [ ] Step 2: Maintenance mode ON
- [ ] Step 3: Code pulled (commit: aa399d4)
- [ ] Step 4: Composer install successful
- [ ] Step 5: Migrations run successfully
- [ ] Step 6: Settings seeded (22 records)
- [ ] Step 7: Caches cleared
- [ ] Step 8: Services restarted
- [ ] Step 9: Maintenance mode OFF
- [ ] Step 10: Verification passed

### Post-Deployment
- [ ] API test passed
- [ ] Admin panel test passed
- [ ] Frontend integration test passed
- [ ] No errors in logs

### Issues Encountered
_________________________________
_________________________________

### Resolution
_________________________________
_________________________________

**Status**: ✅ SUCCESS / ❌ FAILED / ⚠️ PARTIAL

**Notes**: 
_________________________________
_________________________________
```

---

## 🎯 Next Steps After Deployment

1. **Monitor for 24 hours**
   - Watch error logs
   - Monitor API response times
   - Check user reports

2. **Update Frontend**
   - Redeploy to Vercel
   - Test settings integration
   - Verify all locales work

3. **Documentation**
   - Update API documentation
   - Update admin user guide
   - Create video tutorial

4. **Performance Optimization**
   - Monitor cache hit rates
   - Optimize database queries
   - Add Redis caching if needed

---

**Prepared By**: GitHub Copilot  
**Version**: 1.0  
**Last Updated**: January 29, 2026
