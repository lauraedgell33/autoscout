# 🎨 Frontend Implementation Guide - Step by Step

**Quick Start:** Follow these steps to integrate the new architecture into your existing pages

---

## 📍 Step 1: Update Root Layout

**File:** `app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import { ToastContainer } from '@/components/common/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoScout24 SafeTrade',
  description: 'Secure vehicle marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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

---

## 📍 Step 2: Implement Login Page

**File:** `app/login/page.tsx`

```tsx
'use client';

import { LoginForm } from '@/components/forms/LoginForm';
import { PageTransition } from '@/lib/animations/components';
import { useUserStore } from '@/lib/stores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
          <LoginForm />
        </div>
      </div>
    </PageTransition>
  );
}
```

---

## 📍 Step 3: Create Browse/Listing Page

**File:** `app/browse/page.tsx`

```tsx
'use client';

import { VehicleGrid } from '@/components/vehicle/VehicleGrid';
import { PageTransition } from '@/lib/animations/components';
import { useFilterStore } from '@/lib/stores/filterStore';

export default function BrowsePage() {
  const filters = useFilterStore((state) => state.filters);
  const setFilters = useFilterStore((state) => state.setFilters);
  const resetFilters = useFilterStore((state) => state.resetFilters);

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Vehicles</h1>
          <p className="text-gray-600">
            {filters.brands.length > 0 && `Filtered by: ${filters.brands.join(', ')}`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <input
            type="range"
            min="0"
            max="150000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ priceRange: [0, parseInt(e.target.value)] })}
            className="w-full md:w-48"
            placeholder="Max Price"
          />
          {filters.brands.length > 0 && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Vehicle Grid */}
        <VehicleGrid />
      </div>
    </PageTransition>
  );
}
```

---

## 📍 Step 4: Create Dashboard Page

**File:** `app/dashboard/page.tsx`

```tsx
'use client';

import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { PageTransition } from '@/lib/animations/components';
import { useUserStore } from '@/lib/stores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Here's your sales overview</p>
        </div>

        {/* Charts */}
        <DashboardCharts />
      </div>
    </PageTransition>
  );
}
```

---

## 📍 Step 5: Cart Page

**File:** `app/cart/page.tsx`

```tsx
'use client';

import { PageTransition, StaggerContainer, StaggerItem } from '@/lib/animations/components';
import { useCartStore } from '@/lib/stores/cartStore';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.getTotal());
  const router = useRouter();

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <StaggerContainer>
            {/* Items */}
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <StaggerItem key={item.vehicleId}>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.vehicleName}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.vehicleName}</h3>
                      <p className="text-gray-600">€{item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">€{(item.price * item.quantity).toLocaleString()}</p>
                      <button
                        onClick={() => removeItem(item.vehicleId)}
                        className="mt-2 text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-sm ml-auto">
              <div className="flex justify-between mb-4">
                <span>Subtotal:</span>
                <span>€{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Shipping:</span>
                <span>€0.00</span>
              </div>
              <div className="border-t pt-4 mb-6 flex justify-between font-bold">
                <span>Total:</span>
                <span>€{total.toLocaleString()}</span>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
```

---

## 📍 Step 6: Checkout Page

**File:** `app/checkout/page.tsx`

```tsx
'use client';

import { PageTransition } from '@/lib/animations/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutSchema } from '@/lib/schemas';
import { useCartStore } from '@/lib/stores/cartStore';
import { useCreateOrder } from '@/lib/hooks/api';
import { useUIStore } from '@/lib/stores/uiStore';
import { useState } from 'react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useCreateOrder();
  const addToast = useUIStore((state) => state.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CheckoutSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await createOrder.mutateAsync({
        items: items.map((i) => ({ vehicleId: i.vehicleId, quantity: i.quantity })),
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
      });
      addToast('Order placed successfully!', 'success');
      clearCart();
      setStep(4); // Confirmation
    } catch (error) {
      addToast('Failed to place order', 'error');
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Bar */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
              <input
                {...register('shippingAddress.fullName')}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors?.shippingAddress?.fullName && (
                <span className="text-red-600 text-sm">
                  {errors.shippingAddress.fullName.message}
                </span>
              )}
              {/* Add more address fields similarly */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-2 rounded-md"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div>
                <label>
                  <input type="radio" value="card" {...register('paymentMethod')} />
                  Credit Card
                </label>
              </div>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full bg-blue-600 text-white py-2 rounded-md"
              >
                Review Order
              </button>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Review Order</h2>
              {items.map((item) => (
                <div key={item.vehicleId} className="flex justify-between py-2 border-b">
                  <span>{item.vehicleName}</span>
                  <span>€{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <button
                type="submit"
                disabled={createOrder.isPending}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
            </div>
          )}
        </form>
      </div>
    </PageTransition>
  );
}
```

---

## 🧪 Testing Your Implementation

### 1. Test Login Flow
```bash
npm run cypress:open
# Select cypress/e2e/auth.cy.ts
# Click "Run"
```

### 2. Test Browsing
```bash
npm run cypress:open
# Select cypress/e2e/browsing.cy.ts
# Click "Run"
```

### 3. Test Checkout
```bash
npm run cypress:open
# Select cypress/e2e/checkout.cy.ts
# Click "Run"
```

---

## 🎨 Customization Examples

### **Change Toast Duration**
```tsx
addToast('Success!', 'success', 5000); // 5 seconds
```

### **Add Loading State**
```tsx
import { motion } from 'framer-motion';
import { pulse } from '@/lib/animations/variants';

<motion.div variants={pulse} animate="animate">
  Loading...
</motion.div>
```

### **Custom API Request**
```tsx
import { apiClient } from '@/lib/api/client';

const response = await apiClient.post('/custom-endpoint', data);
```

### **Use Store Selector**
```tsx
// Only re-render when name changes
const userName = useUserStore((state) => state.user?.name);
```

---

## ⚡ Performance Tips

### 1. **Avoid Rerenders**
```tsx
// ✅ Good - only when this specific value changes
const name = useUserStore((state) => state.user?.name);

// ❌ Bad - rerenders on any store change
const { user } = useUserStore();
```

### 2. **Use Suspense for Loading**
```tsx
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 3. **Prefetch Data**
```tsx
// Prefetch before navigating
queryClient.prefetchQuery({
  queryKey: ['vehicle', id],
  queryFn: () => getVehicle(id),
});
```

---

## 🐛 Common Issues & Solutions

### **Issue:** Form not validating
**Solution:** Ensure resolver is set: `resolver: zodResolver(schema)`

### **Issue:** Animations not smooth
**Solution:** Check `will-change` CSS property on animated elements

### **Issue:** Store not persisting
**Solution:** Verify localStorage is enabled in browser

### **Issue:** API calls failing
**Solution:** Check `NEXT_PUBLIC_API_URL` in `.env.local`

---

## 📊 Integration Checklist

- [ ] Step 1: Update root layout with Providers
- [ ] Step 2: Create login page
- [ ] Step 3: Create browse page
- [ ] Step 4: Create dashboard page
- [ ] Step 5: Create cart page
- [ ] Step 6: Create checkout page
- [ ] Step 7: Run Cypress tests
- [ ] Step 8: Deploy to Vercel

---

## 🚀 Next Steps After Integration

1. **Style Components** - Customize Tailwind styles
2. **Connect Real API** - Update endpoint URLs
3. **Add More Features** - Payment processing, notifications
4. **Performance** - Code splitting, image optimization
5. **Analytics** - Google Analytics, Hotjar
6. **Monitoring** - Sentry error tracking

---

**Ready to implement?** Start with Step 1 (Root Layout) and work your way down! 🎉

