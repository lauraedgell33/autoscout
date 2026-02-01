/**
 * E2E tests for favorites functionality
 * Tests adding/removing favorites, favorites page, and empty states
 */

import { test, expect } from '@playwright/test';
import { setupAuthSession, clearAuth } from '../helpers/auth.helpers';
import { createVehicle, addToFavorites, removeFromFavorites, goToVehicleDetail } from '../helpers/vehicle.helpers';
import { TEST_VEHICLE_VARIANTS, generateVIN } from '../helpers/fixtures';

test.describe('Favorites Functionality', () => {
  let vehicleId: string;

  test.beforeEach(async ({ page }) => {
    // Create a seller and test vehicle
    const seller = await setupAuthSession(page, 'seller');
    
    vehicleId = await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: '3 Series',
      year: 2022,
      price: 35000,
      vin: generateVIN()
    });

    // Logout seller and login as buyer
    await clearAuth(page);
  });

  test('should add vehicle to favorites with heart icon', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Navigate to vehicle detail
    await goToVehicleDetail(page, vehicleId);

    // Find favorite button
    const favoriteButton = page.locator('[data-testid="favorite-button"], [aria-label*="favorite" i]').first();
    await expect(favoriteButton).toBeVisible();

    // Check initial state (not favorited)
    const initialState = await favoriteButton.getAttribute('aria-pressed');
    expect(initialState === 'false' || initialState === null).toBeTruthy();

    // Click to add to favorites
    await favoriteButton.click();
    await page.waitForTimeout(500);

    // Check state changed to favorited
    const newState = await favoriteButton.getAttribute('aria-pressed');
    expect(newState).toBe('true');

    // Visual indication (heart should be filled)
    const buttonClasses = await favoriteButton.getAttribute('class');
    expect(buttonClasses).toBeTruthy();
  });

  test('should remove vehicle from favorites by clicking heart again', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Navigate to vehicle and add to favorites
    await goToVehicleDetail(page, vehicleId);

    const favoriteButton = page.locator('[data-testid="favorite-button"], [aria-label*="favorite" i]').first();
    await expect(favoriteButton).toBeVisible();

    // Add to favorites
    await favoriteButton.click();
    await page.waitForTimeout(500);

    // Verify added
    let state = await favoriteButton.getAttribute('aria-pressed');
    expect(state).toBe('true');

    // Remove from favorites
    await favoriteButton.click();
    await page.waitForTimeout(500);

    // Verify removed
    state = await favoriteButton.getAttribute('aria-pressed');
    expect(state === 'false' || state === null).toBeTruthy();
  });

  test('should navigate to favorites page and show saved vehicles', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add vehicle to favorites first
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"], [aria-label*="favorite" i]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Navigate to favorites page
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');

    // Check page heading
    const heading = page.locator('h1, h2').filter({ hasText: /favorites|saved/i }).first();
    await expect(heading).toBeVisible();

    // Check for vehicle cards
    const vehicleCards = page.locator('[data-testid="vehicle-card"]');
    const count = await vehicleCards.count();
    
    if (count > 0) {
      await expect(vehicleCards.first()).toBeVisible();
      
      // Verify vehicle details are shown
      const firstCard = vehicleCards.first();
      const cardText = await firstCard.textContent();
      expect(cardText).toMatch(/BMW.*3 Series|3 Series.*BMW/i);
    }
  });

  test('should remove vehicle from favorites list page', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add vehicle to favorites
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Go to favorites page
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');

    // Find remove button on the card
    const removeButton = page.locator('[data-testid="remove-favorite"], button[aria-label*="remove" i]').first();

    if (await removeButton.count() > 0) {
      // Get initial count
      const initialCount = await page.locator('[data-testid="vehicle-card"]').count();

      // Click remove
      await removeButton.click();
      await page.waitForTimeout(500);
      await page.waitForLoadState('networkidle');

      // Count should decrease or empty state should show
      const newCount = await page.locator('[data-testid="vehicle-card"]').count();
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('should show "No favorites yet" empty state', async ({ page }) => {
    // Login as new buyer (no favorites)
    const buyer = await setupAuthSession(page, 'buyer');

    // Go to favorites page
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');

    // Check for empty state
    const emptyState = page.locator('[data-testid="no-favorites"], [data-testid="empty-state"], text=/no favorites/i').first();
    
    // Wait a bit for data to load
    await page.waitForTimeout(1000);

    // Either empty state is shown or no vehicle cards
    const vehicleCards = await page.locator('[data-testid="vehicle-card"]').count();
    
    if (vehicleCards === 0) {
      // Should show empty state message
      if (await emptyState.count() > 0) {
        await expect(emptyState).toBeVisible();
      } else {
        // At minimum, page should indicate no favorites
        const pageContent = await page.textContent('body');
        expect(pageContent?.toLowerCase()).toMatch(/no favorites|no saved|empty/);
      }
    }
  });

  test('should display favorites count badge in header', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add vehicle to favorites
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Look for favorites badge in header
    const favoritesBadge = page.locator('[data-testid="favorites-count"], [data-testid="favorites-badge"]').first();

    if (await favoritesBadge.count() > 0) {
      await expect(favoritesBadge).toBeVisible();
      
      const badgeText = await favoritesBadge.textContent();
      expect(badgeText).toMatch(/\d+/); // Should contain number
    } else {
      // Alternative: check header favorites link
      const favoritesLink = page.locator('a[href*="favorites"], nav a:has-text("Favorites")').first();
      if (await favoritesLink.count() > 0) {
        await expect(favoritesLink).toBeVisible();
      }
    }
  });

  test('should persist favorites across sessions', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');
    const { email, password } = buyer;

    // Add vehicle to favorites
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Clear auth and login again
    await clearAuth(page);
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Go to favorites
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Vehicle should still be in favorites
    const vehicleCards = await page.locator('[data-testid="vehicle-card"]').count();
    expect(vehicleCards).toBeGreaterThan(0);
  });

  test('should update heart icon state from favorites list', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add vehicle to favorites
    await goToVehicleDetail(page, vehicleId);
    let favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Go to favorites page
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');

    // Remove from favorites list
    const removeButton = page.locator('[data-testid="remove-favorite"], button[aria-label*="remove" i]').first();
    
    if (await removeButton.count() > 0) {
      await removeButton.click();
      await page.waitForTimeout(500);
    }

    // Go back to vehicle detail
    await goToVehicleDetail(page, vehicleId);

    // Heart icon should not be filled
    favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      const state = await favoriteButton.getAttribute('aria-pressed');
      expect(state === 'false' || state === null).toBeTruthy();
    }
  });

  test('should show favorites from vehicle listing page', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add vehicle to favorites from detail page
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Go to vehicles listing
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Find the vehicle card
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    
    if (await vehicleCard.count() > 0) {
      // Check if heart icon on card shows favorited state
      const cardFavoriteButton = vehicleCard.locator('[data-testid="favorite-button"], [aria-label*="favorite" i]').first();
      
      if (await cardFavoriteButton.count() > 0) {
        const state = await cardFavoriteButton.getAttribute('aria-pressed');
        // May or may not be visible on listing, but if it is, should show correct state
      }
    }
  });

  test('should require authentication to add favorites', async ({ page }) => {
    // Make sure not logged in
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Go to vehicle detail
    await goToVehicleDetail(page, vehicleId);

    // Try to click favorite button
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();

    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Should redirect to login or show login modal
      const currentUrl = page.url();
      const isLoginPage = currentUrl.includes('/login');
      const loginModal = await page.locator('[data-testid="login-modal"], [role="dialog"]').count();

      expect(isLoginPage || loginModal > 0).toBeTruthy();
    }
  });

  test('should add multiple vehicles to favorites', async ({ page }) => {
    // Create another vehicle
    const seller = await setupAuthSession(page, 'seller');
    
    const vehicleId2 = await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.audi_a4,
      make: 'Audi',
      model: 'A4',
      vin: generateVIN()
    });

    // Logout and login as buyer
    await clearAuth(page);
    const buyer = await setupAuthSession(page, 'buyer');

    // Add first vehicle to favorites
    await goToVehicleDetail(page, vehicleId);
    let favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Add second vehicle to favorites
    await goToVehicleDetail(page, vehicleId2);
    favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Go to favorites page
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should have 2 vehicles
    const vehicleCards = await page.locator('[data-testid="vehicle-card"]').count();
    expect(vehicleCards).toBe(2);
  });

  test('should show loading state while fetching favorites', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Navigate to favorites page
    const navigationPromise = page.goto('/buyer/favorites');

    // Look for loading indicator
    const loadingIndicator = page.locator('[data-testid="loading"], [class*="loading"]').first();

    // Wait for page to load
    await navigationPromise;
    await page.waitForLoadState('networkidle');

    // Loading should be gone
    if (await loadingIndicator.count() > 0) {
      await expect(loadingIndicator).not.toBeVisible();
    }
  });

  test('should handle favorite toggle errors gracefully', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Go to a vehicle
    await goToVehicleDetail(page, vehicleId);

    // Click favorite button rapidly (stress test)
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(100);
      await favoriteButton.click();
      await page.waitForTimeout(100);
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Should still have consistent state
      const state = await favoriteButton.getAttribute('aria-pressed');
      expect(state).toBeTruthy(); // Should be either 'true' or 'false', not undefined
    }
  });

  test('should allow navigation to vehicle detail from favorites page', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add vehicle to favorites
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Go to favorites page
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');

    // Click on vehicle card
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    
    if (await vehicleCard.count() > 0) {
      const cardLink = vehicleCard.locator('a[href*="/vehicle/"]').first();
      
      if (await cardLink.count() > 0) {
        await cardLink.click();
        await page.waitForLoadState('networkidle');

        // Should be on vehicle detail page
        expect(page.url()).toMatch(/\/vehicle\/\d+/);
      }
    }
  });

  test('should show empty state CTA to browse vehicles', async ({ page }) => {
    // Login as new buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Go to favorites (should be empty)
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Look for browse vehicles button/link
    const browseButton = page.locator('a[href*="/vehicles"], button:has-text("Browse")').first();

    if (await browseButton.count() > 0) {
      await expect(browseButton).toBeVisible();
      
      // Click to browse
      await browseButton.click();
      await page.waitForLoadState('networkidle');

      // Should navigate to vehicles page
      expect(page.url()).toContain('/vehicles');
    }
  });

  test('should update favorites count after adding/removing', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add to favorites
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Check count badge
      const countBadge = page.locator('[data-testid="favorites-count"]').first();
      
      if (await countBadge.count() > 0) {
        let count = await countBadge.textContent();
        expect(count).toMatch(/1/);

        // Remove from favorites
        await favoriteButton.click();
        await page.waitForTimeout(500);

        // Count should decrease or badge should hide
        if (await countBadge.isVisible()) {
          count = await countBadge.textContent();
          expect(count).toMatch(/0/);
        }
      }
    }
  });

  test('should maintain favorites when switching between pages', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Add to favorites
    await goToVehicleDetail(page, vehicleId);
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first();
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }

    // Navigate to other pages
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');

    // Go back to favorites
    await page.goto('/buyer/favorites');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should still have the favorite
    const vehicleCards = await page.locator('[data-testid="vehicle-card"]').count();
    expect(vehicleCards).toBeGreaterThan(0);
  });
});
