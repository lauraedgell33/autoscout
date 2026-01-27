#!/bin/bash

# List of files that need router for navigation (not params)
FILES=(
    "src/app/[locale]/(auth)/login/page.tsx"
    "src/app/[locale]/(dashboard)/transactions/page.tsx"
    "src/app/[locale]/(dashboard)/layout.tsx"
    "src/app/[locale]/admin/page.tsx"
    "src/app/[locale]/dashboard/verification/page.tsx"
    "src/app/[locale]/dashboard/disputes/page.tsx"
    "src/app/[locale]/dashboard/vehicles/add/page.tsx"
    "src/components/ProtectedRoute.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        # Check if file uses useRouter without useParams
        if grep -q "import.*useRouter.*from 'next/navigation'" "$file" && ! grep -q "useParams" "$file"; then
            echo "  -> Fixing router import"
            sed -i "s|import { useRouter } from 'next/navigation'|import { useRouter } from '@/i18n/routing'|g" "$file"
        fi
    fi
done

echo "Done!"
