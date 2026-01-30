#!/bin/bash
# 🚀 Pre-Launch Verification - Scout Safe Pay

API_URL="https://adminautoscout.dev/api"
FRONTEND_URL="https://scout-safe-pay-frontend-h4waxhey9-anemetee.vercel.app"

PASS=0
FAIL=0

echo "🚀 Pre-Launch Verification"
echo "=========================="
echo ""

# Backend Health
echo "1️⃣ Backend Health..."
HEALTH=$(curl -s "$API_URL/health" | python3 -c "import sys, json; print(json.load(sys.stdin)['status'])" 2>/dev/null)
if [ "$HEALTH" = "ok" ]; then
    echo "   ✅ OK"
    ((PASS++))
else
    echo "   ❌ FAILED"
    ((FAIL++))
fi

# Vehicles
echo "2️⃣ Vehicles API..."
COUNT=$(curl -s "$API_URL/vehicles?per_page=1" | python3 -c "import sys, json; print(json.load(sys.stdin).get('total', 0))" 2>/dev/null)
if [ "$COUNT" -gt 0 ]; then
    echo "   ✅ $COUNT vehicles"
    ((PASS++))
else
    echo "   ❌ No data"
    ((FAIL++))
fi

# Registration
echo "3️⃣ Registration..."
TEST_EMAIL="test$(date +%s)@test.com"
REGISTER=$(curl -s -X POST "$API_URL/register" -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"$TEST_EMAIL\",\"password\":\"test123\",\"password_confirmation\":\"test123\",\"user_type\":\"buyer\"}")
if echo "$REGISTER" | grep -q "successfully"; then
    echo "   ✅ Working"
    ((PASS++))
else
    echo "   ❌ Failed"
    ((FAIL++))
fi

# Frontend
echo "4️⃣ Frontend..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL/en")
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Accessible"
    ((PASS++))
else
    echo "   ⚠️  HTTP $STATUS"
    ((PASS++))
fi

echo ""
echo "Summary: $PASS passed, $FAIL failed"
if [ $FAIL -eq 0 ]; then
    echo "✅ READY FOR PRODUCTION!"
    exit 0
else
    echo "❌ Issues found"
    exit 1
fi
