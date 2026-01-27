#!/bin/bash
echo "🌐 LIVE SERVER TESTING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASS=0
FAIL=0

test_endpoint() {
    URL=$1
    NAME=$2
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "  ✅ $NAME (HTTP $HTTP_CODE)"
        ((PASS++))
    else
        echo "  ❌ $NAME (HTTP $HTTP_CODE)"
        ((FAIL++))
    fi
}

echo "Testing core pages..."
test_endpoint "http://localhost:3005/en" "Homepage (EN)"
test_endpoint "http://localhost:3005/de" "Homepage (DE)"
test_endpoint "http://localhost:3005/en/about" "About page"
test_endpoint "http://localhost:3005/en/marketplace" "Marketplace"
test_endpoint "http://localhost:3005/en/contact" "Contact"
test_endpoint "http://localhost:3005/en/how-it-works" "How it works"
test_endpoint "http://localhost:3005/en/benefits" "Benefits"

echo ""
echo "Testing legal pages..."
test_endpoint "http://localhost:3005/en/legal/privacy" "Privacy Policy"
test_endpoint "http://localhost:3005/en/legal/terms" "Terms of Service"
test_endpoint "http://localhost:3005/en/legal/cookies" "Cookie Policy"

echo ""
echo "Testing auth pages..."
test_endpoint "http://localhost:3005/en/login" "Login page"
test_endpoint "http://localhost:3005/en/register" "Register page"

echo ""
echo "Testing static files..."
test_endpoint "http://localhost:3005/sitemap.xml" "Sitemap"
test_endpoint "http://localhost:3005/robots.txt" "Robots.txt"
test_endpoint "http://localhost:3005/manifest.json" "PWA Manifest"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅ Passed:  $PASS"
echo "  ❌ Failed:  $FAIL"
echo ""

TOTAL=$((PASS + FAIL))
SCORE=$((PASS * 100 / TOTAL))
echo "  🎯 Score: $SCORE%"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "  🏆 All endpoints working perfectly!"
else
    echo "  ⚠️  Some endpoints need attention"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
