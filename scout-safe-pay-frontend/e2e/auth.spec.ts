import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Authentication', () => {
  test('complete registration flow', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form as buyer
    await page.fill('input[name="name"]', 'Test Buyer');
    await page.fill('input[name="email"]', `buyer${Date.now()}@test.com`);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="password_confirmation"]', 'TestPass123!');
    await page.selectOption('select[name="user_type"]', 'buyer');

    // Submit form
    await page.click('button[type="submit"]');

    // Assert redirect to dashboard
    await expect(page).toHaveURL(/\/buyer\/dashboard/);
    
    // Assert welcome message or user menu
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('complete login flow', async ({ page }) => {
    await page.goto('/login');

    // Enter credentials
    await page.fill('input[name="email"]', 'buyer@test.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit login
    await page.click('button[type="submit"]');

    // Assert dashboard loads
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Assert user menu shows name
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toContainText('buyer@test.com');
  });

  test('logout clears session', async ({ page }) => {
    // Login first
    await login(page, 'buyer@test.com', 'password123');

    // Click logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Assert redirect to homepage
    await expect(page).toHaveURL('/');
    
    // Assert user menu is gone
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/buyer/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    
    // Should show message about authentication
    await expect(page.locator('text=/login to continue/i')).toBeVisible();
  });

  test('registration validates email format', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');

    // Assert validation error
    await expect(page.locator('text=/valid email/i')).toBeVisible();
  });

  test('login shows error with wrong credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Assert error message
    await expect(page.locator('text=/invalid credentials/i')).toBeVisible();
  });

  test('registration requires password confirmation match', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="password_confirmation"]', 'DifferentPass123!');
    await page.click('button[type="submit"]');

    // Assert validation error
    await expect(page.locator('text=/passwords must match/i')).toBeVisible();
  });

  test('session persists after page reload', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');

    // Reload page
    await page.reload();

    // Assert still authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
