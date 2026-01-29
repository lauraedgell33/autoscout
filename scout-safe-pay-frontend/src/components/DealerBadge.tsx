'use client'

import { useRouter } from '@/i18n/routing'
import { Star, MapPin, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Dealer } from '@/types'

interface DealerBadgeProps {
  dealer: Dealer
  compact?: boolean
}

export default function DealerBadge({ dealer, compact = false }: DealerBadgeProps) {
  const router = useRouter()

  const averageRating = dealer.review_stats?.average_rating || 0
  const totalReviews = dealer.review_stats?.total_reviews || 0

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/dealers/${dealer.id}`)
  }

  if (compact) {
    return (
      <div
        className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-3 mb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {dealer.logo_url && (
                <img
                  src={dealer.logo_url}
                  alt={dealer.company_name}
                  className="w-8 h-8 rounded object-cover flex-shrink-0"
                />
              )}
              <p className="font-semibold text-sm text-gray-900 truncate">
                {dealer.company_name}
              </p>
              {dealer.is_verified && (
                <Badge variant="success" className="text-xs whitespace-nowrap">
                  ✓ Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span>({totalReviews})</span>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleProfileClick}
            className="whitespace-nowrap flex-shrink-0"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Profile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 mb-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {dealer.logo_url && (
              <img
                src={dealer.logo_url}
                alt={dealer.company_name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-lg text-gray-900">{dealer.company_name}</h4>
              {dealer.is_verified && (
                <Badge variant="success" className="text-xs">
                  ✓ Verified Dealer
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{dealer.city}, {dealer.country}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(averageRating)}
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600">({totalReviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleProfileClick}
          className="flex-shrink-0"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </div>
    </div>
  )
}
