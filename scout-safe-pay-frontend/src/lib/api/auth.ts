import apiClient from './client'

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  user_type: 'buyer' | 'seller'
  phone?: string
  country?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: any
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/register', data)
    return response.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/login', data)
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/logout')
  },

  async me() {
    const response = await apiClient.get('/user')
    return response.data.user || response.data
  },

  async getUser() {
    const response = await apiClient.get('/user')
    return response.data.user || response.data
  },
}
