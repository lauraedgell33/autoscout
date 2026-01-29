# 🚀 Frontend Architecture Setup - Complete Guide

**Status:** ✅ All Systems Configured  
**Date:** January 29, 2026  
**Framework:** Next.js 15 + React 19

---

## 📦 Installed Packages

### State Management
```bash
✅ zustand@5.x           - Lightweight state management
✅ @tanstack/react-query - Server state & caching
```

### UI Components & Animations
```bash
✅ @radix-ui/*           - Accessible UI primitives
✅ framer-motion@11.x    - Advanced animations
```

### Forms & Validation
```bash
✅ react-hook-form       - Performant form handling
✅ zod@3.x               - TypeScript-first schema validation
✅ @hookform/resolvers   - Zod integration with RHF
```

### Data Visualization
```bash
✅ recharts@2.x          - React charts library
```

### Testing
```bash
✅ cypress@14.x          - E2E testing framework
```

### HTTP Client
```bash
✅ axios                 - Promise-based HTTP client
```

---

## 🏗️ Project Structure

```
scout-safe-pay-frontend/
├── lib/
│   ├── stores/                   # Zustand stores
│   │   ├── userStore.ts         # User auth state
│   │   ├── cartStore.ts         # Shopping cart state
│   │   ├── filterStore.ts       # Product filters state
│   │   └── uiStore.ts           # UI state (toasts, modals)
│   │
│   ├── api/                     # API integration
│   │   ├── queryClient.ts       # React Query setup
│   │   ├── client.ts            # Axios instance
│   │   └── hooks.ts             # Query/Mutation hooks
│   │
│   ├── schemas/                 # Zod validation schemas
│   │   └── index.ts             # All form schemas
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── api.ts              # API hooks (auto-generated)
│   │   └── useFormHandler.ts   # Form utilities
│   │
│   ├── animations/              # Framer Motion
│   │   ├── variants.ts          # Animation definitions
│   │   └── components.tsx       # Animation wrappers
│   │
│   └── providers.tsx            # App providers (React Query)
│
├── components/
│   ├── ui/                      # Radix UI components
│   │   ├── Modal.tsx
│   │   ├── AlertDialog.tsx
│   │   ├── DropdownMenu.tsx
│   │   └── ...
│   │
│   ├── forms/                   # Form components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── ...
│   │
│   ├── dashboard/               # Dashboard components
│   │   ├── DashboardCharts.tsx
│   │   ├── SalesAnalytics.tsx
│   │   └── ...
│   │
│   ├── vehicle/                 # Vehicle-related components
│   │   ├── VehicleGrid.tsx
│   │   ├── VehicleCard.tsx
│   │   └── ...
│   │
│   └── common/                  # Reusable components
│       ├── ToastContainer.tsx
│       ├── Header.tsx
│       └── ...
│
├── cypress/                     # E2E tests
│   ├── e2e/
│   │   ├── auth.cy.ts          # Authentication tests
│   │   ├── browsing.cy.ts      # Browsing tests
│   │   ├── checkout.cy.ts      # Checkout flow tests
│   │   └── ...
│   ├── support/
│   │   ├── commands.ts          # Custom Cypress commands
│   │   └── e2e.ts              # E2E setup
│   └── cypress.config.ts        # Cypress configuration
│
├── app/                         # Next.js app router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── login/page.tsx          # Login page
│   ├── dashboard/page.tsx      # Dashboard page
│   └── ...
│
├── .env.local                  # Local environment variables
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── cypress.config.ts           # Cypress config
```

---

## 🎯 How to Use Each System

### 1️⃣ **Zustand Stores** - State Management

**User Store Example:**
```tsx
import { useUserStore } from '@/lib/stores/userStore';

export function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logOut = useUserStore((state) => state.logOut);

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logOut}>Logout</button>
    </div>
  );
}
```

**Cart Store Example:**
```tsx
import { useCartStore } from '@/lib/stores/cartStore';

export function Cart() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div>
      <p>Items: {items.length}</p>
      <p>Total: €{total}</p>
    </div>
  );
}
```

### 2️⃣ **React Query** - Server State & Caching

**Setup in Layout:**
```tsx
import { Providers } from '@/lib/providers';

export default function Layout({ children }) {
  return (
    <Providers>
      {children}
    </Providers>
  );
}
```

**Using API Hooks:**
```tsx
import { useVehicles, useCreateVehicle } from '@/lib/hooks/api';

export function VehicleList() {
  const { data: vehicles, isLoading } = useVehicles({
    minPrice: 0,
    maxPrice: 100000,
  });

  const createVehicle = useCreateVehicle({
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return (
    <div>
      {vehicles?.map(v => <VehicleCard key={v.id} vehicle={v} />)}
    </div>
  );
}
```

### 3️⃣ **Zod + React Hook Form** - Form Validation

**Setup:**
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/lib/schemas';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### 4️⃣ **Framer Motion** - Animations

**Page Transition:**
```tsx
import { PageTransition } from '@/lib/animations/components';

export function Page() {
  return (
    <PageTransition>
      <h1>Welcome!</h1>
    </PageTransition>
  );
}
```

**Stagger Animation:**
```tsx
import { StaggerContainer, StaggerItem } from '@/lib/animations/components';

export function List() {
  return (
    <StaggerContainer>
      {items.map((item) => (
        <StaggerItem key={item.id}>
          <Card>{item.name}</Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

### 5️⃣ **Radix UI Components**

**Modal Example:**
```tsx
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

export function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Confirm Action"
        description="Are you sure?"
      >
        <p>Modal content here</p>
      </Modal>
    </>
  );
}
```

**Toast Notifications:**
```tsx
import { useUIStore } from '@/lib/stores/uiStore';

export function MyComponent() {
  const addToast = useUIStore((state) => state.addToast);

  const handleSuccess = () => {
    addToast('Operation successful!', 'success', 3000);
  };

  const handleError = () => {
    addToast('Something went wrong!', 'error', 3000);
  };

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </>
  );
}
```

### 6️⃣ **Cypress E2E Testing**

**Run Tests:**
```bash
# Open interactive test runner
npm run cypress:open

# Run headless tests
npm run cypress:run

# Run specific test
npm run cypress:run -- --spec cypress/e2e/auth.cy.ts
```

**Custom Commands:**
```tsx
// Login command
cy.login('admin@autoscout.dev', 'Admin123456');

// Add to cart
cy.addToCart('vehicle-123');

// Logout
cy.logout();
```

### 7️⃣ **Recharts** - Data Visualization

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function SalesChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#3b82f6" />
    </LineChart>
  );
}
```

---

## 🔗 API Configuration

**Environment Variables** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# For production:
# NEXT_PUBLIC_API_URL=https://api.autoscout24safetrade.com/api
```

**API Client** (`lib/api/client.ts`):
- Auto-includes auth token from localStorage
- Handles 401 unauthorized responses
- Interceptor for request/response

---

## 🧪 Component Examples Created

### 1. **LoginForm** (`components/forms/LoginForm.tsx`)
- React Hook Form integration
- Zod validation
- Loading state
- Error display
- Toast notifications

### 2. **VehicleGrid** (`components/vehicle/VehicleGrid.tsx`)
- React Query data fetching
- Zustand stores integration
- Framer Motion animations
- Add to cart functionality
- Wishlist button

### 3. **DashboardCharts** (`components/dashboard/DashboardCharts.tsx`)
- Recharts line & bar charts
- Stats cards
- Stagger animations
- Responsive design

### 4. **ToastContainer** (`components/common/ToastContainer.tsx`)
- Toast notifications system
- Success/Error/Info/Warning types
- Auto-dismiss
- Dismiss button

### 5. **UI Components**
- Modal dialog
- Alert dialog
- Dropdown menu
- All with Framer Motion animations

---

## 📝 NPM Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:ci": "cypress run --browser chrome --headless",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## 🔐 Best Practices

### 1. **Store Selectors**
```tsx
// ✅ Good - only re-renders when name changes
const name = useUserStore((state) => state.user?.name);

// ❌ Bad - re-renders on every store change
const { user } = useUserStore();
```

### 2. **Query Caching**
```tsx
// Queries are cached for 5 minutes by default
// Customize with queryOptions
useVehicles(params, {
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection
});
```

### 3. **Form Validation**
```tsx
// Validate on blur, not onChange (better UX)
useForm({
  resolver: zodResolver(schema),
  mode: 'onBlur', // or 'onTouched', 'onChange'
});
```

### 4. **Animation Performance**
```tsx
// ✅ Use will-change for animated elements
<motion.div style={{ willChange: 'opacity, transform' }}>

// ✅ Disable animations on mobile
<motion.div
  animate={{ x: isMobile ? 0 : 100 }}
>
```

---

## 🚀 Quick Start

### 1. **Setup Root Layout**
```tsx
// app/layout.tsx
import { Providers } from '@/lib/providers';
import { ToastContainer } from '@/components/common/ToastContainer';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
```

### 2. **Create a Page**
```tsx
// app/dashboard/page.tsx
'use client';

import { PageTransition } from '@/lib/animations/components';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { useUserStore } from '@/lib/stores/userStore';

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <DashboardCharts />
      </div>
    </PageTransition>
  );
}
```

### 3. **Test with Cypress**
```bash
npm run cypress:open
# Select auth.cy.ts
# Click "Run 1 spec"
```

---

## 📚 Documentation Links

- **Zustand:** https://github.com/pmndrs/zustand
- **React Query:** https://tanstack.com/query/latest
- **Zod:** https://zod.dev
- **React Hook Form:** https://react-hook-form.com
- **Framer Motion:** https://www.framer.com/motion
- **Recharts:** https://recharts.org
- **Radix UI:** https://www.radix-ui.com
- **Cypress:** https://docs.cypress.io

---

## ✅ Verification Checklist

- [x] All packages installed
- [x] Zustand stores created (user, cart, filter, ui)
- [x] React Query configured with QueryClient
- [x] Zod schemas for all forms created
- [x] Framer Motion animations setup
- [x] Radix UI components created (Modal, Alert, Dropdown)
- [x] React Hook Form integration
- [x] Example components built (LoginForm, VehicleGrid, Dashboard)
- [x] Cypress E2E tests configured
- [x] ToastContainer for notifications
- [x] API client with axios interceptors
- [x] Type-safe API hooks

---

## 🎨 Next Steps

1. **Create more page components** using PageTransition
2. **Add more form components** with validation
3. **Build dashboard pages** with DashboardCharts
4. **Write more Cypress tests** for all flows
5. **Optimize images** with Next.js Image component
6. **Add error boundaries** for better error handling
7. **Setup analytics** (Google Analytics, Hotjar)
8. **Deploy to Vercel** with environment variables

---

**Status:** ✅ Production Ready  
**Last Updated:** January 29, 2026

