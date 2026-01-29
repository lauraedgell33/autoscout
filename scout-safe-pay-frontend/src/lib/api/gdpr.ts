import apiClient from './client'

export interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'contacts_only'
  show_email: boolean
  show_phone: boolean
  allow_marketing_emails: boolean
  allow_notifications: boolean
}

export const gdprService = {
  /**
   * Export user data (GDPR right to data portability)
   */
  async exportData(): Promise<Blob> {
    const response = await apiClient.get('/gdpr/export', {
      responseType: 'blob',
    })
    return response.data
  },

  /**
   * Request account deletion (GDPR right to be forgotten)
   */
  async requestDeletion(reason?: string): Promise<{ message: string; deletion_date: string }> {
    const response = await apiClient.post('/gdpr/delete-account', { reason })
    return response.data
  },

  /**
   * Cancel account deletion request
   */
  async cancelDeletion(): Promise<{ message: string }> {
    const response = await apiClient.post('/gdpr/cancel-deletion')
    return response.data
  },

  /**
   * Get privacy settings
   */
  async getPrivacySettings(): Promise<PrivacySettings> {
    const response = await apiClient.get('/gdpr/privacy-settings')
    return response.data.settings || response.data
  },

  /**
   * Update consent settings
   */
  async updateConsent(consents: {
    marketing_emails?: boolean
    analytics?: boolean
    personalization?: boolean
  }): Promise<{ message: string }> {
    const response = await apiClient.put('/gdpr/consent', consents)
    return response.data
  },
}

export default gdprService
