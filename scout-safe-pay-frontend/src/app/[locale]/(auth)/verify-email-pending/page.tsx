'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'
import { Shield, Mail, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VerifyEmailPendingPage() {
  const t = useTranslations('auth')
  const { user } = useAuth()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  
  const handleResend = async () => {
    setResending(true)
    try {
      await apiClient.post('/resend-verification-email')
      setResent(true)
      toast.success('Verification email sent!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend email')
    } finally {
      setResending(false)
    }
  }
  
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
              {t('verify_email.pending_title') || 'Verify Your Email'}
            </h1>
          </div>
          
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-accent-500" />
            </div>
            
            <p className="text-gray-600 mb-2">
              {t('verify_email.pending_message') || "We've sent a verification email to:"}
            </p>
            
            <p className="font-semibold text-gray-900 mb-4">
              {user?.email || 'your email address'}
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              {t('verify_email.pending_instructions') || 'Please click the link in the email to verify your account. The link will expire in 24 hours.'}
            </p>
            
            <div className="space-y-3">
              {resent ? (
                <div className="flex items-center justify-center gap-2 text-green-600 py-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {t('verify_email.resent_success') || 'Email sent! Check your inbox.'}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('verify_email.resending') || 'Sending...'}
                    </>
                  ) : (
                    t('verify_email.resend_button') || 'Resend Verification Email'
                  )}
                </button>
              )}
              
              <Link
                href="/"
                className="block w-full px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition text-center"
              >
                {t('verify_email.go_home') || 'Go to Homepage'}
              </Link>
            </div>
            
            <p className="mt-6 text-xs text-gray-400">
              {t('verify_email.spam_notice') || "Didn't receive the email? Check your spam folder."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
