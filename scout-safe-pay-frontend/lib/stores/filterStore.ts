import { create } from 'zustand';

export interface Filters {
  priceRange: [number, number];
  brands: string[];
  yearRange: [number, number];
  mileageRange: [number, number];
  transmission: string[];
  fuelType: string[];
  condition: string[];
  searchQuery: string;
}

interface FilterStore {
  filters: Filters;
  isOpen: boolean;
  
  // Actions
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  toggleFilterPanel: () => void;
  updatePriceRange: (range: [number, number]) => void;
  addBrand: (brand: string) => void;
  removeBrand: (brand: string) => void;
  updateFuelType: (types: string[]) => void;
}

const defaultFilters: Filters = {
  priceRange: [0, 150000],
  brands: [],
  yearRange: [1990, new Date().getFullYear()],
  mileageRange: [0, 300000],
  transmission: [],
  fuelType: [],
  condition: [],
  searchQuery: '',
};

export const useFilterStore = create<FilterStore>((set) => ({
  filters: defaultFilters,
  isOpen: false,

  setFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  resetFilters: () =>
    set({
      filters: defaultFilters,
    }),

  toggleFilterPanel: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  updatePriceRange: (range) =>
    set((state) => ({
      filters: { ...state.filters, priceRange: range },
    })),

  addBrand: (brand) =>
    set((state) => ({
      filters: {
        ...state.filters,
        brands: [...state.filters.brands, brand],
      },
    })),

  removeBrand: (brand) =>
    set((state) => ({
      filters: {
        ...state.filters,
        brands: state.filters.brands.filter((b) => b !== brand),
      },
    })),

  updateFuelType: (types) =>
    set((state) => ({
      filters: { ...state.filters, fuelType: types },
    })),
}));
