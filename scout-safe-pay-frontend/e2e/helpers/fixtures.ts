/**
 * Test data fixtures for E2E tests
 * Provides consistent test data across all test suites
 */

export const TEST_USERS = {
  buyer: {
    email: 'test.buyer@autoscout.test',
    password: 'TestPass123!',
    name: 'Test Buyer',
    user_type: 'buyer'
  },
  seller: {
    email: 'test.seller@autoscout.test',
    password: 'TestPass123!',
    name: 'Test Seller',
    user_type: 'seller'
  },
  dealer: {
    email: 'test.dealer@autoscout.test',
    password: 'TestPass123!',
    name: 'Test Dealer',
    user_type: 'dealer',
    company_name: 'Test Dealership Ltd',
    business_license: 'DL-2024-12345'
  },
  admin: {
    email: 'admin@autoscout24.com',
    password: 'password'
  }
};

export const TEST_VEHICLE = {
  category: 'car',
  make: 'BMW',
  model: 'X5',
  year: 2022,
  price: 50000,
  currency: 'EUR',
  vin: 'WBAXXXXXXXXXXXXXX',
  mileage: 15000,
  fuel_type: 'diesel',
  transmission: 'automatic',
  color: 'black',
  doors: 5,
  seats: 5,
  body_type: 'suv',
  engine_size: 3000,
  power_hp: 286,
  city: 'Berlin',
  country: 'Germany',
  description: 'Excellent condition BMW X5 with full service history',
  status: 'active'
};

export const TEST_VEHICLE_VARIANTS = {
  bmw_3series: {
    ...TEST_VEHICLE,
    model: '3 Series',
    year: 2021,
    price: 35000,
    body_type: 'sedan'
  },
  mercedes_cclass: {
    ...TEST_VEHICLE,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2020,
    price: 40000,
    fuel_type: 'petrol'
  },
  audi_a4: {
    ...TEST_VEHICLE,
    make: 'Audi',
    model: 'A4',
    year: 2023,
    price: 45000,
    transmission: 'manual'
  },
  electric_vehicle: {
    ...TEST_VEHICLE,
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 55000,
    fuel_type: 'electric',
    mileage: 5000
  },
  motorcycle: {
    ...TEST_VEHICLE,
    category: 'motorcycle',
    make: 'Harley-Davidson',
    model: 'Street 750',
    year: 2021,
    price: 8000,
    doors: 0,
    seats: 2,
    body_type: null
  }
};

export const VEHICLE_MAKES = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford',
  'Toyota', 'Honda', 'Nissan', 'Mazda', 'Hyundai'
];

export const FUEL_TYPES = [
  'petrol', 'diesel', 'electric', 'hybrid', 'lpg', 'cng'
];

export const TRANSMISSION_TYPES = [
  'manual', 'automatic', 'semi-automatic'
];

export const BODY_TYPES = [
  'sedan', 'suv', 'hatchback', 'coupe', 'convertible',
  'wagon', 'van', 'truck', 'minivan', 'pickup'
];

export const CATEGORIES = [
  'car', 'motorcycle', 'van', 'truck', 'trailer',
  'caravan', 'motorhome', 'construction_machinery',
  'agricultural_machinery', 'forklift', 'boat', 'atv', 'quad'
];

export const LANGUAGES = ['en', 'de', 'es', 'it', 'ro', 'fr'];

export const TEST_TRANSACTION = {
  full_name: 'Test Buyer Name',
  phone: '+40123456789',
  address: '123 Test Street, Berlin, Germany',
  payment_method: 'bank_transfer'
};

export const PAYMENT_METHODS = [
  'bank_transfer',
  'credit_card',
  'paypal'
];

export const TRANSACTION_STATUSES = [
  'pending',
  'payment_pending',
  'payment_verification',
  'payment_verified',
  'inspection_period',
  'completed',
  'disputed',
  'cancelled'
];

export const DISPUTE_REASONS = [
  'vehicle_not_as_described',
  'mechanical_issues',
  'documentation_issues',
  'delivery_issues',
  'other'
];

/**
 * Generate unique email for testing to avoid conflicts
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
  return `${prefix}.${Date.now()}${Math.random().toString(36).substring(7)}@autoscout.test`;
}

/**
 * Generate random VIN number for testing
 */
export function generateVIN(): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return vin;
}

/**
 * Generate random price within range
 */
export function generatePrice(min: number = 5000, max: number = 100000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get test image path
 */
export function getTestImagePath(filename: string = 'test-vehicle.jpg'): string {
  return `./e2e/test-data/images/${filename}`;
}

/**
 * Wait utility
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
