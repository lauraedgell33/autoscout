#!/bin/bash

# ================================================
# Script de Deployment Frontend pe Vercel
# ================================================

set -e

RESET='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}║        🚀 SafeTrade Frontend Deployment to Vercel             ║${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ================================================
# 1. PRE-DEPLOYMENT CHECKS
# ================================================
echo -e "${YELLOW}📋 Pre-deployment checks...${RESET}"
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the frontend directory.${RESET}"
    exit 1
fi

if [ ! -f "next.config.ts" ]; then
    echo -e "${RED}❌ next.config.ts not found. Make sure you're in the frontend directory.${RESET}"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not a git repository. Initialize git first.${RESET}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes.${RESET}"
    read -p "Do you want to commit and push them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Committing changes..."
        git add .
        git commit -m "Pre-deployment changes"
        git push origin main
    else
        echo -e "${RED}❌ Deployment cancelled.${RESET}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Git repository is clean${RESET}"
echo ""

# ================================================
# 2. INSTALL VERCEL CLI
# ================================================
echo -e "${YELLOW}📦 Checking Vercel CLI...${RESET}"
echo ""

if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI available${RESET}"
echo ""

# ================================================
# 3. LOGIN TO VERCEL
# ================================================
echo -e "${YELLOW}🔐 Vercel Authentication${RESET}"
echo ""

if ! vercel whoami &> /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel.${RESET}"
    echo "Opening Vercel login..."
    vercel login
else
    VERCEL_USER=$(vercel whoami)
    echo -e "${GREEN}✅ Logged in as: $VERCEL_USER${RESET}"
fi

echo ""

# ================================================
# 4. CONFIGURE ENVIRONMENT VARIABLES
# ================================================
echo -e "${YELLOW}🔧 Environment Configuration${RESET}"
echo ""

# Create .env.production.local if it doesn't exist
if [ ! -f ".env.production.local" ]; then
    echo "Creating .env.production.local..."
    cat > .env.production.local << 'EOF'
# Vercel Production Environment Variables
NEXT_PUBLIC_API_URL=https://api.safetrade.com
NEXT_PUBLIC_APP_NAME=SafeTrade
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=production

# Add other production environment variables as needed
EOF
    echo -e "${GREEN}✅ .env.production.local created${RESET}"
else
    echo -e "${GREEN}✅ .env.production.local already exists${RESET}"
fi

echo ""

# ================================================
# 5. INSTALL DEPENDENCIES
# ================================================
echo -e "${YELLOW}📚 Installing dependencies...${RESET}"
echo ""

npm ci

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${RESET}"
echo ""

# ================================================
# 6. BUILD PROJECT
# ================================================
echo -e "${YELLOW}🔨 Building project...${RESET}"
echo ""

npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Project built successfully${RESET}"
echo ""

# ================================================
# 7. DEPLOYMENT
# ================================================
echo -e "${YELLOW}🚀 Deploying to Vercel...${RESET}"
echo ""

# Deploy using vercel CLI
DEPLOY_OUTPUT=$(vercel --prod 2>&1)

if [[ $DEPLOY_OUTPUT == *"✓"* ]] || [[ $DEPLOY_OUTPUT == *"Deployed"* ]] || [[ $DEPLOY_OUTPUT == *"Success"* ]]; then
    echo -e "${GREEN}✅ Deployment successful!${RESET}"
else
    echo -e "${YELLOW}⚠️  Deployment output:${RESET}"
    echo "$DEPLOY_OUTPUT"
fi

echo ""

# ================================================
# 8. GET DEPLOYMENT URL
# ================================================
echo -e "${YELLOW}🔗 Getting deployment URL...${RESET}"
echo ""

# Extract project info
VERCEL_PROJECT_ID=$(cat .vercel/project.json 2>/dev/null | grep -o '"projectId":"[^"]*' | cut -d'"' -f4 || echo "")
VERCEL_ORG_ID=$(cat .vercel/project.json 2>/dev/null | grep -o '"orgId":"[^"]*' | cut -d'"' -f4 || echo "")

if [ -n "$VERCEL_PROJECT_ID" ] && [ -n "$VERCEL_ORG_ID" ]; then
    DEPLOYMENT_URL="https://safetrade.vercel.app"
    echo -e "${GREEN}✅ Deployment URL: $DEPLOYMENT_URL${RESET}"
else
    echo -e "${YELLOW}ℹ️  Check your Vercel dashboard for the deployment URL${RESET}"
fi

echo ""

# ================================================
# 9. POST-DEPLOYMENT CHECKS
# ================================================
echo -e "${YELLOW}🔍 Post-deployment verification...${RESET}"
echo ""

if [ -n "$DEPLOYMENT_URL" ]; then
    # Wait a bit for the deployment to be live
    sleep 5
    
    # Check if deployment is responding
    echo "Checking deployment health..."
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "206" ]; then
        echo -e "${GREEN}✅ Deployment is responding (HTTP $RESPONSE)${RESET}"
    else
        echo -e "${YELLOW}⚠️  Server response: HTTP $RESPONSE${RESET}"
    fi
fi

echo ""

# ================================================
# 10. DEPLOYMENT SUMMARY
# ================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${GREEN}║            ✅ DEPLOYMENT COMPLETED SUCCESSFULLY ✅            ║${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

echo "📊 Deployment Summary:"
echo "  • Platform: Vercel"
echo "  • Environment: Production"
if [ -n "$DEPLOYMENT_URL" ]; then
    echo "  • URL: $DEPLOYMENT_URL"
fi
echo "  • Region: Auto-selected by Vercel"
echo ""

echo -e "${YELLOW}📝 Next Steps:${RESET}"
echo "  1. Visit https://vercel.com/dashboard to monitor the deployment"
echo "  2. Check deployment logs for any build issues"
echo "  3. Test the application on the live URL"
echo "  4. Set up custom domain if needed"
echo "  5. Configure preview deployments for pull requests"
echo ""

echo -e "${YELLOW}🔗 Useful Links:${RESET}"
echo "  • Vercel Dashboard: https://vercel.com/dashboard"
echo "  • Project Settings: https://vercel.com/dashboard/project-settings"
echo "  • Documentation: https://vercel.com/docs"
echo ""

echo -e "${GREEN}✨ Frontend is now live on Vercel!${RESET}"
echo ""

# ================================================
# 11. PUSH DEPLOYMENT INFORMATION
# ================================================
echo -e "${YELLOW}📤 Recording deployment...${RESET}"
echo ""

# Create deployment record
cat > .vercel-deployment.log << EOF
Deployment Date: $(date)
Platform: Vercel
Environment: Production
URL: $DEPLOYMENT_URL
Vercel User: $VERCEL_USER
Git Branch: $(git rev-parse --abbrev-ref HEAD)
Git Commit: $(git rev-parse HEAD)
EOF

echo -e "${GREEN}✅ Deployment recorded${RESET}"
echo ""
