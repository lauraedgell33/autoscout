'use client'

import Link from 'next/link'
import { usePathname } from '@/i18n/routing'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { ThemeToggle } from './ui/ThemeToggle'
import { MobileNav, MobileNavLink, MobileNavSection, MobileNavDivider } from './mobile/MobileNav'
import { ChevronDown, User, Settings, LogOut, LayoutDashboard, Car } from 'lucide-react'

export default function Navigation() {
  const t = useTranslations()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    // Wrapped in RAF to avoid synchronous setState warning
    const frame = requestAnimationFrame(() => {
      setMobileMenuOpen(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return (
    <nav 
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-lg"
              aria-label="AutoScout24 Home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-blue-700 bg-clip-text text-transparent">
                AutoScout24
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/marketplace" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isActive('/marketplace') 
                  ? 'text-[var(--color-primary)] font-bold bg-primary-50 dark:bg-primary-900/30' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-current={isActive('/marketplace') ? 'page' : undefined}
            >
              {t('nav.marketplace')}
            </Link>
            <Link 
              href="/how-it-works" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isActive('/how-it-works') 
                  ? 'text-[var(--color-primary)] font-bold bg-primary-50 dark:bg-primary-900/30' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-current={isActive('/how-it-works') ? 'page' : undefined}
            >
              {t('nav.how_it_works')}
            </Link>
            <Link 
              href="/benefits" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isActive('/benefits') 
                  ? 'text-[var(--color-primary)] font-bold bg-primary-50 dark:bg-primary-900/30' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-current={isActive('/benefits') ? 'page' : undefined}
            >
              {t('nav.benefits')}
            </Link>
            <Link 
              href="/dealers" 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isActive('/dealers') 
                  ? 'text-[var(--color-primary)] font-bold bg-primary-50 dark:bg-primary-900/30' 
                  : 'text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-current={isActive('/dealers') ? 'page' : undefined}
            >
              {t('nav.dealers')}
            </Link>

            {/* Language, Currency, and Theme Switchers */}
            <div className="flex items-center gap-2 ml-2">
              <ThemeToggle />
              <CurrencySwitcher />
              <LanguageSwitcher />
            </div>
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] font-medium min-h-[44px] px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label={`User menu for ${user?.name}`}
                >
                  <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user?.name}</span>
                  <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[var(--z-dropdown)]"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <Link
                      href={(user?.user_type || user?.role) === 'seller' || (user?.user_type || user?.role) === 'dealer' ? '/dashboard/seller' : '/dashboard/buyer'}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <LayoutDashboard size={18} aria-hidden="true" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                      role="menuitem"
                    >
                      <Settings size={18} aria-hidden="true" />
                      <span>Profile Settings</span>
                    </Link>
                    {((user?.user_type || user?.role) === 'seller' || (user?.user_type || user?.role) === 'dealer') && (
                      <Link
                        href="/dashboard/vehicles"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                      >
                        <Car size={18} aria-hidden="true" />
                        <span>My Vehicles</span>
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100 dark:border-gray-700" aria-hidden="true" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-[var(--color-error)] hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors min-h-[44px] focus:outline-none focus-visible:bg-red-50 dark:focus-visible:bg-red-900/30"
                      role="menuitem"
                    >
                      <LogOut size={18} aria-hidden="true" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 dark:text-gray-200 hover:text-[var(--color-primary)] font-medium min-h-[44px] flex items-center px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-[var(--color-accent)] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 min-h-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <CurrencySwitcher />
            <LanguageSwitcher />
            <MobileNav
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MobileNavSection>
                <MobileNavLink href="/marketplace" onClick={() => setMobileMenuOpen(false)} active={isActive('/marketplace')}>
                  {t('nav.marketplace')}
                </MobileNavLink>
                <MobileNavLink href="/how-it-works" onClick={() => setMobileMenuOpen(false)} active={isActive('/how-it-works')}>
                  {t('nav.how_it_works')}
                </MobileNavLink>
                <MobileNavLink href="/benefits" onClick={() => setMobileMenuOpen(false)} active={isActive('/benefits')}>
                  {t('nav.benefits')}
                </MobileNavLink>
                <MobileNavLink href="/dealers" onClick={() => setMobileMenuOpen(false)} active={isActive('/dealers')}>
                  {t('nav.dealers')}
                </MobileNavLink>
              </MobileNavSection>

              {isAuthenticated ? (
                <>
                  <MobileNavDivider />
                  <div className="px-4 py-3 bg-primary-50 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-primary)]">{user?.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <MobileNavSection>
                    <MobileNavLink href={(user?.user_type || user?.role) === 'seller' || (user?.user_type || user?.role) === 'dealer' ? '/dashboard/seller' : '/dashboard/buyer'} onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard size={20} aria-hidden="true" />
                      <span>Dashboard</span>
                    </MobileNavLink>
                    {((user?.user_type || user?.role) === 'seller' || (user?.user_type || user?.role) === 'dealer') && (
                      <MobileNavLink href="/dashboard/vehicles" onClick={() => setMobileMenuOpen(false)}>
                        <Car size={20} aria-hidden="true" />
                        <span>My Vehicles</span>
                      </MobileNavLink>
                    )}
                    <MobileNavLink href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Settings size={20} aria-hidden="true" />
                      <span>Profile Settings</span>
                    </MobileNavLink>
                  </MobileNavSection>
                  <MobileNavDivider />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-[var(--color-error)] hover:bg-red-50 font-medium transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)]"
                  >
                    <LogOut size={20} aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <MobileNavDivider />
                  <MobileNavSection>
                    <MobileNavLink href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <User size={20} aria-hidden="true" />
                      <span>{t('nav.login')}</span>
                    </MobileNavLink>
                  </MobileNavSection>
                  <Link 
                    href="/register" 
                    className="block bg-gradient-to-r from-[var(--color-accent)] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-lg font-semibold text-center shadow-lg transition-all duration-300 hover:scale-[1.02] min-h-[52px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </MobileNav>
          </div>
        </div>
      </div>
    </nav>
  )
}
