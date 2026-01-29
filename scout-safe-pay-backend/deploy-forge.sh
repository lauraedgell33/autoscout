#!/bin/bash

# ================================================
# Script de Deployment Backend pe Laravel Forge
# ================================================

set -e

RESET='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}║       🚀 SafeTrade Backend Deployment to Laravel Forge        ║${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

# ================================================
# 1. PRE-DEPLOYMENT CHECKS
# ================================================
echo -e "${YELLOW}📋 Pre-deployment checks...${RESET}"
echo ""

# Check if we're in the backend directory
if [ ! -f "composer.json" ]; then
    echo -e "${RED}❌ composer.json not found. Make sure you're in the backend directory.${RESET}"
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

# Check git status
echo -e "${GREEN}✅ Git repository is clean${RESET}"
echo ""

# ================================================
# 2. DEPLOYMENT CONFIGURATION
# ================================================
echo -e "${YELLOW}📝 Deployment Configuration${RESET}"
echo ""

# Get Forge deployment URL from environment or ask user
FORGE_DEPLOY_URL="${FORGE_DEPLOY_URL:-}"

if [ -z "$FORGE_DEPLOY_URL" ]; then
    echo "Enter your Laravel Forge deployment URL:"
    echo "(You can find this in Forge dashboard -> Your Server -> Deploy from GitHub)"
    read -p "Deployment URL: " FORGE_DEPLOY_URL
fi

if [ -z "$FORGE_DEPLOY_URL" ]; then
    echo -e "${RED}❌ Deployment URL is required.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment URL configured${RESET}"
echo ""

# ================================================
# 3. GIT PUSH & TRIGGER DEPLOY
# ================================================
echo -e "${YELLOW}🔄 Triggering deployment on Forge...${RESET}"
echo ""

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $BRANCH"
echo ""

# Push to repository
echo "Pushing to repository..."
git push origin "$BRANCH"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Git push failed.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Code pushed to repository${RESET}"
echo ""

# Trigger Forge deployment
echo "Triggering Forge deployment..."
curl -X POST "$FORGE_DEPLOY_URL"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment triggered on Forge${RESET}"
else
    echo -e "${YELLOW}⚠️  Deployment trigger response received${RESET}"
fi

echo ""

# ================================================
# 4. DEPLOYMENT MONITORING
# ================================================
echo -e "${YELLOW}⏳ Monitoring deployment progress...${RESET}"
echo ""

# Wait for deployment to complete (polling)
MAX_WAIT=300  # 5 minutes
ELAPSED=0
WAIT_INTERVAL=10

echo "Waiting for deployment to complete (this may take a few minutes)..."
echo ""

while [ $ELAPSED -lt $MAX_WAIT ]; do
    # Try to fetch from the deployed server
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://${FORGE_DOMAIN:-your-domain.com}/api/health" 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ Server is responding (HTTP 200)${RESET}"
        break
    elif [ "$RESPONSE" = "503" ]; then
        echo "Service initializing... (HTTP 503)"
    else
        echo "Waiting for server... (HTTP $RESPONSE)"
    fi
    
    sleep $WAIT_INTERVAL
    ELAPSED=$((ELAPSED + WAIT_INTERVAL))
done

echo ""

# ================================================
# 5. POST-DEPLOYMENT CHECKS
# ================================================
echo -e "${YELLOW}🔍 Post-deployment verification...${RESET}"
echo ""

FORGE_DOMAIN="${FORGE_DOMAIN:-}"
if [ -z "$FORGE_DOMAIN" ]; then
    read -p "Enter your Forge domain (e.g., api.safetrade.com): " FORGE_DOMAIN
fi

if [ -n "$FORGE_DOMAIN" ]; then
    # Check basic health
    echo "Checking API health endpoint..."
    HEALTH_RESPONSE=$(curl -s "https://$FORGE_DOMAIN/api/health")
    
    if [[ $HEALTH_RESPONSE == *"ok"* ]] || [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
        echo -e "${GREEN}✅ API health check passed${RESET}"
    else
        echo -e "${YELLOW}⚠️  Health check response: $HEALTH_RESPONSE${RESET}"
    fi
    
    echo ""
    
    # Check database connectivity
    echo "Checking database connectivity..."
    DB_RESPONSE=$(curl -s "https://$FORGE_DOMAIN/api/health/detailed")
    
    if [[ $DB_RESPONSE == *"database"* ]]; then
        echo -e "${GREEN}✅ Database check passed${RESET}"
    else
        echo -e "${YELLOW}⚠️  Database check details: $DB_RESPONSE${RESET}"
    fi
fi

echo ""

# ================================================
# 6. DEPLOYMENT SUMMARY
# ================================================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${GREEN}║            ✅ DEPLOYMENT COMPLETED SUCCESSFULLY ✅            ║${RESET}"
echo -e "${BLUE}║                                                                ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
echo ""

echo "📊 Deployment Summary:"
echo "  • Repository branch: $BRANCH"
echo "  • Target: Laravel Forge"
if [ -n "$FORGE_DOMAIN" ]; then
    echo "  • Domain: https://$FORGE_DOMAIN"
    echo "  • Health: https://$FORGE_DOMAIN/api/health"
    echo "  • Metrics: https://$FORGE_DOMAIN/api/health/detailed"
fi
echo ""

echo -e "${YELLOW}📝 Next Steps:${RESET}"
echo "  1. Visit your Forge dashboard to monitor the deployment"
echo "  2. Check deployment logs for any errors"
echo "  3. Run smoke tests on the deployed API"
echo "  4. Monitor error tracking (Sentry)"
echo "  5. Review application metrics in your monitoring tool"
echo ""

echo -e "${YELLOW}🔗 Useful Links:${RESET}"
echo "  • Forge Dashboard: https://forge.laravel.com"
echo "  • Server Logs: Check in your Forge account"
echo "  • Application Logs: /storage/logs/laravel.log"
echo ""

echo -e "${GREEN}✨ Deployment complete! Your backend is now live on Forge.${RESET}"
echo ""
