// Vehicle related types
export interface Vehicle {
  id: number
  dealer_id: number | null
  seller_id: number
  make: string
  model: string
  year: number
  vin: string | null
  price: string
  currency: string
  description: string | null
  mileage: number | null
  fuel_type: FuelType | null
  transmission: Transmission | null
  color: string | null
  doors: number | null
  seats: number | null
  body_type: BodyType | null
  engine_size: number | null
  power_hp: number | null
  location_city: string | null
  location_country: string
  status: VehicleStatus
  autoscout_listing_id: string | null
  autoscout_data: any | null
  images: string[] | null
  primary_image: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  dealer?: Dealer
  seller?: User
  transactions?: Transaction[]
}

export type VehicleStatus = 'draft' | 'active' | 'sold' | 'reserved' | 'removed'
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'plugin_hybrid' | 'lpg' | 'cng' | 'hydrogen'
export type Transmission = 'manual' | 'automatic' | 'semi_automatic'
export type BodyType = 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'wagon' | 'van' | 'truck' | 'minivan'

// User related types
export interface User {
  id: number
  name: string
  email: string
  user_type: 'buyer' | 'seller' | 'admin'
  dealer_id: number | null
  phone: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string
  is_verified: boolean
  kyc_status: 'pending' | 'approved' | 'rejected'
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Dealer related types
export interface Dealer {
  id: number
  name: string
  company_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
  website: string | null
  logo_url: string | null
  description: string | null
  rating: number | null
  total_sales: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

// Transaction related types
export interface Transaction {
  id: string
  vehicle_id: number
  buyer_id: number
  seller_id: number
  dealer_id: number | null
  amount: string
  currency: string
  status: TransactionStatus
  payment_method: string | null
  payment_proof: string | null
  escrow_status: EscrowStatus
  escrow_released_at: string | null
  buyer_confirmed_at: string | null
  seller_confirmed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  vehicle?: Vehicle
  buyer?: User
  seller?: User
  dealer?: Dealer
  payments?: Payment[]
}

export type TransactionStatus = 'pending' | 'paid' | 'completed' | 'cancelled' | 'disputed'
export type EscrowStatus = 'pending' | 'locked' | 'released' | 'refunded'

// Payment related types
export interface Payment {
  id: string
  transaction_id: string
  amount: string
  currency: string
  payment_method: string
  payment_status: PaymentStatus
  payment_proof: string | null
  payment_date: string | null
  verified_at: string | null
  verified_by: number | null
  notes: string | null
  created_at: string
  updated_at: string
  transaction?: Transaction
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

// API Response types
export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
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

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface ApiResponse<T> {
  message: string
  data?: T
}

// Filter types
export interface VehicleFilters {
  status?: VehicleStatus
  make?: string
  model?: string
  year_from?: number
  year_to?: number
  price_min?: number
  price_max?: number
  mileage_max?: number
  fuel_type?: FuelType
  transmission?: Transmission
  body_type?: BodyType
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

// Form data types
export interface VehicleFormData {
  make: string
  model: string
  year: number
  vin?: string
  price: number
  currency?: string
  description?: string
  mileage?: number
  fuel_type?: FuelType
  transmission?: Transmission
  color?: string
  doors?: number
  seats?: number
  body_type?: BodyType
  engine_size?: number
  power_hp?: number
  location_city?: string
  location_country?: string
  status?: 'draft' | 'active'
}

export interface TransactionFormData {
  vehicle_id: number
  seller_id: number
  amount: number
  notes?: string
}

// Statistics types
export interface VehicleStatistics {
  total: number
  active: number
  sold: number
  draft: number
  average_price: number
  by_fuel_type: Array<{ fuel_type: string; count: number }>
  by_transmission: Array<{ transmission: string; count: number }>
}
