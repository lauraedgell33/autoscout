'use client';

import { useTranslations } from 'next-intl';

export default function PaymentFailed() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-8">Unfortunately, your payment could not be processed</p>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8 text-left">
            <h3 className="font-semibold text-red-900 mb-2">Error Details</h3>
            <p className="text-red-700 text-sm">
              Your payment was declined. Please check your payment method and try again.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">What You Can Do</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>✓ Verify your payment method details</li>
              <li>✓ Try a different payment method</li>
              <li>✓ Check your bank account limits</li>
              <li>✓ Contact customer support if the issue persists</li>
            </ul>
          </div>

          <div className="space-y-3">
            <a
              href="/payment/initiate"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Try Again
            </a>
            <a
              href="/contact"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
