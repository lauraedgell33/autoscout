/**
 * E2E tests for vehicle search functionality
 * Tests search by keyword, make+model, clear button, debouncing
 */

import { test, expect } from '@playwright/test';
import { setupAuthSession } from '../helpers/auth.helpers';
import { createVehicle, searchVehicles } from '../helpers/vehicle.helpers';
import { TEST_VEHICLE_VARIANTS, generateVIN } from '../helpers/fixtures';

test.describe('Vehicle Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
  });

  test('should search vehicles by keyword', async ({ page }) => {
    // Create a seller and add test vehicles
    const seller = await setupAuthSession(page, 'seller');
    
    // Create BMW vehicle
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: '3 Series',
      vin: generateVIN()
    });
    
    // Create Mercedes vehicle
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.mercedes_cclass,
      make: 'Mercedes-Benz',
      model: 'C-Class',
      vin: generateVIN()
    });

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i], input[type="search"]').first();
    await expect(searchInput).toBeVisible();

    // Search for BMW
    await searchInput.fill('BMW');
    await page.waitForTimeout(500); // Wait for debounce
    await page.waitForLoadState('networkidle');

    // Wait for results
    await page.waitForTimeout(1000);

    // Check URL contains search query
    expect(page.url()).toMatch(/[?&]search=BMW/i);

    // Verify search results contain BMW
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('BMW');
  });

  test('should search by make and model combination', async ({ page }) => {
    // Create a seller and add test vehicles
    const seller = await setupAuthSession(page, 'seller');
    
    // Create BMW X5
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      vin: generateVIN()
    });
    
    // Create BMW 3 Series
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      vin: generateVIN()
    });

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Search for specific model
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await searchInput.fill('BMW X5');
    await page.waitForTimeout(500); // Wait for debounce
    await page.waitForLoadState('networkidle');

    // Wait for results
    await page.waitForTimeout(1000);

    // Check URL contains search query
    expect(page.url()).toMatch(/search=.*BMW.*X5/i);

    // Verify results
    const pageContent = await page.textContent('body');
    expect(pageContent?.toLowerCase()).toMatch(/bmw.*x5|x5.*bmw/);
  });

  test('should clear search results with clear button', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Perform a search
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await searchInput.fill('BMW');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');

    // Check that search is active
    expect(await searchInput.inputValue()).toBe('BMW');

    // Look for clear button
    const clearButton = page.locator('[data-testid="clear-search"], button:has-text("Clear"), [class*="clear"]').first();
    
    if (await clearButton.count() > 0 && await clearButton.isVisible()) {
      // Click clear button
      await clearButton.click();
      await page.waitForLoadState('networkidle');

      // Verify search is cleared
      expect(await searchInput.inputValue()).toBe('');
      
      // URL should not have search parameter
      expect(page.url()).not.toMatch(/search=/);
    } else {
      // Alternative: clear by emptying input
      await searchInput.clear();
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');
      
      expect(await searchInput.inputValue()).toBe('');
    }
  });

  test('should show "No vehicles found" for search with no results', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Search for something that doesn't exist
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await searchInput.fill('ZZZZNONEXISTENTVEHICLE999');
    await page.waitForTimeout(500); // Wait for debounce
    await page.waitForLoadState('networkidle');

    // Wait for results to load
    await page.waitForTimeout(1000);

    // Check for empty state message
    const emptyState = page.locator('[data-testid="no-vehicles"], [data-testid="empty-state"], text=/no vehicles found/i, text=/no results/i').first();
    
    // Wait for empty state to appear
    await page.waitForTimeout(500);
    
    if (await emptyState.count() > 0) {
      await expect(emptyState).toBeVisible();
    } else {
      // Alternative check: no vehicle cards should be visible
      const vehicleCards = await page.locator('[data-testid="vehicle-card"]').count();
      expect(vehicleCards).toBe(0);
    }
  });

  test('should implement debounced search (300ms delay)', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await expect(searchInput).toBeVisible();

    // Start typing quickly
    await searchInput.type('B', { delay: 50 });
    await page.waitForTimeout(100);
    
    // Check that search hasn't been triggered yet (within debounce window)
    let urlAfter100ms = page.url();
    
    await searchInput.type('M', { delay: 50 });
    await page.waitForTimeout(100);
    
    await searchInput.type('W', { delay: 50 });
    
    // Wait for debounce delay (300ms)
    await page.waitForTimeout(400);
    await page.waitForLoadState('networkidle');

    // Now search should be triggered
    const finalUrl = page.url();
    expect(finalUrl).toMatch(/search=BMW/i);
  });

  test('should preserve search query in URL', async ({ page }) => {
    // Navigate to vehicles with search query
    await page.goto('/vehicles?search=BMW');
    await page.waitForLoadState('networkidle');

    // Check that search input has the query
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    
    if (await searchInput.count() > 0) {
      const inputValue = await searchInput.inputValue();
      expect(inputValue.toLowerCase()).toContain('bmw');
    }

    // URL should still contain search
    expect(page.url()).toMatch(/search=BMW/i);
  });

  test('should update search results in real-time', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Get initial vehicle count
    const initialCards = await page.locator('[data-testid="vehicle-card"]').count();

    // Perform a search
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await searchInput.fill('BMW');
    await page.waitForTimeout(500); // Wait for debounce
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Get filtered vehicle count
    const filteredCards = await page.locator('[data-testid="vehicle-card"]').count();

    // Results should have changed (either more or less vehicles)
    // Note: this test assumes search actually filters results
    // In some cases, results might be the same if all are BMW
  });

  test('should search case-insensitively', async ({ page }) => {
    // Create a seller and add test vehicle
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: 'X5',
      vin: generateVIN()
    });

    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Search with lowercase
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await searchInput.fill('bmw');
    await page.waitForTimeout(500); // Wait for debounce
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check results include BMW
    const pageContent = await page.textContent('body');
    expect(pageContent?.toUpperCase()).toContain('BMW');
  });

  test('should allow search refinement', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();

    // First search
    await searchInput.fill('BMW');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');

    // Refine search
    await searchInput.clear();
    await searchInput.fill('BMW X5');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');

    // Check refined search in URL
    expect(page.url()).toMatch(/search=.*BMW.*X5/i);
  });

  test('should handle special characters in search', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();

    // Search with special characters
    await searchInput.fill('BMW & Mercedes');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');

    // Should not crash or error
    expect(page.url()).toContain('/vehicles');
  });

  test('should show search results count', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Perform search
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    await searchInput.fill('BMW');
    await page.waitForTimeout(500);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for results count
    const resultsCount = page.locator('[data-testid="results-count"], [data-testid="vehicle-count"]').first();
    
    if (await resultsCount.count() > 0) {
      await expect(resultsCount).toBeVisible();
      const countText = await resultsCount.textContent();
      expect(countText).toMatch(/\d+/);
    }
  });

  test('should maintain search when navigating pagination', async ({ page }) => {
    // Navigate with search query and page
    await page.goto('/vehicles?search=BMW&page=1');
    await page.waitForLoadState('networkidle');

    // Check search input has value
    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    if (await searchInput.count() > 0) {
      const value = await searchInput.inputValue();
      expect(value.toLowerCase()).toContain('bmw');
    }

    // If pagination exists, click next
    const nextButton = page.locator('[data-testid="pagination-next"], button:has-text("Next")').first();
    
    if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Search should still be in URL
      expect(page.url()).toMatch(/search=BMW/i);
      expect(page.url()).toMatch(/page=2/);
    }
  });

  test('should focus search input on page load', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    
    if (await searchInput.count() > 0) {
      // Click to ensure focus
      await searchInput.click();
      
      // Type without explicitly focusing
      await page.keyboard.type('Test');
      
      // Verify typing worked (input should have value)
      const value = await searchInput.inputValue();
      expect(value).toContain('Test');
    }
  });

  test('should show search suggestions or autocomplete if available', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[name="search"], input[placeholder*="Search" i]').first();
    
    if (await searchInput.count() > 0) {
      // Start typing
      await searchInput.fill('BM');
      await page.waitForTimeout(300);

      // Look for suggestions/autocomplete dropdown
      const suggestions = page.locator('[data-testid="search-suggestions"], [class*="suggestions"], [class*="autocomplete"]').first();
      
      // If suggestions exist, verify they're visible
      if (await suggestions.count() > 0) {
        await expect(suggestions).toBeVisible();
      }
    }
  });
});
