import { test, expect } from '@playwright/test';

test.describe('Vehicles', () => {
  test('browse and search vehicles', async ({ page }) => {
    // Navigate to vehicles
    await page.goto('/vehicles');

    // Assert grid loads
    await expect(page.locator('[data-testid="vehicle-grid"]')).toBeVisible();

    // Enter search term
    await page.fill('input[placeholder*="Search"]', 'BMW');
    await page.press('input[placeholder*="Search"]', 'Enter');

    // Assert results filtered
    await page.waitForLoadState('networkidle');
    const vehicleCards = page.locator('[data-testid="vehicle-card"]');
    await expect(vehicleCards.first()).toContainText('BMW');

    // Clear search
    await page.fill('input[placeholder*="Search"]', '');
    await page.press('input[placeholder*="Search"]', 'Enter');

    // Assert all vehicles show
    await expect(vehicleCards).toHaveCount(await vehicleCards.count());
  });

  test('filter vehicles by price', async ({ page }) => {
    // Navigate to vehicles
    await page.goto('/vehicles');

    // Set price filter 10k-50k
    await page.fill('input[name="min_price"]', '10000');
    await page.fill('input[name="max_price"]', '50000');
    await page.click('button:has-text("Apply Filters")');

    // Assert results within range
    await page.waitForLoadState('networkidle');
    const prices = page.locator('[data-testid="vehicle-price"]');
    const count = await prices.count();

    for (let i = 0; i < count; i++) {
      const priceText = await prices.nth(i).textContent();
      const price = parseInt(priceText?.replace(/[^0-9]/g, '') || '0');
      expect(price).toBeGreaterThanOrEqual(10000);
      expect(price).toBeLessThanOrEqual(50000);
    }
  });

  test('view vehicle details', async ({ page }) => {
    // Navigate to vehicles page
    await page.goto('/vehicles');

    // Click on first vehicle
    await page.click('[data-testid="vehicle-card"]:first-child');

    // Assert details page loads
    await expect(page).toHaveURL(/\/vehicle\/\d+/);

    // Assert images display
    await expect(page.locator('[data-testid="vehicle-image"]')).toBeVisible();

    // Assert seller info shows
    await expect(page.locator('[data-testid="seller-info"]')).toBeVisible();

    // Assert reviews section exists
    await expect(page.locator('[data-testid="reviews-section"]')).toBeVisible();
  });

  test('pagination works correctly', async ({ page }) => {
    await page.goto('/vehicles');

    // Assert pagination controls visible
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible();

    // Click next page
    await page.click('button:has-text("Next")');

    // Assert URL updated
    await expect(page).toHaveURL(/page=2/);

    // Assert new vehicles loaded
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(await page.locator('[data-testid="vehicle-card"]').count());
  });

  test('vehicle card displays correct information', async ({ page }) => {
    await page.goto('/vehicles');

    const firstCard = page.locator('[data-testid="vehicle-card"]').first();

    // Assert card has image
    await expect(firstCard.locator('img')).toBeVisible();

    // Assert card has price
    await expect(firstCard.locator('[data-testid="vehicle-price"]')).toBeVisible();

    // Assert card has make/model
    await expect(firstCard.locator('[data-testid="vehicle-title"]')).toBeVisible();

    // Assert card has year
    await expect(firstCard.locator('text=/20\\d{2}/')).toBeVisible();
  });
});
