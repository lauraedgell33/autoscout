# 🚀 Ghid Complet de Deployment

## 📋 Cuprins
1. [Backend pe Laravel Cloud](#1-backend-pe-laravel-cloud)
2. [Frontend pe Vercel](#2-frontend-pe-vercel)
3. [Configurare finală și testare](#3-configurare-finală)

---

## 1. Backend pe Laravel Cloud

### Pas 1.1: Login și Inițializare

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend

# Login în Laravel Cloud
vapor login

# Inițializează proiectul (dacă nu e deja făcut)
vapor init
```

### Pas 1.2: Creează Resurse în Dashboard

Accesează **https://cloud.laravel.com** și:

1. **Database:**
   ```bash
   vapor database:create production
   # SAU creează din Dashboard: Resources → Databases → Create Database
   ```

2. **Cache (Redis):**
   ```bash
   vapor cache:create production
   # SAU din Dashboard: Resources → Caches → Create Cache
   ```

3. **Queue (SQS) - se creează automat**

### Pas 1.3: Configurează Environment Variables

În **Laravel Cloud Dashboard** → Project → Environment → **Production** → Environment Variables:

```env
# Application
APP_NAME="AutoScout24 SafeTrade"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_TIMEZONE=UTC
APP_URL=https://YOUR_VAPOR_URL.vapor-farm-x1.com

# Locale
APP_LOCALE=en
APP_FALLBACK_LOCALE=en

# Database (auto-configured de Vapor)
DB_CONNECTION=mysql
# DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD sunt setate automat

# Cache & Session
CACHE_DRIVER=redis
CACHE_PREFIX=autoscout
SESSION_DRIVER=redis
SESSION_LIFETIME=120

# Queue
QUEUE_CONNECTION=sqs

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error

# Mail
MAIL_MAILER=log
# Pentru production folosește SES:
# MAIL_MAILER=ses
# MAIL_FROM_ADDRESS=noreply@autoscout24.com
# MAIL_FROM_NAME="AutoScout24 SafeTrade"

# Frontend CORS (actualizează după deployment Vercel)
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_URL.vercel.app
SESSION_DOMAIN=

# Security
BCRYPT_ROUNDS=12

# Filesystem
FILESYSTEM_DISK=s3

# Filament Admin
FILAMENT_PATH=admin
```

### Pas 1.4: Deploy Backend

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend

# Deploy pe production
vapor deploy production
```

**Durata:** ~3-5 minute

**Ce se întâmplă:**
- ✅ Build aplicație (composer install, cache config/routes/views)
- ✅ Upload assets în S3
- ✅ Deploy pe AWS Lambda
- ✅ Rulează migrations automat
- ✅ Link storage
- ✅ Configurare CloudFront CDN

### Pas 1.5: Notează URL-ul Backend

După deployment, Vapor va afișa:
```
Deployment successful!
URL: https://xxxxxxxxxxxxx.vapor-farm-x1.com
```

**⚠️ SALVEAZĂ acest URL - îl vei folosi pentru frontend!**

### Pas 1.6: Verifică Deployment

```bash
# Vezi status
vapor metrics production

# Vezi logs
vapor logs production

# Testează API
curl https://xxxxxxxxxxxxx.vapor-farm-x1.com/api/health
```

---

## 2. Frontend pe Vercel

### Pas 2.1: Pregătire Cod

```bash
cd /home/x/Documents/scout/scout-safe-pay-frontend

# Actualizează next.config.ts cu URL-ul backend
```

Editează `next.config.ts` și actualizează CSP cu URL-ul tău Vapor:

```typescript
// În headers, actualizează connect-src:
"connect-src 'self' https://xxxxxxxxxxxxx.vapor-farm-x1.com",
```

### Pas 2.2: Push pe GitHub (dacă nu ai făcut deja)

```bash
cd /home/x/Documents/scout

# Verifică status
git status

# Add files
git add .

# Commit
git commit -m "Configure for Vercel and Laravel Cloud deployment"

# Push
git push origin main
```

### Pas 2.3: Deploy pe Vercel

#### Opțiunea A: Vercel CLI (Recomandat)

```bash
# Instalează Vercel CLI (dacă nu e instalat)
npm install -g vercel

# Login în Vercel
vercel login

# Deploy din directorul frontend
cd /home/x/Documents/scout/scout-safe-pay-frontend

# Deploy production
vercel --prod
```

**Urmează prompturile:**
1. Set up and deploy? → **Y**
2. Which scope? → Alege contul tău
3. Link to existing project? → **N** (pentru proiect nou)
4. Project name? → **scout-safe-pay** (sau numele tău)
5. Directory? → **./** (curent)
6. Override settings? → **N**

#### Opțiunea B: Vercel Dashboard

1. Accesează **https://vercel.com**
2. Click **"Add New Project"**
3. Import from **GitHub:**
   - Selectează repository-ul `scout`
   - Root Directory: `scout-safe-pay-frontend`
   - Framework Preset: **Next.js**
4. Configure Environment Variables (vezi Pas 2.4)
5. Click **"Deploy"**

### Pas 2.4: Configurează Environment Variables în Vercel

În **Vercel Dashboard** → Project → Settings → **Environment Variables**:

**Adaugă variabilele pentru Production:**

```env
NEXT_PUBLIC_API_URL=https://xxxxxxxxxxxxx.vapor-farm-x1.com/api
NEXT_PUBLIC_API_BASE_URL=https://xxxxxxxxxxxxx.vapor-farm-x1.com/api
NEXT_PUBLIC_APP_NAME=AutoScout24 SafeTrade
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_COMPANY_NAME=AutoScout24 GmbH
NEXT_PUBLIC_COMPANY_EMAIL=support@autoscout24.com
NEXT_PUBLIC_COMPANY_PHONE=+49 30 12345678
NEXT_PUBLIC_BANK_NAME=Deutsche Bank
NEXT_PUBLIC_BANK_IBAN=DE89370400440532013000
NEXT_PUBLIC_BANK_BIC=COBADEFFXXX
NEXT_PUBLIC_BANK_ACCOUNT_HOLDER=AutoScout24 GmbH
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_VEHICLE_LISTING=true
NEXT_PUBLIC_ENABLE_TRANSACTIONS=true
NEXT_PUBLIC_ENABLE_INVOICES=true
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880
NEXT_PUBLIC_MAX_IMAGES_PER_VEHICLE=10
NEXT_PUBLIC_ACCEPTED_IMAGE_TYPES=image/jpeg,image/png,image/webp
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_VAT_PERCENTAGE=19
```

**⚠️ IMPORTANT:** Înlocuiește:
- `xxxxxxxxxxxxx.vapor-farm-x1.com` cu URL-ul tău real Vapor
- `your-project.vercel.app` cu URL-ul tău real Vercel

### Pas 2.5: Redeploy după Configurare

```bash
# Dacă ai folosit CLI
vercel --prod

# SAU din Dashboard: Deployments → Redeploy
```

### Pas 2.6: Notează URL-ul Frontend

Vercel va afișa:
```
✅ Production: https://your-project.vercel.app
```

---

## 3. Configurare Finală

### Pas 3.1: Actualizează CORS pe Backend

**În Laravel Cloud Dashboard** → Environment Variables, actualizează:

```env
FRONTEND_URL=https://your-project.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-project.vercel.app
```

### Pas 3.2: Redeploy Backend

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend

# Redeploy pentru a aplica CORS
vapor deploy production
```

### Pas 3.3: Testează Aplicația

1. **Backend Health Check:**
   ```bash
   curl https://xxxxxxxxxxxxx.vapor-farm-x1.com/api/health
   ```
   
   Răspuns așteptat: `{"status":"ok"}`

2. **Frontend:**
   - Accesează `https://your-project.vercel.app`
   - Verifică că se conectează la backend
   - Testează înregistrarea unui user
   - Testează login-ul

3. **Admin Panel:**
   - Accesează `https://xxxxxxxxxxxxx.vapor-farm-x1.com/admin`
   - Login cu credențialele admin

### Pas 3.4: Configurare Custom Domain (Opțional)

#### Pentru Backend (Laravel Cloud):

1. În Dashboard: Environments → Production → **Domains**
2. Add Domain: `api.autoscout24.com`
3. Adaugă DNS Record la provider-ul tău:
   ```
   Type: CNAME
   Name: api
   Value: xxxxxxxxxxxxx.cloudfront.net
   ```

#### Pentru Frontend (Vercel):

1. În Dashboard: Settings → **Domains**
2. Add Domain: `app.autoscout24.com`
3. Adaugă DNS Record:
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

---

## 🔧 Comenzi Utile

### Backend (Laravel Cloud)

```bash
# Vezi logs
vapor logs production

# Rulează command
vapor command production "php artisan cache:clear"

# Scale memory
vapor env:scale production --memory=2048

# Scale queue workers
vapor queue:scale production 3

# Rollback
vapor rollback production

# Tinker
vapor tinker production

# Metrics
vapor metrics production
```

### Frontend (Vercel)

```bash
# Deploy
vercel --prod

# Vezi logs
vercel logs

# Vezi deployments
vercel ls

# Alias domain
vercel alias set your-deployment.vercel.app custom-domain.com

# Environment variables
vercel env ls
vercel env add NEXT_PUBLIC_API_URL production
```

---

## 🐛 Troubleshooting

### Backend 502 Error
```bash
# Verifică logs
vapor logs production

# Crește memory
vapor env:scale production --memory=2048
```

### Frontend CORS Error
- Verifică `FRONTEND_URL` în Laravel Cloud
- Verifică `SANCTUM_STATEFUL_DOMAINS`
- Redeploy backend după schimbări

### Database Connection Error
```bash
# Verifică database
vapor database:show production

# Verifică environment variables în Dashboard
```

### Build Failed pe Vercel
- Verifică că toate dependințele sunt în `package.json`
- Verifică Node.js version (ar trebui 18.x sau 20.x)
- Verifică logs în Vercel Dashboard

---

## ✅ Checklist Final

### Backend:
- [ ] `vapor login` executat
- [ ] Database creat
- [ ] Cache (Redis) creat  
- [ ] Environment variables configurate în Dashboard
- [ ] `vapor deploy production` executat cu succes
- [ ] API endpoint testează: `/api/health`
- [ ] Admin panel accesibil: `/admin`

### Frontend:
- [ ] Cod push-at pe GitHub
- [ ] Proiect creat în Vercel
- [ ] Environment variables configurate în Vercel
- [ ] Deploy executat cu succes
- [ ] URL frontend funcționează
- [ ] Conexiunea la backend funcționează

### Configurare Finală:
- [ ] `FRONTEND_URL` actualizat în Laravel Cloud
- [ ] `SANCTUM_STATEFUL_DOMAINS` actualizat
- [ ] Backend redeploy-at după CORS
- [ ] Înregistrare user testată
- [ ] Login testat
- [ ] Custom domains configurate (opțional)

---

## 💰 Costuri Estimate

**Laravel Cloud (Vapor):**
- Plan: $19-99/month (plus AWS usage)
- AWS: ~$30-50/month (Lambda, RDS, Redis, S3)
- **Total backend: ~$50-150/month**

**Vercel:**
- Hobby (personal): **FREE**
- Pro: $20/month per user
- **Total frontend: $0-20/month**

**Total: ~$50-170/month** (depending pe plan și trafic)

---

## 📚 Documentație

- **Laravel Vapor:** https://docs.vapor.build
- **Laravel Cloud:** https://cloud.laravel.com
- **Vercel:** https://vercel.com/docs
- **Next.js:** https://nextjs.org/docs

---

## 🎉 Felicitări!

Aplicația ta este acum live:
- **Backend:** `https://xxxxxxxxxxxxx.vapor-farm-x1.com`
- **Frontend:** `https://your-project.vercel.app`
- **Admin:** `https://xxxxxxxxxxxxx.vapor-farm-x1.com/admin`

**Next steps:**
1. Configurează monitoring (Sentry, LogRocket)
2. Setup CI/CD cu GitHub Actions
3. Configurează backup-uri automate
4. Setup custom domains
5. Configurează email notifications (AWS SES)
