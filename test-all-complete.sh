#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Test function
test_url() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    
    TOTAL=$((TOTAL + 1))
    
    # Get HTTP status code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" -L "$url" 2>/dev/null)
    
    if [ "$status_code" = "$expected_code" ]; then
        echo -e "${GREEN}✓${NC} $name (HTTP $status_code)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗${NC} $name (Expected HTTP $expected_code, got $status_code)"
        FAILED=$((FAILED + 1))
    fi
}

echo "======================================"
echo "  COMPLETE SYSTEM TEST"
echo "======================================"
echo ""

# Backend URLs
BACKEND_URL="https://adminautoscout.dev"
FRONTEND_URL="https://www.autoscout24safetrade.com"

echo "Testing Backend API..."
echo "---"

# API Health & Public Endpoints
test_url "API Health" "$BACKEND_URL/api/health" 200
test_url "API Settings" "$BACKEND_URL/api/settings" 200
test_url "API Frontend Settings" "$BACKEND_URL/api/frontend/settings" 200
test_url "API Contact Settings" "$BACKEND_URL/api/frontend/contact-settings" 200
test_url "API Available Locales" "$BACKEND_URL/api/frontend/locales" 200
test_url "API Legal Documents" "$BACKEND_URL/api/legal-documents" 200
test_url "API Terms" "$BACKEND_URL/api/legal/terms" 200
test_url "API Privacy" "$BACKEND_URL/api/legal/privacy" 200
test_url "API Cookies" "$BACKEND_URL/api/legal/cookies" 200

echo ""
echo "Testing Frontend Pages..."
echo "---"

# Homepage & Main Pages
test_url "Homepage EN" "$FRONTEND_URL/en" 200
test_url "Homepage RO" "$FRONTEND_URL/ro" 200
test_url "Homepage DE" "$FRONTEND_URL/de" 200
test_url "Homepage FR" "$FRONTEND_URL/fr" 200
test_url "Homepage ES" "$FRONTEND_URL/es" 200

# Auth Pages - All Languages
for locale in en ro de fr es; do
    test_url "Login [$locale]" "$FRONTEND_URL/$locale/auth/login" 200
    test_url "Register [$locale]" "$FRONTEND_URL/$locale/auth/register" 200
    test_url "Forgot Password [$locale]" "$FRONTEND_URL/$locale/auth/forgot-password" 200
    test_url "Reset Password [$locale]" "$FRONTEND_URL/$locale/auth/reset-password" 200
done

# Dashboard Pages (EN only - will redirect if not authenticated)
test_url "Buyer Dashboard EN" "$FRONTEND_URL/en/buyer/dashboard" 200
test_url "Seller Dashboard EN" "$FRONTEND_URL/en/seller/dashboard" 200
test_url "Dealer Dashboard EN" "$FRONTEND_URL/en/dealer/dashboard" 200

# Profile Pages (EN - will redirect if not authenticated)
test_url "Buyer Profile EN" "$FRONTEND_URL/en/buyer/profile" 200
test_url "Buyer Settings EN" "$FRONTEND_URL/en/buyer/settings" 200
test_url "Buyer Notifications EN" "$FRONTEND_URL/en/buyer/notifications" 200
test_url "Seller Profile EN" "$FRONTEND_URL/en/seller/profile" 200
test_url "Seller Settings EN" "$FRONTEND_URL/en/seller/settings" 200
test_url "Seller Analytics EN" "$FRONTEND_URL/en/seller/analytics" 200
test_url "Dealer Profile EN" "$FRONTEND_URL/en/dealer/profile" 200
test_url "Dealer Settings EN" "$FRONTEND_URL/en/dealer/settings" 200

# Support Pages
test_url "Support Help EN" "$FRONTEND_URL/en/support/help" 200
test_url "Support Tickets EN" "$FRONTEND_URL/en/support/tickets" 200

# Vehicles
test_url "Add Vehicle EN" "$FRONTEND_URL/en/seller/vehicles/add" 200
test_url "Vehicles Search EN" "$FRONTEND_URL/en/vehicles" 200

# Legal Pages
test_url "Terms EN" "$FRONTEND_URL/en/legal/terms" 200
test_url "Privacy EN" "$FRONTEND_URL/en/legal/privacy" 200
test_url "Cookies EN" "$FRONTEND_URL/en/legal/cookies" 200

# Contact
test_url "Contact EN" "$FRONTEND_URL/en/contact" 200

echo ""
echo "======================================"
echo "  TEST SUMMARY"
echo "======================================"
echo "Total Tests:  $TOTAL"
echo -e "${GREEN}Passed:       $PASSED${NC}"
echo -e "${RED}Failed:       $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    PASS_RATE=$((PASSED * 100 / TOTAL))
    echo -e "\nPass Rate: ${YELLOW}$PASS_RATE%${NC}"
    exit 1
fi
