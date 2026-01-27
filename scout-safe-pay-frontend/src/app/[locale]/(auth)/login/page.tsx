'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Logo */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 hover:opacity-80 transition">
        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-900">AutoScout24</h1>
          <p className="text-xs text-gray-600">{t('logo_tagline')}</p>
        </div>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border-t-4 border-blue-900">
        <div className="p-6 pb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        
        <div className="px-6 pb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
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
                type="email"
                placeholder={t('email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('password_label')}
              </label>
              <input
                id="password"
                type="password"
                placeholder={t('password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {t('no_account')}{' '}
              <Link href="/register" className="text-blue-900 font-semibold hover:underline">
                {t('signup_link')}
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>{t('secure_login')}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
                </svg>
                <span>{t('support_24_7')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
