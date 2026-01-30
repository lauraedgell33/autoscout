# ⚡ QUICK TEST COMMANDS REFERENCE

## 🔌 PRE-TEST CHECKLIST

```bash
# 1. Verify Laravel backend is running
ps aux | grep "php artisan serve"

# 2. Verify Next.js frontend is ready
cd /workspaces/autoscout/scout-safe-pay-frontend && npm run dev &

# 3. Check database connection
cd /workspaces/autoscout/scout-safe-pay-backend && php artisan tinker --execute="DB::connection()->getPdo(); echo 'Database: OK';"

# 4. Check API health
curl http://localhost:8000/api/health

# 5. View recent errors
tail -20 /workspaces/autoscout/scout-safe-pay-backend/storage/logs/laravel.log
```

---

## 🧪 QUICK TEST SUITE (Copy-Paste Ready)

### TEST 1: Health Check
```bash
echo "=== Health Check ===" && \
curl http://localhost:8000/api/health && \
echo -e "\n✅ Server is running"
```

### TEST 2: Error Logging
```bash
echo "=== Testing Error Logging ===" && \
curl -X POST http://localhost:8000/api/errors \
  -H "Content-Type: application/json" \
  -d '{"message":"Test error","url":"http://test.com","timestamp":"2026-01-30T12:00:00Z"}' && \
echo -e "\n✅ Error logged successfully"
```

### TEST 3: Security Violations
```bash
echo "=== Testing Security Logging ===" && \
curl -X POST http://localhost:8000/api/security/violations \
  -H "Content-Type: application/json" \
  -d '{"documentUri":"http://test.com","violatedDirective":"script-src","blockedURI":"http://evil.com"}' && \
echo -e "\n✅ Security violation logged"
```

### TEST 4: Vehicle Search
```bash
echo "=== Testing Vehicle Search ===" && \
curl "http://localhost:8000/api/vehicles?per_page=5" | jq '.data | length' && \
echo "✅ Vehicle search working"
```

### TEST 5: User Registration
```bash
echo "=== Testing Registration ===" && \
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User $(date +%s)\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"Test@1234\",\"password_confirmation\":\"Test@1234\"}" | jq . && \
echo "✅ Registration endpoint working"
```

### TEST 6: Login
```bash
echo "=== Testing Login ===" && \
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' | jq -r '.token') && \
echo "Token: $TOKEN" && \
if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then echo "✅ Login working"; else echo "❌ Login failed"; fi
```

### TEST 7: Admin Errors Endpoint
```bash
echo "=== Testing Admin Errors Endpoint ===" && \
TOKEN="your_admin_token_here" && \
curl "http://localhost:8000/api/admin/errors" \
  -H "Authorization: Bearer $TOKEN" | jq '.' && \
echo "✅ Admin errors endpoint working"
```

### TEST 8: Admin Error Statistics
```bash
echo "=== Testing Error Statistics ===" && \
TOKEN="your_admin_token_here" && \
curl "http://localhost:8000/api/admin/errors/statistics" \
  -H "Authorization: Bearer $TOKEN" | jq '.' && \
echo "✅ Error statistics endpoint working"
```

### TEST 9: Database Query - All Vehicles
```bash
cd /workspaces/autoscout/scout-safe-pay-backend && \
php artisan tinker --execute="
\$vehicles = DB::table('vehicles')->count();
echo 'Total vehicles: ' . \$vehicles;
" | grep -v Xdebug && \
echo "✅ Database query working"
```

### TEST 10: Database Query - Vehicles with Coordinates
```bash
cd /workspaces/autoscout/scout-safe-pay-backend && \
php artisan tinker --execute="
\$withCoords = DB::table('vehicles')->whereNotNull('latitude')->whereNotNull('longitude')->count();
echo 'Vehicles with coordinates: ' . \$withCoords;
" | grep -v Xdebug && \
echo "✅ Coordinate query working"
```

### TEST 11: Frontend Build Check
```bash
cd /workspaces/autoscout/scout-safe-pay-frontend && \
npm run build && \
echo "✅ Frontend builds successfully"
```

### TEST 12: Performance Test - API Response
```bash
echo "=== Performance Test ===" && \
for i in {1..3}; do
  echo "Request $i:"
  time curl -s "http://localhost:8000/api/vehicles?per_page=10" | jq '.total'
done && \
echo "✅ Performance acceptable"
```

---

## 📊 BATCH TEST ALL PHASES

```bash
#!/bin/bash
echo "Starting comprehensive test suite..."

echo -e "\n🔸 PHASE 1: Health Check"
curl -s http://localhost:8000/api/health | jq '.' || echo "❌ Failed"

echo -e "\n🔸 PHASE 2: Error Logging"
curl -s -X POST http://localhost:8000/api/errors \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' | jq '.' || echo "❌ Failed"

echo -e "\n🔸 PHASE 3: Vehicle Search"
curl -s "http://localhost:8000/api/vehicles?per_page=5" | jq '.data | length' || echo "❌ Failed"

echo -e "\n🔸 PHASE 4: Database Check"
cd /workspaces/autoscout/scout-safe-pay-backend && \
php artisan tinker --execute="echo DB::table('vehicles')->count();" 2>/dev/null | grep -v Xdebug || echo "❌ Failed"

echo -e "\n✅ Basic test suite complete!"
```

---

## 🔍 DEBUGGING TIPS

### Check Laravel Logs in Real-Time
```bash
tail -f /workspaces/autoscout/scout-safe-pay-backend/storage/logs/laravel.log
```

### Clear Laravel Cache
```bash
cd /workspaces/autoscout/scout-safe-pay-backend && \
php artisan cache:clear && \
php artisan view:clear && \
echo "✅ Cache cleared"
```

### Check Current API Routes
```bash
cd /workspaces/autoscout/scout-safe-pay-backend && \
php artisan route:list | grep -E "errors|violations" | head -10
```

### View Database Records
```bash
cd /workspaces/autoscout/scout-safe-pay-backend && \
php artisan tinker --execute="
echo 'Latest errors:' . PHP_EOL;
\$errors = DB::table('log')->latest()->limit(5)->get();
foreach(\$errors as \$error) {
  echo \$error->message . PHP_EOL;
}
"
```

### Test WebSocket Connection (if applicable)
```bash
# Install websocat if needed
# apt-get install websocat

# Connect to WebSocket
websocat "ws://localhost:6001/app/KEY?protocol=7&client=js-2.3.3&version=7&flash=false"
```

---

## 🚀 STRESS TEST (Optional)

### Load Test - 100 Requests
```bash
ab -n 100 -c 10 http://localhost:8000/api/vehicles?per_page=10
```

### Load Test - Search Query
```bash
ab -n 100 -c 10 "http://localhost:8000/api/vehicles?make=BMW&price_min=10000&price_max=50000"
```

### Concurrent Requests
```bash
seq 1 50 | xargs -P 10 -I {} curl -s "http://localhost:8000/api/health" | grep -c '{"status":"ok"}'
```

---

## 📈 EXPECTED RESULTS

✅ **Health Check:** `{"status":"ok","timestamp":"..."}` (< 100ms)

✅ **Error Logging:** `{"status":"logged"}` (< 100ms)

✅ **Vehicle Search:** `{"data":[...], "total": X}` (< 500ms)

✅ **Database Check:** `"8"` or similar count (< 200ms)

✅ **Admin Errors:** `{"errors":[...], "total": X}` (< 500ms)

---

## 🎯 NEXT STEPS

1. **Copy one test above** into terminal
2. **Verify output** matches expected results
3. **If ✅ passes:** Continue to next test
4. **If ❌ fails:** Check logs and debug
5. **Repeat for all phases** until complete

---

**Good luck! You've got this! 🚀**
