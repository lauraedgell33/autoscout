'use client'

import { useState, useId } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { AlertCircle, Eye, EyeOff, Loader2, Check, Shield } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const t = useTranslations('auth.register')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer' as 'buyer' | 'seller'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Generate unique IDs for accessibility
  const formId = useId()
  const nameId = `${formId}-name`
  const emailId = `${formId}-email`
  const phoneId = `${formId}-phone`
  const passwordId = `${formId}-password`
  const confirmPasswordId = `${formId}-confirm-password`
  const userTypeId = `${formId}-user-type`
  const errorId = `${formId}-error`
  const passwordHintId = `${formId}-password-hint`

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']
  const strengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('error_password_mismatch'))
      return
    }

    if (formData.password.length < 8) {
      setError(t('error_password_length'))
      return
    }

    setLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone || undefined,
        user_type: formData.userType,
        country: 'DE',
      })
      // Redirect handled in AuthContext
    } catch (err: unknown) {
      console.error('Register error:', err)
      setError((err as Error).message || t('error_registration_failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#register-form" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-900 focus:text-white focus:rounded-lg"
      >
        Skip to registration form
      </a>
      
      <main className="w-full max-w-md" id="main-content">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block" aria-label="AutoScout24 Home">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-900 rounded-xl mb-3">
                <Shield className="w-7 h-7 text-accent-500" aria-hidden="true" />
              </div>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('title')}</h1>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>

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
            id="register-form"
            onSubmit={handleSubmit} 
            className="space-y-4"
            aria-describedby={error ? errorId : undefined}
            noValidate
          >
            {/* Name Field */}
            <div>
              <label 
                htmlFor={nameId}
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                {t('name_label')}
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <input
                id={nameId}
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t('name_placeholder')}
                required
                disabled={loading}
                aria-required="true"
              />
            </div>

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
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t('email_placeholder')}
                required
                disabled={loading}
                aria-required="true"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label 
                htmlFor={phoneId}
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                {t('phone_label')}
                <span className="text-gray-400 ml-1 font-normal">(optional)</span>
              </label>
              <input
                id={phoneId}
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={t('phone_placeholder')}
                disabled={loading}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t('password_placeholder')}
                  required
                  disabled={loading}
                  aria-required="true"
                  aria-describedby={passwordHintId}
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
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2" id={passwordHintId}>
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500" role="status">
                    Password strength: {strengthLabels[Math.max(0, passwordStrength - 1)]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor={confirmPasswordId}
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                {t('password_confirm_label')}
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </label>
              <div className="relative">
                <input
                  id={confirmPasswordId}
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-500 focus:border-green-500'
                      : formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-primary-500'
                  }`}
                  placeholder={t('password_confirm_placeholder')}
                  required
                  disabled={loading}
                  aria-required="true"
                  aria-invalid={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'true' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
                </button>
              </div>
              {/* Password match indicator */}
              {formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1 text-xs" role="status">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" aria-hidden="true" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
                      <span className="text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Type Field */}
            <fieldset>
              <legend 
                id={userTypeId}
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {t('user_type_label')}
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              </legend>
              <div 
                className="grid grid-cols-2 gap-3"
                role="radiogroup"
                aria-labelledby={userTypeId}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.userType === 'buyer'}
                  onClick={() => setFormData({...formData, userType: 'buyer'})}
                  disabled={loading}
                  className={`px-4 py-3 border-2 rounded-xl text-sm font-medium transition min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.userType === 'buyer'
                      ? 'border-accent-500 bg-accent-50 text-accent-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('user_type_buyer')}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.userType === 'seller'}
                  onClick={() => setFormData({...formData, userType: 'seller'})}
                  disabled={loading}
                  className={`px-4 py-3 border-2 rounded-xl text-sm font-medium transition min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.userType === 'seller'
                      ? 'border-accent-500 bg-accent-50 text-accent-600'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('user_type_seller')}
                </button>
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
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

            <div className="text-center text-sm text-gray-600">
              {t('have_account')}{' '}
              <Link href="/login" className="text-primary-900 hover:text-primary-950 font-semibold hover:underline">
                {t('signin_link')}
              </Link>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">{t('secure_registration')}</span>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <svg className="w-4 h-4 text-primary-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">{t('support_24_7')}</span>
              </div>
              <div>
                <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center mx-auto mb-1">
                  <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">{t('trusted')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
