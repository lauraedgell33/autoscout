#!/bin/bash

echo "🧪 Running Comprehensive Test Suite"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test 1: Check i18n configuration
echo "📋 Test 1: i18n Configuration"
if [ -f "src/i18n/routing.ts" ] && [ -f "middleware.ts" ] && [ -f "src/i18n/request.ts" ]; then
    echo -e "${GREEN}✓ PASS${NC} - All i18n config files present"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Missing i18n configuration files"
    ((FAILED++))
fi
echo ""

# Test 2: Check translation files
echo "📋 Test 2: Translation Files"
MISSING_TRANSLATIONS=0
for lang in en de es it ro fr; do
    if [ ! -f "messages/${lang}.json" ]; then
        echo -e "${RED}✗ FAIL${NC} - Missing messages/${lang}.json"
        MISSING_TRANSLATIONS=1
    fi
done

if [ $MISSING_TRANSLATIONS -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC} - All translation files present"
    ((PASSED++))
else
    ((FAILED++))
fi
echo ""

# Test 3: Check for wrong Link imports
echo "📋 Test 3: Link Imports"
WRONG_LINKS=$(grep -r "import Link from 'next/link'" src/ 2>/dev/null | wc -l)
if [ "$WRONG_LINKS" -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC} - No incorrect Link imports found"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Found $WRONG_LINKS files with incorrect Link imports"
    ((FAILED++))
fi
echo ""

# Test 4: Check API configuration
echo "📋 Test 4: API Configuration"
if grep -q "NEXT_PUBLIC_API_URL" .env.local 2>/dev/null; then
    API_URL=$(grep "NEXT_PUBLIC_API_URL" .env.local | cut -d'=' -f2)
    echo -e "${GREEN}✓ PASS${NC} - API URL configured: $API_URL"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - NEXT_PUBLIC_API_URL not configured"
    ((FAILED++))
fi
echo ""

# Test 5: Check for legal pages with 'use client'
echo "📋 Test 5: Legal Pages Client Directive"
LEGAL_PAGES_OK=0
for page in src/app/\[locale\]/legal/*/page.tsx; do
    if [ -f "$page" ]; then
        if grep -q "'use client'" "$page" || grep -q '"use client"' "$page"; then
            ((LEGAL_PAGES_OK++))
        fi
    fi
done

if [ $LEGAL_PAGES_OK -ge 4 ]; then
    echo -e "${GREEN}✓ PASS${NC} - Legal pages have 'use client' directive"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Some legal pages missing 'use client'"
    ((FAILED++))
fi
echo ""

# Test 6: Check package.json for required dependencies
echo "📋 Test 6: Dependencies"
if grep -q "next-intl" package.json; then
    echo -e "${GREEN}✓ PASS${NC} - next-intl dependency present"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - next-intl dependency missing"
    ((FAILED++))
fi
echo ""

# Test 7: TypeScript check
echo "📋 Test 7: TypeScript Configuration"
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓ PASS${NC} - tsconfig.json present"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - tsconfig.json missing"
    ((FAILED++))
fi
echo ""

# Test 8: Check for common pages
echo "📋 Test 8: Core Pages Present"
PAGES_PRESENT=0
PAGES_TOTAL=0

for page in "page.tsx" "marketplace/page.tsx" "contact/page.tsx" "(auth)/login/page.tsx"; do
    ((PAGES_TOTAL++))
    if [ -f "src/app/[locale]/$page" ]; then
        ((PAGES_PRESENT++))
    fi
done

if [ $PAGES_PRESENT -eq $PAGES_TOTAL ]; then
    echo -e "${GREEN}✓ PASS${NC} - All core pages present ($PAGES_PRESENT/$PAGES_TOTAL)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Some core pages missing ($PAGES_PRESENT/$PAGES_TOTAL)"
    ((FAILED++))
fi
echo ""

# Final Results
echo "===================================="
echo "📊 Test Results:"
echo "===================================="
echo -e "Tests Passed:  ${GREEN}$PASSED${NC}"
echo -e "Tests Failed:  ${RED}$FAILED${NC}"
echo "Total Tests:   $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    PERCENTAGE=$((PASSED * 100 / (PASSED + FAILED)))
    echo -e "${YELLOW}⚠️  $FAILED test(s) failed (${PERCENTAGE}% success rate)${NC}"
    exit 1
fi
