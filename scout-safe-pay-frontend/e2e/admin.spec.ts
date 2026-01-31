import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await login(page, 'admin@test.com', 'admin123');
  });

  test('admin can moderate reviews', async ({ page }) => {
    // Navigate to /admin/reviews
    await page.goto('/admin/reviews');

    // Assert pending reviews display
    await expect(page.locator('[data-testid="pending-reviews"]')).toBeVisible();

    // Get first pending review
    const firstReview = page.locator('[data-testid="review-item"]').first();
    await expect(firstReview).toBeVisible();

    // Click verify on review
    await firstReview.locator('button:has-text("Approve")').click();

    // Assert review approved
    await expect(page.locator('text=/review approved successfully/i')).toBeVisible();

    // Navigate to approved reviews tab
    await page.click('button:has-text("Approved")');

    // Assert verified badge shows on the review
    await expect(page.locator('[data-testid="verified-badge"]').first()).toBeVisible();
  });

  test('admin can view flagged reviews', async ({ page }) => {
    await page.goto('/admin/reviews');

    // Click flagged tab
    await page.click('button:has-text("Flagged")');

    // Assert flagged reviews visible
    await expect(page.locator('[data-testid="flagged-reviews"]')).toBeVisible();

    // Assert flag count displayed
    const flaggedReview = page.locator('[data-testid="review-item"]').first();
    await expect(flaggedReview.locator('[data-testid="flag-count"]')).toBeVisible();
  });

  test('admin can reject inappropriate reviews', async ({ page }) => {
    await page.goto('/admin/reviews');

    // Find review to reject
    const firstReview = page.locator('[data-testid="review-item"]').first();

    // Click reject button
    await firstReview.locator('button:has-text("Reject")').click();

    // Assert confirmation modal
    await expect(page.locator('[data-testid="confirm-modal"]')).toBeVisible();

    // Enter rejection reason
    await page.fill('textarea[name="moderation_notes"]', 'Contains inappropriate content');

    // Confirm rejection
    await page.click('button:has-text("Confirm Reject")');

    // Assert success message
    await expect(page.locator('text=/review rejected/i')).toBeVisible();
  });

  test('admin can view review statistics', async ({ page }) => {
    await page.goto('/admin/reviews');

    // Assert statistics cards visible
    await expect(page.locator('[data-testid="stats-pending"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-approved"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-rejected"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-flagged"]')).toBeVisible();

    // Assert statistics have numeric values
    const pendingCount = await page.locator('[data-testid="stats-pending"]').textContent();
    expect(pendingCount).toMatch(/\d+/);
  });

  test('admin can bulk approve reviews', async ({ page }) => {
    await page.goto('/admin/reviews');

    // Select multiple reviews
    await page.click('[data-testid="review-checkbox"]:nth-of-type(1)');
    await page.click('[data-testid="review-checkbox"]:nth-of-type(2)');
    await page.click('[data-testid="review-checkbox"]:nth-of-type(3)');

    // Click bulk approve
    await page.click('button:has-text("Bulk Approve")');

    // Confirm action
    await page.click('button:has-text("Confirm")');

    // Assert success message
    await expect(page.locator('text=/reviews approved/i')).toBeVisible();
  });

  test('admin can dismiss review flags', async ({ page }) => {
    await page.goto('/admin/reviews');

    // Go to flagged tab
    await page.click('button:has-text("Flagged")');

    // Click on flagged review
    const flaggedReview = page.locator('[data-testid="review-item"]').first();
    await flaggedReview.click();

    // Assert flag details visible
    await expect(page.locator('[data-testid="flag-details"]')).toBeVisible();

    // Dismiss flags
    await page.click('button:has-text("Dismiss Flags")');

    // Confirm dismissal
    await page.click('button:has-text("Confirm")');

    // Assert success
    await expect(page.locator('text=/flags dismissed/i')).toBeVisible();
  });

  test('non-admin cannot access admin panel', async ({ page }) => {
    // Logout and login as regular user
    await page.goto('/logout');
    await login(page, 'buyer@test.com', 'password123');

    // Try to access admin panel
    await page.goto('/admin/reviews');

    // Assert access denied or redirect
    await expect(page).not.toHaveURL('/admin/reviews');
    await expect(page.locator('text=/access denied|unauthorized/i')).toBeVisible();
  });
});
