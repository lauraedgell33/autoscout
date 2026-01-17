# 🚀 Complete Deployment Guide - AutoScout24 SafeTrade

## 📋 Deployment Strategy

### Backend → Laravel Cloud (Vapor)
- **Platform**: https://cloud.laravel.com/anemette-madsen
- **Technology**: Laravel 12 + PHP 8.3
- **Infrastructure**: AWS Lambda + RDS + Redis + SQS
- **Cost**: ~$50-150/month

### Frontend → Vercel
- **Platform**: https://vercel.com
- **Technology**: Next.js 16.1.1 + i18n (6 languages)
- **Infrastructure**: Edge Network + Serverless Functions
- **Cost**: FREE (Hobby tier) sau $20/month (Pro)

---

## 🔧 PART 1: Backend Deployment (Laravel Cloud)

### Step 1: Generate APP_KEY
```bash
cd /home/x/Documents/scout/scout-safe-pay-backend
php artisan key:generate --show
```
**Output:** `base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=`
**Save this!** Will be needed for Laravel Cloud env variables.

### Step 2: Login to Vapor
```bash
vapor login
```
Opens browser → Login to https://cloud.laravel.com/anemette-madsen

### Step 3: Initialize Project
```bash
vapor init
```
- Select your team
- Create new project: "autoscout-safetrade"
- Copy project ID

### Step 4: Update vapor.yml
Edit `scout-safe-pay-backend/vapor.yml`:
```yaml
id: YOUR_PROJECT_ID_HERE  # Replace with ID from vapor init
name: autoscout-safetrade
# ... rest stays the same
```

Commit changes:
```bash
git add vapor.yml
git commit -m "Update Vapor project ID"
git push
```

### Step 5: Configure Environment Variables

On **Laravel Cloud Dashboard** (https://cloud.laravel.com/anemette-madsen):
1. Select project "autoscout-safetrade"
2. Environments → Production → Environment Variables
3. Add these variables:

```env
APP_NAME="AutoScout24 SafeTrade"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_URL=https://your-vapor-url.vapor-farm-x1.com

DB_CONNECTION=mysql
# Database credentials will be auto-configured by Vapor

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=sqs

# Frontend CORS
FRONTEND_URL=https://your-vercel-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
SESSION_DOMAIN=.your-domain.com

# Mail
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@autoscout24.com
MAIL_FROM_NAME="AutoScout24 SafeTrade"
```

### Step 6: Create Resources
```bash
# Create database (or use existing from dashboard)
vapor database:create production

# Create cache
vapor cache:create production

# Queue is auto-created
```

### Step 7: Deploy Backend! 🚀
```bash
cd /home/x/Documents/scout/scout-safe-pay-backend
vapor deploy production
```

**Wait 3-5 minutes...**

**Output will show:**
- ✅ Build completed
- ✅ Upload to S3
- ✅ Deploy to Lambda
- ✅ Run migrations
- ✅ **Your API URL**: `https://xxxxxxx.vapor-farm-x1.com`

**Save the API URL!** Needed for frontend.

### Step 8: Test Backend
```bash
curl https://your-vapor-url.vapor-farm-x1.com/api/health
```

---

## 🎨 PART 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend API URL

Edit `scout-safe-pay-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-vapor-url.vapor-farm-x1.com/api
NEXT_PUBLIC_API_BASE_URL=https://your-vapor-url.vapor-farm-x1.com/api
```

Commit:
```bash
cd /home/x/Documents/scout
git add scout-safe-pay-frontend/.env.local
git commit -m "Update API URL for production"
git push
```

### Step 2: Login to Vercel
```bash
vercel login
```
Opens browser → Login with GitHub/Email

### Step 3: Deploy Frontend
```bash
cd /home/x/Documents/scout/scout-safe-pay-frontend
vercel --prod
```

**Vercel will:**
1. ✅ Detect Next.js automatically
2. ✅ Install dependencies
3. ✅ Build application
4. ✅ Deploy to edge network
5. ✅ Give you production URL

**Output:**
```
✅ Production: https://autoscout-xxxx.vercel.app
```

### Step 4: Configure Custom Domain (Optional)

On **Vercel Dashboard** (https://vercel.com/dashboard):
1. Select project
2. Settings → Domains
3. Add domain: `autoscout24.com`
4. Update DNS records:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### Step 5: Update Backend CORS

Go back to **Laravel Cloud** → Environment Variables:
```env
FRONTEND_URL=https://autoscout-xxxx.vercel.app
SANCTUM_STATEFUL_DOMAINS=autoscout-xxxx.vercel.app
```

Redeploy backend:
```bash
cd /home/x/Documents/scout/scout-safe-pay-backend
vapor deploy production
```

### Step 6: Test Complete Application

1. Open frontend: `https://autoscout-xxxx.vercel.app`
2. Test all languages: `/en`, `/de`, `/es`, `/it`, `/ro`, `/fr`
3. Test authentication: Login/Register
4. Test API: Marketplace, Vehicle details

---

## 📊 Environment Variables Summary

### Backend (Laravel Cloud)
```env
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_URL=https://your-vapor-url.vapor-farm-x1.com
FRONTEND_URL=https://autoscout-xxxx.vercel.app
SANCTUM_STATEFUL_DOMAINS=autoscout-xxxx.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-vapor-url.vapor-farm-x1.com/api
```

---

## 🔄 Continuous Deployment

### Vercel (Auto-deploy from GitHub)
1. Connect GitHub repo on Vercel Dashboard
2. Every push to `main` → auto-deploy
3. Pull requests → preview deployments

### Laravel Cloud (Manual deploy)
```bash
cd scout-safe-pay-backend
vapor deploy production
```

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check logs
vapor logs production

# Check metrics
vapor metrics production

# Rollback
vapor rollback production

# Run commands
vapor command production "php artisan cache:clear"
```

### Frontend Issues
```bash
# Check logs on Vercel Dashboard
# Or redeploy:
cd scout-safe-pay-frontend
vercel --prod
```

### CORS Errors
- Verify `FRONTEND_URL` on Laravel Cloud
- Verify `NEXT_PUBLIC_API_URL` on Vercel
- Redeploy both after changes

---

## 💰 Total Cost Estimate

| Service | Cost |
|---------|------|
| **Laravel Cloud** (Backend) | $19-99/month (plan) |
| **AWS Services** (included) | ~$30-50/month |
| **Vercel** (Frontend) | FREE (or $20/month Pro) |
| **Domain** (optional) | ~$12/year |
| **Total** | **~$50-170/month** |

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed on Laravel Cloud
- [ ] Backend URL obtained
- [ ] Frontend env updated with backend URL
- [ ] Frontend deployed on Vercel
- [ ] Frontend URL obtained
- [ ] Backend CORS configured with frontend URL
- [ ] Backend redeployed with CORS
- [ ] All 6 languages working
- [ ] Authentication working
- [ ] API calls successful
- [ ] Custom domains configured (optional)
- [ ] DNS propagated (if custom domains)
- [ ] SSL certificates active
- [ ] Database seeded
- [ ] Queue workers running

---

## 🎉 Live URLs

**Backend API:**
- Default: `https://xxxxxxx.vapor-farm-x1.com`
- Custom: `https://api.autoscout24.com` (if configured)

**Frontend:**
- Default: `https://autoscout-xxxx.vercel.app`
- Custom: `https://autoscout24.com` (if configured)

**Test:**
- EN: `https://autoscout-xxxx.vercel.app/en`
- DE: `https://autoscout-xxxx.vercel.app/de`
- ES: `https://autoscout-xxxx.vercel.app/es`

---

## 📚 Resources

- **Laravel Cloud**: https://cloud.laravel.com
- **Vapor Docs**: https://docs.vapor.build
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Ready to deploy? Follow the steps above! 🚀**
