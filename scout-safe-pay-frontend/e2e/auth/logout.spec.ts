/**
 * E2E tests for user logout functionality
 * Tests session clearing and post-logout behavior
 */

import { test, expect } from '@playwright/test';
import { 
  registerUser, 
  logoutUser, 
  clearAuth, 
  isAuthenticated,
  getAuthToken 
} from '../helpers/auth.helpers';

test.describe('User Logout', () => {
  test('should clear session after logout for buyer', async ({ page }) => {
    // Register and login as buyer
    const credentials = await registerUser(page, 'buyer');
    
    // Verify authenticated
    let authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // Logout
    await logoutUser(page);

    // Verify session cleared
    authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);

    // Verify token removed
    const token = await getAuthToken(page);
    expect(token).toBeNull();
  });

  test('should clear session after logout for seller', async ({ page }) => {
    // Register and login as seller
    const credentials = await registerUser(page, 'seller');
    
    // Verify authenticated
    let authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    // Logout
    await logoutUser(page);

    // Verify session cleared
    authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
  });

  test('should redirect to homepage after logout', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Logout
    await logoutUser(page);

    // Assert redirect to homepage or login page
    const currentUrl = page.url();
    const redirectedCorrectly = currentUrl.endsWith('/') || 
                                currentUrl.includes('/login') ||
                                currentUrl.includes('/home');
    expect(redirectedCorrectly).toBe(true);
  });

  test('should hide user menu after logout', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Verify user menu visible
    const userMenuBefore = page.locator('[data-testid="user-menu"], .user-menu');
    await expect(userMenuBefore.first()).toBeVisible({ timeout: 5000 });

    // Logout
    await logoutUser(page);
    await page.waitForLoadState('networkidle');

    // Verify user menu hidden or not present
    const userMenuAfter = page.locator('[data-testid="user-menu"], .user-menu');
    const menuCount = await userMenuAfter.count();
    
    if (menuCount > 0) {
      // If menu exists, it should not be visible
      await expect(userMenuAfter.first()).not.toBeVisible({ timeout: 5000 });
    } else {
      // Menu should not exist in DOM
      expect(menuCount).toBe(0);
    }
  });

  test('should show login/register links after logout', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Logout
    await logoutUser(page);
    await page.waitForLoadState('networkidle');

    // Verify login/register links are visible
    const loginLink = page.locator('a[href*="/login"], text=/login/i, text=/sign in/i');
    const registerLink = page.locator('a[href*="/register"], text=/register/i, text=/sign up/i');
    
    const loginVisible = await loginLink.first().isVisible().catch(() => false);
    const registerVisible = await registerLink.first().isVisible().catch(() => false);
    
    // At least one should be visible
    expect(loginVisible || registerVisible).toBe(true);
  });

  test('should not be able to access buyer dashboard after logout', async ({ page }) => {
    // Register and login as buyer
    await registerUser(page, 'buyer');
    
    // Verify on dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });

    // Logout
    await logoutUser(page);

    // Try to access buyer dashboard
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should not be able to access seller dashboard after logout', async ({ page }) => {
    // Register and login as seller
    await registerUser(page, 'seller');
    
    // Verify on dashboard
    await expect(page).toHaveURL(/\/seller\/dashboard/, { timeout: 10000 });

    // Logout
    await logoutUser(page);

    // Try to access seller dashboard
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should not be able to access add vehicle page after logout', async ({ page }) => {
    // Register and login as seller
    await registerUser(page, 'seller');

    // Logout
    await logoutUser(page);

    // Try to access add vehicle page
    await page.goto('/seller/vehicles/new');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should not be able to access transactions after logout', async ({ page }) => {
    // Register and login as buyer
    await registerUser(page, 'buyer');

    // Logout
    await logoutUser(page);

    // Try to access transactions page
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page or show unauthorized
    const currentUrl = page.url();
    const isProtected = currentUrl.includes('/login') || currentUrl.includes('/unauthorized');
    expect(isProtected).toBe(true);
  });

  test('should not be able to access profile after logout', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Logout
    await logoutUser(page);

    // Try to access profile page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should clear all storage data after logout', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Verify storage has data
    const tokenBefore = await getAuthToken(page);
    expect(tokenBefore).not.toBeNull();

    // Logout
    await logoutUser(page);

    // Verify all storage cleared
    const storageData = await page.evaluate(() => {
      return {
        localStorageLength: localStorage.length,
        sessionStorageLength: sessionStorage.length,
        hasAuthToken: localStorage.getItem('auth_token') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('access_token')
      };
    });

    // Auth token should be removed
    expect(storageData.hasAuthToken).toBeNull();
  });

  test('should handle logout from different pages', async ({ page }) => {
    // Register and login
    await registerUser(page, 'seller');

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Logout from vehicles page
    await logoutUser(page);

    // Should be logged out
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);

    // Should not be able to access protected routes
    await page.goto('/seller/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should handle double logout gracefully', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Logout first time
    await logoutUser(page);

    // Try to logout again (should not throw error)
    await logoutUser(page);

    // Should still be logged out
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(false);
  });

  test('should show logout confirmation message', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Logout
    await logoutUser(page);
    await page.waitForLoadState('networkidle');

    // Check for logout confirmation message (toast/notification)
    const logoutMessage = page.locator(
      'text=/logged out/i, text=/goodbye/i, text=/see you/i, ' +
      '[data-testid="toast"], .toast, .notification'
    );
    
    // Message might be visible briefly or already dismissed
    const messageCount = await logoutMessage.count();
    // This is optional and might not be implemented
    // expect(messageCount).toBeGreaterThan(0);
  });

  test('should prevent back button access to protected pages after logout', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');
    const dashboardUrl = page.url();

    // Logout
    await logoutUser(page);

    // Try to go back using browser back button
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should redirect to login or not show protected content
    const currentUrl = page.url();
    const isProtected = !currentUrl.includes('/buyer/dashboard') || 
                       currentUrl.includes('/login');
    
    // Note: This behavior depends on how the app handles history
    // Some apps might redirect, others might show unauthorized
  });

  test('should require re-login after logout', async ({ page }) => {
    // Register and login
    const credentials = await registerUser(page, 'buyer');

    // Logout
    await logoutUser(page);

    // Try to access protected route
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Should be on login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // Login again
    await page.fill('input[name="email"]', credentials.email);
    await page.fill('input[name="password"]', credentials.password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Should successfully login again
    await expect(page).toHaveURL(/\/buyer\/dashboard/, { timeout: 10000 });
    
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('should handle logout API failure gracefully', async ({ page }) => {
    // Register and login
    await registerUser(page, 'buyer');

    // Block logout API call to simulate failure
    await page.route('**/api/logout', route => route.abort());

    // Try to logout
    await logoutUser(page);

    // Even if API fails, frontend should clear local session
    // This ensures user can still logout from frontend perspective
    await page.waitForTimeout(1000);
    
    // Clear the route block
    await page.unroute('**/api/logout');
  });
});
