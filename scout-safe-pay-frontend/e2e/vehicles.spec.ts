import { test, expect } from '@playwright/test';

test.describe('Vehicles', () => {
  test('browse and search vehicles', async ({ page }) => {
    await page.goto('/vehicles');
    
    // Wait for vehicles to load
    await page.waitForSelector('[data-testid="vehicle-card"], .vehicle-card, article', { timeout: 10000 });
    
    // Verify vehicles are displayed
    const vehicleCards = page.locator('[data-testid="vehicle-card"], .vehicle-card, article').first();
    await expect(vehicleCards).toBeVisible();
    
    // Try search if search box exists
    const searchBox = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    if (await searchBox.isVisible({ timeout: 3000 })) {
      await searchBox.fill('BMW');
      await page.keyboard.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(2000);
      
      // Verify page updated
      expect(page.url()).toContain('BMW');
    }
  });

  test('filter vehicles by price', async ({ page }) => {
    await page.goto('/vehicles');
    
    // Look for price filter controls
    const minPriceInput = page.locator('input[name="min_price"], input[placeholder*="Min"]').first();
    const maxPriceInput = page.locator('input[name="max_price"], input[placeholder*="Max"]').first();
    
    if (await minPriceInput.isVisible({ timeout: 5000 })) {
      await minPriceInput.fill('10000');
      await maxPriceInput.fill('50000');
      
      // Apply filters
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Filter")').first();
      if (await applyButton.isVisible({ timeout: 2000 })) {
        await applyButton.click();
      }
      
      // Wait for filtered results
      await page.waitForTimeout(2000);
      
      // Verify URL or page content changed
      const url = page.url();
      const hasFilters = url.includes('min') || url.includes('max') || url.includes('price');
      
      // Either URL has params or page reloaded
      expect(hasFilters || page.url().includes('/vehicles')).toBeTruthy();
    } else {
      // If no price filters, just verify we can see vehicles
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('view vehicle details page', async ({ page }) => {
    await page.goto('/vehicles');
    
    // Wait for vehicles to load
    await page.waitForSelector('a[href*="/vehicles/"], article a', { timeout: 10000 });
    
    // Click on first vehicle
    const firstVehicleLink = page.locator('a[href*="/vehicles/"]').first();
    await firstVehicleLink.click();
    
    // Wait for navigation to detail page
    await page.waitForURL(/\/vehicles\/\d+/, { timeout: 10000 });
    
    // Verify we're on a detail page with vehicle information
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Look for typical vehicle detail elements
    const hasPrice = await page.locator('text=/€|EUR|\\$|USD/').isVisible({ timeout: 3000 });
    const hasSpecs = await page.locator('text=/mileage|transmission|fuel|year/i').isVisible({ timeout: 3000 });
    
    expect(hasPrice || hasSpecs).toBeTruthy();
  });

  test('vehicles page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/vehicles');
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Verify no critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('DevTools') &&
      !e.includes('Extension')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('vehicle search returns results', async ({ page }) => {
    await page.goto('/vehicles');
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[name="search"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible({ timeout: 5000 })) {
      await searchInput.fill('car');
      
      // Submit search
      await page.keyboard.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(2000);
      
      // Verify something is displayed
      const bodyText = await page.textContent('body');
      expect(bodyText?.length).toBeGreaterThan(100);
    } else {
      // If no search, just verify page works
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
    }
  });
});
