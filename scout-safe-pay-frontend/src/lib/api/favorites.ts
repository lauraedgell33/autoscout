import { apiClient } from './client';
import { Vehicle } from './vehicles';
import { PaginationMeta } from '@/types/api';

export interface Favorite {
  id: number;
  user_id: number;
  vehicle_id: number;
  created_at: string;
  vehicle?: Vehicle;
}

export interface FavoritesListResponse {
  data: Favorite[];
  meta: PaginationMeta;
}

export const favoritesService = {
  /**
   * Get all favorites for the authenticated user
   */
  async list(params?: {
    page?: number;
    per_page?: number;
  }): Promise<FavoritesListResponse> {
    const response = await apiClient.get('/favorites', { params });
    return response.data;
  },

  /**
   * Add a vehicle to favorites
   */
  async add(vehicleId: number): Promise<Favorite> {
    const response = await apiClient.post(`/favorites`, { vehicle_id: vehicleId });
    return response.data;
  },

  /**
   * Remove a vehicle from favorites
   */
  async remove(vehicleId: number): Promise<void> {
    await apiClient.delete(`/favorites/${vehicleId}`);
  },

  /**
   * Check if a vehicle is favorited
   */
  async isFavorite(vehicleId: number): Promise<boolean> {
    try {
      const response = await apiClient.get(`/favorites/${vehicleId}/check`);
      return response.data.is_favorite;
    } catch (error) {
      return false;
    }
  },

  /**
   * Toggle favorite status
   */
  async toggle(vehicleId: number): Promise<{ is_favorite: boolean }> {
    const response = await apiClient.post(`/favorites/${vehicleId}/toggle`);
    return response.data;
  }
};
