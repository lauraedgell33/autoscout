# 🔧 Railway Deployment Troubleshooting

## 🚨 Probleme Comune și Soluții

### 1. Build Failed - "composer install" Error

**Simptome:**
```
ERROR: Failed to install dependencies
```

**Soluție:**

În Railway Dashboard → Service → **Settings** → **Environment Variables**, add:

```env
COMPOSER_ALLOW_SUPERUSER=1
```

Apoi **Redeploy**.

---

### 2. Missing PHP Extensions

**Simptome:**
```
PHP Extension xyz is missing
```

**Soluție:**

Am actualizat `nixpacks.toml` cu toate extensiile necesare. Asigură-te că ai ultimul fișier:

```bash
cd scout-safe-pay-backend
git pull origin main
```

---

### 3. Database Connection Error

**Simptome:**
```
SQLSTATE[HY000] [2002] Connection refused
```

**Soluție:**

#### Pas 1: Verifică că ai MySQL service

În Railway Dashboard:
- Click pe proiectul tău
- Ar trebui să vezi 2 servicii: Backend + MySQL
- Dacă nu vezi MySQL, add-it: **+ New → Database → MySQL**

#### Pas 2: Railway Service Variables

Railway setează automat variabilele MySQL. NU le scrie manual!

**Ce face Railway automat:**
```
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
DATABASE_URL
```

**Ce trebuie SĂ ADAUGI tu manual:**
```env
DB_CONNECTION=mysql
```

#### Pas 3: Link Services

1. Click pe **Backend service**
2. Tab **Settings**
3. Secțiunea **Service Variables**
4. Verifică că vezi variabilele MySQL (MYSQLHOST, etc.)
5. Dacă nu le vezi, click **+ New Variable** → **Add Reference** → Selectează MySQL service

---

### 4. APP_KEY Error

**Simptome:**
```
No application encryption key has been specified
```

**Soluție:**

```bash
# Local, generează APP_KEY
cd scout-safe-pay-backend
php artisan key:generate --show
```

Copiază output-ul (ex: `base64:abc123...`) și add în Railway Variables:

```env
APP_KEY=base64:abc123def456...
```

---

### 5. Migration Error - "Table already exists"

**Simptome:**
```
SQLSTATE[42S01]: Base table or view already exists
```

**Soluție A - Fresh Install:**

```bash
# Via Railway CLI
railway run php artisan migrate:fresh --seed --force
```

**Soluție B - Via Railway Dashboard:**

1. Click pe **MySQL service**
2. Tab **Data**
3. Delete toate tabelele
4. Redeploy backend

---

### 6. Port Binding Error

**Simptome:**
```
Failed to bind to port
```

**Soluție:**

Railway setează automat `PORT`. Verifică că `Procfile` folosește `$PORT`:

```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

---

### 7. Seeder Error - "Class not found"

**Simptome:**
```
Target class [DatabaseSeeder] does not exist
```

**Soluție:**

Am actualizat `nixpacks.toml` pentru a NU rula seeders automat.

Rulează seeders manual după deploy:

```bash
# Via Railway CLI
railway run php artisan db:seed --force
```

SAU șterge seeders din start command în `nixpacks.toml`:

```toml
[start]
cmd = 'php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT'
```

---

### 8. Config Cache Error

**Simptome:**
```
Unable to cache config
```

**Soluție:**

În Railway Variables, add:

```env
APP_ENV=production
APP_DEBUG=false
```

Și șterge orice variabilă care conține paths absolute locale.

---

### 9. Storage Permission Error

**Simptome:**
```
file_put_contents(): failed to open stream: Permission denied
```

**Soluție:**

Railway creează automat directorul `storage` cu permisiuni corecte.

Dacă problema persistă, add în `nixpacks.toml`:

```toml
[phases.build]
cmds = [
    'chmod -R 775 storage bootstrap/cache',
    'php artisan config:cache',
    'php artisan route:cache',
    'php artisan view:cache'
]
```

---

### 10. 502 Bad Gateway După Deploy

**Simptome:**
- Deploy se face cu succes
- Dar aplicația nu răspunde (502)

**Soluție:**

#### Verifică logs:
```bash
railway logs
```

#### Cauze comune:

**A. Server nu pornește:**

Verifică că `Procfile` există:
```
web: php artisan serve --host=0.0.0.0 --port=$PORT
```

**B. Migrations fail:**

Temporary remove migrations din start command:

```toml
[start]
cmd = 'php artisan serve --host=0.0.0.0 --port=$PORT'
```

Apoi rulează migrations manual:
```bash
railway run php artisan migrate --force
```

**C. APP_URL greșit:**

În Railway Variables:
```env
APP_URL=${PUBLIC_URL}
```

Railway va înlocui automat cu URL-ul tău.

---

## 📋 Checklist Complet Railway

Verifică că ai toate acestea:

### În Backend Directory:
- [x] `Procfile` există
- [x] `nixpacks.toml` există (cu toate extensiile PHP)
- [x] `composer.json` valid

### În Railway Dashboard:

#### Service Variables (obligatorii):
```env
APP_NAME=AutoScout24 SafeTrade
APP_ENV=production
APP_KEY=base64:... (generat cu php artisan key:generate)
APP_DEBUG=false
APP_URL=${PUBLIC_URL}
APP_LOCALE=en
APP_FALLBACK_LOCALE=en

DB_CONNECTION=mysql

SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

MAIL_MAILER=log

FILESYSTEM_DISK=public
FILAMENT_PATH=admin

COMPOSER_ALLOW_SUPERUSER=1
```

#### Service Variables (după Vercel deploy):
```env
FRONTEND_URL=https://your-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app
```

### MySQL Service:
- [x] MySQL database adăugat în proiect
- [x] Backend service linked la MySQL service

---

## 🔍 Debugging Steps

### Pas 1: Verifică Logs

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Vezi logs
railway logs
```

### Pas 2: Test Database Connection

```bash
railway run php artisan tinker
# În Tinker:
DB::connection()->getPdo();
# Ar trebui să vezi obiect PDO
```

### Pas 3: Test Migrations

```bash
railway run php artisan migrate:status
```

### Pas 4: Test Routes

```bash
railway run php artisan route:list
```

---

## 🆘 Dacă Nimic Nu Merge

### Plan B: Deploy Manual cu Docker

Creăm un `Dockerfile` pentru Railway:

```dockerfile
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Cache config
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Expose port
EXPOSE 8000

# Start server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

Apoi în Railway, selectează **Deploy from Dockerfile**.

---

## 📞 Need More Help?

**1. Share logs cu mine:**
```bash
railway logs > logs.txt
```
Apoi trimite-mi `logs.txt`

**2. Share configuration:**
```bash
railway variables > variables.txt
```

**3. Share build output:**
Screenshot din Railway Dashboard → Deployments → Latest → Build Logs

---

## ✅ Success Indicators

Deployment-ul merge bine când vezi:

```
✓ Build completed
✓ Migrations ran successfully
✓ Server started on port 8000
✓ Health check passed
```

Test API:
```bash
curl https://your-app.up.railway.app/api/health
# Expected: {"status":"ok"}
```

---

**Trimite-mi erorile exact și te ajut să le rezolv! 🔧**
