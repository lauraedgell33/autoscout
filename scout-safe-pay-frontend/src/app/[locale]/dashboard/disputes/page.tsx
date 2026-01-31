'use client'

import { useState, useEffect } from 'react'
import { verificationService, Dispute } from '@/lib/api/verification'
import { useRouter } from '@/i18n/routing'
import { Link } from '@/i18n/routing'

export default function DisputesPage() {
  const router = useRouter()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDisputes()
  }, [])

  const loadDisputes = async () => {
    try {
      const data = await verificationService.getMyDisputes()
      setDisputes(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'investigating':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-900 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Disputes</h1>
              <p className="text-gray-600">Manage and track your transaction disputes</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        {/* Disputes List */}
        {disputes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Disputes</h3>
            <p className="text-gray-600 mb-6">
              You have no active disputes. All your transactions are proceeding smoothly!
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Dispute #{dispute.id.slice(0, 8)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
                          dispute.status
                        )}`}
                      >
                        {dispute.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Transaction ID: {dispute.transaction_id.slice(0, 8)}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/disputes/${dispute.id}`}
                    className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                  >
                    View Details
                  </Link>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Reason</p>
                      <p className="font-semibold text-gray-900">{dispute.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Created</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(dispute.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-gray-700 line-clamp-2">{dispute.description}</p>
                  </div>

                  {dispute.resolution && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-green-900 mb-1">Resolution</p>
                      <p className="text-sm text-green-700">{dispute.resolution}</p>
                      {dispute.resolved_at && (
                        <p className="text-xs text-green-600 mt-2">
                          Resolved on: {new Date(dispute.resolved_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4">
            <span className="text-3xl">💬</span>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Need Help with a Dispute?</h3>
              <p className="text-sm text-blue-700 mb-4">
                Our support team is available 24/7 to assist you with any transaction issues.
              </p>
              <div className="flex gap-4">
                <a
                  href="mailto:disputes@autoscout24-safetrade.com"
                  className="text-sm text-gray-900 font-semibold hover:text-blue-700"
                >
                  📧 disputes@autoscout24-safetrade.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="text-sm text-gray-900 font-semibold hover:text-blue-700"
                >
                  📞 +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
