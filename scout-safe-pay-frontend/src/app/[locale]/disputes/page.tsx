'use client'

import { useState, useEffect } from 'react'
import { disputeService } from '@/lib/api'
import type { Dispute, CreateDisputeData } from '@/lib/api'
import { useToast, useAsyncOperation } from '@/lib/hooks/useNotifications'
import { LoadingButton, PageLoading } from '@/components/common/Loading'
import { AlertCircle, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const toast = useToast()

  useEffect(() => {
    loadDisputes()
  }, [])

  const loadDisputes = async () => {
    try {
      const data = await disputeService.getMyDisputes()
      setDisputes(data)
    } catch (error) {
      toast.error('Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }

  const filteredDisputes = disputes.filter((d) => {
    if (filter === 'all') return true
    if (filter === 'open') return d.status === 'open' || d.status === 'under_review'
    if (filter === 'resolved') return d.status === 'resolved' || d.status === 'closed'
    return true
  })

  if (loading) return <PageLoading message="Loading disputes..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Disputes</h1>
        <p className="text-gray-600 mt-2">Manage and resolve transaction disputes</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'open'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'resolved'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Resolved
        </button>
      </div>

      {filteredDisputes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No disputes found</h3>
          <p className="mt-2 text-gray-600">
            {filter === 'all'
              ? "You don't have any disputes"
              : `No ${filter} disputes found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} onUpdate={loadDisputes} />
          ))}
        </div>
      )}
    </div>
  )
}

interface DisputeCardProps {
  dispute: Dispute
  onUpdate: () => void
}

function DisputeCard({ dispute, onUpdate }: DisputeCardProps) {
  const [showResponses, setShowResponses] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const { execute, isLoading } = useAsyncOperation()

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!responseMessage.trim()) return

    await execute(
      async () => {
        await disputeService.addResponse(dispute.id, { message: responseMessage })
        setResponseMessage('')
        onUpdate()
      },
      'Response added',
      'Failed to add response'
    )
  }

  const getStatusColor = () => {
    switch (dispute.status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800'
      case 'under_review':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = () => {
    switch (dispute.status) {
      case 'open':
        return <Clock size={16} />
      case 'under_review':
        return <AlertCircle size={16} />
      case 'resolved':
        return <CheckCircle size={16} />
      case 'closed':
        return <XCircle size={16} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{dispute.reason}</h3>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {getStatusIcon()}
                {dispute.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-600">{dispute.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
          <div>
            Transaction: <span className="font-medium">#{dispute.transaction_id}</span>
          </div>
          <div>
            Created: {new Date(dispute.created_at).toLocaleDateString()}
          </div>
          {dispute.resolved_at && (
            <div>
              Resolved: {new Date(dispute.resolved_at).toLocaleDateString()}
            </div>
          )}
        </div>

        {dispute.transaction?.vehicle && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Vehicle:</strong> {dispute.transaction.vehicle.make}{' '}
              {dispute.transaction.vehicle.model} ({dispute.transaction.vehicle.year})
            </p>
          </div>
        )}

        {dispute.resolution && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-1">Resolution:</p>
            <p className="text-sm text-green-800">{dispute.resolution}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setShowResponses(!showResponses)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <MessageCircle size={16} />
            {dispute.responses?.length || 0} Responses
          </button>
        </div>
      </div>

      {showResponses && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Responses</h4>

          {dispute.responses && dispute.responses.length > 0 ? (
            <div className="space-y-4 mb-4">
              {dispute.responses.map((response) => (
                <div
                  key={response.id}
                  className={`p-4 rounded-lg ${
                    response.is_admin_response
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {response.user?.name}
                    </span>
                    {response.is_admin_response && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(response.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{response.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mb-4">No responses yet</p>
          )}

          {dispute.status !== 'closed' && dispute.status !== 'resolved' && (
            <form onSubmit={handleAddResponse} className="space-y-3">
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Add a response..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Response
              </LoadingButton>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

interface CreateDisputeFormProps {
  transactionId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreateDisputeForm({ transactionId, onSuccess, onCancel }: CreateDisputeFormProps) {
  const [formData, setFormData] = useState<Omit<CreateDisputeData, 'transaction_id'>>({
    reason: '',
    description: '',
  })
  const { execute, isLoading } = useAsyncOperation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await execute(
      async () =>
        await disputeService.create({
          transaction_id: transactionId,
          ...formData,
        }),
      'Dispute created successfully',
      'Failed to create dispute'
    )

    if (result && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Open a Dispute</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
          <input
            type="text"
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="E.g., Vehicle not as described"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide detailed information about the issue..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Open Dispute
          </LoadingButton>
        </div>
      </div>
    </form>
  )
}
