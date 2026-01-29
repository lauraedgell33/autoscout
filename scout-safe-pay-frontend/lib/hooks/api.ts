import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from './client';
import { User } from '@/lib/stores/userStore';

// ============ User Queries ============
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export const useLogin = (options?: UseMutationOptions<LoginResponse, Error, LoginPayload>) =>
  useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (data) => apiClient.post('/auth/login', data).then((res) => res.data),
    ...options,
  });

export const useLogout = (options?: UseMutationOptions<void, Error>) =>
  useMutation<void, Error>({
    mutationFn: () => apiClient.post('/auth/logout').then(() => {}),
    ...options,
  });

export const useUser = (options?: UseQueryOptions<User, Error>) =>
  useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: () => apiClient.get('/auth/user').then((res) => res.data),
    ...options,
  });

// ============ Vehicle Queries ============
export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  condition: string;
  images: string[];
  description: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  createdAt: string;
}

interface GetVehiclesParams {
  page?: number;
  limit?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
}

export const useVehicles = (params?: GetVehiclesParams, options?: UseQueryOptions<Vehicle[], Error>) =>
  useQuery<Vehicle[], Error>({
    queryKey: ['vehicles', params],
    queryFn: () => apiClient.get('/vehicles', { params }).then((res) => res.data),
    ...options,
  });

export const useVehicle = (id: string, options?: UseQueryOptions<Vehicle, Error>) =>
  useQuery<Vehicle, Error>({
    queryKey: ['vehicle', id],
    queryFn: () => apiClient.get(`/vehicles/${id}`).then((res) => res.data),
    enabled: !!id,
    ...options,
  });

export const useCreateVehicle = (options?: UseMutationOptions<Vehicle, Error, FormData>) =>
  useMutation<Vehicle, Error, FormData>({
    mutationFn: (data) => apiClient.post('/vehicles', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
    ...options,
  });

// ============ Order Queries ============
export interface Order {
  id: string;
  orderNumber: string;
  items: any[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  createdAt: string;
}

export const useOrders = (options?: UseQueryOptions<Order[], Error>) =>
  useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: () => apiClient.get('/orders').then((res) => res.data),
    ...options,
  });

export const useOrder = (id: string, options?: UseQueryOptions<Order, Error>) =>
  useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: () => apiClient.get(`/orders/${id}`).then((res) => res.data),
    enabled: !!id,
    ...options,
  });

export const useCreateOrder = (options?: UseMutationOptions<Order, Error, any>) =>
  useMutation<Order, Error, any>({
    mutationFn: (data) => apiClient.post('/orders', data).then((res) => res.data),
    ...options,
  });

// ============ Analytics Queries ============
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  revenueChart: Array<{ date: string; amount: number }>;
  topVehicles: Array<{ name: string; sales: number }>;
}

export const useDashboardStats = (options?: UseQueryOptions<DashboardStats, Error>) =>
  useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats'],
    queryFn: () => apiClient.get('/analytics/dashboard').then((res) => res.data),
    ...options,
  });
