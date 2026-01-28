'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Building2, Star, Phone, Mail, Globe, Car, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { getDealer, type DealerResponse } from '@/lib/api/dealers'
import type { Dealer, Review } from '@/types'

interface DealerPageClientProps {
  dealerId: number
}

export default function DealerPageClient({ dealerId }: DealerPageClientProps) {
  const t = useTranslations('dealers')
  const router = useRouter()

  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        setLoading(true)
        const response: DealerResponse = await getDealer(dealerId)
        setDealer(response.dealer)
        setReviews(response.reviews.data)
        setReviewStats(response.review_stats)
      } catch (error) {
        console.error('Error fetching dealer:', error)
        router.push('/dealers')
      } finally {
        setLoading(false)
      }
    }

    fetchDealer()
  }, [dealerId, router])

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!dealer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('dealerNotFound')}</h1>
          <Button onClick={() => router.push('/dealers')}>
            {t('backToDealers')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dealers')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToDealers')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Dealer Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">{dealer.company_name}</CardTitle>
                    {dealer.is_verified && (
                      <Badge variant="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t('verified')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{dealer.name}</p>

                  {/* Rating */}
                  {reviewStats && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {renderStars(reviewStats.average_rating, 'md')}
                      </div>
                      <span className="text-lg font-semibold">
                        {reviewStats.average_rating.toFixed(1)}
                      </span>
                      <span className="text-gray-600">
                        ({reviewStats.total_reviews} {t('reviews')})
                      </span>
                    </div>
                  )}
                </div>

                {dealer.logo_url && (
                  <img
                    src={dealer.logo_url}
                    alt={dealer.company_name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  {dealer.address}, {dealer.city}, {dealer.postal_code}, {dealer.country}
                </div>

                <div className="flex items-center text-sm">
                  <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                  {t(dealer.type)}
                </div>

                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  {dealer.phone}
                </div>

                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {dealer.email}
                </div>

                {dealer.website && (
                  <div className="flex items-center text-sm md:col-span-2">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <a
                      href={dealer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {dealer.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicles Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('recentVehicles')}</CardTitle>
            </CardHeader>
            <CardContent>
              {dealer.vehicles && dealer.vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dealer.vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {vehicle.make} {vehicle.model}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {vehicle.year} • {vehicle.price}€
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => router.push(`/vehicle/${vehicle.id}`)}
                        >
                          {t('view')}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {t('noVehiclesListed')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t('customerReviews')}</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar 
                            fallback={review.reviewer?.name?.charAt(0) || 'U'}
                            className="h-8 w-8"
                          />
                          <div>
                            <p className="font-medium">{review.reviewer?.name}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(review.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                      )}

                      {review.transaction?.vehicle && (
                        <p className="text-sm text-gray-600">
                          {t('regarding')}: {review.transaction.vehicle.make} {review.transaction.vehicle.model} ({review.transaction.vehicle.year})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {t('noReviewsYet')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Contact Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {t('contactInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {t('callNow')}
                </Button>

                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  {t('sendMessage')}
                </Button>

                {dealer.website && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(dealer.website!, '_blank')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {t('visitWebsite')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('statistics')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('activeVehicles')}:</span>
                  <span className="font-semibold">{dealer.vehicles_count || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">{t('totalReviews')}:</span>
                  <span className="font-semibold">{reviewStats?.total_reviews || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">{t('averageRating')}:</span>
                  <span className="font-semibold">
                    {reviewStats?.average_rating?.toFixed(1) || '0.0'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">{t('memberSince')}:</span>
                  <span className="font-semibold">
                    {formatDate(dealer.created_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Breakdown */}
          {reviewStats && reviewStats.rating_breakdown && (
            <Card>
              <CardHeader>
                <CardTitle>{t('ratingBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <span className="text-sm mr-2 w-6">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-2" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${reviewStats.total_reviews > 0
                              ? (reviewStats.rating_breakdown[rating] || 0) / reviewStats.total_reviews * 100
                              : 0}%`
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">
                        {reviewStats.rating_breakdown[rating] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}