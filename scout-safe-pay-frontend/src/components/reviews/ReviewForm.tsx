'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { reviewService } from '@/lib/api/reviews';
import { ReviewFormData } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
  transactionId: number;
  revieweeId: number;
  reviewType: 'buyer' | 'seller' | 'vehicle';
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  transactionId,
  revieweeId,
  reviewType,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const MIN_CHARS = 20;
  const MAX_CHARS = 1000;
  const charCount = comment.length;
  const isCommentValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const isFormValid = rating > 0 && isCommentValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please provide a valid rating and comment');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData: ReviewFormData = {
        transaction_id: transactionId,
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim(),
        review_type: reviewType,
      };

      await reviewService.submitReview(formData);
      
      setSuccess(true);
      setRating(0);
      setComment('');
      
      // Show success for 2 seconds then call onSuccess
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarPicker = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoveredRating || rating);
          return (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (success) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Review Submitted!
          </h3>
          <p className="text-gray-600">
            Thank you for sharing your feedback.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <Label className="mb-2 block">
              Rating <span className="text-red-500">*</span>
            </Label>
            {renderStarPicker()}
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                You rated: {rating} {rating === 1 ? 'star' : 'stars'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="mb-2 block">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this transaction..."
              rows={6}
              maxLength={MAX_CHARS}
              className={`resize-none ${
                charCount > 0 && !isCommentValid ? 'border-red-500' : ''
              }`}
            />
            <div className="flex justify-between items-center mt-2">
              <span
                className={`text-sm ${
                  charCount < MIN_CHARS
                    ? 'text-gray-500'
                    : charCount > MAX_CHARS
                    ? 'text-red-500'
                    : 'text-green-600'
                }`}
              >
                {charCount < MIN_CHARS
                  ? `${MIN_CHARS - charCount} more characters required`
                  : `${charCount} / ${MAX_CHARS} characters`}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            disabled={!isFormValid || loading}
            fullWidth
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
