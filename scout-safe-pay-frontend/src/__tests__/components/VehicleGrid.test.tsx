import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VehicleGrid from '@/components/VehicleGrid';

jest.mock('@/lib/api/vehicles');

describe('VehicleGrid', () => {
  const mockVehicles = [
    {
      id: 1,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 50000,
      images: [{ url: '/car1.jpg', is_primary: true }]
    },
    {
      id: 2,
      make: 'Audi',
      model: 'A4',
      year: 2021,
      price: 40000,
      images: [{ url: '/car2.jpg', is_primary: true }]
    },
    {
      id: 3,
      make: 'Mercedes',
      model: 'C-Class',
      year: 2023,
      price: 60000,
      images: [{ url: '/car3.jpg', is_primary: true }]
    }
  ];

  it('renders list of vehicles', async () => {
    render(<VehicleGrid vehicles={mockVehicles} />);

    await waitFor(() => {
      expect(screen.getByText('BMW X5')).toBeInTheDocument();
      expect(screen.getByText('Audi A4')).toBeInTheDocument();
      expect(screen.getByText('Mercedes C-Class')).toBeInTheDocument();
    });
  });

  it('shows empty state when no vehicles', () => {
    render(<VehicleGrid vehicles={[]} />);

    expect(screen.getByText(/no vehicles found/i)).toBeInTheDocument();
  });

  it('displays loading skeleton during fetch', () => {
    render(<VehicleGrid vehicles={null} isLoading={true} />);

    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('handles null/undefined vehicles array safely', () => {
    render(<VehicleGrid vehicles={null} />);

    expect(screen.queryByText('BMW X5')).not.toBeInTheDocument();
  });

  it('renders correct number of vehicle cards', () => {
    render(<VehicleGrid vehicles={mockVehicles} />);

    const vehicleCards = screen.getAllByRole('article');
    expect(vehicleCards).toHaveLength(3);
  });

  it('applies grid layout classes', () => {
    const { container } = render(<VehicleGrid vehicles={mockVehicles} />);

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('handles empty array gracefully', () => {
    const { container } = render(<VehicleGrid vehicles={[]} />);

    expect(container.querySelector('.empty-state')).toBeInTheDocument();
  });

  it('passes vehicle props to VehicleCard components', async () => {
    render(<VehicleGrid vehicles={mockVehicles} />);

    await waitFor(() => {
      expect(screen.getByText('€50,000')).toBeInTheDocument();
      expect(screen.getByText('€40,000')).toBeInTheDocument();
      expect(screen.getByText('€60,000')).toBeInTheDocument();
    });
  });

  it('shows loading state with correct skeleton count', () => {
    render(<VehicleGrid vehicles={null} isLoading={true} skeletonCount={6} />);

    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons).toHaveLength(6);
  });

  it('displays message when no results match filters', () => {
    render(<VehicleGrid vehicles={[]} emptyMessage="No vehicles match your filters" />);

    expect(screen.getByText('No vehicles match your filters')).toBeInTheDocument();
  });
});
