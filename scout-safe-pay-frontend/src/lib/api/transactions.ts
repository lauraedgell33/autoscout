import apiClient from './client'
import { PaginationMeta } from '@/types/api'

export interface Transaction {
  id: string
  vehicle_id: string
  buyer_id: string
  seller_id: string
  amount: string
  status: 'pending_payment' | 'payment_received' | 'inspection_scheduled' | 'inspection_completed' | 'funds_released' | 'dispute' | 'refunded' | 'cancelled'
  payment_method: 'bank_transfer'
  buyer_bank_receipt?: string
  autoscout_confirmation?: string
  inspection_date?: string
  inspection_notes?: string
  dispute_reason?: string
  created_at: string
  updated_at: string
  vehicle?: {
    id: string
    make: string
    model: string
    year: number
    price: string
    main_image?: string
  }
  buyer?: {
    id: string
    name: string
    email: string
  }
  seller?: {
    id: string
    name: string
    email: string
  }
}

export interface BankTransferDetails {
  account_holder: string
  iban: string
  bic_swift: string
  bank_name: string
  reference: string
  amount: string
  currency: string
}

export interface CreateTransactionData {
  vehicle_id: string
  amount: string
  payment_method: 'bank_transfer'
}

export const transactionService = {
  async create(data: CreateTransactionData): Promise<{ transaction: Transaction; bank_details: BankTransferDetails }> {
    const response = await apiClient.post<{ transaction: Transaction; bank_details: BankTransferDetails }>('/transactions', data)
    return response
  },

  async list(filters?: {
    status?: string
    vehicle_id?: string
    page?: number
    per_page?: number
  }): Promise<{ data: Transaction[]; meta: PaginationMeta }> {
    const response = await apiClient.get<{ data: Transaction[]; meta: PaginationMeta }>('/transactions', { params: filters })
    return response
  },

  async get(id: string): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`)
    return response
  },

  async uploadReceipt(id: string, receipt: File): Promise<Transaction> {
    const formData = new FormData()
    formData.append('receipt', receipt)
    const response = await apiClient.post<Transaction>(`/transactions/${id}/upload-receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  },

  async confirmPayment(id: string, notes?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/confirm-payment`, { confirmation_notes: notes })
    return response
  },

  async scheduleInspection(id: string, inspection_date: string, notes?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/schedule-inspection`, { inspection_date, inspection_notes: notes })
    return response
  },

  async completeInspection(id: string, result: 'approved' | 'rejected', notes?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/complete-inspection`, { inspection_result: result, inspection_notes: notes })
    return response
  },

  async releaseFunds(id: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/release-funds`)
    return response
  },

  async raiseDispute(id: string, reason: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/raise-dispute`, { dispute_reason: reason })
    return response
  },

  async refund(id: string, reason?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/refund`, { reason })
    return response
  },

  async cancel(id: string, reason?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/cancel`, { reason })
    return response
  },

  async statistics(): Promise<{
    total: number
    pending_payment: number
    payment_received: number
    completed: number
    disputed: number
    total_value: string
  }> {
    const response = await apiClient.get<{
      total: number
      pending_payment: number
      payment_received: number
      completed: number
      disputed: number
      total_value: string
    }>('/transactions/statistics')
    return response
  },

  formatStatus(status: Transaction['status']): { label: string; color: string } {
    const statusMap: Record<Transaction['status'], { label: string; color: string }> = {
      pending_payment: { label: 'Pending Payment', color: 'orange' },
      payment_received: { label: 'Payment Received', color: 'blue' },
      inspection_scheduled: { label: 'Inspection Scheduled', color: 'purple' },
      inspection_completed: { label: 'Inspection Completed', color: 'indigo' },
      funds_released: { label: 'Completed', color: 'green' },
      dispute: { label: 'Disputed', color: 'red' },
      refunded: { label: 'Refunded', color: 'gray' },
      cancelled: { label: 'Cancelled', color: 'gray' }
    }
    return statusMap[status] || { label: status, color: 'gray' }
  },

  getNextAction(transaction: Transaction, userRole: 'buyer' | 'seller' | 'admin'): string | null {
    if (userRole === 'buyer') {
      if (transaction.status === 'pending_payment') return 'Upload bank transfer receipt'
      if (transaction.status === 'payment_received') return 'Schedule inspection'
      if (transaction.status === 'inspection_scheduled') return 'Complete inspection'
      if (transaction.status === 'inspection_completed') return 'Waiting for funds release'
    }
    
    if (userRole === 'seller') {
      if (transaction.status === 'pending_payment') return 'Waiting for buyer payment'
      if (transaction.status === 'payment_received') return 'Prepare vehicle for inspection'
      if (transaction.status === 'inspection_completed') return 'Waiting for funds release'
      if (transaction.status === 'funds_released') return 'Transaction completed'
    }
    
    if (userRole === 'admin') {
      if (transaction.status === 'pending_payment') return 'Waiting for payment'
      if (transaction.status === 'payment_received') return 'Confirm payment received'
      if (transaction.status === 'inspection_completed') return 'Release funds to seller'
      if (transaction.status === 'dispute') return 'Resolve dispute'
    }
    
    return null
  }
}

export default transactionService
