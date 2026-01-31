import apiClient from './client'
import { AutoScout24Data } from '@/types/api'

export interface Vehicle {
  id: number
  dealer_id: number | null
  seller_id: number
  category: 'car' | 'motorcycle' | 'van' | 'truck' | 'trailer' | 'caravan' | 'motorhome' | 'construction_machinery' | 'agricultural_machinery' | 'forklift' | 'boat' | 'atv' | 'quad'
  make: string
  model: string
  year: number
  vin: string | null
  price: string
  currency: string
  description: string | null
  mileage: number | null
  fuel_type: string | null
  transmission: string | null
  color: string | null
  doors: number | null
  seats: number | null
  body_type: string | null
  engine_size: number | null
  power_hp: number | null
  location_city: string | null
  location_country: string
  latitude: number | null
  longitude: number | null
  status: 'draft' | 'active' | 'sold' | 'reserved' | 'removed'
  // Optional quality/condition flag if provided by backend
  condition?: 'new' | 'excellent' | 'good' | 'fair' | null
  autoscout_listing_id: string | null
  autoscout_data: AutoScout24Data | null
  images: string[] | null
  primary_image: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  dealer?: any
  seller?: any
}

export interface VehicleFilters {
  category?: string
  status?: string
  make?: string
  model?: string
  year_from?: number
  year_to?: number
  price_min?: number
  price_max?: number
  mileage_max?: number
  fuel_type?: string
  transmission?: string
  body_type?: string
  location_city?: string
  location_country?: string
  dealer_id?: number
  seller_id?: number
  search?: string
  sort_by?: 'price' | 'year' | 'mileage' | 'created_at' | 'make' | 'model'
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface VehicleListResponse {
  current_page: number
  data: Vehicle[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface VehicleStatistics {
  total: number
  active: number
  sold: number
  draft: number
  average_price: number
  by_fuel_type: Array<{ fuel_type: string; count: number }>
  by_transmission: Array<{ transmission: string; count: number }>
}

export interface CreateVehicleData {
  make: string
  model: string
  year: number
  vin?: string
  price: number
  currency?: string
  description?: string
  mileage?: number
  fuel_type?: string
  transmission?: string
  color?: string
  doors?: number
  seats?: number
  body_type?: string
  engine_size?: number
  power_hp?: number
  location_city?: string
  location_country?: string
  latitude?: number
  longitude?: number
  status?: 'draft' | 'active'
}

export const vehicleService = {
  /**
   * Get list of vehicles with filters
   */
  async getVehicles(filters?: VehicleFilters): Promise<VehicleListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get<VehicleListResponse>(`/vehicles?${params.toString()}`)
    return response
  },

  /**
   * Get vehicle by ID
   */
  async getVehicle(id: number): Promise<Vehicle> {
    const response = await apiClient.get<{ vehicle: Vehicle }>(`/vehicles/${id}`)
    return response.vehicle
  },

  /**
   * Alias for getVehicle
   */
  async getById(id: string | number): Promise<Vehicle> {
    return this.getVehicle(typeof id === 'string' ? parseInt(id) : id)
  },

  /**
   * Get featured vehicles
   */
  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get<{ vehicles: Vehicle[] }>('/vehicles-featured')
    return response.vehicles
  },

  /**
   * Get vehicle statistics
   */
  async getStatistics(): Promise<VehicleStatistics> {
    const response = await apiClient.get<VehicleStatistics>('/vehicles-statistics')
    return response
  },

  /**
   * Create a new vehicle (requires authentication)
   */
  async createVehicle(data: CreateVehicleData): Promise<Vehicle> {
    const response = await apiClient.post<{ vehicle: Vehicle }>('/vehicles', data)
    return response.vehicle
  },

  /**
   * Update vehicle (requires authentication)
   */
  async updateVehicle(id: number, data: Partial<CreateVehicleData>): Promise<Vehicle> {
    const response = await apiClient.put<{ vehicle: Vehicle }>(`/vehicles/${id}`, data)
    return response.vehicle
  },

  /**
   * Delete vehicle (requires authentication)
   */
  async deleteVehicle(id: number): Promise<void> {
    await apiClient.delete(`/vehicles/${id}`)
  },

  /**
   * Upload vehicle images (requires authentication)
   */
  async uploadImages(id: number, images: File[], primaryIndex?: number): Promise<{ images: string[]; primary_image: string }> {
    const formData = new FormData()
    
    images.forEach((image, index) => {
      formData.append(`images[]`, image)
    })

    if (primaryIndex !== undefined) {
      formData.append('primary', primaryIndex.toString())
    }

    const response = await apiClient.post<{ images: string[]; primary_image: string }>(`/vehicles/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response
  },

  /**
   * Get my vehicles (requires authentication)
   */
  async getMyVehicles(filters?: { status?: string; per_page?: number; page?: number }): Promise<VehicleListResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await apiClient.get<VehicleListResponse>(`/my-vehicles?${params.toString()}`)
    return response
  },

  /**
   * Helper: Format price for display
   */
  formatPrice(price: string | number, currency: string = 'EUR'): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice)
  },

  /**
   * Helper: Format mileage
   */
  formatMileage(mileage: number | null): string {
    if (!mileage) return 'N/A'
    return new Intl.NumberFormat('de-DE').format(mileage) + ' km'
  },

  /**
   * Helper: Get fuel type label
   */
  getFuelTypeLabel(fuelType: string | null): string {
    const labels: Record<string, string> = {
      petrol: 'Petrol',
      diesel: 'Diesel',
      electric: 'Electric',
      hybrid: 'Hybrid',
      plugin_hybrid: 'Plug-in Hybrid',
      lpg: 'LPG',
      cng: 'CNG',
      hydrogen: 'Hydrogen',
    }
    return fuelType ? labels[fuelType] || fuelType : 'N/A'
  },

  /**
   * Helper: Get transmission label
   */
  getTransmissionLabel(transmission: string | null): string {
    const labels: Record<string, string> = {
      manual: 'Manual',
      automatic: 'Automatic',
      semi_automatic: 'Semi-Automatic',
    }
    return transmission ? labels[transmission] || transmission : 'N/A'
  },

  /**
   * Helper: Get body type label
   */
  getBodyTypeLabel(bodyType: string | null): string {
    const labels: Record<string, string> = {
      sedan: 'Sedan',
      hatchback: 'Hatchback',
      suv: 'SUV',
      coupe: 'Coupe',
      convertible: 'Convertible',
      wagon: 'Wagon',
      van: 'Van',
      truck: 'Truck',
      minivan: 'Minivan',
    }
    return bodyType ? labels[bodyType] || bodyType : 'N/A'
  },
}

export default vehicleService
