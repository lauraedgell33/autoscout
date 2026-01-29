import apiClient from './client'

export interface LegalDocument {
  type: 'terms' | 'privacy' | 'cookies' | 'aml' | 'kyc'
  title: string
  content: string
  version: string
  effective_date: string
  last_updated: string
}

export interface UserConsent {
  id: number
  user_id: number
  document_type: string
  document_version: string
  ip_address: string
  user_agent: string
  consented_at: string
}

export interface RecordConsentData {
  document_type: string
  document_version: string
}

export const legalService = {
  /**
   * Get all legal documents
   */
  async getAllDocuments(): Promise<LegalDocument[]> {
    const response = await apiClient.get('/legal/documents')
    return response.data.documents || response.data
  },

  /**
   * Get a specific legal document
   */
  async getDocument(type: string): Promise<LegalDocument> {
    const response = await apiClient.get(`/legal/documents/${type}`)
    return response.data.document || response.data
  },

  /**
   * Record user consent (requires authentication)
   */
  async recordConsent(data: RecordConsentData): Promise<UserConsent> {
    const response = await apiClient.post('/legal/consents', data)
    return response.data.consent || response.data
  },

  /**
   * Get user consents (requires authentication)
   */
  async getUserConsents(): Promise<UserConsent[]> {
    const response = await apiClient.get('/legal/consents')
    return response.data.consents || response.data
  },

  /**
   * Check if user has consented to all required documents
   */
  async checkConsents(): Promise<{
    has_all_consents: boolean
    missing_consents: string[]
  }> {
    const response = await apiClient.get('/legal/consents/check')
    return response.data
  },
}

export default legalService
