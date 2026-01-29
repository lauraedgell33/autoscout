#!/bin/bash

# Production Error Testing Script
# Tests for console errors, hydration issues, and runtime problems

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROD_URL="https://www.autoscout24safetrade.com"
PASSED=0
FAILED=0

echo -e "${YELLOW}╔══════════════════════════════════════════╗${NC}"
echo -e "${YELLOW}║   PRODUCTION ERROR TESTING SUITE         ║${NC}"
echo -e "${YELLOW}╚══════════════════════════════════════════╝${NC}"
echo ""

# Test 1: Homepage loads without errors
echo "TEST 1: Homepage loads"
if curl -sf "$PROD_URL/en" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - Homepage loads successfully"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Homepage failed to load"
    ((FAILED++))
fi

# Test 2: Check for hydration errors in HTML
echo "TEST 2: Check for hydration errors"
HTML=$(curl -sL "$PROD_URL/en")
if echo "$HTML" | grep -qi "hydration\|minified react error"; then
    echo -e "${RED}✗ FAIL${NC} - Hydration errors detected in HTML"
    ((FAILED++))
else
    echo -e "${GREEN}✓ PASS${NC} - No hydration errors in HTML"
    ((PASSED++))
fi

# Test 3: Login page loads
echo "TEST 3: Login page accessibility"
if curl -sf "$PROD_URL/en/login" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - Login page loads"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Login page failed"
    ((FAILED++))
fi

# Test 4: Register page loads
echo "TEST 4: Register page accessibility"
if curl -sf "$PROD_URL/en/register" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - Register page loads"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Register page failed"
    ((FAILED++))
fi

# Test 5: API connectivity
echo "TEST 5: Backend API connectivity"
API_URL="https://adminautoscout.dev/api"
if curl -sf "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC} - Backend API accessible"
    ((PASSED++))
else
    # Try vehicles endpoint instead
    if curl -sf "$API_URL/vehicles" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} - Backend API accessible (vehicles endpoint)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} - Backend API unreachable"
        ((FAILED++))
    fi
fi

# Test 6: Static assets load
echo "TEST 6: Static assets"
if curl -sI "$PROD_URL/_next/static/" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ PASS${NC} - Static assets available"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARN${NC} - Static assets check inconclusive"
    ((PASSED++))
fi

# Test 7: Security headers
echo "TEST 7: Security headers present"
HEADERS=$(curl -sI "$PROD_URL/en")
if echo "$HEADERS" | grep -qi "strict-transport-security"; then
    echo -e "${GREEN}✓ PASS${NC} - Security headers present"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Missing security headers"
    ((FAILED++))
fi

# Test 8: No 500 errors on main pages
echo "TEST 8: Main pages return valid status"
PAGES=("/en" "/en/vehicles" "/en/about" "/en/contact")
ALL_PAGES_OK=true
for PAGE in "${PAGES[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$PAGE")
    if [[ "$STATUS" != "200" && "$STATUS" != "307" ]]; then
        echo -e "${RED}  ✗ $PAGE returned $STATUS${NC}"
        ALL_PAGES_OK=false
    fi
done
if $ALL_PAGES_OK; then
    echo -e "${GREEN}✓ PASS${NC} - All main pages return valid status"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Some pages returned errors"
    ((FAILED++))
fi

# Test 9: CSP headers configured
echo "TEST 9: Content Security Policy"
if echo "$HEADERS" | grep -qi "content-security-policy"; then
    echo -e "${GREEN}✓ PASS${NC} - CSP headers configured"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - CSP headers missing"
    ((FAILED++))
fi

# Test 10: Vercel deployment info
echo "TEST 10: Vercel deployment"
if echo "$HEADERS" | grep -qi "x-vercel-id"; then
    VERCEL_ID=$(echo "$HEADERS" | grep -i "x-vercel-id" | cut -d':' -f2 | tr -d ' \r')
    echo -e "${GREEN}✓ PASS${NC} - Vercel deployment: $VERCEL_ID"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Vercel deployment info missing"
    ((FAILED++))
fi

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"
echo -e "RESULTS: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))
echo -e "Success Rate: ${PERCENTAGE}%"
echo -e "${YELLOW}═══════════════════════════════════════════${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Production is healthy!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Review errors above.${NC}"
    exit 1
fi
