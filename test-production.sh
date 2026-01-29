#!/bin/bash

# AutoScout SafePay - Complete Production Testing Script
# Date: January 29, 2026
# Purpose: Test all user flows on live servers

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   AutoScout SafePay - Production Testing Suite          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Configuration
FRONTEND_URL="https://autoscout24safetrade.com"
BACKEND_URL="https://adminautoscout.dev"
API_URL="$BACKEND_URL/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing: $name ... "
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to test JSON API
test_json_api() {
    local name=$1
    local url=$2
    local expected_key=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing API: $name ... "
    
    local response=$(curl -s "$url")
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$http_code" -eq 200 ] && echo "$response" | jq -e ".$expected_key" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} (Valid JSON with '$expected_key')"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code or missing '$expected_key')"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  1. FRONTEND INFRASTRUCTURE TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Frontend Home Page" "$FRONTEND_URL"
test_endpoint "Frontend Login" "$FRONTEND_URL/login"
test_endpoint "Frontend Register" "$FRONTEND_URL/register"
test_endpoint "Frontend About" "$FRONTEND_URL/about"
test_endpoint "Frontend Terms" "$FRONTEND_URL/legal/terms"
test_endpoint "Frontend Privacy" "$FRONTEND_URL/legal/privacy"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  2. BACKEND INFRASTRUCTURE TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Backend Home" "$BACKEND_URL"
test_endpoint "Admin Panel Login" "$BACKEND_URL/admin/login"
test_endpoint "Admin Dashboard" "$BACKEND_URL/admin" 401

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  3. PUBLIC API TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_json_api "Public Settings API" "$API_URL/settings/public" "success"
test_json_api "Available Locales" "$API_URL/locale/available" "success"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  4. VEHICLE FLOW TESTS (Guest User)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Vehicle Listings" "$FRONTEND_URL/vehicles"
test_endpoint "Vehicle Search" "$FRONTEND_URL/vehicles/search"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  5. AUTHENTICATION FLOW TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Login Page" "$FRONTEND_URL/login"
test_endpoint "Register Page" "$FRONTEND_URL/register"
test_endpoint "Forgot Password" "$FRONTEND_URL/forgot-password"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  6. BUYER FLOW TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Note: Buyer flows require authentication${NC}"
test_endpoint "Buyer Dashboard" "$FRONTEND_URL/buyer/dashboard" 401
test_endpoint "My Purchases" "$FRONTEND_URL/buyer/transactions"
test_endpoint "Payment Methods" "$FRONTEND_URL/buyer/payment-methods"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  7. SELLER FLOW TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Note: Seller flows require authentication${NC}"
test_endpoint "Seller Dashboard" "$FRONTEND_URL/seller/dashboard" 401
test_endpoint "My Vehicles" "$FRONTEND_URL/seller/vehicles"
test_endpoint "Add Vehicle" "$FRONTEND_URL/seller/vehicles/create"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  8. DEALER FLOW TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Note: Dealer flows require authentication${NC}"
test_endpoint "Dealer Dashboard" "$FRONTEND_URL/dealer/dashboard" 401
test_endpoint "Dealer Inventory" "$FRONTEND_URL/dealer/inventory"
test_endpoint "Dealer Analytics" "$FRONTEND_URL/dealer/analytics"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  9. ADMIN FLOW TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Note: Admin flows require authentication${NC}"
test_endpoint "Admin Login" "$BACKEND_URL/admin/login"
test_endpoint "Admin Dashboard" "$BACKEND_URL/admin" 401
test_endpoint "Admin Settings" "$BACKEND_URL/admin/settings" 401

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  10. PAYMENT FLOW TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}Note: Payment flows require authentication${NC}"
test_endpoint "Payment Page" "$FRONTEND_URL/payment" 401
test_endpoint "Payment Success" "$FRONTEND_URL/payment/success"
test_endpoint "Payment Failed" "$FRONTEND_URL/payment/failed"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  11. LEGAL & COMPLIANCE TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Terms & Conditions" "$FRONTEND_URL/legal/terms"
test_endpoint "Privacy Policy" "$FRONTEND_URL/legal/privacy"
test_endpoint "Cookie Policy" "$FRONTEND_URL/legal/cookies"
test_endpoint "GDPR Consent" "$FRONTEND_URL/legal/consent"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  12. ADDITIONAL FEATURES TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

test_endpoint "Contact Page" "$FRONTEND_URL/contact"
test_endpoint "FAQ Page" "$FRONTEND_URL/faq"
test_endpoint "Help Center" "$FRONTEND_URL/help"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    TEST SUMMARY                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "Total Tests:   ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed:        ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:        ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║           ✓ ALL TESTS PASSED SUCCESSFULLY!              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    exit 0
else
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${YELLOW}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║        ⚠ SOME TESTS FAILED (Pass Rate: $PASS_RATE%)       ║${NC}"
    echo -e "${YELLOW}╚══════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi
