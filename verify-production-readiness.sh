#!/bin/bash

echo "🔍 Production Readiness Verification - Scout Safe Pay"
echo "===================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass=0
fail=0
warn=0

# Check backend
cd scout-safe-pay-backend

echo "📦 Backend Checks:"
echo ""

# Check APP_DEBUG
if [ -f .env ]; then
    if grep -q "^APP_DEBUG=false" .env; then
        echo -e "${GREEN}  ✅ APP_DEBUG is disabled${NC}"
        ((pass++))
    else
        echo -e "${RED}  ❌ APP_DEBUG is NOT disabled!${NC}"
        ((fail++))
    fi
    
    # Check JWT_SECRET
    if grep -q "JWT_SECRET=YOUR_JWT_SECRET" .env; then
        echo -e "${RED}  ❌ JWT_SECRET is still using placeholder!${NC}"
        ((fail++))
    else
        echo -e "${GREEN}  ✅ JWT_SECRET has been changed${NC}"
        ((pass++))
    fi
    
    # Check DB connection
    if grep -q "^DB_CONNECTION=sqlite" .env; then
        echo -e "${YELLOW}  ⚠️  Using SQLite (not recommended for production)${NC}"
        ((warn++))
    elif grep -q "^DB_CONNECTION=mysql" .env; then
        echo -e "${GREEN}  ✅ Using MySQL${NC}"
        ((pass++))
    fi
    
    # Check session security
    if grep -q "SESSION_SECURE_COOKIE=true" .env; then
        echo -e "${GREEN}  ✅ Secure cookies enabled${NC}"
        ((pass++))
    else
        echo -e "${YELLOW}  ⚠️  Secure cookies NOT enabled (should be true for production)${NC}"
        ((warn++))
    fi
    
    # Check session encryption
    if grep -q "SESSION_ENCRYPT=true" .env; then
        echo -e "${GREEN}  ✅ Session encryption enabled${NC}"
        ((pass++))
    else
        echo -e "${YELLOW}  ⚠️  Session encryption NOT enabled${NC}"
        ((warn++))
    fi
else
    echo -e "${RED}  ❌ .env file not found!${NC}"
    ((fail++))
fi

# Check .env.production exists
if [ -f .env.production ]; then
    echo -e "${GREEN}  ✅ .env.production template exists${NC}"
    ((pass++))
else
    echo -e "${RED}  ❌ .env.production template missing!${NC}"
    ((fail++))
fi

# Check config files
if [ -f config/cors.php ]; then
    if grep -q "env('APP_ENV')" config/cors.php; then
        echo -e "${GREEN}  ✅ CORS has environment-based configuration${NC}"
        ((pass++))
    else
        echo -e "${YELLOW}  ⚠️  CORS configuration might not be production-ready${NC}"
        ((warn++))
    fi
fi

if [ -f config/session.php ]; then
    if grep -q "env('APP_ENV') === 'production'" config/session.php; then
        echo -e "${GREEN}  ✅ Session config has production checks${NC}"
        ((pass++))
    else
        echo -e "${YELLOW}  ⚠️  Session config might need production adjustments${NC}"
        ((warn++))
    fi
fi

echo ""
echo "🌐 Frontend Checks:"
echo ""

# Check frontend
cd ../scout-safe-pay-frontend

# Check .env.production
if [ -f .env.production ]; then
    echo -e "${GREEN}  ✅ .env.production exists${NC}"
    ((pass++))
    
    if grep -q "localhost" .env.production; then
        echo -e "${YELLOW}  ⚠️  .env.production contains localhost URLs (update for production)${NC}"
        ((warn++))
    else
        echo -e "${GREEN}  ✅ No localhost URLs in .env.production${NC}"
        ((pass++))
    fi
else
    echo -e "${RED}  ❌ .env.production missing!${NC}"
    ((fail++))
fi

# Check next.config.ts
if [ -f next.config.ts ]; then
    if grep -q "process.env.NODE_ENV === 'production'" next.config.ts; then
        echo -e "${GREEN}  ✅ next.config.ts has environment checks${NC}"
        ((pass++))
    else
        echo -e "${YELLOW}  ⚠️  next.config.ts might need production checks${NC}"
        ((warn++))
    fi
    
    if grep -q "removeConsole" next.config.ts; then
        echo -e "${GREEN}  ✅ Console removal configured for production${NC}"
        ((pass++))
    else
        echo -e "${YELLOW}  ⚠️  Console removal not configured${NC}"
        ((warn++))
    fi
fi

# Check if build exists
if [ -d ".next" ]; then
    echo -e "${GREEN}  ✅ Frontend has been built${NC}"
    ((pass++))
else
    echo -e "${YELLOW}  ⚠️  Frontend needs to be built${NC}"
    ((warn++))
fi

echo ""
echo "📄 Documentation Checks:"
echo ""

cd ..

# Check documentation
if [ -f PRODUCTION_DEPLOYMENT_GUIDE.md ]; then
    echo -e "${GREEN}  ✅ Production deployment guide exists${NC}"
    ((pass++))
else
    echo -e "${YELLOW}  ⚠️  Production deployment guide missing${NC}"
    ((warn++))
fi

if [ -f SECURITY_HARDENING_CHECKLIST.md ]; then
    echo -e "${GREEN}  ✅ Security hardening checklist exists${NC}"
    ((pass++))
else
    echo -e "${YELLOW}  ⚠️  Security hardening checklist missing${NC}"
    ((warn++))
fi

echo ""
echo "===================================================="
echo "📊 Summary:"
echo ""
echo -e "${GREEN}  ✅ Passed: $pass${NC}"
echo -e "${YELLOW}  ⚠️  Warnings: $warn${NC}"
echo -e "${RED}  ❌ Failed: $fail${NC}"
echo ""

if [ $fail -eq 0 ]; then
    echo -e "${GREEN}🎉 Production readiness check PASSED!${NC}"
    echo ""
    echo "⚠️  Don't forget to:"
    echo "  1. Update all placeholder URLs in .env.production files"
    echo "  2. Generate strong JWT_SECRET and APP_KEY"
    echo "  3. Configure database and Redis passwords"
    echo "  4. Set up SSL certificates"
    echo "  5. Configure external API keys"
    exit 0
else
    echo -e "${RED}❌ Production readiness check FAILED!${NC}"
    echo "Please fix the issues above before deploying."
    exit 1
fi
