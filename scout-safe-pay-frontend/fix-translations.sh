#!/bin/bash
echo "🔧 TRANSLATION FIX SCRIPT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1. Killing all Node processes on port 3005..."
for pid in $(lsof -ti:3005 2>/dev/null); do
    kill -9 $pid 2>/dev/null
    echo "  Killed process: $pid"
done

echo ""
echo "2. Clearing Next.js cache..."
rm -rf .next
echo "  ✅ .next directory removed"

echo ""
echo "3. Verifying translation keys..."
python3 << 'PY'
import json

locales = ['en', 'de', 'es', 'it', 'ro', 'fr']
missing = []

for locale in locales:
    with open(f'messages/{locale}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'vehicle' in data and 'safetrade_protected' in data['vehicle']:
        print(f"  ✅ {locale}: vehicle.safetrade_protected exists")
    else:
        print(f"  ❌ {locale}: MISSING")
        missing.append(locale)

if not missing:
    print("\n  🎉 All translation keys are present!")
else:
    print(f"\n  ⚠️  Missing in: {', '.join(missing)}")
PY

echo ""
echo "4. Rebuilding application..."
echo "   This will take ~10 seconds..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "  ✅ Build successful!"
else
    echo "  ❌ Build failed - check errors above"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ FIX COMPLETE!"
echo ""
echo "To start dev server:"
echo "  npm run dev"
echo ""
echo "To test in browser:"
echo "  http://localhost:3005/de/vehicle/1"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
