import { useQuery, useMutation } from '@tanstack/react-query';
import { LoginFormData } from '@/lib/schemas';
import { vehicleService } from '@/lib/api/vehicles';

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
      // Use real API instead of mock data
      const response = await vehicleService.getVehicles(filters);
      return response.data || [];
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
