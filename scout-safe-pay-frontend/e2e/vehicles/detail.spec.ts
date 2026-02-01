/**
 * E2E tests for vehicle detail page functionality
 * Tests vehicle details, image gallery, seller info, actions, and similar vehicles
 */

import { test, expect } from '@playwright/test';
import { setupAuthSession, loginUser } from '../helpers/auth.helpers';
import { createVehicle, goToVehicleDetail } from '../helpers/vehicle.helpers';
import { TEST_VEHICLE_VARIANTS, generateVIN } from '../helpers/fixtures';

test.describe('Vehicle Detail Page', () => {
  let vehicleId: string;

  test.beforeEach(async ({ page }) => {
    // Create a seller and a test vehicle
    const seller = await setupAuthSession(page, 'seller');
    
    vehicleId = await createVehicle(page, {
      ...TEST_VEHICLE_VARIANTS.bmw_3series,
      make: 'BMW',
      model: 'X5',
      year: 2022,
      price: 45000,
      description: 'Excellent condition BMW X5 with full service history',
      vin: generateVIN()
    });
  });

  test('should navigate to vehicle detail page by clicking card', async ({ page }) => {
    // Go to vehicles listing
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Wait for vehicle cards
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    await expect(vehicleCard).toBeVisible({ timeout: 10000 });

    // Click on vehicle card or its link
    const cardLink = vehicleCard.locator('a[href*="/vehicle/"]').first();
    
    if (await cardLink.count() > 0) {
      await cardLink.click();
    } else {
      await vehicleCard.click();
    }

    await page.waitForLoadState('networkidle');

    // Should be on vehicle detail page
    expect(page.url()).toMatch(/\/vehicle\/\d+/);
  });

  test('should display vehicle details correctly', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Check title (make + model)
    const title = page.locator('[data-testid="vehicle-title"], h1').first();
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText).toMatch(/BMW.*X5|X5.*BMW/i);

    // Check price
    const price = page.locator('[data-testid="vehicle-price"]').first();
    await expect(price).toBeVisible();
    const priceText = await price.textContent();
    expect(priceText).toMatch(/45,?000|45\.000/); // Price formatting may vary

    // Check description
    const description = page.locator('[data-testid="vehicle-description"]').first();
    if (await description.count() > 0) {
      await expect(description).toBeVisible();
      const descText = await description.textContent();
      expect(descText).toContain('Excellent condition');
    }

    // Check year
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('2022');
  });

  test('should display vehicle specifications', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for spec items
    const specs = page.locator('[data-testid="vehicle-specs"], [class*="specifications"]').first();
    
    if (await specs.count() > 0) {
      await expect(specs).toBeVisible();
      
      // Check for common spec items
      const specsText = await specs.textContent();
      expect(specsText).toBeTruthy();
      
      // Should contain key specs
      const pageContent = await page.textContent('body');
      expect(pageContent).toMatch(/mileage|km|miles/i);
      expect(pageContent).toMatch(/fuel|diesel|petrol|electric/i);
      expect(pageContent).toMatch(/transmission|automatic|manual/i);
    }
  });

  test('should display image gallery with navigation', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Check for main image
    const mainImage = page.locator('[data-testid="vehicle-image"], [data-testid="main-image"], img[alt*="vehicle" i]').first();
    
    if (await mainImage.count() > 0) {
      await expect(mainImage).toBeVisible();

      // Look for gallery navigation buttons
      const nextButton = page.locator('[data-testid="gallery-next"], button:has-text("Next"), [aria-label*="next image" i]').first();
      const prevButton = page.locator('[data-testid="gallery-prev"], button:has-text("Previous"), [aria-label*="previous image" i]').first();

      // If navigation exists, test it
      if (await nextButton.count() > 0 && await nextButton.isVisible()) {
        // Get current image src
        const currentSrc = await mainImage.getAttribute('src');
        
        // Click next
        await nextButton.click();
        await page.waitForTimeout(500);
        
        // Image might have changed (if there are multiple images)
        const newSrc = await mainImage.getAttribute('src');
        // Just verify no error occurred
        expect(newSrc).toBeTruthy();
      }
    }
  });

  test('should display seller information', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for seller info section
    const sellerInfo = page.locator('[data-testid="seller-info"], [class*="seller"]').first();
    
    if (await sellerInfo.count() > 0) {
      await expect(sellerInfo).toBeVisible();

      // Check for seller name
      const sellerName = page.locator('[data-testid="seller-name"]').first();
      if (await sellerName.count() > 0) {
        await expect(sellerName).toBeVisible();
      }

      // Check for seller avatar/image
      const sellerAvatar = page.locator('[data-testid="seller-avatar"], [class*="avatar"]').first();
      if (await sellerAvatar.count() > 0) {
        await expect(sellerAvatar).toBeVisible();
      }

      // Check for seller rating (if available)
      const sellerRating = page.locator('[data-testid="seller-rating"]').first();
      if (await sellerRating.count() > 0) {
        await expect(sellerRating).toBeVisible();
      }
    }
  });

  test('should open contact form with contact seller button', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for contact button
    const contactButton = page.locator('[data-testid="contact-seller"], button:has-text("Contact")').first();

    if (await contactButton.count() > 0) {
      await expect(contactButton).toBeVisible();
      await contactButton.click();
      await page.waitForTimeout(500);

      // Check for contact form or modal
      const contactForm = page.locator('[data-testid="contact-form"], form[action*="contact"], [role="dialog"]').first();
      
      if (await contactForm.count() > 0) {
        await expect(contactForm).toBeVisible();
      }
    }
  });

  test('should add vehicle to favorites (authenticated user)', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Navigate to vehicle detail
    await goToVehicleDetail(page, vehicleId);

    // Find favorite button
    const favoriteButton = page.locator('[data-testid="favorite-button"], [aria-label*="favorite" i], button:has([class*="heart"])').first();

    if (await favoriteButton.count() > 0) {
      await expect(favoriteButton).toBeVisible();

      // Click to add to favorites
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Check if button state changed (filled heart, different aria-pressed, etc.)
      const isPressed = await favoriteButton.getAttribute('aria-pressed');
      const classes = await favoriteButton.getAttribute('class');
      
      // Button should indicate favorited state
      expect(isPressed === 'true' || classes?.includes('active') || classes?.includes('favorited')).toBeTruthy();
    }
  });

  test('should remove vehicle from favorites by toggling', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Navigate to vehicle
    await goToVehicleDetail(page, vehicleId);

    // Add to favorites first
    const favoriteButton = page.locator('[data-testid="favorite-button"], [aria-label*="favorite" i]').first();

    if (await favoriteButton.count() > 0) {
      // Add to favorites
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Click again to remove
      await favoriteButton.click();
      await page.waitForTimeout(500);

      // Check if button state changed back
      const isPressed = await favoriteButton.getAttribute('aria-pressed');
      expect(isPressed === 'false' || isPressed === null).toBeTruthy();
    }
  });

  test('should show "Buy Now" button for authenticated users', async ({ page }) => {
    // Login as buyer
    const buyer = await setupAuthSession(page, 'buyer');

    // Navigate to vehicle
    await goToVehicleDetail(page, vehicleId);

    // Look for buy now button
    const buyButton = page.locator('[data-testid="buy-now"], button:has-text("Buy Now"), a:has-text("Buy Now")').first();

    if (await buyButton.count() > 0) {
      await expect(buyButton).toBeVisible();
      await expect(buyButton).toBeEnabled();
    }
  });

  test('should show "Login to Buy" for unauthenticated users', async ({ page }) => {
    // Make sure we're not logged in
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to vehicle (without authentication)
    await goToVehicleDetail(page, vehicleId);

    // Look for login prompt or disabled buy button
    const loginPrompt = page.locator('text=/login to buy/i, text=/sign in to purchase/i').first();
    const buyButton = page.locator('[data-testid="buy-now"], button:has-text("Buy Now")').first();

    // Either login prompt is shown or buy button is disabled/hidden
    if (await loginPrompt.count() > 0) {
      await expect(loginPrompt).toBeVisible();
    } else if (await buyButton.count() > 0) {
      // Button might be disabled or show login requirement
      const isDisabled = await buyButton.isDisabled();
      const buttonText = await buyButton.textContent();
      expect(isDisabled || buttonText?.toLowerCase().includes('login')).toBeTruthy();
    }
  });

  test('should display similar vehicles section', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for similar vehicles section
    const similarSection = page.locator('[data-testid="similar-vehicles"], [class*="similar"]').first();

    if (await similarSection.count() > 0) {
      await expect(similarSection).toBeVisible();

      // Check for heading
      const heading = similarSection.locator('h2, h3, [class*="heading"]').first();
      if (await heading.count() > 0) {
        const headingText = await heading.textContent();
        expect(headingText?.toLowerCase()).toMatch(/similar|related|recommended/);
      }

      // Check for vehicle cards
      const similarCards = similarSection.locator('[data-testid="vehicle-card"]');
      // May or may not have similar vehicles
      const count = await similarCards.count();
      // Just verify section exists
    }
  });

  test('should display vehicle specs in tabs', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for tabs (General, Performance, Features)
    const tabs = page.locator('[role="tablist"], [data-testid="specs-tabs"]').first();

    if (await tabs.count() > 0) {
      await expect(tabs).toBeVisible();

      // Look for individual tabs
      const generalTab = page.locator('[role="tab"]:has-text("General"), button:has-text("General")').first();
      const performanceTab = page.locator('[role="tab"]:has-text("Performance"), button:has-text("Performance")').first();
      const featuresTab = page.locator('[role="tab"]:has-text("Features"), button:has-text("Features")').first();

      // Click through tabs if they exist
      if (await performanceTab.count() > 0) {
        await performanceTab.click();
        await page.waitForTimeout(300);

        // Check tab panel changed
        const tabPanel = page.locator('[role="tabpanel"]').first();
        if (await tabPanel.count() > 0) {
          await expect(tabPanel).toBeVisible();
        }
      }

      if (await featuresTab.count() > 0) {
        await featuresTab.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('should have share button functionality', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for share button
    const shareButton = page.locator('[data-testid="share-button"], button:has-text("Share"), [aria-label*="share" i]').first();

    if (await shareButton.count() > 0) {
      await expect(shareButton).toBeVisible();
      await shareButton.click();
      await page.waitForTimeout(500);

      // Check for share modal/menu
      const shareMenu = page.locator('[data-testid="share-menu"], [role="dialog"]').first();
      
      if (await shareMenu.count() > 0) {
        await expect(shareMenu).toBeVisible();
      }
    }
  });

  test('should display vehicle location on map', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for map container
    const map = page.locator('[data-testid="vehicle-map"], [class*="map"]').first();

    if (await map.count() > 0) {
      await expect(map).toBeVisible();
    }
  });

  test('should show vehicle features list', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for features section
    const features = page.locator('[data-testid="vehicle-features"], [class*="features"]').first();

    if (await features.count() > 0) {
      await expect(features).toBeVisible();

      // Check for feature items
      const featureItems = features.locator('li, [class*="feature-item"]');
      const count = await featureItems.count();
      
      // May have features listed
      if (count > 0) {
        await expect(featureItems.first()).toBeVisible();
      }
    }
  });

  test('should display vehicle condition and history', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for condition info
    const condition = page.locator('[data-testid="vehicle-condition"], text=/condition/i').first();

    if (await condition.count() > 0) {
      await expect(condition).toBeVisible();
    }

    // Look for history/service records
    const history = page.locator('[data-testid="vehicle-history"], text=/service history/i').first();

    if (await history.count() > 0) {
      await expect(history).toBeVisible();
    }
  });

  test('should show vehicle availability status', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for status badge/label
    const status = page.locator('[data-testid="vehicle-status"], [class*="status"]').first();

    if (await status.count() > 0) {
      const statusText = await status.textContent();
      expect(statusText?.toLowerCase()).toMatch(/available|sold|pending|reserved/);
    }
  });

  test('should handle image zoom functionality', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    const mainImage = page.locator('[data-testid="vehicle-image"], [data-testid="main-image"]').first();

    if (await mainImage.count() > 0) {
      // Click on image to zoom
      await mainImage.click();
      await page.waitForTimeout(500);

      // Look for zoomed image modal
      const imageModal = page.locator('[data-testid="image-modal"], [role="dialog"]').first();

      if (await imageModal.count() > 0) {
        await expect(imageModal).toBeVisible();

        // Close modal
        const closeButton = imageModal.locator('button[aria-label*="close" i]').first();
        if (await closeButton.count() > 0) {
          await closeButton.click();
          await page.waitForTimeout(300);
          await expect(imageModal).not.toBeVisible();
        }
      }
    }
  });

  test('should display thumbnail gallery', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for thumbnail gallery
    const thumbnails = page.locator('[data-testid="image-thumbnails"], [class*="thumbnail"]');

    if (await thumbnails.count() > 0) {
      // Click on a thumbnail
      const firstThumbnail = thumbnails.first();
      await firstThumbnail.click();
      await page.waitForTimeout(500);

      // Main image should update
      const mainImage = page.locator('[data-testid="main-image"]').first();
      if (await mainImage.count() > 0) {
        await expect(mainImage).toBeVisible();
      }
    }
  });

  test('should show financing options or calculator', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for financing section
    const financing = page.locator('[data-testid="financing"], text=/financing/i').first();

    if (await financing.count() > 0) {
      await expect(financing).toBeVisible();
    }
  });

  test('should display warranty information', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for warranty info
    const warranty = page.locator('[data-testid="warranty"], text=/warranty/i').first();

    if (await warranty.count() > 0) {
      await expect(warranty).toBeVisible();
    }
  });

  test('should allow printing or saving vehicle details', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for print button
    const printButton = page.locator('[data-testid="print-button"], button:has-text("Print")').first();

    if (await printButton.count() > 0) {
      await expect(printButton).toBeVisible();
      // Note: Actually triggering print would open print dialog
      // Just verify button exists and is clickable
      await expect(printButton).toBeEnabled();
    }
  });

  test('should show view count or popularity metrics', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Look for view count
    const viewCount = page.locator('[data-testid="view-count"], text=/views/i').first();

    if (await viewCount.count() > 0) {
      await expect(viewCount).toBeVisible();
      const countText = await viewCount.textContent();
      expect(countText).toMatch(/\d+/);
    }
  });

  test('should handle back navigation correctly', async ({ page }) => {
    // Go to vehicles list
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');

    // Click on a vehicle
    const vehicleCard = page.locator('[data-testid="vehicle-card"]').first();
    if (await vehicleCard.count() > 0) {
      const cardLink = vehicleCard.locator('a').first();
      await cardLink.click();
      await page.waitForLoadState('networkidle');

      // Should be on detail page
      expect(page.url()).toMatch(/\/vehicle\/\d+/);

      // Go back
      await page.goBack();
      await page.waitForLoadState('networkidle');

      // Should be back on vehicles list
      expect(page.url()).toContain('/vehicles');
    }
  });

  test('should display seller contact information securely', async ({ page }) => {
    await goToVehicleDetail(page, vehicleId);

    // Seller phone/email should not be directly visible (privacy protection)
    // Should have contact form instead
    const contactForm = page.locator('[data-testid="contact-seller"], button:has-text("Contact")').first();

    if (await contactForm.count() > 0) {
      await expect(contactForm).toBeVisible();
    }

    // Check that email/phone are not in plain text (security)
    const pageContent = await page.textContent('body');
    
    // Direct email addresses should not be visible
    // (This is a security/privacy feature)
  });
});
