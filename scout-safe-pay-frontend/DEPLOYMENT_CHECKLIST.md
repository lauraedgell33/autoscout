# 📋 DEPLOYMENT CHECKLIST - Vercel + Forge

Use this checklist to ensure smooth deployment.

---

## 🎯 PRE-DEPLOYMENT

### Preparation
- [x] Application 100% verified (FINAL_VERIFICATION_REPORT.md)
- [x] Production build tested locally
- [x] All environment templates created
- [x] Documentation complete
- [ ] Domains purchased (yourdomain.com)
- [ ] Vercel account created
- [ ] Forge account created
- [ ] Server provider account (DigitalOcean/AWS)

---

## 🚀 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Vercel Setup
- [x] Vercel CLI installed (`vercel --version`)
- [ ] Logged into Vercel (`vercel login`)
- [ ] GitHub repository created (optional but recommended)

### Step 2: Deploy
Choose one method:

**Method A: CLI Deploy (5 min)**
- [ ] Run `vercel --prod`
- [ ] Follow prompts
- [ ] Note deployment URL

**Method B: GitHub Deploy (10 min)**
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Configure build settings
- [ ] Deploy

### Step 3: Configure Environment
- [ ] Add `NEXT_PUBLIC_API_URL` in Vercel dashboard
- [ ] Add `NEXT_PUBLIC_SITE_URL`
- [ ] Add `NEXT_PUBLIC_ENABLE_ANALYTICS`
- [ ] Add `NEXT_PUBLIC_ENABLE_ERROR_TRACKING`
- [ ] Redeploy to apply changes

### Step 4: Custom Domain
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records:
  - [ ] CNAME: www → cname.vercel-dns.com
  - [ ] A: @ → 76.76.21.21
- [ ] Wait for SSL certificate (auto)
- [ ] Verify domain works

### Step 5: Verification
- [ ] Homepage loads: `https://www.yourdomain.com`
- [ ] All locales work: `/en`, `/de`, `/es`, `/it`, `/ro`, `/fr`
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`
- [ ] Manifest works: `/manifest.json`
- [ ] SSL certificate active (green padlock)

---

## 🛠️ BACKEND DEPLOYMENT (Laravel Forge)

### Step 1: Forge Setup
- [ ] Forge account created
- [ ] Payment method added
- [ ] SSH key uploaded (optional)

### Step 2: Server Provisioning
- [ ] Server created on provider (DigitalOcean/AWS)
- [ ] Server size: 2GB RAM minimum
- [ ] PHP 8.2+ selected
- [ ] MySQL 8.0 selected
- [ ] Server provisioned (wait 5-10 min)

### Step 3: Site Creation
- [ ] Site added: `api.yourdomain.com`
- [ ] Project type: Laravel
- [ ] Web directory: `/public`
- [ ] DNS configured (A record to server IP)

### Step 4: SSL Installation
- [ ] LetsEncrypt certificate requested
- [ ] Certificate obtained (wait 1-2 min)
- [ ] Certificate activated
- [ ] HTTPS working

### Step 5: Code Deployment

**Method A: Git (Recommended)**
- [ ] GitHub repository connected
- [ ] Deploy script configured
- [ ] Quick Deploy enabled
- [ ] First deployment successful

**Method B: SFTP**
- [ ] SFTP credentials obtained
- [ ] Files uploaded to server
- [ ] Permissions set correctly

### Step 6: Environment Configuration
- [ ] `.env` edited in Forge
- [ ] `APP_URL` set correctly
- [ ] Database credentials verified
- [ ] `FRONTEND_URL` added
- [ ] `SANCTUM_STATEFUL_DOMAINS` configured
- [ ] Mail settings configured
- [ ] Environment saved

### Step 7: Database Setup
- [ ] Migrations run: `php artisan migrate --force`
- [ ] Seeders run (if needed): `php artisan db:seed --force`
- [ ] Database populated

### Step 8: Optimization
- [ ] Config cached: `php artisan config:cache`
- [ ] Routes cached: `php artisan route:cache`
- [ ] Views cached: `php artisan view:cache`
- [ ] Events cached: `php artisan event:cache`
- [ ] Composer optimized: `composer dump-autoload --optimize`

### Step 9: Queue & Scheduler (Optional)
- [ ] Queue daemon created (if using queues)
- [ ] Scheduler enabled (if using scheduler)
- [ ] Both working correctly

### Step 10: Verification
- [ ] API responds: `https://api.yourdomain.com/api/health`
- [ ] SSL certificate active
- [ ] Database connected
- [ ] All endpoints working

---

## 🔗 CONNECTION SETUP

### Frontend Configuration
- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel to production API
- [ ] Redeploy frontend

### Backend Configuration
- [ ] Update `config/cors.php`:
  - [ ] Add frontend domain to `allowed_origins`
  - [ ] Add Vercel pattern to `allowed_origins_patterns`
- [ ] Commit and push changes
- [ ] Backend auto-deploys (if Quick Deploy on)

### CORS Testing
- [ ] Test API call from frontend
- [ ] Check CORS headers in browser DevTools
- [ ] Verify authentication works (if using)

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Functional Tests
- [ ] Homepage loads on custom domain
- [ ] All language routes work
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] API calls return data
- [ ] Authentication works (login/register)
- [ ] Images load correctly
- [ ] Translations display correctly

### Performance Tests
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check Core Web Vitals
- [ ] Verify page load time < 3s
- [ ] Check Time to Interactive < 4s

### Security Tests
- [ ] SSL/TLS working on both domains
- [ ] Security headers present (check with securityheaders.com)
- [ ] CORS configured correctly
- [ ] No sensitive data exposed
- [ ] API rate limiting works

### SEO Tests
- [ ] Sitemap accessible
- [ ] Robots.txt accessible
- [ ] Meta tags present (view source)
- [ ] Open Graph tags working
- [ ] Canonical URLs correct

---

## 📊 MONITORING SETUP

### Frontend Monitoring
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry - optional)
- [ ] Google Analytics added (optional)
- [ ] Web Vitals monitoring active

### Backend Monitoring
- [ ] Forge metrics monitoring
- [ ] Laravel logs accessible
- [ ] Database monitoring enabled
- [ ] Uptime monitoring setup (UptimeRobot/Pingdom)

### Alerts Configuration
- [ ] Email alerts for downtime
- [ ] Slack alerts (if using)
- [ ] Error notifications configured

---

## 🎯 FINAL CHECKS

### Documentation
- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Share access credentials securely

### Team Notifications
- [ ] Notify team of deployment
- [ ] Share production URLs
- [ ] Provide login credentials (if needed)
- [ ] Schedule training session (if needed)

### Backup & Recovery
- [ ] Database backup configured
- [ ] Backup schedule set (daily recommended)
- [ ] Recovery procedure documented
- [ ] Backup restoration tested

---

## 🚨 TROUBLESHOOTING

Common issues and solutions:

### Frontend Issues
- **Blank page:** Check browser console for errors
- **API calls fail:** Verify CORS configuration
- **Environment vars not working:** Redeploy after changing vars
- **Build fails:** Check Vercel build logs

### Backend Issues
- **500 error:** Check Laravel logs
- **Database error:** Verify credentials in .env
- **CORS error:** Update config/cors.php
- **SSL not working:** Wait for DNS propagation (1 hour)

### Connection Issues
- **API unreachable:** Check DNS configuration
- **CORS headers missing:** Verify backend CORS config
- **Authentication fails:** Check SESSION_DOMAIN in .env

---

## 📞 SUPPORT CONTACTS

- **Vercel Support:** https://vercel.com/support
- **Forge Support:** https://forge.laravel.com/support
- **Documentation:** See VERCEL_FORGE_DEPLOYMENT.md
- **Quick Guide:** See QUICK_DEPLOY_GUIDE.md

---

## 🎉 DEPLOYMENT COMPLETE!

Once all items are checked:

✅ **Frontend:** Live at www.yourdomain.com  
✅ **Backend:** Live at api.yourdomain.com  
✅ **Status:** Production Ready  
✅ **SSL:** Active on both domains  
✅ **Monitoring:** Active  

**Congratulations! Your application is live!** 🚀

---

**Next Steps:**
1. Monitor for first 24 hours
2. Collect user feedback
3. Plan next feature release
4. Schedule regular maintenance

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Production URL:** www.yourdomain.com  
**API URL:** api.yourdomain.com
