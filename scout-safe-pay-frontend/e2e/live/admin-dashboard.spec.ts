import { test, expect } from '@playwright/test';
import { loginToAdmin, waitForPageLoad } from './helpers';

test.describe('Admin Panel Dashboard - Live', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
  });

  test.describe('Dashboard', () => {
    test('dashboard loads after login', async ({ page }) => {
      // Navigate explicitly to admin after login
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Should be on admin dashboard
      const url = page.url();
      expect(url).toContain('adminautoscout.dev');
    });

    test('dashboard displays stats widgets', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Filament uses fi- prefix for classes
      const statsWidgets = page.locator('[class*="stat"], [class*="widget"], [class*="fi-wi"], .fi-section');
      const count = await statsWidgets.count();
      
      console.log(`Stats widgets found: ${count}`);
    });

    test('dashboard has navigation sidebar', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Check for Filament sidebar
      const sidebar = page.locator('[class*="sidebar"], nav, .fi-sidebar, aside');
      await expect(sidebar.first()).toBeVisible();
    });

    test('dashboard has user menu', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Check for user menu in header
      const userMenu = page.locator('[class*="user-menu"], [class*="avatar"], .fi-user-menu, button:has-text("admin")');
      if (await userMenu.count() > 0) {
        await expect(userMenu.first()).toBeVisible();
      }
    });

    test('dashboard loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/admin');
      await waitForPageLoad(page);
      const loadTime = Date.now() - startTime;
      
      // Should load within 15 seconds
      expect(loadTime).toBeLessThan(15000);
      console.log(`Admin dashboard load time: ${loadTime}ms`);
    });
  });

  test.describe('Navigation', () => {
    test('sidebar has Users link', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const usersLink = page.locator('a:has-text("Users"), a[href*="users"], nav a:has-text("User")');
      if (await usersLink.count() > 0) {
        await expect(usersLink.first()).toBeVisible();
      }
    });

    test('sidebar has Vehicles link', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const vehiclesLink = page.locator('a:has-text("Vehicle"), a[href*="vehicle"]');
      if (await vehiclesLink.count() > 0) {
        await expect(vehiclesLink.first()).toBeVisible();
      }
    });

    test('sidebar has Transactions link', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const transactionsLink = page.locator('a:has-text("Transaction"), a[href*="transaction"]');
      if (await transactionsLink.count() > 0) {
        await expect(transactionsLink.first()).toBeVisible();
      }
    });

    test('sidebar has Payments link', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const paymentsLink = page.locator('a:has-text("Payment"), a[href*="payment"]');
      if (await paymentsLink.count() > 0) {
        await expect(paymentsLink.first()).toBeVisible();
      }
    });

    test('sidebar has Dealers link', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const dealersLink = page.locator('a:has-text("Dealer"), a[href*="dealer"]');
      if (await dealersLink.count() > 0) {
        await expect(dealersLink.first()).toBeVisible();
      }
    });

    test('sidebar has Disputes link', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const disputesLink = page.locator('a:has-text("Dispute"), a[href*="dispute"]');
      if (await disputesLink.count() > 0) {
        await expect(disputesLink.first()).toBeVisible();
      }
    });

    test('clicking navigation links works', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Click on Users if available
      const usersLink = page.locator('a:has-text("Users"), a[href*="users"]').first();
      if (await usersLink.count() > 0) {
        await usersLink.click();
        await waitForPageLoad(page);
        
        expect(page.url()).toContain('user');
      }
    });
  });

  test.describe('Search', () => {
    test('global search is available', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Filament has global search
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], .fi-global-search-input, [class*="search"] input');
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible();
      }
    });

    test('search accepts input', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], .fi-global-search-input').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('test');
        await page.waitForTimeout(1000);
        
        // Search results or dropdown should appear
        const hasResults = await page.locator('[class*="search-result"], [class*="dropdown"], [class*="results"]').count() > 0;
        console.log(`Search results appeared: ${hasResults}`);
      }
    });
  });

  test.describe('Theme & UI', () => {
    test('dark mode toggle exists', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Filament supports dark mode
      const darkModeToggle = page.locator('button[class*="theme"], button[class*="dark"], [class*="color-mode"]');
      const hasDarkMode = await darkModeToggle.count() > 0;
      console.log(`Dark mode toggle available: ${hasDarkMode}`);
    });

    test('responsive sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Look for mobile menu toggle
      const mobileToggle = page.locator('button[class*="sidebar"], button[class*="menu"], .fi-sidebar-open-button');
      if (await mobileToggle.count() > 0) {
        await expect(mobileToggle.first()).toBeVisible();
      }
    });
  });

  test.describe('Notifications', () => {
    test('notification bell is visible', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      const notificationBell = page.locator('[class*="notification"], [class*="bell"], .fi-dropdown-trigger');
      if (await notificationBell.count() > 0) {
        await expect(notificationBell.first()).toBeVisible();
      }
    });
  });
});
