'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
// import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    // Send error to Sentry
    // Sentry.captureException(error)
    console.error('Error occurred:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {t('title') || 'Something went wrong!'}
        </h1>
        
        <p className="text-sm text-gray-600 mb-6">
          {t('description') || 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
            <p className="text-xs font-semibold text-red-800 mb-2">Development Error Details:</p>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-sm font-semibold transition"
          >
            {t('try_again') || 'Try Again'}
          </button>
          
          <Link
            href="/"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition"
          >
            {t('go_home') || 'Go Home'}
          </Link>
        </div>

        {/* Support Link */}
        <div className="mt-6 text-xs text-gray-500">
          {t('need_help') || 'Need help?'}{' '}
          <a 
            href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'support@example.com'}`}
            className="text-primary-900 hover:underline"
          >
            {t('contact_support') || 'Contact Support'}
          </a>
        </div>
      </div>
    </div>
  )
}
