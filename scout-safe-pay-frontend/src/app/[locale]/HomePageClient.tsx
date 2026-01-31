'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Shield, CheckCircle, Truck, Award, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { vehicleService } from '@/lib/api/vehicles'
import type { Vehicle, VehicleStatistics } from '@/lib/api/vehicles'
import { AnimatedCounter } from '@/components/common/AnimatedCounter'

export default function HomePageClient() {
  const t = useTranslations()
  const { formatPrice } = useCurrency()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stats, setStats] = useState<VehicleStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch featured vehicles and statistics from real API
        const [vehiclesData, statsData] = await Promise.all([
          vehicleService.getFeaturedVehicles(),
          vehicleService.getStatistics()
        ])
        
        // Set vehicles (limit to 3 for homepage display)
        setVehicles(vehiclesData.slice(0, 3))
        
        // Set real statistics
        setStats(statsData)
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
        // Keep empty arrays if API fails - better than mock data
        setVehicles([])
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-20">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full -mb-32" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
                <Shield className="w-4 h-4" />
                {t('home.hero.badge')}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('home.hero.title_1')}
                <span className="block text-accent-500">{t('home.hero.title_2')}</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                {t('home.hero.subtitle')}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? (
                      <div className="animate-pulse">...</div>
                    ) : (
                      <AnimatedCounter end={stats?.active || 0} suffix="+" />
                    )}
                  </div>
                  <div className="text-sm text-blue-200">{t('home.hero.stats.active')}</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? (
                      <div className="animate-pulse">...</div>
                    ) : (
                      <AnimatedCounter end={stats?.total || 0} suffix="+" />
                    )}
                  </div>
                  <div className="text-sm text-blue-200">{t('home.hero.stats.customers')}</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter end={2} prefix="€" suffix="M+" />
                  </div>
                  <div className="text-sm text-blue-200">{t('home.hero.stats.secured')}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-accent-500/30"
                >
                  {t('home.hero.cta_browse')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20"
                >
                  {t('home.hero.cta_learn')}
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="aspect-square bg-white/10 rounded-3xl p-6 backdrop-blur-sm border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"
                  alt="Premium vehicles"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Shield, title: 'Secure Escrow', desc: 'Payment protection' },
              { icon: CheckCircle, title: 'Verified Sellers', desc: '100% checked' },
              { icon: Award, title: '24-Month Warranty', desc: 'Included free' },
              { icon: Truck, title: 'Free Delivery', desc: 'EU-wide' }
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (vehicles ?? []).length > 0 ? (
              (vehicles ?? []).map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicle/${vehicle.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition border"
                >
                  <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                    <img
                      src={vehicle.primary_image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23e5e7eb' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999999' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E" }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {t('home.featured.protected')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {vehicle.make} {vehicle.model}
                    </h3>

                    <div className="text-2xl font-bold text-accent-500 mb-3">
                      {formatPrice(parseFloat(vehicle.price))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>{vehicle.year}</div>
                      <div>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}</div>
                      <div className="capitalize">{vehicle.fuel_type || 'N/A'}</div>
                      <div className="capitalize">{vehicle.transmission || 'N/A'}</div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <span className="text-sm text-gray-600">{vehicle.location_city || 'Location'}</span>
                      <span className="text-primary-600 font-semibold text-sm flex items-center gap-1">
                        {t('home.featured.view_details')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Empty state
              <div className="col-span-3 text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No featured vehicles available</p>
                <Link href="/marketplace" className="text-primary-600 hover:underline">
                  Browse all vehicles →
                </Link>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105"
            >
              {t('home.featured.view_all')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full -mb-24" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace"
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              {t('home.cta.browse')}
            </Link>
            <Link
              href="/register"
              className="bg-white text-primary-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              {t('home.cta.create_account')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
