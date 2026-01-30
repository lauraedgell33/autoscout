import apiClient from './client'

export interface KYCVerification {
  id: string
  user_id: string
  document_type: 'passport' | 'id_card' | 'drivers_license'
  document_number: string
  document_front_path?: string
  document_back_path?: string
  selfie_path?: string
  status: 'pending' | 'verified' | 'rejected'
  verified_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface VINCheckResult {
  id: string
  vehicle_id: string
  vin: string
  status: 'pending' | 'verified' | 'failed'
  check_data?: {
    make?: string
    model?: string
    year?: number
    stolen?: boolean
    accident_history?: boolean
    mileage_rollback?: boolean
  }
  verified_at?: string
  created_at: string
  updated_at: string
}

export interface Dispute {
  id: string
  transaction_id: string
  raised_by: string
  reason: string
  description: string
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  resolution?: string
  resolved_at?: string
  created_at: string
  updated_at: string
}

export interface KYCSubmission {
  document_type: 'passport' | 'id_card' | 'drivers_license'
  document_number: string
  document_front: File
  document_back?: File
  selfie: File
}

export interface DisputeSubmission {
  transaction_id: string
  reason: string
  description: string
}

export const verificationService = {
  // KYC Verification
  async getKYCStatus(): Promise<KYCVerification | null> {
    const response = await apiClient.get<KYCVerification | null>('/kyc/status')
    return response
  },

  async submitKYC(data: KYCSubmission): Promise<KYCVerification> {
    const formData = new FormData()
    formData.append('document_type', data.document_type)
    formData.append('document_number', data.document_number)
    formData.append('document_front', data.document_front)
    if (data.document_back) {
      formData.append('document_back', data.document_back)
    }
    formData.append('selfie', data.selfie)

    const response = await apiClient.post<KYCVerification>('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // VIN Check
  async checkVIN(vehicleId: string): Promise<VINCheckResult> {
    const response = await apiClient.post<VINCheckResult>(`/vehicles/${vehicleId}/verify-vin`)
    return response
  },

  async getVINCheckStatus(vehicleId: string): Promise<VINCheckResult | null> {
    const response = await apiClient.get<VINCheckResult | null>(`/vehicles/${vehicleId}/vin-status`)
    return response
  },

  // Disputes
  async createDispute(data: DisputeSubmission): Promise<Dispute> {
    const response = await apiClient.post<Dispute>('/disputes', data)
    return response
  },

  async getMyDisputes(): Promise<Dispute[]> {
    const response = await apiClient.get<Dispute[]>('/disputes/my')
    return response
  },

  async getDisputeById(id: string): Promise<Dispute> {
    const response = await apiClient.get<Dispute>(`/disputes/${id}`)
    return response
  },

  async addDisputeMessage(
    id: string,
    message: string,
    attachments?: File[]
  ): Promise<void> {
    const formData = new FormData()
    formData.append('message', message)
    if (attachments) {
      attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })
    }
    await apiClient.post(`/disputes/${id}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
