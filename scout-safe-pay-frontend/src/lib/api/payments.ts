import apiClient from './client'

export const paymentService = {
  async list() {
    const response = await apiClient.get('/payments')
    return response.data
  },

  async initiate(transactionId: number) {
    const response = await apiClient.post('/payments/initiate', {
      transaction_id: transactionId,
    })
    return response.data
  },

  async uploadProof(paymentId: number, file: File) {
    const formData = new FormData()
    formData.append('payment_id', paymentId.toString())
    formData.append('proof', file)

    const response = await apiClient.post('/payments/upload-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async getById(id: number) {
    const response = await apiClient.get(`/payments/${id}`)
    return response.data.payment
  },

  async verify(id: number, status: 'verified' | 'rejected', notes?: string, rejectionReason?: string) {
    const response = await apiClient.post(`/payments/${id}/verify`, {
      status,
      admin_notes: notes,
      rejection_reason: rejectionReason,
    })
    return response.data
  },
}
