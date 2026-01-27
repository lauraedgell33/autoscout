#!/bin/bash

# ================================================
# Script COMPLET de Deployment
# Backend: Laravel Cloud | Frontend: Vercel
# ================================================

set -e

echo "╔════════════════════════════════════════════╗"
echo "║   🚀 Scout Safe Pay - Full Deployment     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if required tools are installed
echo "📋 Checking required tools..."
echo ""

MISSING_TOOLS=()

if ! command -v vapor &> /dev/null; then
    MISSING_TOOLS+=("vapor")
fi

if ! command -v vercel &> /dev/null; then
    MISSING_TOOLS+=("vercel")
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
    print_warning "Missing tools: ${MISSING_TOOLS[*]}"
    echo ""
    read -p "Install missing tools? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for tool in "${MISSING_TOOLS[@]}"; do
            case $tool in
                vapor)
                    echo "Installing Vapor CLI..."
                    composer global require laravel/vapor-cli
                    export PATH="$HOME/.composer/vendor/bin:$PATH"
                    ;;
                vercel)
                    echo "Installing Vercel CLI..."
                    npm install -g vercel
                    ;;
            esac
        done
    else
        print_error "Cannot proceed without required tools"
        exit 1
    fi
fi

print_success "All required tools are available"
echo ""

# Main menu
echo "Select deployment option:"
echo ""
echo "1) 🔧 Backend only (Laravel Cloud)"
echo "2) 💻 Frontend only (Vercel)"
echo "3) 🌍 Full deployment (Backend + Frontend)"
echo "4) ⚙️  Setup & Configuration"
echo "5) ❌ Cancel"
echo ""
read -p "Enter choice (1-5): " main_choice

case $main_choice in
    1)
        # Backend only
        echo ""
        echo "════════════════════════════════════════"
        echo "  BACKEND DEPLOYMENT - LARAVEL CLOUD"
        echo "════════════════════════════════════════"
        cd scout-safe-pay-backend
        
        if [ -f "deploy.sh" ]; then
            ./deploy.sh
        else
            vapor deploy production
        fi
        ;;
        
    2)
        # Frontend only
        echo ""
        echo "════════════════════════════════════════"
        echo "  FRONTEND DEPLOYMENT - VERCEL"
        echo "════════════════════════════════════════"
        cd scout-safe-pay-frontend
        
        if [ -f "deploy.sh" ]; then
            ./deploy.sh
        else
            vercel --prod
        fi
        ;;
        
    3)
        # Full deployment
        echo ""
        echo "════════════════════════════════════════"
        echo "  FULL DEPLOYMENT"
        echo "════════════════════════════════════════"
        echo ""
        
        # Step 1: Deploy Backend
        echo "STEP 1/3: Deploying Backend..."
        echo ""
        cd scout-safe-pay-backend
        
        print_warning "Deploying backend to Laravel Cloud..."
        if vapor deploy production; then
            print_success "Backend deployed successfully!"
            
            echo ""
            read -p "Enter your Vapor URL (e.g., https://xxxxx.vapor-farm-x1.com): " VAPOR_URL
            
            if [ -z "$VAPOR_URL" ]; then
                print_error "Vapor URL is required"
                exit 1
            fi
        else
            print_error "Backend deployment failed"
            exit 1
        fi
        
        cd ..
        
        # Step 2: Update Frontend Config
        echo ""
        echo "STEP 2/3: Updating Frontend Configuration..."
        echo ""
        
        print_warning "You need to update these environment variables in Vercel Dashboard:"
        echo "  - NEXT_PUBLIC_API_URL=$VAPOR_URL/api"
        echo "  - NEXT_PUBLIC_API_BASE_URL=$VAPOR_URL/api"
        echo ""
        read -p "Press Enter when you've updated Vercel environment variables..." -r
        
        # Step 3: Deploy Frontend
        echo ""
        echo "STEP 3/3: Deploying Frontend..."
        echo ""
        cd scout-safe-pay-frontend
        
        print_warning "Deploying frontend to Vercel..."
        if vercel --prod; then
            print_success "Frontend deployed successfully!"
            
            echo ""
            read -p "Enter your Vercel URL (e.g., https://yourapp.vercel.app): " VERCEL_URL
            
            if [ -z "$VERCEL_URL" ]; then
                print_error "Vercel URL is required"
                exit 1
            fi
            
            # Update backend CORS
            echo ""
            print_warning "FINAL STEP: Update backend CORS settings"
            echo ""
            echo "In Laravel Cloud Dashboard, add these environment variables:"
            echo "  - FRONTEND_URL=$VERCEL_URL"
            echo "  - SANCTUM_STATEFUL_DOMAINS=${VERCEL_URL#https://}"
            echo ""
            read -p "Press Enter when done, then we'll redeploy backend..." -r
            
            cd ../scout-safe-pay-backend
            print_warning "Redeploying backend with CORS settings..."
            vapor deploy production
            
            print_success "All done!"
        else
            print_error "Frontend deployment failed"
            exit 1
        fi
        
        cd ..
        
        # Summary
        echo ""
        echo "╔════════════════════════════════════════════╗"
        echo "║          🎉 DEPLOYMENT COMPLETE!           ║"
        echo "╚════════════════════════════════════════════╝"
        echo ""
        echo "📱 Frontend: $VERCEL_URL"
        echo "🔧 Backend:  $VAPOR_URL"
        echo "👨‍💼 Admin:    $VAPOR_URL/admin"
        echo ""
        echo "Next steps:"
        echo "1. Test frontend: $VERCEL_URL"
        echo "2. Test API: curl $VAPOR_URL/api/health"
        echo "3. Access admin: $VAPOR_URL/admin"
        echo ""
        ;;
        
    4)
        # Setup & Configuration
        echo ""
        echo "════════════════════════════════════════"
        echo "  SETUP & CONFIGURATION"
        echo "════════════════════════════════════════"
        echo ""
        echo "What would you like to do?"
        echo ""
        echo "1) Login to Vapor"
        echo "2) Login to Vercel"
        echo "3) Initialize Vapor project"
        echo "4) View deployment guide"
        echo "5) Back"
        echo ""
        read -p "Enter choice (1-5): " setup_choice
        
        case $setup_choice in
            1)
                vapor login
                ;;
            2)
                vercel login
                ;;
            3)
                cd scout-safe-pay-backend
                vapor init
                ;;
            4)
                if [ -f "DEPLOYMENT_GUIDE.md" ]; then
                    less DEPLOYMENT_GUIDE.md
                else
                    print_error "DEPLOYMENT_GUIDE.md not found"
                fi
                ;;
            5)
                exit 0
                ;;
        esac
        ;;
        
    5)
        echo ""
        print_warning "Deployment cancelled"
        exit 0
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
print_success "Script completed!"
echo ""
