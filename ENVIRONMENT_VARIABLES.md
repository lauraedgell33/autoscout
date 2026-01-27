# 🔒 Environment Variables Securizate

## ⚠️ IMPORTANT
Acest fișier conține variabilele de environment necesare.
**NU commitezi acest fișier cu valori reale în Git!**

## 📋 Instrucțiuni

### Pentru Backend (Laravel Cloud):
1. Accesează https://cloud.laravel.com
2. Selectează proiectul tău
3. Mergi la: Environments → Production → Environment Variables
4. Adaugă fiecare variabilă de mai jos

### Pentru Frontend (Vercel):
1. Accesează https://vercel.com/dashboard
2. Selectează proiectul tău
3. Mergi la: Settings → Environment Variables
4. Adaugă fiecare variabilă de mai jos pentru Production

---

## 🔧 Backend Environment Variables (Laravel Cloud)

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

# Database (Auto-configured by Vapor)
DB_CONNECTION=mysql
# DB_HOST - set by Vapor
# DB_PORT - set by Vapor
# DB_DATABASE - set by Vapor
# DB_USERNAME - set by Vapor
# DB_PASSWORD - set by Vapor

# Cache & Session
CACHE_DRIVER=redis
CACHE_PREFIX=autoscout
SESSION_DRIVER=redis
SESSION_LIFETIME=120
SESSION_DOMAIN=

# Queue
QUEUE_CONNECTION=sqs

# Redis (Auto-configured by Vapor)
# REDIS_HOST - set by Vapor
# REDIS_PASSWORD - set by Vapor
# REDIS_PORT - set by Vapor

# Logging
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# AWS (Auto-configured by Vapor)
# AWS_ACCESS_KEY_ID - set by Vapor
# AWS_SECRET_ACCESS_KEY - set by Vapor
# AWS_DEFAULT_REGION - set by Vapor
# AWS_BUCKET - set by Vapor

# Mail
MAIL_MAILER=log
# For production, use SES:
# MAIL_MAILER=ses
# MAIL_FROM_ADDRESS=noreply@autoscout24.com
# MAIL_FROM_NAME="${APP_NAME}"

# Frontend CORS - UPDATE AFTER VERCEL DEPLOYMENT
FRONTEND_URL=https://YOUR_VERCEL_URL.vercel.app
SANCTUM_STATEFUL_DOMAINS=YOUR_VERCEL_URL.vercel.app
SESSION_DOMAIN=

# API
API_PREFIX=api

# Security
BCRYPT_ROUNDS=12

# Filesystem
FILESYSTEM_DISK=s3

# Broadcasting
BROADCAST_DRIVER=log

# Sanctum
SANCTUM_MIDDLEWARE_APPEND_OR_REPLACE=replace

# Filament
FILAMENT_PATH=admin
```

---

## 💻 Frontend Environment Variables (Vercel)

```env
# API Configuration - UPDATE WITH YOUR VAPOR URL
NEXT_PUBLIC_API_URL=https://YOUR_VAPOR_URL.vapor-farm-x1.com/api
NEXT_PUBLIC_API_BASE_URL=https://YOUR_VAPOR_URL.vapor-farm-x1.com/api

# Application
NEXT_PUBLIC_APP_NAME=AutoScout24 SafeTrade
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_URL.vercel.app

# Company Information
NEXT_PUBLIC_COMPANY_NAME=AutoScout24 GmbH
NEXT_PUBLIC_COMPANY_EMAIL=support@autoscout24.com
NEXT_PUBLIC_COMPANY_PHONE=+49 30 12345678

# Bank Transfer Information
NEXT_PUBLIC_BANK_NAME=Deutsche Bank
NEXT_PUBLIC_BANK_IBAN=DE89370400440532013000
NEXT_PUBLIC_BANK_BIC=COBADEFFXXX
NEXT_PUBLIC_BANK_ACCOUNT_HOLDER=AutoScout24 GmbH

# Feature Flags
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_VEHICLE_LISTING=true
NEXT_PUBLIC_ENABLE_TRANSACTIONS=true
NEXT_PUBLIC_ENABLE_INVOICES=true

# File Upload Configuration
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880
NEXT_PUBLIC_MAX_IMAGES_PER_VEHICLE=10
NEXT_PUBLIC_ACCEPTED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# Currency & Pricing
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_VAT_PERCENTAGE=19

# Error Tracking (Optional)
# NEXT_PUBLIC_SENTRY_DSN=

# Analytics (Optional)
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## 🔄 Update Flow

### După Backend Deployment:
1. Notează URL-ul Vapor: `https://xxxxx.vapor-farm-x1.com`
2. Actualizează în Vercel:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_API_BASE_URL`
3. Redeploy frontend

### După Frontend Deployment:
1. Notează URL-ul Vercel: `https://your-app.vercel.app`
2. Actualizează în Laravel Cloud:
   - `FRONTEND_URL`
   - `SANCTUM_STATEFUL_DOMAINS`
3. Redeploy backend

---

## 🛡️ Security Notes

1. **APP_KEY**: Generează cu `php artisan key:generate --show`
2. **Secrets**: Nu include API keys, passwords în Git
3. **Database credentials**: Sunt setate automat de Vapor
4. **AWS credentials**: Sunt setate automat de Vapor
5. **CORS**: Asigură-te că `FRONTEND_URL` și `SANCTUM_STATEFUL_DOMAINS` sunt corecte

---

## ✅ Validation

După configurare, testează:

```bash
# Test backend
curl https://YOUR_VAPOR_URL/api/health

# Test CORS
curl -H "Origin: https://YOUR_VERCEL_URL" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://YOUR_VAPOR_URL/api/health
```

---

## 📞 Support

Dacă întâmpini probleme:
- Verifică că toate variabilele sunt setate corect
- Verifică typo-uri în URL-uri
- Verifică logs: `vapor logs production` sau Vercel Dashboard
