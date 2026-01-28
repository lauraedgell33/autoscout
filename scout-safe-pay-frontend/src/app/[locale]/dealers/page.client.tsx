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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-teal-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <span className="text-3xl mr-3">🏢</span>
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">{t('description')}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('allTypes')}</SelectItem>
                    <SelectItem value="individual">{t('individual')}</SelectItem>
                    <SelectItem value="company">{t('company')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
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

                <Button onClick={handleSearch} className="w-full">
                  {t('search')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-sm text-gray-600">
            {dealers.length === 0 ? (
              <span>{dealers.length} {t('dealers') || 'dealers'} {t('found') || 'found'}</span>
            ) : (
              <span>{dealers.length} {t('dealers') || 'dealers'} {t('found') || 'found'}</span>
            )}
          </div>
        )}

        {/* Dealers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        ) : dealers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('noDealersFound')}
          </h3>
          <p className="text-gray-600">{t('tryDifferentFilters')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dealers.map((dealer) => (
              <Card
                key={dealer.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dealers/${dealer.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{dealer.company_name}</CardTitle>
                      <p className="text-sm text-gray-600">{dealer.name}</p>
                    </div>
                    {dealer.logo_url && (
                      <img
                        src={dealer.logo_url}
                        alt={dealer.company_name}
                        className="w-12 h-12 rounded-lg object-cover ml-4"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {dealer.city}, {dealer.country}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-1" />
                      {t(dealer.type)}
                    </div>

                    {dealer.review_stats && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {renderStars(dealer.review_stats.average_rating)}
                          <span className="ml-2 text-sm text-gray-600">
                            {dealer.review_stats.average_rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ({dealer.review_stats.total_reviews} {t('reviews')})
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Car className="w-4 h-4 mr-1" />
                        {dealer.vehicles_count || 0} {t('vehicles')}
                      </div>
                      <Badge variant={dealer.is_verified ? 'success' : 'secondary'} size="sm">
                        {dealer.is_verified ? t('verified') : t('pending')}
                      </Badge>
                    </div>

                    {dealer.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(dealer.website!, '_blank')
                        }}
                      >
                        {t('visitWebsite')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                {t('previous')}
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const distance = Math.abs(page - currentPage)
                  return distance === 0 || distance === 1 || page === 1 || page === totalPages
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 py-1 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {t('next')}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}