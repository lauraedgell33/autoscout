#!/bin/bash

# COMPLETE APPLICATION AUDIT SCRIPT
# Tests all pages, API endpoints, links, and functionality

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROD_URL="https://www.autoscout24safetrade.com"
API_URL="https://adminautoscout.dev/api"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

REPORT_FILE="/tmp/audit_report_$(date +%Y%m%d_%H%M%S).txt"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         COMPLETE APPLICATION AUDIT - AutoScout24          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to test page and log results
test_page() {
    local page=$1
    local page_name=$2
    ((TOTAL_TESTS++))
    
    echo -n "Testing $page_name... "
    
    STATUS=$(curl -s -o /tmp/page_content.html -w "%{http_code}" "$PROD_URL$page" 2>&1)
    
    if [[ "$STATUS" == "200" || "$STATUS" == "307" ]]; then
        # Check for JavaScript errors in content
        if grep -qi "error\|undefined\|null is not" /tmp/page_content.html 2>/dev/null; then
            echo -e "${YELLOW}⚠ WARN${NC} - Page loads but may have JS errors"
            ((WARNINGS++))
            echo "WARNING: $page_name ($page) - Status $STATUS but contains error text" >> "$REPORT_FILE"
        else
            echo -e "${GREEN}✓ PASS${NC} ($STATUS)"
            ((PASSED_TESTS++))
        fi
    else
        echo -e "${RED}✗ FAIL${NC} ($STATUS)"
        ((FAILED_TESTS++))
        echo "FAILED: $page_name ($page) - HTTP $STATUS" >> "$REPORT_FILE"
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local endpoint_name=$2
    ((TOTAL_TESTS++))
    
    echo -n "Testing API: $endpoint_name... "
    
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint" 2>&1)
    
    if [[ "$STATUS" == "200" ]]; then
        echo -e "${GREEN}✓ PASS${NC} ($STATUS)"
        ((PASSED_TESTS++))
    elif [[ "$STATUS" == "401" ]]; then
        echo -e "${YELLOW}⚠ AUTH${NC} (401 - requires auth)"
        ((WARNINGS++))
        echo "AUTH REQUIRED: $endpoint_name ($endpoint) - 401" >> "$REPORT_FILE"
    else
        echo -e "${RED}✗ FAIL${NC} ($STATUS)"
        ((FAILED_TESTS++))
        echo "FAILED: API $endpoint_name ($endpoint) - HTTP $STATUS" >> "$REPORT_FILE"
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 1: PUBLIC PAGES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Test all public pages
test_page "/en" "Homepage"
test_page "/en/about" "About Page"
test_page "/en/contact" "Contact Page"
test_page "/en/how-it-works" "How It Works"
test_page "/en/benefits" "Benefits Page"
test_page "/en/login" "Login Page"
test_page "/en/register" "Register Page"
test_page "/en/vehicles" "Vehicles Listing"
test_page "/en/marketplace" "Marketplace"
test_page "/en/privacy" "Privacy Policy"
test_page "/en/terms" "Terms of Service"
test_page "/en/cookies" "Cookie Policy"
test_page "/en/refund" "Refund Policy"
test_page "/en/purchase" "Purchase Agreement"
test_page "/en/careers" "Careers Page"
test_page "/en/imprint" "Imprint Page"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 2: BUYER PAGES (May require auth)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

test_page "/en/buyer/dashboard" "Buyer Dashboard"
test_page "/en/buyer/favorites" "Buyer Favorites"
test_page "/en/buyer/transactions" "Buyer Transactions"
test_page "/en/buyer/purchases" "Buyer Purchases"
test_page "/en/buyer/settings" "Buyer Settings"
test_page "/en/buyer/profile" "Buyer Profile"
test_page "/en/buyer/notifications" "Buyer Notifications"
test_page "/en/buyer/payment-methods" "Buyer Payment Methods"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 3: SELLER PAGES (May require auth)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

test_page "/en/seller/dashboard" "Seller Dashboard"
test_page "/en/seller/vehicles" "Seller Vehicles"
test_page "/en/seller/vehicles/add" "Add Vehicle"
test_page "/en/seller/vehicles/new" "New Vehicle"
test_page "/en/seller/sales" "Seller Sales"
test_page "/en/seller/analytics" "Seller Analytics"
test_page "/en/seller/profile" "Seller Profile"
test_page "/en/seller/settings" "Seller Settings"
test_page "/en/seller/bank-accounts" "Seller Bank Accounts"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 4: DEALER PAGES (May require auth)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

test_page "/en/dealer/dashboard" "Dealer Dashboard"
test_page "/en/dealer/inventory" "Dealer Inventory"
test_page "/en/dealer/analytics" "Dealer Analytics"
test_page "/en/dealer/profile" "Dealer Profile"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 5: API ENDPOINTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

test_api "/vehicles" "List Vehicles"
test_api "/categories" "List Categories"
test_api "/dealers" "List Dealers"
test_api "/user" "Get User (Auth)"
test_api "/transactions" "List Transactions (Auth)"
test_api "/favorites" "List Favorites (Auth)"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 6: VEHICLE DETAIL PAGES (Sample)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Test first 5 vehicle detail pages
echo "Fetching vehicle IDs..."
VEHICLE_IDS=$(curl -s "$API_URL/vehicles?per_page=5" | grep -oP '"id":\s*\K\d+' | head -5)

if [ -z "$VEHICLE_IDS" ]; then
    echo -e "${YELLOW}⚠ No vehicle IDs found${NC}"
else
    for VID in $VEHICLE_IDS; do
        test_page "/en/vehicle/$VID" "Vehicle #$VID"
    done
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 7: STATIC ASSETS & RESOURCES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

((TOTAL_TESTS++))
echo -n "Testing favicon... "
if curl -sf "$PROD_URL/favicon.ico" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED_TESTS++))
    echo "FAILED: Favicon missing" >> "$REPORT_FILE"
fi

((TOTAL_TESTS++))
echo -n "Testing sitemap... "
if curl -sf "$PROD_URL/sitemap.xml" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED_TESTS++))
    echo "FAILED: Sitemap missing" >> "$REPORT_FILE"
fi

((TOTAL_TESTS++))
echo -n "Testing robots.txt... "
if curl -sf "$PROD_URL/robots.txt" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${YELLOW}⚠ WARN${NC} - Not found"
    ((WARNINGS++))
    echo "WARNING: robots.txt missing" >> "$REPORT_FILE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 8: LOCALIZATION (All Languages)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

LOCALES=("en" "de" "es" "it" "ro" "fr")
for LOCALE in "${LOCALES[@]}"; do
    test_page "/$LOCALE" "Homepage ($LOCALE)"
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 9: SECURITY HEADERS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

HEADERS=$(curl -sI "$PROD_URL/en")

((TOTAL_TESTS++))
echo -n "Checking HSTS header... "
if echo "$HEADERS" | grep -qi "strict-transport-security"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED_TESTS++))
    echo "FAILED: Missing HSTS header" >> "$REPORT_FILE"
fi

((TOTAL_TESTS++))
echo -n "Checking CSP header... "
if echo "$HEADERS" | grep -qi "content-security-policy"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED_TESTS++))
    echo "FAILED: Missing CSP header" >> "$REPORT_FILE"
fi

((TOTAL_TESTS++))
echo -n "Checking X-Frame-Options... "
if echo "$HEADERS" | grep -qi "x-frame-options"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED_TESTS++))
    echo "FAILED: Missing X-Frame-Options" >> "$REPORT_FILE"
fi

((TOTAL_TESTS++))
echo -n "Checking X-Content-Type-Options... "
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED_TESTS++))
    echo "FAILED: Missing X-Content-Type-Options" >> "$REPORT_FILE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}SECTION 10: PERFORMANCE & OPTIMIZATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

((TOTAL_TESTS++))
echo -n "Checking GZIP compression... "
if curl -sI -H "Accept-Encoding: gzip" "$PROD_URL/en" | grep -qi "content-encoding.*gzip"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED_TESTS++))
else
    echo -e "${YELLOW}⚠ WARN${NC} - Not using GZIP"
    ((WARNINGS++))
    echo "WARNING: GZIP compression not enabled" >> "$REPORT_FILE"
fi

((TOTAL_TESTS++))
echo -n "Checking page load time... "
LOAD_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PROD_URL/en")
LOAD_TIME_MS=$(echo "$LOAD_TIME * 1000" | bc | cut -d. -f1)
if [ "$LOAD_TIME_MS" -lt 3000 ]; then
    echo -e "${GREEN}✓ PASS${NC} (${LOAD_TIME_MS}ms)"
    ((PASSED_TESTS++))
else
    echo -e "${YELLOW}⚠ WARN${NC} (${LOAD_TIME_MS}ms - slow)"
    ((WARNINGS++))
    echo "WARNING: Slow page load time: ${LOAD_TIME_MS}ms" >> "$REPORT_FILE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}FINAL RESULTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

SUCCESS_RATE=$(echo "scale=2; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)

echo ""
echo -e "Total Tests Run:    ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Tests Passed:       ${GREEN}$PASSED_TESTS${NC}"
echo -e "Tests Failed:       ${RED}$FAILED_TESTS${NC}"
echo -e "Warnings:           ${YELLOW}$WARNINGS${NC}"
echo -e "Success Rate:       ${GREEN}${SUCCESS_RATE}%${NC}"
echo ""

if [ -f "$REPORT_FILE" ]; then
    echo -e "${YELLOW}Detailed report saved to: $REPORT_FILE${NC}"
    echo ""
    echo -e "${YELLOW}Issues found:${NC}"
    cat "$REPORT_FILE"
    echo ""
fi

if [ "$FAILED_TESTS" -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✓ ALL CRITICAL TESTS PASSED! Application is healthy!     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  ✗ SOME TESTS FAILED! Review issues above.                ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
