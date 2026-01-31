import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Favorites', () => {
  test.beforeEach(async ({ page }) => {
    // Login as buyer before each test
    await login(page, 'buyer@test.com', 'password123');
  });

  test('add and remove favorites', async ({ page }) => {
    // Navigate to vehicles
    await page.goto('/vehicles');

    // Click heart on first vehicle
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    await favoriteButton.click();

    // Assert toast "Added to favorites"
    await expect(page.locator('text=/added to favorites/i')).toBeVisible();

    // Navigate to favorites page
    await page.goto('/buyer/favorites');

    // Assert vehicle appears
    await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(1);

    // Click heart again to remove
    await page.locator('[data-testid="favorite-button"]').first().click();

    // Assert toast "Removed"
    await expect(page.locator('text=/removed from favorites/i')).toBeVisible();

    // Assert vehicle gone from list
    await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(0);

    // Assert empty state message
    await expect(page.locator('text=/no favorites/i')).toBeVisible();
  });

  test('favorite status persists across pages', async ({ page }) => {
    // Add to favorites from vehicles page
    await page.goto('/vehicles');
    await page.locator('[data-testid="favorite-button"]').first().click();

    // Navigate to vehicle detail page
    await page.locator('[data-testid="vehicle-card"]').first().click();

    // Assert favorite button is filled/active
    const detailFavoriteButton = page.locator('[data-testid="favorite-button"]');
    await expect(detailFavoriteButton).toHaveClass(/active|filled/);
  });

  test('favorites count updates correctly', async ({ page }) => {
    await page.goto('/vehicles');

    // Get initial favorites count
    const favoritesLink = page.locator('[data-testid="favorites-link"]');
    const initialCount = await favoritesLink.textContent();

    // Add a favorite
    await page.locator('[data-testid="favorite-button"]').first().click();
    await page.waitForTimeout(500);

    // Assert count increased
    const newCount = await favoritesLink.textContent();
    expect(newCount).not.toBe(initialCount);
  });

  test('can filter favorites', async ({ page }) => {
    // Add multiple favorites first
    await page.goto('/vehicles');
    const favoriteButtons = page.locator('[data-testid="favorite-button"]');
    await favoriteButtons.nth(0).click();
    await page.waitForTimeout(300);
    await favoriteButtons.nth(1).click();
    await page.waitForTimeout(300);

    // Go to favorites page
    await page.goto('/buyer/favorites');

    // Apply price filter
    await page.fill('input[name="max_price"]', '30000');
    await page.click('button:has-text("Apply")');

    // Assert filtered results
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-testid="vehicle-card"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
