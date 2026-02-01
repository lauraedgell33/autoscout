'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Shield, Lock, Headphones } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const t = useTranslations('auth.login')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Redirect handled in AuthContext
    } catch (err: unknown) {
      console.error('Login error:', err)
      setError((err as Error).message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Logo - Hidden on mobile, visible on larger screens */}
      <Link href="/" className="hidden sm:flex absolute top-6 left-6 items-center gap-2 hover:opacity-80 transition">
        <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent-500" />
        </div>
        <div>
          <span className="text-lg font-bold text-primary-900">AutoScout24</span>
        </div>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="sm:hidden flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-500" />
            </div>
            <span className="text-lg font-bold text-primary-900">AutoScout24</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('title')}</h2>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>
          
          <div className="px-6 pb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('email_label')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('password_label')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t('password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 text-sm"
              >
                {loading ? t('submitting') : t('submit')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                {t('no_account')}{' '}
                <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                  {t('signup_link')}
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>{t('secure_login')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-primary-600" />
                  <span>{t('support_24_7')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
