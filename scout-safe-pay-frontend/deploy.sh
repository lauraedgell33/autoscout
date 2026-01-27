#!/bin/bash

# ================================================
# Script de Deployment Frontend pe Vercel
# ================================================

set -e

echo "🚀 Starting Vercel Deployment..."
echo ""

# Check if we're in the frontend directory
if [ ! -f "next.config.ts" ]; then
    echo "❌ next.config.ts not found. Make sure you're in the frontend directory."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Pre-deployment checks..."
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Not logged in to Vercel. Please login first."
    vercel login
fi

echo "✅ Logged in to Vercel"
echo ""

# Ask for environment
echo "Select deployment type:"
echo "1) Production (--prod)"
echo "2) Preview (development)"
read -p "Enter choice (1-2): " env_choice

case $env_choice in
    1)
        DEPLOY_CMD="vercel --prod"
        ENV="production"
        ;;
    2)
        DEPLOY_CMD="vercel"
        ENV="preview"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📦 Deploying to: $ENV"
echo ""

# Check environment variables
echo "⚠️  IMPORTANT: Make sure you've set these environment variables in Vercel Dashboard:"
echo ""
echo "Required variables:"
echo "  - NEXT_PUBLIC_API_URL (Backend Vapor URL)"
echo "  - NEXT_PUBLIC_API_BASE_URL (Backend Vapor URL)"
echo "  - NEXT_PUBLIC_APP_URL (Your Vercel URL)"
echo ""
read -p "Have you configured all environment variables? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⚠️  Please configure environment variables first:"
    echo "   1. Go to Vercel Dashboard"
    echo "   2. Select your project"
    echo "   3. Go to Settings → Environment Variables"
    echo "   4. Add all required variables from .env.production"
    echo ""
    read -p "Press Enter when done..." -r
fi

echo ""
echo "🏗️  Building and deploying..."
echo ""

# Deploy
$DEPLOY_CMD

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application should now be live on Vercel!"
echo ""
echo "Next steps:"
echo "1. Test the frontend in your browser"
echo "2. Verify API connection works"
echo "3. Update backend FRONTEND_URL with your Vercel URL"
echo "4. Redeploy backend with: cd ../scout-safe-pay-backend && vapor deploy production"
echo ""
