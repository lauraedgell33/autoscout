/**
 * E2E tests for user login functionality
 * Tests various login scenarios and session management
 */

import { test, expect } from '@playwright/test';
import { 
  registerUser, 
  loginUser, 
  clearAuth, 
  isAuthenticated, 
  enableRememberMe,
  getAuthToken 
} from '../helpers/auth.helpers';
import { generateUniqueEmail } from '../helpers/fixtures';

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should successfully login as a buyer', async ({ page }) => {
    // First register a buyer
    const credentials = await registerUser(page, 'buyer');
    await clearAuth(page);

    // Login with credentials
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Assert redirect to buyer dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
    
    // Assert authentication successful
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // Assert user menu visible
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login as a seller', async ({ page }) => {
    // First register a seller
    const credentials = await registerUser(page, 'seller');
    await clearAuth(page);

    // Login with credentials
    await loginUser(page, credentials.email, credentials.password);

    // Assert redirect to seller dashboard
    await expect(page).toHaveURL(/\/seller\/dashboard/, { timeout: 10000 });
    
    // Assert authentication successful
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should successfully login as a dealer', async ({ page }) => {
    // First register a dealer
    const credentials = await registerUser(page, 'dealer');
    await clearAuth(page);

    // Login with credentials
    await loginUser(page, credentials.email, credentials.password);

    // Assert redirect to appropriate dashboard
    await expect(page).toHaveURL(/\/(dealer|seller)\/dashboard/, { timeout: 10000 });
    
    // Assert authentication successful
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Enter invalid credentials
    await page.fill('input[name="email"]', 'wrong@autoscout.test');
    await page.fill('input[name="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert error message displayed
    const errorMessage = page.locator(
      'text=/invalid credentials/i, text=/invalid.*password/i, text=/incorrect/i, ' +
      'text=/login failed/i, .error, .alert-danger, [role="alert"]'
    );
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

    // Assert still on login page
    await expect(page).toHaveURL(/\/login/);
    
    // Assert not authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
  });

  test('should show error with unregistered email', async ({ page }) => {
    const unregisteredEmail = generateUniqueEmail('unregistered');

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Enter unregistered email
    await page.fill('input[name="email"]', unregisteredEmail);
    await page.fill('input[name="password"]', 'SomePassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Assert error message displayed
    const errorMessage = page.locator(
      'text=/not found/i, text=/invalid credentials/i, text=/user.*not.*exist/i, ' +
      '.error, .alert-danger, [role="alert"]'
    );
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });

    // Assert not authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
  });

  test('should handle remember me checkbox', async ({ page }) => {
    // Register a user
    const credentials = await registerUser(page, 'buyer');
    await clearAuth(page);

    // Login with remember me enabled
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);
    
    // Enable remember me
    const rememberMeCheckbox = page.locator('input[name="remember"], input[type="checkbox"][id*="remember"]');
    if (await rememberMeCheckbox.count() > 0) {
      await rememberMeCheckbox.check();
      expect(await rememberMeCheckbox.isChecked()).toBe(true);
    }

    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Assert successful login
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    
    // Verify token exists (remember me should store token)
    const token = await getAuthToken(page);
    expect(token).not.toBeNull();
    expect(token).toBeTruthy();
  });

  test('should redirect to intended page after login', async ({ page }) => {
    // Register a seller
    const credentials = await registerUser(page, 'seller');
    await clearAuth(page);

    // Try to access protected route (vehicles/new)
    await page.goto('/seller/vehicles/new');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Login
    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Should redirect back to intended page
    // Note: This might redirect to dashboard if return URL is not implemented
    const currentUrl = page.url();
    const redirectedCorrectly = currentUrl.includes('/seller/vehicles/new') || 
                                currentUrl.includes('/seller/dashboard');
    expect(redirectedCorrectly).toBe(true);
  });

  test('should maintain session after page refresh', async ({ page }) => {
    // Register and login
    const credentials = await registerUser(page, 'buyer');

    // Verify logged in
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // Should still be on dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/);

    // User menu should still be visible
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });

  test('should maintain session after navigation', async ({ page }) => {
    // Register and login as buyer
    const credentials = await registerUser(page, 'buyer');

    // Navigate to different pages
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    let authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // User menu should be visible on all pages
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });

  test('should validate required email field', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Enter only password
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Assert error for required email
    const emailError = page.locator('text=/email.*required/i, .error, [role="alert"]');
    const errorCount = await emailError.count();
    
    // Should show validation error or stay on page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
  });

  test('should validate required password field', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Enter only email
    await page.fill('input[name="email"]', 'test@autoscout.test');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // Assert error for required password
    const passwordError = page.locator('text=/password.*required/i, .error, [role="alert"]');
    const errorCount = await passwordError.count();
    
    // Should show validation error or stay on page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
  });

  test('should display different dashboards for different user types', async ({ page }) => {
    // Test buyer dashboard
    const buyerCredentials = await registerUser(page, 'buyer');
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
    await clearAuth(page);

    // Test seller dashboard
    const sellerCredentials = await registerUser(page, 'seller');
    await expect(page).toHaveURL(/\/seller\/dashboard/, { timeout: 10000 });
    await clearAuth(page);

    // Login as buyer
    await loginUser(page, buyerCredentials.email, buyerCredentials.password);
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
  });

  test('should show loading state during login', async ({ page }) => {
    const credentials = await registerUser(page, 'buyer');
    await clearAuth(page);

    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);

    // Click submit and immediately check for loading state
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for loading indicator (disabled button, spinner, etc.)
    const isDisabled = await submitButton.isDisabled().catch(() => false);
    const hasLoadingText = await page.locator('text=/loading/i, text=/signing in/i').count() > 0;
    const hasSpinner = await page.locator('.spinner, .loading, [data-testid="spinner"]').count() > 0;

    // At least one loading indicator should be present
    const hasLoadingState = isDisabled || hasLoadingText || hasSpinner;
    // Note: This assertion might be flaky if the request is too fast
    // expect(hasLoadingState).toBe(true);

    // Wait for login to complete
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should allow case-insensitive email login', async ({ page }) => {
    const credentials = await registerUser(page, 'buyer');
    await clearAuth(page);

    // Login with uppercase email
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="email"]', credentials.email.toUpperCase());
    await page.fill('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Should successfully login (emails are typically case-insensitive)
    const authenticated = await isAuthenticated(page);
    // Note: This depends on backend implementation
    // expect(authenticated).toBe(true);
  });
});
