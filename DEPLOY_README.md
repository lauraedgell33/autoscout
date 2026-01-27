# 🚀 Scout Safe Pay - Quick Deployment Guide

## 📋 Overview

This project is configured for deployment on:
- **Backend:** Railway (Recommended - FREE) or Laravel Cloud (Paid)
- **Frontend:** Vercel (FREE)

## ⚡ Quick Start

### 🎯 Recommended: Railway (FREE)

**Backend pe Railway + Frontend pe Vercel**

```bash
# 1. Deploy backend pe Railway
cat RAILWAY_QUICK_START.md  # Citește ghidul rapid

# 2. Deploy frontend pe Vercel
cd scout-safe-pay-frontend
vercel --prod
```

**Documentație:**
- **Quick Start:** [RAILWAY_QUICK_START.md](RAILWAY_QUICK_START.md) - 5 minute
- **Ghid Complet:** [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md) - Pas cu pas

**De ce Railway?**
- ✅ **GRATUIT** - $5 credit/lună (suficient pentru dev)
- ✅ Database MySQL inclus
- ✅ Deploy în 5 minute
- ✅ Nu necesită card de credit

---

### Option 1: Automated Deployment (Laravel Cloud - PAID)

```bash
# From project root
./deploy-all.sh
```

This interactive script will guide you through:
1. Backend deployment to Laravel Cloud
2. Frontend deployment to Vercel
3. Configuration of CORS and environment variables

### Option 2: Manual Deployment

#### Backend (Laravel Cloud)

```bash
cd scout-safe-pay-backend
./deploy.sh
```

Or manually:
```bash
cd scout-safe-pay-backend
vapor login
vapor deploy production
```

#### Frontend (Vercel)

```bash
cd scout-safe-pay-frontend
./deploy.sh
```

Or manually:
```bash
cd scout-safe-pay-frontend
vercel login
vercel --prod
```

## 📖 Detailed Documentation

For complete step-by-step instructions, see: **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

## 🔧 Configuration Files

### Backend Files Created:
- ✅ `vapor.yml` - Laravel Cloud configuration
- ✅ `.env.vapor` - Production environment variables template
- ✅ `deploy.sh` - Automated deployment script
- ✅ `config/cors.php` - Updated with Vercel domain patterns

### Frontend Files Created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.production` - Production environment template
- ✅ `deploy.sh` - Automated deployment script
- ✅ `next.config.ts` - Updated CSP for Vapor domains

## 📝 Pre-deployment Checklist

### Before Backend Deployment:

1. **Install Vapor CLI:**
   ```bash
   composer global require laravel/vapor-cli
   ```

2. **Login to Laravel Cloud:**
   ```bash
   vapor login
   ```

3. **Create resources:**
   - Database: `vapor database:create production`
   - Cache: `vapor cache:create production`
   - Or create via Dashboard at https://cloud.laravel.com

4. **Configure environment variables** in Laravel Cloud Dashboard:
   - Copy from `.env.vapor` in backend folder
   - Update `FRONTEND_URL` after Vercel deployment

### Before Frontend Deployment:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Configure environment variables** in Vercel Dashboard:
   - Copy from `.env.production` in frontend folder
   - Update `NEXT_PUBLIC_API_URL` with your Vapor URL

## 🔄 Deployment Flow

```
1. Deploy Backend → Get Vapor URL
2. Update Frontend .env with Vapor URL
3. Deploy Frontend → Get Vercel URL
4. Update Backend CORS with Vercel URL
5. Redeploy Backend with CORS settings
```

## 🌐 URLs After Deployment

- **Frontend:** `https://your-project.vercel.app`
- **Backend API:** `https://xxxxx.vapor-farm-x1.com/api`
- **Admin Panel:** `https://xxxxx.vapor-farm-x1.com/admin`

## 🧪 Testing After Deployment

```bash
# Test backend health
curl https://xxxxx.vapor-farm-x1.com/api/health

# Expected response: {"status":"ok"}

# Test frontend
open https://your-project.vercel.app

# Test admin panel
open https://xxxxx.vapor-farm-x1.com/admin
```

## 🐛 Troubleshooting

### Backend 502 Error
```bash
vapor logs production
vapor env:scale production --memory=2048
```

### Frontend CORS Error
- Update `FRONTEND_URL` in Laravel Cloud Dashboard
- Redeploy backend: `vapor deploy production`

### Build Failures
- Check logs in respective dashboards
- Verify all environment variables are set
- Ensure dependencies are properly installed

## 📚 Additional Resources

- [Full Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete step-by-step instructions
- [Laravel Vapor Docs](https://docs.vapor.build) - Official Vapor documentation
- [Vercel Docs](https://vercel.com/docs) - Official Vercel documentation

## 💰 Estimated Costs

- **Laravel Cloud:** $50-150/month (includes AWS usage)
- **Vercel:** $0-20/month (Free for Hobby plan)

## 🆘 Support

For issues or questions:
1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review Laravel Cloud logs: `vapor logs production`
3. Review Vercel logs in Dashboard

## ✅ Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] API health check passes
- [ ] Frontend connects to backend
- [ ] User registration works
- [ ] User login works
- [ ] Admin panel accessible
- [ ] CORS configured correctly
- [ ] Custom domains configured (optional)

---

**Ready to deploy?** Run `./deploy-all.sh` to get started! 🚀
