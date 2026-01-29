# 🎨 Design System Quick Reference Guide

## Imports

```tsx
// Layout Components
import {
  PageContainer,
  SectionLayout,
  CardGrid,
  StatsGrid,
  FormWrapper,
  EmptyState,
  LoadingState,
  TwoColumnLayout,
} from '@/components/layout/LayoutComponents';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

// Navigation & Layout
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Design System
import { colors, spacing, typography, patterns } from '@/lib/design-system';

// Utilities
import { useTranslations } from 'next-intl';
import Link from 'next/link';
```

---

## Common Patterns

### Full Page Template
```tsx
'use client';

import { useTranslations } from 'next-intl';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { PageContainer, SectionLayout } from '@/components/layout/LayoutComponents';

export default function Page() {
  const t = useTranslations();

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <PageContainer className="py-12">
          <SectionLayout title="Title" description="Description">
            {/* Content */}
          </SectionLayout>
        </PageContainer>
      </div>
      <Footer />
    </>
  );
}
```

### Responsive Grid
```tsx
// 1 column mobile, 2 columns tablet, 3 columns desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* Items */}
</div>
```

### Flexible Container
```tsx
// Use PageContainer for consistent max-width
<PageContainer size="lg" padding="lg">
  {/* Content is max 1280px with consistent padding */}
</PageContainer>
```

### Card Grid (Recommended)
```tsx
<CardGrid columns="3" gap="lg">
  {/* Cards will be responsive */}
</CardGrid>
```

### Button Variants
```tsx
// Primary (main CTA)
<Button variant="primary" size="lg">Primary</Button>

// Secondary
<Button variant="secondary" size="md">Secondary</Button>

// Outline
<Button variant="outline" size="sm">Outline</Button>

// Ghost
<Button variant="ghost" size="xs">Ghost</Button>
```

### Color Utilities
```tsx
// Background colors
className="bg-gray-50"          // Page background
className="bg-white"            // Card background
className="bg-blue-600"         // Primary CTA
className="bg-blue-100"         // Highlight

// Text colors
className="text-gray-900"       // Headings
className="text-gray-600"       // Body text
className="text-blue-600"       // Links/emphasis

// Border colors
className="border border-gray-200"
className="border border-gray-300"
```

### Spacing Classes
```tsx
// Padding
className="p-4 sm:p-6 lg:p-8"
className="px-4 py-6"

// Margin
className="mb-12"
className="mt-8 mb-12"

// Gap (flex/grid)
className="gap-4 sm:gap-6"
className="gap-6 sm:gap-8 lg:gap-12"
```

### Typography
```tsx
// Headings
className="text-4xl sm:text-5xl font-bold text-gray-900"
className="text-3xl sm:text-4xl font-bold"
className="text-2xl font-semibold"
className="text-xl font-semibold"

// Body
className="text-lg text-gray-600"
className="text-base text-gray-600"
className="text-sm text-gray-500"

// Utilities
className="line-clamp-2"  // Limit to 2 lines
className="truncate"       // Single line truncate
```

### Hover States
```tsx
className="hover:bg-gray-100 transition-colors"
className="hover:shadow-lg transition-shadow"
className="hover:text-blue-700 transition-colors"
```

### Focus Ring
```tsx
className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

---

## Quick Component Usage

### PageContainer
```tsx
<PageContainer>        {/* Default: lg, lg padding */}
<PageContainer size="sm" padding="sm">
<PageContainer size="full" padding="md">
```

### SectionLayout
```tsx
<SectionLayout
  title="Section Title"
  description="Optional description"
  titleSize="lg"  // sm, md, lg
>
  Content
</SectionLayout>
```

### CardGrid
```tsx
<CardGrid columns="3" gap="lg">  {/* columns: auto/2/3/4, gap: sm/md/lg */}
<CardGrid columns="2" gap="md">
<CardGrid columns="auto" gap="sm">
```

### StatsGrid
```tsx
<StatsGrid stats={[
  { label: 'Stat', value: 123, icon: <Icon /> },
  { label: 'Growth', value: 45, change: { value: 12, type: 'increase' } },
]} />
```

### EmptyState
```tsx
<EmptyState
  icon="🚗"
  title="No vehicles found"
  description="Try adjusting your filters"
  action={<Button>Clear Filters</Button>}
/>
```

---

## Color Palette Quick Reference

### Primary
- Blue-600: `#2563eb` - Main brand color

### Status
- Green-600: `#16a34a` - Success
- Amber-600: `#d97706` - Warning
- Red-600: `#dc2626` - Error
- Blue-600: `#2563eb` - Info

### Backgrounds
- Gray-50: `#f9fafb` - Page background
- White: `#ffffff` - Card background
- Gray-100: `#f3f4f6` - Hover/secondary

### Text
- Gray-900: `#111827` - Headings
- Gray-700: `#374151` - Emphasis
- Gray-600: `#4b5563` - Body
- Gray-500: `#6b7280` - Secondary
- Gray-400: `#9ca3af` - Disabled

### Borders
- Gray-200: `#e5e7eb` - Light borders
- Gray-300: `#d1d5db` - Medium borders

---

## Responsive Breakpoints

Use Tailwind's breakpoint prefixes:

```tsx
// Default: mobile
// sm: 640px (landscape mobile)
// md: 768px (tablet)
// lg: 1024px (laptop)
// xl: 1280px (desktop)
// 2xl: 1536px (large desktop)

className="block md:hidden"           // Show on mobile, hide on tablet+
className="hidden md:block"           // Hide on mobile, show on tablet+
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="text-2xl md:text-3xl lg:text-4xl"
className="p-4 md:p-6 lg:p-8"
```

---

## Animation/Transition

```tsx
// Smooth transitions (use pattern from design-system)
className="transition-colors duration-200"
className="transition-all duration-300"
className="hover:bg-gray-100 transition-colors"

// Loading spinner
<LoadingState />

// Or manual
<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
```

---

## Common Gotchas

❌ **Don't**:
```tsx
className="max-w-6xl mx-auto"  // Wrong - conflicts with PageContainer

className="text-blue-500"      // Use 600 for better contrast

<div className="flex">         // Check responsive needs first
  {/* content */}
</div>

// Hardcoded spacing
className="p-20"               // Use predefined sizes
```

✅ **Do**:
```tsx
<PageContainer size="lg">      // Correct - uses component

className="text-blue-600"      // Good contrast

<CardGrid columns="3">         // Responsive by default
  {/* content */}
</CardGrid>

className="p-4 sm:p-6 lg:p-8"  // Responsive spacing
```

---

## Component File Structure

```
src/
├── components/
│   ├── ui/                    # UI components (Button, Input, etc.)
│   ├── layout/                # Layout components
│   ├── Navigation.tsx         # Top nav
│   ├── Footer.tsx            # Footer
│   └── [Feature]/            # Feature-specific components
├── lib/
│   ├── design-system/        # Design tokens
│   ├── hooks/                # Custom hooks
│   ├── api/                  # API utilities
│   └── schemas.ts            # Zod schemas
└── app/
    └── [locale]/             # Localized routes
        ├── page.tsx          # Landing page
        ├── layout.tsx        # Layout wrapper
        └── [feature]/        # Feature routes
```

---

## Testing Responsive Design

Always test at these breakpoints:
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (Laptop)
- 1280px (Desktop)
- 1536px (Large Monitor)

Use Chrome DevTools responsive mode or Vercel's preview links.

---

## Performance Tips

1. **Use Image components**
   ```tsx
   import Image from 'next/image';
   <Image src="/img.jpg" alt="desc" width={300} height={200} />
   ```

2. **Lazy load non-critical images**
   ```tsx
   <Image ... loading="lazy" />
   ```

3. **Optimize fonts** - System fonts are fastest

4. **Use CardGrid/PageContainer** - Pre-optimized layouts

5. **Keep components small** - Easier to optimize

---

## Useful Links

- Tailwind CSS Docs: https://tailwindcss.com/docs
- Next.js Docs: https://nextjs.org/docs
- Lucide Icons: https://lucide.dev
- Vercel Deployment: https://vercel.com/docs

---

**Version**: 1.0  
**Last Updated**: January 29, 2026  
