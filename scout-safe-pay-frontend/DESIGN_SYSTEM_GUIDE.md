# AutoScout24 SafeTrade - Design System & UI/UX Guide

## Table of Contents
1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Animations](#animations)
5. [Accessibility](#accessibility)
6. [Best Practices](#best-practices)

## Overview

This design system provides a comprehensive set of components, utilities, and guidelines for building consistent and accessible user interfaces in the AutoScout24 SafeTrade application.

### Key Features
- **Consistent Design**: Full color palette with scales from 50-950
- **Accessibility First**: WCAG 2.1 AA compliant components
- **Performance Optimized**: Efficient animations using GPU-accelerated properties
- **Mobile-First**: Responsive components that work on all devices
- **Type-Safe**: Full TypeScript support

## Design Tokens

### Colors

All colors are available in full scales from 50 (lightest) to 950 (darkest):

```typescript
// Primary (Blue) - AutoScout24 brand color
primary-50 to primary-950
// Use: primary-900 for main brand color, primary-950 for dark variant

// Accent (Orange) - AutoScout24 secondary color
accent-50 to accent-950
// Use: accent-500 for main accent color, accent-600 for hover

// Semantic Colors
success-50 to success-950  // Green for success states
error-50 to error-950      // Red for error states
warning-50 to warning-950  // Yellow/Orange for warnings
info-50 to info-950        // Blue for informational messages
```

### Typography

```typescript
// Font Sizes with Line Heights
text-xs    // 0.75rem (12px) / 1rem line-height
text-sm    // 0.875rem (14px) / 1.25rem line-height
text-base  // 1rem (16px) / 1.5rem line-height
text-lg    // 1.125rem (18px) / 1.75rem line-height
text-xl    // 1.25rem (20px) / 1.75rem line-height
text-2xl   // 1.5rem (24px) / 2rem line-height
text-3xl   // 1.875rem (30px) / 2.25rem line-height
text-4xl   // 2.25rem (36px) / 2.5rem line-height
text-5xl   // 3rem (48px) / 1 line-height
```

### Spacing

Use the standard Tailwind spacing scale. Prefer: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

```typescript
p-4   // 1rem (16px)
p-6   // 1.5rem (24px)
p-8   // 2rem (32px)
gap-4 // 1rem (16px)
```

### Animations

Available animation classes:
```css
animate-fade-in         // Fade in from bottom
animate-slide-up        // Slide up with fade
animate-slide-in-left   // Slide from left
animate-slide-in-right  // Slide from right
animate-scale-in        // Scale up with fade
animate-pulse-slow      // Slow pulsing effect
animate-shimmer         // Shimmer loading effect
```

Animation delays:
```css
animation-delay-200   // 0.2s delay
animation-delay-400   // 0.4s delay
animation-delay-600   // 0.6s delay
```

## Components

### Loading States

#### LoadingSpinner
```tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner';

<LoadingSpinner 
  size="md"              // sm | md | lg | xl
  variant="primary"      // primary | secondary | white | accent
  fullscreen={false}     // Show as overlay
  label="Loading..."     // Accessible label
/>
```

#### Skeleton Components
```tsx
import { 
  VehicleCardSkeleton,
  VehicleListSkeleton,
  DashboardSkeleton,
} from '@/components/skeletons';

<VehicleCardSkeleton />
<VehicleListSkeleton count={6} />
<DashboardSkeleton />
```

### Empty States

```tsx
import { EmptyState } from '@/components/ui/empty-state';
import { Car } from 'lucide-react';

<EmptyState
  icon={Car}
  title="No vehicles found"
  description="Try adjusting your filters"
  actionLabel="Clear Filters"
  actionOnClick={handleClearFilters}
  size="md"              // sm | md | lg
  variant="default"      // default | minimal
/>
```

Pre-built empty states:
```tsx
import {
  NoVehiclesFound,
  NoSearchResults,
  NoFavorites,
  NoTransactions,
  NoNotifications,
} from '@/components/common/EmptyStates';
```

### Error Boundary

```tsx
import { ErrorBoundary } from '@/components/ui/error-boundary';

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error service
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Toast Notifications

```tsx
import { EnhancedToastContainer } from '@/components/ui/toast-enhanced';

<EnhancedToastContainer
  toasts={toasts}
  onDismiss={handleDismiss}
  position="bottom-right"  // top-right | top-center | bottom-right etc.
/>

// Toast object shape:
{
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;      // default: 5000ms
  dismissible?: boolean;  // default: true
  progress?: boolean;     // show progress bar, default: true
}
```

### Form Components

```tsx
import { FormInput } from '@/components/ui/form-input';

<FormInput
  label="Email"
  type="email"
  error={errors.email}
  helperText="We'll never share your email"
  required
  inputSize="md"         // sm | md | lg
  variant="default"      // default | filled | outlined
  leftIcon={<Mail />}
  showValidationIcon
/>
```

### Buttons

```tsx
import { Button } from '@/components/ui/button';

<Button
  variant="primary"      // primary | secondary | outline | ghost | danger | success
  size="md"              // sm | md | lg
  loading={isLoading}
  leftIcon={<Plus />}
  rightIcon={<ArrowRight />}
  fullWidth
>
  Click Me
</Button>
```

### Cards

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

<Card hoverable interactive onClick={handleClick}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

## Animations

### Page Transitions

```tsx
import { 
  FadeTransition,
  SlideUpTransition,
  StaggerContainer,
  StaggerItem,
} from '@/lib/animations';

<FadeTransition>
  <YourPage />
</FadeTransition>

<StaggerContainer staggerDelay={0.1}>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <ItemComponent />
    </StaggerItem>
  ))}
</StaggerContainer>
```

## Accessibility

### Skip Link
```tsx
import { SkipLink } from '@/components/ui/accessibility';

<SkipLink href="#main-content" label="Skip to main content" />
```

### Screen Reader Only Text
```tsx
import { VisuallyHidden } from '@/components/ui/accessibility';

<VisuallyHidden>
  This text is only for screen readers
</VisuallyHidden>
```

### Focus Management
```tsx
import { FocusableIcon } from '@/components/ui/accessibility';

<FocusableIcon 
  label="Delete item"
  onClick={handleDelete}
>
  <Trash2 />
</FocusableIcon>
```

### Live Regions
```tsx
import { LiveRegion } from '@/components/ui/accessibility';

<LiveRegion politeness="polite">
  {statusMessage}
</LiveRegion>
```

## Best Practices

### Color Usage
- Use `primary-900` for main brand color (buttons, links)
- Use `accent-500` for secondary actions and highlights
- Use semantic colors for states: `success-*`, `error-*`, `warning-*`, `info-*`
- Ensure text contrast ratio of at least 4.5:1 (WCAG AA)

### Typography
- Use heading hierarchy: h1 → h2 → h3 (never skip levels)
- Use `text-base` (16px) as minimum for body text
- Use `text-sm` (14px) for secondary/helper text
- Use line-height classes for better readability

### Spacing
- Use consistent spacing: prefer 4, 8, 16, 24, 32, 48
- Use `gap-*` for flexbox/grid spacing
- Use `space-y-*` for vertical stacking
- Maintain adequate whitespace around content

### Animations
- Keep animations under 300ms for micro-interactions
- Use `prefers-reduced-motion` media query (handled automatically)
- Prefer `transform` and `opacity` for performance
- Add animations to enhance UX, not just for decoration

### Accessibility
- Always provide alt text for images
- Use semantic HTML elements (button, nav, main, article)
- Ensure keyboard navigation works (Tab, Enter, Escape)
- Test with screen readers
- Maintain focus visibility
- Use ARIA attributes when necessary

### Responsive Design
- Mobile-first approach: design for mobile, enhance for desktop
- Use breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Touch targets minimum 44x44px on mobile
- Test on real devices when possible

### Performance
- Use Next.js Image component for optimized images
- Lazy load heavy components with React.lazy()
- Use Suspense boundaries with skeleton fallbacks
- Minimize use of large third-party libraries

## Testing

### Checklist
- [ ] Component renders correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast meets WCAG AA
- [ ] Animations respect prefers-reduced-motion
- [ ] Loading states show appropriately
- [ ] Error states handle gracefully
- [ ] Forms validate inline
- [ ] Touch targets are adequate (44x44px)

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Radix UI Documentation](https://www.radix-ui.com/)
