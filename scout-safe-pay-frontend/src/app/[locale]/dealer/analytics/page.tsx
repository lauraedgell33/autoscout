'use client';

import { useTranslations } from 'next-intl';

export default function DealerAnalytics() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Analytics</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
              <p className="text-4xl font-bold">$0</p>
              <p className="text-sm text-blue-100 mt-2">This month</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Vehicles Sold</h3>
              <p className="text-4xl font-bold">0</p>
              <p className="text-sm text-green-100 mt-2">This month</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No sales data available yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
