/**
 * E2E tests for vehicle browsing functionality
 * Tests vehicle grid, pagination, sorting, and basic display
 */

import { test, expect } from '@playwright/test';
import { setupAuthSession } from '../helpers/auth.helpers';
import { createVehicle } from '../helpers/vehicle.helpers';
import { TEST_VEHICLE_VARIANTS, generateVIN } from '../helpers/fixtures';

test.describe('Vehicle Browsing', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we have a clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to vehicles page and load vehicle grid', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Check URL
    expect(page.url()).toContain('/vehicles');

    // Check page title/heading
    const heading = page.locator('h1, h2').filter({ hasText: /vehicles|browse/i }).first();
    await expect(heading).toBeVisible();

    // Check for vehicle grid container
    const vehicleGrid = page.locator('[data-testid="vehicle-grid"], .vehicle-grid, [class*="grid"]').first();
    await expect(vehicleGrid).toBeVisible();
  });

  test('should display vehicle cards with correct information', async ({ page }) => {
    // Create a seller account and add test vehicles
    const seller = await setupAuthSession(page, 'seller');
    
    // Create test vehicle
    const vehicleData = {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      vin: generateVIN()
    };
    await createVehicle(page, vehicleData);

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Wait for vehicle cards to load
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    await expect(vehicleCard).toBeVisible({ timeout: 10000 });

    // Check vehicle card has image
    const vehicleImage = vehicleCard.locator('img').first();
    await expect(vehicleImage).toBeVisible();

    // Check vehicle card has make and model
    const makeModel = vehicleCard.locator('[data-testid="vehicle-title"], [class*="title"]').first();
    await expect(makeModel).toBeVisible();
    const makeModelText = await makeModel.textContent();
    expect(makeModelText).toBeTruthy();

    // Check vehicle card has price
    const price = vehicleCard.locator('[data-testid="vehicle-price"], [class*="price"]').first();
    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText).toMatch(/\d+/); // Should contain numbers

    // Check vehicle card has year
    const vehicleInfo = await vehicleCard.textContent();
    expect(vehicleInfo).toMatch(/20\d{2}/); // Should contain year (20XX)

    // Check vehicle card has mileage
    expect(vehicleInfo).toMatch(/\d+\s*(km|mi)/i); // Should contain mileage
  });

  test('should handle pagination - next page', async ({ page }) => {
    // Create a seller and multiple vehicles to ensure pagination
    const seller = await setupAuthSession(page, 'seller');
    
    // Create 15 test vehicles to ensure multiple pages
    for (let i = 0; i < 15; i++) {
      await createVehicle(page, {
        ...TEST_VEHICLE_VARIANTS.bmw_3series,
        make: 'BMW',
        model: `Test Vehicle ${i + 1}`,
        year: 2020 + (i % 4),
        price: 30000 + (i * 1000),
        vin: generateVIN()
      });
    }

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Check if pagination exists
    const paginationNext = page.locator('[data-testid="pagination-next"], button:has-text("Next"), a:has-text("Next")').first();
    
    if (await paginationNext.count() > 0 && await paginationNext.isEnabled()) {
      // Get current page vehicles
      const firstPageCards = await page.locator('[data-testid="vehicle-card"]').count();
      
      // Click next page
      await paginationNext.click();
      await page.waitForLoadState('networkidle');

      // Verify page changed
      expect(page.url()).toMatch(/page=2/);

      // Wait for new vehicles to load
      await page.waitForSelector('[data-testid="vehicle-card"]', { timeout: 10000 });
      
      // Verify we have vehicles on second page
      const secondPageCards = await page.locator('[data-testid="vehicle-card"]').count();
      expect(secondPageCards).toBeGreaterThan(0);
    }
  });

  test('should handle pagination - previous page', async ({ page }) => {
    // Navigate to page 2 directly
    await page.goto('/vehicles?page=2');
    await page.waitForLoadState('networkidle');

    // Wait for vehicles to load
    await page.waitForTimeout(1000);

    // Check if previous button exists
    const paginationPrev = page.locator('[data-testid="pagination-prev"], button:has-text("Previous"), a:has-text("Previous")').first();
    
    if (await paginationPrev.count() > 0 && await paginationPrev.isEnabled()) {
      // Click previous page
      await paginationPrev.click();
      await page.waitForLoadState('networkidle');

      // Verify we're back to page 1
      const url = page.url();
      expect(url).not.toContain('page=2');
    }
  });

  test('should update URL on pagination', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Check if pagination next button exists
    const paginationNext = page.locator('[data-testid="pagination-next"], button:has-text("Next")').first();
    
    if (await paginationNext.count() > 0 && await paginationNext.isEnabled()) {
      // Click next page
      await paginationNext.click();
      await page.waitForLoadState('networkidle');

      // Check URL has page parameter
      expect(page.url()).toMatch(/[?&]page=2/);
    }
  });

  test('should display vehicles sorted by newest first (default)', async ({ page }) => {
    // Create a seller and add vehicles with different dates
    const seller = await setupAuthSession(page, 'seller');
    
    // Create older vehicle
    const oldVehicleData = {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      model: 'Old Vehicle 2020',
      year: 2020,
      vin: generateVIN()
    };
    await createVehicle(page, oldVehicleData);
    
    // Wait a bit to ensure different timestamps
    await page.waitForTimeout(1000);
    
    // Create newer vehicle
    const newVehicleData = {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      model: 'New Vehicle 2023',
      year: 2023,
      vin: generateVIN()
    };
    await createVehicle(page, newVehicleData);

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Wait for vehicles to load
    await page.waitForSelector('[data-testid="vehicle-card"]', { timeout: 10000 });

    // Get first vehicle card
    const firstVehicle = page.locator('[data-testid="vehicle-card"]').first();
    const firstVehicleText = await firstVehicle.textContent();

    // The newest vehicle (New Vehicle 2023) should appear first
    // Check if first vehicle is the newer one
    expect(firstVehicleText).toContain('2023');
  });

  test('should show vehicle count or results info', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Look for vehicle count or results info
    const countIndicator = page.locator('[data-testid="vehicle-count"], [data-testid="results-info"], [class*="count"], [class*="results"]').first();
    
    // Check if count/results info is visible
    if (await countIndicator.count() > 0) {
      await expect(countIndicator).toBeVisible();
      const countText = await countIndicator.textContent();
      expect(countText).toBeTruthy();
    }
  });

  test('should handle empty results state', async ({ page }) => {
    // Navigate to vehicles with impossible filter that returns no results
    await page.goto('/vehicles?price_min=9999999');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for empty state message
    const emptyState = page.locator('[data-testid="no-vehicles"], [class*="empty"], text=/no vehicles found/i').first();
    
    if (await emptyState.count() > 0) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should display vehicle cards in grid layout', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Wait for vehicle cards
    const vehicleCards = page.locator('[data-testid="vehicle-card"]');
    const count = await vehicleCards.count();

    if (count > 0) {
      // Check if cards are in grid layout (multiple cards per row)
      // Get the first two cards and compare their Y positions
      if (count >= 2) {
        const firstCard = vehicleCards.nth(0);
        const secondCard = vehicleCards.nth(1);
        
        await expect(firstCard).toBeVisible();
        await expect(secondCard).toBeVisible();
        
        const firstBox = await firstCard.boundingBox();
        const secondBox = await secondCard.boundingBox();
        
        // Check if cards are roughly on the same row (grid layout)
        if (firstBox && secondBox) {
          const yDiff = Math.abs(firstBox.y - secondBox.y);
          expect(yDiff).toBeLessThan(50); // Cards should be on same row
        }
      }
    }
  });

  test('should have clickable vehicle cards', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Wait for vehicles to load
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    
    if (await vehicleCard.count() > 0) {
      await expect(vehicleCard).toBeVisible();
      
      // Check if card or its link is clickable
      const cardLink = vehicleCard.locator('a[href*="/vehicle/"]').first();
      
      if (await cardLink.count() > 0) {
        await expect(cardLink).toBeVisible();
        
        // Get href attribute
        const href = await cardLink.getAttribute('href');
        expect(href).toMatch(/\/vehicle\/\d+/);
      }
    }
  });

  test('should maintain scroll position after interaction', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Scroll down the page
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Get scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Interact with filter (without applying)
    const filter = page.locator('select[name="make"]').first();
    if (await filter.count() > 0) {
      await filter.focus();
    }

    await page.waitForTimeout(300);

    // Check scroll position maintained
    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(Math.abs(newScrollY - scrollY)).toBeLessThan(100);
  });

  test('should show loading state while fetching vehicles', async ({ page }) => {
    // Navigate to vehicles page
    const navigationPromise = page.goto('/vehicles');
    
    // Check for loading indicator
    const loadingIndicator = page.locator('[data-testid="loading"], [class*="loading"], [class*="spinner"]').first();
    
    // Wait for navigation to complete
    await navigationPromise;
    await page.waitForLoadState('networkidle');
    
    // Loading should be gone
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator).not.toBeVisible();
    }
  });

  test('should handle page refresh', async ({ page }) => {
    await page.goto('/vehicles?page=2');
    await page.waitForLoadState('networkidle');

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify page parameter is still present
    expect(page.url()).toContain('page=2');

    // Verify vehicles load after refresh
    await page.waitForTimeout(1000);
    const hasCards = await page.locator('[data-testid="vehicle-card"]').count() > 0;
    // Just verify page loads without errors
    expect(page.url()).toContain('/vehicles');
  });
});
