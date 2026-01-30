// Example Admin Review Moderation Page
// Location: src/app/admin/reviews/page.tsx (or similar)

'use client';

import { useState } from 'react';
import ReviewModerationQueue from '@/components/admin/ReviewModerationQueue';
import FlaggedReviewsPanel from '@/components/admin/FlaggedReviewsPanel';

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'flagged'>('pending');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Review Moderation</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Reviews
          </button>
          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'flagged'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Flagged Reviews
          </button>
        </nav>
      </div>

      {/* Component Display */}
      <div className="space-y-6">
        {activeTab === 'pending' && <ReviewModerationQueue initialPage={1} />}
        {activeTab === 'flagged' && <FlaggedReviewsPanel initialPage={1} />}
      </div>
    </div>
  );
}

// ================================================================
// Alternative: Side-by-Side Layout
// ================================================================

export function AdminReviewsPageSideBySide() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Review Moderation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ReviewModerationQueue initialPage={1} />
        </div>
        <div>
          <FlaggedReviewsPanel initialPage={1} />
        </div>
      </div>
    </div>
  );
}

// ================================================================
// Alternative: Standalone Pages
// ================================================================

// Page 1: src/app/admin/reviews/pending/page.tsx
export function AdminPendingReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pending Reviews</h1>
      <ReviewModerationQueue initialPage={1} />
    </div>
  );
}

// Page 2: src/app/admin/reviews/flagged/page.tsx
export function AdminFlaggedReviewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Flagged Reviews</h1>
      <FlaggedReviewsPanel initialPage={1} />
    </div>
  );
}
