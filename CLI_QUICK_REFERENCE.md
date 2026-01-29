# 🔐 CLI Authentication - Quick Reference

## 3-Step Setup

```bash
# 1. Authenticate Vercel CLI
vercel login

# 2. Install Forge CLI
composer global require laravel/forge-cli

# 3. Authenticate Forge CLI
forge login
```

---

## Current Status

| Component | Status | Action |
|-----------|--------|--------|
| **Vercel CLI** | ✅ Installed (v50.8.1) | Run `vercel login` |
| **Forge CLI** | 📦 Ready | Run `composer global require laravel/forge-cli` |
| **Auth Status** | ⏳ Pending | Complete 3 steps above |

---

## Vercel Login Steps

1. Run: `vercel login`
2. See: "Visit vercel.com/device and enter CODE-XXXX"
3. Visit: https://vercel.com/device
4. Enter the code from terminal
5. Click Approve
6. Automatically logged in ✅

**Verify:** `vercel whoami`

---

## Forge Login Steps

1. Visit: https://forge.laravel.com/account/api
2. Create new API token
3. Copy the token
4. Run: `forge login`
5. Paste token when prompted ✅

**Verify:** `forge whoami`

---

## Documentation Files

| File | Purpose |
|------|---------|
| [CLI_AUTHENTICATION_GUIDE.md](CLI_AUTHENTICATION_GUIDE.md) | Complete guide with all commands |
| [CLI_CONNECTION_STATUS.md](CLI_CONNECTION_STATUS.md) | Setup checklist and status |
| [setup-cli.sh](setup-cli.sh) | Automated setup script (optional) |

---

## After Authentication

### Check Your Accounts
```bash
vercel whoami
forge whoami
```

### View Projects
```bash
vercel projects list
forge servers
```

### Deploy
```bash
./deploy-all.sh 3
```

---

## Key URLs

- **Vercel:** https://vercel.com/account/tokens
- **Forge:** https://forge.laravel.com/account/api
- **Device Auth:** https://vercel.com/device

---

## Commands Reference

**Vercel:**
```bash
vercel login                    # Login
vercel whoami                   # Check auth
vercel projects list            # List projects
vercel --prod                   # Deploy production
vercel env list                 # List env vars
```

**Forge:**
```bash
forge login                     # Login
forge whoami                    # Check auth
forge servers                   # List servers
forge sites -s <id>            # List sites
forge site:deploy <id>         # Deploy site
```

---

## Support

- Vercel Docs: https://vercel.com/docs/cli
- Forge Docs: https://forge.laravel.com/docs

---

**Created:** January 29, 2026
**Status:** Ready for Authentication
