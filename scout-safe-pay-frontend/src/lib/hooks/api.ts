import { useQuery, useMutation } from '@tanstack/react-query';
import { LoginFormData } from '@/lib/schemas';
import { vehicleService } from '@/lib/api/vehicles';
import { apiClient } from '@/lib/api/client';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      // Real API login
      const response = await apiClient.post<{
        token: string;
        user: {
          id: number;
          email: string;
          name: string;
          role: 'buyer' | 'seller' | 'dealer' | 'admin';
          user_type?: 'buyer' | 'seller' | 'dealer' | 'admin';
        };
      }>('/login', {
        email: data.email,
        password: data.password,
      });
      return response;
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

export const useDashboardStats = (userType: 'buyer' | 'seller' | 'dealer') => {
  return useQuery({
    queryKey: ['dashboard-stats', userType],
    queryFn: async () => {
      // Connect to real API endpoints based on user type
      const endpoint = `/${userType}/stats`;
      
      const response = await apiClient.get<DashboardStats>(endpoint);
      return response;
    },
  });
};

interface DashboardStats {
  totalSales?: number;
  totalOrders?: number;
  pendingOrders?: number;
  totalCustomers?: number;
  revenue?: number;
  conversionRate?: number;
  chartData?: Array<{ month: string; sales: number; orders: number }>;
  revenueChart?: Array<{ date: string; amount: number }>;
  topVehicles?: Array<{ name: string; sales: number }>;
  [key: string]: any; // Allow for additional dynamic properties from different user types
}
