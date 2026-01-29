'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Building2, Star, Phone, Mail, Globe, Car, Users, CheckCircle, Filter, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ReviewSubmissionForm from '@/components/ReviewSubmissionForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('vehicles')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([])

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        setLoading(true)
        const response: DealerResponse = await getDealer(dealerId)
        setDealer(response.dealer)
        setReviews(response.reviews.data)
        setReviewStats(response.review_stats)
        setFilteredVehicles(response.dealer.vehicles || [])
      } catch (error: any) {
        console.error('Error fetching dealer:', error)
        if (error.response?.status === 404) {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDealer()
  }, [dealerId])

  useEffect(() => {
    if (dealer?.vehicles) {
      let sorted = [...dealer.vehicles]
      
      switch (sortBy) {
        case 'price-low':
          sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
          break
        case 'price-high':
          sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
          break
        case 'year-new':
          sorted.sort((a, b) => (b.year || 0) - (a.year || 0))
          break
        case 'year-old':
          sorted.sort((a, b) => (a.year || 0) - (b.year || 0))
          break
        case 'newest':
        default:
          sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
      }
      
      setFilteredVehicles(sorted)
    }
  }, [sortBy, dealer])

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

  if (notFound || !dealer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('dealerNotFound')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('dealerNotFoundDescription')}
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dealers')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToDealers')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 mb-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/dealers')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToDealers')}
          </Button>

          {/* Dealer Header */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-6 items-center flex-1">
              {/* Logo */}
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                {dealer.logo_url ? (
                  <img
                    src={dealer.logo_url}
                    alt={dealer.company_name}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-blue-600" />
                  </div>
                )}
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{dealer.company_name}</h1>
                  {dealer.is_verified && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {t('verified')}
                    </Badge>
                  )}
                </div>
                
                {/* Rating */}
                {reviewStats && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center">
                      {renderStars(reviewStats.average_rating, 'md')}
                    </div>
                    <span className="text-2xl font-bold">
                      {reviewStats.average_rating.toFixed(1)}
                    </span>
                    <span className="text-blue-100">
                      ({reviewStats.total_reviews} {t('reviews')})
                    </span>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>{dealer.vehicles_count || 0} {t('activeVehicles')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{dealer.city}, {dealer.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="capitalize">{t(dealer.type)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-14 bg-white border-2 border-blue-200 rounded-xl">
              <TabsTrigger value="vehicles" className="text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Car className="w-5 h-5 mr-2" />
                {t('vehicleInventory')} ({dealer.vehicles_count || 0})
              </TabsTrigger>
              <TabsTrigger value="about" className="text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Building2 className="w-5 h-5 mr-2" />
                {t('aboutDealer')}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Star className="w-5 h-5 mr-2" />
                {t('reviews')} ({reviewStats?.total_reviews || 0})
              </TabsTrigger>
            </TabsList>

            {/* Vehicles Tab */}
            <TabsContent value="vehicles" className="mt-8">
              {/* Filters and Sort Bar */}
              <Card className="mb-6 shadow-lg border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[200px] h-12 border-2">
                          <SlidersHorizontal className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">{t('sortNewest')}</SelectItem>
                          <SelectItem value="price-low">{t('sortPriceLow')}</SelectItem>
                          <SelectItem value="price-high">{t('sortPriceHigh')}</SelectItem>
                          <SelectItem value="year-new">{t('sortYearNew')}</SelectItem>
                          <SelectItem value="year-old">{t('sortYearOld')}</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="text-sm text-gray-600 font-medium">
                        {filteredVehicles.length} {t('vehiclesAvailable')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="h-10"
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="h-10"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Grid/List */}
              {filteredVehicles.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'}>
                  {filteredVehicles.map((vehicle) => (
                    <Card 
                      key={vehicle.id} 
                      className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 ${
                        viewMode === 'list' ? 'flex flex-row' : ''
                      }`}
                      onClick={() => router.push(`/vehicle/${vehicle.id}`)}
                    >
                      {/* Vehicle Image */}
                      <div className={`relative bg-gray-100 ${viewMode === 'list' ? 'w-80 h-60' : 'h-56'}`}>
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <>
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement
                                img.style.display = 'none'
                                img.parentElement!.classList.add('bg-gray-100')
                              }}
                            />
                            {vehicle.images.length > 1 && (
                              <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                                +{vehicle.images.length - 1} {t('photos')}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <Car className="w-16 h-16 text-gray-400" />
                          </div>
                        )}
                        
                        {/* Price Badge */}
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                          €{vehicle.price?.toLocaleString()}
                        </div>

                        {/* Status Badge */}
                        {vehicle.status && (
                          <Badge className={`absolute bottom-2 left-2 ${
                            vehicle.status === 'available' ? 'bg-green-500' : 'bg-orange-500'
                          }`}>
                            {t(vehicle.status)}
                          </Badge>
                        )}
                      </div>

                      {/* Vehicle Details */}
                      <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="mb-3">
                          <h3 className="font-bold text-xl mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {vehicle.year} • {vehicle.mileage?.toLocaleString()} km
                          </p>
                        </div>

                        {/* Key Features */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          {vehicle.fuel_type && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                ⛽
                              </div>
                              <span>{vehicle.fuel_type}</span>
                            </div>
                          )}
                          {vehicle.transmission && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                ⚙️
                              </div>
                              <span>{vehicle.transmission}</span>
                            </div>
                          )}
                          {vehicle.body_type && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                🚗
                              </div>
                              <span>{vehicle.body_type}</span>
                            </div>
                          )}
                          {vehicle.color && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                🎨
                              </div>
                              <span>{vehicle.color}</span>
                            </div>
                          )}
                        </div>

                        {/* CTA Button */}
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/vehicle/${vehicle.id}`)
                          }}
                        >
                          {t('viewDetails')} →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-blue-300">
                  <Car className="w-20 h-20 text-blue-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('noVehiclesListed')}
                  </h3>
                  <p className="text-gray-600">{t('checkBackLater')}</p>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Contact Card */}
                  <Card className="border-2 border-blue-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
                      <CardTitle className="flex items-center text-blue-900">
                        <Phone className="w-5 h-5 mr-2" />
                        {t('contactInfo')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href={`tel:${dealer.phone}`} className="block">
                          <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg">
                            <Phone className="w-5 h-5 mr-2" />
                            {dealer.phone}
                          </Button>
                        </a>

                        <a href={`mailto:${dealer.email}`} className="block">
                          <Button variant="outline" className="w-full h-14 border-2 border-blue-300 hover:bg-blue-50 text-lg">
                            <Mail className="w-5 h-5 mr-2" />
                            {t('sendMessage')}
                          </Button>
                        </a>

                        {dealer.website && (
                          <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="block md:col-span-2">
                            <Button variant="outline" className="w-full h-14 border-2 border-blue-300 hover:bg-blue-50">
                              <Globe className="w-5 h-5 mr-2" />
                              {(() => {
                                try {
                                  return new URL(dealer.website).host;
                                } catch {
                                  return dealer.website;
                                }
                              })()}
                            </Button>
                          </a>
                        )}
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-semibold text-blue-900">{t('visitUs')}</p>
                            <p className="text-gray-700">{dealer.address}</p>
                            <p className="text-gray-700">{dealer.postal_code} {dealer.city}</p>
                            <p className="text-gray-700">{dealer.country}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - Statistics */}
                <div className="space-y-6">
                  <Card className="shadow-lg border-2 border-blue-100">
                    <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                      <CardTitle className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        {t('statistics')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t('activeVehicles')}</span>
                            <span className="text-3xl font-bold text-orange-600">{dealer.vehicles_count || 0}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t('totalReviews')}</span>
                            <span className="text-3xl font-bold text-purple-600">{reviewStats?.total_reviews || 0}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t('averageRating')}</span>
                            <span className="text-3xl font-bold text-yellow-600">
                              {reviewStats?.average_rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t('memberSince')}</span>
                            <span className="text-sm font-bold text-green-600">
                              {new Date(dealer.created_at).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust Badge */}
                  {dealer.is_verified && (
                    <Card className="shadow-lg bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300">
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
                        <h3 className="font-bold text-lg text-green-900 mb-2">
                          {t('verifiedDealer')}
                        </h3>
                        <p className="text-sm text-green-700">
                          {t('verifiedDealerDescription')}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews List */}
                <div className="lg:col-span-2">
                  <Card className="shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
                      <CardTitle className="flex items-center text-purple-900">
                        <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                        {t('customerReviews')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">{reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                    {review.reviewer?.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{review.reviewer?.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {formatDate(review.created_at)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>

                              {review.comment && (
                                <p className="text-gray-700 leading-relaxed mb-3 italic">
                                  "{review.comment}"
                                </p>
                              )}

                              {review.transaction?.vehicle && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                                  <Car className="w-4 h-4" />
                                  <span>
                                    {t('regarding')}: {review.transaction.vehicle.make} {review.transaction.vehicle.model} ({review.transaction.vehicle.year})
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            {t('noReviewsYet')}
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            {t('beTheFirstToReview')}
                          </p>
                        </div>
                      )}

                      {/* Review Submission Form */}
                      <div className="pt-6 border-t-2 border-gray-200">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">{t('writeAReview')}</h3>
                        <ReviewSubmissionForm dealerId={dealerId} onSuccess={() => {
                          // Optionally refresh reviews here
                        }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Rating Breakdown Sidebar */}
                <div className="space-y-6">
                  {reviewStats && reviewStats.rating_breakdown && reviewStats.total_reviews > 0 && (
                    <Card className="shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-yellow-50 to-white">
                        <CardTitle className="flex items-center text-yellow-900">
                          <Star className="w-5 h-5 mr-2 fill-current text-yellow-400" />
                          {t('ratingBreakdown')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviewStats.rating_breakdown[rating] || 0
                            const total = reviewStats.total_reviews
                            const percentage = total > 0 ? ((count * 100) / total) : 0
                            
                            return (
                              <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-6">{rating}</span>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: percentage + '%' }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">
                                  {count}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
