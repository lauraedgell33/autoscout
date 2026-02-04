'use client'

import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Receipt, 
  Car, 
  Settings, 
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const t = useTranslations()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/transactions', icon: Receipt, label: 'Transactions' },
    { href: '/marketplace', icon: Car, label: 'Browse Vehicles' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive(item.href)
          ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/30'
          : 'text-gray-600 hover:bg-gray-100 hover:text-primary-900'
      }`}
      onClick={() => setMobileMenuOpen(false)}
    >
      <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
        isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-primary-900'
      }`} />
      {!sidebarCollapsed && (
        <span className="font-medium whitespace-nowrap">{item.label}</span>
      )}
    </Link>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-primary-900 text-white p-4 rounded-full shadow-xl hover:bg-primary-950 transition-all"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-40
          h-[calc(100vh-4rem)] bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-72'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Collapse Button - Desktop only */}
            <div className="hidden lg:flex justify-end p-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary-900 transition-colors"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            {/* SafeTrade Guarantee Card */}
            {!sidebarCollapsed && (
              <div className="p-4 m-3 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-primary-900 rounded-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-primary-900 text-sm">SafeTrade Guarantee</h3>
                </div>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>24-month warranty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Secure escrow payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Full buyer protection</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Collapsed state shield icon */}
            {sidebarCollapsed && (
              <div className="p-3 flex justify-center">
                <div className="p-3 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                  <Shield className="w-5 h-5 text-primary-900" />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`
          flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
        `}>
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
