import apiClient from './client'
import { UserType } from '@/types/api'

export interface KYCSubmission {
  id_document_type: 'passport' | 'id_card' | 'drivers_license'
  id_document_number: string
  id_document_image: File
  selfie_image: File
}

export interface KYCStatus {
  kyc_status: 'pending' | 'approved' | 'rejected' | null
  kyc_submitted_at: string | null
  kyc_verified_at: string | null
  is_dealer: boolean
  requires_kyc: boolean
}

export const kycService = {
  async submit(data: KYCSubmission): Promise<{ message: string; user: UserType }> {
    const formData = new FormData()
    formData.append('id_document_type', data.id_document_type)
    formData.append('id_document_number', data.id_document_number)
    formData.append('id_document_image', data.id_document_image)
    formData.append('selfie_image', data.selfie_image)

    const response = await apiClient.post<{ message: string; user: UserType }>('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  async getStatus(): Promise<KYCStatus> {
    const response = await apiClient.get<KYCStatus>('/kyc/status')
    return response
  },
}

export default kycService
