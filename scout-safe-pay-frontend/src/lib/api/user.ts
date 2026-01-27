import { apiClient } from './client'
import { UserType } from '@/types/api'

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  date_of_birth?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
}

export interface UpdatePasswordData {
  current_password: string
  password: string
  password_confirmation: string
}

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserType> {
    const response = await apiClient.get<UserType>('/user/profile')
    return response.data
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserType> {
    const response = await apiClient.put<UserType>('/user/profile', data)
    return response.data
  },

  /**
   * Update user password
   */
  async updatePassword(data: UpdatePasswordData): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>('/user/password', data)
    return response.data
  },

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>('/user/account', {
      data: { password }
    })
    return response.data
  },
}
