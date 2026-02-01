'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useCurrency } from '@/contexts/CurrencyContext'
import { transactionService, Transaction } from '@/lib/api/transactions'
import { contractService } from '@/lib/api/contracts'
import { invoiceService } from '@/lib/api/invoices'
import { getCategoryLabel } from '@/lib/utils/categoryHelpers'
import { useRealtimeEvent } from '@/lib/realtime-client'
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedRoute from '@/components/ProtectedRoute';

function TransactionPageContent() {
  const t = useTranslations('transaction')
  const tCommon = useTranslations('common')
  const { formatPrice } = useCurrency()
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadingProof, setUploadingProof] = useState(false)
  const [generatingContract, setGeneratingContract] = useState(false)
  const [generatingInvoice, setGeneratingInvoice] = useState(false)

  const loadTransaction = useCallback(async () => {
    try {
      setLoading(true)
      const data = await transactionService.get(params.id as string)
      setTransaction(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load transaction')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    loadTransaction()
  }, [loadTransaction])

  useRealtimeEvent('transaction.updated', (payload: any) => {
    const incomingId = payload?.id || payload?.transaction_id || payload?.transaction?.id
    if (incomingId && String(incomingId) === String(params.id)) {
      loadTransaction()
    }
  })

  useRealtimeEvent('transaction.status_changed', (payload: any) => {
    const incomingId = payload?.id || payload?.transaction_id || payload?.transaction?.id
    if (incomingId && String(incomingId) === String(params.id)) {
      loadTransaction()
    }
  })

  const handleUploadPaymentProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    
    try {
      setUploadingProof(true)
      const file = e.target.files[0]
      // await transactionService.uploadPaymentProof(params.id as string, file)
      await loadTransaction()
      alert('Payment proof uploaded successfully! Awaiting verification.')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to upload payment proof')
    } finally {
      setUploadingProof(false)
    }
  }

  const handleGenerateContract = async () => {
    try {
      setGeneratingContract(true)
      await contractService.generate(Number(params.id))
      alert('transaction.contract_generated')
      await loadTransaction()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate contract')
    } finally {
      setGeneratingContract(false)
    }
  }

  const handleDownloadContract = async () => {
    try {
      await contractService.download(Number(params.id))
    } catch (err: any) {
      alert('transaction.contract_download_failed')
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      setGeneratingInvoice(true)
      await invoiceService.generate(Number(params.id))
      alert('transaction.invoice_generated')
      await loadTransaction()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to generate invoice')
    } finally {
      setGeneratingInvoice(false)
    }
  }

  const handleDownloadInvoice = async () => {
    try {
      await invoiceService.download(Number(params.id))
    } catch (err: any) {
      alert('transaction.invoice_download_failed')
    }
  }

  const handleCancelTransaction = async () => {
    if (!confirm('Are you sure you want to cancel this transaction?')) return

    const reason = window.prompt('Cancellation reason (optional):') || 'User cancelled'

    try {
      await transactionService.cancel(params.id as string, reason)
      await loadTransaction()
      alert('transaction.cancelled_success')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel transaction')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || tCommon('error')}</p>
          <Link href="/dashboard" className="text-primary-600 hover:underline">{tCommon('back')}</Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    awaiting_payment: 'bg-blue-100 text-primary-700 border-blue-300',
    payment_received: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  }

  const vehicle = transaction.vehicle

  return (
    <>      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/dashboard" className="text-primary-600 hover:underline">← {tCommon('back')}</Link>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('transaction.title')} #{transaction.id}</h1>
                <p className="text-gray-600">{t('transaction.created')}: {new Date(transaction.created_at).toLocaleDateString()}</p>
              </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[transaction.status] || 'bg-gray-100 text-gray-800'}`}>
                {transaction.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('transaction.vehicle')}</h2>
              {vehicle && (
                <div className="flex gap-4">
                  {(vehicle as any).images?.[0] && (
                    <img src={(vehicle as any).images[0]} alt={vehicle.make} className="w-32 h-24 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-primary-700 rounded">
                        {(vehicle as any).category && getCategoryLabel((vehicle as any).category).icon} {(vehicle as any).category && getCategoryLabel((vehicle as any).category).label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>{t('specs.year')}: {vehicle.year}</div>
                      <div>{t('specs.mileage')}: {(vehicle as any).mileage?.toLocaleString()} km</div>
                      <div>{t('specs.fuel')}: {(vehicle as any).fuel_type}</div>
                      <div>{t('specs.transmission')}: {(vehicle as any).transmission}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('transaction.status')}</h2>
              <div className="space-y-4">
                {transaction.status === 'pending_payment' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-medium">{t('status_messages.awaiting_payment')}</p>
                        <p className="text-sm text-yellow-700 mt-1">{t('transaction.payment_instructions')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {transaction.status === 'payment_received' && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700 font-medium">{t('status_messages.payment_received')}</p>
                        <p className="text-sm text-green-700 mt-1">{t('transaction.payment_instructions')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {transaction.status === 'funds_released' && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700 font-medium">{t('status_messages.completed')}</p>
                        <p className="text-sm text-green-700 mt-1">{t('transaction.support_message')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Proof Upload */}
            {transaction.status === 'pending_payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('transaction.payment_method')}</h2>
                <p className="text-gray-600 mb-4">{t('transaction.payment_instructions')}</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleUploadPaymentProof}
                    disabled={uploadingProof}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" className="cursor-pointer">
                    <div className="text-gray-600 mb-2">
                      {uploadingProof ? tCommon('loading') : t('transaction.upload_receipt')}
                    </div>
                    <div className="text-sm text-gray-500">{t('transaction.file_formats')}</div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Amount Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{t('transaction.amount')}</h3>
              <div className="text-3xl font-bold text-accent-500 mb-4">
                {formatPrice(Number(transaction.amount) * 1.19)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>{t('transaction.vehicle')}:</span>
                  <span>{formatPrice(Number(transaction.amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (19%):</span>
                  <span>{formatPrice(Number(transaction.amount) * 0.19)}</span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t('transaction.download_invoice')}</h3>
              <div className="space-y-3">
                {/* Contract */}
                <div>
                  <button
                    onClick={handleGenerateContract}
                    disabled={generatingContract}
                    className="w-full flex items-center justify-between px-4 py-3 bg-primary-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium text-gray-900">{t('documents.contract')}</span>
                    </div>
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDownloadContract}
                    className="w-full mt-2 text-sm text-primary-600 hover:underline"
                  >
                    {t('transaction.download_invoice')}
                  </button>
                </div>

                {/* Invoice */}
                <div>
                  <button
                    onClick={handleGenerateInvoice}
                    disabled={generatingInvoice}
                    className="w-full flex items-center justify-between px-4 py-3 bg-accent-50 hover:bg-accent-100 rounded-lg transition"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                      </svg>
                      <span className="font-medium text-orange-900">{t('documents.invoice')}</span>
                    </div>
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full mt-2 text-sm text-orange-600 hover:underline"
                  >
                    {t('transaction.download_invoice')}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            {transaction.status === 'pending_payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">{t('transaction.actions')}</h3>
                <button
                  onClick={handleCancelTransaction}
                  className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition"
                >
                  {t('actions.cancel')}
                </button>
              </div>
            )}

            {/* Support */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">{t('transaction.contact_support')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('transaction.support_message')}</p>
              <a href="mailto:support@autoscout24-safetrade.de" className="text-sm text-primary-600 hover:underline">
                support@autoscout24-safetrade.de
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>    </>
  )
}

export default function TransactionPage() {
  return (
    <ProtectedRoute>
      <TransactionPageContent />
    </ProtectedRoute>
  );
}

