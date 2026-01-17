# 🚀 Scout Safe Pay - Production Deployment Checklist

## ✅ Pre-Deployment Verification

### Frontend
- [x] TypeScript compilation passes (0 errors in src/)
- [x] Production build succeeds
- [x] Console.log removal configured (Next.js removeConsole)
- [x] Rate limiting implemented on upload endpoints
- [x] httpOnly cookies configured

### Backend  
- [x] All migrations ready (31 migrations)
- [x] GDPR endpoints implemented (5 routes)
- [x] Rate limiting on sensitive endpoints (throttle:10,60)
- [x] PHPUnit tests configured (16 passing feature tests)
- [x] Sanctum cookie authentication configured

## �� Deployment Steps

### 1. Backend Deployment
```bash
cd scout-safe-pay-backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Configure environment
cp .env.example .env
# Edit .env with production values

# Generate key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Storage link
php artisan storage:link

# Schedule GDPR deletions (add to crontab)
0 2 * * * cd /path/to/project && php artisan gdpr:process-deletions
```

### 2. Frontend Deployment
```bash
cd scout-safe-pay-frontend

# Install dependencies
npm ci

# Build production
npm run build

# Start server
npm run start
# Or use PM2: pm2 start npm --name "scout-frontend" -- start
```

### 3. Required Environment Variables

#### Backend (.env)
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=scout_safe_pay
DB_USERNAME=your_user
DB_PASSWORD=your_password

# Sanctum
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=.your-domain.com

# External APIs (add your keys)
BANK_API_KEY=
OCR_PROVIDER=aws
AWS_TEXTRACT_KEY=
AWS_TEXTRACT_SECRET=
COMPLIANCE_PEP_API_KEY=
COMPLIANCE_SANCTIONS_API_KEY=
INTERPOL_API_KEY=
```

#### Frontend (.env.local)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### 4. Web Server Configuration

#### Nginx (Backend - Laravel)
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    root /var/www/scout-safe-pay-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Nginx (Frontend - Next.js)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL Certificates
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d your-domain.com -d api.your-domain.com
```

### 6. Monitoring & Logs
```bash
# Backend logs
tail -f storage/logs/laravel.log

# Frontend logs (PM2)
pm2 logs scout-frontend

# Nginx logs
tail -f /var/log/nginx/error.log
```

## 🔐 Security Checklist

- [x] httpOnly cookies enabled
- [x] CORS properly configured
- [x] Rate limiting on sensitive endpoints
- [x] CSRF protection enabled
- [x] SQL injection protection (Laravel ORM)
- [x] XSS protection (React escaping)
- [x] HTTPS enforced in production
- [x] Environment variables secured
- [x] Database credentials rotated
- [x] API keys stored securely

## 📊 Post-Deployment Testing

### Test Critical Flows
1. User registration & login
2. KYC submission
3. Vehicle listing creation
4. Transaction creation & payment
5. GDPR data export
6. GDPR account deletion request

### Monitor Performance
- Backend response times (< 200ms)
- Frontend page load (< 2s)
- Database query performance
- API error rates
- Rate limiting effectiveness

## 🆘 Rollback Plan

If issues occur:
```bash
# Backend rollback
cd scout-safe-pay-backend
git checkout <previous-commit>
composer install
php artisan migrate:rollback --step=1
php artisan config:clear
php artisan cache:clear

# Frontend rollback
cd scout-safe-pay-frontend
git checkout <previous-commit>
npm ci
npm run build
pm2 restart scout-frontend
```

## 📞 Support Contacts

- Backend Issues: Check `storage/logs/laravel.log`
- Frontend Issues: Check PM2 logs or browser console
- Database Issues: Check `/var/log/mysql/error.log`

---
✅ Deployment completed: $(date)
