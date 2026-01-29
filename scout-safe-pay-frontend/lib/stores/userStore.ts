import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  userType: 'buyer' | 'seller' | 'admin';
  kycStatus: 'pending' | 'verified' | 'rejected';
  emailVerified: boolean;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  logOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
          error: null,
        }),

      logOut: () =>
        set({
          user: null,
          isLoggedIn: false,
          error: null,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
