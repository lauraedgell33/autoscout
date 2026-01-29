import apiClient from './client'

export interface Review {
  id: number
  transaction_id: number
  reviewer_id: number
  reviewed_user_id: number
  vehicle_id: number | null
  rating: number
  title: string | null
  comment: string | null
  is_verified_purchase: boolean
  status: 'pending' | 'approved' | 'rejected'
  moderation_notes: string | null
  created_at: string
  updated_at: string
  reviewer?: {
    id: number
    name: string
  }
  reviewed_user?: {
    id: number
    name: string
  }
  vehicle?: {
    id: number
    make: string
    model: string
    year: number
  }
}

export interface CreateReviewData {
  transaction_id: number
  reviewed_user_id: number
  vehicle_id?: number
  rating: number
  title?: string
  comment?: string
}

export const reviewService = {
  /**
   * Create a new review
   */
  async create(data: CreateReviewData): Promise<Review> {
    const response = await apiClient.post('/reviews', data)
    return response.data.review || response.data
  },

  /**
   * Update a review
   */
  async update(id: number, data: Partial<CreateReviewData>): Promise<Review> {
    const response = await apiClient.put(`/reviews/${id}`, data)
    return response.data.review || response.data
  },

  /**
   * Delete a review
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/reviews/${id}`)
  },

  /**
   * Get reviews for a user
   */
  async getUserReviews(userId: number): Promise<Review[]> {
    const response = await apiClient.get(`/users/${userId}/reviews`)
    return response.data.reviews || response.data
  },

  /**
   * Get reviews for a vehicle
   */
  async getVehicleReviews(vehicleId: number): Promise<Review[]> {
    const response = await apiClient.get(`/vehicles/${vehicleId}/reviews`)
    return response.data.reviews || response.data
  },

  /**
   * Get my reviews
   */
  async getMyReviews(): Promise<Review[]> {
    const response = await apiClient.get('/my-reviews')
    return response.data.reviews || response.data
  },

  /**
   * Get pending reviews (admin only)
   */
  async getPendingReviews(): Promise<Review[]> {
    const response = await apiClient.get('/admin/reviews/pending')
    return response.data.reviews || response.data
  },

  /**
   * Moderate a review (admin only)
   */
  async moderate(id: number, status: 'approved' | 'rejected', notes?: string): Promise<Review> {
    const response = await apiClient.post(`/admin/reviews/${id}/moderate`, {
      status,
      moderation_notes: notes,
    })
    return response.data.review || response.data
  },
}

export default reviewService
