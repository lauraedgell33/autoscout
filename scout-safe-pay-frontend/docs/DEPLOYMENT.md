# Deployment Guide

## 📋 Pre-Deployment Checklist

### Frontend Checks
- [ ] `npm run build` passes without errors
- [ ] `npm run lint` has no critical errors
- [ ] All translations complete (7 languages)
- [ ] Environment variables configured
- [ ] Images optimized

### Backend Checks
- [ ] `php artisan test` passes
- [ ] `php artisan config:cache` runs
- [ ] `php artisan route:cache` runs
- [ ] Database migrations ready
- [ ] Environment variables configured

---

## 🔧 Environment Variables

### Frontend (.env.local / .env.production)
```env
# API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=AutoScout24 SafeTrade

# Optional
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=UA-XXXXXXXX
```

### Backend (.env)
```env
# App
APP_NAME="AutoScout24 SafeTrade"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=autoscout_safetrade
DB_USERNAME=your_user
DB_PASSWORD=your_password

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com

# Sanctum
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=.yourdomain.com

# Filament Admin
FILAMENT_PATH=admin
```

---

## 🚀 Deployment Steps

### Option 1: VPS/Dedicated Server

#### Frontend (Next.js)
```bash
# 1. Clone and install
git clone <repo> /var/www/frontend
cd /var/www/frontend
npm ci --production

# 2. Build
npm run build

# 3. Start with PM2
pm2 start npm --name "safetrade-frontend" -- start

# 4. Setup Nginx
sudo nano /etc/nginx/sites-available/safetrade-frontend
```

**Nginx Config (Frontend):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
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

#### Backend (Laravel)
```bash
# 1. Clone and install
git clone <repo> /var/www/backend
cd /var/www/backend
composer install --no-dev --optimize-autoloader

# 2. Configure
cp .env.example .env
php artisan key:generate

# 3. Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# 4. Migrate
php artisan migrate --force

# 5. Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

**Nginx Config (Backend):**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

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
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### Option 2: Docker

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./scout-safe-pay-frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api
    depends_on:
      - backend

  backend:
    build:
      context: ./scout-safe-pay-backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - DB_DATABASE=autoscout
      - DB_USERNAME=root
      - DB_PASSWORD=secret
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: autoscout
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

#### Vercel (Frontend)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables

#### Railway/Render (Backend)
1. Connect GitHub repo
2. Set build command: `composer install --no-dev`
3. Set start command: `php artisan serve --host=0.0.0.0 --port=$PORT`
4. Add MySQL/PostgreSQL addon
5. Add environment variables

---

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring

### Recommended Tools
- **Uptime:** UptimeRobot, Pingdom
- **Logs:** Sentry, LogRocket
- **Performance:** New Relic, Datadog
- **Analytics:** Google Analytics, Plausible

### Health Check Endpoints
```
Frontend: https://yourdomain.com
Backend:  https://api.yourdomain.com/api/health
```

---

## 🔄 CI/CD Example (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd scout-safe-pay-frontend && npm ci
      - run: cd scout-safe-pay-frontend && npm run build
      - run: cd scout-safe-pay-frontend && npm run lint
      # Add deployment step

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      - run: cd scout-safe-pay-backend && composer install --no-dev
      - run: cd scout-safe-pay-backend && php artisan test
      # Add deployment step
```

---

## 🆘 Troubleshooting

### Common Issues

**Frontend build fails:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Backend 500 errors:**
```bash
# Check logs
tail -f storage/logs/laravel.log

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

**CORS issues:**
- Check `config/cors.php` in backend
- Ensure `SANCTUM_STATEFUL_DOMAINS` is set

**Database connection:**
```bash
php artisan db:show
php artisan migrate:status
```

---

## 📝 Post-Deployment

1. ✅ Verify health endpoints
2. ✅ Test user registration/login
3. ✅ Test vehicle listing
4. ✅ Test currency switching
5. ✅ Test language switching
6. ✅ Check admin panel access
7. ✅ Monitor error logs
8. ✅ Set up backups
