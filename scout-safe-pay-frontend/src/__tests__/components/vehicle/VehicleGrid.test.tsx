import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VehicleGrid } from '@/components/vehicle/VehicleGrid';

// Mock the hooks
jest.mock('@/lib/hooks/api', () => ({
  useVehicles: jest.fn(),
}));

jest.mock('@/lib/stores/filterStore', () => ({
  useFilterStore: jest.fn(),
}));

jest.mock('@/lib/stores/cartStore', () => ({
  useCartStore: jest.fn(),
}));

jest.mock('@/lib/stores/uiStore', () => ({
  useUIStore: jest.fn(),
}));

import { useVehicles } from '@/lib/hooks/api';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useUIStore } from '@/lib/stores/uiStore';

const mockVehicles = [
  {
    id: 1,
    make: 'BMW',
    model: 'X5',
    year: 2020,
    price: 45000,
    mileage: 50000,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    primary_image: '/images/bmw.jpg',
    images: ['/images/bmw.jpg'],
  },
  {
    id: 2,
    make: 'Audi',
    model: 'A4',
    year: 2019,
    price: 30000,
    mileage: 60000,
    transmission: 'Manual',
    fuel_type: 'Petrol',
    primary_image: '/images/audi.jpg',
    images: ['/images/audi.jpg'],
  },
];

describe('VehicleGrid', () => {
  beforeEach(() => {
    (useFilterStore as jest.Mock).mockReturnValue({
      filters: {
        priceRange: [0, 100000],
        brands: [],
      },
    });

    (useCartStore as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
    });

    (useUIStore as jest.Mock).mockReturnValue({
      addToast: jest.fn(),
    });
  });

  it('renders list of vehicles', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: mockVehicles,
      isLoading: false,
    });

    render(<VehicleGrid />);
    
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('Audi A4')).toBeInTheDocument();
  });

  it('shows empty state when no vehicles', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<VehicleGrid />);
    
    expect(screen.getByText(/No vehicles found/i)).toBeInTheDocument();
  });

  it('handles null vehicles safely (no crash)', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    expect(() => render(<VehicleGrid />)).not.toThrow();
    expect(screen.getByText(/No vehicles found/i)).toBeInTheDocument();
  });

  it('handles undefined vehicles safely (no crash)', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    expect(() => render(<VehicleGrid />)).not.toThrow();
    expect(screen.getByText(/No vehicles found/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
    });

    render(<VehicleGrid />);
    
    expect(screen.getByText(/Loading vehicles/i)).toBeInTheDocument();
  });

  it('displays vehicle price', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: mockVehicles,
      isLoading: false,
    });

    render(<VehicleGrid />);
    
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
    expect(screen.getByText(/30,000/)).toBeInTheDocument();
  });

  it('displays vehicle specifications', () => {
    (useVehicles as jest.Mock).mockReturnValue({
      data: mockVehicles,
      isLoading: false,
    });

    render(<VehicleGrid />);
    
    expect(screen.getByText(/Automatic/)).toBeInTheDocument();
    expect(screen.getByText(/Diesel/)).toBeInTheDocument();
    expect(screen.getByText(/Manual/)).toBeInTheDocument();
    expect(screen.getByText(/Petrol/)).toBeInTheDocument();
  });
});
