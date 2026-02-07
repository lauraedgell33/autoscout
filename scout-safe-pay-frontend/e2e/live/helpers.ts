import { Page, expect } from '@playwright/test';

/**
 * Live test configuration
 */
export const LIVE_CONFIG = {
  frontend: {
    baseUrl: 'https://www.autoscout24safetrade.com',
    locale: 'en',
  },
  admin: {
    baseUrl: 'https://adminautoscout.dev',
    loginUrl: '/admin',
    credentials: {
      email: 'admin@autoscout.dev',
      password: 'Admin123!@#',
    },
  },
};

/**
 * Login to the admin panel (Filament)
 */
export async function loginToAdmin(page: Page) {
  await page.goto('/admin');
  
  // Wait for login form to be visible
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
  
  // Fill credentials
  await page.fill('input[type="email"], input[name="email"]', LIVE_CONFIG.admin.credentials.email);
  await page.fill('input[type="password"], input[name="password"]', LIVE_CONFIG.admin.credentials.password);
  
  // Click sign in button
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Extra wait for Filament to fully load
}

/**
 * Login to the frontend application
 */
export async function loginToFrontend(page: Page, email: string, password: string) {
  await page.goto('/en/login');
  
  await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 10000 });
  
  await page.fill('input[name="email"], input[type="email"]', email);
  await page.fill('input[name="password"], input[type="password"]', password);
  
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Check if page is accessible (returns 200)
 */
export async function checkPageAccessible(page: Page, url: string): Promise<boolean> {
  const response = await page.goto(url);
  return response?.status() === 200;
}

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png`, fullPage: true });
}

/**
 * Check for console errors on page
 */
export async function checkNoConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}

/**
 * Verify element is visible with retry
 */
export async function verifyElementVisible(page: Page, selector: string, timeout = 10000) {
  await expect(page.locator(selector).first()).toBeVisible({ timeout });
}

/**
 * Dismiss cookie consent banner if present
 */
export async function dismissCookieBanner(page: Page) {
  try {
    const acceptBtn = page.locator(
      'button:has-text("Accept"), button:has-text("Agree"), button:has-text("OK"), ' +
      'button:has-text("Accept All"), button:has-text("Accept all cookies"), ' +
      '[class*="cookie"] button, [id*="cookie"] button'
    ).first();
    
    if (await acceptBtn.count() > 0 && await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptBtn.click({ timeout: 3000 });
      await page.waitForTimeout(500);
    }
  } catch {
    // Cookie banner not present or already dismissed
  }
}

/**
 * Navigate to frontend page with locale
 */
export async function goToFrontendPage(page: Page, path: string) {
  const fullPath = path.startsWith('/en') ? path : `/en${path}`;
  await page.goto(fullPath);
  await waitForPageLoad(page);
  // Automatically dismiss cookie banner if present
  await dismissCookieBanner(page);
}

/**
 * Check if admin is logged in
 */
export async function isAdminLoggedIn(page: Page): Promise<boolean> {
  const url = page.url();
  // If still on login page, not logged in
  if (url.includes('/admin/login') || url.endsWith('/admin')) {
    const loginForm = await page.locator('input[type="password"]').count();
    return loginForm === 0;
  }
  return true;
}

/**
 * Logout from admin panel
 */
export async function logoutFromAdmin(page: Page) {
  // Click on user menu (usually top right)
  const userMenu = page.locator('[data-dropdown-toggle], button:has-text("admin"), .fi-user-menu');
  if (await userMenu.count() > 0) {
    await userMenu.first().click();
    await page.waitForTimeout(500);
    
    // Click logout
    const logoutButton = page.locator('a:has-text("Log out"), button:has-text("Log out"), a:has-text("Sign out")');
    if (await logoutButton.count() > 0) {
      await logoutButton.first().click();
      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Get all links on page
 */
export async function getAllLinks(page: Page): Promise<string[]> {
  const links = await page.locator('a[href]').all();
  const hrefs: string[] = [];
  
  for (const link of links) {
    const href = await link.getAttribute('href');
    if (href) {
      hrefs.push(href);
    }
  }
  
  return hrefs;
}

/**
 * Check page SEO basics
 */
export async function checkSEOBasics(page: Page) {
  const title = await page.title();
  const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
  const h1 = await page.locator('h1').first().textContent();
  
  return {
    hasTitle: !!title && title.length > 0,
    hasMetaDescription: !!metaDescription && metaDescription.length > 0,
    hasH1: !!h1 && h1.length > 0,
    title,
    metaDescription,
    h1,
  };
}
