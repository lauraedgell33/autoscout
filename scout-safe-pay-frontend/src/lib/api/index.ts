// Centralized API exports
// Import and re-export all API services for easy access

// Core client
export { apiClient } from './client'

// Authentication
export { authService } from './auth'
export type { RegisterData, LoginData, AuthResponse } from './auth'

// Vehicles
export { vehicleService } from './vehicles'
export type { Vehicle, VehicleFilters, VehicleListResponse, VehicleStatistics, CreateVehicleData } from './vehicles'

// Transactions
export { transactionService } from './transactions'
export type { Transaction, TransactionStatus, BankTransferDetails, CreateTransactionData } from './transactions'

// Orders (Bank Transfer Flow)
export { orderService } from './orders'
export type { PaymentInstructions, CreateOrderData, ContractData } from './orders'

// Reviews
export { reviewService } from './reviews'
export type { Review, ReviewFilters, ReviewFormData, ReviewStats, PaginatedReviews, ReviewModerationStats } from './reviews'

// Dealers
export { getDealers, getDealer, getDealerStatistics, createDealer, updateDealer, deleteDealer, getAdminDealers } from './dealers'
export type { DealersResponse, DealerResponse, DealerStatistics } from './dealers'

// Messages
export { messageService } from './messages'
export type { Message, Conversation, ConversationDetail, SendMessageData } from './messages'

// Invoices
export { invoiceService } from './invoices'

// Bank Accounts
export * from './bank-accounts'

// Contracts
export * from './contracts'

// Cookies
export * from './cookies'

// Disputes
export * from './disputes'

// Favorites
export * from './favorites'

// GDPR
export * from './gdpr'

// KYC
export * from './kyc'

// Legal
export * from './legal'

// Locale
export * from './locale'

// Notifications
export * from './notifications'

// Payments
export * from './payments'

// Push Notifications
export * from './push'

// User
export * from './user'

// Verification (explicit exports to avoid name collisions with ./kyc)
export { verificationService } from './verification'
export type { KYCVerification, VINCheckResult, Dispute, DisputeSubmission } from './verification'
