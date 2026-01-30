'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Review } from '@/types/review';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from './VerifiedBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

interface ReviewCardProps {
  review: Review;
  onVote?: (reviewId: number, isHelpful: boolean) => void;
  onFlag?: (reviewId: number, reason: string, details?: string) => void;
}

const flagReasons = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate' },
  { value: 'fake', label: 'Fake Review' },
  { value: 'offensive', label: 'Offensive Content' },
  { value: 'misleading', label: 'Misleading Information' },
  { value: 'other', label: 'Other' },
];

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onVote, onFlag }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFlagMenu, setShowFlagMenu] = useState(false);
  
  const needsTruncation = review.comment && review.comment.length > 200;
  const displayComment = needsTruncation && !isExpanded 
    ? review.comment!.substring(0, 200) + '...' 
    : review.comment;

  const handleVote = (isHelpful: boolean) => {
    if (onVote) {
      onVote(review.id, isHelpful);
    }
  };

  const handleFlag = (reason: string) => {
    if (onFlag) {
      onFlag(review.id, reason);
    }
    setShowFlagMenu(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Header: Avatar, Name, Verified Badge */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar>
            {review.reviewer?.avatar ? (
              <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name || 'Reviewer'} />
            ) : (
              <AvatarFallback>
                {review.reviewer?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">
                {review.reviewer?.name || 'Anonymous'}
              </span>
              <VerifiedBadge verified={review.verified} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(review.rating)}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle info if available */}
        {review.vehicle && (
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs">
              {review.vehicle.year} {review.vehicle.make} {review.vehicle.model}
            </Badge>
          </div>
        )}

        {/* Review Comment */}
        {review.comment && (
          <div className="mb-3">
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {displayComment}
            </p>
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-1 flex items-center gap-1"
              >
                {isExpanded ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote(true)}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>Helpful</span>
            {review.helpful_count > 0 && (
              <span className="text-gray-600">({review.helpful_count})</span>
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVote(false)}
            className="gap-1"
          >
            <ThumbsDown className="h-4 w-4" />
            {review.not_helpful_count > 0 && (
              <span className="text-gray-600">({review.not_helpful_count})</span>
            )}
          </Button>

          {/* Flag Menu */}
          <div className="relative ml-auto">
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" className="gap-1">
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </Button>
              }
              items={flagReasons.map(reason => ({
                label: reason.label,
                onClick: () => handleFlag(reason.value),
              }))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
