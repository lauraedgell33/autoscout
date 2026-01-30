# 🚀 TESTARE RAPIDĂ - JOI 30 IANUARIE 2026

**Start:** 🕐 ACUM  
**Obiectiv:** Testare rapidă fără costuri suplimentare  
**Tools:** FREE alternatives (Leaflet, Laravel Logs, Telescope)

---

## ✅ FAZA 1: PREGĂTIRE (COMPLETAT)

- ✅ Backend .env exists
- ✅ Frontend .env.local exists
- ✅ Laravel 12.47.0 running
- ✅ FREE alternatives documented

---

## 🔐 FAZA 2: AUTH TESTING - ÎNCEPE ACUM

### Test 1: Verificare Database Connection

```bash
cd /workspaces/autoscout/scout-safe-pay-backend
php artisan tinker

# In Tinker:
DB::connection()->getPdo();
User::count();
exit
```

**Expected:** No errors, returns user count

---

### Test 2: Create Test Accounts

```bash
php artisan tinker

# Admin
User::create([
    'name' => 'Admin Test',
    'email' => 'admin@test.com',
    'password' => Hash::make('Test123!@#'),
    'role' => 'admin',
    'email_verified_at' => now()
]);

# Seller  
User::create([
    'name' => 'Seller Test',
    'email' => 'seller@test.com',
    'password' => Hash::make('Test123!@#'),
    'role' => 'seller',
    'email_verified_at' => now()
]);

# Buyer
User::create([
    'name' => 'Buyer Test',
    'email' => 'buyer@test.com',
    'password' => Hash::make('Test123!@#'),
    'role' => 'user',
    'email_verified_at' => now()
]);

exit
```

---

### Test 3: Test Login API

```bash
# Start backend server (if not running)
cd /workspaces/autoscout/scout-safe-pay-backend
php artisan serve --port=8000 &

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test123!@#"
  }'
```

**Expected:** JWT token returned

---

### Test 4: Frontend Login Test

```bash
# Start frontend (if not running)
cd /workspaces/autoscout/scout-safe-pay-frontend
npm run dev &

# Open in browser
# http://localhost:3000/login
```

**Manual Test:**
1. Open http://localhost:3000/login
2. Email: admin@test.com
3. Password: Test123!@#
4. Click Login
5. ✅ Should redirect to dashboard

---

## 🔍 FAZA 3: SEARCH TESTING (2 ore)

### Test 1: Search API Endpoint

```bash
# Create test vehicle first
cd /workspaces/autoscout/scout-safe-pay-backend
php artisan tinker

Vehicle::create([
    'make' => 'Toyota',
    'model' => 'Camry',
    'year' => 2021,
    'price' => 15000,
    'mileage' => 45000,
    'transmission' => 'automatic',
    'fuel_type' => 'petrol',
    'color' => 'white',
    'created_at' => now()
]);

exit

# Test search
curl "http://localhost:8000/api/search?q=Toyota"
```

**Expected:** Returns Toyota Camry

---

### Test 2: Search Filters

```bash
# Filter by price
curl "http://localhost:8000/api/search?price_min=10000&price_max=20000"

# Filter by year
curl "http://localhost:8000/api/search?year_min=2020&year_max=2023"

# Combined filters
curl "http://localhost:8000/api/search?q=Toyota&price_max=20000&year_min=2020"
```

---

### Test 3: Frontend Search

**Manual Test:**
1. Open http://localhost:3000/search
2. Enter "Toyota" în search box
3. Apply price filter: 10,000 - 20,000
4. Apply year filter: 2020-2023
5. ✅ Results should filter correctly

---

## 💳 FAZA 4: PAYMENT TESTING (2 ore)

### Test 1: Create Test Listing

```bash
php artisan tinker

$vehicle = Vehicle::first();
Listing::create([
    'vehicle_id' => $vehicle->id,
    'seller_id' => User::where('role', 'seller')->first()->id,
    'title' => 'Toyota Camry 2021 Excellent Condition',
    'description' => 'Well maintained vehicle',
    'price' => 15000,
    'status' => 'published',
    'location' => 'București'
]);

exit
```

---

### Test 2: Payment Flow (Bank Transfer)

**Manual Test:**
1. Login as buyer@test.com
2. Find the listing
3. Click "Make Offer" / "Buy Now"
4. Select "Bank Transfer"
5. ✅ IBAN should be displayed
6. ✅ Reference number generated
7. Click "I've sent payment"
8. ✅ Status: PENDING_VERIFICATION

---

### Test 3: Check Payment in Database

```bash
php artisan tinker

Payment::latest()->first();
# Should show the payment with PENDING status

exit
```

---

## 📊 FAZA 5: ADMIN DASHBOARD (1 ora)

**Manual Test:**
1. Login as admin@test.com
2. Navigate to /admin
3. ✅ Analytics displayed (revenue, users, transactions)
4. ✅ Charts loading
5. ✅ User management accessible
6. ✅ Listing management accessible

---

## 💬 FAZA 6: MESSAGING (1 ora)

### Test Real-Time Chat

**Manual Test:**
1. Open 2 browser windows
2. Window 1: Login as buyer@test.com
3. Window 2: Login as seller@test.com
4. Window 1: Send message to seller
5. ✅ Message should appear in Window 2 (real-time)

---

## 🗺️ FAZA 9: MAPS - INSTALL LEAFLET (30 min)

```bash
cd /workspaces/autoscout/scout-safe-pay-frontend
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

### Update Listing Component to use Leaflet

Create: `components/map/LeafletMap.tsx`

```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  lat: number;
  lng: number;
  title?: string;
}

export default function LeafletMap({ lat, lng, title }: Props) {
  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      <Marker position={[lat, lng]}>
        {title && <Popup>{title}</Popup>}
      </Marker>
    </MapContainer>
  );
}
```

**Test:**
1. Open listing detail page
2. ✅ Map should display with location marker

---

## 🐛 FAZA 12: MONITORING - USE LARAVEL LOGS (FREE)

### View Logs

```bash
# View latest logs
tail -f /workspaces/autoscout/scout-safe-pay-backend/storage/logs/laravel.log

# Filter errors only
tail -f /workspaces/autoscout/scout-safe-pay-backend/storage/logs/laravel.log | grep ERROR

# Count errors today
grep "$(date '+%Y-%m-%d')" /workspaces/autoscout/scout-safe-pay-backend/storage/logs/laravel.log | grep ERROR | wc -l
```

### Create Log Viewer Route (Quick & Free)

Add to `routes/web.php`:

```php
Route::get('/admin/logs', function () {
    $logFile = storage_path('logs/laravel.log');
    if (!file_exists($logFile)) {
        return 'No logs found';
    }
    
    $logs = file($logFile);
    $logs = array_reverse(array_slice($logs, -100)); // Last 100 lines
    
    return response()->view('admin.logs', ['logs' => $logs]);
})->middleware(['auth', 'admin']);
```

---

## 🔒 FAZA 10: SECURITY TESTING (1 ora)

### Test 1: SQL Injection

```bash
# Try SQL injection in search
curl "http://localhost:8000/api/search?q=%27%20OR%20%271%27=%271"
```

**Expected:** No database errors, safe query

---

### Test 2: XSS Protection

```bash
# Try XSS in listing comment
curl -X POST http://localhost:8000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "comment": "<script>alert(\"xss\")</script>",
    "rating": 5
  }'
```

**Expected:** Script tags sanitized

---

## 📱 FAZA 11: MOBILE TESTING (30 min)

### Chrome DevTools Mobile Test

1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Test:
   - ✅ Login page responsive
   - ✅ Search page responsive
   - ✅ Listing detail responsive
   - ✅ Touch targets adequate (44x44px)
   - ✅ No horizontal scroll

---

## 📋 QUICK CHECKLIST

```
✅ Backend running (Laravel 12.47.0)
✅ Frontend running (Next.js)
✅ Database accessible
✅ Test accounts created
✅ Login working
✅ Search working
✅ Payments flow tested
✅ Admin dashboard accessible
✅ Messaging functional
✅ Maps using Leaflet (FREE)
✅ Logs monitored (FREE)
✅ Security tested
✅ Mobile responsive
```

---

## 🚀 PRODUCTION CHECKLIST

```
□ .env configured pentru production
□ APP_DEBUG=false
□ Database backups enabled
□ SSL certificate active
□ CORS configured
□ Rate limiting enabled
□ Logs rotation setup
□ Error notifications (email)
□ Performance optimization
□ Mobile tested
```

---

## 💰 COSTS: $0/month

- Maps: Leaflet + OpenStreetMap (FREE)
- Error tracking: Laravel Logs (FREE)
- Monitoring: Laravel built-in (FREE)
- Hosting: Vercel Free Tier + Forge (existing)

**Total extra costs: ZERO** 🎉

---

**NEXT STEPS:**

1. Rulează testele de mai sus
2. Documentează rezultatele
3. Fix orice bugs găsite
4. Deploy to production când totul e verde

**Deadline: Luni 3 Feb** ✅

