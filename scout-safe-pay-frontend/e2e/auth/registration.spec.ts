/**
 * E2E tests for user registration functionality
 * Tests various registration flows and validation scenarios
 */

import { test, expect } from '@playwright/test';
import { generateUniqueEmail } from '../helpers/fixtures';
import { registerUser, clearAuth, isAuthenticated } from '../helpers/auth.helpers';

test.describe('User Registration', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should successfully register as a buyer', async ({ page }) => {
    const email = generateUniqueEmail('buyer');
    const password = 'TestPass123!';

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.fill('input[name="name"]', 'Test Buyer User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="password_confirmation"]', password);
    
    // Select user type
    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'buyer');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Assert redirect to buyer dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
    
    // Assert welcome message or toast
    const welcomeMessage = page.locator('text=/welcome/i, [data-testid="toast"], .toast, .notification');
    await expect(welcomeMessage.first()).toBeVisible({ timeout: 5000 });

    // Verify authentication
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should successfully register as a seller', async ({ page }) => {
    const email = generateUniqueEmail('seller');
    const password = 'TestPass123!';

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill registration form
    await page.fill('input[name="name"]', 'Test Seller User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="password_confirmation"]', password);
    
    // Select user type
    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'seller');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Assert redirect to seller dashboard
    await expect(page).toHaveURL(/\/seller\/dashboard/, { timeout: 10000 });
    
    // Assert welcome message
    const welcomeMessage = page.locator('text=/welcome/i, [data-testid="toast"], .toast');
    await expect(welcomeMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('should successfully register as a dealer', async ({ page }) => {
    const email = generateUniqueEmail('dealer');
    const password = 'TestPass123!';

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill basic registration fields
    await page.fill('input[name="name"]', 'Test Dealer User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="password_confirmation"]', password);
    
    // Select dealer user type
    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'dealer');
    }

    // Wait for dealer-specific fields to appear
    await page.waitForTimeout(500);

    // Fill dealer-specific fields
    const companyNameInput = page.locator('input[name="company_name"]');
    if (await companyNameInput.count() > 0) {
      await companyNameInput.fill('Test Dealership Ltd');
    }
    
    const businessLicenseInput = page.locator('input[name="business_license"]');
    if (await businessLicenseInput.count() > 0) {
      await businessLicenseInput.fill('DL-2024-12345');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Assert redirect to dealer dashboard (could be seller dashboard for dealers)
    await expect(page).toHaveURL(/\/(dealer|seller)\/dashboard/, { timeout: 10000 });
    
    // Assert welcome message
    const welcomeMessage = page.locator('text=/welcome/i, [data-testid="toast"], .toast');
    await expect(welcomeMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Fill form with invalid email
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email-format');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="password_confirmation"]', 'TestPass123!');

    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'buyer');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert validation error for email
    const emailError = page.locator('text=/valid email/i, text=/invalid email/i, .error, .text-red-500, .text-danger');
    await expect(emailError.first()).toBeVisible({ timeout: 5000 });
    
    // Should not redirect
    await expect(page).toHaveURL(/\/register/);
  });

  test('should validate password mismatch', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const email = generateUniqueEmail('buyer');

    // Fill form with mismatched passwords
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="password_confirmation"]', 'DifferentPass123!');

    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'buyer');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert validation error for password mismatch
    const passwordError = page.locator('text=/passwords.*match/i, text=/password.*confirmation/i, .error');
    await expect(passwordError.first()).toBeVisible({ timeout: 5000 });
    
    // Should not redirect
    await expect(page).toHaveURL(/\/register/);
  });

  test('should validate password minimum length (8 characters)', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const email = generateUniqueEmail('buyer');

    // Fill form with short password
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'Short1!');
    await page.fill('input[name="password_confirmation"]', 'Short1!');

    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'buyer');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert validation error for password length
    const passwordError = page.locator('text=/8 character/i, text=/password.*short/i, text=/minimum.*8/i, .error');
    await expect(passwordError.first()).toBeVisible({ timeout: 5000 });
    
    // Should not redirect
    await expect(page).toHaveURL(/\/register/);
  });

  test('should validate duplicate email', async ({ page }) => {
    const email = generateUniqueEmail('duplicate');
    const password = 'TestPass123!';

    // Register first user
    await registerUser(page, 'buyer', email);
    
    // Clear session
    await clearAuth(page);

    // Try to register again with same email
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="name"]', 'Another User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="password_confirmation"]', password);

    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'buyer');
    }

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert error for duplicate email
    const duplicateError = page.locator('text=/already.*taken/i, text=/email.*exists/i, text=/already.*registered/i, .error');
    await expect(duplicateError.first()).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    // Submit empty form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert validation errors for required fields
    const errors = page.locator('.error, .text-red-500, .text-danger, [role="alert"]');
    const errorCount = await errors.count();
    
    // Should have multiple validation errors
    expect(errorCount).toBeGreaterThan(0);
    
    // Should not redirect
    await expect(page).toHaveURL(/\/register/);
  });

  test('should redirect buyer to buyer dashboard after registration', async ({ page }) => {
    const credentials = await registerUser(page, 'buyer');

    // Assert URL contains buyer dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
    
    // Assert buyer-specific content is visible
    const buyerContent = page.locator('text=/my purchases/i, text=/browse vehicles/i, [data-testid="buyer-dashboard"]');
    await expect(buyerContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('should redirect seller to seller dashboard after registration', async ({ page }) => {
    const credentials = await registerUser(page, 'seller');

    // Assert URL contains seller dashboard
    await expect(page).toHaveURL(/\/seller\/dashboard/, { timeout: 10000 });
    
    // Assert seller-specific content is visible
    const sellerContent = page.locator('text=/my vehicles/i, text=/add vehicle/i, [data-testid="seller-dashboard"]');
    await expect(sellerContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show welcome message after successful registration', async ({ page }) => {
    const email = generateUniqueEmail('welcome');
    const password = 'TestPass123!';

    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="name"]', 'Welcome Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="password_confirmation"]', password);

    const userTypeSelector = 'select[name="user_type"]';
    if (await page.locator(userTypeSelector).count() > 0) {
      await page.selectOption(userTypeSelector, 'buyer');
    }

    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Assert welcome message or toast notification
    const welcomeMessages = page.locator(
      'text=/welcome/i, text=/successfully registered/i, text=/registration successful/i, ' +
      '[data-testid="toast"], [data-testid="notification"], .toast, .notification, .alert-success'
    );
    await expect(welcomeMessages.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display user name in user menu after registration', async ({ page }) => {
    const credentials = await registerUser(page, 'buyer');

    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Assert user menu is visible and contains user info
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, text=/Test Buyer/i');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });
});
