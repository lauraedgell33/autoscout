#!/bin/bash
echo "🔍 SERVER STATUS CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test homepage
echo "Testing homepage..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/en 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Homepage: Working (HTTP $HTTP_CODE)"
else
    echo "  ❌ Homepage: Error (HTTP $HTTP_CODE)"
fi

# Test German
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/de 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ German (DE): Working (HTTP $HTTP_CODE)"
else
    echo "  ❌ German (DE): Error (HTTP $HTTP_CODE)"
fi

# Test marketplace
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/en/marketplace 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ Marketplace: Working (HTTP $HTTP_CODE)"
else
    echo "  ❌ Marketplace: Error (HTTP $HTTP_CODE)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Server is running at: http://localhost:3005"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
