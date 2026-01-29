import apiClient from './client'

export interface CreateOrderData {
  vehicle_id: number
  amount: string
  payment_method?: 'bank_transfer'
}

export interface PaymentInstructions {
  account_holder: string
  iban: string
  bic_swift: string
  bank_name: string
  reference: string
  amount: string
  currency: string
  transaction_id: number
}

export const orderService = {
  /**
   * 1. Create initial order (buyer)
   */
  async createOrder(data: CreateOrderData): Promise<any> {
    const response = await apiClient.post('/orders', data)
    return response.data
  },

  /**
   * Get order details
   */
  async getOrder(transactionId: string | number): Promise<any> {
    const response = await apiClient.get(`/transactions/${transactionId}`)
    return response.data.data
  },

  /**
   * 2. Generate contract (dealer)
   */
  async generateContract(transactionId: number): Promise<any> {
    const response = await apiClient.post(`/orders/${transactionId}/generate-contract`)
    return response.data
  },

  /**
   * 3. Upload signed contract (buyer)
   */
  async uploadSignedContract(transactionId: number, file: File): Promise<any> {
    const formData = new FormData()
    formData.append('signed_contract', file)
    
    const response = await apiClient.post(`/orders/${transactionId}/upload-signed-contract`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  /**
   * 4. Get payment instructions (buyer - after contract upload)
   */
  async getPaymentInstructions(transactionId: number): Promise<PaymentInstructions> {
    const response = await apiClient.get(`/orders/${transactionId}/payment-instructions`)
    return response.data
  },

  /**
   * 5. Confirm payment received (admin/dealer - manual)
   */
  async confirmPayment(transactionId: number, notes?: string): Promise<any> {
    const response = await apiClient.post(`/orders/${transactionId}/confirm-payment`, { notes })
    return response.data
  },

  /**
   * 6. Mark vehicle ready for delivery (dealer)
   */
  async markReadyForDelivery(transactionId: number, notes?: string): Promise<any> {
    const response = await apiClient.post(`/orders/${transactionId}/ready-for-delivery`, { notes })
    return response.data
  },

  /**
   * 7. Mark vehicle as delivered (dealer/buyer)
   */
  async markAsDelivered(transactionId: number, notes?: string): Promise<any> {
    const response = await apiClient.post(`/orders/${transactionId}/delivered`, { notes })
    return response.data
  },

  /**
   * 8. Complete order (automatic after delivery confirmation)
   */
  async completeOrder(transactionId: number): Promise<any> {
    const response = await apiClient.post(`/orders/${transactionId}/complete`)
    return response.data
  },

  /**
   * 9. Cancel order (buyer/dealer - before payment confirmed)
   */
  async cancelOrder(transactionId: number, reason?: string): Promise<any> {
    const response = await apiClient.post(`/orders/${transactionId}/cancel`, { reason })
    return response.data
  },
}

export default orderService
