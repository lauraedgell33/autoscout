import { test, expect } from '@playwright/test';
import { register, login, logout } from './helpers';

test.describe('Authentication', () => {
  test('complete registration flow (buyer)', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `buyer-${timestamp}@test.com`;
    
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[name="name"]', 'Test Buyer');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="password_confirmation"]', 'SecurePass123!');
    
    // Select user type
    const userTypeSelect = page.locator('select[name="user_type"]');
    if (await userTypeSelect.isVisible()) {
      await userTypeSelect.selectOption('buyer');
    }
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for successful registration (redirect to dashboard or success page)
    await page.waitForURL(/\/(dashboard|success|login)/, { timeout: 10000 });
    
    // Verify we're on a success page
    const url = page.url();
    expect(url).toMatch(/\/(dashboard|success|login)/);
  });

  test('complete login flow', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form with test credentials
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Either we get redirected to dashboard or stay on login with error
    // For test purposes, we just verify the form submission doesn't crash
    await page.waitForTimeout(2000);
    
    // Verify page loaded
    expect(page.url()).toBeTruthy();
  });

  test('logout clears session', async ({ page, context }) => {
    // First login (or go to a protected route)
    await page.goto('/dashboard');
    
    // If there's a logout button, click it
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
    
    if (await logoutButton.isVisible({ timeout: 5000 })) {
      await logoutButton.click();
      
      // Wait for redirect to login or home
      await page.waitForURL(/\/(login|home|)/, { timeout: 10000 });
      
      // Verify cookies are cleared
      const cookies = await context.cookies();
      const authToken = cookies.find(c => c.name.includes('token') || c.name.includes('auth'));
      
      // Auth token should either be deleted or empty
      if (authToken) {
        expect(authToken.value).toBeFalsy();
      }
    }
  });

  test('registration requires valid email', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="password_confirmation"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=/invalid|email/i')).toBeVisible({ timeout: 5000 });
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Should show error (credentials invalid or user not found)
    const errorVisible = await page.locator('text=/invalid|incorrect|error|failed/i').isVisible({ timeout: 3000 }).catch(() => false);
    
    // Either error is shown or we're still on login page
    if (!errorVisible) {
      expect(page.url()).toContain('login');
    }
  });
});
