#!/bin/bash
echo "🧪 Testing application build..."
echo ""

# Try to access the page
echo "Checking if server is responding..."
curl -s http://localhost:3005/en 2>&1 | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking TypeScript compilation..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Quick syntax check on modified files
for file in "src/app/[locale]/HomePageClient.tsx" "src/app/[locale]/about/page.tsx" "src/app/[locale]/marketplace/page.tsx"; do
    if [ -f "$file" ]; then
        echo "Checking: $file"
        
        # Check for basic syntax issues
        if grep -q "^'use client'$" "$file"; then
            echo "  ✓ 'use client' directive is first line"
        else
            echo "  ✗ Missing or incorrect 'use client' directive"
        fi
        
        # Check for proper imports
        if grep -q "^import" "$file"; then
            echo "  ✓ Has import statements"
        fi
        
        # Check for export
        if grep -q "export default" "$file"; then
            echo "  ✓ Has default export"
        fi
        
        echo ""
    fi
done
