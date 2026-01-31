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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <Building2 className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold">
                {t('title')}
              </h1>
            </div>
            <p className="text-xl text-blue-100 mb-6">{t('description')}</p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{(dealers || []).length}+</div>
                <div className="text-sm text-blue-100">{t('verifiedDealers')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-100">{t('qualityChecked')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">{t('support')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Filters */}
        <Card className="shadow-xl border-2 border-blue-100 mb-12 -mt-8 relative z-10 bg-white">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('findYourDealer')}
              </h2>
              <p className="text-gray-600">{t('filterResults')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-blue-600" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-300 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500">
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
                <SelectTrigger className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500">
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

              <Button onClick={handleSearch} className="h-14 text-lg bg-blue-600 hover:bg-blue-700">
                <Search className="w-5 h-5 mr-2" />
                {t('search')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        {!loading && (
          <div className="mb-8 flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-900">
              {(dealers || []).length > 0 ? (
                <>
                  <span className="text-blue-600">{(dealers || []).length}</span> {t('dealersFound')}
                </>
              ) : (
                <span>{t('noDealersFound')}</span>
              )}
            </div>
            {(dealers || []).length > 0 && (
              <div className="text-sm text-gray-600">
                {t('page')} {currentPage} {t('of')} {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Dealers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : dealers.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-blue-300">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-6">
              <Building2 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t('noDealersFound')}
            </h3>
            <p className="text-gray-600 text-lg mb-6">{t('tryDifferentFilters')}</p>
            <Button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCity('')
                setSelectedType('')
                fetchDealers(1)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t('clearFilters')}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {dealers.map((dealer) => (
                <Card
                  key={dealer.id}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-blue-300 overflow-hidden"
                  onClick={() => router.push(`/dealers/${dealer.id}`)}
                >
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          {dealer.logo_url ? (
                            <div className="w-16 h-16 bg-white rounded-xl p-2 mb-3">
                              <img
                                src={dealer.logo_url}
                                alt={dealer.company_name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                              <Building2 className="w-8 h-8" />
                            </div>
                          )}
                          <h3 className="font-bold text-xl mb-1 group-hover:text-blue-100 transition-colors">
                            {dealer.company_name}
                          </h3>
                        </div>
                        {dealer.is_verified && (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
                            ✓ {t('verified')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Location */}
                      <div className="flex items-center text-gray-700">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{dealer.city}</div>
                          <div className="text-sm text-gray-500">{dealer.country}</div>
                        </div>
                      </div>

                      {/* Type */}
                      <div className="flex items-center text-gray-700">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                          <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium capitalize">{t(dealer.type)}</div>
                          <div className="text-sm text-gray-500">{t('dealerType')}</div>
                        </div>
                      </div>

                      {/* Rating */}
                      {dealer.review_stats && dealer.review_stats.total_reviews > 0 && (
                        <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {renderStars(dealer.review_stats.average_rating)}
                            </div>
                            <span className="text-2xl font-bold text-orange-600">
                              {(dealer.review_stats.average_rating ?? 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 text-center">
                            {dealer.review_stats.total_reviews} {t('customerReviews')}
                          </div>
                        </div>
                      )}

                      {/* Vehicles Count */}
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <Car className="w-5 h-5" />
                          <span className="font-medium">{t('activeListings')}</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          {dealer.vehicles_count || 0}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
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
                            className="w-full h-10 border-2 border-blue-200 hover:bg-blue-50"
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
              <div className="flex justify-center items-center space-x-3 bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
                <Button
                  variant="outline"
                  className="h-12 px-6 border-2 border-blue-200 hover:bg-blue-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  {t('previous')}
                </Button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const distance = Math.abs(page - currentPage)
                      return distance === 0 || distance === 1 || page === 1 || page === totalPages
                    })
                    .map((page, index, array) => {
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-400 font-bold">
                            ...
                          </span>
                        )
                      }
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'primary' : 'outline'}
                          className={`h-12 w-12 ${
                            page === currentPage 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'border-2 border-blue-200 hover:bg-blue-50'
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
                  className="h-12 px-6 border-2 border-blue-200 hover:bg-blue-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t('next')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}