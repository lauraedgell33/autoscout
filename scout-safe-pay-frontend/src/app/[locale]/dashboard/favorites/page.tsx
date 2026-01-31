'use client'

import { Link } from '@/i18n/routing'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Search, Info, TrendingDown } from 'lucide-react'

export default function FavoritesPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-accent-500" />
              My Favorites
            </h1>
            <p className="text-gray-600">Vehicles you've saved for later</p>
          </div>

          {/* Empty State */}
          <Card className="p-8 sm:p-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-accent-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">
                Save vehicles you like to easily find them later
              </p>
              <Link href="/marketplace">
                <Button className="bg-accent-500 hover:bg-accent-600 text-white font-semibold">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Vehicles
                </Button>
              </Link>
            </div>
          </Card>

          {/* Tips */}
          <Card className="mt-6 bg-gradient-to-br from-gray-50 to-white border-none p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  How to save favorites
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <Search className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Browse vehicles in the marketplace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                    <span>Click the heart icon on any vehicle card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                    <span>Access your saved vehicles anytime from this page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingDown className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Get notified when prices drop on your favorites</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
