'use client'

import Link from 'next/link'
import { usePathname } from '@/i18n/routing'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'

export default function Navigation() {
  const t = useTranslations()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                AutoScout24
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/marketplace" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/marketplace') 
                  ? 'text-blue-900 font-bold bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.marketplace')}
            </Link>
            <Link 
              href="/how-it-works" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/how-it-works') 
                  ? 'text-blue-900 font-bold bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.how_it_works')}
            </Link>
            <Link 
              href="/benefits" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/benefits') 
                  ? 'text-blue-900 font-bold bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.benefits')}
            </Link>
            <Link 
              href="/dealers" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/dealers') 
                  ? 'text-blue-900 font-bold bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-900 hover:bg-gray-50'
              }`}
            >
              {t('nav.dealers')}
            </Link>

            {/* Language and Currency Switchers */}
            <div className="flex items-center gap-2 ml-2">
              <CurrencySwitcher />
              <LanguageSwitcher />
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-900 font-medium"
                >
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      href={user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    {user?.role === 'seller' && (
                      <Link
                        href="/dashboard/vehicles"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Vehicles
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-blue-900 font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 animate-slide-in-left">
          <div className="px-4 py-3 space-y-1 bg-gradient-to-b from-white to-gray-50">
            <Link 
              href="/marketplace" 
              className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏪 Marketplace
            </Link>
            <Link 
              href="/how-it-works" 
              className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              ℹ️ How It Works
            </Link>
            <Link 
              href="/benefits" 
              className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              ⭐ Benefits
            </Link>
            <Link 
              href="/dealers" 
              className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏢 Dealers
            </Link>
            
            {/* Mobile Language and Currency Switchers */}
            <div className="flex items-center gap-2 pt-2 px-4 animate-fade-in animation-delay-1000">
              <CurrencySwitcher />
              <LanguageSwitcher />
            </div>
            
            {isAuthenticated ? (
              <>
                <hr className="my-3" />
                <div className="flex items-center gap-3 text-blue-900 font-bold px-4 py-2 animate-fade-in animation-delay-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{user?.name}</p>
                    <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Link
                  href={user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'}
                  className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                {user?.role === 'seller' && (
                  <Link 
                    href="/dashboard/vehicles" 
                    className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🚗 My Vehicles
                  </Link>
                )}
                <Link 
                  href="/dashboard/profile" 
                  className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ⚙️ Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:bg-red-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-1000"
                >
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <>
                <hr className="my-3" />
                <Link 
                  href="/login" 
                  className="block text-gray-700 hover:text-blue-900 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all duration-200 animate-fade-in animation-delay-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔑 Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="block bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-center shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in animation-delay-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🚀 Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
