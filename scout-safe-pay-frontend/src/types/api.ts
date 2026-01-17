/**
 * API Response Types - Centralized type definitions
 */

// Pagination metadata
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  path: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
}

// User types
export interface UserType {
  id: number
  name: string
  email: string
  user_type: 'buyer' | 'seller' | 'admin'
  dealer_id: number | null
  kyc_status: 'pending' | 'approved' | 'rejected' | null
  phone: string | null
  date_of_birth: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  created_at: string
  updated_at: string
}

// Vehicle Category
export type VehicleCategory = 
  | 'car'
  | 'motorcycle'
  | 'truck'
  | 'van'
  | 'caravan'
  | 'agricultural'
  | 'construction'
  | 'trailer'
  | 'other'

// AutoScout24 Data
export interface AutoScout24Data {
  listing_id?: string
  dealer_id?: string
  external_id?: string
  sync_status?: 'synced' | 'pending' | 'error'
  last_sync_at?: string
  [key: string]: any // Additional dynamic fields
}

// Vehicle interface
export interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  price: number
  mileage?: number
  fuel_type?: string
  transmission?: string
  color?: string
  vin?: string
  description?: string
  images?: string[]
  primary_image?: string
  status: 'draft' | 'active' | 'sold' | 'reserved' | 'removed'
  category?: VehicleCategory
  seller_id: number
  dealer_id?: number | null
  autoscout_listing_id?: string | null
  autoscout_data?: AutoScout24Data | null
  created_at: string
  updated_at: string
}

// Transaction types
export interface Transaction {
  id: number
  transaction_code: string
  buyer_id: number
  seller_id: number
  vehicle_id: number
  dealer_id?: number | null
  amount: string
  service_fee: string
  dealer_commission?: string
  status: TransactionStatus
  payment_method: 'bank_transfer' | 'credit_card' | 'paypal'
  payment_reference?: string
  escrow_account_iban?: string
  payment_proof_url?: string
  payment_proof_uploaded_at?: string
  created_at: string
  updated_at: string
  vehicle?: Vehicle
  buyer?: UserType
  seller?: UserType
}

export type TransactionStatus = 
  | 'pending'
  | 'awaiting_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'inspection_scheduled'
  | 'inspection_passed'
  | 'inspection_failed'
  | 'ownership_transferred'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'refunded'

// KYC types
export type IDDocumentType = 'passport' | 'id_card' | 'drivers_license'

export interface KYCSubmission {
  id_document_type: IDDocumentType
  id_document_number: string
  id_document_image: File
  selfie_image: File
}

export interface KYCResponse {
  message: string
  user: UserType
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Error response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
