'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, Inbox } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { Review, ReviewFilters } from '@/types/review';
import { reviewService } from '@/lib/api/reviews';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger, Tabs as TabsContainer } from '@/components/ui/tabs';
import EmptyState from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ReviewListProps {
  vehicleId?: number;
  userId?: number;
  reviewType?: 'vehicle' | 'user';
}

export const ReviewList: React.FC<ReviewListProps> = ({ vehicleId, userId, reviewType = 'vehicle' }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'helpful' | 'rating'>('created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: ReviewFilters = {
        verified_only: activeTab === 'verified',
        sort: sortBy,
        page,
        per_page: 10,
      };

      if (reviewType === 'vehicle' && vehicleId) {
        filters.reviewable_type = 'vehicle';
        filters.reviewable_id = vehicleId;
      } else if (reviewType === 'user' && userId) {
        filters.reviewable_type = 'user';
        filters.reviewable_id = userId;
      }

      const response = await reviewService.getReviews(filters);
      
      if (page === 1) {
        setReviews(response.data);
      } else {
        setReviews(prev => [...prev, ...response.data]);
      }
      
      setHasMore(response.current_page < response.last_page);
      setTotalPages(response.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [vehicleId, userId, activeTab, sortBy, page, reviewType]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleVote = async (reviewId: number, isHelpful: boolean) => {
    try {
      const result = await reviewService.voteReview(reviewId, isHelpful);
      
      // Update the review counts locally
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                helpful_count: result.helpful_count,
                not_helpful_count: result.not_helpful_count 
              } 
            : review
        )
      );
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleFlag = async (reviewId: number, reason: string, details?: string) => {
    try {
      await reviewService.flagReview(reviewId, reason, details);
      // Update UI to show flagged state
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, flagged: true, flag_count: review.flag_count + 1 } 
            : review
        )
      );
    } catch (err) {
      console.error('Failed to flag review:', err);
      setError('Failed to flag review. Please try again.');
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleTabChange = (tab: 'all' | 'verified') => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSortChange = (sort: 'created_at' | 'helpful' | 'rating') => {
    setSortBy(sort);
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => loadReviews()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <TabsContainer>
          <TabsList>
            <TabsTrigger
              value="all"
              active={activeTab === 'all'}
              onClick={() => handleTabChange('all')}
            >
              All Reviews
            </TabsTrigger>
            <TabsTrigger
              value="verified"
              active={activeTab === 'verified'}
              onClick={() => handleTabChange('verified')}
            >
              Verified Only
            </TabsTrigger>
          </TabsList>
        </TabsContainer>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'created_at' | 'helpful' | 'rating')}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="created_at">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No reviews yet"
          description={
            activeTab === 'verified' 
              ? 'No verified reviews available for this item'
              : 'Be the first to leave a review'
          }
        />
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onVote={handleVote}
                onFlag={handleFlag}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleLoadMore}
                loading={loading}
                variant="outline"
              >
                Load More
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center text-sm text-gray-500">
            Showing {reviews.length} reviews
            {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
          </div>
        </>
      )}
    </div>
  );
};
