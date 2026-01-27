#!/bin/bash

# Find all files with wrong Link import
FILES=$(grep -rl "import Link from 'next/link'" src/components/ src/app/ 2>/dev/null)

for file in $FILES; do
    echo "Fixing: $file"
    # Replace the import line
    sed -i "s|import Link from 'next/link'|import { Link } from '@/i18n/routing'|g" "$file"
done

echo "Done! Fixed all Link imports."
