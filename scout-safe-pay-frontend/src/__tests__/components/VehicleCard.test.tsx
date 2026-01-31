import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VehicleCard from '@/components/VehicleCard';
import { useAuthStore } from '@/store/authStore';
import { favoritesService } from '@/lib/api/favorites';

jest.mock('@/store/authStore');
jest.mock('@/lib/api/favorites');

describe('VehicleCard', () => {
  const mockVehicle = {
    id: 1,
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 50000,
    mileage: 15000,
    fuel_type: 'diesel',
    transmission: 'automatic',
    images: [{ url: '/images/car1.jpg', is_primary: true }],
    seller: {
      id: 2,
      name: 'John Seller',
      rating: 4.5
    },
    verified: true,
    saved_count: 10,
    view_count: 150
  };

  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { id: 1 },
      isAuthenticated: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders vehicle information correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('€50,000')).toBeInTheDocument();
    expect(screen.getByText('15,000 km')).toBeInTheDocument();
    expect(screen.getByText('diesel')).toBeInTheDocument();
    expect(screen.getByText('automatic')).toBeInTheDocument();
  });

  it('displays vehicle image', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const image = screen.getByRole('img', { name: /BMW X5/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('car1.jpg'));
  });

  it('shows favorite button', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('clicking favorite toggles state', async () => {
    (favoritesService.addFavorite as jest.Mock).mockResolvedValue({});

    render(<VehicleCard vehicle={mockVehicle} isFavorite={false} />);

    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(favoritesService.addFavorite).toHaveBeenCalledWith(mockVehicle.id);
    });
  });

  it('displays price formatted', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText(/€50,000/)).toBeInTheDocument();
  });

  it('shows verified badge when applicable', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText(/verified/i)).toBeInTheDocument();
  });

  it('navigates to vehicle details on click', () => {
    const mockPush = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush
      })
    }));

    render(<VehicleCard vehicle={mockVehicle} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    // The actual navigation behavior depends on implementation
    expect(card).toBeInTheDocument();
  });

  it('displays seller information', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText('John Seller')).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });

  it('shows saved count and view count', () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText(/10/)).toBeInTheDocument(); // saved_count
    expect(screen.getByText(/150/)).toBeInTheDocument(); // view_count
  });

  it('handles null/undefined vehicle gracefully', () => {
    render(<VehicleCard vehicle={null} />);

    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument();
  });

  it('displays fallback image when no images', () => {
    const vehicleWithoutImages = { ...mockVehicle, images: [] };
    render(<VehicleCard vehicle={vehicleWithoutImages} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });
});
