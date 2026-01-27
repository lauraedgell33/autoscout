# 🚀 Production Deployment Guide - Scout Safe Pay

**Version:** 2.0  
**Last Updated:** January 18, 2026  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Security Configuration](#security-configuration)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

### Critical Security Items

- [ ] **APP_DEBUG=false** in backend `.env.production`
- [ ] **JWT_SECRET** generated with strong random value
- [ ] **APP_KEY** generated with `php artisan key:generate`
- [ ] **SESSION_SECURE_COOKIE=true** enabled
- [ ] **SESSION_ENCRYPT=true** enabled
- [ ] **SSL certificate** installed and configured
- [ ] **Database credentials** secured (not default)
- [ ] **Redis password** set
- [ ] **S3 credentials** configured for file storage
- [ ] **All placeholder URLs** replaced with production values

### Configuration Review

- [ ] CORS origins restricted to production domains
- [ ] Rate limiting configured appropriately
- [ ] Email SMTP settings configured
- [ ] External API keys added (payment, KYC, compliance)
- [ ] Sentry DSN configured for error tracking
- [ ] Database backups scheduled
- [ ] Log rotation configured

### Code Quality

- [ ] All tests passing: `php artisan test`
- [ ] Frontend build successful: `npm run build`
- [ ] No console.log statements in production code
- [ ] No hardcoded credentials in codebase
- [ ] Dependencies updated to stable versions

---

## 🔧 Environment Setup

### 1. Server Requirements

#### Backend Server
```bash
- PHP 8.2 or higher
- MySQL 8.0+ or PostgreSQL 13+
- Redis 6.0+
- Composer 2.x
- Nginx or Apache with PHP-FPM
- SSL certificate
- 2GB+ RAM (minimum)
- 20GB+ storage
```

#### Frontend Server
```bash
- Node.js 20 LTS
- npm 10+
- 1GB+ RAM (minimum)
- Nginx or use Vercel/Netlify
```

### 2. Database Setup

```bash
# Create production database
mysql -u root -p
CREATE DATABASE scout_safe_pay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'scout_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON scout_safe_pay.* TO 'scout_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Redis Setup

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Configure Redis password
sudo nano /etc/redis/redis.conf
# Add: requirepass YOUR_STRONG_REDIS_PASSWORD

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

---

## 🖥️ Backend Deployment

### Step 1: Clone & Setup

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-org/scout-safe-pay.git
cd scout-safe-pay/scout-safe-pay-backend

# Set permissions
sudo chown -R www-data:www-data /var/www/scout-safe-pay
sudo chmod -R 755 storage bootstrap/cache
```

### Step 2: Install Dependencies

```bash
# Install PHP dependencies (no dev packages)
composer install --optimize-autoloader --no-dev --no-interaction

# Generate application key
php artisan key:generate --force
```

### Step 3: Configure Environment

```bash
# Copy production environment file
cp .env.production .env

# IMPORTANT: Edit .env and set all production values
nano .env
```

**Critical variables to set:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=scout_safe_pay
DB_USERNAME=scout_user
DB_PASSWORD=YOUR_STRONG_PASSWORD

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=YOUR_REDIS_PASSWORD

SESSION_SECURE_COOKIE=true
SESSION_ENCRYPT=true
SESSION_DOMAIN=.your-domain.com

FRONTEND_URL=https://your-domain.com

JWT_SECRET=YOUR_GENERATED_SECRET

# Email configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password

# AWS S3 for file storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET=your-bucket-name
```

### Step 4: Database Migration

```bash
# Run migrations
php artisan migrate --force

# Seed admin user (optional)
php artisan db:seed --class=AdminSeeder --force

# Link storage
php artisan storage:link
```

### Step 5: Optimize for Production

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize
```

### Step 6: Setup Queue Worker

```bash
# Install supervisor
sudo apt install supervisor

# Create queue worker config
sudo nano /etc/supervisor/conf.d/scout-queue.conf
```

Add configuration:
```ini
[program:scout-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/scout-safe-pay/scout-safe-pay-backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/scout-safe-pay/scout-safe-pay-backend/storage/logs/queue.log
stopwaitsecs=3600
```

```bash
# Start supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start scout-queue:*
```

### Step 7: Setup Scheduled Tasks (Cron)

```bash
# Edit crontab for www-data user
sudo crontab -u www-data -e
```

Add:
```cron
* * * * * cd /var/www/scout-safe-pay/scout-safe-pay-backend && php artisan schedule:run >> /dev/null 2>&1
0 2 * * * cd /var/www/scout-safe-pay/scout-safe-pay-backend && php artisan gdpr:process-deletions
```

### Step 8: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/scout-api
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;
    root /var/www/scout-safe-pay/scout-safe-pay-backend/public;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    index index.php;

    charset utf-8;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;
    limit_req zone=api burst=10 nodelay;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Max upload size
    client_max_body_size 10M;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/scout-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🌐 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

```bash
cd scout-safe-pay-frontend

# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Set environment variables in Vercel Dashboard:**
- Go to Project Settings → Environment Variables
- Add all variables from `.env.production`
- Redeploy after adding variables

### Option 2: Self-Hosted Deployment

```bash
cd /var/www/scout-safe-pay/scout-safe-pay-frontend

# Install dependencies
npm ci --production

# Create production environment file
cp .env.production .env.local

# Edit environment variables
nano .env.local
```

Set:
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

```bash
# Build for production
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "scout-frontend" -- start
pm2 save
pm2 startup
```

**Nginx configuration for frontend:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 Security Configuration

### 1. Firewall Setup

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block direct access to MySQL/Redis
sudo ufw deny 3306/tcp
sudo ufw deny 6379/tcp

# Check status
sudo ufw status
```

### 2. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.your-domain.com
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured by default
sudo certbot renew --dry-run
```

### 3. Database Security

```bash
# Run MySQL secure installation
sudo mysql_secure_installation

# Answers:
# - Set root password: YES
# - Remove anonymous users: YES
# - Disallow root login remotely: YES
# - Remove test database: YES
# - Reload privilege tables: YES
```

### 4. Fail2Ban Setup

```bash
# Install Fail2Ban
sudo apt install fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Add custom jail for Laravel
sudo nano /etc/fail2ban/filter.d/laravel.conf
```

Add:
```ini
[Definition]
failregex = ^.* Failed login attempt .* <HOST> .*$
ignoreregex =
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban
```

---

## ✅ Post-Deployment Testing

### 1. Backend Health Checks

```bash
# Test API endpoint
curl -I https://api.your-domain.com/api/health

# Expected: 200 OK

# Test authentication
curl -X POST https://api.your-domain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@autoscout24.com","password":"password"}'

# Test HTTPS redirect
curl -I http://api.your-domain.com
# Expected: 301 Moved Permanently
```

### 2. Frontend Health Checks

```bash
# Test homepage
curl -I https://your-domain.com

# Check security headers
curl -I https://your-domain.com | grep -E "(Strict-Transport|X-Frame|X-Content)"

# Test API connectivity from frontend
# Visit: https://your-domain.com/login
# Try to login - should work without CORS errors
```

### 3. Security Testing

```bash
# Test rate limiting
for i in {1..70}; do curl -s https://api.your-domain.com/api/vehicles > /dev/null; done
# Should start getting 429 Too Many Requests

# Test HTTPS enforcement
curl http://api.your-domain.com
# Should redirect to HTTPS

# Verify httpOnly cookies
# Open browser DevTools → Application → Cookies
# Session cookie should have httpOnly flag checked
```

### 4. Functional Testing

Test these features manually:
- [ ] User registration
- [ ] User login
- [ ] Email verification
- [ ] Password reset
- [ ] Vehicle listing creation
- [ ] File upload (images, documents)
- [ ] Transaction creation
- [ ] Payment proof upload
- [ ] Admin panel access
- [ ] GDPR data export
- [ ] GDPR account deletion

---

## 📊 Monitoring & Maintenance

### 1. Setup Monitoring

**Laravel Log Monitoring:**
```bash
# Monitor Laravel logs
tail -f storage/logs/laravel.log

# Monitor queue logs
tail -f storage/logs/queue.log

# Monitor Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Sentry Integration:**
```bash
# Backend: Already configured via .env
SENTRY_LARAVEL_DSN=your-sentry-dsn

# Frontend: Uncomment in .env.production
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
```

### 2. Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-scout-db.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/scout-safe-pay"
mkdir -p $BACKUP_DIR

mysqldump -u scout_user -p'PASSWORD' scout_safe_pay | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-scout-db.sh

# Add to crontab
sudo crontab -e
# Add: 0 3 * * * /usr/local/bin/backup-scout-db.sh
```

### 3. Application Updates

```bash
# Backend update process
cd /var/www/scout-safe-pay/scout-safe-pay-backend

# Put in maintenance mode
php artisan down

# Pull latest code
git pull origin main

# Update dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Clear and rebuild cache
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo supervisorctl restart scout-queue:*

# Bring back online
php artisan up

# Frontend update process
cd /var/www/scout-safe-pay/scout-safe-pay-frontend
git pull origin main
npm ci --production
npm run build
pm2 restart scout-frontend
```

### 4. Log Rotation

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/scout-safe-pay
```

Add:
```
/var/www/scout-safe-pay/scout-safe-pay-backend/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 www-data www-data
    sharedscripts
    postrotate
        php /var/www/scout-safe-pay/scout-safe-pay-backend/artisan optimize:clear > /dev/null 2>&1
    endscript
}
```

---

## 🔧 Troubleshooting

### Common Issues

**1. 500 Internal Server Error**
```bash
# Check Laravel logs
tail -100 storage/logs/laravel.log

# Check permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 755 storage bootstrap/cache

# Clear cache
php artisan optimize:clear
```

**2. Database Connection Failed**
```bash
# Test MySQL connection
mysql -u scout_user -p scout_safe_pay

# Check .env database credentials
cat .env | grep DB_

# Restart MySQL
sudo systemctl restart mysql
```

**3. Queue Jobs Not Processing**
```bash
# Check queue worker status
sudo supervisorctl status scout-queue:*

# Restart queue workers
sudo supervisorctl restart scout-queue:*

# Check queue logs
tail -50 storage/logs/queue.log
```

**4. CORS Errors**
```bash
# Verify CORS configuration
cat config/cors.php

# Check frontend URL in backend .env
grep FRONTEND_URL .env

# Clear config cache
php artisan config:clear
php artisan config:cache
```

**5. Session/Cookie Issues**
```bash
# Verify session configuration
php artisan config:show session

# Check session driver
grep SESSION_ .env

# Clear sessions
php artisan cache:clear
```

---

## 📝 Final Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] SSL certificates installed and auto-renew configured
- [ ] Database backups scheduled
- [ ] Monitoring and error tracking configured
- [ ] All tests passing
- [ ] Security headers verified
- [ ] CORS configuration tested
- [ ] Rate limiting tested
- [ ] Email sending tested
- [ ] File uploads working
- [ ] Queue workers running
- [ ] Cron jobs scheduled
- [ ] Log rotation configured
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

## 🎉 You're Live!

Your Scout Safe Pay application is now running in production!

**Access Points:**
- **Frontend:** https://your-domain.com
- **API:** https://api.your-domain.com/api
- **Admin Panel:** https://api.your-domain.com/admin

**Monitoring:**
- Check Sentry for errors
- Monitor server resources (CPU, RAM, disk)
- Review logs daily
- Test critical features weekly

**Support:**
For issues or questions, contact: support@autoscout24.com

---

**Document Version:** 2.0  
**Last Updated:** January 18, 2026  
**Maintained By:** DevOps Team
