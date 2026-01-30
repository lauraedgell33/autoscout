# 🚀 COMENZI RAPIDE PENTRU TESTING - COPY-PASTE READY

## CONEXIUNI LA SERVERE

### Backend Forge SSH
```bash
ssh user@forge-domain.com
# sau
ssh deploy@api.domain.com
```

### Frontend Vercel Preview
```
https://vercel-app.vercel.app
```

---

## VERIFICĂRI INIȚIALE - ENVIRONMENT

### 1. Verificare Backend Environment (.env)

```bash
# Connect SSH
ssh deploy@api.domain.com

# Check critical env vars
grep -E "APP_ENV|DATABASE_" /home/forge/site/.env
grep -E "STRIPE|JWT|REDIS" /home/forge/site/.env
grep -E "MAIL|FRONTEND_URL|WEBSOCKET" /home/forge/site/.env

# Expected output:
# APP_ENV=production
# APP_DEBUG=false
# DATABASE_CONNECTION=mysql
# STRIPE_SECRET_KEY=sk_live_****
# JWT_SECRET=your_secret_key
```

### 2. Verificare Vercel Frontend Environment

```bash
# Check in Vercel dashboard or via CLI
vercel env list

# Should show all NEXT_PUBLIC_* variables
```

### 3. Health Check - Backend API

```bash
# Test backend health
curl -I https://api.domain.com/health

# Expected: HTTP 200 OK
# Response: {"status":"ok","timestamp":"..."}
```

### 4. Database Connection Test

```bash
# SSH into server
ssh deploy@api.domain.com

# Test database connection
cd /home/forge/site
php artisan tinker

# In Tinker:
>>> DB::connection()->getPdo();
>>> User::count();
>>> exit

# Should return user count without errors
```

---

## CREARE TEST ACCOUNTS - RAPID SETUP

```bash
ssh deploy@api.domain.com
cd /home/forge/site
php artisan tinker

# Admin Account
>>> User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => bcrypt('SecurePassword123!'),
    'role' => 'admin',
    'is_active' => true,
    'email_verified_at' => now()
]);

# Seller Account
>>> User::create([
    'name' => 'Test Seller',
    'email' => 'seller@test.com',
    'password' => bcrypt('SecurePassword123!'),
    'role' => 'seller',
    'is_active' => true,
    'email_verified_at' => now()
]);

# Buyer Account
>>> User::create([
    'name' => 'Test Buyer',
    'email' => 'buyer@test.com',
    'password' => bcrypt('SecurePassword123!'),
    'role' => 'user',
    'is_active' => true,
    'email_verified_at' => now()
]);

>>> exit
```

---

## STRIPE INTEGRATION VERIFICATION

```bash
# Test Stripe API credentials
curl https://api.stripe.com/v1/account \
  -u sk_live_YOUR_SECRET_KEY:

# Should return account info without auth errors

# Test Webhook URL (from Stripe dashboard)
curl -X POST https://api.domain.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test_signature" \
  -d '{"type":"charge.completed","data":{"object":{"id":"ch_test"}}}'

# Should return 200 OK (or 400 if sig invalid - that's ok for test)
```

---

## SENDGRID EMAIL TEST

```bash
# Test SendGrid API
curl --request GET \
  --url https://api.sendgrid.com/v3/mail_settings \
  --header "Authorization: Bearer SG.YOUR_API_KEY"

# Should return list of mail settings

# Test send email via Laravel
ssh deploy@api.domain.com
cd /home/forge/site
php artisan tinker

>>> use Illuminate\Support\Facades\Mail;
>>> Mail::raw('Test email body', function($m) {
    $m->to('your@email.com')->subject('Test Email');
});

>>> exit

# Check email delivery in 2 minutes
```

---

## PERFORMANCE TESTING - LOAD TEST

```bash
# Install Apache Bench (if not available)
apt-get install apache2-utils

# Load test search endpoint (100 concurrent, 1000 total requests)
ab -n 1000 -c 100 https://api.domain.com/api/search?q=toyota

# Key metrics to check in results:
# - Failed requests: 0
# - Requests per second: > 100
# - Time per request: < 500ms

# Save results to file
ab -n 1000 -c 100 https://api.domain.com/api/search?q=toyota > load_test_results.txt

# Other endpoints to test
ab -n 500 -c 50 https://api.domain.com/api/listings
ab -n 500 -c 50 https://api.domain.com/api/users/1
ab -n 500 -c 50 https://api.domain.com/api/analytics/dashboard
```

---

## SECURITY TESTING - QUICK CHECKS

### SQL Injection Test
```bash
# Try to search with SQL injection payload
curl "https://api.domain.com/api/search?q=%27%20OR%20%271%27=%271"

# Expected: Normal results (safe query)
# Or error message without database errors

# If database error visible → SECURITY ISSUE
```

### CSRF Token Check
```bash
# Make form request without CSRF token
curl -X POST https://api.domain.com/api/listings \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'

# Expected: 419 Unauthenticated / CSRF token error
# If no error → Missing CSRF protection
```

### HTTPS/SSL Check
```bash
# Check SSL certificate
curl -I https://api.domain.com

# Look for headers:
# Strict-Transport-Security (HSTS)
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY

# Check HTTP redirect to HTTPS
curl -I http://api.domain.com

# Should redirect 301 to https://
```

---

## DATABASE BACKUP & RESTORE

```bash
# Backup current database manually
ssh deploy@api.domain.com
cd /home/forge/site

# Create backup
php artisan backup:run

# List backups
ls -la storage/backups/

# Restore specific backup
php artisan backup:restore backup-file.tar.gz

# Test restore by checking data
php artisan tinker
>>> User::count();
>>> Listing::count();
>>> exit
```

---

## LOGS MONITORING

```bash
# SSH to server
ssh deploy@api.domain.com

# View real-time logs
tail -f /home/forge/site/storage/logs/laravel.log

# Filter specific errors
tail -f /home/forge/site/storage/logs/laravel.log | grep -i error

# Filter payment errors
tail -f /home/forge/site/storage/logs/laravel.log | grep -i payment

# Filter webhook events
tail -f /home/forge/site/storage/logs/laravel.log | grep -i webhook

# Count errors in last hour
grep "$(date '+%Y-%m-%d %H' --date='1 hour ago')" /home/forge/site/storage/logs/laravel.log | grep -i error | wc -l
```

---

## REDIS CACHE CHECK

```bash
# SSH to server
ssh deploy@api.domain.com

# Check Redis is running
redis-cli ping
# Expected output: PONG

# Check cache stats
redis-cli INFO stats

# Flush cache (if needed)
redis-cli FLUSHALL

# Monitor Redis in real-time
redis-cli MONITOR

# Check specific key
redis-cli GET "cache:key:name"
```

---

## WEBHOOK TESTING

### Stripe Webhook Test
```bash
# Simulate successful charge
curl -X POST https://api.domain.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=1326853478,v1=..."  \
  -d '{
    "type": "charge.succeeded",
    "data": {
      "object": {
        "id": "ch_test123",
        "amount": 1000,
        "currency": "usd",
        "status": "succeeded",
        "customer": "cus_test123"
      }
    }
  }'

# Check logs for webhook processing
tail -f /home/forge/site/storage/logs/laravel.log | grep "charge.succeeded"
```

### Bank Transfer Webhook Test
```bash
# Simulate bank transfer confirmation
curl -X POST https://api.domain.com/api/webhooks/bank-transfer \
  -H "Authorization: Bearer webhook_secret_key" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment_confirmed",
    "reference": "REF-001234",
    "amount": 10000,
    "currency": "RON",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'

# Check database for updated transaction
ssh deploy@api.domain.com
php artisan tinker
>>> DB::table('payments')->where('reference', 'REF-001234')->first();
>>> exit
```

---

## API TESTING WITH CURL - COMMON FLOWS

### Login & Get Token
```bash
# 1. Login
TOKEN_RESPONSE=$(curl -s -X POST https://api.domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@test.com",
    "password": "SecurePassword123!"
  }')

# 2. Extract token
TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Use token for authenticated requests
curl -H "Authorization: Bearer $TOKEN" https://api.domain.com/api/users/profile
```

### Create & Search Listing
```bash
# Assume TOKEN is set from previous login

# 1. Create vehicle
VEHICLE=$(curl -s -X POST https://api.domain.com/api/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Camry",
    "year": 2021,
    "price": 15000,
    "mileage": 45000,
    "transmission": "automatic",
    "fuel_type": "petrol",
    "color": "white"
  }')

VEHICLE_ID=$(echo $VEHICLE | grep -o '"id":[0-9]*' | cut -d':' -f2)

# 2. Create listing
curl -s -X POST https://api.domain.com/api/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": '$VEHICLE_ID',
    "title": "Beautiful Toyota Camry 2021",
    "description": "Well maintained, clean condition",
    "location": "București",
    "latitude": 44.4268,
    "longitude": 26.1025
  }'

# 3. Search listings
curl -s "https://api.domain.com/api/search?q=Toyota&price_min=10000&price_max=20000"
```

---

## POSTMAN COLLECTION QUICK START

```bash
# 1. Export environment variables from .env
ssh deploy@api.domain.com
grep -E "APP_NAME|APP_URL|JWT_SECRET" /home/forge/site/.env > /tmp/env_vars.txt

# 2. Create Postman environment JSON
cat > postman_environment.json << 'EOF'
{
  "name": "Production",
  "values": [
    {
      "key": "base_url",
      "value": "https://api.domain.com"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    },
    {
      "key": "admin_email",
      "value": "admin@test.com"
    },
    {
      "key": "admin_password",
      "value": "SecurePassword123!"
    }
  ]
}
EOF

# 3. Import in Postman and run collection
```

---

## MONITORING DASHBOARD CHECKS

### Check Error Rate
```bash
# SSH to server
ssh deploy@api.domain.com

# Count errors from today
grep "$(date '+%Y-%m-%d')" /home/forge/site/storage/logs/laravel.log | grep -i error | wc -l

# Count errors by type
grep "$(date '+%Y-%m-%d')" /home/forge/site/storage/logs/laravel.log | grep -i error | cut -d: -f5 | sort | uniq -c

# Show last 10 errors
grep -i error /home/forge/site/storage/logs/laravel.log | tail -10
```

### Check Slow Queries
```bash
# Enable slow query log in database
# Then check for slow queries
tail -100 /var/log/mysql/slow-queries.log

# Or from command line
mysql -u root -p database_name -e "SHOW PROCESSLIST;"
```

### Check Server Resources
```bash
# CPU usage
top -b -n 1 | head -20

# Memory usage
free -h

# Disk usage
df -h

# Network connections
netstat -an | grep ESTABLISHED | wc -l
```

---

## DEPLOYMENT VERIFICATION - FINAL CHECKS

```bash
# 1. Frontend deployed to Vercel
curl -I https://vercel-app.vercel.app
# Expected: HTTP 200 OK

# 2. Backend API health
curl https://api.domain.com/health
# Expected: {"status":"ok"}

# 3. Database accessible
ssh deploy@api.domain.com
php artisan tinker
>>> DB::connection()->getPdo();
>>> exit

# 4. Email working
php artisan tinker
>>> Mail::raw('Test', fn($m) => $m->to('your@email.com'));
>>> exit

# 5. Stripe configured
curl https://api.stripe.com/v1/account -u sk_live_key:

# 6. Storage working (S3/CDN)
# Upload test image to listing and verify it loads

# 7. Real-time WebSocket connected
# Open browser console, check WebSocket connection

# 8. Monitoring tools reporting
# Check Sentry/DataDog dashboard for events

# 9. Logs flowing properly
tail -f /home/forge/site/storage/logs/laravel.log

# 10. Backups running
ls -la /path/to/backups/ | tail -5
```

---

## ROLLBACK PROCEDURE (IF NEEDED)

```bash
# 1. SSH to Forge
ssh deploy@api.domain.com

# 2. Check deployment history
cd /home/forge/site
git log --oneline | head -10

# 3. Revert to previous commit
git revert HEAD
git push origin main

# 4. Verify deployment
cd /home/forge/site
php artisan migrate:refresh (if schema changed)
php artisan cache:clear

# 5. Test health
curl https://api.domain.com/health
```

---

## TROUBLESHOOTING QUICK COMMANDS

### Payment not processing
```bash
# Check transaction in database
ssh deploy@api.domain.com
php artisan tinker
>>> DB::table('payments')->where('status', 'pending')->get();
>>> exit

# Check Stripe webhook logs
tail -f /home/forge/site/storage/logs/laravel.log | grep -i stripe
```

### Email not sending
```bash
# Check SendGrid configuration
ssh deploy@api.domain.com
grep MAIL /home/forge/site/.env

# Test send
php artisan tinker
>>> Mail::raw('Test', fn($m) => $m->to('test@gmail.com'));
```

### High memory usage
```bash
# Check what's consuming memory
ps aux --sort=-%mem | head
free -h
sync; echo 3 > /proc/sys/vm/drop_caches

# Restart services if needed
sudo systemctl restart php-fpm
sudo systemctl restart nginx
```

### Database connection errors
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check connections
mysql -u forge -ppassword -e "SHOW PROCESSLIST;"

# Restart if needed
sudo systemctl restart mysql
```

---

## FINAL PRODUCTION CHECKLIST

```bash
#!/bin/bash

echo "🚀 PRODUCTION DEPLOYMENT CHECKLIST"
echo "===================================="
echo ""

# 1. Backend health
echo "1. Backend health check..."
curl -s https://api.domain.com/health && echo "✅ Backend OK" || echo "❌ Backend FAILED"

# 2. Frontend health
echo "2. Frontend health check..."
curl -s -I https://vercel-app.vercel.app | head -1 | grep 200 && echo "✅ Frontend OK" || echo "❌ Frontend FAILED"

# 3. Database connectivity
echo "3. Database connectivity..."
ssh deploy@api.domain.com "php artisan tinker << 'EOF'
DB::connection()->getPdo();
puts 'Database OK'
exit
EOF" && echo "✅ Database OK" || echo "❌ Database FAILED"

# 4. Stripe connectivity
echo "4. Stripe API connectivity..."
curl -s https://api.stripe.com/v1/account -u sk_live_key: | grep "id" > /dev/null && echo "✅ Stripe OK" || echo "❌ Stripe FAILED"

# 5. Email service
echo "5. Email service..."
curl -s -X GET https://api.sendgrid.com/v3/mail_settings -H "Authorization: Bearer $SENDGRID_KEY" | grep "enabled" > /dev/null && echo "✅ Email OK" || echo "❌ Email FAILED"

# 6. Cache (Redis)
echo "6. Redis cache..."
ssh deploy@api.domain.com "redis-cli ping" | grep PONG && echo "✅ Cache OK" || echo "❌ Cache FAILED"

# 7. Backups
echo "7. Database backups..."
ssh deploy@api.domain.com "ls /home/forge/backups/ | wc -l" | grep -E "[1-9]" && echo "✅ Backups OK" || echo "❌ Backups FAILED"

echo ""
echo "===================================="
echo "✅ ALL SYSTEMS GO FOR PRODUCTION"
echo "Deployment approved!"
```

---

**Ready to test! Use these commands to verify each component.** 🎯

