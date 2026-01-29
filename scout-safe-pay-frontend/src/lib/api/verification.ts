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
    const response = await apiClient.get('/kyc/status')
    return response.data.data
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

    const response = await apiClient.post('/kyc/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  // VIN Check
  async checkVIN(vehicleId: string): Promise<VINCheckResult> {
    const response = await apiClient.post(`/vehicles/${vehicleId}/verify-vin`)
    return response.data.data
  },

  async getVINCheckStatus(vehicleId: string): Promise<VINCheckResult | null> {
    const response = await apiClient.get(`/vehicles/${vehicleId}/vin-status`)
    return response.data.data
  },

  // Disputes
  async createDispute(data: DisputeSubmission): Promise<Dispute> {
    const response = await apiClient.post('/disputes', data)
    return response.data.data
  },

  async getMyDisputes(): Promise<Dispute[]> {
    const response = await apiClient.get('/my-disputes')
    return response.data.data || response.data
  },

  async getDisputeById(id: string): Promise<Dispute> {
    const response = await apiClient.get(`/disputes/${id}`)
    return response.data.data
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

  // General verifications
  async list(filters?: { status?: string }): Promise<any[]> {
    const response = await apiClient.get('/verifications', { params: filters })
    return response.data.verifications || response.data
  },

  async get(id: number): Promise<any> {
    const response = await apiClient.get(`/verifications/${id}`)
    return response.data.verification || response.data
  },

  async create(data: any): Promise<any> {
    const response = await apiClient.post('/verifications', data)
    return response.data.verification || response.data
  },

  async checkVin(vin: string, vehicleId?: number): Promise<any> {
    const response = await apiClient.post('/verifications/vin-check', { vin, vehicle_id: vehicleId })
    return response.data
  },

  async getMyVerifications(): Promise<any[]> {
    const response = await apiClient.get('/my-verifications')
    return response.data.verifications || response.data
  },

  // Admin methods
  async adminIndex(filters?: { status?: string }): Promise<any[]> {
    const response = await apiClient.get('/admin/verifications', { params: filters })
    return response.data.verifications || response.data
  },

  async adminUpdate(id: number, data: { status?: string; notes?: string }): Promise<any> {
    const response = await apiClient.patch(`/admin/verifications/${id}`, data)
    return response.data.verification || response.data
  },
}

export default verificationService

