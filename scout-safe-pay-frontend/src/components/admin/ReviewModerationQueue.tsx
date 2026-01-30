'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/lib/stores/uiStore';
import { reviewService } from '@/lib/api/reviews';
import { Review } from '@/types/review';
import { 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ReviewModerationQueueProps {
  initialPage?: number;
}

export default function ReviewModerationQueue({ initialPage = 1 }: ReviewModerationQueueProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [moderationNotes, setModerationNotes] = useState<{ [key: number]: string }>({});
  
  const { addToast } = useUIStore();

  const fetchReviews = async (page: number = currentPage) => {
    setLoading(true);
    try {
      const data = await reviewService.getPendingReviews(page, 10);
      setReviews(data.data);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
      setTotal(data.total);
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to fetch pending reviews',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const handleVerify = async (review: Review) => {
    setProcessingId(review.id);
    try {
      await reviewService.verifyReview(review.id, moderationNotes[review.id]);
      
      addToast({
        type: 'success',
        message: 'Review verified successfully',
      });
      
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      setTotal((prev) => prev - 1);
      
      if (moderationNotes[review.id]) {
        setModerationNotes((prev) => {
          const updated = { ...prev };
          delete updated[review.id];
          return updated;
        });
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to verify review',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (review: Review) => {
    setSelectedReview(review);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
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
        message: 'Review rejected successfully',
      });
      
      setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));
      setTotal((prev) => prev - 1);
      setRejectModalOpen(false);
      setSelectedReview(null);
      
      if (moderationNotes[selectedReview.id]) {
        setModerationNotes((prev) => {
          const updated = { ...prev };
          delete updated[selectedReview.id];
          return updated;
        });
      }
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message || 'Failed to reject review',
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

  if (loading && reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation Queue</CardTitle>
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
            <CardTitle>Review Moderation Queue</CardTitle>
            <Badge variant="info">{total} Pending</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending reviews</h3>
              <p className="text-gray-600">All reviews have been moderated</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {review.reviewer?.name || 'Anonymous'}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {review.review_type}
                        </Badge>
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
                        <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                          {review.comment}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>

                  {review.vehicle && (
                    <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                      Vehicle: {review.vehicle.year} {review.vehicle.make} {review.vehicle.model}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Moderation Notes (Optional)
                    </label>
                    <Textarea
                      value={moderationNotes[review.id] || ''}
                      onChange={(e) =>
                        setModerationNotes((prev) => ({
                          ...prev,
                          [review.id]: e.target.value,
                        }))
                      }
                      placeholder="Add internal notes about this review..."
                      className="text-sm"
                      rows={2}
                      disabled={processingId === review.id}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleVerify(review)}
                      disabled={processingId !== null}
                      className="flex-1"
                    >
                      {processingId === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Verify
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRejectClick(review)}
                      disabled={processingId !== null}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
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
        title="Reject Review"
        description="Please provide a reason for rejecting this review"
        size="md"
      >
        <div className="space-y-4">
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
            className="w-full"
          />
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
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || processingId !== null}
            >
              {processingId !== null ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Reject Review
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
