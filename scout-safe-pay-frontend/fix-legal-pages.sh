#!/bin/bash
echo "Fixing legal pages to be server components..."

# Remove 'use client' from legal pages that have generateMetadata
for file in src/app/\[locale\]/legal/{cookies,privacy,refund,terms}/page.tsx; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Remove 'use client' directive
    sed -i "1{/'use client'/d;}" "$file"
    # Remove blank lines at start
    sed -i '/./,$!d' "$file"
    echo "  ✅ Fixed $file"
  fi
done

echo ""
echo "✅ All legal pages fixed!"
