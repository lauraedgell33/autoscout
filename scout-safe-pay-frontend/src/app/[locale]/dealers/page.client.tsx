'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Building2, Star, Users, Car, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { getDealers, type DealersResponse } from '@/lib/api/dealers'
import type { Dealer } from '@/types'

export default function DealersPageClient() {
  const t = useTranslations('dealers')
  const router = useRouter()

  const [dealers, setDealers] = useState<Dealer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [cities, setCities] = useState<string[]>([])

  const fetchDealers = async (page = 1) => {
    try {
      setLoading(true)
      const params: any = { page }
      if (searchTerm) params.search = searchTerm
      if (selectedCity) params.city = selectedCity
      if (selectedType) params.type = selectedType

      const response: DealersResponse = await getDealers(params)
      setDealers(response.dealers.data)
      setTotalPages(response.dealers.last_page)
      setCurrentPage(response.dealers.current_page)

      // Extract unique cities for filter
      const uniqueCities = [...new Set(response.dealers.data.map(d => d.city))]
      setCities(uniqueCities)
    } catch (error) {
      console.error('Error fetching dealers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDealers()
  }, [searchTerm, selectedCity, selectedType])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchDealers(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchDealers(page)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full -mb-32" />
        </div>
        <div className="relative container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {t('title')}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-blue-100 mb-6">{t('description')}</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold">{(dealers || []).length}+</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('verifiedDealers')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold">100%</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('qualityChecked')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold">24/7</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('support')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Enhanced Filters */}
        <Card className="shadow-lg border border-gray-100 mb-8 sm:mb-12 -mt-6 relative z-10 bg-white rounded-2xl">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                {t('findYourDealer')}
              </h2>
              <p className="text-sm text-gray-600">{t('filterResults')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-sm bg-gray-50 border-gray-200 rounded-xl focus:ring-primary-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 text-sm bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue placeholder={t('selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allTypes')}</SelectItem>
                  <SelectItem value="independent">{t('independent')}</SelectItem>
                  <SelectItem value="franchise">{t('franchise')}</SelectItem>
                  <SelectItem value="manufacturer">{t('manufacturer')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-12 text-sm bg-gray-50 border-gray-200 rounded-xl">
                  <SelectValue placeholder={t('selectCity')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allCities')}</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="h-12 text-sm bg-primary-900 hover:bg-primary-950 rounded-xl">
                <Search className="w-4 h-4 mr-2" />
                {t('search')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900">
              {(dealers || []).length > 0 ? (
                <>
                  <span className="text-primary-900 font-semibold">{(dealers || []).length}</span> {t('dealersFound')}
                </>
              ) : (
                <span>{t('noDealersFound')}</span>
              )}
            </div>
            {(dealers || []).length > 0 && (
              <div className="text-sm text-gray-500">
                {t('page')} {currentPage} {t('of')} {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Dealers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="rounded-2xl border border-gray-100">
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : dealers.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-50 mb-4">
              <Building2 className="w-8 h-8 text-primary-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('noDealersFound')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{t('tryDifferentFilters')}</p>
            <Button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCity('')
                setSelectedType('')
                fetchDealers(1)
              }}
              className="bg-primary-900 hover:bg-primary-950 rounded-xl"
            >
              {t('clearFilters')}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {dealers.map((dealer) => (
                <Card
                  key={dealer.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-primary-200 rounded-2xl overflow-hidden"
                  onClick={() => router.push(`/dealers/${dealer.id}`)}
                >
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 p-4 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {dealer.logo_url ? (
                            <div className="w-12 h-12 bg-white rounded-xl p-1.5 mb-2">
                              <img
                                src={dealer.logo_url}
                                alt={dealer.company_name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 border border-white/20">
                              <Building2 className="w-6 h-6" />
                            </div>
                          )}
                          <h3 className="font-semibold text-base">
                            {dealer.company_name}
                          </h3>
                        </div>
                        {dealer.is_verified && (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs">
                            ✓ {t('verified')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Location */}
                      <div className="flex items-center text-gray-700">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center mr-2">
                          <MapPin className="w-4 h-4 text-primary-900" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{dealer.city}</div>
                          <div className="text-xs text-gray-500">{dealer.country}</div>
                        </div>
                      </div>

                      {/* Type */}
                      <div className="flex items-center text-gray-700">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-2">
                          <Building2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium capitalize">{t(dealer.type)}</div>
                          <div className="text-xs text-gray-500">{t('dealerType')}</div>
                        </div>
                      </div>

                      {/* Rating */}
                      {dealer.review_stats && dealer.review_stats.total_reviews > 0 && (
                        <div className="p-3 bg-accent-50 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-0.5">
                              {renderStars(dealer.review_stats.average_rating)}
                            </div>
                            <span className="text-lg font-bold text-accent-600">
                              {(dealer.review_stats.average_rating ?? 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 text-center">
                            {dealer.review_stats.total_reviews} {t('customerReviews')}
                          </div>
                        </div>
                      )}

                      {/* Vehicles Count */}
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-2 text-green-700">
                          <Car className="w-4 h-4" />
                          <span className="text-sm font-medium">{t('activeListings')}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {dealer.vehicles_count || 0}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-gray-100 space-y-2">
                        <Button
                          className="w-full bg-primary-900 hover:bg-primary-950 h-10 text-sm rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dealers/${dealer.id}`)
                          }}
                        >
                          {t('viewProfile')} →
                        </Button>
                        {dealer.website && (
                          <Button
                            variant="outline"
                            className="w-full h-9 text-sm border border-gray-200 hover:bg-gray-50 rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(dealer.website!, '_blank')
                            }}
                          >
                            {t('visitWebsite')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <Button
                  variant="outline"
                  className="h-10 px-4 text-sm border border-gray-200 hover:bg-gray-50 rounded-xl"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t('previous')}
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const distance = Math.abs(page - currentPage)
                      return distance === 0 || distance === 1 || page === 1 || page === totalPages
                    })
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        )
                      }
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'primary' : 'outline'}
                          className={`h-10 w-10 text-sm rounded-xl ${
                            page === currentPage 
                              ? 'bg-primary-900 hover:bg-primary-950 text-white' 
                              : 'border border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      )
                    })}
                </div>

                <Button
                  variant="outline"
                  className="h-10 px-4 text-sm border border-gray-200 hover:bg-gray-50 rounded-xl"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t('next')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
