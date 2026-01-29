import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'dealer' | 'admin';
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
