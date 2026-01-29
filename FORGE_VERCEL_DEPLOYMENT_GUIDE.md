# 🚀 SafeTrade Production Deployment Guide - Forge & Vercel

## 📋 Quick Start

Deploy your SafeTrade application to production in 2 steps:

```bash
# Backend Deployment (Forge)
cd scout-safe-pay-backend
./deploy-forge.sh

# Frontend Deployment (Vercel)
cd scout-safe-pay-frontend
./deploy-vercel.sh
```

---

## 🔧 STEP 1: Configure Forge (Backend)

### 1.1 Create Laravel Forge Account
1. Visit [forge.laravel.com](https://forge.laravel.com)
2. Sign up or log in
3. Create a new server or use existing one

### 1.2 Create New Site in Forge
1. Go to your server in Forge
2. Click "New Site"
3. Fill in:
   - **Domain**: `api.safetrade.com` (or your domain)
   - **Root Domain**: `safetrade.com`
   - **Web Directory**: `/public`
4. Click "Create Site"

### 1.3 Configure PHP Environment
1. In Forge, go to Site → PHP CLI Version
2. Select PHP 8.2 or higher
3. Go to Environment → set production environment variables:

```bash
APP_NAME=SafeTrade
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.safetrade.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-database-host
DB_PORT=3306
DB_DATABASE=safetrade_production
DB_USERNAME=forge
DB_PASSWORD=your-secure-password

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your-mailgun-email
MAIL_PASSWORD=your-mailgun-password
MAIL_FROM_ADDRESS=noreply@safetrade.com

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Queue
QUEUE_CONNECTION=redis

# Security
APP_KEY=base64:your-application-key
```

### 1.4 Enable GitHub Deployment

**In Forge:**
1. Go to Site → Deploy
2. Click "Refresh Repository"
3. Select your GitHub repository
4. Copy the **Deployment Trigger URL**

**Save the URL:**
```bash
export FORGE_DEPLOY_URL="https://forge.laravel.com/deploy/..."
```

### 1.5 Setup Database

In Forge:
1. Go to Databases → Create Database
2. Name: `safetrade_production`
3. Go to Site → SSH → Connect and run migrations:

```bash
php artisan migrate --force
php artisan db:seed --force
php artisan cache:clear
php artisan config:clear
```

---

## 🔧 STEP 2: Configure Vercel (Frontend)

### 2.1 Create Vercel Account
1. Visit [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "Add New..." → "Project"

### 2.2 Import from GitHub

1. Select your repository
2. Click "Import"
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `scout-safe-pay-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Set Environment Variables

In Vercel Project Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://api.safetrade.com
NEXT_PUBLIC_APP_NAME=SafeTrade
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Add any other required variables
```

### 2.4 Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain
3. Follow DNS configuration steps

---

## 📦 STEP 3: Deployment Process

### Option A: Automatic Deployment (Recommended)

Both platforms support automatic deployments:

**Forge:**
- Pushes to `main` branch automatically trigger deployment
- Check deployment history in Site → Deploy

**Vercel:**
- All pushes to `main` branch automatically deploy
- Preview deployments for pull requests

### Option B: Manual Deployment

#### Backend (Forge):
```bash
cd scout-safe-pay-backend
./deploy-forge.sh
```

What it does:
- ✅ Checks prerequisites
- ✅ Commits changes to git
- ✅ Pushes to GitHub
- ✅ Triggers Forge deployment
- ✅ Monitors deployment progress
- ✅ Verifies health endpoints

#### Frontend (Vercel):
```bash
cd scout-safe-pay-frontend
./deploy-vercel.sh
```

What it does:
- ✅ Checks prerequisites
- ✅ Commits changes to git
- ✅ Installs dependencies
- ✅ Builds project
- ✅ Deploys to Vercel
- ✅ Verifies deployment health

---

## ✅ STEP 4: Verification

### Backend Health Check

```bash
# Basic health
curl https://api.safetrade.com/api/health

# Detailed metrics
curl https://api.safetrade.com/api/health/detailed
```

Expected response:
```json
{
  "status": "healthy",
  "database": "ok",
  "cache": "ok",
  "storage": "ok",
  "email": "ok"
}
```

### Frontend Check

1. Visit your Vercel domain
2. Check browser console for errors
3. Verify API connectivity:
   - Open DevTools → Network tab
   - Try creating an order
   - Verify API calls reach your backend

### Run Smoke Tests

```bash
# In backend directory
php artisan test tests/Feature/HealthControllerTest.php

# In frontend directory
npm test -- --testPathPattern=integration
```

---

## 🔒 Security Configuration

### SSL/TLS Certificate

**Forge:** Automatically provides SSL via Let's Encrypt
**Vercel:** Automatically provides SSL

### Firewall Rules

In Forge → Firewall:
```
Allow: SSH (22)
Allow: HTTP (80)
Allow: HTTPS (443)
Block: Everything else
```

### CORS Configuration

In backend `config/cors.php`:
```php
'allowed_origins' => [
    'https://safetrade.vercel.app',
    'https://www.safetrade.com',
],
```

---

## 📊 Monitoring & Debugging

### Real-time Logs

**Forge Logs:**
```bash
# SSH into server
ssh forge@your-server-ip

# View Laravel logs
tail -f /home/forge/default/storage/logs/laravel.log

# View Nginx errors
tail -f /var/log/nginx/error.log
```

**Vercel Logs:**
- Visit Vercel Dashboard → Deployments
- Click on deployment to view logs

### Performance Monitoring

**Setup New Relic:**

Backend:
```bash
composer require newrelic/newrelic-php-agent-installer
php artisan newrelic:install
```

Frontend:
```bash
npm install @newrelic/browser-agent
```

---

## 🚨 Troubleshooting

### Deployment Fails on Forge

**Issue:** Build command fails
```bash
# SSH into server and check
ssh forge@your-server-ip
cd /home/forge/default
php artisan migrate:refresh --force
composer install --no-interaction --prefer-dist --optimize-autoloader
```

**Issue:** Database connection error
- Verify DB credentials in .env
- Check database server is running
- Verify firewall allows connection

**Issue:** Email not sending
- Test SMTP configuration
- Check Mailgun credentials
- Review email logs: `/storage/logs/laravel.log`

### Deployment Fails on Vercel

**Issue:** Build fails
```bash
# Check next.config.ts for errors
npm run build

# Clear cache and rebuild
npm ci --force
npm run build
```

**Issue:** API connection fails
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check CORS configuration on backend
- Test API directly: `curl https://api.safetrade.com/api/health`

**Issue:** Images not loading
- Verify images path in `public/` directory
- Check next.config.ts for image configuration

---

## 📋 Deployment Checklist

### Before Deployment

- [ ] All tests passing (`php artisan test` + `npm test`)
- [ ] No console errors in browser
- [ ] Environment variables configured
- [ ] Database migrations created
- [ ] API health check working locally
- [ ] Frontend builds without warnings
- [ ] Code reviewed and merged to main branch
- [ ] Database backup created

### After Deployment

- [ ] Backend API responding (check `/api/health`)
- [ ] Frontend loads without errors
- [ ] Can create test order
- [ ] Email notifications sending
- [ ] PDF generation working
- [ ] Admin dashboard accessible
- [ ] Error tracking (Sentry) working
- [ ] Performance metrics visible

### Post-Deployment (24 hours)

- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Verify no database errors
- [ ] Test all payment flows
- [ ] Review user feedback
- [ ] Check email delivery
- [ ] Monitor server resources

---

## 🔄 Deployment Workflow

### Standard Deployment Process

```
1. Local Development
   ↓
2. Test all features
   ↓
3. Commit & push to main
   ↓
4. GitHub Actions run (if configured)
   ↓
5. Automatic deployment to Forge (backend)
   ↓
6. Automatic deployment to Vercel (frontend)
   ↓
7. Health checks verify deployment
   ↓
8. Monitor for issues (24 hours)
   ↓
9. Declare production launch successful
```

### Manual Deployment (if needed)

```bash
# Backend
cd scout-safe-pay-backend
./deploy-forge.sh

# Frontend
cd scout-safe-pay-frontend
./deploy-vercel.sh
```

---

## 📱 Key Endpoints

**Backend (Forge):**
- API Base: `https://api.safetrade.com`
- Health: `https://api.safetrade.com/api/health`
- Detailed: `https://api.safetrade.com/api/health/detailed`

**Frontend (Vercel):**
- Website: `https://safetrade.vercel.app`
- Or custom domain: `https://safetrade.com`

---

## 🆘 Support

### Common Commands

```bash
# View deployment history
forge site:logs

# Restart application
forge site:restart

# Clear cache
php artisan cache:clear
php artisan config:clear

# Check database
php artisan tinker
>>> DB::connection()->getPdo();

# Monitor queue jobs
php artisan queue:failed
php artisan queue:retry all
```

### Getting Help

- **Forge Support:** [forge.laravel.com/docs](https://forge.laravel.com/docs)
- **Vercel Support:** [vercel.com/docs](https://vercel.com/docs)
- **Laravel Docs:** [laravel.com/docs](https://laravel.com/docs)

---

## 🎉 You're Live!

Congratulations! Your SafeTrade application is now in production.

**Monitor it regularly:**
- Check health endpoints daily
- Review error logs
- Monitor API performance
- Track user feedback
- Update dependencies regularly

**Keep it secure:**
- Regularly update dependencies
- Monitor for security vulnerabilities
- Keep backups current
- Test disaster recovery procedures

🚀 **Your production system is now running!** 🚀
