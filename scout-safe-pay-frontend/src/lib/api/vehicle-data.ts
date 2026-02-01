import { apiClient } from '@/lib/api-client'

export interface VehicleMake {
  id: string
  name: string
  logo?: string
}

export interface VehicleModel {
  name: string
  years?: number[]
}

export interface VehicleDataResponse {
  makes: VehicleMake[]
}

export interface VehicleModelsResponse {
  models: VehicleModel[]
}

/**
 * Vehicle Data API Service
 * Fetches dynamic vehicle makes and models from backend
 */
export const vehicleDataService = {
  /**
   * Get all makes for a specific category
   * @param category - Vehicle category (car, motorcycle, van, etc.)
   */
  async getMakesByCategory(category: string): Promise<VehicleMake[]> {
    try {
      const response = await apiClient.get<VehicleDataResponse>(
        `/vehicle-data/makes/${category}`
      )
      return response.makes || []
    } catch (error) {
      console.error(`Failed to fetch makes for category ${category}:`, error)
      // Return empty array on error - form can still work with manual input
      return []
    }
  },

  /**
   * Get models for a specific make within a category
   * @param category - Vehicle category
   * @param makeId - Make identifier
   */
  async getModelsByMake(
    category: string,
    makeId: string
  ): Promise<VehicleModel[]> {
    try {
      const response = await apiClient.get<VehicleModelsResponse>(
        `/vehicle-data/models/${category}/${makeId}`
      )
      return response.models || []
    } catch (error) {
      console.error(
        `Failed to fetch models for ${makeId} in category ${category}:`,
        error
      )
      // Return empty array on error
      return []
    }
  },

  /**
   * Get all makes across all categories
   */
  async getAllMakes(): Promise<VehicleMake[]> {
    try {
      const response = await apiClient.get<VehicleDataResponse>(
        '/vehicle-data/makes'
      )
      return response.makes || []
    } catch (error) {
      console.error('Failed to fetch all makes:', error)
      return []
    }
  },

  /**
   * Search makes by name across categories
   * @param query - Search query
   */
  async searchMakes(query: string): Promise<VehicleMake[]> {
    try {
      const response = await apiClient.get<VehicleDataResponse>(
        `/vehicle-data/makes/search?q=${encodeURIComponent(query)}`
      )
      return response.makes || []
    } catch (error) {
      console.error(`Failed to search makes for "${query}":`, error)
      return []
    }
  }
}

export default vehicleDataService
