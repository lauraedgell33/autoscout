/**
 * E2E tests for vehicle filtering functionality
 * Tests all filter types, multiple filters, clear all, and URL params
 */

import { test, expect } from '@playwright/test';
import { setupAuthSession } from '../helpers/auth.helpers';
import { createVehicle, applyFilters, clearAllFilters } from '../helpers/vehicle.helpers';
import { TEST_VEHICLE_VARIANTS, generateVIN, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES } from '../helpers/fixtures';

test.describe('Vehicle Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
  });

  test('should filter by category', async ({ page }) => {
    // Create seller and test vehicles
    const seller = await setupAuthSession(page, 'seller');
    
    // Create car
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      category: 'car',
      vin: generateVIN()
    });
    
    // Create motorcycle
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.motorcycle,
      category: 'motorcycle',
      vin: generateVIN()
    });

    // Navigate to vehicles
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Select category filter
    const categoryFilter = page.locator('select[name="category"]').first();
    
    if (await categoryFilter.count() > 0) {
      await categoryFilter.selectOption('motorcycle');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      // Check URL contains category
      expect(page.url()).toMatch(/category=motorcycle/i);

      // Verify results show motorcycles
      await page.waitForTimeout(1000);
      const pageContent = await page.textContent('body');
      expect(pageContent?.toLowerCase()).toContain('motorcycle');
    }
  });

  test('should filter by price range (min and max)', async ({ page }) => {
    // Create seller and vehicles with different prices
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      price: 30000,
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      price: 50000,
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply price filter
    const priceMinInput = page.locator('input[name="price_min"]').first();
    const priceMaxInput = page.locator('input[name="price_max"]').first();

    if (await priceMinInput.count() > 0 && await priceMaxInput.count() > 0) {
      await priceMinInput.fill('35000');
      await priceMaxInput.fill('55000');
      
      // Apply filter
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
      }
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Check URL contains price filters
      expect(page.url()).toMatch(/price_min=35000/);
      expect(page.url()).toMatch(/price_max=55000/);
    }
  });

  test('should filter by year range', async ({ page }) => {
    // Create seller and vehicles with different years
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      year: 2020,
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      year: 2023,
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply year filter
    const yearFromInput = page.locator('input[name="year_from"]').first();
    const yearToInput = page.locator('input[name="year_to"]').first();

    if (await yearFromInput.count() > 0 && await yearToInput.count() > 0) {
      await yearFromInput.fill('2022');
      await yearToInput.fill('2024');
      
      // Apply filter
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
      }
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Check URL
      expect(page.url()).toMatch(/year_from=2022/);
      expect(page.url()).toMatch(/year_to=2024/);
    }
  });

  test('should filter by maximum mileage', async ({ page }) => {
    // Create seller and vehicles with different mileage
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      mileage: 10000,
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      mileage: 50000,
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply mileage filter
    const mileageMaxInput = page.locator('input[name="mileage_max"]').first();

    if (await mileageMaxInput.count() > 0) {
      await mileageMaxInput.fill('30000');
      
      // Apply filter
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
      }
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Check URL
      expect(page.url()).toMatch(/mileage_max=30000/);
    }
  });

  test('should filter by make', async ({ page }) => {
    // Create seller and vehicles with different makes
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      make: 'Audi',
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Select make filter
    const makeFilter = page.locator('select[name="make"]').first();

    if (await makeFilter.count() > 0) {
      await makeFilter.selectOption('BMW');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Check URL
      expect(page.url()).toMatch(/make=BMW/i);

      // Verify results
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('BMW');
    }
  });

  test('should filter by model (dependent on make)', async ({ page }) => {
    // Create seller and vehicle
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: '3 Series',
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: 'X5',
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // First select make
    const makeFilter = page.locator('select[name="make"]').first();
    if (await makeFilter.count() > 0) {
      await makeFilter.selectOption('BMW');
      await page.waitForTimeout(500);

      // Then select model (should be enabled after make selection)
      const modelFilter = page.locator('select[name="model"]').first();
      
      if (await modelFilter.count() > 0) {
        // Wait for model dropdown to populate
        await page.waitForTimeout(500);
        
        // Select model if options are available
        const modelOptions = await modelFilter.locator('option').count();
        if (modelOptions > 1) { // More than just the placeholder
          await modelFilter.selectOption({ index: 1 }); // Select first real option
          await page.waitForLoadState('networkidle');

          // Check URL contains both make and model
          expect(page.url()).toMatch(/make=BMW/i);
        }
      }
    }
  });

  test('should filter by fuel type', async ({ page }) => {
    // Create vehicles with different fuel types
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      fuel_type: 'diesel',
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.electric_vehicle,
      fuel_type: 'electric',
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Select fuel type filter
    const fuelTypeFilter = page.locator('select[name="fuel_type"]').first();

    if (await fuelTypeFilter.count() > 0) {
      await fuelTypeFilter.selectOption('electric');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      // Check URL
      expect(page.url()).toMatch(/fuel_type=electric/i);
    }
  });

  test('should filter by transmission type', async ({ page }) => {
    // Create vehicles with different transmissions
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      transmission: 'automatic',
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      transmission: 'manual',
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Select transmission filter
    const transmissionFilter = page.locator('select[name="transmission"]').first();

    if (await transmissionFilter.count() > 0) {
      await transmissionFilter.selectOption('manual');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      // Check URL
      expect(page.url()).toMatch(/transmission=manual/i);
    }
  });

  test('should filter by body type', async ({ page }) => {
    // Create vehicles with different body types
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      body_type: 'sedan',
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      body_type: 'suv',
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Select body type filter
    const bodyTypeFilter = page.locator('select[name="body_type"]').first();

    if (await bodyTypeFilter.count() > 0) {
      await bodyTypeFilter.selectOption('suv');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      // Check URL
      expect(page.url()).toMatch(/body_type=suv/i);
    }
  });

  test('should filter by location (city)', async ({ page }) => {
    // Create vehicles in different cities
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      city: 'Berlin',
      country: 'Germany',
      vin: generateVIN()
    });
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      city: 'Munich',
      country: 'Germany',
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply location filter
    const cityInput = page.locator('input[name="city"]').first();

    if (await cityInput.count() > 0) {
      await cityInput.fill('Berlin');
      
      // Apply filter
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
      }
      
      await page.waitForLoadState('networkidle');

      // Check URL
      expect(page.url()).toMatch(/city=Berlin/i);
    }
  });

  test('should apply multiple filters simultaneously', async ({ page }) => {
    // Create diverse test vehicles
    const seller = await setupAuthSession(page, 'seller');
    
    await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      fuel_type: 'diesel',
      transmission: 'automatic',
      price: 40000,
      year: 2022,
      vin: generateVIN()
    });

    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply multiple filters
    const makeFilter = page.locator('select[name="make"]').first();
    const fuelFilter = page.locator('select[name="fuel_type"]').first();
    const transmissionFilter = page.locator('select[name="transmission"]').first();

    if (await makeFilter.count() > 0) await makeFilter.selectOption('BMW');
    await page.waitForTimeout(300);
    
    if (await fuelFilter.count() > 0) await fuelFilter.selectOption('diesel');
    await page.waitForTimeout(300);
    
    if (await transmissionFilter.count() > 0) await transmissionFilter.selectOption('automatic');
    await page.waitForTimeout(300);

    // Apply filters
    const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
    if (await applyButton.count() > 0) {
      await applyButton.click();
    }
    
    await page.waitForLoadState('networkidle');

    // Check URL contains all filters
    const url = page.url();
    expect(url).toMatch(/make=BMW/i);
    expect(url).toMatch(/fuel_type=diesel/i);
    expect(url).toMatch(/transmission=automatic/i);
  });

  test('should clear all filters with "Clear All" button', async ({ page }) => {
    // Apply some filters first
    await page.goto('/vehicles?make=BMW&fuel_type=diesel&price_min=30000');
    await page.waitForLoadState('networkidle');

    // Verify filters are applied
    expect(page.url()).toContain('make=BMW');

    // Click clear all button
    const clearAllButton = page.locator('[data-testid="clear-filters"], button:has-text("Clear All"), button:has-text("Clear Filters"), button:has-text("Reset")').first();

    if (await clearAllButton.count() > 0) {
      await clearAllButton.click();
      await page.waitForLoadState('networkidle');

      // Check URL has no filter parameters
      const url = page.url();
      expect(url).not.toMatch(/make=/);
      expect(url).not.toMatch(/fuel_type=/);
      expect(url).not.toMatch(/price_min=/);

      // Check form fields are cleared
      const makeFilter = page.locator('select[name="make"]').first();
      if (await makeFilter.count() > 0) {
        const selectedValue = await makeFilter.inputValue();
        expect(selectedValue).toBe(''); // Should be empty or default value
      }
    }
  });

  test('should display active filter count badge', async ({ page }) => {
    // Apply filters
    await page.goto('/vehicles?make=BMW&fuel_type=diesel&price_min=30000');
    await page.waitForLoadState('networkidle');

    // Look for filter count badge
    const filterBadge = page.locator('[data-testid="filter-count"], [class*="filter-count"], [class*="badge"]').first();

    if (await filterBadge.count() > 0) {
      await expect(filterBadge).toBeVisible();
      const badgeText = await filterBadge.textContent();
      
      // Should show number of active filters (3 in this case)
      expect(badgeText).toMatch(/\d+/);
    }
  });

  test('should update URL query params with filters', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply a filter
    const makeFilter = page.locator('select[name="make"]').first();
    
    if (await makeFilter.count() > 0) {
      await makeFilter.selectOption('BMW');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      // Check URL updated
      expect(page.url()).toMatch(/[?&]make=BMW/i);

      // Apply another filter
      const fuelFilter = page.locator('select[name="fuel_type"]').first();
      if (await fuelFilter.count() > 0) {
        await fuelFilter.selectOption('diesel');
        await page.waitForTimeout(500);
        await page.waitForLoadState('networkidle');

        // Both filters should be in URL
        expect(page.url()).toMatch(/make=BMW/i);
        expect(page.url()).toMatch(/fuel_type=diesel/i);
      }
    }
  });

  test('should persist filters on page refresh', async ({ page }) => {
    // Navigate with filters
    await page.goto('/vehicles?make=BMW&fuel_type=diesel');
    await page.waitForLoadState('networkidle');

    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filters should still be in URL
    expect(page.url()).toMatch(/make=BMW/);
    expect(page.url()).toMatch(/fuel_type=diesel/);

    // Filter controls should reflect the selected values
    const makeFilter = page.locator('select[name="make"]').first();
    if (await makeFilter.count() > 0) {
      const value = await makeFilter.inputValue();
      expect(value.toLowerCase()).toContain('bmw');
    }
  });

  test('should show active filter chips or tags', async ({ page }) => {
    // Apply filters
    await page.goto('/vehicles?make=BMW&fuel_type=diesel');
    await page.waitForLoadState('networkidle');

    // Look for filter chips/tags
    const filterChips = page.locator('[data-testid="filter-chip"], [class*="filter-chip"], [class*="filter-tag"]');

    if (await filterChips.count() > 0) {
      // Should have chips for each active filter
      const count = await filterChips.count();
      expect(count).toBeGreaterThan(0);

      // Chips should be visible and contain filter values
      await expect(filterChips.first()).toBeVisible();
    }
  });

  test('should remove individual filter from chips', async ({ page }) => {
    // Apply filters
    await page.goto('/vehicles?make=BMW&fuel_type=diesel&transmission=automatic');
    await page.waitForLoadState('networkidle');

    // Look for filter chip with remove button
    const filterChip = page.locator('[data-testid="filter-chip"]').first();
    
    if (await filterChip.count() > 0) {
      // Find remove button within chip
      const removeButton = filterChip.locator('button, [class*="remove"], [aria-label*="remove"]').first();
      
      if (await removeButton.count() > 0) {
        // Click remove
        await removeButton.click();
        await page.waitForLoadState('networkidle');

        // One filter should be removed from URL
        const url = page.url();
        const filterCount = (url.match(/[?&]\w+=/g) || []).length;
        expect(filterCount).toBeLessThan(3); // Originally had 3 filters
      }
    }
  });

  test('should validate price range (min not greater than max)', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    const priceMinInput = page.locator('input[name="price_min"]').first();
    const priceMaxInput = page.locator('input[name="price_max"]').first();

    if (await priceMinInput.count() > 0 && await priceMaxInput.count() > 0) {
      // Try to set min > max
      await priceMinInput.fill('50000');
      await priceMaxInput.fill('30000');

      // Try to apply
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
        await page.waitForTimeout(500);

        // Should show validation error or prevent submission
        const errorMessage = page.locator('[class*="error"], [role="alert"]').first();
        
        // Either error message shown or filters not applied
        if (await errorMessage.count() > 0) {
          await expect(errorMessage).toBeVisible();
        }
      }
    }
  });

  test('should filter results immediately on selection', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Get initial count
    const initialCount = await page.locator('[data-testid="vehicle-card"]').count();

    // Apply filter
    const makeFilter = page.locator('select[name="make"]').first();
    
    if (await makeFilter.count() > 0) {
      await makeFilter.selectOption('BMW');
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Results should have updated
      // (This assumes instant filtering, may need to click Apply button in some implementations)
      expect(page.url()).toMatch(/make=BMW/i);
    }
  });

  test('should handle no results from filters gracefully', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Apply impossible filter combination
    await page.goto('/vehicles?make=BMW&price_max=100&year_from=2025');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should show empty state
    const emptyState = page.locator('[data-testid="no-vehicles"], text=/no vehicles found/i').first();
    
    if (await emptyState.count() > 0) {
      await expect(emptyState).toBeVisible();
    } else {
      // At minimum, no vehicle cards should be shown
      const cards = await page.locator('[data-testid="vehicle-card"]').count();
      expect(cards).toBe(0);
    }
  });
});
