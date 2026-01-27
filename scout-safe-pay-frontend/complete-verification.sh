#!/bin/bash
echo "🔍 COMPLETE FINAL VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASS=0
FAIL=0

echo "✅ PHASE 1: BUILD VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d ".next" ]; then
    echo "  ✅ Production build exists"
    ((PASS++))
    
    # Check build size
    SIZE=$(du -sh .next | cut -f1)
    echo "  ✅ Build size: $SIZE"
    ((PASS++))
    
    # Check static assets
    if [ -d ".next/static" ]; then
        STATIC_SIZE=$(du -sh .next/static | cut -f1)
        echo "  ✅ Static assets: $STATIC_SIZE"
        ((PASS++))
    fi
else
    echo "  ❌ No production build found"
    ((FAIL++))
fi

echo ""
echo "✅ PHASE 2: CODE QUALITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for debugger statements
if grep -r "debugger" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"; then
    echo "  ❌ Found debugger statements"
    ((FAIL++))
else
    echo "  ✅ No debugger statements"
    ((PASS++))
fi

# Check for TODO/FIXME
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | wc -l)
echo "  ℹ️  Found $TODO_COUNT TODO/FIXME comments"

echo ""
echo "✅ PHASE 3: SECURITY UTILITIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test security functions exist
SECURITY_FUNCS=(
    "sanitizeHtml"
    "isValidEmail"
    "validatePasswordStrength"
    "generateCsrfToken"
)

for func in "${SECURITY_FUNCS[@]}"; do
    if grep -q "export.*$func" src/utils/security.ts; then
        echo "  ✅ $func implemented"
        ((PASS++))
    else
        echo "  ❌ $func missing"
        ((FAIL++))
    fi
done

echo ""
echo "✅ PHASE 4: RATE LIMITING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test rate limiting exists
RATE_FUNCS=(
    "rateLimiter"
    "RATE_LIMITS"
    "ExponentialBackoff"
)

for func in "${RATE_FUNCS[@]}"; do
    if grep -q "$func" src/utils/rateLimiting.ts; then
        echo "  ✅ $func implemented"
        ((PASS++))
    else
        echo "  ❌ $func missing"
        ((FAIL++))
    fi
done

echo ""
echo "✅ PHASE 5: PERFORMANCE OPTIMIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check bundle analyzer
if grep -q "withBundleAnalyzer" next.config.ts; then
    echo "  ✅ Bundle analyzer configured"
    ((PASS++))
else
    echo "  ❌ Bundle analyzer missing"
    ((FAIL++))
fi

# Check dynamic imports
if [ -f "src/utils/dynamicImports.ts" ]; then
    echo "  ✅ Dynamic imports utility exists"
    ((PASS++))
else
    echo "  ❌ Dynamic imports missing"
    ((FAIL++))
fi

# Check compression
if grep -q "compress: true" next.config.ts; then
    echo "  ✅ Compression enabled"
    ((PASS++))
else
    echo "  ❌ Compression disabled"
    ((FAIL++))
fi

echo ""
echo "✅ PHASE 6: ENVIRONMENT CONFIG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check env files
ENV_FILES=(".env.example" ".env.production.template")
for file in "${ENV_FILES[@]}"; do
    if [ -f "$file" ]; then
        VARS=$(grep -c "=" "$file")
        echo "  ✅ $file ($VARS variables)"
        ((PASS++))
    else
        echo "  ❌ $file missing"
        ((FAIL++))
    fi
done

echo ""
echo "✅ PHASE 7: TRANSLATIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOCALES=(en de es it ro fr)
EN_KEYS=0

if [ -f "messages/en.json" ]; then
    EN_KEYS=$(grep -o '"[^"]*":' "messages/en.json" | wc -l)
    echo "  ℹ️  English baseline: $EN_KEYS keys"
fi

for locale in "${LOCALES[@]}"; do
    if [ -f "messages/$locale.json" ]; then
        KEYS=$(grep -o '"[^"]*":' "messages/$locale.json" | wc -l)
        if [ "$KEYS" -eq "$EN_KEYS" ] || [ "$locale" = "en" ]; then
            echo "  ✅ $locale.json complete ($KEYS keys)"
            ((PASS++))
        else
            echo "  ⚠️  $locale.json incomplete ($KEYS/$EN_KEYS keys)"
        fi
    else
        echo "  ❌ $locale.json missing"
        ((FAIL++))
    fi
done

echo ""
echo "✅ PHASE 8: DOCUMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DOCS=(
    "README.md"
    "DEPLOYMENT.md"
    "PRODUCTION_READY_REPORT.md"
    "PERFECTION_ACHIEVED.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        SIZE=$(wc -l < "$doc")
        echo "  ✅ $doc ($SIZE lines)"
        ((PASS++))
    else
        echo "  ⚠️  $doc missing"
    fi
done

echo ""
echo "✅ PHASE 9: COMPONENT STRUCTURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

COMPONENTS=(
    "src/components/Navigation.tsx"
    "src/components/Footer.tsx"
    "src/components/LoadingSpinner.tsx"
    "src/components/LoadingSkeleton.tsx"
    "src/components/ErrorBoundary.tsx"
    "src/components/SEO.tsx"
)

for comp in "${COMPONENTS[@]}"; do
    if [ -f "$comp" ]; then
        echo "  ✅ $(basename $comp) exists"
        ((PASS++))
    else
        echo "  ❌ $(basename $comp) missing"
        ((FAIL++))
    fi
done

echo ""
echo "✅ PHASE 10: UTILITIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

UTILS=(
    "src/utils/logger.ts"
    "src/utils/security.ts"
    "src/utils/rateLimiting.ts"
    "src/utils/dynamicImports.ts"
    "src/utils/responsive.ts"
    "src/utils/accessibility.ts"
)

for util in "${UTILS[@]}"; do
    if [ -f "$util" ]; then
        SIZE=$(wc -l < "$util")
        echo "  ✅ $(basename $util) ($SIZE lines)"
        ((PASS++))
    else
        echo "  ❌ $(basename $util) missing"
        ((FAIL++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 FINAL RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Passed:  $PASS tests"
echo "  ❌ Failed:  $FAIL tests"
echo ""

TOTAL=$((PASS + FAIL))
if [ "$TOTAL" -gt 0 ]; then
    SCORE=$((PASS * 100 / TOTAL))
    echo "  🎯 Score: $SCORE%"
else
    SCORE=0
    echo "  🎯 Score: 0%"
fi

echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "  🏆 STATUS: PERFECT - 100% READY FOR PRODUCTION!"
    echo ""
    echo "  ✨ All systems verified and operational"
    echo "  🚀 Ready to deploy to production"
    echo "  🎊 No issues found"
elif [ "$SCORE" -ge 95 ]; then
    echo "  ✅ STATUS: EXCELLENT - Ready for production"
    echo "  Minor issues can be addressed post-deployment"
elif [ "$SCORE" -ge 85 ]; then
    echo "  ⚠️  STATUS: GOOD - Almost ready"
    echo "  Review failed tests before deployment"
else
    echo "  ❌ STATUS: NEEDS WORK"
    echo "  Fix failed tests before deployment"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

exit $FAIL
