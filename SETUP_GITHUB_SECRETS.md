# 🔐 Setup GitHub Secrets - Instrucțiuni Pas cu Pas

## Status Curent
✅ GitHub Actions workflows create și push-ate  
🟡 Secrets trebuie configurate manual în GitHub  
🟡 Integrările Vercel/Forge trebuie dezactivate  

---

## Pașii de Urmat

### 1️⃣ Obține SSH Key pentru Forge

```bash
# Din acest codespace, rulează:
cat ~/.ssh/id_ed25519
```

**Copiază ÎNTREGUL output**, inclusiv liniile:
- `-----BEGIN OPENSSH PRIVATE KEY-----`
- `-----END OPENSSH PRIVATE KEY-----`

### 2️⃣ Adaugă SSH Key în GitHub

1. Mergi la: https://github.com/lauraedgell33/autoscout/settings/secrets/actions
2. Click pe **"New repository secret"**
3. Name: `FORGE_SSH_KEY`
4. Value: Lipește SSH key-ul complet din pasul 1
5. Click **"Add secret"**

---

### 3️⃣ Obține Vercel Token

1. Mergi la: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name: `GitHub Actions AutoScout`
4. Scope: `Full Account`
5. Click **"Create"**
6. **COPIAZĂ TOKEN-UL** (nu îl vei mai vedea!)

### 4️⃣ Adaugă Vercel Token în GitHub

1. Mergi la: https://github.com/lauraedgell33/autoscout/settings/secrets/actions
2. Click pe **"New repository secret"**
3. Name: `VERCEL_TOKEN`
4. Value: Lipește token-ul Vercel din pasul 3
5. Click **"Add secret"**

---

### 5️⃣ Dezactivează Integrările Directe

#### Pentru Vercel:
1. Mergi la: https://vercel.com/lauraedgell33/autoscout-frontend/settings/git
2. În secțiunea "Git Integration", click **"Disconnect"**
3. Confirmă dezactivarea

**De ce?** Ca să nu ai deployment-uri duble (unul de la Vercel direct, altul de la GitHub Actions)

#### Pentru Forge:
1. Mergi la: https://forge.laravel.com/servers/000000/sites/000000
2. În tab "App", dezactivează "Quick Deploy"
3. Lasă doar deployment prin SSH (via GitHub Actions)

---

### 6️⃣ Testează Deployment-ul

După ce ai configurat secrets-urile:

```bash
# Fă o modificare mică și push:
echo "# Test GitHub Actions" >> README.md
git add README.md
git commit -m "test: Trigger GitHub Actions workflows"
git push origin main
```

#### Monitorizează Workflow-urile:
1. Mergi la: https://github.com/lauraedgell33/autoscout/actions
2. Vei vedea 3 workflow-uri pornind:
   - ✅ **Test** - Rulează testele
   - 🚀 **Deploy Backend** - Deploy pe Forge
   - 🚀 **Deploy Frontend** - Deploy pe Vercel

---

## 🔍 Verificare

### Backend Deployment Success:
```bash
# Verifică API-ul:
curl https://adminautoscout.dev/api/health
```

Răspuns așteptat: `{"status":"ok","environment":"production"}`

### Frontend Deployment Success:
```bash
# Verifică frontend-ul:
curl -I https://your-vercel-url.vercel.app
```

Răspuns așteptat: `HTTP/2 200`

---

## 🐛 Troubleshooting

### Error: "Permission denied (publickey)"
- Verifică că `FORGE_SSH_KEY` este corect copiat (cu BEGIN/END lines)
- Asigură-te că SSH key-ul este adăugat și în Forge Dashboard

### Error: "Vercel token is invalid"
- Generează un nou token din Vercel dashboard
- Actualizează secret-ul `VERCEL_TOKEN` în GitHub

### Error: "No changes detected"
- Workflow-urile se activează doar când sunt modificări în directoarele relevante:
  - `scout-safe-pay-backend/**` → Deploy Backend
  - `scout-safe-pay-frontend/**` → Deploy Frontend

---

## 📊 Status Verificare

După configurare, completează:

- [ ] FORGE_SSH_KEY adăugat în GitHub Secrets
- [ ] VERCEL_TOKEN adăugat în GitHub Secrets
- [ ] Integrarea Vercel dezactivată
- [ ] Quick Deploy Forge dezactivat
- [ ] Test workflow rulat cu succes
- [ ] Backend deployment workflow rulat cu succes
- [ ] Frontend deployment workflow rulat cu succes
- [ ] API verificat: https://adminautoscout.dev/api/health
- [ ] Frontend verificat

---

## 📚 Resurse Utile

- **GitHub Actions Logs**: https://github.com/lauraedgell33/autoscout/actions
- **Forge Dashboard**: https://forge.laravel.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation**: [.github/GITHUB_ACTIONS_SETUP.md](.github/GITHUB_ACTIONS_SETUP.md)

---

## 🎯 Next Steps După Setup

1. **Fix Admin Panel 403**: 
   - Încearcă browser în modul incognito
   - URL: https://adminautoscout.dev/admin
   - Credentials: `admin@autoscout.com` / `Admin123!`

2. **Fix Backend Tests**:
   - Momentan: 31/48 passing (65%)
   - Vezi: [TEST_RESULTS_2026_01_28.md](TEST_RESULTS_2026_01_28.md)

3. **Monitor Production**:
   - Setup monitoring alerts
   - Check logs regulat

---

**Created:** 2026-01-28  
**Status:** ⏳ Awaiting secrets configuration
