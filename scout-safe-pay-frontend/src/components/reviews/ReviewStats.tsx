'use client';

import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { ReviewStats as ReviewStatsType } from '@/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  const { average_rating, total_reviews, verified_count = 0, rating_breakdown } = stats;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getPercentage = (count: number): number => {
    if (total_reviews === 0) return 0;
    return Math.round((count / total_reviews) * 100);
  };

  const getRatingCount = (rating: number): number => {
    return rating_breakdown[rating.toString()] || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating Display */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
          <div className="flex flex-col items-center sm:items-start">
            <div className="text-5xl font-bold text-gray-900">
              {average_rating.toFixed(1)}
            </div>
            <div className="mt-2">
              {renderStars(average_rating)}
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <p className="text-lg font-medium text-gray-700">
              {total_reviews} {total_reviews === 1 ? 'Review' : 'Reviews'}
            </p>
            {verified_count > 0 && (
              <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{verified_count} Verified</span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Rating Distribution Bars */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm mb-3">Rating Distribution</h4>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = getRatingCount(rating);
            const percentage = getPercentage(count);

            return (
              <div key={rating} className="flex items-center gap-3">
                {/* Star label */}
                <div className="flex items-center gap-1 w-12 text-sm">
                  <span className="font-medium text-gray-700">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Percentage and count */}
                <div className="w-20 text-right text-sm">
                  <span className="font-medium text-gray-700">{percentage}%</span>
                  <span className="text-gray-500 ml-1">({count})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats */}
        {total_reviews > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((verified_count / total_reviews) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {Math.round(
                    (Object.entries(rating_breakdown)
                      .filter(([rating]) => Number(rating) >= 4)
                      .reduce((sum, [, count]) => sum + count, 0) /
                      total_reviews) *
                      100
                  )}%
                </div>
                <div className="text-sm text-gray-600">4+ Stars</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
