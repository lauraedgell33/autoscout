'use client'

import { useState, useEffect } from 'react'
import { verificationService, KYCVerification } from '@/lib/api/verification'
import { useRouter } from '@/i18n/routing'

export default function VerificationPage() {
  const router = useRouter()
  const [kycStatus, setKycStatus] = useState<KYCVerification | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    document_type: 'id_card' as 'passport' | 'id_card' | 'drivers_license',
    document_number: '',
    document_front: null as File | null,
    document_back: null as File | null,
    selfie: null as File | null,
  })

  useEffect(() => {
    loadKYCStatus()
  }, [])

  const loadKYCStatus = async () => {
    try {
      const status = await verificationService.getKYCStatus()
      setKycStatus(status)
    } catch (err: any) {
      console.error('Failed to load KYC status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, [field]: file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.document_front || !formData.selfie) {
      setError('Please upload all required documents')
      return
    }

    setSubmitting(true)

    try {
      const result = await verificationService.submitKYC({
        document_type: formData.document_type,
        document_number: formData.document_number,
        document_front: formData.document_front,
        document_back: formData.document_back || undefined,
        selfie: formData.selfie,
      })

      setSuccess('KYC verification submitted successfully! We will review your documents within 24-48 hours.')
      setKycStatus(result)
      
      // Reset form
      setFormData({
        document_type: 'id_card',
        document_number: '',
        document_front: null,
        document_back: null,
        selfie: null,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit verification')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-900 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Identity Verification (KYC)</h1>
          <p className="text-gray-600">
            Verify your identity to unlock full access to buying and selling vehicles
          </p>
        </div>

        {/* Current Status */}
        {kycStatus && (
          <div className={`mb-8 p-6 rounded-lg ${
            kycStatus.status === 'verified' ? 'bg-green-50 border-2 border-green-500' :
            kycStatus.status === 'rejected' ? 'bg-red-50 border-2 border-red-500' :
            'bg-yellow-50 border-2 border-yellow-500'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">
                {kycStatus.status === 'verified' ? '✓' : 
                 kycStatus.status === 'rejected' ? '✗' : '⏳'}
              </span>
              <div>
                <h3 className="font-bold text-lg capitalize">{kycStatus.status}</h3>
                <p className="text-sm text-gray-600">
                  {kycStatus.status === 'verified' && 'Your identity has been verified'}
                  {kycStatus.status === 'pending' && 'Your documents are under review'}
                  {kycStatus.status === 'rejected' && `Verification rejected: ${kycStatus.rejection_reason}`}
                </p>
              </div>
            </div>
            {kycStatus.verified_at && (
              <p className="text-sm text-gray-500 mt-2">
                Verified on: {new Date(kycStatus.verified_at).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Verification Form */}
        {(!kycStatus || kycStatus.status === 'rejected') && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Verification Documents</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  value={formData.document_type}
                  onChange={(e) => setFormData({ ...formData, document_type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="id_card">ID Card</option>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>

              {/* Document Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Number *
                </label>
                <input
                  type="text"
                  value={formData.document_number}
                  onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter document number"
                  required
                />
              </div>

              {/* Document Front */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Front Side * (JPEG, PNG, max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, 'document_front')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.document_front && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.document_front.name}</p>
                )}
              </div>

              {/* Document Back */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Back Side (if applicable)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, 'document_back')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.document_back && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.document_back.name}</p>
                )}
              </div>

              {/* Selfie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selfie with Document * (JPEG, PNG, max 5MB)
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Hold your ID document next to your face for verification
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, 'selfie')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.selfie && (
                  <p className="text-sm text-green-600 mt-2">✓ {formData.selfie.name}</p>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-primary-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="text-primary-600 text-xl">🔒</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Your Data is Protected</h4>
                    <p className="text-sm text-blue-700">
                      All documents are encrypted and stored securely. We comply with GDPR and only use your data for verification purposes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent-500 text-white py-4 rounded-lg font-semibold hover:bg-accent-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        )}

        {/* Verification Benefits */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">✓</div>
            <h3 className="font-bold text-gray-900 mb-2">Trusted Buyer</h3>
            <p className="text-sm text-gray-600">
              Verified buyers get priority access to premium vehicles
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure Transactions</h3>
            <p className="text-sm text-gray-600">
              KYC verification protects both buyers and sellers from fraud
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Faster Process</h3>
            <p className="text-sm text-gray-600">
              Pre-verified users complete purchases up to 3x faster
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
