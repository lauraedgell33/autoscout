# 🚀 VERCEL + FORGE DEPLOYMENT GUIDE

## 📋 Overview

This guide covers deploying:
- **Frontend:** Next.js on Vercel
- **Backend:** Laravel on Forge

---

## 🎯 PART 1: VERCEL FRONTEND DEPLOYMENT

### Prerequisites
- ✅ Vercel CLI installed (done)
- ✅ GitHub repository (recommended)
- ✅ Vercel account (sign up at vercel.com)

### Step 1: Prepare Environment Variables

Create production environment variables that will be added to Vercel:

```bash
# Required Variables (add these in Vercel Dashboard)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

### Step 2: Login to Vercel

```bash
cd scout-safe-pay-frontend
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy to Vercel

#### Option A: Deploy via CLI (Quick)

```bash
# Deploy to production
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? scout-safe-pay-frontend
# - Directory? ./
# - Override settings? No
```

#### Option B: Deploy via GitHub (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Production ready deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/scout-safe-pay-frontend.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm install`

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables:
     ```
     NEXT_PUBLIC_API_URL = https://api.yourdomain.com/api
     NEXT_PUBLIC_SITE_URL = https://www.yourdomain.com
     NEXT_PUBLIC_ENABLE_ANALYTICS = true
     NEXT_PUBLIC_ENABLE_ERROR_TRACKING = true
     ```
   - Set for: Production, Preview, Development

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `https://your-project.vercel.app`

### Step 4: Custom Domain Setup

1. **Add Custom Domain:**
   - Go to Project Settings → Domains
   - Add domain: `www.yourdomain.com`
   - Add domain: `yourdomain.com` (will redirect to www)

2. **Configure DNS:**
   
   Add these DNS records at your domain provider:

   **For Vercel:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

3. **SSL Certificate:**
   - Vercel automatically provisions SSL
   - Wait ~1 hour for DNS propagation
   - Certificate will auto-renew

### Step 5: Verify Deployment

Check these endpoints:
- https://www.yourdomain.com
- https://www.yourdomain.com/en
- https://www.yourdomain.com/de
- https://www.yourdomain.com/sitemap.xml

---

## 🛠️ PART 2: LARAVEL FORGE BACKEND DEPLOYMENT

### Prerequisites
- ✅ Forge account (forge.laravel.com)
- ✅ Server provisioned (DigitalOcean, AWS, etc.)
- ✅ Domain for API (e.g., api.yourdomain.com)

### Step 1: Create Server on Forge

1. **Provision Server:**
   - Go to Forge Dashboard → Servers → Create Server
   - Choose provider: DigitalOcean / AWS / Linode
   - Server size: $12/month (2GB RAM) minimum
   - PHP Version: 8.2 or higher
   - Database: MySQL 8.0
   - Node.js: Latest LTS

2. **Wait for Provisioning:**
   - Takes 5-10 minutes
   - Forge will install: Nginx, PHP, MySQL, Node.js, Redis

### Step 2: Create Site on Forge

1. **Add Site:**
   - Go to your server → Sites → New Site
   - Root Domain: `api.yourdomain.com`
   - Project Type: Laravel
   - Web Directory: `/public`

2. **Configure DNS:**
   
   Add A record at your domain provider:
   ```
   Type: A
   Name: api
   Value: [Your Server IP from Forge]
   ```

### Step 3: Install SSL Certificate

1. **In Forge:**
   - Go to Site → SSL
   - Click "LetsEncrypt"
   - Enter domain: `api.yourdomain.com`
   - Click "Obtain Certificate"
   - Wait 1-2 minutes

2. **Activate SSL:**
   - After certificate is issued
   - Click "Activate"
   - Site will now use HTTPS

### Step 4: Deploy Laravel Backend

#### Option A: Git Repository (Recommended)

1. **Connect Repository:**
   - Go to Site → App → Git Repository
   - Connect GitHub/GitLab/Bitbucket
   - Enter repository: `yourusername/scout-safe-pay-backend`
   - Branch: `main`
   - Click "Install Repository"

2. **Configure Deploy Script:**
   
   Edit the deploy script (Site → App → Deploy Script):
   ```bash
   cd /home/forge/api.yourdomain.com
   git pull origin main
   
   composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
   
   php artisan down
   
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan event:cache
   
   php artisan up
   
   php artisan queue:restart
   
   npm ci --production
   npm run build
   ```

3. **Enable Quick Deploy:**
   - Toggle "Quick Deploy" ON
   - Every push to `main` will auto-deploy

#### Option B: Manual Upload via SFTP

If not using Git:
1. Connect via SFTP (credentials in Forge)
2. Upload files to `/home/forge/api.yourdomain.com`
3. Run deploy script manually

### Step 5: Configure Environment

1. **Edit Environment File:**
   - Go to Site → App → Environment
   - Update `.env` variables:

   ```env
   APP_NAME="AutoScout24 SafeTrade API"
   APP_ENV=production
   APP_KEY=base64:YOUR_APP_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://api.yourdomain.com
   
   # Database
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=forge
   DB_USERNAME=forge
   DB_PASSWORD=[AUTO-GENERATED-PASSWORD]
   
   # CORS - Allow Frontend Domain
   FRONTEND_URL=https://www.yourdomain.com
   SANCTUM_STATEFUL_DOMAINS=www.yourdomain.com
   SESSION_DOMAIN=.yourdomain.com
   
   # Queue (if using)
   QUEUE_CONNECTION=redis
   
   # Cache
   CACHE_DRIVER=redis
   SESSION_DRIVER=redis
   
   # Redis
   REDIS_HOST=127.0.0.1
   REDIS_PASSWORD=null
   REDIS_PORT=6379
   
   # Mail (configure your SMTP)
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=noreply@yourdomain.com
   MAIL_FROM_NAME="${APP_NAME}"
   ```

2. **Save Environment**

### Step 6: Run Database Migrations

1. **SSH into Server:**
   ```bash
   ssh forge@[SERVER-IP]
   cd /home/forge/api.yourdomain.com
   php artisan migrate --force
   php artisan db:seed --force  # If you have seeders
   ```

2. **Or use Forge Terminal:**
   - Go to Site → Terminal
   - Run commands directly

### Step 7: Configure Queue Worker (Optional)

If your app uses queues:

1. **Create Daemon:**
   - Go to Server → Daemons → New Daemon
   - Command: `php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600`
   - User: `forge`
   - Directory: `/home/forge/api.yourdomain.com`
   - Processes: 1

2. **Start Daemon:**
   - Daemon will auto-start and restart if crashed

### Step 8: Configure Scheduler (Cron)

If using Laravel Scheduler:

1. **Enable Scheduler:**
   - Go to Site → Scheduler
   - Toggle "Enable Scheduler" ON
   - Forge automatically adds cron job:
     ```
     * * * * * cd /home/forge/api.yourdomain.com && php artisan schedule:run >> /dev/null 2>&1
     ```

### Step 9: Optimize Laravel

SSH into server and run:

```bash
cd /home/forge/api.yourdomain.com

# Clear all caches
php artisan optimize:clear

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Optimize Composer autoloader
composer dump-autoload --optimize

# Set permissions
chmod -R 755 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

---

## 🔗 PART 3: CONNECTING FRONTEND & BACKEND

### Update Frontend Environment on Vercel

1. **Go to Vercel Dashboard:**
   - Project Settings → Environment Variables

2. **Update API URL:**
   ```
   NEXT_PUBLIC_API_URL = https://api.yourdomain.com/api
   ```

3. **Redeploy:**
   - Go to Deployments
   - Click "Redeploy" on latest deployment
   - Or push new commit to trigger deploy

### Update Backend CORS on Forge

1. **Edit `config/cors.php`:**
   ```php
   'allowed_origins' => [
       env('FRONTEND_URL', 'http://localhost:3005'),
       'https://www.yourdomain.com',
       'https://yourdomain.com'
   ],
   
   'allowed_origins_patterns' => [
       '/^https:\/\/.*\.vercel\.app$/', // Allow Vercel preview deployments
   ],
   ```

2. **Commit and push:**
   ```bash
   git add config/cors.php
   git commit -m "Update CORS for production"
   git push origin main
   ```

3. **Forge will auto-deploy** (if Quick Deploy enabled)

### Test Connection

```bash
# Test API from frontend domain
curl https://www.yourdomain.com
# Should load Next.js app

# Test API endpoint
curl https://api.yourdomain.com/api/health
# Should return: {"status":"ok"}

# Test CORS
curl -H "Origin: https://www.yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://api.yourdomain.com/api/vehicles
# Should return CORS headers
```

---

## 📊 PART 4: POST-DEPLOYMENT CHECKLIST

### Frontend (Vercel)
- [ ] Site loads at custom domain
- [ ] All language routes work (/en, /de, etc.)
- [ ] API calls reach backend
- [ ] Environment variables set correctly
- [ ] SSL certificate active
- [ ] Sitemap accessible
- [ ] Robots.txt accessible

### Backend (Forge)
- [ ] API responds at api.yourdomain.com
- [ ] SSL certificate active
- [ ] Database connected
- [ ] Migrations run successfully
- [ ] CORS configured for frontend domain
- [ ] Queue worker running (if used)
- [ ] Scheduler running (if used)
- [ ] Email sending works

### Connection
- [ ] Frontend can fetch data from backend
- [ ] Authentication works across domains
- [ ] CORS headers present
- [ ] Cookies work (if using Sanctum)

---

## 🔧 TROUBLESHOOTING

### Frontend Issues

**Problem: API calls fail with CORS error**
- Check CORS configuration in Laravel backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check browser console for exact error

**Problem: Environment variables not working**
- Redeploy after changing env vars
- Make sure var names start with NEXT_PUBLIC_
- Check Vercel dashboard → Environment Variables

**Problem: Build fails on Vercel**
- Check build logs in Vercel dashboard
- Verify package.json scripts are correct
- Ensure all dependencies are listed

### Backend Issues

**Problem: 500 Internal Server Error**
- Check Laravel logs: `storage/logs/laravel.log`
- Enable debug mode temporarily: `APP_DEBUG=true`
- Check Nginx error log: `/var/log/nginx/error.log`

**Problem: Database connection failed**
- Verify DB credentials in .env
- Check MySQL is running: `sudo systemctl status mysql`
- Test connection: `php artisan db:show`

**Problem: Migrations fail**
- Check database exists
- Verify user has permissions
- Run migrations manually via SSH

---

## 📈 MONITORING & MAINTENANCE

### Vercel Monitoring
- Analytics: Built-in Vercel Analytics
- Errors: Integrate Sentry (see DEPLOYMENT.md)
- Performance: Vercel Speed Insights

### Forge Monitoring
- Server Metrics: Built-in Forge monitoring
- Uptime: Use UptimeRobot or Pingdom
- Logs: Check via Forge → Logs

### Regular Maintenance
- **Weekly:** Check error logs
- **Monthly:** Review performance metrics
- **Quarterly:** Update dependencies
- **As needed:** Scale server resources

---

## 💰 ESTIMATED COSTS

### Vercel
- **Hobby:** Free (personal projects)
- **Pro:** $20/month (commercial use)
- **Bandwidth:** 100GB/month included

### Forge + Server
- **Forge:** $12/month per server
- **Server (DigitalOcean):** $12-24/month (2-4GB RAM)
- **Total:** ~$24-36/month

### Domain & SSL
- **Domain:** $10-15/year
- **SSL:** Free (Let's Encrypt)

### Total Monthly: ~$30-50

---

## 🎯 QUICK START COMMANDS

### Deploy Frontend to Vercel
```bash
cd scout-safe-pay-frontend
vercel --prod
```

### Deploy Backend via Forge
```bash
# Push to main branch (if Git connected)
git push origin main

# Or manually via SSH
ssh forge@[SERVER-IP]
cd /home/forge/api.yourdomain.com
git pull origin main
php artisan migrate --force
php artisan optimize
```

### Check Status
```bash
# Frontend
curl https://www.yourdomain.com

# Backend API
curl https://api.yourdomain.com/api/health
```

---

## 📞 SUPPORT

- **Vercel Docs:** https://vercel.com/docs
- **Forge Docs:** https://forge.laravel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Laravel Docs:** https://laravel.com/docs

---

**Last Updated:** 2026-01-19  
**Version:** 1.0  
**Ready for Production!** 🚀
