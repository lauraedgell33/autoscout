'use client'

import { useState } from 'react'
import { reviewService } from '@/lib/api'
import type { Review } from '@/lib/api'
import { useToast, useAsyncOperation } from '@/lib/hooks/useNotifications'
import { LoadingButton } from '@/components/common/Loading'
import { Star, ThumbsUp } from 'lucide-react'

interface ReviewFormProps {
  transactionId: number
  reviewedUserId: number
  vehicleId?: number
  onSuccess?: () => void
}

export function ReviewForm({ transactionId, reviewedUserId, vehicleId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const { execute, isLoading } = useAsyncOperation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await execute(
      async () =>
        await reviewService.create({
          transaction_id: transactionId,
          reviewed_user_id: reviewedUserId,
          vehicle_id: vehicleId,
          rating,
          title: title || undefined,
          comment: comment || undefined,
        }),
      'Review submitted successfully!',
      'Failed to submit review'
    )

    if (result && onSuccess) {
      onSuccess()
      // Reset form
      setRating(5)
      setTitle('')
      setComment('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details of your experience..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <LoadingButton
        type="submit"
        isLoading={isLoading}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
      >
        Submit Review
      </LoadingButton>
    </form>
  )
}

interface ReviewListProps {
  reviews: Review[]
  showModeration?: boolean
  onModerate?: (reviewId: number, status: 'approved' | 'rejected') => void
}

export function ReviewList({ reviews, showModeration = false, onModerate }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          showModeration={showModeration}
          onModerate={onModerate}
        />
      ))}
    </div>
  )
}

interface ReviewCardProps {
  review: Review
  showModeration?: boolean
  onModerate?: (reviewId: number, status: 'approved' | 'rejected') => void
}

function ReviewCard({ review, showModeration, onModerate }: ReviewCardProps) {
  const { execute, isLoading } = useAsyncOperation()

  const handleModerate = async (status: 'approved' | 'rejected') => {
    if (onModerate) {
      await execute(
        async () => {
          await reviewService.moderate(review.id, status)
          onModerate(review.id, status)
        },
        `Review ${status}`,
        'Failed to moderate review'
      )
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {review.reviewer?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.reviewer?.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {review.is_verified_purchase && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            <ThumbsUp size={12} />
            Verified Purchase
          </span>
        )}
      </div>

      {review.title && (
        <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}

      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}

      {showModeration && review.status === 'pending' && (
        <div className="mt-4 flex gap-3 pt-4 border-t border-gray-200">
          <LoadingButton
            isLoading={isLoading}
            onClick={() => handleModerate('approved')}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Approve
          </LoadingButton>
          <LoadingButton
            isLoading={isLoading}
            onClick={() => handleModerate('rejected')}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Reject
          </LoadingButton>
        </div>
      )}

      {review.status === 'rejected' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Rejected:</strong> {review.moderation_notes || 'No reason provided'}
          </p>
        </div>
      )}
    </div>
  )
}

interface ReviewStatsProps {
  reviews: Review[]
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>

      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">{reviews.length} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-8">{rating} ★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
