'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Shield, CheckCircle } from 'lucide-react'

export default function BenefitsPage() {
  const t = useTranslations()
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900 py-12 sm:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white rounded-full -mb-32" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Shield className="w-4 h-4" />
              SafeTrade Benefits
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              {t('benefits.title')}
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary-900" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t(`benefits.benefit${num}_title`)}</h3>
                <p className="text-gray-600 mb-4 text-sm">{t(`benefits.benefit${num}_desc`)}</p>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((featureNum) => (
                    <li key={featureNum} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{t(`benefits.benefit${num}_${featureNum}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison - Mobile Responsive */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">{t('benefits.comparison_title')}</h2>
          
          {/* Mobile: Stack layout */}
          <div className="md:hidden space-y-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="font-semibold text-gray-900 mb-3 text-sm">{t(`benefits.comp${num}`)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t(`benefits.comp${num}_safe`)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{t(`benefits.comp${num}_trad`)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop: Table layout */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Feature</th>
                  <th className="px-6 py-4 text-center font-bold text-primary-900">{t('benefits.safetrade')}</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-500">{t('benefits.traditional')}</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <tr key={num} className="border-t border-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 text-sm">{t(`benefits.comp${num}`)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {t(`benefits.comp${num}_safe`)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {t(`benefits.comp${num}_trad`)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-primary-900 via-primary-800 to-blue-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full -mb-24" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
            {t('benefits.cta_title')}
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8">
            {t('benefits.cta_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              {t('benefits.browse_btn')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="bg-white text-primary-900 px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all text-center"
            >
              {t('benefits.sell_btn')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
