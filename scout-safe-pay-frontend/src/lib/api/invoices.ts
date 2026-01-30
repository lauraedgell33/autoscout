import apiClient from './client'

export const invoiceService = {
  async generate(transactionId: number) {
    const response = await apiClient.post(`/transactions/${transactionId}/invoice/generate`)
    return response
  },

  async download(transactionId: number) {
    const response = await apiClient.get<Blob>(`/transactions/${transactionId}/invoice/download`, {
      responseType: 'blob'
    })
    
    // Response is already a Blob from apiClient
    const url = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice_${transactionId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  getPreviewUrl(transactionId: number) {
    const token = localStorage.getItem('auth_token')
    return `${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}/invoice/preview?token=${token}`
  },

  async list() {
    const response = await apiClient.get('/invoices')
    return response
  }
}
