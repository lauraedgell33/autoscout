'use client'

import { Link } from '@/i18n/routing'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

export default function FavoritesPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">Vehicles you've saved for later</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">
                Save vehicles you like to easily find them later
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Browse Vehicles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">How to save favorites</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Browse vehicles in the marketplace</li>
                  <li>• Click the heart icon on any vehicle card</li>
                  <li>• Access your saved vehicles anytime from this page</li>
                  <li>• Get notified when prices drop on your favorites</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
