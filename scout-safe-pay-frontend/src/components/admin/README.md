# Admin Review Moderation Components

This directory contains admin components for review moderation in the ScoutSafePay frontend application.

## Components

### 1. ReviewModerationQueue.tsx

A component for moderating pending reviews in the admin panel.

**Features:**
- Lists all pending reviews awaiting moderation
- Displays user information, rating, comment preview, and submission date
- Optional moderation notes field for internal documentation
- Two action buttons:
  - **Verify** (green) - Approves the review and marks it as verified
  - **Reject** (red) - Opens a modal to provide rejection reason and rejects the review
- Real-time optimistic UI updates after actions
- Pagination support for large datasets
- Loading states with spinners
- Empty state when no pending reviews
- Fully responsive design

**Props:**
```typescript
interface ReviewModerationQueueProps {
  initialPage?: number; // Optional starting page, defaults to 1
}
```

**Usage:**
```tsx
import ReviewModerationQueue from '@/components/admin/ReviewModerationQueue';

export default function AdminReviewsPage() {
  return (
    <div>
      <ReviewModerationQueue initialPage={1} />
    </div>
  );
}
```

**API Endpoints Used:**
- `GET /api/admin/reviews/pending` - Fetch pending reviews
- `POST /api/admin/reviews/{id}/verify` - Verify a review
- `POST /api/admin/reviews/{id}/reject` - Reject a review

---

### 2. FlaggedReviewsPanel.tsx

A component for reviewing and managing flagged reviews.

**Features:**
- Lists all reviews that have been flagged by users
- Shows flag count badge and breakdown of flag reasons
- Displays full review content with context
- Expandable sections to view all flag details (who flagged, reasons, details)
- Flag reason summary (e.g., "2x spam, 1x inappropriate")
- Two action buttons:
  - **Keep Review** (green) - Dismisses all flags and keeps the review
  - **Remove Review** (red) - Opens confirmation modal and removes the review
- Real-time optimistic UI updates after actions
- Pagination support
- Loading states
- Empty state when no flagged reviews
- Fully responsive design

**Props:**
```typescript
interface FlaggedReviewsPanelProps {
  initialPage?: number; // Optional starting page, defaults to 1
}
```

**Usage:**
```tsx
import FlaggedReviewsPanel from '@/components/admin/FlaggedReviewsPanel';

export default function AdminFlaggedReviewsPage() {
  return (
    <div>
      <FlaggedReviewsPanel initialPage={1} />
    </div>
  );
}
```

**API Endpoints Used:**
- `GET /api/admin/reviews/flagged` - Fetch flagged reviews
- `POST /api/admin/reviews/{id}/verify` - Keep review (dismisses flags)
- `POST /api/admin/reviews/{id}/reject` - Remove review

---

## Common Features

Both components share these features:

### UI Components Used
- **Button** - For action buttons with variants (success, danger, outline)
- **Card** - Container for the main component
- **Badge** - Status indicators (flag count, pending count, etc.)
- **Modal** - Rejection reason dialog
- **Textarea** - For notes and rejection reasons
- **Loading states** - Using Loader2 from lucide-react

### Icons (lucide-react)
- `CheckCircle` - Verify/Keep actions
- `XCircle` - Reject/Remove actions
- `AlertTriangle` - Flagged review indicator
- `Flag` - Flag icons
- `User` - User information
- `Calendar` - Date information
- `Star` - Rating display
- `Loader2` - Loading states
- `ChevronLeft/Right` - Pagination
- `ChevronUp/Down` - Expandable sections

### State Management
- Uses Zustand's `useUIStore` for toast notifications
- Local state for pagination, loading, and UI interactions
- Optimistic UI updates for immediate feedback

### Error Handling
- Toast notifications for success/error states
- Proper error messages from API
- Graceful degradation on failures

### Accessibility
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management in modals

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Flexible layouts that adapt to screen sizes
- Touch-friendly buttons and interactions

---

## File Structure

```
src/
├── components/
│   └── admin/
│       ├── ReviewModerationQueue.tsx
│       ├── FlaggedReviewsPanel.tsx
│       └── PaymentConfirmationPanel.tsx
├── lib/
│   ├── api/
│   │   └── reviews.ts               # API service functions
│   └── stores/
│       └── uiStore.ts                # Toast notifications store
└── types/
    └── review.ts                     # TypeScript interfaces
```

---

## TypeScript Interfaces

### Review
```typescript
interface Review {
  id: number;
  transaction_id: number;
  reviewer_id: number;
  reviewee_id: number;
  vehicle_id: number | null;
  rating: number; // 1-5
  comment: string | null;
  review_type: 'buyer' | 'seller' | 'vehicle';
  status: string;
  verified: boolean;
  verified_at: string | null;
  verification_method: 'transaction' | 'manual' | 'automated' | 'none';
  moderation_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderation_notes: string | null;
  moderated_by: number | null;
  moderated_at: string | null;
  flagged: boolean;
  flag_count: number;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;
  reviewer?: ReviewUser;
  reviewee?: ReviewUser;
  vehicle?: ReviewVehicle;
  transaction?: ReviewTransaction;
  moderator?: ReviewUser;
  flags?: ReviewFlag[];
}
```

### ReviewFlag
```typescript
interface ReviewFlag {
  id: number;
  review_id: number;
  user_id: number;
  reason: 'spam' | 'inappropriate' | 'fake' | 'offensive' | 'misleading' | 'other';
  details: string | null;
  created_at: string;
  user?: ReviewUser;
}
```

---

## Styling

Both components use Tailwind CSS with the following color schemes:

### ReviewModerationQueue
- **Primary**: Gray tones for neutral moderation interface
- **Success**: Green for verification actions
- **Danger**: Red for rejection actions
- **Borders**: Gray-200/300 for subtle separation

### FlaggedReviewsPanel
- **Warning**: Orange tones to indicate flagged content
- **Borders**: Orange-200/300 for flagged reviews
- **Background**: Orange-50/30 for flagged review cards
- **Success**: Green for keep actions
- **Danger**: Red for remove actions

---

## Best Practices

1. **Optimistic Updates**: Both components update the UI immediately when actions are performed, improving perceived performance
2. **Error Recovery**: If an action fails, the UI reverts and shows an error toast
3. **Pagination**: Large datasets are paginated to improve performance
4. **Loading States**: Clear loading indicators prevent user confusion
5. **Confirmation Modals**: Destructive actions (reject/remove) require confirmation
6. **Accessibility**: Proper ARIA labels and semantic HTML
7. **Responsive**: Works on all screen sizes

---

## Testing Recommendations

### Unit Tests
- Test component rendering
- Test pagination logic
- Test action handlers (verify, reject, keep, remove)
- Test empty states
- Test loading states

### Integration Tests
- Test API calls and responses
- Test toast notifications
- Test modal interactions
- Test optimistic UI updates

### E2E Tests
- Test full moderation workflow
- Test pagination navigation
- Test error handling
- Test flag details expansion

---

## Future Enhancements

Potential improvements for these components:

1. **Bulk Actions**: Select multiple reviews and perform actions in bulk
2. **Filters**: Filter by rating, date range, review type, flag reason
3. **Search**: Search reviews by content or user
4. **Export**: Export flagged reviews or moderation history
5. **Notes History**: View history of moderation notes
6. **Auto-moderation**: Configure rules for automatic approval/rejection
7. **Flag Analytics**: Dashboard showing flag trends and statistics
8. **Review Preview**: Quick preview modal instead of expanding inline

---

## Dependencies

### Required NPM Packages
- `react` - Core React library
- `next` - Next.js framework
- `lucide-react` - Icon library
- `zustand` - State management (for toast store)
- `@radix-ui/react-dialog` - Modal component (used by Modal.tsx)
- `framer-motion` - Animation library (used by Modal.tsx)

### Internal Dependencies
- `@/components/ui/*` - UI component library
- `@/lib/api/reviews` - Review API service
- `@/lib/stores/uiStore` - UI state store
- `@/types/review` - TypeScript type definitions

---

## Troubleshooting

### Common Issues

**Issue**: Toast notifications not appearing
- **Solution**: Ensure `useUIStore` is properly configured and the toast provider is set up in the app layout

**Issue**: API calls failing with 401 Unauthorized
- **Solution**: Verify admin authentication token is properly set in localStorage

**Issue**: Pagination not working
- **Solution**: Check that the backend API returns proper pagination metadata (current_page, last_page, total)

**Issue**: Modal not closing after action
- **Solution**: Ensure the modal state is properly reset after successful API calls

**Issue**: Optimistic updates causing UI glitches
- **Solution**: Make sure the review ID is correctly used for filtering the local state

---

## Support

For issues or questions about these components:
1. Check the component code and inline comments
2. Review the API service functions in `@/lib/api/reviews.ts`
3. Verify the review types in `@/types/review.ts`
4. Check the backend API documentation for endpoint specifications

---

## License

Part of the ScoutSafePay application.
