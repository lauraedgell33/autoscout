#!/bin/bash

# QUICK APPLICATION HEALTH CHECK
# Fast version - tests critical pages only

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROD_URL="https://www.autoscout24safetrade.com"
API_URL="https://adminautoscout.dev/api"

echo "🔍 Quick Health Check - AutoScout24 SafeTrade"
echo "═══════════════════════════════════════════════"
echo ""

# Test function with timeout
test_url() {
    local url=$1
    local name=$2
    local status=$(timeout 5 curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "TIMEOUT")
    
    if [[ "$status" == "200" || "$status" == "307" ]]; then
        echo -e "${GREEN}✓${NC} $name"
        return 0
    else
        echo -e "${RED}✗${NC} $name (HTTP $status)"
        return 1
    fi
}

PASSED=0
FAILED=0

# Critical pages
echo "PUBLIC PAGES:"
test_url "$PROD_URL/en" "Homepage" && ((PASSED++)) || ((FAILED++))
test_url "$PROD_URL/en/login" "Login" && ((PASSED++)) || ((FAILED++))
test_url "$PROD_URL/en/register" "Register" && ((PASSED++)) || ((FAILED++))
test_url "$PROD_URL/en/vehicles" "Vehicles" && ((PASSED++)) || ((FAILED++))
test_url "$PROD_URL/en/how-it-works" "How It Works" && ((PASSED++)) || ((FAILED++))

echo ""
echo "BUYER PAGES:"
test_url "$PROD_URL/en/buyer/dashboard" "Dashboard" && ((PASSED++)) || ((FAILED++))
test_url "$PROD_URL/en/buyer/favorites" "Favorites" && ((PASSED++)) || ((FAILED++))
test_url "$PROD_URL/en/buyer/transactions" "Transactions" && ((PASSED++)) || ((FAILED++))

echo ""
echo "API ENDPOINTS:"
test_url "$API_URL/vehicles" "Vehicles API" && ((PASSED++)) || ((FAILED++))
test_url "$API_URL/categories" "Categories API" && ((PASSED++)) || ((FAILED++))

echo ""
echo "═══════════════════════════════════════════════"
echo -e "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical endpoints are healthy!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some endpoints have issues${NC}"
    exit 1
fi
