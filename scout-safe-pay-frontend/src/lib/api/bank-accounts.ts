import apiClient from './client'

export interface BankAccount {
  id: number
  user_id: number
  account_holder_name: string
  iban: string
  bic_swift: string
  bank_name: string
  is_primary: boolean
  is_verified: boolean
  verified_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateBankAccountData {
  account_holder_name: string
  iban: string
  bic_swift: string
  bank_name: string
  is_primary?: boolean
}

export const bankAccountService = {
  /**
   * Get all bank accounts for current user
   */
  async list(): Promise<BankAccount[]> {
    const response = await apiClient.get('/bank-accounts')
    return response.data.bank_accounts || response.data
  },

  /**
   * Get a specific bank account
   */
  async get(id: number): Promise<BankAccount> {
    const response = await apiClient.get(`/bank-accounts/${id}`)
    return response.data.bank_account || response.data
  },

  /**
   * Create a new bank account
   */
  async create(data: CreateBankAccountData): Promise<BankAccount> {
    const response = await apiClient.post('/bank-accounts', data)
    return response.data.bank_account || response.data
  },

  /**
   * Update a bank account
   */
  async update(id: number, data: Partial<CreateBankAccountData>): Promise<BankAccount> {
    const response = await apiClient.put(`/bank-accounts/${id}`, data)
    return response.data.bank_account || response.data
  },

  /**
   * Delete a bank account
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/bank-accounts/${id}`)
  },

  /**
   * Set bank account as primary
   */
  async setPrimary(id: number): Promise<BankAccount> {
    const response = await apiClient.post(`/bank-accounts/${id}/set-primary`)
    return response.data.bank_account || response.data
  },

  /**
   * Verify bank account (admin only)
   */
  async verify(id: number): Promise<BankAccount> {
    const response = await apiClient.post(`/bank-accounts/${id}/verify`)
    return response.data.bank_account || response.data
  },
}

export default bankAccountService
