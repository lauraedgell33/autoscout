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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-blue-900">AutoScout24</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/marketplace" 
              className={`font-medium ${
                isActive('/marketplace') 
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900' 
                  : 'text-gray-700 hover:text-blue-900'
              }`}
            >
              {t('nav.marketplace')}
            </Link>
            <Link 
              href="/how-it-works" 
              className={`font-medium ${
                isActive('/how-it-works') 
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900' 
                  : 'text-gray-700 hover:text-blue-900'
              }`}
            >
              {t('nav.how_it_works')}
            </Link>
            <Link 
              href="/benefits" 
              className={`font-medium ${
                isActive('/benefits') 
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900' 
                  : 'text-gray-700 hover:text-blue-900'
              }`}
            >
              {t('nav.benefits')}
            </Link>
            <Link 
              href="/dealers" 
              className={`font-medium ${
                isActive('/dealers') 
                  ? 'text-blue-900 font-bold border-b-2 border-blue-900' 
                  : 'text-gray-700 hover:text-blue-900'
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
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
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
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link href="/marketplace" className="block text-gray-700 hover:text-blue-900 font-medium">Marketplace</Link>
            <Link href="/how-it-works" className="block text-gray-700 hover:text-blue-900 font-medium">How It Works</Link>
            <Link href="/benefits" className="block text-gray-700 hover:text-blue-900 font-medium">Benefits</Link>
            <Link href="/dealers" className="block text-gray-700 hover:text-blue-900 font-medium">Dealers</Link>
            
            {/* Mobile Language and Currency Switchers */}
            <div className="flex items-center gap-2 pt-2">
              <CurrencySwitcher />
              <LanguageSwitcher />
            </div>
            
            {isAuthenticated ? (
              <>
                <hr />
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                </div>
                <Link
                  href={user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer'}
                  className="block text-gray-700 hover:text-blue-900 font-medium"
                >
                  Dashboard
                </Link>
                {user?.role === 'seller' && (
                  <Link href="/dashboard/vehicles" className="block text-gray-700 hover:text-blue-900 font-medium">
                    My Vehicles
                  </Link>
                )}
                <Link href="/dashboard/profile" className="block text-gray-700 hover:text-blue-900 font-medium">
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-700 hover:text-blue-900 font-medium">Sign In</Link>
                <Link href="/register" className="block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
