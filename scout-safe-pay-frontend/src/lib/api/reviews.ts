import { 
  Review, 
  ReviewFilters, 
  ReviewFormData, 
  ReviewStats,
  ReviewSubmissionResponse,
  PaginatedReviews,
  ReviewModerationStats
} from '@/types/review';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Create headers with auth token
 */
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export const reviewService = {
  /**
   * Get reviews with filters
   */
  async getReviews(filters?: ReviewFilters): Promise<PaginatedReviews> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.verified_only) params.append('verified_only', 'true');
      if (filters.reviewable_type) params.append('reviewable_type', filters.reviewable_type);
      if (filters.reviewable_id) params.append('reviewable_id', filters.reviewable_id.toString());
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/reviews?${params.toString()}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return response.json();
  },

  /**
   * Get reviews for a specific vehicle
   */
  async getVehicleReviews(vehicleId: number): Promise<{ reviews: PaginatedReviews; average_rating: number; verified_count: number }> {
    const response = await fetch(
      `${API_BASE_URL}/vehicles/${vehicleId}/reviews`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch vehicle reviews');
    }

    return response.json();
  },

  /**
   * Get reviews for a specific user
   */
  async getUserReviews(userId: number): Promise<{ reviews: PaginatedReviews; stats: ReviewStats }> {
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/reviews`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }

    return response.json();
  },

  /**
   * Get reviews by authenticated user
   */
  async getMyReviews(): Promise<{ reviews: PaginatedReviews }> {
    const response = await fetch(
      `${API_BASE_URL}/my-reviews`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch your reviews');
    }

    return response.json();
  },

  /**
   * Submit a new review
   */
  async submitReview(data: ReviewFormData): Promise<ReviewSubmissionResponse> {
    const response = await fetch(
      `${API_BASE_URL}/reviews`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit review');
    }

    return response.json();
  },

  /**
   * Update an existing review
   */
  async updateReview(reviewId: number, data: Partial<ReviewFormData>): Promise<{ message: string; review: Review }> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/${reviewId}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update review');
    }

    return response.json();
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: number): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/${reviewId}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete review');
    }

    return response.json();
  },

  /**
   * Flag a review as inappropriate
   */
  async flagReview(reviewId: number, reason: string, details?: string): Promise<{ message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/${reviewId}/flag`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason, details }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to flag review');
    }

    return response.json();
  },

  /**
   * Vote on review helpfulness
   */
  async voteReview(reviewId: number, isHelpful: boolean): Promise<{ message: string; helpful_count: number; not_helpful_count: number }> {
    const response = await fetch(
      `${API_BASE_URL}/reviews/${reviewId}/vote`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ is_helpful: isHelpful }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to vote on review');
    }

    return response.json();
  },

  // Admin endpoints

  /**
   * Get pending reviews for moderation (admin only)
   */
  async getPendingReviews(page: number = 1, perPage: number = 20): Promise<PaginatedReviews> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reviews/pending?page=${page}&per_page=${perPage}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pending reviews');
    }

    return response.json();
  },

  /**
   * Get flagged reviews (admin only)
   */
  async getFlaggedReviews(page: number = 1, perPage: number = 20): Promise<PaginatedReviews> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reviews/flagged?page=${page}&per_page=${perPage}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch flagged reviews');
    }

    return response.json();
  },

  /**
   * Manually verify a review (admin only)
   */
  async verifyReview(reviewId: number, notes?: string): Promise<{ message: string; review: Review }> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reviews/${reviewId}/verify`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ notes }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify review');
    }

    return response.json();
  },

  /**
   * Reject a review (admin only)
   */
  async rejectReview(reviewId: number, reason: string): Promise<{ message: string; review: Review }> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reviews/${reviewId}/reject`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reject review');
    }

    return response.json();
  },

  /**
   * Get review moderation statistics (admin only)
   */
  async getStatistics(): Promise<ReviewModerationStats> {
    const response = await fetch(
      `${API_BASE_URL}/admin/reviews/statistics`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch review statistics');
    }

    return response.json();
  },
};
