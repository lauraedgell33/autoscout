# 🔐 Vercel & Forge CLI Authentication Guide

**Status:** Both CLIs ready for authentication

---

## 📋 Quick Setup

### Step 1: Authenticate to Vercel CLI

```bash
vercel login
```

**What happens:**
1. CLI generates a device code (e.g., `SQDD-GXZS`)
2. Visit: **https://vercel.com/device**
3. Enter the device code
4. Approve the authentication in your browser
5. CLI automatically recognizes the authentication

---

### Step 2: Authenticate to Forge CLI

```bash
# Get your API token from Forge dashboard
# Visit: https://forge.laravel.com/account/api
# Create a new token and copy it

# Then login
forge login
# Paste your API token when prompted
```

---

## 🔗 Vercel CLI Authentication

### Method 1: Device Authentication (Recommended)

```bash
vercel login
```

**Steps:**
1. Run the command
2. You'll see: "Visit vercel.com/device and enter CODE-XXXX"
3. Open https://vercel.com/device
4. Enter the code shown in terminal
5. Click approve
6. CLI automatically logs in

### Method 2: Token Authentication

```bash
# Generate token at: https://vercel.com/account/tokens

# Then authenticate
vercel auth --token YOUR_TOKEN_HERE

# Or set environment variable
export VERCEL_TOKEN=your_token_here
```

### Verify Vercel Connection

```bash
vercel whoami
# Shows your Vercel username
```

---

## 🔗 Forge CLI Authentication

### Installation (if not already done)

```bash
# Requires Composer
composer global require laravel/forge-cli

# Add to PATH if needed
export PATH="$HOME/.composer/vendor/bin:$PATH"
```

### Authentication Method

```bash
# Get API token from: https://forge.laravel.com/account/api
# Create new token with "Create tokens" permission

# Then login
forge login

# Paste your token when prompted
```

### Verify Forge Connection

```bash
forge whoami
# Shows your Forge account info
```

---

## ✅ Connection Checklist

- [ ] Vercel CLI installed: `vercel --version`
- [ ] Vercel authenticated: `vercel whoami`
- [ ] Vercel projects visible: `vercel projects list`
- [ ] Forge CLI installed: `forge --version`
- [ ] Forge authenticated: `forge whoami`
- [ ] Forge servers visible: `forge servers`

---

## 🎯 Available Commands After Authentication

### Vercel Commands

```bash
# Account
vercel whoami                    # Show current user
vercel account                   # Show account details

# Projects
vercel projects list             # List all projects
vercel projects create           # Create new project
vercel projects remove           # Remove project

# Deployments
vercel deployments              # Show deployment history
vercel deployments list         # List deployments

# Environment
vercel env list                 # List env variables
vercel env add                  # Add env variable
vercel env remove               # Remove env variable

# Deployment
vercel --prod                   # Deploy to production
vercel --preview                # Deploy to preview

# Development
vercel dev                      # Run local dev server
```

### Forge Commands

```bash
# Account
forge whoami                    # Show current user
forge account:current-server    # Show current server

# Servers
forge servers                   # List all servers
forge server:info <server_id>   # Get server info
forge server:reboot <server_id> # Reboot server

# Sites
forge sites -s <server_id>      # List sites on server
forge site:info <site_id>       # Get site info
forge site:deploy <site_id>     # Deploy site

# Database
forge databases -s <server_id>  # List databases
forge database:create           # Create database

# Certificates
forge certificates              # List certificates
```

---

## 📁 Configuration Locations

### Vercel Configuration
- **Location:** `~/.vercel/`
- **Token file:** `~/.vercel/auth.json`
- **Remove auth:** `rm -rf ~/.vercel/`

### Forge Configuration
- **Location:** `~/.config/forge/`
- **Token file:** `~/.config/forge/token`
- **Remove auth:** `rm -rf ~/.config/forge/`

---

## 🆘 Troubleshooting

### Vercel Issues

**Issue:** "No existing credentials found"
```bash
# Solution: Login
vercel login
```

**Issue:** Token expired
```bash
# Solution: Re-authenticate
vercel logout
vercel login
```

**Issue:** Device code not working
```bash
# Solution: Try token authentication
export VERCEL_TOKEN=your_token
vercel whoami
```

### Forge Issues

**Issue:** "Unauthenticated" error
```bash
# Solution: Login again
forge login
# Paste your API token
```

**Issue:** "API token invalid"
```bash
# Solution: Generate new token
# Visit: https://forge.laravel.com/account/api
# Create new token and use forge login
```

---

## 🚀 Ready for Deployment

Once authenticated, you can deploy:

```bash
# Deploy everything
./deploy-all.sh 3

# Or deploy individually
./deploy-all.sh 1  # Backend to Forge
./deploy-all.sh 2  # Frontend to Vercel
```

---

## 📊 Session Management

### Check Authentication Status

```bash
# Vercel
vercel whoami
echo $VERCEL_TOKEN  # If using token env var

# Forge
forge whoami
cat ~/.config/forge/token  # Check if token exists
```

### Logout (if needed)

```bash
# Vercel
vercel logout

# Forge
rm -rf ~/.config/forge/
# Then re-authenticate with: forge login
```

### Store Credentials Safely

**Vercel:**
```bash
# Use environment variable for CI/CD
export VERCEL_TOKEN="your_token"
```

**Forge:**
```bash
# Use environment variable for CI/CD
export FORGE_TOKEN="your_token"
```

---

## 🔑 Getting Your API Tokens

### Vercel API Token

1. Visit: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it (e.g., "CLI Auth")
4. Select scope: Full access
5. Copy the token
6. Use in CLI: `vercel auth --token TOKEN`

### Forge API Token

1. Visit: https://forge.laravel.com/account/api
2. Click "Create API Token"
3. Name it (e.g., "Deployment")
4. Copy the token
5. Use in CLI: `forge login` (paste when prompted)

---

## ✨ Features After Authentication

### Vercel
- ✅ Deploy to production
- ✅ Manage projects
- ✅ Set environment variables
- ✅ View deployment history
- ✅ Manage domains
- ✅ Configure analytics

### Forge
- ✅ Deploy sites
- ✅ Manage servers
- ✅ Configure databases
- ✅ Setup email
- ✅ Manage SSL certificates
- ✅ Access logs

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs/cli
- **Forge Docs:** https://forge.laravel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Forge Support:** https://forge.laravel.com/help

---

## 🎉 Next Steps

1. **Authenticate Vercel:**
   ```bash
   vercel login
   ```

2. **Authenticate Forge:**
   ```bash
   forge login
   ```

3. **Verify both:**
   ```bash
   vercel whoami
   forge whoami
   ```

4. **Deploy:**
   ```bash
   ./deploy-all.sh 3
   ```

---

**Created:** January 29, 2026
**Status:** Ready for authentication
