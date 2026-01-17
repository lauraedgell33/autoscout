# 🚀 Deploy AutoScout24 Backend pe Laravel Cloud

## ✅ Pregătire Completă!

Backend-ul este **100% pregătit** pentru deploy pe Laravel Cloud:
- ✅ Laravel Vapor Core instalat
- ✅ Laravel Vapor CLI instalat
- ✅ vapor.yml configurat
- ✅ Cod push-at pe GitHub

## 📋 Pași pentru Deploy (Rulează TU în terminal)

### Pas 1: Login în Laravel Cloud

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend

# Login în Vapor (va deschide browser)
vapor login
```

**Ce face:** Deschide browser pentru autentificare pe cloud.laravel.com

---

### Pas 2: Creează/Link Proiect

**Opțiunea A - Proiect NOU:**
```bash
vapor init
```

**Opțiunea B - Link la proiect EXISTENT pe cloud.laravel.com:**
```bash
# Vezi proiectele tale
vapor team:current
vapor project:list

# Link manual la proiect existent
# Editează vapor.yml și schimbă 'id: 1' cu ID-ul real
```

---

### Pas 3: Configurează Environment Variables

Mergi pe **https://cloud.laravel.com/anemette-madsen**:

1. Selectează proiectul **autoscout-safetrade**
2. Click pe **Environments** → **Production**
3. Click pe **Environment Variables**
4. Adaugă variabilele de mai jos:

```env
# Application
APP_NAME="AutoScout24 SafeTrade"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_KEY=base64:GENERATE_THIS_WITH_php_artisan_key_generate

# Database (Laravel Cloud le creează automat)
DB_CONNECTION=mysql
DB_HOST=<provided-by-laravel-cloud>
DB_PORT=3306
DB_DATABASE=autoscout
DB_USERNAME=<provided-by-laravel-cloud>
DB_PASSWORD=<provided-by-laravel-cloud>

# Cache & Session
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=sqs

# Mail (folosește AWS SES)
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@autoscout24.com
MAIL_FROM_NAME="AutoScout24 SafeTrade"

# AWS (Vapor le configurează automat)
AWS_ACCESS_KEY_ID=<provided-by-vapor>
AWS_SECRET_ACCESS_KEY=<provided-by-vapor>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=<your-s3-bucket>

# Frontend URL (pentru CORS)
FRONTEND_URL=https://your-frontend-domain.com
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
SESSION_DOMAIN=.your-domain.com
```

**⚠️ IMPORTANT:** Generează APP_KEY:
```bash
# Local
php artisan key:generate --show
# Copiază output-ul în APP_KEY pe cloud.laravel.com
```

---

### Pas 4: Creează Resources (Database, Cache, Queue)

```bash
# Creează MySQL database
vapor database:create production

# Creează Redis cache
vapor cache:create production

# Queue-ul SQS este creat automat
```

**SAU** folosește resursele existente de pe dashboard.

---

### Pas 5: Deploy Application! 🚀

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend

# Deploy production
vapor deploy production
```

**Ce se întâmplă:**
1. ✅ Vapor build-uiește aplicația (composer install, cache config, routes, views)
2. ✅ Upload asset-uri în S3
3. ✅ Deploy pe AWS Lambda
4. ✅ Rulează migrations (`php artisan migrate --force`)
5. ✅ Link storage
6. ✅ Configurează CloudFront CDN

**Durata:** ~3-5 minute

---

### Pas 6: Configurează Custom Domain

În **Laravel Cloud Dashboard**:
1. Environments → Production → **Domains**
2. Click **Add Domain**
3. Introdu: `api.autoscout24.com` (sau domeniul tău)
4. Click **Add Domain**

Laravel Cloud va afișa **DNS Records** care trebuie adăugate:

```
Type: CNAME
Name: api (sau subdomain)
Value: xxxxxxxxxxxx.cloudfront.net
```

**Actualizează DNS** la provider-ul tău (Cloudflare, Route53, etc.)

⏰ **Timp propagare DNS:** 5-60 minute

---

### Pas 7: Rulează Seed/Comenzi

```bash
# Run database seeder
vapor command production "php artisan db:seed"

# Clear cache
vapor command production "php artisan cache:clear"

# Run any artisan command
vapor command production "php artisan your:command"

# Access Tinker
vapor tinker production
```

---

### Pas 8: Configurare Queue Workers

```bash
# Scale queue workers (număr de workers)
vapor queue:scale production 3

# Sau în Dashboard:
# Environments → Production → Queues → Scale Workers
```

---

## 📊 Comenzi Utile

```bash
# Vezi deployment logs
vapor logs production

# Vezi recent deployments
vapor deployments production

# Rollback la deployment anterior
vapor rollback production

# Vezi metrics (CPU, Memory, Requests)
vapor metrics production

# Vezi database info
vapor database:show production

# Rulează migrations manual
vapor command production "php artisan migrate --force"

# Scale memory pentru performanță
vapor env:scale production --memory=2048

# Rulează tests remote
vapor command production "php artisan test"
```

---

## 🔧 Update vapor.yml după init

După `vapor init`, actualizează `vapor.yml` cu ID-ul real:

```yaml
id: 12345  # <-- ID-ul real de pe cloud.laravel.com
name: autoscout-safetrade
# ... rest of config
```

Apoi:
```bash
git add vapor.yml
git commit -m "Update Vapor project ID"
git push
```

---

## 🌐 Frontend Configuration

După deploy, actualizează **Frontend** (.env.local):

```env
# În scout-safe-pay-frontend/.env.local
NEXT_PUBLIC_API_URL=https://api.autoscout24.com/api
NEXT_PUBLIC_API_BASE_URL=https://api.autoscout24.com/api
```

---

## 🔒 CORS Configuration

Backend-ul trebuie configurat pentru frontend:

```bash
# Pe Laravel Cloud Dashboard:
# Environment Variables → Add:
FRONTEND_URL=https://your-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app
```

În `config/cors.php`:
```php
'allowed_origins' => [
    env('FRONTEND_URL'),
],
```

---

## 💰 Pricing Estimate

**Laravel Cloud (Vapor):**
- Starter: $19/month
- Professional: $49/month
- Business: $99/month

**+ AWS Usage:**
- Lambda: $0.20 per 1M requests
- RDS MySQL: ~$15-30/month (db.t3.micro)
- Redis (ElastiCache): ~$15/month
- S3 Storage: $0.023/GB
- CloudFront: $0.085/GB transfer

**Total estimate:** ~$50-150/month (depending on usage)

---

## 🐛 Troubleshooting

### Deploy Error: "No Vapor project found"
```bash
vapor init
# Sau editează vapor.yml și adaugă project ID
```

### Database Connection Error
- Verifică Environment Variables pe cloud.laravel.com
- Verifică că database-ul este creat: `vapor database:list`

### 502 Bad Gateway
- Verifică logs: `vapor logs production`
- Verifică memory limits în vapor.yml
- Scale up: `vapor env:scale production --memory=2048`

### Queue Jobs Not Processing
```bash
vapor queue:scale production 3
vapor logs production --queue
```

### Storage/Upload Issues
- Verifică S3 bucket: `vapor bucket:show production`
- Verifică IAM permissions pe AWS

---

## 📚 Resources

- **Laravel Vapor Docs**: https://docs.vapor.build
- **Laravel Cloud**: https://cloud.laravel.com
- **Support**: support@laravel.com
- **Discord**: https://discord.gg/laravel

---

## ✅ Checklist Final

- [ ] vapor login executat
- [ ] vapor init sau project linked
- [ ] Environment variables configurate pe cloud.laravel.com
- [ ] APP_KEY generat și adăugat
- [ ] Database creat
- [ ] Cache creat
- [ ] vapor deploy production executat cu succes
- [ ] Custom domain configurat (opțional)
- [ ] DNS records actualizate (opțional)
- [ ] Frontend .env.local actualizat cu API URL-ul
- [ ] CORS configurat pentru frontend
- [ ] Queue workers scaled (dacă e necesar)
- [ ] Migrations rulate: migrations rulează automat la deploy
- [ ] Application testată: accesează URL-ul Vapor

---

**După deploy, aplicația va fi live pe:**
- Default: `https://xxxxxxxxx.vapor-farm-x1.com`
- Custom: `https://api.autoscout24.com` (după configurare DNS)

**🎉 Succes cu deployment-ul!**
