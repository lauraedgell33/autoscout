#!/bin/bash

# ================================================
# Script de Deployment Backend pe Laravel Cloud
# ================================================

set -e

echo "🚀 Starting Laravel Cloud Deployment..."
echo ""

# Check if we're in the backend directory
if [ ! -f "vapor.yml" ]; then
    echo "❌ vapor.yml not found. Make sure you're in the backend directory."
    exit 1
fi

# Check if vapor CLI is installed
if ! command -v vapor &> /dev/null; then
    echo "❌ Vapor CLI not found. Installing..."
    composer global require laravel/vapor-cli
    export PATH="$HOME/.composer/vendor/bin:$PATH"
fi

echo "📋 Pre-deployment checks..."
echo ""

# Check if logged in
if ! vapor team:current &> /dev/null; then
    echo "⚠️  Not logged in to Vapor. Please run 'vapor login' first."
    read -p "Do you want to login now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vapor login
    else
        exit 1
    fi
fi

echo "✅ Logged in to Vapor"
echo ""

# Show current team
echo "👥 Current team:"
vapor team:current
echo ""

# Ask for environment
echo "Select environment to deploy:"
echo "1) production"
echo "2) staging"
read -p "Enter choice (1-2): " env_choice

case $env_choice in
    1)
        ENV="production"
        ;;
    2)
        ENV="staging"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📦 Deploying to: $ENV"
echo ""

# Confirm deployment
read -p "Are you sure you want to deploy to $ENV? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🏗️  Building and deploying..."
echo ""

# Deploy
vapor deploy $ENV

echo ""
echo "✅ Deployment complete!"
echo ""

# Show deployment info
echo "📊 Recent deployments:"
vapor deployments $ENV

echo ""
echo "🌐 Your application is live!"
echo ""
echo "Next steps:"
echo "1. Test the API: curl https://YOUR_VAPOR_URL/api/health"
echo "2. Check logs: vapor logs $ENV"
echo "3. View metrics: vapor metrics $ENV"
echo "4. Update frontend NEXT_PUBLIC_API_URL with your Vapor URL"
echo ""
