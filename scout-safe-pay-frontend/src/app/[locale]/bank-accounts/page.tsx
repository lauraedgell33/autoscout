'use client'

import { useState, useEffect } from 'react'
import { bankAccountService } from '@/lib/api'
import type { BankAccount } from '@/lib/api'
import { useToast, useAsyncOperation } from '@/lib/hooks/useNotifications'
import { LoadingButton, PageLoading } from '@/components/common/Loading'
import { Plus, CreditCard, Check, Trash2, Edit, Star } from 'lucide-react'

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const toast = useToast()
  const { execute, isLoading } = useAsyncOperation()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await bankAccountService.list()
      setAccounts(data)
    } catch (error) {
      toast.error('Failed to load bank accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleSetPrimary = async (id: number) => {
    await execute(
      async () => {
        await bankAccountService.setPrimary(id)
        await loadAccounts()
      },
      'Primary account updated',
      'Failed to update primary account'
    )
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return

    await execute(
      async () => {
        await bankAccountService.delete(id)
        await loadAccounts()
      },
      'Bank account deleted',
      'Failed to delete bank account'
    )
  }

  if (loading) return <PageLoading message="Loading bank accounts..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your bank accounts for payments and payouts</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Bank Account
        </button>
      </div>

      {showAddForm && (
        <AddBankAccountForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            loadAccounts()
          }}
        />
      )}

      {accounts.length === 0 ? (
        <div className="text-center py-16">
          <CreditCard className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No bank accounts</h3>
          <p className="mt-2 text-gray-600">Get started by adding your first bank account</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Bank Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`relative bg-white rounded-lg border-2 p-6 ${
                account.is_primary ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              {account.is_primary && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Star size={12} fill="currentColor" />
                    Primary
                  </span>
                </div>
              )}

              {account.is_verified && (
                <div className="absolute top-4 right-20">
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Check size={12} />
                    Verified
                  </span>
                </div>
              )}

              <div className="mb-4">
                <CreditCard className="text-gray-400" size={32} />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Account Holder</label>
                  <p className="text-sm font-medium text-gray-900">{account.account_holder_name}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">IBAN</label>
                  <p className="text-sm font-mono text-gray-900">{account.iban}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">BIC/SWIFT</label>
                    <p className="text-sm font-mono text-gray-900">{account.bic_swift}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Bank</label>
                    <p className="text-sm text-gray-900">{account.bank_name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                {!account.is_primary && (
                  <LoadingButton
                    isLoading={isLoading}
                    onClick={() => handleSetPrimary(account.id)}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium"
                  >
                    Set as Primary
                  </LoadingButton>
                )}
                <button
                  onClick={() => handleDelete(account.id)}
                  disabled={account.is_primary}
                  className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface AddBankAccountFormProps {
  onClose: () => void
  onSuccess: () => void
}

function AddBankAccountForm({ onClose, onSuccess }: AddBankAccountFormProps) {
  const [formData, setFormData] = useState({
    account_holder_name: '',
    iban: '',
    bic_swift: '',
    bank_name: '',
    is_primary: false,
  })
  const { execute, isLoading } = useAsyncOperation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await execute(
      async () => await bankAccountService.create(formData),
      'Bank account added successfully',
      'Failed to add bank account'
    )
    if (result) onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Bank Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              required
              value={formData.account_holder_name}
              onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
            <input
              type="text"
              required
              value={formData.iban}
              onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="RO49AAAA1B31007593840000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">BIC/SWIFT</label>
            <input
              type="text"
              required
              value={formData.bic_swift}
              onChange={(e) => setFormData({ ...formData, bic_swift: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              placeholder="AAAAROBB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              required
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary}
              onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_primary" className="ml-2 text-sm text-gray-700">
              Set as primary account
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <LoadingButton
              isLoading={isLoading}
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Account
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  )
}
