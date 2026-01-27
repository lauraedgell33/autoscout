# 🚀 Quick Start - Railway Deployment

## ⚡ Deployment în 5 Minute

### 📌 Opțiunea 1: Via Railway Dashboard (CEL MAI SIMPLU)

#### Pas 1: Sign Up pe Railway

1. Mergi pe **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up cu **GitHub** (GRATUIT, fără card de credit)

#### Pas 2: Deploy Backend

1. Click **"Deploy from GitHub repo"**
2. Autorizează Railway să acceseze GitHub
3. Selectează repository-ul `scout`
4. Railway detectează automat Laravel și începe build-ul!

#### Pas 3: Adaugă Database

1. În Railway Dashboard, click **"+ New"**
2. Selectează **"Database"** → **"Add MySQL"**
3. ✅ Gata! Database-ul este conectat automat

#### Pas 4: Setează Environment Variables

Click pe service-ul tău → Tab **"Variables"** → Add:

```env
APP_NAME=AutoScout24 SafeTrade
APP_ENV=production
APP_KEY=base64:AWs0dTYjNtTmoDlPy+mt8joPQfJcabdGuJeCwAMsB4o=
APP_DEBUG=false
SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database
MAIL_MAILER=log
FILESYSTEM_DISK=public
```

**⚠️ IMPORTANT:** După Vercel deployment, adaugă:
```env
FRONTEND_URL=https://your-app.vercel.app
SANCTUM_STATEFUL_DOMAINS=your-app.vercel.app
```

#### Pas 5: Deploy se face AUTOMAT!

Railway va:
- ✅ Instala dependencies (composer install)
- ✅ Rula migrations
- ✅ Cache config/routes/views
- ✅ Start server

**În ~2-3 minute vei avea URL-ul:** `https://your-app.up.railway.app`

---

### 📌 Opțiunea 2: Via Railway CLI

```bash
# 1. Instalează Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Init project
cd scout-safe-pay-backend
railway init

# 4. Deploy
railway up

# 5. Open in browser
railway open
```

---

## 🎯 Deploy Frontend pe Vercel

```bash
cd scout-safe-pay-frontend

# Login
vercel login

# Deploy
vercel --prod
```

**În Vercel Dashboard → Variables**, adaugă:

```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api
NEXT_PUBLIC_API_BASE_URL=https://your-app.up.railway.app/api
NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
# ... rest din .env.production
```

---

## 🔄 Update CORS pe Backend

După ce ai URL-ul Vercel, mergi în **Railway Dashboard**:

1. Click pe service backend
2. Tab **"Variables"**
3. Add/Update:
   ```env
   FRONTEND_URL=https://your-vercel-app.vercel.app
   SANCTUM_STATEFUL_DOMAINS=your-vercel-app.vercel.app
   ```
4. Railway va redeploy automat!

---

## ✅ Verificare

```bash
# Test backend
curl https://your-app.up.railway.app/api/health

# Răspuns așteptat: {"status":"ok"}
```

Accesează frontend: `https://your-vercel-app.vercel.app`

---

## 💰 Cost: $0/lună

Railway oferă **$5 credit GRATUIT** în fiecare lună - suficient pentru:
- Backend Laravel
- Database MySQL
- Traffic moderat

---

## 🆘 Probleme?

### Build Failed
- Verifică logs în Railway Dashboard
- Asigură-te că `Procfile` și `nixpacks.toml` există

### Database Connection Error
- Verifică că ai adăugat MySQL service în Railway
- Railway setează automat `DATABASE_URL`

### CORS Error
- Verifică `FRONTEND_URL` în Railway Variables
- Verifică `SANCTUM_STATEFUL_DOMAINS`

---

## 📚 Mai Multe Detalii

Vezi [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md) pentru ghid complet.

---

## 🎉 Gata!

**Backend:** `https://your-app.up.railway.app`  
**Frontend:** `https://your-vercel-app.vercel.app`  
**Admin:** `https://your-app.up.railway.app/admin`

**Total timp:** ~10 minute  
**Total cost:** $0/lună 🎊
