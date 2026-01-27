#!/bin/bash

# ================================================
# Pre-Deployment Verification Script
# ================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "╔════════════════════════════════════════════╗"
echo "║   🔍 Pre-Deployment Verification Check    ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Counters
PASSED=0
FAILED=0
WARNINGS=0

check_passed() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

check_failed() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# ================================================
# 1. BACKEND CHECKS
# ================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  BACKEND CHECKS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check backend directory exists
if [ -d "scout-safe-pay-backend" ]; then
    check_passed "Backend directory exists"
    cd scout-safe-pay-backend
    
    # Check vapor.yml
    if [ -f "vapor.yml" ]; then
        check_passed "vapor.yml exists"
    else
        check_failed "vapor.yml not found"
    fi
    
    # Check .env.vapor
    if [ -f ".env.vapor" ]; then
        check_passed ".env.vapor template exists"
    else
        check_warning ".env.vapor template not found"
    fi
    
    # Check composer.json has vapor
    if grep -q "laravel/vapor-core" composer.json; then
        check_passed "Laravel Vapor Core installed"
    else
        check_failed "Laravel Vapor Core not in composer.json"
    fi
    
    # Check CORS configuration
    if [ -f "config/cors.php" ]; then
        if grep -q "allowed_origins_patterns" config/cors.php; then
            check_passed "CORS configured for production"
        else
            check_warning "CORS might need production patterns"
        fi
    else
        check_failed "config/cors.php not found"
    fi
    
    # Check vapor CLI
    if command -v vapor &> /dev/null; then
        check_passed "Vapor CLI installed"
    else
        check_failed "Vapor CLI not installed (run: composer global require laravel/vapor-cli)"
    fi
    
    cd ..
else
    check_failed "Backend directory not found"
fi

echo ""

# ================================================
# 2. FRONTEND CHECKS
# ================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  FRONTEND CHECKS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check frontend directory exists
if [ -d "scout-safe-pay-frontend" ]; then
    check_passed "Frontend directory exists"
    cd scout-safe-pay-frontend
    
    # Check vercel.json
    if [ -f "vercel.json" ]; then
        check_passed "vercel.json exists"
    else
        check_warning "vercel.json not found (optional)"
    fi
    
    # Check .env.production
    if [ -f ".env.production" ]; then
        check_passed ".env.production template exists"
    else
        check_warning ".env.production template not found"
    fi
    
    # Check package.json
    if [ -f "package.json" ]; then
        check_passed "package.json exists"
        
        # Check for build script
        if grep -q '"build":' package.json; then
            check_passed "Build script configured"
        else
            check_failed "No build script in package.json"
        fi
    else
        check_failed "package.json not found"
    fi
    
    # Check next.config
    if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
        check_passed "Next.js config exists"
    else
        check_failed "Next.js config not found"
    fi
    
    # Check vercel CLI
    if command -v vercel &> /dev/null; then
        check_passed "Vercel CLI installed"
    else
        check_failed "Vercel CLI not installed (run: npm install -g vercel)"
    fi
    
    cd ..
else
    check_failed "Frontend directory not found"
fi

echo ""

# ================================================
# 3. GIT CHECKS
# ================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  GIT CHECKS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if git repo
if [ -d ".git" ]; then
    check_passed "Git repository initialized"
    
    # Check for remote
    if git remote -v | grep -q "origin"; then
        check_passed "Git remote configured"
    else
        check_warning "No git remote 'origin' configured"
    fi
    
    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        check_passed "No uncommitted changes"
    else
        check_warning "You have uncommitted changes"
        echo "         Run: git add . && git commit -m 'Configure deployment'"
    fi
else
    check_failed "Not a git repository"
fi

echo ""

# ================================================
# 4. DOCUMENTATION CHECKS
# ================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  DOCUMENTATION CHECKS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "DEPLOYMENT_GUIDE.md" ]; then
    check_passed "DEPLOYMENT_GUIDE.md exists"
else
    check_warning "DEPLOYMENT_GUIDE.md not found"
fi

if [ -f "ENVIRONMENT_VARIABLES.md" ]; then
    check_passed "ENVIRONMENT_VARIABLES.md exists"
else
    check_warning "ENVIRONMENT_VARIABLES.md not found"
fi

if [ -f "deploy-all.sh" ]; then
    check_passed "deploy-all.sh script exists"
    if [ -x "deploy-all.sh" ]; then
        check_passed "deploy-all.sh is executable"
    else
        check_warning "deploy-all.sh not executable (run: chmod +x deploy-all.sh)"
    fi
else
    check_warning "deploy-all.sh not found"
fi

echo ""

# ================================================
# SUMMARY
# ================================================

echo "╔════════════════════════════════════════════╗"
echo "║              📊 SUMMARY                    ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Passed:   $PASSED${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo -e "${RED}Failed:   $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ Ready for deployment!                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./deploy-all.sh"
    echo "2. Or read: DEPLOYMENT_GUIDE.md"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ❌ Fix issues before deploying            ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Please fix the failed checks above."
    exit 1
fi
