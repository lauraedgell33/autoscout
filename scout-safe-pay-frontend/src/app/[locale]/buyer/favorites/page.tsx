'use client';

import { useTranslations } from 'next-intl';

export default function FavoriteVehicles() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Saved Vehicles</h1>
          <p className="text-gray-600 mb-8">Your favorite vehicles and saved searches</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-8 text-center col-span-full">
              <p className="text-gray-500 mb-4">No saved vehicles yet</p>
              <a href="/vehicles" className="text-blue-600 hover:text-blue-700 font-semibold">
                Browse vehicles and save your favorites →
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Searches</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              <p>No saved searches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
