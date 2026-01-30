# UI/UX Polish Implementation Guide

This guide explains how to use all the newly implemented UI/UX polish components and utilities.

## Table of Contents
1. [Design System Foundation](#design-system-foundation)
2. [Loading States & Skeletons](#loading-states--skeletons)
3. [Toast Notifications](#toast-notifications)
4. [Form Validation](#form-validation)
5. [Empty States](#empty-states)
6. [Micro-Interactions](#micro-interactions)
7. [Responsive Utilities](#responsive-utilities)
8. [Accessibility](#accessibility)

---

## Design System Foundation

### Tailwind Config Enhancements

The Tailwind config now includes:

**New Box Shadows:**
```tsx
className="shadow-soft"        // Soft shadow for subtle elevation
className="shadow-card"         // Default card shadow
className="shadow-card-hover"   // Elevated card shadow on hover
```

**New Animations:**
```tsx
className="animate-fade-in"     // Fade in animation (0.3s)
className="animate-slide-up"    // Slide up animation (0.3s)
className="animate-slide-down"  // Slide down animation (0.3s)
className="animate-scale-in"    // Scale in animation (0.2s)
className="animate-shimmer"     // Shimmer loading effect (2s infinite)
className="animate-pulse-slow"  // Slow pulse animation (3s infinite)
```

---

## Loading States & Skeletons

### Enhanced Skeleton Component

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Basic usage
<Skeleton className="h-4 w-24" />

// Multiple skeletons
<div className="space-y-2">
  <Skeleton className="h-6 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

### Vehicle Card Skeleton

```tsx
import { VehicleCardSkeleton } from '@/components/skeletons/VehicleCardSkeleton';

<VehicleCardSkeleton />
```

### Vehicle List Skeleton

```tsx
import { VehicleListSkeleton } from '@/components/skeletons/VehicleListSkeleton';

// Show 9 skeleton cards
<VehicleListSkeleton count={9} />
```

### Dashboard Stats Skeleton

```tsx
import { DashboardStatsSkeleton } from '@/components/skeletons/DashboardStatsSkeleton';

// Shows 4 stat card skeletons
<DashboardStatsSkeleton />
```

### Usage in Pages

```tsx
import { VehicleListSkeleton } from '@/components/skeletons';

export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useVehicles();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <VehicleListSkeleton count={9} />
      </div>
    );
  }
  
  return <VehicleGrid vehicles={vehicles} />;
}
```

---

## Toast Notifications

### Toast Helper Functions

```tsx
import { showToast } from '@/lib/toast';

// Success notification
showToast.success('Vehicle saved to favorites!');

// Error notification
showToast.error('Failed to save vehicle. Please try again.');

// Warning notification
showToast.warning('Your session will expire in 5 minutes.');

// Info notification
showToast.info('New vehicles matching your criteria are available.');

// Promise-based toast (for async operations)
showToast.promise(
  saveVehicle(vehicleId),
  {
    loading: 'Saving vehicle...',
    success: 'Vehicle saved successfully!',
    error: 'Failed to save vehicle.',
  }
);
```

### Toast Container

The ToastContainer is already integrated in the layout. No additional setup needed!

---

## Form Validation

### Form Error Component

```tsx
import { FormError } from '@/components/ui/form-error';

<FormError message={errors.email?.message} />
```

### Form Success Component

```tsx
import { FormSuccess } from '@/components/ui/form-success';

<FormSuccess message="Email verified successfully!" />
```

### Complete Form Example

```tsx
import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ContactForm() {
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Input
          {...register('email')}
          placeholder="Email"
        />
        <FormError message={errors.email?.message} />
      </div>
      
      <FormSuccess message={success} />
      
      <Button loading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
```

---

## Empty States

### No Vehicles Empty State

```tsx
import { NoVehicles } from '@/components/empty-states';

export function VehiclesList({ vehicles }) {
  if (vehicles.length === 0) {
    return <NoVehicles />;
  }
  
  return <VehicleGrid vehicles={vehicles} />;
}
```

### No Favorites Empty State

```tsx
import { NoFavorites } from '@/components/empty-states';

export function FavoritesList({ favorites }) {
  if (favorites.length === 0) {
    return <NoFavorites />;
  }
  
  return <VehicleGrid vehicles={favorites} />;
}
```

### Custom Empty State

```tsx
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

<EmptyState
  icon={Package}
  title="No orders yet"
  description="You haven't placed any orders yet. Start shopping to see your orders here."
  actionLabel="Browse Vehicles"
  actionOnClick={() => router.push('/vehicles')}
/>
```

---

## Micro-Interactions

### Button with Loading State

```tsx
import { Button } from '@/components/ui/button';

<Button loading={isLoading} onClick={handleSave}>
  Save Vehicle
</Button>
```

### Heart Animation (Favorites)

The EnhancedVehicleCard now includes a smooth heart animation:
- Scale effect on hover
- Color transition
- Fill animation when favorited

### Card Hover Effects

Cards automatically elevate on hover with smooth transitions:
```tsx
<div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
  {/* Card content */}
</div>
```

---

## Responsive Utilities

### useBreakpoint Hook

```tsx
import { useBreakpoint } from '@/lib/responsive';

export function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  
  return (
    <div>
      Current breakpoint: {breakpoint}
      {breakpoint === 'sm' && <MobileView />}
      {breakpoint === 'lg' && <DesktopView />}
    </div>
  );
}
```

### useMediaQuery Hook

```tsx
import { useMediaQuery } from '@/lib/responsive';

export function AdaptiveLayout() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

---

## Accessibility

### Focus Visible Rings

All interactive elements now have enhanced focus indicators:
```css
*:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: #0ea5e9;
  ring-offset: 2px;
}
```

### ARIA Labels

Interactive elements include proper ARIA labels:
```tsx
<button
  aria-label="Add to favorites"
  aria-pressed={isFavorite}
>
  <Heart />
</button>
```

### Skip to Content

The skip-to-content link is already implemented and styled in globals.css:
```tsx
<SkipLink /> // Already in layout
```

### Keyboard Navigation

All components support full keyboard navigation:
- Tab through interactive elements
- Enter/Space to activate buttons
- Arrow keys for navigation where applicable

---

## Best Practices

### 1. Always Show Loading States
```tsx
if (isLoading) return <VehicleListSkeleton count={6} />;
```

### 2. Provide User Feedback
```tsx
const handleSave = async () => {
  await showToast.promise(
    saveVehicle(id),
    {
      loading: 'Saving...',
      success: 'Saved!',
      error: 'Failed to save.',
    }
  );
};
```

### 3. Handle Empty States
```tsx
if (data.length === 0) return <NoVehicles />;
```

### 4. Use Error Boundaries
Error boundaries are already wrapped around the main layout.

### 5. Accessibility First
- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Test with screen readers

---

## Animation Performance Tips

1. Use `will-change` sparingly for elements that will animate
2. Prefer `transform` and `opacity` for animations
3. Use `animate-` classes from Tailwind for consistent timing
4. Test on mobile devices for smooth 60fps animations

---

## Component Hierarchy

```
src/
├── components/
│   ├── ui/
│   │   ├── skeleton.tsx           # Base skeleton with shimmer
│   │   ├── button.tsx             # Button with loading state
│   │   ├── input.tsx              # Input with focus effects
│   │   ├── form-error.tsx         # Form error message
│   │   ├── form-success.tsx       # Form success message
│   │   ├── empty-state.tsx        # Base empty state component
│   │   └── error-boundary.tsx     # Error boundary component
│   ├── skeletons/
│   │   ├── VehicleCardSkeleton.tsx
│   │   ├── VehicleListSkeleton.tsx
│   │   ├── DashboardSkeleton.tsx
│   │   └── DashboardStatsSkeleton.tsx
│   └── empty-states/
│       ├── NoVehicles.tsx
│       └── NoFavorites.tsx
├── lib/
│   ├── toast.ts                   # Toast helper functions
│   └── responsive.ts              # Responsive utility hooks
└── app/
    └── globals.css                # Global styles with animations
```

---

## Migration Notes

If you're updating existing code:

1. **Replace old skeleton components:**
   ```tsx
   // Old
   <div className="animate-pulse">...</div>
   
   // New
   <Skeleton className="h-4 w-24" />
   ```

2. **Update toast calls:**
   ```tsx
   // Old
   toast.success('Saved!')
   
   // New
   showToast.success('Saved!')
   ```

3. **Add loading states:**
   ```tsx
   // Old
   <Button disabled={isLoading}>Save</Button>
   
   // New
   <Button loading={isLoading}>Save</Button>
   ```

---

## Support

For questions or issues with these components:
1. Check this documentation
2. Review component source code
3. Check existing usage in the codebase
4. Refer to the problem statement for design specifications

---

**Last Updated:** January 30, 2026
**Version:** 1.0.0
