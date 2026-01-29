'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useRouter } from '@/i18n/routing'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { Star, MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import vehicleService, { Vehicle, VehicleFilters } from '@/lib/api/vehicles'
import { getCategoryLabel } from '@/lib/utils/categoryHelpers'

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
    <>      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                {t('marketplace.title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('marketplace.subtitle')}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('marketplace.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('marketplace.search_button')}
                </button>
              </div>
            </form>
          </div>
        </section>

      {/* Filters & Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">{t('filters.title')}</h3>
                
                <div className="space-y-4">
                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.sort_by')}</label>
                    <select
                      value={filters.sort_by}
                      onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">{t('status.all')}</option>
                      <option value="available">{t('status.available')}</option>
                      <option value="pending">{t('status.pending')}</option>
                      <option value="sold">{t('status.sold')}</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('filters.price_range')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder={tCommon('from')}
                        value={filters.price_min || ''}
                        onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        type="number"
                        placeholder={tCommon('to')}
                        value={filters.price_max || ''}
                        onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <button
                    onClick={() => {
                      setFilters({ sort_by: 'created_at', sort_order: 'desc', per_page: 12 })
                      setSearchQuery('')
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
                  >
                    {t('filters.clear_all')}
                  </button>
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
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-gray-600">{tCommon('loading')}</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-xl text-gray-600">{t('marketplace.no_results')}</p>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <Link
                        key={vehicle.id}
                        href={`/vehicle/${vehicle.id}`}
                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="relative h-48 bg-gray-200">
                          {vehicle.primary_image ? (
                            <img
                              src={vehicle.primary_image}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {t('marketplace.no_image')}
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              {tVehicle('safetrade_protected')}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-blue-900">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {getCategoryLabel(vehicle.category).icon} {getCategoryLabel(vehicle.category).label}
                            </span>
                          </div>

                          <div className="text-2xl font-bold text-orange-500 mb-3">
                            {formatPrice(Number(vehicle.price))}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>{vehicle.year}</div>
                            <div>{vehicleService.formatMileage(vehicle.mileage)}</div>
                            <div className="capitalize">{vehicle.fuel_type}</div>
                            <div className="capitalize">{vehicle.transmission}</div>
                          </div>

                          {/* Dealer Information */}
                          {vehicle.dealer && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {vehicle.dealer.logo_url && (
                                    <img
                                      src={vehicle.dealer.logo_url}
                                      alt={vehicle.dealer.company_name}
                                      className="w-6 h-6 rounded object-cover flex-shrink-0"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-gray-900 truncate">
                                      {vehicle.dealer.company_name}
                                    </p>
                                    {vehicle.dealer.review_stats && (
                                      <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-3 h-3 ${
                                              i < Math.floor(vehicle.dealer.review_stats?.average_rating || 0)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                        <span className="text-xs text-gray-600">
                                          {vehicle.dealer.review_stats.average_rating?.toFixed(1)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    router.push(`/dealers/${vehicle.dealer.id}`)
                                  }}
                                  className="ml-2 text-orange-500 hover:text-orange-600 text-xs font-semibold whitespace-nowrap flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Profile
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-gray-600">{vehicle.location_city}</span>
                            <span className="text-orange-500 font-semibold text-sm flex items-center gap-1">
                              {t('marketplace.view_details')}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
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
      </div>    </>
  )
}
