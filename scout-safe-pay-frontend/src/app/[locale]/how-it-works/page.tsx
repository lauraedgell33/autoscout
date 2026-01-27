'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function HowItWorksPage() {
  const t = useTranslations()
  
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t('how_it_works.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              {t('how_it_works.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('how_it_works.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', prefix: 'step1' },
              { step: '2', prefix: 'step2' },
              { step: '3', prefix: 'step3' },
              { step: '4', prefix: 'step4' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition border border-gray-200 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-xl text-blue-900 mb-2">{t(`how_it_works.${item.prefix}_title`)}</h3>
                  <p className="text-gray-600 mb-4">{t(`how_it_works.${item.prefix}_desc`)}</p>
                  
                  <ul className="space-y-2">
                    {[1, 2, 3, 4].map((num) => (
                      <li key={num} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t(`how_it_works.${item.prefix}_${num}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">{t('how_it_works.process_title')}</h2>
          
          <div className="space-y-8">
            {/* Buyer Side */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900">{t('how_it_works.buyer_title')}</h3>
              </div>
              
              <ol className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <li key={num} className="flex gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">{num}</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">{t(`how_it_works.buyer_${num}_title`)}</h4>
                      <p className="text-gray-600">{t(`how_it_works.buyer_${num}_desc`)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Seller Side */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-900">{t('how_it_works.seller_title')}</h3>
              </div>
              
              <ol className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <li key={num} className="flex gap-4">
                    <div className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center font-bold flex-shrink-0">{num}</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">{t(`how_it_works.seller_${num}_title`)}</h4>
                      <p className="text-gray-600">{t(`how_it_works.seller_${num}_desc`)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">{t('how_it_works.safety_title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition border border-gray-200">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-blue-900 mb-2">{t(`how_it_works.feature${num}_title`)}</h3>
                <p className="text-gray-600">{t(`how_it_works.feature${num}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('how_it_works.cta_title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('how_it_works.cta_subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition shadow-lg inline-flex items-center gap-2"
            >
              {t('how_it_works.browse_vehicles')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              {t('how_it_works.create_account')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
