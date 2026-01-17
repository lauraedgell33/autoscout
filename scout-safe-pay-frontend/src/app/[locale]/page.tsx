'use client'

import Link from 'next/link'
import { Shield, CheckCircle, Truck, Award, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HomePage() {
  const t = useTranslations()
  const { formatPrice } = useCurrency()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [stats, setStats] = useState({ active: 10, total: 50 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simple mock data for demo
    setVehicles([
      {
        id: 1,
        make: 'BMW',
        model: '5 Series',
        year: 2022,
        price: 45000,
        mileage: 15000,
        fuel_type: 'diesel',
        transmission: 'automatic',
        location_city: 'Munich',
        primary_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600'
      },
      {
        id: 2,
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2023,
        price: 52000,
        mileage: 8000,
        fuel_type: 'petrol',
        transmission: 'automatic',
        location_city: 'Berlin',
        primary_image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600'
      },
      {
        id: 3,
        make: 'Audi',
        model: 'A6',
        year: 2022,
        price: 48000,
        mileage: 12000,
        fuel_type: 'diesel',
        transmission: 'automatic',
        location_city: 'Hamburg',
        primary_image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600'
      }
    ])
  }, [])

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                {t('home.hero.badge')}
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6">
                {t('home.hero.title_1')}
                <span className="block text-orange-500">{t('home.hero.title_2')}</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                {t('home.hero.subtitle')}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                  <div className="text-3xl font-bold text-orange-500">{stats.active}+</div>
                  <div className="text-sm text-gray-600">{t('home.hero.stats.active')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">50K+</div>
                  <div className="text-sm text-gray-600">{t('home.hero.stats.customers')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-500">€2B+</div>
                  <div className="text-sm text-gray-600">{t('home.hero.stats.secured')}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold transition"
                >
                  {t('home.hero.cta_browse')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 border-2 border-blue-900 text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  {t('home.hero.cta_learn')}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-orange-100 rounded-3xl p-8">
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
      <section className="py-12 bg-gray-50 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Secure Escrow', desc: 'Payment protection' },
              { icon: CheckCircle, title: 'Verified Sellers', desc: '100% checked' },
              { icon: Award, title: '24-Month Warranty', desc: 'Included free' },
              { icon: Truck, title: 'Free Delivery', desc: 'EU-wide' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-8 h-8 text-blue-900" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.featured.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicle/${vehicle.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition border"
              >
                <div className="relative h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                  <img
                    src={vehicle.primary_image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {t('home.featured.protected')}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">
                    {vehicle.make} {vehicle.model}
                  </h3>

                  <div className="text-2xl font-bold text-orange-500 mb-3">
                    €{vehicle.price.toLocaleString()}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>{vehicle.year}</div>
                    <div>{vehicle.mileage.toLocaleString()} km</div>
                    <div className="capitalize">{vehicle.fuel_type}</div>
                    <div className="capitalize">{vehicle.transmission}</div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm text-gray-600">{vehicle.location_city}</span>
                    <span className="text-orange-500 font-semibold text-sm flex items-center gap-1">
                      {t('home.featured.view_details')}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              {t('home.featured.view_all')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace"
              className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              {t('home.cta.browse')}
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              {t('home.cta.create_account')}
            </Link>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}
