# 🔧 Troubleshooting Guide - AutoScout24

## Deployment Status
**Last Update:** February 3, 2026  
**Commits Deployed:** 
- `e4c7405` - Authentication fixes + Camera feature
- `4877090` - KYC Camera & Selfie feature

---

## ✅ Issues Fixed

### 1. Authentication Session Not Persisting
**Problem:** User logged out after page refresh

**Solution Implemented:**
- Added `localStorage` backup for auth token
- Added `credentials: 'include'` for cookie support
- Token restoration on page reload from localStorage
- Proper cleanup on logout

**Files Modified:**
- `/src/store/auth-store.ts`

**How it works:**
```typescript
// Token stored in both Zustand (memory) and localStorage (persistent)
localStorage.setItem('auth_token', data.token);

// Token restored on app load
if (!token && typeof window !== 'undefined') {
  token = localStorage.getItem('auth_token');
}
```

### 2. KYC Camera Feature Deployment
**Problem:** Camera functionality not showing on deployed site

**Solution:**
- Verified all files committed to repository
- Force-pushed changes to trigger Vercel rebuild
- Component location: `/src/components/CameraCapture.tsx`
- Integration in: `/src/app/[locale]/checkout/[id]/page.tsx`

**Features Available:**
- ✅ Selfie capture with front camera
- ✅ ID document capture (front/back)
- ✅ Camera switching (front/back)
- ✅ Image preview and retake
- ✅ Dual mode: Camera or File Upload

---

## ⚠️ Known Issues

### 1. Image 404 Errors
**Error:** `Failed to load resource: 404`
```
/vehicles/primary/01KGCP40Y8M34HD73A2Q44WZKP.png
/vehicles/gallery/01KGCP40Y8M34HD73A2Q44WZKQ.png
```

**Cause:** Backend image paths incorrect or images not uploaded

**Solutions:**

#### Option A: Fix Backend Image URLs
Check Laravel storage configuration:
```php
// config/filesystems.php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
],
```

Run storage link:
```bash
php artisan storage:link
```

#### Option B: Update Image Paths in Database
```sql
UPDATE vehicles 
SET images = REPLACE(images, '/vehicles/', '/storage/vehicles/')
WHERE images LIKE '%/vehicles/%';
```

#### Option C: Frontend Fallback (Quick Fix)
Add fallback in vehicle display component:
```typescript
const imageSrc = vehicle.images?.[0] || '/placeholder-car.jpg'
```

### 2. Backend API 422 Error
**Error:** `adminautoscout.dev/api/login:1 Failed to load resource: 422`

**Possible Causes:**
1. CORS configuration
2. Missing CSRF token
3. Validation errors
4. Database connection issues

**Debug Steps:**

Check backend logs:
```bash
tail -f storage/logs/laravel.log
```

Verify CORS in `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [
    'https://scout-safe-pay-frontend-79q2tmh3s-anemetee.vercel.app',
    'http://localhost:3000',
],
'supports_credentials' => true,
```

Check `.env` backend:
```env
SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=scout-safe-pay-frontend-79q2tmh3s-anemetee.vercel.app,localhost:3000
```

### 3. Next.js Image Optimization 400 Error
**Error:** `/_next/image?url=...&w=1920&q=75:1 Failed to load resource: 400`

**Cause:** External image domain not configured

**Solution:**
Update `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'adminautoscout.dev',
      pathname: '/storage/**',
    },
    {
      protocol: 'https',
      hostname: 'adminautoscout.dev',
      pathname: '/vehicles/**',
    },
  ],
},
```

---

## 🚀 Vercel Deployment Monitoring

### Check Deployment Status
1. Visit: https://vercel.com/anemetee/scout-safe-pay-frontend
2. Check "Deployments" tab
3. Latest deployment should be from commit `e4c7405`

### Force Redeploy
If changes not reflecting:
```bash
# Trigger empty commit
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push origin main
```

Or via Vercel Dashboard:
1. Go to deployment
2. Click "..." menu
3. Select "Redeploy"

### View Build Logs
- Click on deployment
- View "Building" logs
- Check for errors in build process

---

## 🔍 Testing Authentication Flow

### 1. Test Login
```javascript
// Open browser console on: /en/login
localStorage.clear() // Clear existing session
// Login with valid credentials
// Check localStorage
console.log(localStorage.getItem('auth_token'))
// Should show token
```

### 2. Test Persistence
```javascript
// After login, refresh page
// Check if still logged in
console.log(localStorage.getItem('auth_token'))
// Should still show token
```

### 3. Test Logout
```javascript
// Click logout
console.log(localStorage.getItem('auth_token'))
// Should be null
```

---

## 🎥 Testing Camera Feature

### Desktop Testing
1. Go to: `/en/checkout/6`
2. Navigate to KYC step (step 3)
3. Click "Take Photo" or "Take Selfie"
4. Allow camera permissions
5. Capture image
6. Verify preview shows

### Mobile Testing
1. Open on mobile device
2. Same steps as desktop
3. Test front/back camera switching
4. Test touch controls

### Troubleshooting Camera
If camera doesn't work:
- Verify HTTPS is enabled (required for camera API)
- Check browser camera permissions
- Try different browser (Chrome recommended)
- Check browser console for errors

---

## 🛠️ Backend Fixes Needed

### 1. Fix Image Storage
```bash
cd scout-safe-pay-backend

# Create storage link
php artisan storage:link

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 2. Update Vehicle Image Paths
```php
// Create migration or run in tinker
php artisan tinker

$vehicles = App\Models\Vehicle::all();
foreach ($vehicles as $vehicle) {
    if ($vehicle->images) {
        $images = json_decode($vehicle->images, true);
        $fixed = array_map(function($img) {
            return str_replace('/vehicles/', '/storage/vehicles/', $img);
        }, $images);
        $vehicle->images = json_encode($fixed);
        $vehicle->save();
    }
}
```

### 3. Fix CORS for Vercel Domain
```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://scout-safe-pay-frontend-79q2tmh3s-anemetee.vercel.app',
        'http://localhost:3000',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

---

## 📊 Monitoring & Logging

### Frontend Errors
Check browser console (F12):
```javascript
// Filter by:
- Failed to load resource
- CORS errors
- 401/422 responses
```

### Backend Errors
```bash
# SSH to backend server
tail -f storage/logs/laravel.log
```

### API Requests
Enable debug mode in `.env.local`:
```env
NEXT_PUBLIC_API_DEBUG=true
```

This will log all API requests/responses in browser console.

---

## 📞 Quick Fixes Checklist

### User Can't Login
- [ ] Check network tab for 422 errors
- [ ] Verify CORS configuration
- [ ] Check backend logs
- [ ] Test with different credentials
- [ ] Clear browser cache/cookies

### Images Not Loading
- [ ] Check backend storage/public folder
- [ ] Verify storage link exists
- [ ] Check image paths in database
- [ ] Update next.config.ts domains
- [ ] Test image URL directly in browser

### Camera Not Working
- [ ] Verify HTTPS enabled
- [ ] Check browser permissions
- [ ] Test on different browser
- [ ] Check console for errors
- [ ] Verify component deployed

### Session Not Persisting
- [ ] Check localStorage has token
- [ ] Verify token format
- [ ] Test API /user endpoint with token
- [ ] Clear browser cache
- [ ] Re-login and test

---

## 🔄 Deployment Checklist

Before each deployment:
- [ ] Run `npm run build` locally
- [ ] Check for TypeScript errors
- [ ] Test authentication flow
- [ ] Test camera feature
- [ ] Verify image loading
- [ ] Check API connectivity
- [ ] Review console for errors

After deployment:
- [ ] Wait 2-3 minutes for Vercel
- [ ] Clear browser cache
- [ ] Test on live URL
- [ ] Verify new features work
- [ ] Check backend logs
- [ ] Monitor error reports

---

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://adminautoscout.dev/api
NEXT_PUBLIC_API_DEBUG=false
NEXT_PUBLIC_APP_URL=https://scout-safe-pay-frontend-79q2tmh3s-anemetee.vercel.app
```

### Backend (.env)
```env
APP_URL=https://adminautoscout.dev
FRONTEND_URL=https://scout-safe-pay-frontend-79q2tmh3s-anemetee.vercel.app
SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=scout-safe-pay-frontend-79q2tmh3s-anemetee.vercel.app
```

---

## 🎯 Expected Behavior After Fixes

1. ✅ User logs in → Token saved to localStorage
2. ✅ Page refresh → User still logged in
3. ✅ Navigate to checkout → KYC step shows camera options
4. ✅ Click "Take Photo" → Camera opens full screen
5. ✅ Capture image → Preview shown with retake option
6. ✅ Confirm photo → Returns to form with image
7. ✅ Submit form → Transaction created successfully
8. ✅ Vehicle images → Load without 404 errors
9. ✅ Logout → Token cleared from localStorage

---

## 📞 Support

If issues persist:
1. Check browser console for specific errors
2. Review backend logs
3. Test API endpoints with Postman
4. Verify network connectivity
5. Clear all caches (browser + server)

**Next Steps:**
1. Monitor Vercel deployment (2-3 minutes)
2. Test authentication on live site
3. Test camera feature on live site
4. Fix backend image storage issues
5. Update CORS configuration
