import { Page } from '@playwright/test';

/**
 * Helper function to login a user
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

/**
 * Helper function to create a test vehicle (requires authentication)
 */
export async function createTestVehicle(page: Page) {
  await page.goto('/vehicles/create');
  
  await page.fill('input[name="make"]', 'BMW');
  await page.fill('input[name="model"]', 'X5');
  await page.fill('input[name="year"]', '2020');
  await page.fill('input[name="price"]', '45000');
  await page.fill('input[name="mileage"]', '50000');
  await page.selectOption('select[name="fuelType"]', 'Diesel');
  await page.selectOption('select[name="transmission"]', 'Automatic');
  await page.fill('textarea[name="description"]', 'Test vehicle description');
  
  await page.click('button[type="submit"]');
  await page.waitForURL('/vehicles/*', { timeout: 10000 });
}

/**
 * Helper function to wait for API response
 */
export async function waitForApiResponse(page: Page, endpoint: string) {
  return await page.waitForResponse(
    response => response.url().includes(endpoint) && response.status() === 200,
    { timeout: 10000 }
  );
}

/**
 * Helper function to register a new user
 */
export async function register(
  page: Page, 
  name: string, 
  email: string, 
  password: string,
  userType: 'buyer' | 'seller' = 'buyer'
) {
  await page.goto('/register');
  
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="password_confirmation"]', password);
  await page.selectOption('select[name="user_type"]', userType);
  
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard', { timeout: 10000 });
}

/**
 * Helper function to logout
 */
export async function logout(page: Page) {
  await page.click('button[aria-label="User menu"]');
  await page.click('text=Logout');
  await page.waitForURL('/login', { timeout: 10000 });
}

/**
 * Helper function to add vehicle to favorites
 */
export async function addToFavorites(page: Page, vehicleId: string) {
  await page.goto(`/vehicles/${vehicleId}`);
  await page.click('button[aria-label="Add to favorites"]');
  await page.waitForResponse(response => 
    response.url().includes('/api/favorites') && response.status() === 200
  );
}

/**
 * Helper function to clear all cookies
 */
export async function clearCookies(page: Page) {
  const context = page.context();
  await context.clearCookies();
}

/**
 * Helper function to take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
}
