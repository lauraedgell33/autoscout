#!/bin/bash

echo "🔧 Fixing 'use client' directive order..."

FILES=(
    "src/app/[locale]/about/page.tsx"
    "src/app/[locale]/marketplace/page.tsx"
    "src/app/[locale]/checkout/[id]/page.tsx"
    "src/app/[locale]/vehicle/[id]/page.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        # Check if file has Image import before 'use client'
        if head -5 "$file" | grep -q "import Image" && head -5 "$file" | grep -q "'use client'"; then
            echo "Fixing: $file"
            
            # Create temp file with correct order
            {
                echo "'use client'"
                echo ""
                grep -v "'use client'" "$file" | grep -v '^"use client"'
            } > "$file.tmp"
            
            mv "$file.tmp" "$file"
            echo "  ✓ Fixed"
        fi
    fi
done

echo ""
echo "✅ All files fixed!"
