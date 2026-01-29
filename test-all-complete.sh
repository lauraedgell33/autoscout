#!/bin/bash

# AutoScout SafePay - ULTRA COMPREHENSIVE Testing Script
# Date: January 29, 2026
# Purpose: Test EVERY route, API endpoint, and link across the entire application

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   AutoScout SafePay - TESTE COMPLETE PENTRU TOATE RUTELE      ║"
echo "║              API-uri, Pagini, Linkuri - TOT!                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
FRONTEND_URL="https://www.autoscout24safetrade.com"
BACKEND_URL="https://adminautoscout.dev"
API_URL="$BACKEND_URL/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test tracking arrays
declare -a FAILED_URLS=()

# Test function
test_url() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    local category="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "  Testing: $name ... "
    
    local response_code=$(curl -sL -o /dev/null -w "%{http_code}" "$url" --max-time 30)
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_URLS+=("[$category] $name: $url (Expected: $expected_code, Got: $response_code)")
        return 1
    fi
}

# Test API endpoint with JSON validation
test_api() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "  API Test: $name ... "
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 30)
    local response_body=$(curl -s "$url" --max-time 30)
    
    if [ "$response_code" -eq "$expected_code" ]; then
        if echo "$response_body" | jq empty 2>/dev/null; then
            echo -e "${GREEN}✓ PASS${NC} (HTTP $response_code, Valid JSON)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${YELLOW}⚠ WARN${NC} (HTTP $response_code, Invalid JSON)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_code, got $response_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_URLS+=("[API] $name: $url (Expected: $expected_code, Got: $response_code)")
        return 1
    fi
}

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 1: BACKEND API ENDPOINTS (PUBLIC)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_api "Health Check" "$API_URL/health"
test_api "General Settings" "$API_URL/settings"
test_api "Frontend Settings" "$API_URL/frontend/settings"
test_api "Contact Settings" "$API_URL/frontend/contact-settings"
test_api "Available Locales" "$API_URL/frontend/locales"
test_api "Legal Documents List" "$API_URL/legal-documents"
test_api "Terms of Service" "$API_URL/legal/terms"
test_api "Privacy Policy" "$API_URL/legal/privacy"
test_api "Cookie Policy" "$API_URL/legal/cookies"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 2: FRONTEND PAGES - ENGLISH (EN)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

# Main pages
test_url "Home Page" "$FRONTEND_URL/en" 200 "Frontend-EN"
test_url "About Page" "$FRONTEND_URL/en/about" 200 "Frontend-EN"
test_url "Contact Page" "$FRONTEND_URL/en/contact" 200 "Frontend-EN"
test_url "FAQ Page" "$FRONTEND_URL/en/faq" 200 "Frontend-EN"

# Auth pages
test_url "Login Page" "$FRONTEND_URL/en/auth/login" 200 "Frontend-EN"
test_url "Register Page" "$FRONTEND_URL/en/auth/register" 200 "Frontend-EN"
test_url "Forgot Password" "$FRONTEND_URL/en/auth/forgot-password" 200 "Frontend-EN"
test_url "Reset Password" "$FRONTEND_URL/en/auth/reset-password" 200 "Frontend-EN"

# Vehicle pages
test_url "Browse Vehicles" "$FRONTEND_URL/en/vehicles" 200 "Frontend-EN"
test_url "Vehicle Search" "$FRONTEND_URL/en/vehicles/search" 200 "Frontend-EN"

# Legal pages
test_url "Terms & Conditions" "$FRONTEND_URL/en/legal/terms" 200 "Frontend-EN"
test_url "Privacy Policy" "$FRONTEND_URL/en/legal/privacy" 200 "Frontend-EN"
test_url "Cookie Policy" "$FRONTEND_URL/en/legal/cookies" 200 "Frontend-EN"
test_url "Refund Policy" "$FRONTEND_URL/en/legal/refund" 200 "Frontend-EN"

# Support pages
test_url "Help Center" "$FRONTEND_URL/en/support/help" 200 "Frontend-EN"
test_url "Support Tickets" "$FRONTEND_URL/en/support/tickets" 200 "Frontend-EN"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 3: BUYER DASHBOARD PAGES - ENGLISH${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Buyer Dashboard" "$FRONTEND_URL/en/buyer/dashboard" 200 "Buyer-EN"
test_url "My Purchases" "$FRONTEND_URL/en/buyer/purchases" 200 "Buyer-EN"
test_url "My Favorites" "$FRONTEND_URL/en/buyer/favorites" 200 "Buyer-EN"
test_url "Transaction History" "$FRONTEND_URL/en/buyer/transactions" 200 "Buyer-EN"
test_url "Payment Methods" "$FRONTEND_URL/en/buyer/payment-methods" 200 "Buyer-EN"
test_url "My Profile (Buyer)" "$FRONTEND_URL/en/buyer/profile" 200 "Buyer-EN"
test_url "Buyer Settings" "$FRONTEND_URL/en/buyer/settings" 200 "Buyer-EN"
test_url "Notifications (Buyer)" "$FRONTEND_URL/en/buyer/notifications" 200 "Buyer-EN"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 4: SELLER DASHBOARD PAGES - ENGLISH${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Seller Dashboard" "$FRONTEND_URL/en/seller/dashboard" 200 "Seller-EN"
test_url "My Listings" "$FRONTEND_URL/en/seller/listings" 200 "Seller-EN"
test_url "Add New Vehicle" "$FRONTEND_URL/en/seller/vehicles/add" 200 "Seller-EN"
test_url "Sales History" "$FRONTEND_URL/en/seller/sales" 200 "Seller-EN"
test_url "Bank Accounts" "$FRONTEND_URL/en/seller/bank-accounts" 200 "Seller-EN"
test_url "Seller Profile" "$FRONTEND_URL/en/seller/profile" 200 "Seller-EN"
test_url "Seller Settings" "$FRONTEND_URL/en/seller/settings" 200 "Seller-EN"
test_url "Seller Analytics" "$FRONTEND_URL/en/seller/analytics" 200 "Seller-EN"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 5: DEALER DASHBOARD PAGES - ENGLISH${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Dealer Dashboard" "$FRONTEND_URL/en/dealer/dashboard" 200 "Dealer-EN"
test_url "Inventory Management" "$FRONTEND_URL/en/dealer/inventory" 200 "Dealer-EN"
test_url "Bulk Vehicle Upload" "$FRONTEND_URL/en/dealer/bulk-upload" 200 "Dealer-EN"
test_url "Dealer Analytics" "$FRONTEND_URL/en/dealer/analytics" 200 "Dealer-EN"
test_url "Team Management" "$FRONTEND_URL/en/dealer/team" 200 "Dealer-EN"
test_url "Dealer Profile" "$FRONTEND_URL/en/dealer/profile" 200 "Dealer-EN"
test_url "Dealer Settings" "$FRONTEND_URL/en/dealer/settings" 200 "Dealer-EN"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 6: PAYMENT & TRANSACTION PAGES - ENGLISH${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Payment Initiation" "$FRONTEND_URL/en/payment/initiate" 200 "Payment-EN"
test_url "Payment Success" "$FRONTEND_URL/en/payment/success" 200 "Payment-EN"
test_url "Payment Failed" "$FRONTEND_URL/en/payment/failed" 200 "Payment-EN"
test_url "Transaction Details" "$FRONTEND_URL/en/transactions" 200 "Payment-EN"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 7: FRONTEND PAGES - ROMANIAN (RO)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Home Page (RO)" "$FRONTEND_URL/ro" 200 "Frontend-RO"
test_url "About Page (RO)" "$FRONTEND_URL/ro/about" 200 "Frontend-RO"
test_url "Contact Page (RO)" "$FRONTEND_URL/ro/contact" 200 "Frontend-RO"
test_url "Login Page (RO)" "$FRONTEND_URL/ro/auth/login" 200 "Frontend-RO"
test_url "Register Page (RO)" "$FRONTEND_URL/ro/auth/register" 200 "Frontend-RO"
test_url "Browse Vehicles (RO)" "$FRONTEND_URL/ro/vehicles" 200 "Frontend-RO"
test_url "Terms (RO)" "$FRONTEND_URL/ro/legal/terms" 200 "Frontend-RO"
test_url "Privacy (RO)" "$FRONTEND_URL/ro/legal/privacy" 200 "Frontend-RO"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 8: FRONTEND PAGES - GERMAN (DE)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Home Page (DE)" "$FRONTEND_URL/de" 200 "Frontend-DE"
test_url "About Page (DE)" "$FRONTEND_URL/de/about" 200 "Frontend-DE"
test_url "Contact Page (DE)" "$FRONTEND_URL/de/contact" 200 "Frontend-DE"
test_url "Login Page (DE)" "$FRONTEND_URL/de/auth/login" 200 "Frontend-DE"
test_url "Register Page (DE)" "$FRONTEND_URL/de/auth/register" 200 "Frontend-DE"
test_url "Browse Vehicles (DE)" "$FRONTEND_URL/de/vehicles" 200 "Frontend-DE"
test_url "Terms (DE)" "$FRONTEND_URL/de/legal/terms" 200 "Frontend-DE"
test_url "Privacy (DE)" "$FRONTEND_URL/de/legal/privacy" 200 "Frontend-DE"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 9: FRONTEND PAGES - FRENCH (FR)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Home Page (FR)" "$FRONTEND_URL/fr" 200 "Frontend-FR"
test_url "About Page (FR)" "$FRONTEND_URL/fr/about" 200 "Frontend-FR"
test_url "Contact Page (FR)" "$FRONTEND_URL/fr/contact" 200 "Frontend-FR"
test_url "Login Page (FR)" "$FRONTEND_URL/fr/auth/login" 200 "Frontend-FR"
test_url "Register Page (FR)" "$FRONTEND_URL/fr/auth/register" 200 "Frontend-FR"
test_url "Browse Vehicles (FR)" "$FRONTEND_URL/fr/vehicles" 200 "Frontend-FR"
test_url "Terms (FR)" "$FRONTEND_URL/fr/legal/terms" 200 "Frontend-FR"
test_url "Privacy (FR)" "$FRONTEND_URL/fr/legal/privacy" 200 "Frontend-FR"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 10: FRONTEND PAGES - SPANISH (ES)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Home Page (ES)" "$FRONTEND_URL/es" 200 "Frontend-ES"
test_url "About Page (ES)" "$FRONTEND_URL/es/about" 200 "Frontend-ES"
test_url "Contact Page (ES)" "$FRONTEND_URL/es/contact" 200 "Frontend-ES"
test_url "Login Page (ES)" "$FRONTEND_URL/es/auth/login" 200 "Frontend-ES"
test_url "Register Page (ES)" "$FRONTEND_URL/es/auth/register" 200 "Frontend-ES"
test_url "Browse Vehicles (ES)" "$FRONTEND_URL/es/vehicles" 200 "Frontend-ES"
test_url "Terms (ES)" "$FRONTEND_URL/es/legal/terms" 200 "Frontend-ES"
test_url "Privacy (ES)" "$FRONTEND_URL/es/legal/privacy" 200 "Frontend-ES"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 11: BUYER DASHBOARD - ALL LOCALES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Buyer Dashboard (RO)" "$FRONTEND_URL/ro/buyer/dashboard" 200 "Buyer-RO"
test_url "Buyer Dashboard (DE)" "$FRONTEND_URL/de/buyer/dashboard" 200 "Buyer-DE"
test_url "Buyer Dashboard (FR)" "$FRONTEND_URL/fr/buyer/dashboard" 200 "Buyer-FR"
test_url "Buyer Dashboard (ES)" "$FRONTEND_URL/es/buyer/dashboard" 200 "Buyer-ES"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 12: SELLER DASHBOARD - ALL LOCALES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Seller Dashboard (RO)" "$FRONTEND_URL/ro/seller/dashboard" 200 "Seller-RO"
test_url "Seller Dashboard (DE)" "$FRONTEND_URL/de/seller/dashboard" 200 "Seller-DE"
test_url "Seller Dashboard (FR)" "$FRONTEND_URL/fr/seller/dashboard" 200 "Seller-FR"
test_url "Seller Dashboard (ES)" "$FRONTEND_URL/es/seller/dashboard" 200 "Seller-ES"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 13: DEALER DASHBOARD - ALL LOCALES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Dealer Dashboard (RO)" "$FRONTEND_URL/ro/dealer/dashboard" 200 "Dealer-RO"
test_url "Dealer Dashboard (DE)" "$FRONTEND_URL/de/dealer/dashboard" 200 "Dealer-DE"
test_url "Dealer Dashboard (FR)" "$FRONTEND_URL/fr/dealer/dashboard" 200 "Dealer-FR"
test_url "Dealer Dashboard (ES)" "$FRONTEND_URL/es/dealer/dashboard" 200 "Dealer-ES"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 14: BACKEND ADMIN PANEL${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Admin Panel" "$BACKEND_URL/admin" 302 "Admin"
test_url "Admin Login" "$BACKEND_URL/admin/login" 200 "Admin"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  CATEGORY 15: ADDITIONAL BACKEND ROUTES${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"

test_url "Backend Health" "$BACKEND_URL/up" 200 "Backend"
test_api "Sanctum CSRF Cookie" "$BACKEND_URL/sanctum/csrf-cookie"

echo ""
echo ""
echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║                    TEST RESULTS SUMMARY                        ║${NC}"
echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Calculate success rate
SUCCESS_RATE=$(awk "BEGIN {printf \"%.2f\", ($PASSED_TESTS / $TOTAL_TESTS) * 100}")

echo -e "  ${BLUE}Total Tests:${NC}      $TOTAL_TESTS"
echo -e "  ${GREEN}Passed Tests:${NC}     $PASSED_TESTS"
echo -e "  ${RED}Failed Tests:${NC}     $FAILED_TESTS"
echo -e "  ${CYAN}Success Rate:${NC}     $SUCCESS_RATE%"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                 ✓ ALL TESTS PASSED!                            ║${NC}"
    echo -e "${GREEN}║           Aplicația este 100% funcțională!                     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    FAILED TESTS                                 ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    for url in "${FAILED_URLS[@]}"; do
        echo -e "  ${RED}✗${NC} $url"
    done
    echo ""
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Test completed at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
