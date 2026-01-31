'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardLayout from '@/components/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Search, Shield, Clock, Headphones } from 'lucide-react'

export default function PurchasesPage() {
  const t = useTranslations('dashboard.purchases')
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['buyer']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-accent-500" />
              My Purchases
            </h1>
            <p className="text-gray-600">Track your vehicle purchases and transactions</p>
          </div>

          {/* Empty State */}
          <Card className="p-8 sm:p-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h2>
              <p className="text-gray-600 mb-6">
                Start browsing our marketplace to find your perfect vehicle
              </p>
              <Link href="/marketplace">
                <Button className="bg-accent-500 hover:bg-accent-600 text-white font-semibold">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Vehicles
                </Button>
              </Link>
            </div>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Secure Payments</h3>
              </div>
              <p className="text-sm text-gray-700">
                All transactions protected with SafeTrade escrow service
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Fast Processing</h3>
              </div>
              <p className="text-sm text-gray-700">
                Quick verification and approval process for all purchases
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Full Support</h3>
              </div>
              <p className="text-sm text-gray-700">
                24/7 customer support for all your purchase queries
              </p>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
