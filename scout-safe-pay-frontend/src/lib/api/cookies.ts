import apiClient from './client'

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export interface CookieConsent {
  preferences: CookiePreferences
  consent_date: string
  ip_address: string
}

export const cookieService = {
  /**
   * Get cookie preferences
   */
  async getPreferences(): Promise<CookieConsent | null> {
    try {
      const response = await apiClient.get('/cookies/preferences')
      return response.data
    } catch (error) {
      return null
    }
  },

  /**
   * Update cookie preferences
   */
  async updatePreferences(preferences: CookiePreferences): Promise<CookieConsent> {
    const response = await apiClient.post('/cookies/preferences', { preferences })
    return response.data
  },

  /**
   * Accept all cookies
   */
  async acceptAll(): Promise<CookieConsent> {
    const response = await apiClient.post('/cookies/accept-all')
    return response.data
  },

  /**
   * Accept essential cookies only
   */
  async acceptEssential(): Promise<CookieConsent> {
    const response = await apiClient.post('/cookies/accept-essential')
    return response.data
  },

  /**
   * Get cookie statistics (admin only)
   */
  async getStatistics(): Promise<any> {
    const response = await apiClient.get('/admin/cookies/statistics')
    return response.data
  },
}

export default cookieService
