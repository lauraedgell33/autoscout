import apiClient from './client'
import { getApiUrl } from '@/lib/utils'

export const contractService = {
  async generate(transactionId: number) {
    const response = await apiClient.post(`/transactions/${transactionId}/contract/generate`)
    return response
  },

  async download(transactionId: number) {
    const response = await apiClient.get<Blob>(`/transactions/${transactionId}/contract/download`, {
      responseType: 'blob'
    })
    
    // Response is already a Blob from apiClient
    const url = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `contract_${transactionId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  getPreviewUrl(transactionId: number) {
    const token = localStorage.getItem('auth_token')
    return `${getApiUrl()}/transactions/${transactionId}/contract/preview?token=${token}`
  }
}
