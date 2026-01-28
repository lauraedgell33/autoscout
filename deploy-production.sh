#!/bin/bash

# AutoScout24 SafeTrade - Production Deployment Script
# This script deploys both backend and frontend to production

set -e

echo "🚀 Starting AutoScout24 SafeTrade Production Deployment"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend Deployment (Laravel Forge)
echo -e "\n${BLUE}📦 Deploying Backend to Forge...${NC}"
ssh forge@146.190.185.209 'bash adminautoscout.dev/.deployment' || {
    echo -e "${RED}❌ Backend deployment failed!${NC}"
    exit 1
}
echo -e "${GREEN}✅ Backend deployed successfully!${NC}"

# Test Backend API
echo -e "\n${BLUE}🧪 Testing Backend API...${NC}"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://adminautoscout.dev/api/dealers)
if [ "$BACKEND_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ Backend API is responding (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Backend API test failed (HTTP $BACKEND_STATUS)${NC}"
    exit 1
fi

# Frontend Build & Deploy (Vercel)
echo -e "\n${BLUE}🎨 Building Frontend...${NC}"
cd /workspaces/autoscout/scout-safe-pay-frontend
NEXT_PUBLIC_API_URL=https://adminautoscout.dev/api npm run build || {
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
}
echo -e "${GREEN}✅ Frontend built successfully!${NC}"

# Summary
echo -e "\n${GREEN}=================================================="
echo -e "✅ Deployment Complete!"
echo -e "=================================================="
echo -e "Backend:  https://adminautoscout.dev"
echo -e "Admin:    https://adminautoscout.dev/admin"
echo -e "API:      https://adminautoscout.dev/api"
echo -e "Frontend: Deploy to Vercel manually or via CI/CD"
echo -e "==================================================${NC}\n"
