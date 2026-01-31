import { Page } from '@playwright/test';

/**
 * Helper to login a user
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Helper to create a test vehicle
 */
export async function createTestVehicle(page: Page) {
  await page.goto('/seller/vehicles/new');
  
  await page.fill('input[name="make"]', 'BMW');
  await page.fill('input[name="model"]', 'X5');
  await page.fill('input[name="year"]', '2022');
  await page.fill('input[name="price"]', '50000');
  await page.fill('input[name="mileage"]', '15000');
  await page.selectOption('select[name="fuel_type"]', 'diesel');
  await page.selectOption('select[name="transmission"]', 'automatic');
  await page.fill('textarea[name="description"]', 'Excellent condition vehicle');
  
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Helper to wait for API response
 */
export async function waitForApiResponse(page: Page, endpoint: string) {
  await page.waitForResponse(
    response => response.url().includes(endpoint) && response.status() === 200
  );
}

/**
 * Helper to clear all favorites
 */
export async function clearFavorites(page: Page) {
  await page.goto('/buyer/favorites');
  
  const favoriteButtons = page.locator('[data-testid="favorite-button"]');
  const count = await favoriteButtons.count();
  
  for (let i = 0; i < count; i++) {
    await favoriteButtons.first().click();
    await page.waitForTimeout(300);
  }
}

/**
 * Helper to add vehicle to favorites
 */
export async function addToFavorites(page: Page, vehicleId: number) {
  await page.goto(`/vehicle/${vehicleId}`);
  await page.click('[data-testid="favorite-button"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Helper to create a transaction
 */
export async function createTransaction(page: Page, vehicleId: number) {
  await page.goto(`/vehicle/${vehicleId}`);
  await page.click('button:has-text("Buy Now")');
  
  await page.fill('input[name="full_name"]', 'Test Buyer');
  await page.fill('input[name="phone"]', '+40123456789');
  await page.fill('input[name="address"]', '123 Test Street');
  await page.selectOption('select[name="payment_method"]', 'bank_transfer');
  
  await page.click('button[type="submit"]:has-text("Confirm Purchase")');
  await page.waitForLoadState('networkidle');
}

/**
 * Helper to upload file
 */
export async function uploadFile(page: Page, selector: string, filePath: string) {
  await page.setInputFiles(selector, filePath);
  await page.waitForTimeout(500);
}

/**
 * Helper to logout
 */
export async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]');
  await page.click('text=Logout');
  await page.waitForLoadState('networkidle');
}
