import { create } from 'zustand';

interface FilterStore {
  minPrice: number;
  maxPrice: number;
  category: string;
  searchTerm: string;
  filters?: {
    priceRange: [number, number];
    brands: string[];
  };
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  minPrice: 0,
  maxPrice: 1000000,
  category: '',
  searchTerm: '',
  filters: {
    priceRange: [0, 1000000],
    brands: [],
  },
  setMinPrice: (price) => set({ minPrice: price }),
  setMaxPrice: (price) => set({ maxPrice: price }),
  setCategory: (category) => set({ category }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  reset: () => set({ minPrice: 0, maxPrice: 1000000, category: '', searchTerm: '' }),
}));
