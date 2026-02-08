/**
 * Authentication Fixtures for E2E Tests
 * 
 * Provides authenticated test contexts for different user roles.
 * Uses Playwright's built-in storage state for session persistence.
 */

import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { TEST_USERS, SELECTORS, TIMEOUTS } from './test-data';

// ===========================================
// TYPES
// ===========================================

type UserRole = 'buyer' | 'seller' | 'dealer' | 'admin';

interface AuthOptions {
  storageState?: string;
  authenticated?: boolean;
  userRole?: UserRole;
}

// ===========================================
// AUTHENTICATION HELPERS
// ===========================================

/**
 * Login to frontend application
 */
export async function loginToFrontend(
  page: Page,
  email: string,
  password: string,
  locale: string = 'en'
): Promise<boolean> {
  try {
    await page.goto(`/${locale}/login`, { waitUntil: 'networkidle' });
    
    // Wait for login form
    await page.waitForSelector(SELECTORS.emailInput, { timeout: TIMEOUTS.medium });
    
    // Fill credentials
    await page.fill(SELECTORS.emailInput, email);
    await page.fill(SELECTORS.passwordInput, password);
    
    // Submit form
    await page.click(SELECTORS.submitButton);
    
    // Wait for navigation/redirect
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if login was successful (not on login page anymore)
    const currentUrl = page.url();
    return !currentUrl.includes('/login');
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

/**
 * Login to admin panel (Filament)
 */
export async function loginToAdmin(page: Page): Promise<boolean> {
  try {
    await page.goto('/admin', { waitUntil: 'networkidle' });
    
    // Wait for login form
    await page.waitForSelector(SELECTORS.emailInput, { timeout: TIMEOUTS.medium });
    
    // Fill admin credentials
    await page.fill(SELECTORS.emailInput, TEST_USERS.admin.email);
    await page.fill(SELECTORS.passwordInput, TEST_USERS.admin.password);
    
    // Submit form
    await page.click(SELECTORS.submitButton);
    
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if login was successful
    const currentUrl = page.url();
    return !currentUrl.includes('/login') && !currentUrl.endsWith('/admin');
  } catch (error) {
    console.error('Admin login failed:', error);
    return false;
  }
}

/**
 * Logout from frontend application
 */
export async function logout(page: Page): Promise<void> {
  try {
    const userMenu = page.locator(SELECTORS.userMenu);
    if (await userMenu.isVisible({ timeout: 3000 })) {
      await userMenu.click();
      await page.click('text=Logout, text=Log out, text=Sign out');
      await page.waitForLoadState('networkidle');
    }
  } catch {
    // User menu not visible, might already be logged out
  }
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    const userMenu = page.locator(SELECTORS.userMenu);
    return await userMenu.isVisible({ timeout: 3000 });
  } catch {
    return false;
  }
}

// ===========================================
// CUSTOM TEST FIXTURES
// ===========================================

/**
 * Extended test fixture with authentication support
 */
export const test = base.extend<{
  authenticatedPage: Page;
  buyerPage: Page;
  sellerPage: Page;
  dealerPage: Page;
  adminPage: Page;
}>({
  // Generic authenticated page
  authenticatedPage: async ({ page }, use) => {
    await loginToFrontend(page, TEST_USERS.buyer.email, TEST_USERS.buyer.password);
    await use(page);
    await logout(page);
  },

  // Buyer authenticated page
  buyerPage: async ({ page }, use) => {
    const success = await loginToFrontend(page, TEST_USERS.buyer.email, TEST_USERS.buyer.password);
    if (!success) {
      console.warn('Buyer login failed, proceeding with unauthenticated page');
    }
    await use(page);
    if (success) {
      await logout(page);
    }
  },

  // Seller authenticated page
  sellerPage: async ({ page }, use) => {
    const success = await loginToFrontend(page, TEST_USERS.seller.email, TEST_USERS.seller.password);
    if (!success) {
      console.warn('Seller login failed, proceeding with unauthenticated page');
    }
    await use(page);
    if (success) {
      await logout(page);
    }
  },

  // Dealer authenticated page
  dealerPage: async ({ page }, use) => {
    const success = await loginToFrontend(page, TEST_USERS.dealer.email, TEST_USERS.dealer.password);
    if (!success) {
      console.warn('Dealer login failed, proceeding with unauthenticated page');
    }
    await use(page);
    if (success) {
      await logout(page);
    }
  },

  // Admin authenticated page
  adminPage: async ({ page }, use) => {
    const success = await loginToAdmin(page);
    if (!success) {
      console.warn('Admin login failed, proceeding with unauthenticated page');
    }
    await use(page);
  },
});

// ===========================================
// STORAGE STATE SETUP
// ===========================================

/**
 * Setup function to create storage states for different users
 * Run this before test suite to generate auth states
 */
export async function setupStorageStates(browser: any) {
  const users = [
    { role: 'buyer', ...TEST_USERS.buyer },
    { role: 'seller', ...TEST_USERS.seller },
    { role: 'dealer', ...TEST_USERS.dealer },
  ];

  for (const user of users) {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await loginToFrontend(page, user.email, user.password);
      await context.storageState({ path: `.auth/${user.role}.json` });
      console.log(`Storage state saved for ${user.role}`);
    } catch (error) {
      console.error(`Failed to setup storage state for ${user.role}:`, error);
    } finally {
      await context.close();
    }
  }
}

// Re-export expect for convenience
export { expect };
