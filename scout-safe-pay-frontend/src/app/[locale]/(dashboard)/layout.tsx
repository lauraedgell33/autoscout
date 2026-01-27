'use client'

import { Link } from '@/i18n/routing'
import { authService } from '@/lib/api/auth'
import { useRouter } from '@/i18n/routing'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AutoScout24 Header */}
      <header className="bg-[#076FE6] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
            <div>
              <h1 className="text-2xl font-bold">AutoScout24</h1>
              <p className="text-xs text-blue-100">SafeTrade Payment System</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link href="/transactions" className="hover:text-blue-200 transition">Transactions</Link>
            <button 
              onClick={handleLogout}
              className="bg-white text-[#076FE6] px-4 py-2 rounded-md font-semibold hover:bg-blue-50 transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-6">
          <nav className="space-y-2">
            <Link 
              href="/dashboard" 
              className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#076FE6] transition font-medium"
            >
              📊 Dashboard
            </Link>
            <Link 
              href="/transactions" 
              className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#076FE6] transition font-medium"
            >
              💳 My Transactions
            </Link>
            <Link 
              href="/dashboard/vehicles" 
              className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#076FE6] transition font-medium"
            >
              🚗 Browse Vehicles
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="block px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-[#076FE6] transition font-medium"
            >
              ⚙️ Settings
            </Link>
          </nav>

          {/* SafeTrade Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-[#076FE6]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <h3 className="font-bold text-[#076FE6]">AutoScout24 Guarantee</h3>
            </div>
            <ul className="text-xs text-gray-700 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>24-month warranty</strong> on all vehicles</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Free transport</strong> to your location</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Secure escrow</strong> payment protection</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><strong>Full buyer protection</strong> guarantee</span>
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-[10px] text-gray-500 leading-relaxed">
                All payments are processed by <strong>AutoScout24 GmbH</strong>. Your money is held securely in escrow until delivery confirmation.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto border-t-4 border-[#076FE6]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-[#076FE6]">AutoScout24 SafeTrade</h3>
              <p className="text-sm text-gray-300">
                Europe&apos;s leading online car marketplace with secure payment processing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Our Guarantee</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>→ 24-month comprehensive warranty</li>
                <li>→ Free transport across Europe</li>
                <li>→ Secure escrow payment system</li>
                <li>→ Money-back guarantee</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>📞 +49 89 444 456 789</li>
                <li>📧 safetrade@autoscout24.com</li>
                <li>🕐 24/7 Customer Service</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              © 2026 AutoScout24 GmbH. All payments processed by AutoScout24 with full buyer protection.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              24-month warranty · Free transport · Secure escrow service · Money-back guarantee
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
