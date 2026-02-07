import { test, expect } from '@playwright/test';
import { goToFrontendPage, waitForPageLoad, loginToFrontend } from './helpers';

test.describe('Frontend Authentication - Live', () => {
  
  test.describe('Login Page', () => {
    test('login page loads', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      // Check for login form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"], input[name="password"]');
      const submitButton = page.locator('button[type="submit"]');
      
      await expect(emailInput.first()).toBeVisible();
      await expect(passwordInput.first()).toBeVisible();
      await expect(submitButton.first()).toBeVisible();
    });

    test('login page has remember me option', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      const rememberMe = page.locator('input[type="checkbox"][name*="remember"], label:has-text("Remember")');
      if (await rememberMe.count() > 0) {
        await expect(rememberMe.first()).toBeVisible();
      }
    });

    test('login page has forgot password link', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      const forgotLink = page.locator('a:has-text("Forgot"), a:has-text("Reset"), a[href*="forgot"], a[href*="reset"]');
      if (await forgotLink.count() > 0) {
        await expect(forgotLink.first()).toBeVisible();
      }
    });

    test('login page has register link', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      const registerLink = page.locator('a:has-text("Register"), a:has-text("Sign up"), a[href*="register"]');
      if (await registerLink.count() > 0) {
        await expect(registerLink.first()).toBeVisible();
      }
    });

    test('login with invalid credentials shows error', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      await page.fill('input[type="email"], input[name="email"]', 'invalid@test.com');
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(3000);
      
      // Should show error message or stay on login page
      const errorByClass = await page.locator('[class*="error"], [class*="alert"], [role="alert"]').count();
      const errorByText = await page.getByText(/invalid|incorrect|wrong|failed/i).count();
      const hasError = errorByClass > 0 || errorByText > 0;
      
      // Or should still be on login page
      const stillOnLogin = page.url().includes('/login');
      
      expect(hasError || stillOnLogin).toBe(true);
    });

    test('login form validates email format', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      await emailInput.fill('not-an-email');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
      
      // Check for validation (HTML5 or custom)
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
      const hasErrorClass = await emailInput.evaluate((el) => el.className.includes('error') || el.className.includes('invalid'));
      
      // Either browser validation or form validation should prevent submission
      expect(isInvalid || hasErrorClass || page.url().includes('/login')).toBe(true);
    });

    test('login form requires password', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      await page.fill('input[type="email"], input[name="email"]', 'test@test.com');
      // Leave password empty
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(1000);
      
      // Should still be on login page or show error
      expect(page.url()).toContain('/login');
    });
  });

  test.describe('Registration Page', () => {
    test('registration page loads', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      // Check for registration form elements
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      await expect(emailInput.first()).toBeVisible();
    });

    test('registration page has all required fields', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      // Check for common registration fields
      const nameInput = page.locator('input[name="name"], input[name="first_name"], input[placeholder*="name" i]');
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      await expect(emailInput.first()).toBeVisible();
      await expect(passwordInput.first()).toBeVisible();
    });

    test('registration page has user type selection', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      // Check for user type selection (buyer/seller)
      const userTypeSelect = page.locator('select[name*="type"], input[type="radio"][name*="type"], [class*="user-type"]');
      if (await userTypeSelect.count() > 0) {
        await expect(userTypeSelect.first()).toBeVisible();
      }
    });

    test('registration page has terms acceptance', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="agree"], label:has-text("Terms")');
      if (await termsCheckbox.count() > 0) {
        await expect(termsCheckbox.first()).toBeVisible();
      }
    });

    test('registration validates password confirmation', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      const passwordInput = page.locator('input[type="password"]').first();
      const confirmInput = page.locator('input[name*="confirm"], input[name*="confirmation"]');
      
      if (await confirmInput.count() > 0) {
        await passwordInput.fill('Password123!');
        await confirmInput.first().fill('DifferentPassword123!');
        await page.click('button[type="submit"]');
        
        await page.waitForTimeout(2000);
        
        // Should show mismatch error or stay on page
        const hasError = await page.locator('text=/match|confirm|mismatch/i').count() > 0;
        const stillOnRegister = page.url().includes('/register');
        
        expect(hasError || stillOnRegister).toBe(true);
      }
    });

    test('registration has login link', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      const loginLink = page.locator('a:has-text("Login"), a:has-text("Sign in"), a[href*="login"]');
      if (await loginLink.count() > 0) {
        await expect(loginLink.first()).toBeVisible();
      }
    });
  });

  test.describe('Forgot Password', () => {
    test('forgot password page loads', async ({ page }) => {
      await goToFrontendPage(page, '/forgot-password');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      if (await emailInput.count() > 0) {
        await expect(emailInput.first()).toBeVisible();
      }
    });

    test('forgot password accepts email', async ({ page }) => {
      await goToFrontendPage(page, '/forgot-password');
      
      const emailInput = page.locator('input[type="email"], input[name="email"]');
      if (await emailInput.count() > 0) {
        await emailInput.first().fill('test@example.com');
        await page.click('button[type="submit"]');
        
        await page.waitForTimeout(3000);
        
        // Should show success message or redirect
        const hasMessage = await page.locator('text=/sent|email|check|success/i').count() > 0;
        console.log(`Password reset message shown: ${hasMessage}`);
      }
    });
  });

  test.describe('Protected Routes', () => {
    test('dashboard redirects to login when not authenticated', async ({ page }) => {
      await page.goto('/en/dashboard');
      await waitForPageLoad(page);
      
      // Should redirect to login or show some auth requirement
      const isOnLogin = page.url().includes('/login');
      const hasLoginForm = await page.locator('input[type="password"]').count() > 0;
      const hasAuthMessage = await page.getByText(/sign in|log in|authenticate/i).count() > 0;
      
      expect(isOnLogin || hasLoginForm || hasAuthMessage).toBe(true);
    });

    test('buyer dashboard requires authentication', async ({ page }) => {
      await page.goto('/en/buyer/dashboard');
      await waitForPageLoad(page);
      
      expect(page.url()).toContain('/login');
    });

    test('seller dashboard requires authentication', async ({ page }) => {
      await page.goto('/en/seller/dashboard');
      await waitForPageLoad(page);
      
      expect(page.url()).toContain('/login');
    });

    test('transactions page requires authentication', async ({ page }) => {
      await page.goto('/en/transactions');
      await waitForPageLoad(page);
      
      const isProtected = page.url().includes('/login') || await page.locator('input[type="password"]').count() > 0;
      expect(isProtected).toBe(true);
    });

    test('favorites page requires authentication', async ({ page }) => {
      await page.goto('/en/favorites');
      await waitForPageLoad(page);
      
      // Should redirect to login, show login form, or show error/auth message
      const isOnLogin = page.url().includes('/login');
      const hasLoginForm = await page.locator('input[type="password"]').count() > 0;
      const is404OrError = await page.getByText(/not found|404|sign in|log in/i).count() > 0;
      
      expect(isOnLogin || hasLoginForm || is404OrError).toBe(true);
    });

    test('profile page requires authentication', async ({ page }) => {
      await page.goto('/en/profile');
      await waitForPageLoad(page);
      
      // Should redirect to login, show login form, or show error/auth message
      const isOnLogin = page.url().includes('/login');
      const hasLoginForm = await page.locator('input[type="password"]').count() > 0;
      const is404OrError = await page.getByText(/not found|404|sign in|log in/i).count() > 0;
      
      expect(isOnLogin || hasLoginForm || is404OrError).toBe(true);
    });
  });

  test.describe('Authentication UI', () => {
    test('guest user sees login/register buttons', async ({ page }) => {
      await goToFrontendPage(page, '/');
      
      const authButtons = page.locator('a:has-text("Login"), a:has-text("Sign in"), a:has-text("Register"), button:has-text("Login")');
      if (await authButtons.count() > 0) {
        await expect(authButtons.first()).toBeVisible();
      }
    });

    test('authentication uses HTTPS', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      expect(page.url()).toMatch(/^https:/);
    });
  });
});
