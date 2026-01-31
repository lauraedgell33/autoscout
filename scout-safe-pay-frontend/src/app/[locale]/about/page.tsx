'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Users, TrendingUp, Globe, Award, Shield, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  const t = useTranslations()
  
  const stats = [
    { label: t('pages.about.stats.active_users'), value: '50K+', icon: Users },
    { label: t('pages.about.stats.vehicles_sold'), value: '10K+', icon: TrendingUp },
    { label: t('pages.about.stats.countries'), value: '25+', icon: Globe },
    { label: t('pages.about.stats.trust_score'), value: '4.8/5', icon: Award }
  ]

  return (
    <div className="min-h-screen flex flex-col">      
      <main className="flex-grow">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 text-white py-16 sm:py-24">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full -mb-32" />
            <div className="absolute top-1/2 left-0 w-48 h-48 bg-white rounded-full -ml-24" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium">Trusted by 50,000+ users</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{t('pages.about.title')}</h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto mb-8">{t('pages.about.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Secure Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Verified Dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white py-16 sm:py-20 -mt-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="py-16 sm:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-sm font-semibold text-accent-500 mb-3">Our Story</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t('pages.about.our_story')}</h2>
                <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                  <p>Founded in 2020, AutoScout24 SafeTrade revolutionizes vehicle transactions with secure escrow payments.</p>
                  <p>We've facilitated over 10,000 successful transactions across Europe, building trust every step of the way.</p>
                  <p>Our mission is to make buying and selling vehicles as safe and simple as possible.</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    SSL Encrypted
                  </div>
                  <div className="flex items-center gap-2 bg-primary-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Bank-level Security
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-3xl blur-2xl" />
                <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800" alt="Office" className="w-full h-full object-cover"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-12 sm:py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t('pages.about.join_mission')}</h2>
            <p className="text-sm sm:text-base text-blue-100 mb-6 max-w-2xl mx-auto">
              Whether you&apos;re buying or selling, experience the safest way to trade vehicles online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/marketplace" className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition">
                {t('pages.about.browse_vehicles')}
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold border border-white/20 transition">
                {t('pages.about.contact_us')}
              </Link>
            </div>
          </div>
        </div>
      </main>    </div>
  )
}
