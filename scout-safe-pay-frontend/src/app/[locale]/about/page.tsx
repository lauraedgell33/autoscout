'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Users, TrendingUp, Globe, Award } from 'lucide-react'

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
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">{t('pages.about.title')}</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">{t('pages.about.subtitle')}</p>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('pages.about.our_story')}</h2>
                <div className="space-y-4 text-gray-600">
                  <p>Founded in 2020, AutoScout24 SafeTrade revolutionizes vehicle transactions with secure escrow payments.</p>
                  <p>We've facilitated over 10,000 successful transactions across Europe, building trust every step of the way.</p>
                </div>
              </div>
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800" alt="Office" className="w-full h-full object-cover"/>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t('pages.about.join_mission')}</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Whether you&apos;re buying or selling, experience the safest way to trade vehicles online.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/marketplace" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
                {t('pages.about.browse_vehicles')}
              </Link>
              <Link href="/contact" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 border border-blue-500">
                {t('pages.about.contact_us')}
              </Link>
            </div>
          </div>
        </div>
      </main>    </div>
  )
}
