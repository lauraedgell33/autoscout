'use client';

import { useTranslations } from 'next-intl';

export default function BuyerDashboard() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('buyer_dashboard')}
          </h1>
          <p className="text-gray-600 mb-8">
            {t('welcome_buyer')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Purchases */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Active Purchases</h2>
              <p className="text-3xl font-bold">0</p>
            </div>

            {/* Pending Payments */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Pending Payments</h2>
              <p className="text-3xl font-bold">0</p>
            </div>

            {/* Saved Vehicles */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Saved Vehicles</h2>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <a
                href="/buyer/purchases"
                className="bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">My Purchases</p>
                <p className="text-sm text-gray-600 mt-2">View and manage purchases</p>
              </a>
              <a
                href="/buyer/transactions"
                className="bg-green-50 hover:bg-green-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">Transactions</p>
                <p className="text-sm text-gray-600 mt-2">Payment history</p>
              </a>
              <a
                href="/buyer/payment-methods"
                className="bg-purple-50 hover:bg-purple-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">Payment Methods</p>
                <p className="text-sm text-gray-600 mt-2">Manage payment options</p>
              </a>
              <a
                href="/buyer/favorites"
                className="bg-pink-50 hover:bg-pink-100 rounded-lg p-6 transition duration-200"
              >
                <p className="font-semibold text-gray-900">Favorites</p>
                <p className="text-sm text-gray-600 mt-2">Saved vehicles</p>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              <p>No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
