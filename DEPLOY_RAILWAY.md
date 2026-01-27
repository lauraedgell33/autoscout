# 🚂 Deploy pe Railway + Vercel (ALTERNATIVĂ GRATUITĂ)

## 🎯 De ce Railway?

- ✅ **$5 credit gratuit** fiecare lună
- ✅ Deploy Laravel în câteva minute
- ✅ Database MySQL inclus
- ✅ Redis inclus
- ✅ Storage inclus
- ✅ SSL automat
- ✅ Nu necesită card de credit pentru trial

**VS Laravel Cloud:**
- Laravel Cloud: $19-99/lună + AWS
- Railway: $0-5/lună (pentru proiecte mici)

---

## 📋 Pași de Deployment

### PARTEA 1: Backend pe Railway

#### Pas 1.1: Pregătire Cod

```bash
cd /home/x/Documents/scout/scout-safe-pay-backend

# Crează Procfile pentru Railway
cat > Procfile << 'EOF'
web: php artisan serve --host=0.0.0.0 --port=$PORT
EOF

# Crează nixpacks.toml pentru Railway
cat > nixpacks.toml << 'EOF'
[phases.build]
cmds = [
    'composer install --no-dev --optimize-autoloader',
    'php artisan config:cache',
    'php artisan route:cache',
    'php artisan view:cache'
]

[phases.setup]
nixPkgs = ['php82', 'php82Extensions.pdo', 'php82Extensions.pdo_mysql', 'php82Extensions.mbstring', 'php82Extensions.xml']

[start]
cmd = 'php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT'
EOF
```

#### Pas 1.2: Push pe GitHub

```bash
cd /home/x/Documents/scout

git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

#### Pas 1.3: Deploy pe Railway

1. **Mergi pe:** https://railway.app
2. **Sign up** cu GitHub (GRATUIT, fără card)
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Selectează repository-ul `scout`
6. Railway va detecta automat Laravel!

#### Pas 1.4: Adaugă Database MySQL

În Railway dashboard:
1. Click pe proiectul tău
2. Click **"+ New"** → **"Database"** → **"Add MySQL"**
3. Railway creează automat database-ul
4. Variabilele `DATABASE_URL` sunt setate automat!

#### Pas 1.5: Adaugă Redis (Opțional)

1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway setează automat `REDIS_URL`

#### Pas 1.6: Configurează Environment Variables

În Railway Dashboard → **Variables**:

```env
APP_NAME="AutoScout24 SafeTrade"
APP_ENV=production
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_DEBUG=false
APP_URL=https://your-app.up.railway.app

# Database - Railway le setează automat din MySQL service
# Dar poți overwrite dacă vrei:
DB_CONNECTION=mysql
# DB_HOST - set by Railway
# DB_PORT - set by Railway  
# DB_DATABASE - set by Railway
# DB_USERNAME - set by Railway
# DB_PASSWORD - set by Railway

# Session & Cache
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

# Sau dacă ai adăugat Redis:
# CACHE_DRIVER=redis
# SESSION_DRIVER=redis
# REDIS_URL - set by Railway

# Mail
MAIL_MAILER=log

# Frontend CORS - actualizează după Vercel deploy
FRONTEND_URL=https://your-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app

# Filesystem
FILESYSTEM_DISK=public
```

#### Pas 1.7: Deploy!

Railway va face deploy automat! În câteva minute vei avea:

✅ **URL Backend:** `https://your-app.up.railway.app`

---

### PARTEA 2: Frontend pe Vercel (același ca înainte)

```bash
cd /home/x/Documents/scout/scout-safe-pay-frontend

# Login Vercel
vercel login

# Deploy
vercel --prod
```

În **Vercel Dashboard** → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
NEXT_PUBLIC_API_BASE_URL=https://your-app.up.railway.app/api
# ... rest of variables
```

---

### PARTEA 3: Actualizează Backend CORS

După ce ai URL-ul Vercel, actualizează în **Railway Dashboard** → Variables:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
```

Railway va redeploy automat!

---

## 🔧 Comenzi Utile Railway

### Via Railway CLI (opțional)

```bash
# Instalează Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Vezi logs
railway logs

# Run migrations
railway run php artisan migrate --force

# SSH în container
railway shell

# Environment variables
railway variables
```

### Via Dashboard (mai simplu)

- **Logs:** Click pe service → Logs tab
- **Metrics:** Click pe service → Metrics tab
- **Variables:** Click pe service → Variables tab

---

## 💰 Costuri Railway

| Plan | Cost | Resurse |
|------|------|---------|
| Trial | **$0** | $5 credit/lună (suficient pentru dev) |
| Hobby | **$5/lună** | $5 credit inclus + extra la $0.000231/GB-hr |
| Pro | **$20/lună** | $20 credit inclus |

**Pentru proiect mic:** Trial plan este suficient! ($0/lună)

---

## 🎯 Workflow Complet

```bash
# 1. Pregătește codul
cd scout-safe-pay-backend
# Crează Procfile și nixpacks.toml (vezi mai sus)

# 2. Push pe GitHub
git add . && git commit -m "Railway config" && git push

# 3. Deploy backend pe Railway
# - Mergi pe railway.app
# - New Project → Deploy from GitHub
# - Adaugă MySQL database
# - Setează environment variables

# 4. Obține Railway URL
# https://your-app.up.railway.app

# 5. Deploy frontend pe Vercel
cd ../scout-safe-pay-frontend
vercel --prod
# Setează NEXT_PUBLIC_API_URL cu Railway URL

# 6. Actualizează Railway CORS
# Setează FRONTEND_URL cu Vercel URL

# ✅ DONE!
```

---

## 🐛 Troubleshooting Railway

### Build Failed
```bash
# Verifică logs în Railway Dashboard
# Verifică că ai Procfile și nixpacks.toml
```

### Database Connection Error
```bash
# Railway setează DATABASE_URL automat
# Asigură-te că ai adăugat MySQL service
# Verifică că variabilele DB_* sunt corecte
```

### 502 Bad Gateway
```bash
# Verifică logs
# Verifică că php artisan serve rulează corect
# Verifică PORT environment variable
```

---

## 📊 Comparație Platforme

| Feature | Railway | Laravel Cloud | Heroku |
|---------|---------|---------------|--------|
| **Cost/lună** | $0-5 | $50-150 | $7-25 |
| **Database** | ✅ Inclus | ✅ Inclus | ❌ Extra |
| **Redis** | ✅ Inclus | ✅ Inclus | ❌ Extra |
| **SSL** | ✅ Automat | ✅ Automat | ✅ Automat |
| **Setup Time** | 5 min | 10 min | 10 min |
| **Free Trial** | ✅ $5/lună | ❌ Nu | ❌ Nu |

**Winner pentru început:** 🚂 **Railway**

---

## ✅ Avantajele Railway

1. **GRATUIT pentru început** - $5 credit/lună
2. **Foarte simplu** - deploy în 5 minute
3. **Database inclus** - MySQL, PostgreSQL, Redis
4. **Auto-deploy** - Push to GitHub → Auto deploy
5. **Logs în real-time** - Debug ușor
6. **No credit card needed** - Pentru trial

---

## 📚 Resurse

- **Railway Docs:** https://docs.railway.app
- **Railway Templates:** https://railway.app/templates
- **Railway Laravel Template:** https://railway.app/template/laravel

---

## 🎉 Gata!

După ce urmezi pașii de mai sus, vei avea:
- ✅ Backend pe Railway: `https://your-app.up.railway.app`
- ✅ Frontend pe Vercel: `https://your-app.vercel.app`
- ✅ Database MySQL inclus
- ✅ SSL automat
- ✅ **COST: $0/lună** (cu trial)

Mult mai simplu și mai ieftin decât Laravel Cloud! 🚀
