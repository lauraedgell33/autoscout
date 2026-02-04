'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/lib/stores/uiStore';
import { reviewService } from '@/lib/api/reviews';
import { Review, ReviewFlag } from '@/types/review';
import { 
  AlertTriangle,
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Flag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FlaggedReviewsPanelProps {
  initialPage?: number;
}

interface FlagReasonBreakdown {
  [key: string]: number;
}

export default function FlaggedReviewsPanel({ initialPage = 1 }: FlaggedReviewsPanelProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  
  const { addToast } = useUIStore();

  const fetchReviews = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const data = await reviewService.getFlaggedReviews(page, 10);
      setReviews(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setTotal(data.total);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch flagged reviews';
      addToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, fetchReviews]);

  const toggleExpanded = (reviewId: number) => {
    setExpandedReviews((prev) => {
      const updated = new Set(prev);
      if (updated.has(reviewId)) {
        updated.delete(reviewId);
      } else {
        updated.add(reviewId);
      }
      return updated;
    });
  };

  const getFlagReasonBreakdown = (flags: ReviewFlag[] = []): FlagReasonBreakdown => {
    return flags.reduce((acc, flag) => {
      acc[flag.reason] = (acc[flag.reason] || 0) + 1;
      return acc;
    }, {} as FlagReasonBreakdown);
  };

  const formatFlagReasonBreakdown = (breakdown: FlagReasonBreakdown): string => {
    return Object.entries(breakdown)
      .map(([reason, count]) => `${count}x ${reason}`)
      .join(', ');
  };

  const handleKeepReview = async (review: Review) => {
    setProcessingId(review.id);
    try {
      await reviewService.verifyReview(review.id, 'Flags dismissed - review kept');
      
      addToast({
        type: 'success',
        message: 'Review kept and flags dismissed',
      });
      
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      setTotal((prev) => prev - 1);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to keep review';
      addToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveClick = (review: Review) => {
    setSelectedReview(review);
    setRejectReason('Review flagged by users');
    setRejectModalOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!selectedReview || !rejectReason.trim()) {
      addToast({
        type: 'error',
        message: 'Please provide a rejection reason',
      });
      return;
    }

    setProcessingId(selectedReview.id);
    try {
      await reviewService.rejectReview(selectedReview.id, rejectReason.trim());
      
      addToast({
        type: 'success',
        message: 'Review removed successfully',
      });
      
      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
      setTotal((prev) => prev - 1);
      setRejectModalOpen(false);
      setSelectedReview(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove review';
      addToast({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFlagReasonLabel = (reason: string): string => {
    const labels: { [key: string]: string } = {
      spam: 'Spam',
      inappropriate: 'Inappropriate',
      fake: 'Fake',
      offensive: 'Offensive',
      misleading: 'Misleading',
      other: 'Other',
    };
    return labels[reason] || reason;
  };

  if (loading && reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flagged Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flagged Reviews</CardTitle>
            <Badge variant="warning">{total} Flagged</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No flagged reviews</h3>
              <p className="text-gray-600">All flags have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isExpanded = expandedReviews.has(review.id);
                const flagBreakdown = getFlagReasonBreakdown(review.flags);
                
                return (
                  <div
                    key={review.id}
                    className="border-2 border-accent-200 bg-accent-50/30 rounded-lg p-4 hover:border-orange-300 transition-colors"
                  >
                    {/* Header with Flag Count */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <Badge variant="warning" className="font-semibold">
                          <Flag className="h-3 w-3 mr-1" />
                          {review.flag_count} {review.flag_count === 1 ? 'Flag' : 'Flags'}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {review.review_type}
                      </Badge>
                    </div>

                    {/* Flag Reason Breakdown */}
                    <div className="bg-white rounded p-2 mb-3 text-sm">
                      <span className="font-medium text-gray-700">Reasons: </span>
                      <span className="text-gray-600">{formatFlagReasonBreakdown(flagBreakdown)}</span>
                    </div>

                    {/* Review Content */}
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {review.reviewer?.name || 'Anonymous'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {review.rating}/5
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 text-sm mb-2">
                          {review.comment}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </div>

                      {review.vehicle && (
                        <div className="text-xs text-gray-600 mt-2 pt-2 border-t">
                          Vehicle: {review.vehicle.year} {review.vehicle.make} {review.vehicle.model}
                        </div>
                      )}
                    </div>

                    {/* Expandable Flag Details */}
                    {review.flags && review.flags.length > 0 && (
                      <div className="mb-3">
                        <button
                          onClick={() => toggleExpanded(review.id)}
                          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          {isExpanded ? 'Hide' : 'Show'} Flag Details ({review.flags.length})
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {review.flags.map((flag) => (
                              <div
                                key={flag.id}
                                className="bg-white border border-gray-200 rounded p-3 text-sm"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <Flag className="h-3 w-3 text-orange-500" />
                                    <span className="font-medium text-gray-900">
                                      {flag.user?.name || 'Anonymous'}
                                    </span>
                                  </div>
                                  <Badge variant="warning" className="text-xs">
                                    {getFlagReasonLabel(flag.reason)}
                                  </Badge>
                                </div>
                                {flag.details && (
                                  <p className="text-gray-600 text-xs mt-1">{flag.details}</p>
                                )}
                                <p className="text-gray-400 text-xs mt-1">
                                  {formatDate(flag.created_at)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleKeepReview(review)}
                        disabled={processingId !== null}
                        className="flex-1"
                      >
                        {processingId === review.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Keep Review
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveClick(review)}
                        disabled={processingId !== null}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4" />
                        Remove Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        title="Remove Review"
        description="Please confirm the reason for removing this review"
        size="md"
      >
        <div className="space-y-4">
          {selectedReview && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-medium text-gray-900 mb-2">Review Summary:</p>
              <p className="text-gray-700 line-clamp-2">{selectedReview.comment}</p>
              <p className="text-gray-500 text-xs mt-2">
                Flagged {selectedReview.flag_count} time(s)
              </p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
              disabled={processingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveConfirm}
              disabled={!rejectReason.trim() || processingId !== null}
            >
              {processingId !== null ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Remove Review
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
