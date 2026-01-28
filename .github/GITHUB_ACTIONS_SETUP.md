# GitHub Actions Setup for AutoScout24 SafeTrade

This repository uses GitHub Actions for automated testing and deployment to both Laravel Forge (backend) and Vercel (frontend).

## 🔐 Required Secrets

To enable automated deployments, you need to add the following secrets to your GitHub repository:

### Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

### 1. Backend (Forge) Secrets

#### `FORGE_SSH_KEY`
- **Description:** Private SSH key for accessing Forge server
- **How to get it:** 
  ```bash
  # Display your private key (from the codespace where we generated it)
  cat ~/.ssh/id_ed25519
  ```
- **Value:** Copy the entire private key including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

### 2. Frontend (Vercel) Secrets

#### `VERCEL_TOKEN`
- **Description:** Vercel API token for deployments
- **How to get it:**
  1. Go to https://vercel.com/account/tokens
  2. Click "Create Token"
  3. Name it: `GitHub Actions AutoScout`
  4. Copy the token

#### `VERCEL_ORG_ID` (Optional, if using team)
- **Description:** Your Vercel organization/team ID
- **How to get it:**
  1. Run: `vercel whoami` or check `.vercel/project.json`

#### `VERCEL_PROJECT_ID` (Optional, recommended)
- **Description:** Your Vercel project ID
- **How to get it:**
  1. In your project directory: `cat .vercel/project.json`
  2. Or from Vercel dashboard → Project Settings

---

## 🚀 Workflows

### 1. **Test Workflow** (`test.yml`)
- **Triggers:** Push to `main` or `develop`, Pull Requests
- **What it does:**
  - Runs Laravel backend tests
  - Builds Next.js frontend
- **Status:** ✅ No secrets required

### 2. **Deploy Backend** (`deploy-backend.yml`)
- **Triggers:** Push to `main` with backend changes
- **What it does:**
  - Connects to Forge server via SSH
  - Runs deployment script
  - Verifies API is responding
- **Required Secrets:** `FORGE_SSH_KEY`

### 3. **Deploy Frontend** (`deploy-frontend.yml`)
- **Triggers:** Push to `main` with frontend changes
- **What it does:**
  - Builds Next.js application
  - Deploys to Vercel production
- **Required Secrets:** `VERCEL_TOKEN`

---

## 📝 Setup Instructions

### Step 1: Add SSH Key to GitHub Secrets

```bash
# From your development environment (codespace)
cat ~/.ssh/id_ed25519
```

Copy the output and add it as `FORGE_SSH_KEY` in GitHub Secrets.

### Step 2: Get Vercel Token

```bash
# Login to Vercel
vercel login

# Get your token from: https://vercel.com/account/tokens
```

Add the token as `VERCEL_TOKEN` in GitHub Secrets.

### Step 3: Link Vercel Project (if needed)

```bash
cd scout-safe-pay-frontend
vercel link
```

This will create a `.vercel` directory with project configuration.

### Step 4: Test the Setup

Push a change to the `main` branch:

```bash
git add .
git commit -m "test: Trigger GitHub Actions"
git push origin main
```

Watch the workflows run in: `Actions` tab on GitHub.

---

## 🔍 Monitoring Deployments

### View Workflow Status
- Go to: `https://github.com/lauraedgell33/autoscout/actions`
- Click on any workflow run to see details

### Manual Deployment Trigger
- Go to `Actions` tab
- Select the workflow you want to run
- Click `Run workflow` button
- Select branch and run

---

## 🐛 Troubleshooting

### Backend deployment fails
1. Check if `FORGE_SSH_KEY` is correctly set
2. Verify SSH key is added to Forge dashboard
3. Check server logs: `ssh forge@146.190.185.209 'tail -f adminautoscout.dev/releases/000000/scout-safe-pay-backend/storage/logs/laravel.log'`

### Frontend deployment fails
1. Verify `VERCEL_TOKEN` is valid
2. Check if project is properly linked to Vercel
3. View Vercel deployment logs in dashboard

### Tests failing
1. Check if all dependencies are properly installed
2. Review test output in GitHub Actions logs
3. Run tests locally to reproduce the issue

---

## 📊 Current Status

| Component | Status | Last Deploy |
|-----------|--------|-------------|
| Backend Tests | ⚠️ 31/48 passing | - |
| Frontend Build | ✅ Passing | - |
| Backend Deploy | 🟡 Pending secrets | - |
| Frontend Deploy | 🟡 Pending secrets | - |

---

## 🔄 Deployment Flow

```mermaid
graph LR
    A[Push to main] --> B{Changed files?}
    B -->|Backend| C[Run Tests]
    B -->|Frontend| D[Build Next.js]
    C --> E[Deploy to Forge]
    D --> F[Deploy to Vercel]
    E --> G[Verify API]
    F --> H[Verify Frontend]
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Laravel Forge Deployment](https://forge.laravel.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Last Updated:** 2026-01-28
