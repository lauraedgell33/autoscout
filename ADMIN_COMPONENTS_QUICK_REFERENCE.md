# Admin Review Components - Quick Reference

## 🚀 Quick Start

### Import and Use
```tsx
import ReviewModerationQueue from '@/components/admin/ReviewModerationQueue';
import FlaggedReviewsPanel from '@/components/admin/FlaggedReviewsPanel';

<ReviewModerationQueue initialPage={1} />
<FlaggedReviewsPanel initialPage={1} />
```

## 📁 File Locations

```
scout-safe-pay-frontend/src/components/admin/
├── ReviewModerationQueue.tsx    ← Pending reviews moderation
├── FlaggedReviewsPanel.tsx      ← Flagged reviews management
├── README.md                    ← Full documentation
└── EXAMPLE_USAGE.tsx            ← Integration examples
```

## 🎯 Component Features

### ReviewModerationQueue
- **Purpose**: Moderate pending reviews
- **Actions**: Verify (green) | Reject (red)
- **Features**: Notes, pagination, empty state
- **API**: getPendingReviews(), verifyReview(), rejectReview()

### FlaggedReviewsPanel
- **Purpose**: Manage flagged reviews
- **Actions**: Keep (green) | Remove (red)
- **Features**: Flag details, expandable, pagination
- **API**: getFlaggedReviews(), verifyReview(), rejectReview()

## 🔑 Props

Both components accept:
```typescript
{
  initialPage?: number;  // Default: 1
}
```

## 🎨 UI Components Used

- Button (success, danger, outline variants)
- Card, CardContent, CardHeader, CardTitle
- Badge (info, warning, success)
- Modal (confirmation dialogs)
- Textarea (notes/reasons)

## 📦 Icons (lucide-react)

```typescript
CheckCircle    // Verify/Keep
XCircle        // Reject/Remove
AlertTriangle  // Warning
Flag           // Flags
User           // User info
Calendar       // Dates
Star           // Ratings
Loader2        // Loading
ChevronLeft/Right  // Pagination
ChevronUp/Down     // Expand/collapse
```

## 🔌 API Endpoints Required

```
GET  /api/admin/reviews/pending
GET  /api/admin/reviews/flagged
POST /api/admin/reviews/{id}/verify
POST /api/admin/reviews/{id}/reject
```

## 📊 Data Flow

1. Component loads → API request
2. User action → Optimistic UI update
3. API call → Success/Error
4. Toast notification → State refresh

## 🎯 Example Implementation

### Tabbed Layout
```tsx
'use client';
import { useState } from 'react';

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<'pending' | 'flagged'>('pending');
  
  return (
    <div>
      <h1>Review Moderation</h1>
      <nav>
        <button onClick={() => setTab('pending')}>Pending</button>
        <button onClick={() => setTab('flagged')}>Flagged</button>
      </nav>
      {tab === 'pending' && <ReviewModerationQueue />}
      {tab === 'flagged' && <FlaggedReviewsPanel />}
    </div>
  );
}
```

### Side-by-Side Layout
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ReviewModerationQueue />
  <FlaggedReviewsPanel />
</div>
```

## 🧪 Testing Checklist

**Basic**
- [ ] Components render
- [ ] Actions work (verify, reject, keep, remove)
- [ ] Pagination works
- [ ] Empty states show
- [ ] Loading states show

**Advanced**
- [ ] Modals open/close
- [ ] Toast notifications appear
- [ ] Optimistic updates work
- [ ] Error handling works
- [ ] Mobile responsive

## 🐛 Troubleshooting

**No reviews showing?**
→ Check API endpoints are accessible

**Actions not working?**
→ Verify admin authentication token

**Toast not appearing?**
→ Check useUIStore is configured

**Modal not closing?**
→ State may not be resetting

## 📚 Documentation

- **README.md** - Full component docs
- **EXAMPLE_USAGE.tsx** - Integration examples
- **ADMIN_REVIEW_COMPONENTS_SUMMARY.md** - Complete guide
- **COMPONENT_DELIVERY_REPORT.md** - Delivery checklist

## 🔒 Security Notes

- Components assume authenticated admin user
- Backend must verify admin role
- Input validation on backend required
- CSRF protection recommended

## ⚡ Performance

- Pagination: 10 items per page
- Optimistic updates for speed
- Loading states prevent double-submission
- Efficient re-renders with proper state management

## 📱 Responsive Design

- Mobile-first approach
- Touch-friendly buttons (44x44px min)
- Flexible layouts
- Works on all screen sizes

## 🎨 Styling

**Colors**:
- Green: Success actions (verify, keep)
- Red: Destructive actions (reject, remove)
- Orange: Warnings (flagged content)
- Gray: Neutral interface

**Patterns**:
- Tailwind CSS utilities
- Consistent spacing (gap-2, gap-4)
- Rounded corners (rounded-lg)
- Hover states on interactive elements

## 🚀 Ready to Use

All components are production-ready with:
✅ TypeScript types
✅ Error handling
✅ Loading states
✅ Empty states
✅ Responsive design
✅ Accessibility
✅ Documentation

---

**Need Help?** Check the README.md or ADMIN_REVIEW_COMPONENTS_SUMMARY.md
