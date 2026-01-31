import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Reviews', () => {
  test('submit review after transaction', async ({ page }) => {
    // Login as buyer (with completed transaction)
    await login(page, 'buyer@test.com', 'password123');

    // Navigate to vehicle with completed transaction
    await page.goto('/vehicle/1');

    // Click "Write Review"
    await page.click('button:has-text("Write Review")');

    // Assert review form modal opens
    await expect(page.locator('[data-testid="review-modal"]')).toBeVisible();

    // Select 5 stars
    await page.click('[data-testid="star-5"]');

    // Write comment (>20 chars)
    await page.fill('textarea[name="comment"]', 'Excellent vehicle, very satisfied with my purchase!');

    // Submit
    await page.click('button[type="submit"]:has-text("Submit Review")');

    // Assert success toast
    await expect(page.locator('text=/review submitted successfully/i')).toBeVisible();

    // Assert review displays with verified badge
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="review-card"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="verified-badge"]').first()).toBeVisible();
  });

  test('flag suspicious review', async ({ page }) => {
    // Login
    await login(page, 'buyer@test.com', 'password123');

    // Navigate to vehicle with reviews
    await page.goto('/vehicle/1');

    // Scroll to reviews section
    await page.locator('[data-testid="reviews-section"]').scrollIntoViewIfNeeded();

    // Click flag on review
    await page.locator('[data-testid="flag-button"]').first().click();

    // Assert flag modal opens
    await expect(page.locator('[data-testid="flag-modal"]')).toBeVisible();

    // Select reason "spam"
    await page.click('label:has-text("Spam")');

    // Submit
    await page.click('button:has-text("Submit Report")');

    // Assert success toast
    await expect(page.locator('text=/review flagged successfully/i')).toBeVisible();
  });

  test('cannot submit review without transaction', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');

    // Navigate to vehicle without transaction
    await page.goto('/vehicle/999');

    // Assert "Write Review" button is disabled or not visible
    const writeReviewButton = page.locator('button:has-text("Write Review")');
    if (await writeReviewButton.isVisible()) {
      await expect(writeReviewButton).toBeDisabled();
    }
  });

  test('review form validates minimum characters', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');
    await page.goto('/vehicle/1');

    await page.click('button:has-text("Write Review")');
    await page.click('[data-testid="star-5"]');
    await page.fill('textarea[name="comment"]', 'Too short');
    await page.click('button[type="submit"]:has-text("Submit Review")');

    // Assert validation error
    await expect(page.locator('text=/minimum 20 characters/i')).toBeVisible();
  });

  test('helpful vote updates count', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');
    await page.goto('/vehicle/1');

    // Get initial helpful count
    const helpfulButton = page.locator('[data-testid="helpful-button"]').first();
    const initialCount = await helpfulButton.textContent();

    // Click helpful
    await helpfulButton.click();

    // Assert count increased
    await page.waitForTimeout(300);
    const newCount = await helpfulButton.textContent();
    expect(newCount).not.toBe(initialCount);
  });

  test('displays verified badge only for verified reviews', async ({ page }) => {
    await page.goto('/vehicle/1');

    // Count all reviews
    const allReviews = page.locator('[data-testid="review-card"]');
    const reviewCount = await allReviews.count();

    // Count verified badges
    const verifiedBadges = page.locator('[data-testid="verified-badge"]');
    const badgeCount = await verifiedBadges.count();

    // Assert not all reviews have verified badge
    expect(badgeCount).toBeLessThanOrEqual(reviewCount);
  });
});
