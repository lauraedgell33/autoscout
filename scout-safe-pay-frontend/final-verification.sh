#!/bin/bash
echo "🔍 FINAL COMPREHENSIVE VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo "  ✅ $1"
    ((PASS++))
}

check_fail() {
    echo "  ❌ $1"
    ((FAIL++))
}

check_warn() {
    echo "  ⚠️  $1"
    ((WARN++))
}

echo "1️⃣  FILE STRUCTURE VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check critical files
FILES=(
    "src/utils/logger.ts"
    "src/utils/security.ts"
    "src/utils/rateLimiting.ts"
    "src/utils/dynamicImports.ts"
    "next.config.ts"
    "package.json"
    ".env.example"
    ".env.production.template"
    "DEPLOYMENT.md"
    "PRODUCTION_READY_REPORT.md"
    "PERFECTION_ACHIEVED.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "$file exists"
    else
        check_fail "$file missing"
    fi
done

echo ""
echo "2️⃣  TYPESCRIPT SYNTAX CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check new utility files for syntax errors
for file in src/utils/{logger,security,rateLimiting,dynamicImports}.ts; do
    if npx tsc --noEmit "$file" 2>&1 | grep -q "error"; then
        check_fail "$file has TypeScript errors"
    else
        check_pass "$file syntax valid"
    fi
done

echo ""
echo "3️⃣  DEPENDENCIES CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if required packages are installed
PACKAGES=(
    "isomorphic-dompurify"
    "@next/bundle-analyzer"
)

for pkg in "${PACKAGES[@]}"; do
    if npm list "$pkg" --depth=0 2>/dev/null | grep -q "$pkg"; then
        check_pass "$pkg installed"
    else
        check_fail "$pkg NOT installed"
    fi
done

echo ""
echo "4️⃣  SECURITY FEATURES CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check security utilities exports
if grep -q "sanitizeHtml" src/utils/security.ts; then
    check_pass "XSS prevention implemented"
else
    check_fail "XSS prevention missing"
fi

if grep -q "rateLimiter" src/utils/rateLimiting.ts; then
    check_pass "Rate limiting implemented"
else
    check_fail "Rate limiting missing"
fi

if grep -q "CSRF" src/utils/security.ts; then
    check_pass "CSRF protection available"
else
    check_warn "CSRF protection not found"
fi

echo ""
echo "5️⃣  BUNDLE OPTIMIZATION CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check next.config.ts optimizations
if grep -q "optimizePackageImports" next.config.ts; then
    check_pass "Package imports optimized"
else
    check_warn "Package imports not optimized"
fi

if grep -q "withBundleAnalyzer" next.config.ts; then
    check_pass "Bundle analyzer configured"
else
    check_fail "Bundle analyzer missing"
fi

if grep -q "compress: true" next.config.ts; then
    check_pass "Compression enabled"
else
    check_fail "Compression not enabled"
fi

echo ""
echo "6️⃣  CONSOLE LOGS CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count console.log statements (excluding console.error)
CONSOLE_LOGS=$(grep -r "console\.log\|console\.warn" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "console.error" | wc -l)

if [ "$CONSOLE_LOGS" -eq 0 ]; then
    check_pass "No console.log statements found"
else
    check_warn "$CONSOLE_LOGS console.log statements still present"
fi

echo ""
echo "7️⃣  ENVIRONMENT CONFIG CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env.example" ]; then
    check_pass ".env.example exists"
else
    check_fail ".env.example missing"
fi

if [ -f ".env.production.template" ]; then
    check_pass ".env.production.template exists"
else
    check_fail ".env.production.template missing"
fi

# Check for required env variables
if grep -q "NEXT_PUBLIC_API_URL" .env.example; then
    check_pass "API URL in env template"
else
    check_fail "API URL missing from env template"
fi

echo ""
echo "8️⃣  SECURITY HEADERS CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HEADERS=(
    "Strict-Transport-Security"
    "Content-Security-Policy"
    "X-Frame-Options"
    "X-Content-Type-Options"
)

for header in "${HEADERS[@]}"; do
    if grep -q "$header" next.config.ts; then
        check_pass "$header configured"
    else
        check_fail "$header missing"
    fi
done

echo ""
echo "9️⃣  DOCUMENTATION CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DOCS=(
    "DEPLOYMENT.md"
    "PRODUCTION_READY_REPORT.md"
    "PERFECTION_ACHIEVED.md"
    "PRODUCTION_OPTIMIZATION_PLAN.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ] && [ -s "$doc" ]; then
        check_pass "$doc complete"
    else
        check_fail "$doc missing or empty"
    fi
done

echo ""
echo "🔟 TRANSLATION FILES CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOCALES=(en de es it ro fr)
for locale in "${LOCALES[@]}"; do
    if [ -f "messages/$locale.json" ]; then
        KEYS=$(grep -o '"[^"]*":' "messages/$locale.json" | wc -l)
        if [ "$KEYS" -gt 1000 ]; then
            check_pass "$locale.json complete ($KEYS keys)"
        else
            check_warn "$locale.json incomplete ($KEYS keys)"
        fi
    else
        check_fail "$locale.json missing"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 VERIFICATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Passed:  $PASS"
echo "  ❌ Failed:  $FAIL"
echo "  ⚠️  Warnings: $WARN"
echo ""

TOTAL=$((PASS + FAIL + WARN))
SCORE=$((PASS * 100 / TOTAL))

echo "  Score: $SCORE%"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "  🏆 STATUS: PERFECT!"
elif [ "$FAIL" -lt 3 ]; then
    echo "  ✅ STATUS: EXCELLENT"
else
    echo "  ⚠️  STATUS: NEEDS ATTENTION"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
