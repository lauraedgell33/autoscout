import { apiClient } from './client'
import type { Dealer, Review, ReviewStats, PaginatedResponse } from '@/types'

export interface DealersResponse {
  dealers: PaginatedResponse<Dealer>
}

export interface DealerResponse {
  dealer: Dealer
  reviews: PaginatedResponse<Review>
  review_stats: ReviewStats
}

export interface DealerStatistics {
  total_dealers: number
  active_dealers: number
  dealers_by_city: Array<{
    city: string
    count: number
  }>
  dealers_by_type: Array<{
    type: string
    count: number
  }>
}

/**
 * Get all verified dealers with optional filters
 */
export const getDealers = async (params?: {
  search?: string
  city?: string
  type?: 'individual' | 'company'
  page?: number
}): Promise<DealersResponse> => {
  const response = await apiClient.get('/dealers', { params })
  return response.data
}

/**
 * Get a specific dealer by ID
 */
export const getDealer = async (id: number): Promise<DealerResponse> => {
  const response = await apiClient.get(`/dealers/${id}`)
  return response.data
}

/**
 * Get dealer statistics
 */
export const getDealerStatistics = async (): Promise<DealerStatistics> => {
  const response = await apiClient.get('/dealers-statistics')
  return response.data
}

/**
 * Create a new dealer (admin only)
 */
export const createDealer = async (dealerData: Partial<Dealer>): Promise<{ dealer: Dealer; message: string }> => {
  const response = await apiClient.post('/admin/dealers', dealerData)
  return response.data
}

/**
 * Update a dealer (admin only)
 */
export const updateDealer = async (id: number, dealerData: Partial<Dealer>): Promise<{ dealer: Dealer; message: string }> => {
  const response = await apiClient.put(`/admin/dealers/${id}`, dealerData)
  return response.data
}

/**
 * Delete a dealer (admin only)
 */
export const deleteDealer = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/admin/dealers/${id}`)
  return response.data
}

/**
 * Get all dealers for admin (including unverified)
 */
export const getAdminDealers = async (params?: {
  page?: number
  status?: string
  is_verified?: boolean
}): Promise<DealersResponse> => {
  const response = await apiClient.get('/admin/dealers', { params })
  return response.data
}