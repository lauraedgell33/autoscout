'use client'

import { useState, useEffect } from 'react'
import { verificationService, Dispute } from '@/lib/api/verification'
import { useRouter, useParams } from 'next/navigation'

export default function DisputeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const disputeId = params.id as string

  const [dispute, setDispute] = useState<Dispute | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadDispute()
  }, [disputeId])

  const loadDispute = async () => {
    try {
      const data = await verificationService.getDisputeById(disputeId)
      setDispute(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dispute')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(files)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    setSending(true)

    try {
      await verificationService.addDisputeMessage(disputeId, message, attachments)
      setSuccess('Message sent successfully')
      setMessage('')
      setAttachments([])
      // Reload dispute to show new message
      await loadDispute()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message')
    } finally {
      setSending(false)
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
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Dispute Not Found</h2>
            <button
              onClick={() => router.push('/dashboard/disputes')}
              className="text-blue-900 hover:text-blue-700"
            >
              ← Back to Disputes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/disputes')}
            className="text-blue-900 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Disputes
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                Dispute #{dispute.id.slice(0, 8)}
              </h1>
              <p className="text-gray-600">Transaction ID: {dispute.transaction_id.slice(0, 8)}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(
                dispute.status
              )}`}
            >
              {dispute.status}
            </span>
          </div>
        </div>

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

        {/* Dispute Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Dispute Details</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Reason</p>
              <p className="font-semibold text-gray-900">{dispute.reason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-semibold text-gray-900">
                {new Date(dispute.created_at).toLocaleDateString()} at{' '}
                {new Date(dispute.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-700 whitespace-pre-wrap">{dispute.description}</p>
          </div>

          {dispute.resolution && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-900 mb-2">Resolution</p>
              <p className="text-sm text-green-700 whitespace-pre-wrap">{dispute.resolution}</p>
              {dispute.resolved_at && (
                <p className="text-xs text-green-600 mt-2">
                  Resolved on: {new Date(dispute.resolved_at).toLocaleDateString()} at{' '}
                  {new Date(dispute.resolved_at).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Add Message Form */}
        {dispute.status !== 'closed' && dispute.status !== 'resolved' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Add Message</h2>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide additional information about your dispute..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {(attachments || []).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map((file, index) => (
                      <p key={index} className="text-sm text-green-600">
                        ✓ {file.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4">
            <span className="text-3xl">🎧</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Need Immediate Assistance?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Our dispute resolution team is here to help you resolve this issue quickly and fairly.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:disputes@autoscout24-safetrade.com"
                  className="block text-sm text-blue-900 font-semibold hover:text-blue-700"
                >
                  📧 disputes@autoscout24-safetrade.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="block text-sm text-blue-900 font-semibold hover:text-blue-700"
                >
                  📞 +1 (234) 567-890 (24/7 Support)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
