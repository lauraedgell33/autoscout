#!/bin/bash
echo "🔍 PRODUCTION READINESS AUDIT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📦 1. BUILD TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -d ".next" ]; then
    echo "  ⚠️  Old build exists - need fresh build test"
else
    echo "  ✅ No old build"
fi

echo ""
echo "📊 2. BUNDLE SIZE CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Checking package.json dependencies..."
DEPS=$(cat package.json | grep -A 100 '"dependencies"' | grep -c '":')
DEV_DEPS=$(cat package.json | grep -A 100 '"devDependencies"' | grep -c '":')
echo "  Dependencies: $DEPS"
echo "  DevDependencies: $DEV_DEPS"

echo ""
echo "🖼️  3. IMAGE OPTIMIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
IMG_COUNT=$(find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.webp" -o -name "*.avif" \) 2>/dev/null | wc -l)
echo "  Images in /public: $IMG_COUNT"
if [ $IMG_COUNT -gt 0 ]; then
    echo "  Checking sizes..."
    find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k 2>/dev/null | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "  ⚠️  Large image: $file ($size)"
    done
fi

echo ""
echo "🔒 4. SECURITY CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -r "console.log" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | head -5; then
    echo "  ⚠️  Found console.log statements (should remove for production)"
else
    echo "  ✅ No console.log found"
fi

if grep -r "debugger" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"; then
    echo "  ⚠️  Found debugger statements"
else
    echo "  ✅ No debugger statements"
fi

if [ -f ".env.local" ]; then
    echo "  ⚠️  .env.local exists - need .env.production"
else
    echo "  ✅ No .env.local"
fi

echo ""
echo "⚡ 5. PERFORMANCE FEATURES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -q "next/image" src/components/*.tsx 2>/dev/null; then
    echo "  ✅ Using next/image"
else
    echo "  ⚠️  Check if next/image is used"
fi

if grep -q "next/font" src/app/*/layout.tsx 2>/dev/null; then
    echo "  ✅ Using next/font"
else
    echo "  ⚠️  next/font not detected"
fi

if [ -f "public/sitemap.xml" ]; then
    echo "  ✅ Sitemap exists"
else
    echo "  ⚠️  No sitemap"
fi

if [ -f "public/robots.txt" ]; then
    echo "  ✅ robots.txt exists"
else
    echo "  ⚠️  No robots.txt"
fi

echo ""
echo "📱 6. PWA ASSETS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "public/manifest.json" ]; then
    echo "  ✅ manifest.json exists"
else
    echo "  ⚠️  No manifest.json"
fi

if [ -f "public/icon-192.png" ]; then
    echo "  ✅ icon-192.png exists"
else
    echo "  ❌ Missing icon-192.png"
fi

if [ -f "public/icon-512.png" ]; then
    echo "  ✅ icon-512.png exists"
else
    echo "  ❌ Missing icon-512.png"
fi

echo ""
echo "🧪 7. TYPE SAFETY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -f "tsconfig.json" ]; then
    if grep -q '"strict": true' tsconfig.json; then
        echo "  ✅ TypeScript strict mode enabled"
    else
        echo "  ⚠️  TypeScript strict mode disabled"
    fi
fi

echo ""
echo "📈 8. ANALYTICS & MONITORING"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if grep -r "analytics" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | head -1; then
    echo "  ✅ Analytics code found"
else
    echo "  ⚠️  No analytics detected"
fi

echo ""
echo "🌐 9. INTERNATIONALIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
LOCALES=$(find messages -name "*.json" 2>/dev/null | wc -l)
echo "  Translation files: $LOCALES"
if [ $LOCALES -ge 6 ]; then
    echo "  ✅ All locales present"
else
    echo "  ⚠️  Missing translations"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AUDIT COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
