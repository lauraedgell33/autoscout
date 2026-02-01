/**
 * Authentication helper functions for E2E tests
 */

import { Page, expect } from '@playwright/test';
import { generateUniqueEmail } from './fixtures';

export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'buyer' | 'seller' | 'dealer';
  company_name?: string;
  business_license?: string;
  phone?: string;
  address?: string;
}

/**
 * Register a new user
 */
export async function registerUser(
  page: Page,
  type: 'buyer' | 'seller' | 'dealer',
  email?: string
): Promise<{ email: string; password: string }> {
  const uniqueEmail = email || generateUniqueEmail(type);
  const password = 'TestPass123!';

  await page.goto('/register');
  await page.waitForLoadState('networkidle');

  // Fill basic fields
  await page.fill('input[name="name"]', `Test ${type.charAt(0).toUpperCase() + type.slice(1)}`);
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="password_confirmation"]', password);
  
  // Select user type
  const userTypeSelector = 'select[name="user_type"]';
  if (await page.locator(userTypeSelector).count() > 0) {
    await page.selectOption(userTypeSelector, type);
  }

  // Fill dealer-specific fields
  if (type === 'dealer') {
    const companyNameInput = page.locator('input[name="company_name"]');
    if (await companyNameInput.count() > 0) {
      await companyNameInput.fill('Test Dealership Ltd');
    }
    
    const businessLicenseInput = page.locator('input[name="business_license"]');
    if (await businessLicenseInput.count() > 0) {
      await businessLicenseInput.fill('DL-2024-12345');
    }
  }

  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for navigation or success
  await page.waitForLoadState('networkidle');

  return { email: uniqueEmail, password };
}

/**
 * Login user with credentials
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Logout current user
 */
export async function logoutUser(page: Page): Promise<void> {
  // Try to find and click user menu
  const userMenu = page.locator('[data-testid="user-menu"]');
  if (await userMenu.count() > 0) {
    await userMenu.click();
    await page.waitForTimeout(300);
    
    // Click logout button
    const logoutButton = page.locator('text=/logout/i').first();
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
    }
  } else {
    // Try alternative logout methods
    const logoutLink = page.locator('a[href*="logout"]');
    if (await logoutLink.count() > 0) {
      await logoutLink.click();
    }
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Get authentication token from page (localStorage or cookies)
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    // Try localStorage
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') ||
                  localStorage.getItem('access_token');
    
    if (token) return token;
    
    // Try cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth_token' || name === 'token') {
        return value;
      }
    }
    
    return null;
  });
}

/**
 * Set authentication token directly (for bypassing login UI)
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((tkn) => {
    localStorage.setItem('auth_token', tkn);
  }, token);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await getAuthToken(page);
  return token !== null && token.length > 0;
}

/**
 * Wait for authentication redirect
 */
export async function waitForAuthRedirect(page: Page, userType: 'buyer' | 'seller' | 'dealer'): Promise<void> {
  const expectedPath = `/${userType}/dashboard`;
  await page.waitForURL(new RegExp(expectedPath), { timeout: 10000 });
}

/**
 * Request password reset
 */
export async function requestPasswordReset(page: Page, email: string): Promise<void> {
  await page.goto('/forgot-password');
  await page.waitForLoadState('networkidle');
  
  await page.fill('input[name="email"]', email);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Reset password with token
 */
export async function resetPassword(
  page: Page,
  token: string,
  email: string,
  newPassword: string
): Promise<void> {
  await page.goto(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
  await page.waitForLoadState('networkidle');
  
  await page.fill('input[name="password"]', newPassword);
  await page.fill('input[name="password_confirmation"]', newPassword);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Verify email with token
 */
export async function verifyEmail(page: Page, token: string, userId: string): Promise<void> {
  await page.goto(`/verify-email?token=${token}&user=${userId}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(page: Page): Promise<void> {
  const resendButton = page.locator('button:has-text("Resend"), a:has-text("Resend")');
  if (await resendButton.count() > 0) {
    await resendButton.first().click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Check for remember me option and enable it
 */
export async function enableRememberMe(page: Page): Promise<void> {
  const rememberMeCheckbox = page.locator('input[name="remember"], input[type="checkbox"][id*="remember"]');
  if (await rememberMeCheckbox.count() > 0) {
    await rememberMeCheckbox.check();
  }
}

/**
 * Clear all authentication data
 */
export async function clearAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  });
}

/**
 * Setup authenticated session for testing (faster than going through UI)
 */
export async function setupAuthSession(
  page: Page,
  userType: 'buyer' | 'seller' | 'dealer'
): Promise<{ email: string; password: string }> {
  const credentials = await registerUser(page, userType);
  await loginUser(page, credentials.email, credentials.password);
  return credentials;
}
