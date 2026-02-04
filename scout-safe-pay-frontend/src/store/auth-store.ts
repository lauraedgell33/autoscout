import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: 'buyer' | 'seller' | 'dealer' | 'admin';
  // Some backend responses may still use `role`
  role?: 'buyer' | 'seller' | 'dealer' | 'admin';
  phone?: string;
  country?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  setHydrated: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'buyer' | 'seller' | 'dealer';
  country: string;
  phone?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://adminautoscout.dev/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      isHydrated: false,
      error: null,
      
      setHydrated: () => {
        set({ isHydrated: true });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          // Store token in localStorage as well for persistence
          if (typeof window !== 'undefined' && data.token) {
            localStorage.setItem('auth_token', data.token);
          }

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'An error occurred during login',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.message || 'Registration failed');
          }

          // Store token in localStorage for persistence
          if (typeof window !== 'undefined' && responseData.token) {
            localStorage.setItem('auth_token', responseData.token);
          }

          set({
            user: responseData.user,
            token: responseData.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'An error occurred during registration',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        
        let { token } = get();
        
        // Try to get token from localStorage if not in store (backup)
        if (!token && typeof window !== 'undefined') {
          token = localStorage.getItem('auth_token');
          if (token) {
            set({ token });
          }
        }
        
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        try {
          const response = await fetch(`${API_URL}/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Token invalid');
          }

          const user = await response.json();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          // Token invalid, clear auth state
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after hydration is complete
        state?.setHydrated();
      },
    }
  )
);
