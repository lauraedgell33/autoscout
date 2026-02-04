'use client'

import { useState, useId } from 'react'
import { useRouter } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Shield, Lock, Headphones, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const t = useTranslations('auth.login')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Generate unique IDs for accessibility
  const formId = useId()
  const emailId = `${formId}-email`
  const passwordId = `${formId}-password`
  const errorId = `${formId}-error`

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
      {/* Skip to main content link for accessibility */}
      <a 
        href="#login-form" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-900 focus:text-white focus:rounded-lg"
      >
        Skip to login form
      </a>
      
      {/* Logo - Hidden on mobile, visible on larger screens */}
      <Link 
        href="/" 
        className="hidden sm:flex absolute top-6 left-6 items-center gap-2 hover:opacity-80 transition"
        aria-label="AutoScout24 Home"
      >
        <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent-500" aria-hidden="true" />
        </div>
        <div>
          <span className="text-lg font-bold text-primary-900">AutoScout24</span>
        </div>
      </Link>

      {/* Card */}
      <main className="w-full max-w-md" id="main-content">
        {/* Mobile Logo */}
        <div className="sm:hidden flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2" aria-label="AutoScout24 Home">
            <div className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-500" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold text-primary-900">AutoScout24</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>
          
          <div className="px-6 pb-6">
            {/* Error Alert */}
            {error && (
              <div 
                id={errorId}
                role="alert"
                aria-live="polite"
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
            
            <form 
              id="login-form"
              onSubmit={handleSubmit} 
              className="space-y-4"
              aria-describedby={error ? errorId : undefined}
              noValidate
            >
              {/* Email Field */}
              <div>
                <label 
                  htmlFor={emailId} 
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  {t('email_label')}
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t('email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  aria-required="true"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              {/* Password Field */}
              <div>
                <label 
                  htmlFor={passwordId} 
                  className="block text-sm font-semibold text-gray-700 mb-1.5"
                >
                  {t('password_label')}
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  <span className="sr-only"> (required)</span>
                </label>
                <div className="relative">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={t('password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    aria-required="true"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all text-sm min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                aria-busy={loading}
                className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>{t('submitting')}</span>
                  </>
                ) : (
                  t('submit')
                )}
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
      </main>
    </div>
  )
}
