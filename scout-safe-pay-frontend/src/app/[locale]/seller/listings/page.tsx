'use client';

import { useTranslations } from 'next-intl';

export default function MyListings() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Listings</h1>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">No listings yet</p>
            <a href="/seller/add-vehicle" className="text-blue-600 hover:text-blue-700 font-semibold">
              Add your first vehicle →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
