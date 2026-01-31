import apiClient from './client'
import { Transaction } from './transactions'

export interface PaymentInstructions {
  account_holder: string
  bank_name: string
  iban: string
  bic_swift: string
  reference: string
  amount: string
  currency: string
  instructions: string
}

export interface CreateOrderData {
  vehicle_id: string | number
  notes?: string
}

export interface ContractData {
  contract_url?: string
  contract_path?: string
  generated_at?: string
}

export const orderService = {
  /**
   * 1. Create initial order (buyer)
   */
  async createOrder(data: CreateOrderData): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>('/orders', data)
    return response
  },

  /**
   * 2. Generate contract (dealer/seller)
   */
  async generateContract(transactionId: string | number): Promise<{ message: string; transaction: Transaction; contract: ContractData }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction; contract: ContractData }>(`/orders/${transactionId}/generate-contract`)
    return response
  },

  /**
   * 3. Upload signed contract (buyer)
   */
  async uploadSignedContract(transactionId: string | number, contract: File): Promise<{ message: string; transaction: Transaction }> {
    const formData = new FormData()
    formData.append('signed_contract', contract)
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(
      `/orders/${transactionId}/upload-signed-contract`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response
  },

  /**
   * 4. Get payment instructions (buyer - after contract upload)
   */
  async getPaymentInstructions(transactionId: string | number): Promise<{ instructions: PaymentInstructions; transaction: Transaction }> {
    const response = await apiClient.get<{ instructions: PaymentInstructions; transaction: Transaction }>(
      `/orders/${transactionId}/payment-instructions`
    )
    return response
  },

  /**
   * 5. Confirm payment received (admin/dealer - manual)
   */
  async confirmPayment(transactionId: string | number, notes?: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(
      `/orders/${transactionId}/confirm-payment`,
      { notes }
    )
    return response
  },

  /**
   * 6. Mark vehicle ready for delivery (dealer/seller)
   */
  async markReadyForDelivery(transactionId: string | number, notes?: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(
      `/orders/${transactionId}/ready-for-delivery`,
      { notes }
    )
    return response
  },

  /**
   * 7. Mark vehicle as delivered (dealer/buyer)
   */
  async markAsDelivered(transactionId: string | number, notes?: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(
      `/orders/${transactionId}/delivered`,
      { notes }
    )
    return response
  },

  /**
   * 8. Complete order (automatic after delivery confirmation)
   */
  async completeOrder(transactionId: string | number): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(
      `/orders/${transactionId}/complete`
    )
    return response
  },

  /**
   * 9. Cancel order (buyer/dealer - before payment confirmed)
   */
  async cancelOrder(transactionId: string | number, reason: string): Promise<{ message: string; transaction: Transaction }> {
    const response = await apiClient.post<{ message: string; transaction: Transaction }>(
      `/orders/${transactionId}/cancel`,
      { reason }
    )
    return response
  },

  /**
   * Helper: Get order flow step based on transaction status
   */
  getOrderStep(status: string): { step: number; label: string; description: string } {
    const steps: Record<string, { step: number; label: string; description: string }> = {
      'pending': { step: 1, label: 'Order Created', description: 'Waiting for contract generation' },
      'contract_generated': { step: 2, label: 'Contract Ready', description: 'Please review and sign the contract' },
      'contract_signed': { step: 3, label: 'Contract Signed', description: 'Proceed to payment' },
      'awaiting_payment': { step: 3, label: 'Awaiting Payment', description: 'Please complete the bank transfer' },
      'payment_received': { step: 4, label: 'Payment Received', description: 'Payment is being verified' },
      'payment_verified': { step: 5, label: 'Payment Verified', description: 'Preparing for delivery' },
      'ready_for_delivery': { step: 6, label: 'Ready for Delivery', description: 'Vehicle is ready for pickup/delivery' },
      'delivered': { step: 7, label: 'Delivered', description: 'Vehicle has been delivered' },
      'completed': { step: 8, label: 'Completed', description: 'Transaction completed successfully' },
      'cancelled': { step: -1, label: 'Cancelled', description: 'Order was cancelled' },
      'dispute': { step: -2, label: 'Disputed', description: 'Order is under dispute' },
    }
    return steps[status] || { step: 0, label: 'Unknown', description: 'Unknown status' }
  },

  /**
   * Helper: Check if user can perform action based on role and status
   */
  canPerformAction(action: string, status: string, userRole: 'buyer' | 'seller' | 'admin'): boolean {
    const permissions: Record<string, Record<string, string[]>> = {
      'generate_contract': { statuses: ['pending'], roles: ['seller', 'admin'] },
      'upload_signed_contract': { statuses: ['contract_generated'], roles: ['buyer'] },
      'confirm_payment': { statuses: ['payment_received'], roles: ['seller', 'admin'] },
      'mark_ready_for_delivery': { statuses: ['payment_verified'], roles: ['seller', 'admin'] },
      'mark_delivered': { statuses: ['ready_for_delivery'], roles: ['buyer', 'seller', 'admin'] },
      'complete': { statuses: ['delivered'], roles: ['admin'] },
      'cancel': { statuses: ['pending', 'contract_generated', 'contract_signed', 'awaiting_payment'], roles: ['buyer', 'seller', 'admin'] },
    }

    const permission = permissions[action]
    if (!permission) return false

    return permission.statuses.includes(status) && permission.roles.includes(userRole)
  }
}

export default orderService