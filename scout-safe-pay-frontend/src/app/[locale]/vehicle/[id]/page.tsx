'use client'

import Image from 'next/image'

import { Link } from '@/i18n/routing'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useState, useEffect } from 'react'
import vehicleService, { Vehicle } from '@/lib/api/vehicles'
import { transactionService } from '@/lib/api/transactions'
import VehicleMap from '@/components/map/VehicleMap'

export default function VehicleDetailsPage() {
  const t = useTranslations()
  const { formatPrice } = useCurrency()
  const params = useParams()
  const router = useRouter()
  const vehicleId = parseInt(params.id as string)
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [buyingNow, setBuyingNow] = useState(false)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await vehicleService.getVehicle(vehicleId)
        setVehicle(data)
      } catch (err: any) {
        console.error('Failed to fetch vehicle:', err)
        setError(t('error_loading'))
      } finally {
        setLoading(false)
      }
    }

    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  const handleBuyNow = async () => {
    if (!vehicle) return
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert(t('login_required'))
      router.push('/login?redirect=/vehicle/' + vehicleId)
      return
    }

    // Redirect to checkout page with vehicle details
    router.push(`/checkout/${vehicle.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white">        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">{t('not_found')}</h2>
            <p className="text-gray-600 mb-6">{t('not_found_desc')}</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('back_to_marketplace')}
            </Link>
          </div>
        </div>      </div>
    )
  }

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E"
  
  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [vehicle.primary_image || placeholderImage]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-900">{t('breadcrumbs.home')}</Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-blue-900">{t('breadcrumbs.marketplace')}</Link>
            <span>/</span>
            <span className="text-blue-900 font-medium">{vehicle.make} {vehicle.model}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200">
                <img
                  src={images[selectedImage]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {t('vehicle.safetrade_protected')}
                  </span>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {(images || []).length > 1 && (
                <div className="grid grid-cols-6 gap-2 p-4 bg-gray-50">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-16 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Title & Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">
                {vehicle.make} {vehicle.model}
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('fields.year')}</p>
                    <p className="font-bold text-blue-900">{vehicle.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('fields.mileage')}</p>
                    <p className="font-bold text-blue-900">{vehicleService.formatMileage(vehicle.mileage)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('fields.fuel_type')}</p>
                    <p className="font-bold text-blue-900 capitalize">{vehicle.fuel_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('fields.transmission')}</p>
                    <p className="font-bold text-blue-900 capitalize">{vehicle.transmission}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">{t('vehicle.description')}</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
              </div>
            )}

            {/* Location Map (FREE Leaflet) */}
            {vehicle.latitude && vehicle.longitude && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">{t('vehicle.location') || 'Location'}</h2>
                <VehicleMap
                  latitude={vehicle.latitude}
                  longitude={vehicle.longitude}
                  title={`${vehicle.make} ${vehicle.model}`}
                  price={Number(vehicle.price)}
                  height="400px"
                  zoom={13}
                />
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vehicle.location_city}, {vehicle.location_country}</span>
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">{t('vehicle.overview')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: t('fields.make'), value: vehicle.make },
                  { label: t('fields.model'), value: vehicle.model },
                  { label: t('fields.year'), value: vehicle.year },
                  { label: t('fields.color'), value: vehicle.color },
                  { label: t('fields.doors'), value: vehicle.doors },
                  { label: t('fields.seats'), value: vehicle.seats },
                  { label: t('fields.body_type'), value: vehicle.body_type ? vehicleService.getBodyTypeLabel(vehicle.body_type) : null },
                  { label: t('fields.engine_size'), value: vehicle.engine_size ? `${vehicle.engine_size} cc` : null },
                ].filter(spec => spec.value).map((spec, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-medium text-blue-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price & Action */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">{t('fields.price')}</p>
                <p className="text-4xl font-bold text-orange-500">
                  {formatPrice(Number(vehicle.price))}
                </p>
              </div>

              <button 
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition mb-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingNow ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {t('vehicle.buy_now')}
                  </>
                )}
              </button>

              <button className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition mb-6">
                {t('vehicle.contact_seller')}
              </button>

              {/* Dealer Information */}
              {vehicle.dealer && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3 text-center">Seller Information</h3>
                  
                  <div className="flex items-center gap-3 mb-3">
                    {vehicle.dealer.logo_url ? (
                      <img
                        src={vehicle.dealer.logo_url}
                        alt={vehicle.dealer.company_name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center text-blue-900 font-bold">
                        {vehicle.dealer.company_name?.charAt(0) || 'D'}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-blue-900">{vehicle.dealer.company_name}</p>
                      {vehicle.dealer.verification_status && (
                        <p className="text-xs text-green-600 font-semibold">✓ Verified Dealer</p>
                      )}
                    </div>
                  </div>

                  {/* Ratings */}
                  {vehicle.dealer.review_stats && (
                    <div className="bg-white rounded p-2 mb-3">
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <span className="text-xs text-gray-600">Rating</span>
                        <span className="font-bold text-orange-500">{(vehicle.dealer.review_stats.average_rating || 0).toFixed(1)}/5</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(vehicle.dealer.review_stats?.average_rating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {vehicle.dealer.review_stats.total_reviews || 0} {vehicle.dealer.review_stats.total_reviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  )}

                  {/* Dealer Details */}
                  <div className="space-y-2 text-xs mb-3">
                    {vehicle.dealer.vehicles_count && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Active Listings</span>
                        <span className="font-bold text-blue-900">{vehicle.dealer.vehicles_count}</span>
                      </div>
                    )}
                    {vehicle.dealer.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">📞</span>
                        <span className="font-semibold text-blue-900">{vehicle.dealer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/dealers/${vehicle.dealer.id}`}
                    className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                  >
                    View Full Profile
                  </Link>
                </div>
              )}

              {/* SafeTrade Benefits */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t('vehicle.safetrade_protection')}
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{t('vehicle.benefits.escrow')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{t('vehicle.benefits.verified')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{t('vehicle.benefits.inspection')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{t('vehicle.benefits.guarantee')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{t('vehicle.benefits.support')}</span>
                  </li>
                </ul>
              </div>

              {/* Location */}
              {vehicle.location_city && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h3 className="font-bold text-blue-900 mb-3">{t('fields.location')}</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{vehicle.location_city}, {vehicle.location_country}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>    </div>
  )
}
