'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useRouter } from '@/i18n/routing'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Star, MapPin, ExternalLink, ShoppingCart, Search, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import vehicleService, { Vehicle, VehicleFilters } from '@/lib/api/vehicles'
import { getCategoryLabel } from '@/lib/utils/categoryHelpers'
import { VehicleCardSkeleton } from '@/components/common/SkeletonCard'
import { EmptyState } from '@/components/common/EmptyState'
import AdvancedFilters from '@/components/filters/AdvancedFilters'
import EnhancedVehicleCard from '@/components/vehicle/EnhancedVehicleCard'

export default function MarketplacePage() {
  const t = useTranslations()
  const tCommon = useTranslations('common')
  const tVehicle = useTranslations('vehicle')
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState<VehicleFilters>({
    sort_by: 'created_at',
    sort_order: 'desc',
    per_page: 12
  })
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await vehicleService.getVehicles(filters)
        
        setVehicles(response.data)
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          total: response.total
        })
      } catch (err: any) {
        console.error('Failed to fetch vehicles:', err)
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          config: err.config
        })
        setError('Failed to load vehicles. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, search: searchQuery, page: 1 })
  }

  const handleFilterChange = (key: keyof VehicleFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-12 sm:py-16">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full -mb-32" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              {t('marketplace.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              {t('marketplace.subtitle')}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge className="bg-white/20 text-white border border-white/30 hover:bg-white/30">
                {pagination.total} Vehicles Available
              </Badge>
              <Badge className="bg-green-500/80 text-white border border-green-400/50 hover:bg-green-500">
                ✓ SafeTrade Protected
              </Badge>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  id="marketplace-search"
                  name="search"
                  type="text"
                  placeholder={t('marketplace.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 py-3 sm:py-4 focus:outline-none text-base sm:text-lg bg-transparent"
                  autoComplete="off"
                />
              </div>
              <Button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold text-base sm:text-lg rounded-xl"
              >
                {t('marketplace.search_button')}
              </Button>
            </div>
          </form>

          {/* Advanced Filters Toggle */}
          <div className="mt-4 text-center">
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              variant="ghost"
              className="text-blue-100 hover:text-white hover:bg-white/10"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </Button>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mb-6 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <AdvancedFilters
                onApplyFilters={(appliedFilters) => {
                  setFilters({ ...filters, ...appliedFilters, page: 1 })
                  setShowAdvancedFilters(false)
                }}
                onReset={() => {
                  setFilters({ sort_by: 'created_at', sort_order: 'desc', per_page: 12 })
                  setSearchQuery('')
                }}
                isLoading={loading}
              />
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <SlidersHorizontal className="w-4 h-4 text-primary-900" />
                  </div>
                  {t('filters.title')}
                </h3>
                
                <div className="space-y-5">
                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.sort_by')}</label>
                    <select
                      value={filters.sort_by}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                    >
                      <option value="created_at">{t('sort.newest')}</option>
                      <option value="price">{t('sort.price_low')}</option>
                      <option value="-price">{t('sort.price_high')}</option>
                      <option value="mileage">{t('sort.mileage_low')}</option>
                      <option value="year">{t('sort.year_new')}</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('marketplace.category_label')}</label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                    >
                      <option value="">{t('categories.all')}</option>
                      <option value="car">🚗 {t('categories.car')}</option>
                      <option value="motorcycle">🏍️ {t('categories.motorcycle')}</option>
                      <option value="van">🚐 {t('categories.van')}</option>
                      <option value="truck">🚚 {t('categories.truck')}</option>
                      <option value="trailer">🚛 {t('categories.trailer')}</option>
                      <option value="caravan">🚙 {t('categories.caravan')}</option>
                      <option value="motorhome">🏕️ {t('categories.motorhome')}</option>
                      <option value="construction_machinery">🏗️ {t('categories.construction')}</option>
                      <option value="agricultural_machinery">🚜 {t('categories.agricultural')}</option>
                      <option value="forklift">🔧 {t('categories.forklift')}</option>
                      <option value="boat">⛵ {t('categories.boat')}</option>
                      <option value="atv">🛞 {t('categories.atv')}</option>
                      <option value="quad">🏁 {t('categories.quad')}</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('status.label')}</label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                    >
                      <option value="">{t('status.all')}</option>
                      <option value="available">{t('status.available')}</option>
                      <option value="pending">{t('status.pending')}</option>
                      <option value="sold">{t('status.sold')}</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label htmlFor="marketplace-price-min" className="block text-sm font-medium text-gray-700 mb-2">{t('filters.price_range')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        id="marketplace-price-min"
                        name="priceMin"
                        type="number"
                        placeholder={tCommon('from')}
                        value={filters.price_min || ''}
                        onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                        autoComplete="off"
                      />
                      <input
                        id="marketplace-price-max"
                        name="priceMax"
                        type="number"
                        placeholder={tCommon('to')}
                        value={filters.price_max || ''}
                        onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <Button
                    onClick={() => {
                      setFilters({ sort_by: 'created_at', sort_order: 'desc', per_page: 12 })
                      setSearchQuery('')
                    }}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    {t('filters.clear_all')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="lg:col-span-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {tCommon('error')}
                </div>
              )}

              {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <VehicleCardSkeleton key={i} />
                  ))}
                </div>
              ) : (!vehicles || vehicles.length === 0) ? (
                <EmptyState
                  icon={ShoppingCart}
                  title={t('marketplace.no_results')}
                  description="Try adjusting your filters or search query to find more vehicles."
                  actionLabel="Clear Filters"
                  actionOnClick={() => {
                    setFilters({ sort_by: 'created_at', sort_order: 'desc', per_page: 12 })
                    setSearchQuery('')
                  }}
                />
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {(vehicles || []).map((vehicle) => (
                      <EnhancedVehicleCard
                        key={vehicle.id}
                        id={String(vehicle.id)}
                        title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                        make={vehicle.make}
                        model={vehicle.model}
                        year={vehicle.year}
                        price={Number.parseFloat(vehicle.price || '0')}
                        mileage={vehicle.mileage ?? 0}
                        fuelType={vehicle.fuel_type ?? '—'}
                        transmission={vehicle.transmission ?? '—'}
                        location={[vehicle.location_city, vehicle.location_country].filter(Boolean).join(', ')}
                        images={vehicle.images ?? (vehicle.primary_image ? [vehicle.primary_image] : [])}
                        status={vehicle.status === 'sold' ? 'sold' : vehicle.status === 'reserved' ? 'reserved' : 'active'}
                        onSave={() => {
                          // TODO: Implement favorite functionality
                        }}
                        onShare={() => {
                          // TODO: Implement share functionality
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                      {pagination.current_page > 1 && (
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {tCommon('previous')}
                        </button>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                          const page = i + 1
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg ${
                                page === pagination.current_page
                                  ? 'bg-orange-500 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        })}
                      </div>

                      {pagination.current_page < pagination.last_page && (
                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {tCommon('next')}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
