'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useState, useEffect } from 'react';
import vehicleService, { Vehicle } from '@/lib/api/vehicles';
import { transactionService } from '@/lib/api/transactions';
import VehicleMap from '@/components/map/VehicleMap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VehicleBadge, { StatusBadge, ConditionBadge } from '@/components/vehicle/VehicleBadges';
import { getImageUrl } from '@/lib/utils';
import { 
  ShoppingCart, Shield, CheckCircle, MapPin, Calendar, 
  Gauge, Fuel, Settings, Phone, Mail, Star, ChevronLeft, ChevronRight,
  Heart, Share2, Eye, Award
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500 mb-4"></div>
          <p className="text-sm text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('not_found')}</h2>
            <p className="text-sm text-gray-600 mb-6">{t('not_found_desc')}</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('back_to_marketplace')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e5e7eb' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E"
  
  // Process images through getImageUrl to ensure proper URLs
  const images = vehicle.images && vehicle.images.length > 0
    ? vehicle.images.map(img => getImageUrl(img))
    : [getImageUrl(vehicle.primary_image) || placeholderImage]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-900">{t('breadcrumbs.home')}</Link>
            <span>/</span>
            <Link href="/marketplace" className="hover:text-primary-900">{t('breadcrumbs.marketplace')}</Link>
            <span>/</span>
            <span className="text-primary-900 font-medium truncate">{vehicle.make} {vehicle.model}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="overflow-hidden mb-6 rounded-2xl border border-gray-100">
              <div className="relative h-72 sm:h-96 bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {t('vehicle.safetrade_protected')}
                  </Badge>
                </div>
                
                {/* Image Navigation */}
                {(images || []).length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-xl shadow-lg transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-xl shadow-lg transition"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-900" />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2.5 py-1 rounded-lg text-xs">
                      {selectedImage + 1} / {images.length}
                    </div>
                  </>
                )}
                
                {/* Action Icons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button className="bg-white/90 hover:bg-white p-2 rounded-xl shadow-lg transition">
                    <Heart className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="bg-white/90 hover:bg-white p-2 rounded-xl shadow-lg transition">
                    <Share2 className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {(images || []).length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-3 bg-gray-50">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-14 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index ? 'border-accent-500 ring-2 ring-accent-500/30' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Vehicle Title & Stats */}
            <Card className="p-4 sm:p-6 mb-6 rounded-2xl border border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={vehicle.status} />
                    <ConditionBadge condition={vehicle.condition ?? 'good'} />
                  </div>
                </div>
                
                {/* Mobile Price */}
                <div className="lg:hidden">
                  <p className="text-xs text-gray-600 mb-0.5">{t('fields.price')}</p>
                  <p className="text-xl font-bold text-accent-500">
                    {formatPrice(Number(vehicle.price))}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-accent-50 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t('fields.year')}</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{vehicle.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-primary-50 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t('fields.mileage')}</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{vehicleService.formatMileage(vehicle.mileage)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-green-50 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t('fields.fuel_type')}</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize truncate">{vehicle.fuel_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-purple-50 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{t('fields.transmission')}</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize truncate">{vehicle.transmission}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            {vehicle.description && (
              <Card className="p-4 sm:p-6 mb-6 rounded-2xl border border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent-500" />
                  {t('vehicle.description')}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
              </Card>
            )}

            {/* Location Map (FREE Leaflet) */}
            {vehicle.latitude && vehicle.longitude && (
              <Card className="p-4 sm:p-6 mb-6 rounded-2xl border border-gray-100">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent-500" />
                  {t('vehicle.location') || 'Location'}
                </h2>
                <VehicleMap
                  latitude={vehicle.latitude}
                  longitude={vehicle.longitude}
                  title={`${vehicle.make} ${vehicle.model}`}
                  price={Number(vehicle.price)}
                  height="300px"
                  zoom={13}
                />
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0" />
                  <span>{vehicle.location_city}, {vehicle.location_country}</span>
                </div>
              </Card>
            )}

            {/* Technical Specifications */}
            <Card className="p-4 sm:p-6 rounded-2xl border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-accent-500" />
                {t('vehicle.overview')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <span className="text-xs text-gray-500">{spec.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Price & Action */}
          <div className="lg:col-span-1">
            <Card className="p-4 sm:p-5 sticky top-20 rounded-2xl border border-gray-100">
              {/* Desktop Price */}
              <div className="text-center mb-5 hidden lg:block">
                <p className="text-xs text-gray-500 mb-1">{t('fields.price')}</p>
                <p className="text-2xl sm:text-3xl font-bold text-accent-500">
                  {formatPrice(Number(vehicle.price))}
                </p>
              </div>

              <Button 
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-xl text-sm font-semibold transition mb-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buyingNow ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    {t('vehicle.buy_now')}
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition mb-5"
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('vehicle.contact_seller')}
              </Button>

              {/* Dealer Information */}
              {vehicle.dealer && (
                <div className="bg-primary-50 rounded-xl p-4 mb-5 border border-primary-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center flex items-center justify-center gap-2">
                    <Award className="w-4 h-4 text-primary-900" />
                    Seller Information
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-3">
                    {vehicle.dealer.logo_url ? (
                      <img
                        src={vehicle.dealer.logo_url}
                        alt={vehicle.dealer.company_name}
                        className="w-10 h-10 rounded-lg object-cover ring-2 ring-primary-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {vehicle.dealer.company_name?.charAt(0) || 'D'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{vehicle.dealer.company_name}</p>
                      {vehicle.dealer.verification_status && (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs mt-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Ratings */}
                  {vehicle.dealer.review_stats && (
                    <div className="bg-white rounded-lg p-2.5 mb-3">
                      <div className="flex items-center gap-2 justify-between mb-1">
                        <span className="text-xs text-gray-500">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-bold text-gray-900">{(vehicle.dealer.review_stats?.average_rating ?? 0).toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(vehicle.dealer.review_stats?.average_rating || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200 fill-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {vehicle.dealer.review_stats.total_reviews || 0} reviews
                      </p>
                    </div>
                  )}

                  {/* Dealer Details */}
                  <div className="space-y-1.5 text-xs mb-3">
                    {vehicle.dealer.vehicles_count && (
                      <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <span className="text-gray-500 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-primary-900" />
                          Active Listings
                        </span>
                        <Badge className="bg-primary-900 hover:bg-primary-950 text-white text-xs">
                          {vehicle.dealer.vehicles_count}
                        </Badge>
                      </div>
                    )}
                    {vehicle.dealer.phone && (
                      <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                        <Phone className="w-3.5 h-3.5 text-primary-900 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">{vehicle.dealer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/dealers/${vehicle.dealer.id}`}
                    className="w-full block text-center bg-primary-900 hover:bg-primary-950 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                  >
                    View Full Profile →
                  </Link>
                </div>
              )}

              {/* SafeTrade Benefits */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  {t('vehicle.safetrade_protection')}
                </h3>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{t('vehicle.benefits.escrow')}</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{t('vehicle.benefits.verified')}</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{t('vehicle.benefits.inspection')}</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{t('vehicle.benefits.guarantee')}</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{t('vehicle.benefits.support')}</span>
                  </li>
                </ul>
              </div>

              {/* Location */}
              {vehicle.location_city && (
                <div className="border-t border-gray-100 mt-5 pt-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent-500" />
                    {t('fields.location')}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-700 p-2.5 bg-gray-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-accent-500 flex-shrink-0" />
                    <span>{vehicle.location_city}, {vehicle.location_country}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>    </div>
  )
}
