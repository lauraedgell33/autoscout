'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from '@/i18n/routing'
import { authService } from '@/lib/api/auth'

interface User {
  id: number
  name: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  phone?: string
  email_verified_at?: string
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
  role: 'buyer' | 'seller'
  user_type?: 'buyer' | 'seller'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Disable auto-loading to prevent infinite loops
    // User will need to login manually
    setLoading(false)
    
    // Optional: Check localStorage for cached user
    const cachedUser = localStorage.getItem('user')
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser))
      } catch (e) {
        console.error('Failed to parse cached user')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      
      const { user: newUser } = response
      
      // Map user_type to role for frontend compatibility
      const mappedUser = {
        ...newUser,
        role: newUser.user_type || newUser.role
      }
      
      setUser(mappedUser)
      
      if (mappedUser.role === 'admin') {
        window.location.href = '/admin'
      } else if (mappedUser.role === 'seller') {
        router.push('/dashboard/seller')
      } else {
        router.push('/dashboard/buyer')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const registerData = {
        ...data,
        user_type: data.role
      }
      const response = await authService.register(registerData)
      
      const { user: newUser } = response
      
      // Map user_type to role for frontend compatibility
      const mappedUser = {
        ...newUser,
        role: newUser.user_type || newUser.role
      }
      
      setUser(mappedUser)
      
      if (mappedUser.role === 'seller') {
        router.push('/dashboard/seller')
      } else {
        router.push('/dashboard/buyer')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Silent fail - clear state anyway
    }
    
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
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
