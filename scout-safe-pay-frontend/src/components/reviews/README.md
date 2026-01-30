# Review Components Documentation

This directory contains the verified reviews system components for the AutoScout application.

## Components Overview

### 1. VerifiedBadge.tsx
A component to display a verified purchase badge for reviews.

**Props:**
- `verified` (boolean): Whether the review is verified
- `className` (string, optional): Additional CSS classes

**Features:**
- Green checkmark icon from lucide-react
- Only displays when `verified` is true
- Tooltip text: "Review from confirmed buyer"
- Uses shadcn/ui Badge component with success variant

**Usage:**
```tsx
import { VerifiedBadge } from '@/components/reviews';

<VerifiedBadge verified={review.verified} />
```

---

### 2. ReviewCard.tsx
A card component to display individual reviews with all associated data and actions.

**Props:**
- `review` (Review): The review object
- `onVote` (function, optional): Callback for helpful/not helpful votes
  - Parameters: `(reviewId: number, isHelpful: boolean) => void`
- `onFlag` (function, optional): Callback for flagging reviews
  - Parameters: `(reviewId: number, reason: string, details?: string) => void`

**Features:**
- Displays reviewer avatar, name, and verified badge
- 5-star rating display (filled/empty stars)
- Review comment with truncation (200 chars) and "Read more" button
- Helpful/Not helpful vote buttons with counts
- Flag dropdown menu with predefined reasons:
  - Spam
  - Inappropriate
  - Fake Review
  - Offensive Content
  - Misleading Information
  - Other
- Relative date display (e.g., "2 days ago") using date-fns
- Vehicle info badge (if available)
- Fully responsive design

**Usage:**
```tsx
import { ReviewCard } from '@/components/reviews';

<ReviewCard
  review={review}
  onVote={(reviewId, isHelpful) => handleVote(reviewId, isHelpful)}
  onFlag={(reviewId, reason, details) => handleFlag(reviewId, reason, details)}
/>
```

---

### 3. ReviewList.tsx
A comprehensive list component with filtering, sorting, and pagination.

**Props:**
- `vehicleId` (number, optional): Filter reviews by vehicle
- `userId` (number, optional): Filter reviews by user
- `reviewType` ('vehicle' | 'user', default: 'vehicle'): Type of reviews to display

**Features:**
- Two tabs: "All Reviews" and "Verified Only"
- Sort dropdown with options:
  - Most Recent (created_at)
  - Most Helpful (helpful)
  - Highest Rated (rating)
- Pagination with "Load More" button
- Empty state with icon and message
- Loading states with spinner
- Error handling with retry button
- Automatic vote count updates
- Flag submission with success/error messages
- Responsive design

**Usage:**
```tsx
import { ReviewList } from '@/components/reviews';

// For vehicle reviews
<ReviewList vehicleId={123} reviewType="vehicle" />

// For user reviews
<ReviewList userId={456} reviewType="user" />
```

---

### 4. ReviewForm.tsx
A form component for submitting new reviews.

**Props:**
- `transactionId` (number): Associated transaction ID
- `revieweeId` (number): ID of the user being reviewed
- `reviewType` ('buyer' | 'seller' | 'vehicle'): Type of review
- `onSuccess` (function, optional): Callback after successful submission

**Features:**
- Interactive 5-star rating picker with hover effects
- Textarea for review comment (20-1000 characters)
- Real-time character counter with validation
- Submit button with loading state
- Success animation and auto-reset
- Comprehensive error handling
- Form validation before submission
- Responsive layout

**Usage:**
```tsx
import { ReviewForm } from '@/components/reviews';

<ReviewForm
  transactionId={789}
  revieweeId={456}
  reviewType="seller"
  onSuccess={() => {
    console.log('Review submitted!');
    refreshReviews();
  }}
/>
```

---

### 5. ReviewStats.tsx
A statistics component showing aggregated review data.

**Props:**
- `stats` (ReviewStats): Statistics object containing:
  - `average_rating` (number): Average rating score
  - `total_reviews` (number): Total number of reviews
  - `verified_count` (number, optional): Number of verified reviews
  - `rating_breakdown` (object): Count of reviews per star rating (1-5)

**Features:**
- Large average rating display with stars
- Total review count
- Verified reviews count with badge
- Visual rating distribution bars (5★ to 1★)
- Percentage and count for each rating level
- Additional statistics:
  - Percentage of verified reviews
  - Percentage of 4+ star reviews
- Responsive grid layout

**Usage:**
```tsx
import { ReviewStats } from '@/components/reviews';

const stats = {
  average_rating: 4.5,
  total_reviews: 127,
  verified_count: 95,
  rating_breakdown: {
    '5': 80,
    '4': 30,
    '3': 10,
    '2': 5,
    '1': 2
  }
};

<ReviewStats stats={stats} />
```

---

## Type Definitions

All components use types from `@/types/review.ts`:

```typescript
interface Review {
  id: number;
  transaction_id: number;
  reviewer_id: number;
  reviewee_id: number;
  vehicle_id: number | null;
  rating: number;
  comment: string | null;
  review_type: 'buyer' | 'seller' | 'vehicle';
  verified: boolean;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  reviewer?: ReviewUser;
  reviewee?: ReviewUser;
  vehicle?: ReviewVehicle;
  // ... other fields
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  verified_count?: number;
  rating_breakdown: {
    [key: string]: number;
  };
}
```

---

## API Integration

All components use the `reviewService` from `@/lib/api/reviews.ts`:

### Available Methods:
- `getReviews(filters)` - Get filtered list of reviews
- `getVehicleReviews(vehicleId)` - Get reviews for a vehicle
- `getUserReviews(userId)` - Get reviews for a user
- `submitReview(data)` - Submit a new review
- `voteReview(reviewId, isHelpful)` - Vote on review helpfulness
- `flagReview(reviewId, reason, details)` - Flag inappropriate review

---

## Styling

All components use:
- **Tailwind CSS** for styling
- **lucide-react** for icons
- **shadcn/ui** components (Button, Card, Badge, Avatar, etc.)
- Consistent color scheme:
  - Primary: blue tones
  - Success: green tones (verified)
  - Warning: yellow tones (ratings)
  - Error: red tones

---

## Dependencies

Required packages (already installed):
- `react`
- `lucide-react` - Icons
- `date-fns` - Date formatting
- `@radix-ui/*` - UI primitives

---

## Best Practices

1. **Always handle errors gracefully** - All API calls have try/catch blocks
2. **Provide user feedback** - Loading states, success messages, error messages
3. **Optimize performance** - Components only re-render when necessary
4. **Accessibility** - Proper ARIA labels, keyboard navigation
5. **Mobile-first** - Responsive design with mobile considerations
6. **Type safety** - Full TypeScript support with proper interfaces

---

## Example Usage - Complete Review System

```tsx
'use client';

import { ReviewStats, ReviewList, ReviewForm } from '@/components/reviews';
import { useState } from 'react';

export default function VehicleReviewsPage({ vehicleId, transactionId, sellerId }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const stats = {
    average_rating: 4.7,
    total_reviews: 89,
    verified_count: 72,
    rating_breakdown: {
      '5': 60,
      '4': 20,
      '3': 5,
      '2': 3,
      '1': 1
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vehicle Reviews</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Sidebar */}
        <div className="lg:col-span-1">
          <ReviewStats stats={stats} />
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          <ReviewList 
            key={refreshKey}
            vehicleId={vehicleId} 
            reviewType="vehicle" 
          />
        </div>
      </div>

      {/* Review Form (for buyers after purchase) */}
      {transactionId && (
        <div className="mt-12">
          <ReviewForm
            transactionId={transactionId}
            revieweeId={sellerId}
            reviewType="vehicle"
            onSuccess={() => setRefreshKey(prev => prev + 1)}
          />
        </div>
      )}
    </div>
  );
}
```

---

## Testing

To test the components:

1. **VerifiedBadge**: Test with `verified={true}` and `verified={false}`
2. **ReviewCard**: Test with various review data, long comments, different ratings
3. **ReviewList**: Test with different filters, empty states, pagination
4. **ReviewForm**: Test validation, submission, error handling
5. **ReviewStats**: Test with various rating distributions

---

## Future Enhancements

Potential improvements:
- Image uploads in reviews
- Review replies/responses
- Review editing
- Advanced filtering (date range, rating range)
- Export reviews functionality
- Review analytics dashboard
- Sentiment analysis integration
