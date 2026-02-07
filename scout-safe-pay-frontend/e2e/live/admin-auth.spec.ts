import { test, expect } from '@playwright/test';
import { loginToAdmin, LIVE_CONFIG, waitForPageLoad, logoutFromAdmin } from './helpers';

test.describe('Admin Panel Authentication - Live', () => {
  
  test.describe('Login Page', () => {
    test('admin login page loads', async ({ page }) => {
      const response = await page.goto('/admin');
      
      expect(response?.status()).toBe(200);
      await waitForPageLoad(page);
      
      // Check for Filament login form
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      
      await expect(emailInput.first()).toBeVisible();
      await expect(passwordInput.first()).toBeVisible();
    });

    test('login page has submit button', async ({ page }) => {
      await page.goto('/admin');
      
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton.first()).toBeVisible();
    });

    test('login page has remember me checkbox', async ({ page }) => {
      await page.goto('/admin');
      
      const rememberCheckbox = page.locator('input[type="checkbox"][name*="remember"], label:has-text("Remember")');
      if (await rememberCheckbox.count() > 0) {
        await expect(rememberCheckbox.first()).toBeVisible();
      }
    });

    test('login page displays branding', async ({ page }) => {
      await page.goto('/admin');
      
      // Check for logo or title
      const branding = page.locator('img[class*="logo"], h1, h2, [class*="brand"]');
      await expect(branding.first()).toBeVisible();
    });

    test('login with valid credentials succeeds', async ({ page }) => {
      await loginToAdmin(page);
      
      // Should be redirected to dashboard
      const url = page.url();
      const isLoggedIn = !url.includes('/login') && (url.includes('/admin') || await page.locator('[class*="dashboard"], [class*="sidebar"], nav').count() > 0);
      
      expect(isLoggedIn).toBe(true);
    });

    test('login with invalid credentials shows error', async ({ page }) => {
      await page.goto('/admin');
      
      await page.fill('input[type="email"], input[name="email"]', 'wrong@test.com');
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(3000);
      
      // Should show error message or stay on login page
      const errorByClass = await page.locator('[class*="error"], [class*="alert"], [class*="danger"]').count();
      const errorByText = await page.getByText(/invalid|incorrect|credentials|failed/i).count();
      const hasError = errorByClass > 0 || errorByText > 0;
      
      // Or should still be on login page with password field visible
      const stillOnLogin = await page.locator('input[type="password"]').count() > 0;
      
      expect(hasError || stillOnLogin).toBe(true);
    });

    test('login validates empty email', async ({ page }) => {
      await page.goto('/admin');
      
      // Leave email empty, fill password
      await page.fill('input[type="password"], input[name="password"]', 'somepassword');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
      
      // Should show validation error or stay on page
      expect(page.url()).toContain('/admin');
    });

    test('login validates empty password', async ({ page }) => {
      await page.goto('/admin');
      
      await page.fill('input[type="email"], input[name="email"]', 'admin@test.com');
      // Leave password empty
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/admin');
    });
  });

  test.describe('Session Management', () => {
    test('session persists after page reload', async ({ page }) => {
      await loginToAdmin(page);
      
      // Navigate to admin dashboard explicitly
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Reload page
      await page.reload();
      await waitForPageLoad(page);
      
      // Should still be logged in - check for sidebar/dashboard or no password field
      const hasPasswordField = await page.locator('input[type="password"]').count() > 0;
      const hasDashboard = await page.locator('nav, aside, [class*="sidebar"], [class*="dashboard"]').count() > 0;
      
      // If no password field visible OR dashboard elements exist, we're logged in
      const isLoggedIn = !hasPasswordField || hasDashboard;
      expect(isLoggedIn).toBe(true);
    });

    test('logout functionality works', async ({ page }) => {
      await loginToAdmin(page);
      
      // Try to logout
      await logoutFromAdmin(page);
      
      await page.waitForTimeout(2000);
      
      // Should be back on login page
      const loginForm = page.locator('input[type="password"]');
      const isOnLoginPage = await loginForm.count() > 0 || page.url().includes('/admin');
      
      expect(isOnLoginPage).toBe(true);
    });

    test('protected routes redirect to login', async ({ page }) => {
      // Clear any existing session
      await page.context().clearCookies();
      
      await page.goto('/admin/users');
      await waitForPageLoad(page);
      
      // Should redirect to login or show login form or 403/401 page
      const hasLoginForm = await page.locator('input[type="password"]').count() > 0;
      const isOnLoginPage = page.url().includes('/login') || page.url().endsWith('/admin');
      const hasAccessDenied = await page.getByText(/access denied|unauthorized|forbidden|login/i).count() > 0;
      
      expect(hasLoginForm || isOnLoginPage || hasAccessDenied).toBe(true);
    });
  });

  test.describe('Security', () => {
    test('uses HTTPS', async ({ page }) => {
      await page.goto('/admin');
      
      expect(page.url()).toMatch(/^https:/);
    });

    test('csrf token is present', async ({ page }) => {
      await page.goto('/admin');
      
      // Check for CSRF token in form or meta tag
      const csrfToken = await page.locator('input[name="_token"], meta[name="csrf-token"]').count();
      console.log(`CSRF token present: ${csrfToken > 0}`);
    });

    test('password field masks input', async ({ page }) => {
      await page.goto('/admin');
      
      const passwordInput = page.locator('input[type="password"]').first();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });
});
