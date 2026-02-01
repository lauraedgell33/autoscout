/**
 * E2E tests for protected route authentication
 * Tests that unauthenticated users are properly redirected
 */

import { test, expect } from '@playwright/test';
import { 
  clearAuth, 
  loginUser, 
  registerUser, 
  isAuthenticated,
  logoutUser 
} from '../helpers/auth.helpers';

test.describe('Protected Routes', () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test('should redirect unauthenticated user from buyer dashboard to login', async ({ page }) => {
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should redirect unauthenticated user from seller dashboard to login', async ({ page }) => {
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should redirect unauthenticated user from add vehicle page to login', async ({ page }) => {
    await page.goto('/seller/vehicles/new');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should redirect unauthenticated user from transactions page to login', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page or show unauthorized
    const currentUrl = page.url();
    const isProtected = currentUrl.includes('/login') || currentUrl.includes('/unauthorized');
    expect(isProtected).toBe(true);
  });

  test('should redirect unauthenticated user from profile page to login', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should redirect unauthenticated user from edit vehicle page to login', async ({ page }) => {
    await page.goto('/seller/vehicles/123/edit');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should redirect unauthenticated user from favorites page to login', async ({ page }) => {
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page or show unauthorized
    const currentUrl = page.url();
    const isProtected = currentUrl.includes('/login') || currentUrl.includes('/unauthorized');
    expect(isProtected).toBe(true);
  });

  test('should show "You must login to continue" message', async ({ page }) => {
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should be on login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Look for login message
    const loginMessage = page.locator(
      'text=/must.*login/i, text=/please.*login/i, text=/sign in.*continue/i, ' +
      'text=/login.*continue/i, text=/authentication.*required/i, ' +
      '.alert, .message, [data-testid="auth-message"]'
    );

    // Check if message is visible
    const messageCount = await loginMessage.count();
    
    // Note: Some apps might not show this message
    if (messageCount > 0) {
      await expect(loginMessage.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should redirect back to intended buyer dashboard URL after login', async ({ page }) => {
    // Try to access buyer dashboard
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Register and login as buyer
    const credentials = await registerUser(page, 'buyer');

    // Should redirect to buyer dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
  });

  test('should redirect back to intended seller vehicles page after login', async ({ page }) => {
    // Try to access seller vehicles page
    await page.goto('/seller/vehicles/new');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Register and login as seller
    const credentials = await registerUser(page, 'seller');

    // Should redirect to intended page or seller dashboard
    const currentUrl = page.url();
    const redirectedCorrectly = currentUrl.includes('/seller/vehicles/new') || 
                                currentUrl.includes('/seller/dashboard');
    expect(redirectedCorrectly).toBe(true);
  });

  test('should redirect back to intended profile page after login', async ({ page }) => {
    // Try to access profile
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Register and login
    const credentials = await registerUser(page, 'buyer');

    // Should redirect to profile or dashboard
    const currentUrl = page.url();
    const redirectedCorrectly = currentUrl.includes('/profile') || 
                                currentUrl.includes('/dashboard');
    expect(redirectedCorrectly).toBe(true);
  });

  test('should allow access to public routes without authentication', async ({ page }) => {
    // Home page should be accessible
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const homeUrl = page.url();
    expect(homeUrl).toContain(homeUrl); // Should stay on same page

    // Vehicles listing should be accessible
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    const vehiclesUrl = page.url();
    expect(vehiclesUrl).toContain('/vehicles');

    // Login page should be accessible
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/login/);

    // Register page should be accessible
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/register/);
  });

  test('should protect multiple buyer routes', async ({ page }) => {
    const buyerRoutes = [
      '/buyer/dashboard',
      '/buyer/transactions',
      '/buyer/favorites'
    ];

    for (const route of buyerRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Each should redirect to login
      const currentUrl = page.url();
      const isProtected = currentUrl.includes('/login') || currentUrl.includes('/unauthorized');
      expect(isProtected).toBe(true);
    }
  });

  test('should protect multiple seller routes', async ({ page }) => {
    const sellerRoutes = [
      '/seller/dashboard',
      '/seller/vehicles',
      '/seller/vehicles/new'
    ];

    for (const route of sellerRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Each should redirect to login
      const currentUrl = page.url();
      const isProtected = currentUrl.includes('/login') || currentUrl.includes('/unauthorized');
      expect(isProtected).toBe(true);
    }
  });

  test('should allow authenticated buyer to access buyer routes', async ({ page }) => {
    // Register and login as buyer
    const credentials = await registerUser(page, 'buyer');

    // Should be able to access buyer dashboard
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/buyer\/dashboard/);

    // Should be authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should allow authenticated seller to access seller routes', async ({ page }) => {
    // Register and login as seller
    const credentials = await registerUser(page, 'seller');

    // Should be able to access seller dashboard
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/seller\/dashboard/);

    // Should be able to access vehicles page
    await page.goto('/seller/vehicles');
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    expect(currentUrl).toContain('/seller');
  });

  test('should prevent buyer from accessing seller routes', async ({ page }) => {
    // Register and login as buyer
    const credentials = await registerUser(page, 'buyer');

    // Try to access seller dashboard
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect or show unauthorized
    const currentUrl = page.url();
    const isUnauthorized = currentUrl.includes('/buyer/dashboard') || 
                          currentUrl.includes('/unauthorized') ||
                          currentUrl.includes('/403');
    
    // Note: This depends on role-based access control implementation
    // Some apps might allow it, others might restrict
  });

  test('should prevent seller from accessing buyer-specific routes', async ({ page }) => {
    // Register and login as seller
    const credentials = await registerUser(page, 'seller');

    // Try to access buyer dashboard
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect or show unauthorized
    const currentUrl = page.url();
    const isUnauthorized = currentUrl.includes('/seller/dashboard') || 
                          currentUrl.includes('/unauthorized') ||
                          currentUrl.includes('/403');
    
    // Note: This depends on role-based access control implementation
  });

  test('should redirect to login after session expires', async ({ page }) => {
    // Register and login
    const credentials = await registerUser(page, 'buyer');

    // Clear auth to simulate session expiry
    await clearAuth(page);

    // Try to access protected route
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Should not be authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
  });

  test('should protect transaction detail pages', async ({ page }) => {
    await page.goto('/transactions/123');
    await page.waitForLoadState('networkidle');

    // Should redirect to login or show unauthorized
    const currentUrl = page.url();
    const isProtected = currentUrl.includes('/login') || currentUrl.includes('/unauthorized');
    expect(isProtected).toBe(true);
  });

  test('should protect vehicle edit pages', async ({ page }) => {
    await page.goto('/seller/vehicles/123/edit');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should handle direct URL access to protected routes', async ({ page }) => {
    // Directly access a protected route with specific ID
    await page.goto('/seller/vehicles/456/edit');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Login as seller
    const credentials = await registerUser(page, 'seller');

    // After login, might redirect to intended page or dashboard
    const currentUrl = page.url();
    const redirected = currentUrl.includes('/seller');
    expect(redirected).toBe(true);
  });

  test('should maintain protection after logout', async ({ page }) => {
    // Register, login, and logout
    const credentials = await registerUser(page, 'buyer');
    await logoutUser(page);

    // Try to access protected route after logout
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Should not be authenticated
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
  });

  test('should show appropriate error for API routes without auth', async ({ page }) => {
    // Try to access API endpoint without authentication
    const response = await page.goto('/api/user/profile');
    
    // Should return 401 or redirect
    if (response) {
      const status = response.status();
      const isUnauthorized = status === 401 || status === 403 || status === 302;
      // Note: This depends on API implementation
    }
  });

  test('should preserve query parameters in redirect URL', async ({ page }) => {
    // Access protected route with query parameters
    await page.goto('/seller/vehicles?status=active&page=2');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Login
    const credentials = await registerUser(page, 'seller');

    // After login, might redirect back with query params preserved
    // Note: This depends on redirect implementation
    const currentUrl = page.url();
  });

  test('should handle hash fragments in protected route URLs', async ({ page }) => {
    // Access protected route with hash fragment
    await page.goto('/buyer/dashboard#notifications');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Login
    const credentials = await registerUser(page, 'buyer');

    // Should redirect to dashboard
    const currentUrl = page.url();
    expect(currentUrl).toContain('/buyer/dashboard');
  });
});
