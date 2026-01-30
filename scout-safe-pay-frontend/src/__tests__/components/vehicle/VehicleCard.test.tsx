import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedVehicleCard from '@/components/vehicle/EnhancedVehicleCard';

const mockVehicle = {
  id: '1',
  title: 'BMW X5 2020',
  make: 'BMW',
  model: 'X5',
  year: 2020,
  price: 45000,
  mileage: 50000,
  fuelType: 'Diesel',
  transmission: 'Automatic',
  location: 'Berlin, Germany',
  images: ['/images/bmw-x5.jpg'],
  condition: 'excellent' as const,
  status: 'active' as const,
  isVerified: true,
};

describe('EnhancedVehicleCard', () => {
  it('renders vehicle information correctly', () => {
    render(<EnhancedVehicleCard {...mockVehicle} />);
    
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/50,000/)).toBeInTheDocument();
  });

  it('displays image with correct alt text', () => {
    render(<EnhancedVehicleCard {...mockVehicle} />);
    
    const images = screen.getAllByRole('img');
    const vehicleImage = images.find(img => 
      img.getAttribute('alt')?.includes('BMW X5')
    );
    
    expect(vehicleImage).toBeInTheDocument();
  });

  it('shows favorite button', () => {
    render(<EnhancedVehicleCard {...mockVehicle} />);
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).toBeInTheDocument();
  });

  it('clicking favorite calls callback', () => {
    const mockOnSave = jest.fn();
    render(<EnhancedVehicleCard {...mockVehicle} onSave={mockOnSave} />);
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('formats price correctly', () => {
    render(<EnhancedVehicleCard {...mockVehicle} />);
    
    // Price should be formatted with separators
    expect(screen.getByText(/45,000/)).toBeInTheDocument();
  });

  it('displays vehicle specs (fuel type and transmission)', () => {
    render(<EnhancedVehicleCard {...mockVehicle} />);
    
    expect(screen.getByText(/Diesel/)).toBeInTheDocument();
    expect(screen.getByText(/Automatic/)).toBeInTheDocument();
  });

  it('shows location information', () => {
    render(<EnhancedVehicleCard {...mockVehicle} />);
    
    expect(screen.getByText(/Berlin/)).toBeInTheDocument();
  });

  it('displays verified badge when isVerified is true', () => {
    render(<EnhancedVehicleCard {...mockVehicle} isVerified={true} />);
    
    // Check for verified indicator
    const verifiedElements = screen.queryAllByText(/verified/i);
    expect(verifiedElements.length).toBeGreaterThan(0);
  });

  it('handles missing optional props gracefully', () => {
    const minimalVehicle = {
      id: '2',
      title: 'Audi A4',
      make: 'Audi',
      model: 'A4',
      year: 2019,
      price: 30000,
      mileage: 60000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      location: 'Munich',
      images: [],
    };
    
    expect(() => render(<EnhancedVehicleCard {...minimalVehicle} />)).not.toThrow();
  });
});
