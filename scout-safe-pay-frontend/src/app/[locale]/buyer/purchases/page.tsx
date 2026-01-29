'use client';

import { useTranslations } from 'next-intl';

export default function MyPurchases() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Purchases</h1>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <p className="text-lg">No purchases yet</p>
            <a href="/vehicles" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Browse available vehicles →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
