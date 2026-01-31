import apiClient from './client'

export type BankAccountType = 'buyer' | 'seller'

export interface BankAccount {
  id: number
  account_type?: BankAccountType
  account_holder: string
  iban: string
  bic_swift: string
  bank_name: string
  is_default: boolean
  verified?: boolean
}

export interface CreateBankAccountData {
  account_type?: BankAccountType
  account_holder: string
  iban: string
  bic_swift: string
  bank_name: string
}

export const bankAccountService = {
  async list(): Promise<{ data: BankAccount[] }> {
    return apiClient.get('/bank-accounts')
  },

  // Admin / combined view (if supported by backend)
  async listAll(): Promise<{ data: BankAccount[] }> {
    return apiClient.get('/bank-accounts/all')
  },

  async create(data: CreateBankAccountData): Promise<{ message?: string; account?: BankAccount }> {
    return apiClient.post('/bank-accounts', data)
  },

  async remove(id: number): Promise<{ message?: string }> {
    return apiClient.delete(`/bank-accounts/${id}`)
  },

  async setDefault(id: number): Promise<{ message?: string; account?: BankAccount }> {
    return apiClient.post(`/bank-accounts/${id}/default`)
  },
}