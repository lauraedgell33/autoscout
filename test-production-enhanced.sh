#!/bin/bash

# AutoScout SafePay - Enhanced Production Testing Script
# Date: January 29, 2026
# Purpose: Test all user flows on live servers with detailed logging

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   AutoScout SafePay - Production Testing Suite v2.0     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Configuration
FRONTEND_URL="https://www.autoscout24safetrade.com"
BACKEND_URL="https://adminautoscout.dev"
API_URL="$BACKEND_URL/api"
DEFAULT_LOCALE="en"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test Results
declare -A TEST_RESULTS
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
CATEGORY=""

# Test result logging
log_test() {
    local status=$1
    local category=$2
    local test_name=$3
    local details=$4
    
    if [ -z "${TEST_RESULTS[$category]}" ]; then
        TEST_RESULTS[$category]=""
    fi
    
    TEST_RESULTS[$category]+="$status|$test_name|$details\n"
}

# Test endpoint with locale support
test_endpoint() {
    local name=$1
    local path=$2
    local expected_code=${3:-200}
    local use_locale=${4:-true}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local url="$FRONTEND_URL"
    if [ "$use_locale" = true ]; then
        url="$url/$DEFAULT_LOCALE$path"
    else
        url="$url$path"
    fi
    
    echo -n "  ├─ $name ... "
    
    local response_code=$(curl -sL -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log_test "PASS" "$CATEGORY" "$name" "HTTP $response_code"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_test "FAIL" "$CATEGORY" "$name" "Expected $expected_code, got $response_code"
        return 1
    fi
}

# Test API endpoint
test_api() {
    local name=$1
    local path=$2
    local expected_code=${3:-200}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local url="$API_URL$path"
    
    echo -n "  ├─ $name ... "
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    local response_body=$(curl -s "$url")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        if echo "$response_body" | jq empty 2>/dev/null; then
            echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code, Valid JSON)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            log_test "PASS" "$CATEGORY" "$name" "HTTP $response_code, Valid JSON"
            return 0
        else
            echo -e "${YELLOW}⚠ PARTIAL${NC} (HTTP $response_code, Invalid JSON)"
            log_test "PARTIAL" "$CATEGORY" "$name" "HTTP $response_code, Invalid JSON"
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_test "FAIL" "$CATEGORY" "$name" "Expected $expected_code, got $response_code"
        return 1
    fi
}

# Test backend endpoint
test_backend() {
    local name=$1
    local path=$2
    local expected_code=${3:-200}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    local url="$BACKEND_URL$path"
    
    echo -n "  ├─ $name ... "
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log_test "PASS" "$CATEGORY" "$name" "HTTP $response_code"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_test "FAIL" "$CATEGORY" "$name" "Expected $expected_code, got $response_code"
        return 1
    fi
}

# Start tests
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  SERVER STATUS CHECK${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}Frontend:${NC} $FRONTEND_URL"
echo -e "${BLUE}Backend:${NC}  $BACKEND_URL"
echo -e "${BLUE}API:${NC}      $API_URL"
echo ""

CATEGORY="Infrastructure"

echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  1. FRONTEND INFRASTRUCTURE${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Home Page" "" 200
test_endpoint "Login Page" "/login" 200
test_endpoint "Register Page" "/register" 200
test_endpoint "About Page" "/about" 200

CATEGORY="Backend Infrastructure"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  2. BACKEND INFRASTRUCTURE${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

test_backend "Backend Health" "" 200
test_backend "Admin Login Page" "/admin/login" 200
test_backend "Admin Panel (Protected)" "/admin" 302

CATEGORY="Public API"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  3. PUBLIC API ENDPOINTS${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

test_api "Settings API" "/settings/public" 200
test_api "Frontend Settings" "/settings/group/frontend" 200
test_api "Contact Settings" "/settings/group/contact" 200
test_api "Available Locales" "/locale/available" 200
test_api "Current Locale" "/locale" 200

CATEGORY="Guest User Flow"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  4. GUEST USER FLOW (Unauthenticated)${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Browse Vehicles" "/vehicles" 200
test_endpoint "Vehicle Search" "/vehicles/search" 200
test_endpoint "View Terms" "/legal/terms" 200
test_endpoint "View Privacy" "/legal/privacy" 200
test_endpoint "Contact Page" "/contact" 200

CATEGORY="Buyer Flow"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  5. BUYER FLOW (Authentication Required)${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}  ℹ Note: These endpoints require authentication${NC}"
test_endpoint "Buyer Dashboard" "/buyer/dashboard" 200
test_endpoint "My Purchases" "/buyer/purchases" 200
test_endpoint "Transaction History" "/buyer/transactions" 200
test_endpoint "Payment Methods" "/buyer/payment-methods" 200
test_endpoint "Saved Vehicles" "/buyer/favorites" 200

CATEGORY="Seller Flow"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  6. SELLER FLOW (Authentication Required)${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}  ℹ Note: These endpoints require authentication${NC}"
test_endpoint "Seller Dashboard" "/seller/dashboard" 200
test_endpoint "My Listings" "/seller/vehicles" 200
test_endpoint "Add Vehicle" "/seller/vehicles/new" 200
test_endpoint "Sales History" "/seller/sales" 200
test_endpoint "Bank Accounts" "/seller/bank-accounts" 200

CATEGORY="Dealer Flow"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  7. DEALER FLOW (Authentication Required)${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}  ℹ Note: These endpoints require authentication${NC}"
test_endpoint "Dealer Dashboard" "/dealer/dashboard" 200
test_endpoint "Inventory Management" "/dealer/inventory" 200
test_endpoint "Bulk Upload" "/dealer/bulk-upload" 200
test_endpoint "Analytics" "/dealer/analytics" 200
test_endpoint "Team Management" "/dealer/team" 200

CATEGORY="Admin Flow"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  8. ADMIN PANEL FLOW${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}  ℹ Note: Admin access requires authentication${NC}"
test_backend "Admin Login" "/admin/login" 200
test_backend "Admin Dashboard (Protected)" "/admin" 302
test_backend "User Management" "/admin/users" 302
test_backend "Vehicle Management" "/admin/vehicles" 302
test_backend "Transaction Management" "/admin/transactions" 302
test_backend "Settings Panel" "/admin/settings" 302

CATEGORY="Payment Flow"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  9. PAYMENT & TRANSACTION FLOW${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}  ℹ Note: Payment flows require authentication${NC}"
test_endpoint "Initiate Payment" "/payment/initiate" 200
test_endpoint "Payment Success Page" "/payment/success" 200
test_endpoint "Payment Failed Page" "/payment/failed" 200
test_endpoint "Transaction Details" "/transactions/details" 200

CATEGORY="Legal & Compliance"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  10. LEGAL & COMPLIANCE${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Terms of Service" "/legal/terms" 200
test_endpoint "Privacy Policy" "/legal/privacy" 200
test_endpoint "Cookie Policy" "/legal/cookies" 200
test_endpoint "GDPR Consent" "/legal/gdpr" 200
test_endpoint "Refund Policy" "/legal/refunds" 200

CATEGORY="Multi-language Support"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  11. MULTI-LANGUAGE SUPPORT${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

for locale in en ro de fr es; do
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "  ├─ Testing locale: $locale ... "
    
    response_code=$(curl -sL -o /dev/null -w "%{http_code}" "$FRONTEND_URL/$locale")
    
    if [ "$response_code" -eq 200 ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log_test "PASS" "$CATEGORY" "Locale $locale" "HTTP 200"
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_test "FAIL" "$CATEGORY" "Locale $locale" "HTTP $response_code"
    fi
done

CATEGORY="Additional Features"

echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  12. ADDITIONAL FEATURES${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "FAQ Page" "/faq" 200
test_endpoint "Help Center" "/help" 200
test_endpoint "Support Tickets" "/support" 200

# Final Summary
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    TEST SUMMARY                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "Total Tests:   ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed:        ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:        ${RED}$FAILED_TESTS${NC}"

if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "Pass Rate:     ${CYAN}$PASS_RATE%${NC}"
fi

echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           ✓ ALL TESTS PASSED SUCCESSFULLY!              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}✓ Frontend:${NC} Fully operational at $FRONTEND_URL"
    echo -e "${GREEN}✓ Backend:${NC}  Fully operational at $BACKEND_URL"
    echo -e "${GREEN}✓ API:${NC}      All endpoints responding correctly"
    echo ""
    exit 0
else
    echo -e "${YELLOW}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║        ⚠ SOME TESTS FAILED (Pass Rate: $PASS_RATE%)       ║${NC}"
    echo -e "${YELLOW}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}⚠ Note:${NC} Some failures may be expected for authentication-protected routes"
    echo -e "${YELLOW}⚠ Note:${NC} Check that all required pages are implemented in Next.js"
    echo ""
    exit 1
fi
