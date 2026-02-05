'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const t = useTranslations('auth')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setToken, setUser } = useAuthStore()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading')
  const [message, setMessage] = useState('')
  
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setStatus('no-token')
        setMessage('Invalid verification link. Please check your email and try again.')
        return
      }
      
      try {
        const response = await api.post('/verify-email', { token, email })
        
        if (response.data.token) {
          // Store the new token and user
          setToken(response.data.token)
          setUser(response.data.user)
          localStorage.setItem('auth_token', response.data.token)
        }
        
        setStatus('success')
        setMessage(response.data.message || 'Your email has been verified successfully!')
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          const userType = response.data.user?.user_type || 'buyer'
          if (userType === 'seller') {
            router.push('/seller/dashboard')
          } else {
            router.push('/dashboard/buyer')
          }
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'Failed to verify email. The link may have expired.')
      }
    }
    
    verifyEmail()
  }, [token, email, setToken, setUser, router])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <Link href="/" className="inline-block" aria-label="AutoScout24 Home">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-900 rounded-xl mb-3">
                <Shield className="w-7 h-7 text-accent-500" />
              </div>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              {t('verify_email.title') || 'Email Verification'}
            </h1>
          </div>
          
          <div className="text-center py-8">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 text-accent-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">{t('verify_email.verifying') || 'Verifying your email...'}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('verify_email.success_title') || 'Email Verified!'}
                </h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">
                  {t('verify_email.redirecting') || 'Redirecting to your dashboard...'}
                </p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('verify_email.error_title') || 'Verification Failed'}
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition"
                  >
                    {t('verify_email.go_to_login') || 'Go to Login'}
                  </Link>
                  <Link
                    href="/"
                    className="block w-full px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition"
                  >
                    {t('verify_email.go_home') || 'Go to Homepage'}
                  </Link>
                </div>
              </>
            )}
            
            {status === 'no-token' && (
              <>
                <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('verify_email.invalid_link_title') || 'Invalid Link'}
                </h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-semibold transition"
                >
                  {t('verify_email.go_to_login') || 'Go to Login'}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
