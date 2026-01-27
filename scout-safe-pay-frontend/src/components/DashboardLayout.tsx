'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const buyerNav = [
    { name: 'Dashboard', href: '/dashboard/buyer', icon: '📊' },
    { name: 'My Purchases', href: '/dashboard/purchases', icon: '🚗' },
    { name: 'Favorites', href: '/dashboard/favorites', icon: '❤️' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ]

  const sellerNav = [
    { name: 'Dashboard', href: '/dashboard/seller', icon: '📊' },
    { name: 'My Vehicles', href: '/dashboard/vehicles', icon: '🚗' },
    { name: 'Add Vehicle', href: '/dashboard/vehicles/add', icon: '➕' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ]

  const navigation = user?.role === 'seller' ? sellerNav : buyerNav

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-2 text-lg font-bold text-blue-900">AutoScout24</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="text-gray-700 hover:text-blue-900 font-medium text-sm"
            >
              Browse Marketplace
            </Link>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  pathname === item.href
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
            <aside className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <span className="text-lg font-bold text-blue-900">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    logout()
                    setSidebarOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
