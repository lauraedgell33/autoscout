# Quick Integration Guide - Verified Reviews System

## How to Integrate Components into Pages

### 1. Vehicle Detail Page Integration

**File:** `src/app/[locale]/vehicles/[id]/page.tsx`

```tsx
import { ReviewStats, ReviewList, ReviewForm } from '@/components/reviews';
import { reviewService } from '@/lib/api/reviews';

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicleId = parseInt(params.id);
  
  // Fetch vehicle and review data
  const vehicle = await getVehicle(vehicleId);
  const { reviews, average_rating, verified_count } = await reviewService.getVehicleReviews(vehicleId);
  
  const stats = {
    average_rating,
    total_reviews: reviews.total,
    verified_count,
    rating_breakdown: {}, // Calculate from reviews.data
  };

  return (
    <div>
      {/* Existing vehicle details */}
      
      {/* Add Review Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        {/* Review Statistics */}
        <ReviewStats stats={stats} />
        
        {/* Review List */}
        <div className="mt-8">
          <ReviewList 
            vehicleId={vehicleId} 
            reviewType="vehicle"
            initialReviews={reviews.data}
          />
        </div>
      </section>
    </div>
  );
}
```

### 2. Dealer Profile Page Integration

**File:** `src/app/[locale]/dealer/[id]/page.tsx`

```tsx
import { ReviewStats, ReviewList } from '@/components/reviews';
import { reviewService } from '@/lib/api/reviews';

export default async function DealerPage({ params }: { params: { id: string } }) {
  const dealerId = parseInt(params.id);
  
  // Fetch dealer and reviews
  const dealer = await getDealer(dealerId);
  const { reviews, stats } = await reviewService.getUserReviews(dealerId);

  return (
    <div>
      {/* Dealer info */}
      <div className="flex items-center gap-4">
        <h1>{dealer.name}</h1>
        {stats.average_rating > 0 && (
          <span className="text-sm">
            ⭐ {stats.average_rating.toFixed(1)} ({stats.total_reviews} reviews)
          </span>
        )}
      </div>
      
      {/* Review Section */}
      <section className="mt-8">
        <ReviewStats stats={stats} />
        <div className="mt-6">
          <ReviewList 
            userId={dealerId} 
            reviewType="seller"
            initialReviews={reviews.data}
          />
        </div>
      </section>
    </div>
  );
}
```

### 3. Buyer Purchases Page Integration

**File:** `src/app/[locale]/buyer/purchases/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { ReviewForm } from '@/components/reviews';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export default function PurchasesPage() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const handleLeaveReview = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReviewForm(true);
  };

  return (
    <div>
      <h1>My Purchases</h1>
      
      {/* Transaction list */}
      {transactions.map(transaction => (
        <div key={transaction.id} className="card">
          {/* Transaction details */}
          
          {transaction.status === 'completed' && !transaction.has_review && (
            <Button 
              onClick={() => handleLeaveReview(transaction)}
              className="mt-4"
            >
              Leave a Review
            </Button>
          )}
        </div>
      ))}
      
      {/* Review Form Dialog */}
      {showReviewForm && selectedTransaction && (
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <ReviewForm
            transactionId={selectedTransaction.id}
            revieweeId={selectedTransaction.seller_id}
            reviewType="seller"
            onSuccess={() => {
              setShowReviewForm(false);
              // Refresh transactions
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
```

### 4. Admin Reviews Page

**File:** `src/app/[locale]/admin/reviews/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { ReviewModerationQueue, FlaggedReviewsPanel } from '@/components/admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { reviewService } from '@/lib/api/reviews';

export default function AdminReviewsPage() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    loadStatistics();
  }, []);
  
  const loadStatistics = async () => {
    const data = await reviewService.getStatistics();
    setStats(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>
      
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Pending Reviews</div>
            <div className="text-2xl font-bold">{stats.pending_reviews}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Flagged Reviews</div>
            <div className="text-2xl font-bold text-red-600">{stats.flagged_reviews}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Verification Rate</div>
            <div className="text-2xl font-bold text-green-600">{stats.verification_rate}%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Auto-Verified</div>
            <div className="text-2xl font-bold">{stats.auto_verification_rate}%</div>
          </Card>
        </div>
      )}
      
      {/* Moderation Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({stats?.pending_reviews || 0})
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({stats?.flagged_reviews || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <ReviewModerationQueue onUpdate={loadStatistics} />
        </TabsContent>
        
        <TabsContent value="flagged">
          <FlaggedReviewsPanel onUpdate={loadStatistics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 5. Navigation Menu Update

Add link to admin reviews in admin navigation:

```tsx
// src/components/Navigation.tsx or admin navigation component

{user?.role === 'admin' && (
  <Link href="/admin/reviews">
    <Flag className="w-4 h-4 mr-2" />
    Reviews Moderation
    {pendingCount > 0 && (
      <Badge variant="destructive" className="ml-2">
        {pendingCount}
      </Badge>
    )}
  </Link>
)}
```

---

## Quick Setup Checklist

### Backend Setup
1. ✅ Run migrations:
   ```bash
   cd scout-safe-pay-backend
   php artisan migrate
   ```

2. ✅ Verify API routes are working:
   ```bash
   php artisan route:list | grep review
   ```

### Frontend Setup
1. ✅ Components are already created in:
   - `src/components/reviews/`
   - `src/components/admin/`

2. ✅ Types are available in:
   - `src/types/review.ts`

3. ✅ API service ready:
   - `src/lib/api/reviews.ts`

### Integration Steps
1. **Copy integration code** from examples above
2. **Import components** into your pages
3. **Fetch data** using reviewService
4. **Pass data** to components as props
5. **Test the flow**: Submit → Auto-verify → Display

---

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Testing the Integration

### Manual Test Flow
1. **User Journey:**
   - Complete a transaction
   - Leave a review (should auto-verify if transaction is completed)
   - See verified badge appear

2. **Admin Journey:**
   - Go to `/admin/reviews`
   - See pending reviews
   - Verify or reject reviews
   - Check flagged reviews

3. **Public Journey:**
   - View vehicle page
   - See reviews with verified badges
   - Vote helpful/not helpful
   - Flag inappropriate reviews

---

## Need Help?

Check the documentation files:
- `/scout-safe-pay-frontend/src/components/reviews/README.md`
- `/scout-safe-pay-frontend/src/components/reviews/examples.ts`
- `/scout-safe-pay-frontend/src/components/admin/README.md`
- `/scout-safe-pay-frontend/src/components/admin/EXAMPLE_USAGE.tsx`

All components are fully documented with TypeScript types and usage examples!
