/**
 * Test Data Constants for E2E Tests
 * 
 * Contains all test user credentials, vehicle data, and constants
 * used throughout the E2E test suite.
 */

// ===========================================
// TEST USER CREDENTIALS
// ===========================================

export const TEST_USERS = {
  buyer: {
    email: 'buyer.test@autoscout.dev',
    password: 'BuyerPass123!',
    name: 'Test Buyer',
    type: 'buyer',
  },
  seller: {
    email: 'seller.test@autoscout.dev',
    password: 'SellerPass123!',
    name: 'Test Seller',
    type: 'seller',
  },
  dealer: {
    email: 'dealer.test@autoscout.dev',
    password: 'DealerPass123!',
    name: 'Test Dealer',
    type: 'dealer',
    company: 'Test Auto GmbH',
  },
  admin: {
    email: 'admin@autoscout.dev',
    password: 'Admin123!@#',
    name: 'Admin User',
    type: 'admin',
  },
} as const;

// ===========================================
// LOCALES
// ===========================================

export const LOCALES = ['en', 'de', 'ro'] as const;
export type Locale = typeof LOCALES[number];

export const LOCALE_NAMES = {
  en: 'English',
  de: 'Deutsch',
  ro: 'Română',
} as const;

// ===========================================
// BASE URLS
// ===========================================

export const URLS = {
  frontend: process.env.PLAYWRIGHT_BASE_URL || 'https://www.autoscout24safetrade.com',
  admin: process.env.ADMIN_BASE_URL || 'https://adminautoscout.dev',
  api: process.env.API_BASE_URL || 'https://adminautoscout.dev/api',
} as const;

// ===========================================
// PUBLIC PAGES
// ===========================================

export const PUBLIC_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/vehicles', name: 'Vehicles Listing' },
  { path: '/vehicles/search', name: 'Vehicle Search' },
  { path: '/marketplace', name: 'Marketplace' },
  { path: '/about', name: 'About' },
  { path: '/how-it-works', name: 'How It Works' },
  { path: '/benefits', name: 'Benefits' },
  { path: '/careers', name: 'Careers' },
  { path: '/contact', name: 'Contact' },
  { path: '/faq', name: 'FAQ' },
  { path: '/dealers', name: 'Dealers' },
  { path: '/ui-showcase', name: 'UI Showcase' },
] as const;

// ===========================================
// LEGAL PAGES
// ===========================================

export const LEGAL_PAGES = [
  { path: '/legal', name: 'Legal Hub' },
  { path: '/legal/privacy', name: 'Privacy Policy' },
  { path: '/legal/terms', name: 'Terms of Service' },
  { path: '/legal/cookies', name: 'Cookie Policy' },
  { path: '/legal/imprint', name: 'Imprint' },
  { path: '/legal/refund', name: 'Refund Policy' },
  { path: '/legal/purchase-agreement', name: 'Purchase Agreement' },
  { path: '/privacy', name: 'Privacy (Standalone)' },
  { path: '/terms', name: 'Terms (Standalone)' },
  { path: '/cookies', name: 'Cookies (Standalone)' },
  { path: '/imprint', name: 'Imprint (Standalone)' },
] as const;

// ===========================================
// AUTH PAGES
// ===========================================

export const AUTH_PAGES = [
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/auth/forgot-password', name: 'Forgot Password' },
  { path: '/auth/reset-password', name: 'Reset Password' },
  { path: '/verify-email', name: 'Verify Email' },
] as const;

// ===========================================
// DASHBOARD PAGES (Protected)
// ===========================================

export const DASHBOARD_PAGES = [
  { path: '/dashboard', name: 'Dashboard Home' },
  { path: '/dashboard/profile', name: 'Profile' },
  { path: '/dashboard/settings', name: 'Settings' },
  { path: '/dashboard/favorites', name: 'Favorites' },
  { path: '/dashboard/notifications', name: 'Notifications' },
  { path: '/dashboard/purchases', name: 'Purchases' },
  { path: '/dashboard/vehicles', name: 'My Vehicles' },
  { path: '/dashboard/vehicles/add', name: 'Add Vehicle' },
  { path: '/dashboard/disputes', name: 'Disputes' },
  { path: '/dashboard/verification', name: 'Verification' },
] as const;

// ===========================================
// BUYER PAGES (Protected)
// ===========================================

export const BUYER_PAGES = [
  { path: '/buyer/dashboard', name: 'Buyer Dashboard' },
  { path: '/buyer/favorites', name: 'Buyer Favorites' },
  { path: '/buyer/purchases', name: 'Buyer Purchases' },
  { path: '/buyer/transactions', name: 'Buyer Transactions' },
  { path: '/buyer/notifications', name: 'Buyer Notifications' },
  { path: '/buyer/profile', name: 'Buyer Profile' },
  { path: '/buyer/settings', name: 'Buyer Settings' },
  { path: '/buyer/payment-methods', name: 'Payment Methods' },
] as const;

// ===========================================
// SELLER PAGES (Protected)
// ===========================================

export const SELLER_PAGES = [
  { path: '/seller/dashboard', name: 'Seller Dashboard' },
  { path: '/seller/vehicles', name: 'Seller Vehicles' },
  { path: '/seller/vehicles/add', name: 'Add Vehicle (Seller)' },
  { path: '/seller/vehicles/new', name: 'New Vehicle (Seller)' },
  { path: '/seller/analytics', name: 'Seller Analytics' },
  { path: '/seller/profile', name: 'Seller Profile' },
  { path: '/seller/settings', name: 'Seller Settings' },
  { path: '/seller/bank-accounts', name: 'Bank Accounts' },
  { path: '/seller/sales', name: 'Sales' },
] as const;

// ===========================================
// DEALER PAGES (Protected)
// ===========================================

export const DEALER_PAGES = [
  { path: '/dealer/dashboard', name: 'Dealer Dashboard' },
  { path: '/dealer/inventory', name: 'Dealer Inventory' },
  { path: '/dealer/analytics', name: 'Dealer Analytics' },
  { path: '/dealer/team', name: 'Team Management' },
  { path: '/dealer/profile', name: 'Dealer Profile' },
  { path: '/dealer/settings', name: 'Dealer Settings' },
  { path: '/dealer/bulk-upload', name: 'Bulk Upload' },
] as const;

// ===========================================
// TRANSACTION PAGES (Protected)
// ===========================================

export const TRANSACTION_PAGES = [
  { path: '/transactions', name: 'Transactions List' },
  { path: '/messages', name: 'Messages' },
  { path: '/notifications', name: 'Notifications (Global)' },
  { path: '/disputes', name: 'Disputes' },
] as const;

// ===========================================
// ADMIN PAGES (Protected)
// ===========================================

export const ADMIN_PAGES = [
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/payments', name: 'Admin Payments' },
] as const;

// ===========================================
// SUPPORT PAGES
// ===========================================

export const SUPPORT_PAGES = [
  { path: '/support/help', name: 'Help Center' },
  { path: '/support/tickets', name: 'Support Tickets' },
] as const;

// ===========================================
// PAYMENT PAGES
// ===========================================

export const PAYMENT_PAGES = [
  { path: '/payment/success', name: 'Payment Success' },
  { path: '/payment/failed', name: 'Payment Failed' },
  { path: '/payment/initiate', name: 'Initiate Payment' },
] as const;

// ===========================================
// TEST VEHICLE DATA
// ===========================================

export const TEST_VEHICLE = {
  make: 'BMW',
  model: 'X5 xDrive40i',
  year: '2023',
  price: '65000',
  mileage: '15000',
  fuelType: 'petrol',
  transmission: 'automatic',
  bodyType: 'suv',
  color: 'Alpine White',
  description: 'Excellent condition BMW X5 with full service history. Features include panoramic roof, heated seats, navigation, and premium sound system.',
  location: 'Munich, Germany',
  vin: 'WBAPH5C52BA123456',
} as const;

// ===========================================
// VIEWPORTS
// ===========================================

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  mobileL: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 800 },
  desktopL: { width: 1440, height: 900 },
  desktopXL: { width: 1920, height: 1080 },
} as const;

// ===========================================
// TIMEOUTS
// ===========================================

export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  veryLong: 60000,
  pageLoad: 15000,
  apiResponse: 10000,
} as const;

// ===========================================
// SELECTORS (data-testid based)
// ===========================================

export const SELECTORS = {
  // Navigation
  header: '[data-testid="header"], header',
  footer: '[data-testid="footer"], footer',
  nav: '[data-testid="nav"], nav, [role="navigation"]',
  logo: '[data-testid="logo"], .logo, [class*="logo"]',
  mobileMenu: '[data-testid="mobile-menu"], .hamburger, [aria-label*="menu" i]',
  langSwitcher: '[data-testid="lang-switcher"], [class*="lang"], [class*="locale"]',
  userMenu: '[data-testid="user-menu"], .user-menu, [class*="user-menu"]',
  
  // Forms
  emailInput: 'input[type="email"], input[name="email"]',
  passwordInput: 'input[type="password"], input[name="password"]',
  submitButton: 'button[type="submit"]',
  
  // Vehicle
  vehicleCard: '[data-testid="vehicle-card"], .vehicle-card, [class*="vehicle-card"]',
  vehicleGrid: '[data-testid="vehicle-grid"], .vehicle-grid, [class*="vehicle-list"]',
  vehicleImage: '[data-testid="vehicle-image"], .vehicle-image',
  vehiclePrice: '[data-testid="vehicle-price"], .price, [class*="price"]',
  
  // Filters
  makeFilter: 'select[name*="make" i], [data-testid="make-filter"]',
  modelFilter: 'select[name*="model" i], [data-testid="model-filter"]',
  priceMin: 'input[name*="min_price" i], [data-testid="price-min"]',
  priceMax: 'input[name*="max_price" i], [data-testid="price-max"]',
  searchInput: 'input[type="search"], input[placeholder*="search" i]',
  
  // Buttons
  favoriteButton: '[data-testid="favorite-button"], .favorite-btn, button[aria-label*="favorite" i]',
  buyButton: 'button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Kaufen")',
  contactButton: 'button:has-text("Contact"), a:has-text("Contact")',
  
  // Common
  loading: '[data-testid="loading"], .loading, [class*="spinner"]',
  error: '[data-testid="error"], .error, [role="alert"]',
  success: '[data-testid="success"], .success',
  modal: '[data-testid="modal"], [role="dialog"]',
  toast: '[data-testid="toast"], .toast',
  
  // Pagination
  pagination: '[data-testid="pagination"], .pagination, [class*="pagination"]',
  nextPage: 'button:has-text("Next"), a:has-text("Next")',
  prevPage: 'button:has-text("Previous"), a:has-text("Previous")',
} as const;

// ===========================================
// API ENDPOINTS
// ===========================================

export const API_ENDPOINTS = {
  login: '/api/login',
  register: '/api/register',
  logout: '/api/logout',
  user: '/api/user',
  vehicles: '/api/vehicles',
  transactions: '/api/transactions',
  favorites: '/api/favorites',
  notifications: '/api/notifications',
  messages: '/api/messages',
  dealers: '/api/dealers',
} as const;
