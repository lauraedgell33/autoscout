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
    const response = await apiClient.post<AuthResponse>('/register', data)
    return response
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/login', data)
    return response
  },

  async logout(): Promise<void> {
    await apiClient.post('/logout')
  },

  async me() {
    const response = await apiClient.get<{ user?: any }>('/user')
    return response.user || response
  },

  async getUser() {
    const response = await apiClient.get<{ user?: any }>('/user')
    return response.user || response
  },
}
