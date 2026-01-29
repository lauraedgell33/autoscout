#!/bin/bash

# ================================================
# Master Deployment Script - SafeTrade
# Deploys both backend (Forge) and frontend (Vercel)
# ================================================

set -e

RESET='\033[0m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/scout-safe-pay-backend"
FRONTEND_DIR="$ROOT_DIR/scout-safe-pay-frontend"

# ================================================
# MAIN MENU
# ================================================
show_menu() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BLUE}║                 SafeTrade Deployment Menu                     ║${RESET}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    echo "Choose deployment option:"
    echo ""
    echo -e "${CYAN}  1)${RESET} Deploy Backend to Forge"
    echo -e "${CYAN}  2)${RESET} Deploy Frontend to Vercel"
    echo -e "${CYAN}  3)${RESET} Deploy Both (Backend → Frontend)"
    echo -e "${CYAN}  4)${RESET} Verify Deployments"
    echo -e "${CYAN}  5)${RESET} View Status"
    echo -e "${CYAN}  6)${RESET} Exit"
    echo ""
    read -p "Select option (1-6): " OPTION
}

# ================================================
# DEPLOYMENT FUNCTIONS
# ================================================

deploy_backend() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BLUE}        Backend Deployment to Forge${RESET}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""
    
    if [ ! -f "$BACKEND_DIR/deploy-forge.sh" ]; then
        echo -e "${RED}❌ Backend deployment script not found${RESET}"
        return 1
    fi
    
    cd "$BACKEND_DIR"
    ./deploy-forge.sh
    BACKEND_STATUS=$?
    
    return $BACKEND_STATUS
}

deploy_frontend() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BLUE}        Frontend Deployment to Vercel${RESET}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""
    
    if [ ! -f "$FRONTEND_DIR/deploy-vercel.sh" ]; then
        echo -e "${RED}❌ Frontend deployment script not found${RESET}"
        return 1
    fi
    
    cd "$FRONTEND_DIR"
    ./deploy-vercel.sh
    FRONTEND_STATUS=$?
    
    return $FRONTEND_STATUS
}

deploy_both() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
    echo -e "${BLUE}║          Full Stack Deployment (Backend + Frontend)           ║${RESET}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
    echo ""
    
    # Deploy backend first
    echo -e "${YELLOW}📦 Deploying Backend to Forge...${RESET}"
    deploy_backend
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Backend deployment failed${RESET}"
        return 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ Backend deployment completed${RESET}"
    echo ""
    
    # Wait a bit before frontend
    echo -e "${YELLOW}⏳ Waiting 30 seconds before frontend deployment...${RESET}"
    sleep 30
    
    # Deploy frontend
    echo -e "${YELLOW}📦 Deploying Frontend to Vercel...${RESET}"
    deploy_frontend
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Frontend deployment failed${RESET}"
        return 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ Frontend deployment completed${RESET}"
    
    return 0
}

verify_deployments() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BLUE}        Verifying Deployments${RESET}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""
    
    # Check backend
    echo -e "${YELLOW}🔍 Checking Backend API...${RESET}"
    BACKEND_DOMAIN="${BACKEND_DOMAIN:-api.safetrade.com}"
    
    read -p "Enter backend domain [$BACKEND_DOMAIN]: " BACKEND_INPUT
    if [ -n "$BACKEND_INPUT" ]; then
        BACKEND_DOMAIN="$BACKEND_INPUT"
    fi
    
    BACKEND_RESPONSE=$(curl -s -w "\n%{http_code}" "https://$BACKEND_DOMAIN/api/health" 2>/dev/null || echo "error\n000")
    BACKEND_HTTP=$(echo "$BACKEND_RESPONSE" | tail -n 1)
    BACKEND_BODY=$(echo "$BACKEND_RESPONSE" | head -n 1)
    
    if [ "$BACKEND_HTTP" = "200" ]; then
        echo -e "${GREEN}✅ Backend API is responding (HTTP 200)${RESET}"
        echo "   Response: $BACKEND_BODY"
    else
        echo -e "${RED}❌ Backend API error (HTTP $BACKEND_HTTP)${RESET}"
    fi
    
    echo ""
    
    # Check frontend
    echo -e "${YELLOW}🔍 Checking Frontend...${RESET}"
    FRONTEND_DOMAIN="${FRONTEND_DOMAIN:-safetrade.vercel.app}"
    
    read -p "Enter frontend domain [$FRONTEND_DOMAIN]: " FRONTEND_INPUT
    if [ -n "$FRONTEND_INPUT" ]; then
        FRONTEND_DOMAIN="$FRONTEND_INPUT"
    fi
    
    FRONTEND_HTTP=$(curl -s -o /dev/null -w "%{http_code}" "https://$FRONTEND_DOMAIN" 2>/dev/null || echo "000")
    
    if [ "$FRONTEND_HTTP" = "200" ]; then
        echo -e "${GREEN}✅ Frontend is responding (HTTP 200)${RESET}"
    else
        echo -e "${RED}❌ Frontend error (HTTP $FRONTEND_HTTP)${RESET}"
    fi
    
    echo ""
}

view_status() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo -e "${BLUE}        Deployment Status${RESET}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${RESET}"
    echo ""
    
    echo -e "${YELLOW}📋 Deployment Infrastructure:${RESET}"
    echo ""
    
    # Check backend script
    if [ -f "$BACKEND_DIR/deploy-forge.sh" ]; then
        echo -e "${GREEN}✅${RESET} Backend deployment script exists"
    else
        echo -e "${RED}❌${RESET} Backend deployment script missing"
    fi
    
    # Check frontend script
    if [ -f "$FRONTEND_DIR/deploy-vercel.sh" ]; then
        echo -e "${GREEN}✅${RESET} Frontend deployment script exists"
    else
        echo -e "${RED}❌${RESET} Frontend deployment script missing"
    fi
    
    echo ""
    echo -e "${YELLOW}🔧 Configuration Files:${RESET}"
    echo ""
    
    # Check backend config
    if [ -f "$BACKEND_DIR/.env.production" ]; then
        echo -e "${GREEN}✅${RESET} Backend production environment configured"
    else
        echo -e "${YELLOW}⚠️ ${RESET} Backend production environment not yet configured"
    fi
    
    # Check frontend config
    if [ -f "$FRONTEND_DIR/.env.production.local" ]; then
        echo -e "${GREEN}✅${RESET} Frontend production environment configured"
    else
        echo -e "${YELLOW}⚠️ ${RESET} Frontend production environment not yet configured"
    fi
    
    echo ""
    echo -e "${YELLOW}📦 Deployment Targets:${RESET}"
    echo ""
    echo "  Backend: Laravel Forge (https://api.safetrade.com)"
    echo "  Frontend: Vercel (https://safetrade.vercel.app)"
    
    echo ""
}

# ================================================
# MAIN EXECUTION
# ================================================

# Check if option provided as argument
if [ $# -gt 0 ]; then
    OPTION=$1
else
    show_menu
fi

case $OPTION in
    1)
        deploy_backend
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Backend deployment successful!${RESET}"
        else
            echo ""
            echo -e "${RED}❌ Backend deployment failed!${RESET}"
            exit 1
        fi
        ;;
    2)
        deploy_frontend
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✅ Frontend deployment successful!${RESET}"
        else
            echo ""
            echo -e "${RED}❌ Frontend deployment failed!${RESET}"
            exit 1
        fi
        ;;
    3)
        deploy_both
        if [ $? -eq 0 ]; then
            echo ""
            echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${RESET}"
            echo -e "${BLUE}║                                                                ║${RESET}"
            echo -e "${GREEN}║          ✅ FULL DEPLOYMENT SUCCESSFUL ✅                    ║${RESET}"
            echo -e "${BLUE}║                                                                ║${RESET}"
            echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${RESET}"
            echo ""
            echo "Your SafeTrade application is now live!"
            echo ""
            echo "Frontend: https://safetrade.vercel.app"
            echo "Backend API: https://api.safetrade.com"
            echo ""
        else
            echo ""
            echo -e "${RED}❌ Full deployment failed!${RESET}"
            exit 1
        fi
        ;;
    4)
        verify_deployments
        ;;
    5)
        view_status
        ;;
    *)
        echo -e "${RED}❌ Invalid option${RESET}"
        exit 1
        ;;
esac

echo ""
