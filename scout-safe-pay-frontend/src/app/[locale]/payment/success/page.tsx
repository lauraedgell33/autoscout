'use client';

import { useTranslations } from 'next-intl';

export default function PaymentSuccess() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your payment has been processed successfully</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Transaction ID:</span>
                <span className="font-mono">TXN-000000001</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>Just now</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 font-semibold">Completed</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/buyer/transactions"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              View Transaction
            </a>
            <a
              href="/vehicles"
              className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
