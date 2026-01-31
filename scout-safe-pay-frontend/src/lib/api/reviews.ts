import apiClient from './client'

// Types are shared across the app in src/types/review to avoid drift.
export type Review = import('@/types/review').Review
export type ReviewFilters = import('@/types/review').ReviewFilters
export type ReviewFormData = import('@/types/review').ReviewFormData
export type ReviewStats = import('@/types/review').ReviewStats
export type PaginatedReviews = import('@/types/review').PaginatedReviews

// Kept for backward compatibility; not currently used by the UI.
export interface ReviewModerationStats {
  total: number
  pending: number
  approved: number
  rejected: number
  flagged: number
  average_rating: number
}

export const reviewService = {
  /**
   * Get reviews with filters
   */
  async getReviews(filters?: ReviewFilters): Promise<PaginatedReviews> {
    const params: Record<string, string> = {}
    
    if (filters) {
      if (filters.verified_only) params.verified_only = 'true'
      if (filters.reviewable_type) params.reviewable_type = filters.reviewable_type
      if (filters.reviewable_id) params.reviewable_id = filters.reviewable_id.toString()
      if (filters.sort) params.sort = filters.sort
      if (filters.page) params.page = filters.page.toString()
      if (filters.per_page) params.per_page = filters.per_page.toString()
    }

    return apiClient.get<PaginatedReviews>('/reviews', { params })
  },

  /**
   * Get reviews for a specific vehicle
   */
  async getVehicleReviews(vehicleId: number): Promise<{ reviews: PaginatedReviews; average_rating: number; verified_count: number }> {
    return apiClient.get(`/vehicles/${vehicleId}/reviews`)
  },

  /**
   * Get reviews for a specific user
   */
  async getUserReviews(userId: number): Promise<{ reviews: PaginatedReviews; stats: ReviewStats }> {
    return apiClient.get(`/users/${userId}/reviews`)
  },

  /**
   * Get reviews by authenticated user
   */
  async getMyReviews(): Promise<{ reviews: PaginatedReviews }> {
    return apiClient.get('/my-reviews')
  },

  /**
   * Submit a new review
   */
  async submitReview(data: ReviewFormData): Promise<{ message: string; review: Review; auto_verified: boolean }> {
    return apiClient.post('/reviews', data)
  },

  /**
   * Update an existing review
   */
  async updateReview(reviewId: number, data: Partial<ReviewFormData>): Promise<{ message: string; review: Review }> {
    return apiClient.put(`/reviews/${reviewId}`, data)
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: number): Promise<{ message: string }> {
    return apiClient.delete(`/reviews/${reviewId}`)
  },

  /**
   * Flag a review as inappropriate
   */
  async flagReview(reviewId: number, reason: string, details?: string): Promise<{ message: string }> {
    return apiClient.post(`/reviews/${reviewId}/flag`, { reason, details })
  },

  /**
   * Vote on review helpfulness
   */
  async voteReview(reviewId: number, isHelpful: boolean): Promise<{ message: string; helpful_count: number; not_helpful_count: number }> {
    return apiClient.post(`/reviews/${reviewId}/vote`, { is_helpful: isHelpful })
  },

  // Admin endpoints

  /**
   * Get pending reviews for moderation (admin only)
   */
  async getPendingReviews(page: number = 1, perPage: number = 20): Promise<PaginatedReviews> {
    return apiClient.get('/admin/reviews/pending', { params: { page, per_page: perPage } })
  },

  /**
   * Get flagged reviews (admin only)
   */
  async getFlaggedReviews(page: number = 1, perPage: number = 20): Promise<PaginatedReviews> {
    return apiClient.get('/admin/reviews/flagged', { params: { page, per_page: perPage } })
  },

  /**
   * Manually verify a review (admin only)
   */
  async verifyReview(reviewId: number, notes?: string): Promise<{ message: string; review: Review }> {
    return apiClient.post(`/admin/reviews/${reviewId}/verify`, { notes })
  },

  /**
   * Reject a review (admin only)
   */
  async rejectReview(reviewId: number, reason: string): Promise<{ message: string; review: Review }> {
    return apiClient.post(`/admin/reviews/${reviewId}/reject`, { reason })
  },

  /**
   * Get review moderation statistics (admin only)
   */
  async getStatistics(): Promise<ReviewModerationStats> {
    return apiClient.get('/admin/reviews/statistics')
  },

  /**
   * Helper: Format rating as stars
   */
  formatRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  },

  /**
   * Helper: Get moderation status color
   */
  getModerationStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
    }
    return colors[status] || 'gray'
  }
}

export default reviewService
