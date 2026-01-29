import { useQuery, useMutation } from '@tanstack/react-query';
import { LoginFormData } from '@/lib/schemas';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      // Mock login
      return {
        token: 'mock-token',
        user: {
          id: '1',
          email: data.email,
          name: 'User',
          role: 'buyer' as const,
        },
      };
    },
  });
};

export const useVehicles = (filters?: { minPrice?: number; maxPrice?: number; brand?: string }) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      // Mock vehicles data
      return [
        {
          id: '1',
          title: 'Tesla Model 3',
          name: 'Tesla Model 3',
          price: 45000,
          image: '/vehicles/tesla.jpg',
          images: ['/vehicles/tesla.jpg'],
          category: 'Electric',
          mileage: 12000,
          year: 2023,
          transmission: 'Automatic',
          fuelType: 'Electric',
        },
        {
          id: '2',
          title: 'BMW 3 Series',
          name: 'BMW 3 Series',
          price: 52000,
          image: '/vehicles/bmw.jpg',
          images: ['/vehicles/bmw.jpg'],
          category: 'Sedan',
          mileage: 25000,
          year: 2022,
          transmission: 'Automatic',
          fuelType: 'Diesel',
        },
        {
          id: '3',
          title: 'Mercedes C-Class',
          name: 'Mercedes C-Class',
          price: 58000,
          image: '/vehicles/mercedes.jpg',
          images: ['/vehicles/mercedes.jpg'],
          category: 'Sedan',
          mileage: 18000,
          year: 2023,
          transmission: 'Automatic',
          fuelType: 'Petrol',
        },
        {
          id: '4',
          title: 'Audi A4',
          name: 'Audi A4',
          price: 48000,
          image: '/vehicles/audi.jpg',
          images: ['/vehicles/audi.jpg'],
          category: 'Sedan',
          mileage: 35000,
          year: 2021,
          transmission: 'Manual',
          fuelType: 'Diesel',
        },
      ];
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Mock data for dashboard
      return {
        totalSales: 45000,
        totalOrders: 128,
        pendingOrders: 12,
        totalCustomers: 542,
        revenue: 156000,
        conversionRate: 3.45,
        chartData: [
          { month: 'Jan', sales: 4000, orders: 24 },
          { month: 'Feb', sales: 3000, orders: 13 },
          { month: 'Mar', sales: 2000, orders: 9 },
          { month: 'Apr', sales: 2780, orders: 39 },
          { month: 'May', sales: 1890, orders: 48 },
          { month: 'Jun', sales: 2390, orders: 38 },
        ],
        revenueChart: [
          { date: '2024-01-01', amount: 12000 },
          { date: '2024-01-02', amount: 15000 },
          { date: '2024-01-03', amount: 18000 },
          { date: '2024-01-04', amount: 16000 },
          { date: '2024-01-05', amount: 22000 },
          { date: '2024-01-06', amount: 25000 },
        ],
        topVehicles: [
          { name: 'Tesla Model 3', sales: 45 },
          { name: 'BMW 3 Series', sales: 38 },
          { name: 'Mercedes C-Class', sales: 35 },
          { name: 'Audi A4', sales: 32 },
        ],
      };
    },
  });
};
