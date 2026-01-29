import apiClient from './client'

export interface LocaleInfo {
  locale: string
  name: string
  native_name: string
}

export const localeService = {
  /**
   * Get current locale
   */
  async getCurrentLocale(): Promise<{ locale: string }> {
    const response = await apiClient.get('/locale')
    return response.data
  },

  /**
   * Get available locales
   */
  async getAvailableLocales(): Promise<LocaleInfo[]> {
    const response = await apiClient.get('/locale/available')
    return response.data.locales || response.data
  },

  /**
   * Set locale
   */
  async setLocale(locale: string): Promise<{ message: string; locale: string }> {
    const response = await apiClient.post('/locale/set', { locale })
    return response.data
  },

  /**
   * Get translations for a specific file
   */
  async getTranslations(file: string): Promise<Record<string, any>> {
    const response = await apiClient.get(`/locale/translations/${file}`)
    return response.data
  },
}

export default localeService
