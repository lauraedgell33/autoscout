import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  price: number;
  quantity: number;
  image?: string;
  addedAt: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (vehicleId: string) => void;
  updateQuantity: (vehicleId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.vehicleId === item.vehicleId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
            return { items: [...state.items], total: get().getTotal() };
          }
          return { items: [...state.items, item], total: get().getTotal() };
        }),

      removeItem: (vehicleId) =>
        set((state) => ({
          items: state.items.filter((i) => i.vehicleId !== vehicleId),
          total: get().getTotal(),
        })),

      updateQuantity: (vehicleId, quantity) =>
        set((state) => {
          const items = state.items.map((item) =>
            item.vehicleId === vehicleId ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          return { items, total: get().getTotal() };
        }),

      clearCart: () => set({ items: [], total: 0 }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
