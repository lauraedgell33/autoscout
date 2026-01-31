'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-6">
          <h1 className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-900 to-accent-500">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {t('title') || 'Page Not Found'}
        </h2>
        
        <p className="text-sm text-gray-600 mb-6">
          {t('description') || 'The page you are looking for doesn\'t exist or has been moved.'}
        </p>

        {/* Search Suggestions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {t('suggestions_title') || 'What can you do?'}
          </h3>
          <ul className="text-left space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-accent-500 mt-0.5 text-sm">→</span>
              <span className="text-xs text-gray-700">
                {t('suggestion_1') || 'Check the URL for typos'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-500 mt-0.5 text-sm">→</span>
              <span className="text-xs text-gray-700">
                {t('suggestion_2') || 'Go back to the previous page'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-500 mt-0.5 text-sm">→</span>
              <span className="text-xs text-gray-700">
                {t('suggestion_3') || 'Visit our marketplace to browse available vehicles'}
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-sm font-semibold transition inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('go_home') || 'Go to Homepage'}
          </Link>
          
          <Link
            href="/marketplace"
            className="px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition inline-flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {t('browse_marketplace') || 'Browse Marketplace'}
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-xs text-gray-500">
          {t('still_need_help') || 'Still need help?'}{' '}
          <a 
            href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@example.com'}`}
            className="text-primary-900 hover:underline"
          >
            {t('contact_us') || 'Contact us'}
          </a>
        </div>
      </div>
    </div>
  )
}
