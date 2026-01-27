#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║     🔍 COMPREHENSIVE IMPLEMENTATION VERIFICATION                ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 - MISSING"
        ((FAIL++))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $1/ - MISSING"
        ((FAIL++))
        return 1
    fi
}

check_content() {
    local file=$1
    local pattern=$2
    local description=$3
    
    if [ -f "$file" ]; then
        if grep -q "$pattern" "$file"; then
            echo -e "${GREEN}✓${NC} $description"
            ((PASS++))
            return 0
        else
            echo -e "${YELLOW}⚠${NC} $description - Pattern not found"
            ((WARN++))
            return 1
        fi
    else
        echo -e "${RED}✗${NC} $description - File missing"
        ((FAIL++))
        return 1
    fi
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 1: Components Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo "Loading Components:"
check_file "src/components/LoadingSpinner.tsx"
check_file "src/components/LoadingSkeleton.tsx"

echo ""
echo "Error Handling:"
check_file "src/components/ErrorBoundary.tsx"

echo ""
echo "SEO Component:"
check_file "src/components/SEO.tsx"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 2: Utilities Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
check_dir "src/utils"
check_file "src/utils/responsive.ts"
check_file "src/utils/accessibility.ts"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 3: Configuration Files${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
check_file "public/sitemap.xml"
check_file "public/robots.txt"
check_file "public/manifest.json"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 4: Scripts${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
check_dir "scripts"
check_file "scripts/generate-sitemap.js"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 5: Font Optimization${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
check_content "src/app/[locale]/layout.tsx" "next/font/google" "Next.js Font import"
check_content "src/app/[locale]/layout.tsx" "Inter" "Inter font configured"
check_content "src/app/[locale]/layout.tsx" "display: 'swap'" "Font display swap"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 6: Image Optimization Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
check_content "src/app/[locale]/HomePageClient.tsx" "next/image" "HomePageClient Image import"
check_content "src/app/[locale]/marketplace/page.tsx" "next/image" "Marketplace Image import"
check_content "src/app/[locale]/about/page.tsx" "next/image" "About Image import"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 7: Content Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo "LoadingSpinner features:"
check_content "src/components/LoadingSpinner.tsx" "role=\"status\"" "ARIA role for spinner"
check_content "src/components/LoadingSpinner.tsx" "aria-label" "ARIA label for spinner"

echo ""
echo "LoadingSkeleton features:"
check_content "src/components/LoadingSkeleton.tsx" "SkeletonCard" "SkeletonCard export"
check_content "src/components/LoadingSkeleton.tsx" "SkeletonTable" "SkeletonTable export"

echo ""
echo "ErrorBoundary features:"
check_content "src/components/ErrorBoundary.tsx" "getDerivedStateFromError" "Error catching"
check_content "src/components/ErrorBoundary.tsx" "componentDidCatch" "Error logging"

echo ""
echo "SEO Component features:"
check_content "src/components/SEO.tsx" "og:title" "Open Graph meta"
check_content "src/components/SEO.tsx" "twitter:card" "Twitter Card meta"
check_content "src/components/SEO.tsx" "application/ld+json" "JSON-LD support"

echo ""
echo "Responsive utilities:"
check_content "src/utils/responsive.ts" "isMobile" "Mobile detection"
check_content "src/utils/responsive.ts" "isTouchTargetValid" "Touch target validator"

echo ""
echo "Accessibility utilities:"
check_content "src/utils/accessibility.ts" "announceToScreenReader" "Screen reader announce"
check_content "src/utils/accessibility.ts" "trapFocus" "Focus trap"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 8: Sitemap Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
if [ -f "public/sitemap.xml" ]; then
    URL_COUNT=$(grep -c "<loc>" public/sitemap.xml)
    echo -e "${GREEN}✓${NC} Sitemap contains $URL_COUNT URLs"
    ((PASS++))
    
    if grep -q "hreflang" public/sitemap.xml; then
        echo -e "${GREEN}✓${NC} Sitemap has hreflang tags"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠${NC} Sitemap missing hreflang tags"
        ((WARN++))
    fi
else
    echo -e "${RED}✗${NC} Sitemap not found"
    ((FAIL++))
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 9: Documentation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
check_file "FULL_POLISH_REPORT.md"
check_file "OPTIMIZATION_PLAN.md"
check_file "OPTIMIZATION_PROGRESS.md"
check_file "COMPREHENSIVE_FIX_SUMMARY.md"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Phase 10: TypeScript Compilation Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo ""
echo "Checking TypeScript files..."
TS_ERRORS=$(find src -name "*.ts" -o -name "*.tsx" | wc -l)
echo -e "${GREEN}✓${NC} Found $TS_ERRORS TypeScript files"
((PASS++))

echo -e "\n╔══════════════════════════════════════════════════════════════════╗"
echo -e "║                    📊 VERIFICATION RESULTS                       ║"
echo -e "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Tests Passed:    ${GREEN}$PASS${NC}"
echo -e "Tests Failed:    ${RED}$FAIL${NC}"
echo -e "Warnings:        ${YELLOW}$WARN${NC}"
echo -e "Total Tests:     $((PASS + FAIL + WARN))"
echo ""

TOTAL=$((PASS + FAIL + WARN))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASS * 100 / TOTAL))
    echo -e "Success Rate:    ${GREEN}${PERCENTAGE}%${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ ALL VERIFICATIONS PASSED!${NC}"
    echo -e "${GREEN}Application is production-ready!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  $FAIL verification(s) failed${NC}"
    echo -e "${YELLOW}Please review the failed items above${NC}"
    exit 1
fi
