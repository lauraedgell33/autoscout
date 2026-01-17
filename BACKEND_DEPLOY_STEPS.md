# 🚀 Backend Deployment Steps - Laravel Cloud

## ✅ Pre-Deployment Checklist

- [x] Laravel Vapor Core installed
- [x] Vapor CLI installed (v1.66.0)
- [x] vapor.yml configured
- [x] APP_KEY generated
- [x] Environment variables prepared
- [x] Code pushed to GitHub

---

## 📋 STEP-BY-STEP GUIDE

### Step 1: Login to Laravel Cloud

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend
vapor login
```

**What happens:**
- Opens browser
- Login to: https://cloud.laravel.com/anemette-madsen
- Authenticates CLI with your account

---

### Step 2: Initialize Vapor Project

```bash
vapor init
```

**Prompts you'll see:**
1. **Select Team:** Choose your team (anemette-madsen)
2. **Project Name:** Enter `autoscout-safetrade`
3. **Region:** Select `us-east-1` (or preferred)
4. **Create project?** Yes

**Output:**
```
✔ Project created successfully
✔ Project ID: 12345
✔ vapor.yml updated
```

**IMPORTANT:** Copy the Project ID shown!

---

### Step 3: Update vapor.yml with Project ID

The `vapor init` command automatically updates the ID in `vapor.yml`, but verify:

```bash
cat vapor.yml | grep "^id:"
```

Should show:
```yaml
id: 12345  # Your actual project ID
```

If you need to update manually:
```bash
nano vapor.yml
# Change line 1: id: 1 → id: 12345
```

Commit if changed:
```bash
git add vapor.yml
git commit -m "Update Vapor project ID"
git push
```

---

### Step 4: Configure Environment Variables on Laravel Cloud

Go to: **https://cloud.laravel.com/anemette-madsen**

1. Click on project: **autoscout-safetrade**
2. Go to: **Environments** tab
3. Click: **Production**
4. Click: **Environment Variables** button

**Add these variables one by one:**

#### Core Application
```env
APP_NAME=AutoScout24 SafeTrade
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_TIMEZONE=UTC
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
```

#### Cache & Session
```env
CACHE_DRIVER=redis
CACHE_PREFIX=autoscout
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

#### Queue
```env
QUEUE_CONNECTION=sqs
```

#### Logging
```env
LOG_CHANNEL=stack
LOG_LEVEL=error
```

#### Mail (for now, use log)
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@autoscout24.com
MAIL_FROM_NAME=AutoScout24 SafeTrade
```

#### Filesystem
```env
FILESYSTEM_DISK=s3
```

#### Security
```env
BCRYPT_ROUNDS=12
```

#### Filament Admin
```env
FILAMENT_PATH=admin
```

**SKIP for now (will add after Vercel deployment):**
- `APP_URL`
- `FRONTEND_URL`
- `SANCTUM_STATEFUL_DOMAINS`

**NOTE:** Database, Redis, AWS credentials are AUTO-SET by Vapor!

---

### Step 5: Create Database

**Option A - Via CLI:**
```bash
vapor database:create production
```

Select:
- Database type: `mysql` or `postgres`
- Instance class: `db.t3.micro` (cheapest, good for start)
- Storage: `20 GB`
- Region: Same as your app

**Option B - Via Dashboard:**
1. Environments → Production → **Databases**
2. Click **Create Database**
3. Select options above
4. Wait 5-10 minutes for creation

**Output:**
```
✔ Database created: autoscout-db
✔ Credentials added to environment
```

---

### Step 6: Create Redis Cache

**Option A - Via CLI:**
```bash
vapor cache:create production
```

Select:
- Cache type: `cache.t3.micro` (cheapest)
- Region: Same as your app

**Option B - Via Dashboard:**
1. Environments → Production → **Caches**
2. Click **Create Cache**
3. Select options

**Output:**
```
✔ Cache created: autoscout-cache
✔ Credentials added to environment
```

---

### Step 7: Deploy Backend!

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend
vapor deploy production
```

**What happens:**
1. ⏳ Builds application (composer install, cache configs)
2. ⏳ Uploads assets to S3
3. ⏳ Deploys to AWS Lambda
4. ⏳ Runs migrations (`php artisan migrate --force`)
5. ⏳ Links storage
6. ✅ **DONE!**

**Duration:** 3-5 minutes

**Output at end:**
```
✅ Deployment #1 deployed successfully

Production URL: https://xxxxx.vapor-farm-x1.com
```

**📝 SAVE THIS URL!** You'll need it for:
- Frontend configuration
- Testing the API
- CORS setup

---

### Step 8: Test Backend Deployment

```bash
# Test health endpoint
curl https://xxxxx.vapor-farm-x1.com/api/health

# Or test in browser
open https://xxxxx.vapor-farm-x1.com/api/vehicles
```

Expected response:
```json
{
  "data": [...],
  "current_page": 1,
  ...
}
```

---

### Step 9: Seed Database (Optional)

```bash
vapor command production "php artisan db:seed"
```

Or run specific seeder:
```bash
vapor command production "php artisan db:seed --class=VehicleSeeder"
```

---

### Step 10: Update Environment Variables with URLs

After you have:
- Backend URL: `https://xxxxx.vapor-farm-x1.com`
- Frontend URL: `https://xxxxx.vercel.app` (from Vercel)

Go back to Laravel Cloud Dashboard:
1. Environments → Production → Environment Variables
2. **Add/Update:**

```env
APP_URL=https://xxxxx.vapor-farm-x1.com
FRONTEND_URL=https://xxxxx.vercel.app
SANCTUM_STATEFUL_DOMAINS=xxxxx.vercel.app
SESSION_DOMAIN=.vercel.app
```

3. Save changes

**Redeploy to apply changes:**
```bash
vapor deploy production
```

---

## 📊 Monitoring & Management

### View Logs
```bash
vapor logs production

# Stream logs in real-time
vapor logs production --tail
```

### View Metrics
```bash
vapor metrics production
```

### View Deployments
```bash
vapor deployments production
```

### Rollback (if needed)
```bash
vapor rollback production
```

### Run Artisan Commands
```bash
vapor command production "php artisan cache:clear"
vapor command production "php artisan route:list"
vapor command production "php artisan migrate:status"
```

### Access Tinker
```bash
vapor tinker production
```

### Scale Queue Workers
```bash
vapor queue:scale production 3
```

### View Database Info
```bash
vapor database:show production
```

---

## 🐛 Troubleshooting

### "No Vapor project found"
```bash
vapor init
```

### Database connection error
- Check if database is created: `vapor database:list`
- Check environment variables on dashboard
- Verify region matches app region

### 502 Bad Gateway
```bash
vapor logs production
# Check memory usage
vapor metrics production
```

If out of memory, edit `vapor.yml`:
```yaml
production:
    memory: 2048  # Increase from 1024
```

Then redeploy:
```bash
vapor deploy production
```

### Deployment fails
```bash
vapor deploy production --debug
```

### Cache/Queue issues
```bash
vapor command production "php artisan cache:clear"
vapor command production "php artisan queue:restart"
```

---

## ✅ Post-Deployment Checklist

- [ ] `vapor login` successful
- [ ] `vapor init` completed
- [ ] Project ID updated in vapor.yml
- [ ] Environment variables configured
- [ ] Database created
- [ ] Cache created
- [ ] First deployment successful
- [ ] Backend URL obtained and saved
- [ ] API endpoints tested
- [ ] Database seeded (optional)
- [ ] Logs checked for errors

---

## 📝 Important URLs

- **Laravel Cloud Dashboard:** https://cloud.laravel.com/anemette-madsen
- **Backend API:** `https://xxxxx.vapor-farm-x1.com`
- **API Docs:** `https://xxxxx.vapor-farm-x1.com/api/documentation`
- **Admin Panel:** `https://xxxxx.vapor-farm-x1.com/admin`

---

## 💡 Tips

1. **Keep APP_KEY safe** - don't commit to Git
2. **Use staging environment** for testing before production
3. **Monitor costs** on AWS console
4. **Set up alerts** for errors on Laravel Cloud dashboard
5. **Use custom domain** for production (configure on dashboard)

---

## 🎉 Success!

Once deployed, your backend is:
- ✅ Running on AWS Lambda (auto-scaling)
- ✅ Using RDS MySQL (managed database)
- ✅ Using ElastiCache Redis (managed cache)
- ✅ Using SQS (managed queue)
- ✅ Deployed via CloudFront CDN
- ✅ Protected by AWS Shield (DDoS protection)
- ✅ SSL/TLS enabled automatically

**Backend is now live and ready for frontend integration!** 🚀
