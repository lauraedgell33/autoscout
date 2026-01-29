'use client';

import { useTranslations } from 'next-intl';

export default function SellerDashboard() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage your vehicle listings and sales</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Active Listings</h2>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Sold Vehicles</h2>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Pending Sales</h2>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Total Earnings</h2>
              <p className="text-3xl font-bold">$0</p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/seller/add-vehicle"
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">+ Add New Vehicle</p>
                <p className="text-sm text-gray-600 mt-2">List a new vehicle for sale</p>
              </a>
              <a
                href="/seller/listings"
                className="bg-green-50 hover:bg-green-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">My Listings</p>
                <p className="text-sm text-gray-600 mt-2">Manage your vehicles</p>
              </a>
              <a
                href="/seller/sales"
                className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">Sales History</p>
                <p className="text-sm text-gray-600 mt-2">View completed sales</p>
              </a>
              <a
                href="/seller/bank-accounts"
                className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">Bank Accounts</p>
                <p className="text-sm text-gray-600 mt-2">Manage payment accounts</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
