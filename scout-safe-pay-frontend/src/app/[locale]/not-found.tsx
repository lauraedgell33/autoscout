'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title') || 'Page Not Found'}
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            {t('description') || 'The page you are looking for doesn\'t exist or has been moved.'}
          </p>

          {/* Search Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              {t('suggestions_title') || 'What can you do?'}
            </h3>
            <ul className="text-left space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">→</span>
                <span className="text-gray-700">
                  {t('suggestion_1') || 'Check the URL for typos'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">→</span>
                <span className="text-gray-700">
                  {t('suggestion_2') || 'Go back to the previous page'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 mt-1">→</span>
                <span className="text-gray-700">
                  {t('suggestion_3') || 'Visit our marketplace to browse available vehicles'}
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('go_home') || 'Go to Homepage'}
            </Link>
            
            <Link
              href="/marketplace"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('browse_marketplace') || 'Browse Marketplace'}
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            {t('still_need_help') || 'Still need help?'}{' '}
            <a 
              href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@example.com'}`}
              className="text-blue-600 hover:underline"
            >
              {t('contact_us') || 'Contact us'}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
