import apiClient from './client'
import { PaginationMeta } from '@/types/api'

// Transaction status types - synced with backend
export type TransactionStatus = 
  | 'pending'           // Initial state
  | 'pending_payment'   // Alias for pending
  | 'payment_received'  // Payment proof uploaded or confirmed
  | 'payment_verified'  // Admin verified payment
  | 'inspection_scheduled'
  | 'inspection_completed'
  | 'inspection_failed'
  | 'inspection_passed'
  | 'completed'         // Funds released, transaction done
  | 'funds_released'    // Alias for completed
  | 'dispute'
  | 'refunded'
  | 'cancelled'

export interface Transaction {
  id: string | number
  transaction_code?: string
  vehicle_id: string | number
  buyer_id: string | number
  seller_id: string | number
  dealer_id?: string | number | null
  amount: string
  currency?: string
  service_fee?: string
  status: TransactionStatus
  payment_method?: 'bank_transfer'
  payment_reference?: string
  payment_proof?: string
  payment_proof_uploaded_at?: string
  payment_confirmed_at?: string
  payment_verified_at?: string
  inspection_date?: string
  completed_at?: string
  cancelled_at?: string
  notes?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
  vehicle?: {
    id: string | number
    make: string
    model: string
    year: number
    price: string
    primary_image?: string
    main_image?: string
  }
  buyer?: {
    id: string | number
    name: string
    email: string
  }
  seller?: {
    id: string | number
    name: string
    email: string
  }
  dealer?: {
    id: string | number
    name: string
  } | null
  invoice?: unknown
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
  vehicle_id: string | number
  amount?: string | number
  payment_method?: 'bank_transfer'
}

export const transactionService = {
  async create(data: CreateTransactionData): Promise<{ message: string; transaction: Transaction; bank_details?: BankTransferDetails }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction; bank_details?: BankTransferDetails }>('/transactions', data)
    return response
  },

  async list(filters?: {
    status?: string
    vehicle_id?: string
    page?: number
    per_page?: number
  }): Promise<{ data: Transaction[]; meta?: PaginationMeta; current_page?: number; last_page?: number; total?: number }> {
    const response = await apiClient.get<{ data: Transaction[]; meta?: PaginationMeta; current_page?: number; last_page?: number; total?: number }>('/transactions', { params: filters })
    return response
  },

  async get(id: string | number): Promise<Transaction> {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`)
    return response
  },

  async uploadReceipt(id: string | number, receipt: File): Promise<Transaction> {
    const formData = new FormData()
    formData.append('receipt', receipt)
    const response = await apiClient.post<Transaction>(`/transactions/${id}/upload-receipt`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  },

  async uploadPaymentProof(id: string | number, proof: File, paymentDate?: string, notes?: string): Promise<{ message: string; transaction: Transaction }> {
    const formData = new FormData()
    formData.append('proof', proof)
    if (paymentDate) formData.append('payment_date', paymentDate)
    if (notes) formData.append('notes', notes)
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(`/transactions/${id}/upload-payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  },

  async confirmPayment(id: string | number, notes?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/confirm-payment`, { confirmation_notes: notes })
    return response
  },

  async scheduleInspection(id: string | number, inspection_date: string, notes?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/schedule-inspection`, { inspection_date, inspection_notes: notes })
    return response
  },

  async completeInspection(id: string | number, result: 'approved' | 'rejected', notes?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/complete-inspection`, { inspection_result: result, inspection_notes: notes })
    return response
  },

  async verifyPayment(id: string | number, verified: boolean, notes?: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(`/transactions/${id}/verify-payment`, { verified, notes })
    return response
  },

  async releaseFunds(id: string | number, notes?: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(`/transactions/${id}/release-funds`, { notes })
    return response
  },

  async raiseDispute(id: string | number, reason: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/raise-dispute`, { dispute_reason: reason })
    return response
  },

  async refund(id: string | number, reason?: string): Promise<Transaction> {
    const response = await apiClient.post<Transaction>(`/transactions/${id}/refund`, { reason })
    return response
  },

  async cancel(id: string | number, reason: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(`/transactions/${id}/cancel`, { reason })
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

  // Normalize status for display (handles backend status variations)
  normalizeStatus(status: string): TransactionStatus {
    const statusMap: Record<string, TransactionStatus> = {
      'pending': 'pending',
      'pending_payment': 'pending_payment',
      'awaiting_payment': 'pending_payment',
      'payment_received': 'payment_received',
      'payment_verified': 'payment_verified',
      'inspection_scheduled': 'inspection_scheduled',
      'inspection_completed': 'inspection_completed',
      'inspection_passed': 'inspection_passed',
      'inspection_failed': 'inspection_failed',
      'completed': 'completed',
      'funds_released': 'completed',
      'dispute': 'dispute',
      'refunded': 'refunded',
      'cancelled': 'cancelled',
    }
    return statusMap[status] || status as TransactionStatus
  },

  formatStatus(status: TransactionStatus | string): { label: string; color: string } {
    const normalizedStatus = this.normalizeStatus(status)
    const statusMap: Record<TransactionStatus, { label: string; color: string }> = {
      pending: { label: 'Pending Payment', color: 'orange' },
      pending_payment: { label: 'Pending Payment', color: 'orange' },
      payment_received: { label: 'Payment Received', color: 'blue' },
      payment_verified: { label: 'Payment Verified', color: 'cyan' },
      inspection_scheduled: { label: 'Inspection Scheduled', color: 'purple' },
      inspection_completed: { label: 'Inspection Completed', color: 'indigo' },
      inspection_passed: { label: 'Inspection Passed', color: 'teal' },
      inspection_failed: { label: 'Inspection Failed', color: 'red' },
      completed: { label: 'Completed', color: 'green' },
      funds_released: { label: 'Completed', color: 'green' },
      dispute: { label: 'Disputed', color: 'red' },
      refunded: { label: 'Refunded', color: 'gray' },
      cancelled: { label: 'Cancelled', color: 'gray' }
    }
    return statusMap[normalizedStatus] || { label: status, color: 'gray' }
  },

  getNextAction(transaction: Transaction, userRole: 'buyer' | 'seller' | 'admin'): string | null {
    const status = this.normalizeStatus(transaction.status)
    
    if (userRole === 'buyer') {
      if (status === 'pending' || status === 'pending_payment') return 'Upload bank transfer receipt'
      if (status === 'payment_received' || status === 'payment_verified') return 'Schedule inspection'
      if (status === 'inspection_scheduled') return 'Complete inspection'
      if (status === 'inspection_completed' || status === 'inspection_passed') return 'Waiting for funds release'
    }
    
    if (userRole === 'seller') {
      if (status === 'pending' || status === 'pending_payment') return 'Waiting for buyer payment'
      if (status === 'payment_received' || status === 'payment_verified') return 'Prepare vehicle for inspection'
      if (status === 'inspection_completed' || status === 'inspection_passed') return 'Waiting for funds release'
      if (status === 'completed' || status === 'funds_released') return 'Transaction completed'
    }
    
    if (userRole === 'admin') {
      if (status === 'pending' || status === 'pending_payment') return 'Waiting for payment'
      if (status === 'payment_received') return 'Verify payment'
      if (status === 'inspection_completed' || status === 'inspection_passed') return 'Release funds to seller'
      if (status === 'dispute') return 'Resolve dispute'
    }
    
    return null
  }
}

export default transactionService
