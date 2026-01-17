# 🚀 DEPLOY COMPLET DIN DASHBOARD (Fără CLI)

## ✅ Prerequisites
- ✅ GitHub repo: https://github.com/anemettemadsen33/autoscout
- ✅ Laravel Cloud account: https://cloud.laravel.com/anemette-madsen
- ✅ Vercel account conectat cu GitHub

---

# PART 1: BACKEND - Laravel Cloud

## Step 1: Create Project pe Laravel Cloud

1. Mergi la: **https://cloud.laravel.com/anemette-madsen**

2. Click pe **"Create New Project"** sau **"New Project"**

3. **Project Configuration:**
   - **Name:** `autoscout-safetrade`
   - **Region:** `us-east-1` (sau cea mai apropiată)
   - **Source Control:** `GitHub`

4. Click **"Connect to GitHub"** (dacă nu e deja conectat)
   - Authorize Laravel Cloud
   - Select repositories: `anemettemadsen33/autoscout`

5. **Repository Settings:**
   - **Repository:** `anemettemadsen33/autoscout`
   - **Branch:** `main`
   - **Root Directory:** `scout-safe-pay-backend`
   - **Environment:** `Production`

6. Click **"Continue"** sau **"Next"**

---

## Step 2: Configure Build Settings

Laravel Cloud va detecta automat Laravel și va propune:

```yaml
Build Command:
  composer install --no-dev --optimize-autoloader
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache

Deploy Command:
  php artisan migrate --force
```

**Accept defaults** sau verifică că match-uiesc cu `vapor.yml`

Click **"Continue"**

---

## Step 3: Configure Environment Variables

Click pe **"Environment Variables"** sau **"Configure Environment"**

**Add these variables ONE BY ONE:**

### Core Application
```
APP_NAME=AutoScout24 SafeTrade
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_TIMEZONE=UTC
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

### Database
```
DB_CONNECTION=mysql
```
**Note:** DB credentials vor fi auto-set când creezi database

### Cache & Session
```
CACHE_DRIVER=redis
CACHE_PREFIX=autoscout
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

### Queue
```
QUEUE_CONNECTION=sqs
```

### Logging
```
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_DEPRECATIONS_CHANNEL=null
```

### Mail
```
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@autoscout24.com
MAIL_FROM_NAME=AutoScout24 SafeTrade
```

### Filesystem
```
FILESYSTEM_DISK=s3
```

### Security
```
BCRYPT_ROUNDS=12
```

### Admin Panel
```
FILAMENT_PATH=admin
```

### API
```
API_PREFIX=api
```

**SKIP for now (will add after Vercel deployment):**
- APP_URL
- FRONTEND_URL
- SANCTUM_STATEFUL_DOMAINS

Click **"Save"** or **"Continue"**

---

## Step 4: Create Database

1. În Project Dashboard, click pe **"Databases"** tab

2. Click **"Create Database"**

3. **Database Configuration:**
   - **Name:** `autoscout-db`
   - **Engine:** `MySQL 8.0`
   - **Instance Class:** `db.t3.micro` (cheapest, good for start)
   - **Allocated Storage:** `20 GB`
   - **Region:** Same as app (us-east-1)
   - **Public Access:** `No`

4. Click **"Create Database"**

5. **Wait 10-15 minutes** for AWS to provision

6. Once ready, database credentials are **automatically added** to environment

---

## Step 5: Create Redis Cache

1. Click pe **"Caches"** tab

2. Click **"Create Cache"**

3. **Cache Configuration:**
   - **Name:** `autoscout-cache`
   - **Node Type:** `cache.t3.micro` (cheapest)
   - **Region:** Same as app
   - **Number of Nodes:** `1`

4. Click **"Create Cache"**

5. **Wait 5-10 minutes** for AWS ElastiCache provisioning

6. Once ready, Redis credentials are **automatically added**

---

## Step 6: Configure Queue (SQS)

Queue is **automatically created** by Laravel Cloud.

If you need to manually create:
1. Click **"Queues"** tab
2. Click **"Create Queue"**
3. Name: `autoscout-queue`
4. Region: Same as app
5. Click **"Create"**

---

## Step 7: Deploy Backend!

1. Go back to **"Deployments"** tab

2. Click **"Deploy"** button (big orange button)

3. **Deployment Process:**
   - ⏳ Cloning repository
   - ⏳ Installing dependencies (composer install)
   - ⏳ Building application (cache configs)
   - ⏳ Running migrations
   - ⏳ Deploying to AWS Lambda
   - ⏳ Configuring CloudFront CDN
   - ✅ **DONE!**

4. **Duration:** 5-10 minutes

5. **Once complete, you'll see:**
   ```
   ✅ Deployment #1 - Success
   
   Production URL: https://xxxxx.vapor-farm-x1.com
   ```

6. **📝 COPY THIS URL!** You'll need it for frontend.

---

## Step 8: Test Backend

Open browser:
```
https://xxxxx.vapor-farm-x1.com/api/health
```

Should see JSON response or API documentation.

Test vehicles endpoint:
```
https://xxxxx.vapor-farm-x1.com/api/vehicles
```

---

## Step 9: View Logs

1. Click **"Logs"** tab
2. Real-time logs from Lambda functions
3. Filter by severity (Error, Warning, Info)

---

## Step 10: Configure Custom Domain (Optional)

1. Click **"Domains"** tab
2. Click **"Add Domain"**
3. Enter: `api.autoscout24.com`
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (5-20 minutes)

---

# PART 2: FRONTEND - Vercel

## Step 1: Import Project to Vercel

1. Mergi la: **https://vercel.com/dashboard**

2. Click pe **"Add New..."** → **"Project"**

3. **Import Git Repository:**
   - If GitHub connected: Select from list
   - If not connected: Click **"Continue with GitHub"**
   - Authorize Vercel

4. **Find your repository:**
   - Search: `autoscout`
   - Select: `anemettemadsen33/autoscout`

5. Click **"Import"**

---

## Step 2: Configure Build Settings

Vercel will **auto-detect Next.js**!

**Verify these settings:**

### Framework Preset
```
Framework: Next.js
```

### Root Directory
```
Root Directory: scout-safe-pay-frontend
```
**IMPORTANT:** Click **"Edit"** and set to `scout-safe-pay-frontend`

### Build & Development Settings
```
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
Development Command: npm run dev (auto-detected)
```

Leave these as **default** (Vercel knows Next.js)

---

## Step 3: Configure Environment Variables

Click on **"Environment Variables"** section

**Add these variables:**

### Backend API URL
```
Name: NEXT_PUBLIC_API_URL
Value: https://xxxxx.vapor-farm-x1.com/api
```
**Replace `xxxxx.vapor-farm-x1.com` with YOUR backend URL from Step 7 above!**

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://xxxxx.vapor-farm-x1.com/api
```

### Environment
```
Name: NODE_ENV
Value: production
```

**Select:** `Production`, `Preview`, and `Development` for all

Click **"Add"** for each variable

---

## Step 4: Deploy Frontend!

1. Click **"Deploy"** button (big blue button)

2. **Deployment Process:**
   - ⏳ Building Next.js application
   - ⏳ Installing dependencies (npm install)
   - ⏳ Generating static pages
   - ⏳ Optimizing images
   - ⏳ Deploying to Edge Network
   - ✅ **DONE!**

3. **Duration:** 3-5 minutes

4. **Once complete:**
   ```
   🎉 Congratulations!
   
   Your project is live:
   https://autoscout-xxxx.vercel.app
   ```

5. **📝 COPY THIS URL!** This is your frontend URL.

---

## Step 5: Test Frontend

Open browser:
```
https://autoscout-xxxx.vercel.app
```

Test all languages:
- `/en` - English
- `/de` - German
- `/es` - Spanish
- `/it` - Italian
- `/ro` - Romanian
- `/fr` - French

Test pages:
- `/en/marketplace`
- `/en/how-it-works`
- `/en/benefits`
- `/en/login`
- `/en/register`

---

## Step 6: Configure Custom Domain (Optional)

1. Go to Project Settings → **"Domains"**

2. Click **"Add"**

3. Enter your domain: `autoscout24.com`

4. Vercel will show DNS records to add:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

5. Add these records to your DNS provider

6. Wait for DNS propagation (5-60 minutes)

7. Vercel will **automatically provision SSL certificate**

---

# PART 3: Connect Frontend & Backend

## Step 1: Update Backend CORS

1. Go back to **Laravel Cloud Dashboard**

2. Project → **Environment Variables**

3. **Add/Update these:**

```
APP_URL=https://xxxxx.vapor-farm-x1.com
FRONTEND_URL=https://autoscout-xxxx.vercel.app
SANCTUM_STATEFUL_DOMAINS=autoscout-xxxx.vercel.app
SESSION_DOMAIN=.vercel.app
```

**Replace with your actual URLs!**

4. Click **"Save"**

5. **Redeploy backend:**
   - Deployments tab → Click **"Deploy"**
   - Or: Will auto-deploy on next git push

---

## Step 2: Verify Integration

1. Open frontend: `https://autoscout-xxxx.vercel.app/en/marketplace`

2. Open browser DevTools (F12) → Network tab

3. Reload page

4. Look for API requests to backend:
   ```
   Request URL: https://xxxxx.vapor-farm-x1.com/api/vehicles
   Status: 200 OK
   ```

5. If you see **CORS errors:**
   - Verify FRONTEND_URL in backend env vars
   - Redeploy backend
   - Clear browser cache

---

# 📊 SUMMARY - LIVE URLS

## Backend (Laravel Cloud)
```
API URL: https://xxxxx.vapor-farm-x1.com
API Docs: https://xxxxx.vapor-farm-x1.com/api/documentation
Admin: https://xxxxx.vapor-farm-x1.com/admin
Custom: https://api.autoscout24.com (if configured)
```

## Frontend (Vercel)
```
Website: https://autoscout-xxxx.vercel.app
English: https://autoscout-xxxx.vercel.app/en
German: https://autoscout-xxxx.vercel.app/de
Spanish: https://autoscout-xxxx.vercel.app/es
Custom: https://autoscout24.com (if configured)
```

---

# 🔄 Auto-Deploy Setup

## Laravel Cloud
1. Project Settings → **"GitHub Integration"**
2. Enable **"Auto Deploy"**
3. Select branch: `main`
4. Every push to `main` → auto-deploy backend

## Vercel
**Already enabled by default!**
- Every push to `main` → auto-deploy frontend
- Pull requests → preview deployments

---

# 🐛 Troubleshooting

## Backend Issues

### Database Connection Error
- Check: Databases tab → verify status is "Available"
- Check: Environment variables → DB credentials auto-set
- Wait: Full database provisioning (can take 15 min)

### 502 Bad Gateway
- Check: Logs tab for errors
- Check: Memory limits in Project Settings
- Increase: Memory allocation if needed

### Deployment Fails
- Check: Logs for build errors
- Verify: composer.json dependencies
- Check: PHP version compatibility (8.3)

## Frontend Issues

### API Requests Fail (CORS)
- Verify: FRONTEND_URL in backend env vars
- Verify: NEXT_PUBLIC_API_URL in frontend env vars
- Redeploy: Both backend and frontend

### 404 on Routes
- Verify: Root directory is `scout-safe-pay-frontend`
- Check: Build logs for errors
- Verify: All files committed to GitHub

### Images Not Loading
- Check: Image paths in code
- Verify: Public folder structure
- Check: Vercel build logs

---

# ✅ Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Backend URL obtained and tested
- [ ] Database created and running
- [ ] Redis cache created and running
- [ ] Frontend deployed successfully
- [ ] Frontend URL obtained and tested
- [ ] Backend CORS configured with frontend URL
- [ ] Backend redeployed with CORS config
- [ ] All 6 languages working on frontend
- [ ] API requests working (check DevTools)
- [ ] Authentication tested (login/register)
- [ ] Custom domains configured (optional)
- [ ] Auto-deploy enabled for both
- [ ] Team members invited (if applicable)

---

# 📚 Resources

- **Laravel Cloud Docs:** https://docs.vapor.build
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Repo:** https://github.com/anemettemadsen33/autoscout

---

# 🎉 Success!

Both applications are now live:
- ✅ Backend API on Laravel Cloud (AWS Lambda + RDS + Redis)
- ✅ Frontend on Vercel (Edge Network)
- ✅ Auto-deploy from GitHub
- ✅ SSL/HTTPS enabled
- ✅ Global CDN
- ✅ Production ready!

**Total deployment time:** ~30-45 minutes (including AWS provisioning)

---

**Next Steps:**
- Monitor deployments
- Check logs regularly
- Set up error tracking (Sentry)
- Configure domain emails
- Set up backups
- Monitor costs

**Congratulations! 🚀**
