# 🚀 Quick Deploy Commands

## Prerequisites
- [ ] Vercel CLI installed (✅ Done)
- [ ] Vercel account created (sign up: https://vercel.com/signup)
- [ ] GitHub repository (recommended)
- [ ] Laravel Forge account (sign up: https://forge.laravel.com)

---

## 🎯 FRONTEND DEPLOYMENT (Vercel)

### Method 1: CLI Deploy (Fastest - 5 minutes)

```bash
# 1. Navigate to frontend directory
cd /home/x/Documents/scout/scout-safe-pay-frontend

# 2. Login to Vercel (opens browser)
vercel login

# 3. Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Select your account]
# - Link to existing project? No
# - Project name? scout-safe-pay-frontend
# - Directory? ./
# - Override settings? No

# 4. Your site will be live at:
# https://scout-safe-pay-frontend.vercel.app
```

### Method 2: GitHub Deploy (Recommended - 10 minutes)

```bash
# 1. Initialize Git (if not already)
cd /home/x/Documents/scout/scout-safe-pay-frontend
git init
git add .
git commit -m "Initial production deployment"

# 2. Create GitHub repository
# Go to: https://github.com/new
# Create repo: scout-safe-pay-frontend

# 3. Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/scout-safe-pay-frontend.git
git push -u origin main

# 4. Connect to Vercel
# - Go to: https://vercel.com/new
# - Click "Import Git Repository"
# - Select: scout-safe-pay-frontend
# - Click "Import"
# - Configure:
#   Framework: Next.js (auto-detected)
#   Root Directory: ./
#   Build Command: npm run build
#   Output Directory: .next
# - Click "Deploy"

# 5. Add Environment Variables in Vercel Dashboard
# Go to: Project Settings → Environment Variables
# Add these:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true

# 6. Redeploy to apply env vars
# Go to Deployments → Click "..." → Redeploy
```

### Add Custom Domain

```bash
# In Vercel Dashboard:
# 1. Go to Project Settings → Domains
# 2. Add domain: www.yourdomain.com
# 3. Add domain: yourdomain.com

# 4. Configure DNS at your domain provider:
# Type: CNAME, Name: www, Value: cname.vercel-dns.com
# Type: A, Name: @, Value: 76.76.21.21

# 5. Wait for SSL (auto-provisions in ~1 hour)
```

---

## 🛠️ BACKEND DEPLOYMENT (Laravel Forge)

### Step 1: Create Forge Account
```
1. Go to: https://forge.laravel.com
2. Sign up (free 5-day trial)
3. Connect payment method
```

### Step 2: Provision Server
```
1. Forge Dashboard → Servers → Create Server
2. Choose:
   Provider: DigitalOcean (easiest)
   Server Size: 2GB RAM ($12/month)
   PHP Version: 8.2
   Database: MySQL 8.0
   Region: Closest to your users
3. Click "Create Server"
4. Wait 5-10 minutes for provisioning
```

### Step 3: Create Site
```
1. Your Server → Sites → New Site
2. Enter:
   Root Domain: api.yourdomain.com
   Project Type: Laravel
   Web Directory: /public
3. Click "Add Site"

4. Configure DNS:
   Type: A
   Name: api
   Value: [Server IP from Forge]
```

### Step 4: Install SSL
```
1. Site → SSL → LetsEncrypt
2. Enter domain: api.yourdomain.com
3. Click "Obtain Certificate"
4. Wait 1-2 minutes
5. Click "Activate"
```

### Step 5: Deploy Laravel Backend

#### Option A: Git Deployment
```
1. Site → App → Git Repository
2. Connect GitHub
3. Enter: YOUR_USERNAME/scout-safe-pay-backend
4. Branch: main
5. Click "Install Repository"

6. Edit Deploy Script (Site → App → Deploy Script):
   (Already pre-configured by Forge)

7. Enable Quick Deploy:
   Toggle "Quick Deploy" ON
   
8. Click "Deploy Now"
```

#### Option B: Manual SFTP Upload
```
1. Get SFTP credentials from Forge
2. Connect with FileZilla/Cyberduck
3. Upload backend files to:
   /home/forge/api.yourdomain.com
4. Run deploy via Forge button
```

### Step 6: Configure Environment
```
1. Site → App → Environment
2. Update .env:

APP_NAME="AutoScout24 SafeTrade API"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

# Database (auto-filled by Forge)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=forge
DB_USERNAME=forge
DB_PASSWORD=[AUTO-GENERATED]

# CORS - Add frontend domain
FRONTEND_URL=https://www.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com

3. Click "Save"
```

### Step 7: Run Migrations
```
# Via Forge Terminal (Site → Terminal):
cd /home/forge/api.yourdomain.com
php artisan migrate --force
php artisan db:seed --force
php artisan optimize

# Or via SSH:
ssh forge@[SERVER-IP]
cd /home/forge/api.yourdomain.com
php artisan migrate --force
```

### Step 8: Enable Queue (Optional)
```
1. Server → Daemons → New Daemon
2. Enter:
   Command: php artisan queue:work redis --sleep=3 --tries=3
   User: forge
   Directory: /home/forge/api.yourdomain.com
3. Click "Create Daemon"
```

### Step 9: Enable Scheduler
```
1. Site → Scheduler
2. Toggle "Enable Scheduler" ON
(Forge auto-adds cron job)
```

---

## 🔗 CONNECT FRONTEND & BACKEND

### Update Frontend API URL
```
# In Vercel Dashboard:
1. Project Settings → Environment Variables
2. Update:
   NEXT_PUBLIC_API_URL = https://api.yourdomain.com/api
3. Redeploy
```

### Update Backend CORS
```
# In your Laravel backend code:
# Edit: config/cors.php

'allowed_origins' => [
    'https://www.yourdomain.com',
    'https://yourdomain.com',
],

'allowed_origins_patterns' => [
    '/^https:\/\/.*\.vercel\.app$/', // For preview deployments
],

# Commit and push:
git add config/cors.php
git commit -m "Update CORS for production"
git push origin main

# Forge will auto-deploy if Quick Deploy is on
```

---

## ✅ VERIFICATION CHECKLIST

### Test Frontend
```bash
# Homepage
curl https://www.yourdomain.com

# API health check from browser console
fetch('https://api.yourdomain.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Test Backend
```bash
# API health endpoint
curl https://api.yourdomain.com/api/health

# Test CORS
curl -H "Origin: https://www.yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://api.yourdomain.com/api/vehicles
```

### Checklist
- [ ] Frontend loads at www.yourdomain.com
- [ ] Backend API responds at api.yourdomain.com
- [ ] SSL certificates active (both)
- [ ] API calls work from frontend
- [ ] CORS headers present
- [ ] Database connected
- [ ] Migrations ran successfully

---

## 📞 GETTING HELP

### If Frontend Deploy Fails
```
1. Check Vercel build logs
2. Verify package.json scripts
3. Check Environment Variables
4. Contact: https://vercel.com/support
```

### If Backend Deploy Fails
```
1. Check Forge deployment logs
2. Check Laravel logs: storage/logs/laravel.log
3. SSH and run: php artisan optimize:clear
4. Contact: https://forge.laravel.com/support
```

---

## 💡 QUICK TIPS

1. **First time?** Use Method 2 (GitHub) for both - it's more reliable
2. **Custom domain?** Add it after first successful deploy
3. **SSL not working?** Wait 1 hour for DNS propagation
4. **CORS errors?** Double-check backend config/cors.php
5. **Build failing?** Clear Vercel cache and redeploy
6. **Database issues?** Check Forge environment variables

---

## 🎯 NEXT STEPS AFTER DEPLOY

1. **Monitor:**
   - Vercel Analytics
   - Forge Server Metrics
   
2. **Optimize:**
   - Run Lighthouse audit
   - Check Core Web Vitals
   
3. **Secure:**
   - Set up Sentry for error tracking
   - Enable rate limiting on backend
   
4. **Scale:**
   - Add Redis caching
   - Enable CDN
   - Upgrade server if needed

---

## 📈 COSTS SUMMARY

- Vercel Pro: $20/month
- Forge: $12/month
- DigitalOcean Server: $12/month
- Domain: ~$12/year
- **Total: ~$45/month** + domain

---

**Ready to Deploy?** Start with Frontend (5 min), then Backend (15 min)! 🚀
