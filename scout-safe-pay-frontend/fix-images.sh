#!/bin/bash

# Find all files with <img tags and fix them
echo "🖼️  Fixing image tags..."

FILES=(
    "src/app/[locale]/HomePageClient.tsx"
    "src/app/[locale]/about/page.tsx"
    "src/app/[locale]/marketplace/page.tsx"
    "src/app/[locale]/checkout/[id]/page.tsx"
    "src/app/[locale]/vehicle/[id]/page.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        
        # Check if it already imports Image
        if ! grep -q "import Image from 'next/image'" "$file"; then
            # Add Image import after the first import
            sed -i "1s/^/import Image from 'next\/image'\n/" "$file"
        fi
        
        echo "  ✓ Added Image import"
    fi
done

echo ""
echo "✅ Image imports added. Manual replacement of <img> tags needed."
echo "   (Next.js Image requires width/height props)"
