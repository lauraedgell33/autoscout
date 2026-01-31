'use client'

import { useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminRedirectPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push('/login?redirect=/admin')
      } else if (user.role !== 'admin') {
        // Not admin - redirect to appropriate dashboard
        const dashboardPath = user.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'
        router.push(dashboardPath)
      } else {
        // Is admin - redirect to Filament admin panel
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002/api'
        const adminUrl = apiUrl.replace('/api', '/admin')
        window.location.href = adminUrl
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
        <p className="text-gray-900 font-semibold text-lg mb-2">
          {loading ? 'Checking credentials...' : 'Redirecting to admin panel...'}
        </p>
        <p className="text-gray-600 text-sm">
          You will be redirected to Filament Admin Panel
        </p>
      </div>
    </div>
  )
}
