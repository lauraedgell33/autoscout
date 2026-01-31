'use client'

import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useRouter } from '@/i18n/routing'
import { useAuthStore } from '@/store/auth-store'
import toast from 'react-hot-toast'

interface User {
  id: number
  name: string
  email: string
  role: 'buyer' | 'seller' | 'dealer' | 'admin'
  phone?: string
  email_verified_at?: string
  user_type?: 'buyer' | 'seller' | 'dealer' | 'admin'
  country?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  user_type: 'buyer' | 'seller' | 'dealer'
  country: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const authStore = useAuthStore()

  useEffect(() => {
    // Check authentication on mount (client-side only)
    if (typeof window !== 'undefined') {
      authStore.checkAuth()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await authStore.login(email, password)
      
      const { user } = authStore
      
      if (!user) {
        throw new Error('Login failed - no user returned')
      }

      toast.success('Successfully logged in!')
      
      // Redirect based on user role
      const role = user.user_type || user.role
      if (role === 'admin') {
        window.location.href = '/admin'
      } else {
        // All non-admin users go to dashboard
        router.push('/dashboard')
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      toast.error(message)
      throw new Error(message)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      await authStore.register(data)
      
      const { user } = authStore
      
      if (!user) {
        throw new Error('Registration failed - no user returned')
      }

      toast.success('Successfully registered!')
      
      // Redirect to dashboard after registration
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(message)
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      await authStore.logout()
      toast.success('Successfully logged out')
      router.push('/')
    } catch (error) {
      // Silent fail - store already cleared
      router.push('/')
    }
  }

  const value = {
    user: authStore.user as User | null,
    loading: authStore.isLoading,
    login,
    register,
    logout,
    isAuthenticated: authStore.isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
