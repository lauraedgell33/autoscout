#!/bin/bash

# ================================================
# Script de Deployment pe Railway
# ================================================

set -e

echo "╔════════════════════════════════════════════╗"
echo "║   🚂 Railway Deployment Helper            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This script will help you deploy to Railway.${NC}"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found.${NC}"
    echo ""
    read -p "Do you want to install it? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Installing Railway CLI..."
        npm i -g @railway/cli
    else
        echo ""
        echo -e "${YELLOW}You can deploy via Railway Dashboard instead:${NC}"
        echo "1. Go to https://railway.app"
        echo "2. Sign up with GitHub"
        echo "3. New Project → Deploy from GitHub"
        echo "4. Select your repository"
        echo ""
        exit 0
    fi
fi

echo ""
echo "Railway CLI found! ✅"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null 2>&1; then
    echo "Not logged in to Railway."
    echo ""
    read -p "Do you want to login now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        railway login
    else
        echo "Please run 'railway login' manually"
        exit 1
    fi
fi

echo ""
echo "✅ Logged in to Railway"
echo ""

# Check if project is linked
if ! railway status &> /dev/null 2>&1; then
    echo "Project not linked to Railway."
    echo ""
    echo "Options:"
    echo "1) Create new project"
    echo "2) Link to existing project"
    echo ""
    read -p "Enter choice (1-2): " choice
    
    case $choice in
        1)
            railway init
            ;;
        2)
            railway link
            ;;
        *)
            echo "Invalid choice"
            exit 1
            ;;
    esac
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  📋 PRE-DEPLOYMENT CHECKLIST"
echo "═══════════════════════════════════════════"
echo ""
echo "Make sure you have:"
echo ""
echo "  ✅ Added MySQL database in Railway Dashboard"
echo "  ✅ Configured environment variables"
echo "  ✅ Set APP_KEY, FRONTEND_URL, etc."
echo ""
read -p "Have you completed these steps? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please complete the setup first:"
    echo "1. Go to Railway Dashboard"
    echo "2. Add MySQL database (+ New → Database → MySQL)"
    echo "3. Add environment variables in Variables tab"
    echo ""
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  🚀 DEPLOYING..."
echo "═══════════════════════════════════════════"
echo ""

# Deploy
railway up

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""

# Show logs
echo "Do you want to see deployment logs? (y/n)"
read -p "> " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    railway logs
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  🎉 DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Get your Railway URL:"
echo "   railway open"
echo ""
echo "2. Test your API:"
echo "   curl https://your-app.up.railway.app/api/health"
echo ""
echo "3. Update frontend NEXT_PUBLIC_API_URL with your Railway URL"
echo ""
echo "4. Deploy frontend to Vercel"
echo ""
echo "5. Update Railway FRONTEND_URL with your Vercel URL"
echo ""
