import apiClient from './client'

export interface Dispute {
  id: number
  transaction_id: number
  raised_by_user_id: number
  against_user_id: number
  reason: string
  description: string
  status: 'open' | 'under_review' | 'resolved' | 'closed'
  resolution: string | null
  resolved_by_admin_id: number | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  raised_by?: {
    id: number
    name: string
    email: string
  }
  against_user?: {
    id: number
    name: string
    email: string
  }
  transaction?: {
    id: number
    amount: string
    vehicle: {
      id: number
      make: string
      model: string
      year: number
    }
  }
  responses?: DisputeResponse[]
}

export interface DisputeResponse {
  id: number
  dispute_id: number
  user_id: number
  message: string
  is_admin_response: boolean
  created_at: string
  user?: {
    id: number
    name: string
  }
}

export interface CreateDisputeData {
  transaction_id: number
  reason: string
  description: string
}

export interface AddDisputeResponseData {
  message: string
}

export const disputeService = {
  /**
   * Get all disputes
   */
  async list(filters?: { status?: string }): Promise<Dispute[]> {
    const response = await apiClient.get('/disputes', { params: filters })
    return response.data.disputes || response.data
  },

  /**
   * Get a specific dispute
   */
  async get(id: number): Promise<Dispute> {
    const response = await apiClient.get(`/disputes/${id}`)
    return response.data.dispute || response.data
  },

  /**
   * Create a new dispute
   */
  async create(data: CreateDisputeData): Promise<Dispute> {
    const response = await apiClient.post('/disputes', data)
    return response.data.dispute || response.data
  },

  /**
   * Add a response to a dispute
   */
  async addResponse(id: number, data: AddDisputeResponseData): Promise<DisputeResponse> {
    const response = await apiClient.post(`/disputes/${id}/response`, data)
    return response.data.response || response.data
  },

  /**
   * Get my disputes
   */
  async getMyDisputes(): Promise<Dispute[]> {
    const response = await apiClient.get('/my-disputes')
    return response.data.disputes || response.data
  },

  /**
   * Get all disputes (admin only)
   */
  async adminList(filters?: { status?: string }): Promise<Dispute[]> {
    const response = await apiClient.get('/admin/disputes', { params: filters })
    return response.data.disputes || response.data
  },

  /**
   * Update dispute (admin only)
   */
  async adminUpdate(id: number, data: { status?: string; resolution?: string }): Promise<Dispute> {
    const response = await apiClient.patch(`/admin/disputes/${id}`, data)
    return response.data.dispute || response.data
  },
}

export default disputeService
