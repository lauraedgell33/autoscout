import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIStore {
  toasts: Toast[];
  modals: Record<string, boolean>;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Toast actions
  addToast: (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Modal actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  modals: {},
  sidebarOpen: true,
  theme: 'light',

  addToast: (message, type, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  openModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: true },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: false },
    })),

  closeAllModals: () => set({ modals: {} }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setTheme: (theme) => set({ theme }),
}));
