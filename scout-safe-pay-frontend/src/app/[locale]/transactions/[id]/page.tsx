'use client';

import { useTranslations } from 'next-intl';

export default function TransactionDetail() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Transaction Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction Info</h2>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono font-semibold">TXN-000000001</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p>Not available</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-green-600 font-semibold">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Info</h2>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="text-sm text-gray-600">Make & Model</p>
                  <p>Not available</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p>Not available</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seller</p>
                  <p>Not available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-semibold text-gray-900">Payment Completed</p>
                  <p className="text-sm text-gray-600">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
