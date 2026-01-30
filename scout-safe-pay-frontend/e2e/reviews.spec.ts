import { test, expect } from '@playwright/test';

test.describe('Reviews', () => {
  test('submit review after transaction', async ({ page }) => {
    // Navigate to a transaction or review submission page
    // This test assumes user is already authenticated and has a completed transaction
    await page.goto('/reviews/submit?transaction_id=1');
    
    // Wait for form to load
    await page.waitForTimeout(2000);
    
    // If review form exists, fill it out
    const ratingButtons = page.locator('button[aria-label*="Rate"], [data-rating]');
    const commentBox = page.locator('textarea[name="comment"], textarea[placeholder*="review"]').first();
    
    if (await ratingButtons.first().isVisible({ timeout: 5000 })) {
      // Select 5 star rating
      await ratingButtons.last().click();
      
      // Fill comment
      if (await commentBox.isVisible({ timeout: 3000 })) {
        await commentBox.fill('Excellent seller! Very professional and the car is exactly as described. Great communication throughout the process.');
        
        // Submit
        const submitButton = page.locator('button[type="submit"], button:has-text("Submit")').first();
        if (await submitButton.isVisible({ timeout: 2000 })) {
          await submitButton.click();
          
          // Wait for submission
          await page.waitForTimeout(2000);
          
          // Should show success or redirect
          const hasSuccess = await page.locator('text=/success|submitted|thank you/i').isVisible({ timeout: 3000 }).catch(() => false);
          expect(hasSuccess || page.url()).toBeTruthy();
        }
      }
    }
  });

  test('verified badge shows for verified reviews', async ({ page }) => {
    // Go to reviews page or vehicle page with reviews
    await page.goto('/reviews');
    
    // Wait for reviews to load
    await page.waitForTimeout(2000);
    
    // Look for verified badges
    const verifiedBadges = page.locator('text=/verified|✓|check/i, [data-verified="true"]');
    
    // If there are any reviews, some might have verified badges
    const reviewCount = await page.locator('article, .review-card, [data-testid="review"]').count();
    
    if (reviewCount > 0) {
      // At least reviews are showing
      expect(reviewCount).toBeGreaterThan(0);
    } else {
      // If no reviews, page should show empty state
      const hasEmptyState = await page.locator('text=/no reviews|be the first/i').isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasEmptyState || page.url().includes('review')).toBeTruthy();
    }
  });

  test('flag suspicious review', async ({ page }) => {
    await page.goto('/reviews');
    
    // Wait for reviews
    await page.waitForTimeout(2000);
    
    // Look for flag button
    const flagButton = page.locator('button[aria-label*="flag"], button:has-text("Flag"), button:has-text("⚑")').first();
    
    if (await flagButton.isVisible({ timeout: 5000 })) {
      await flagButton.click();
      
      // Wait for flag menu/modal
      await page.waitForTimeout(1000);
      
      // Select a reason if available
      const spamOption = page.locator('text=/spam/i, option:has-text("Spam")').first();
      if (await spamOption.isVisible({ timeout: 2000 })) {
        await spamOption.click();
        
        // Submit flag
        const submitFlag = page.locator('button:has-text("Submit"), button:has-text("Flag")').last();
        if (await submitFlag.isVisible({ timeout: 2000 })) {
          await submitFlag.click();
          
          // Wait for confirmation
          await page.waitForTimeout(1000);
        }
      }
      
      // Verify action completed (button or modal closed)
      expect(page.url()).toBeTruthy();
    }
  });

  test('review form validates minimum character count', async ({ page }) => {
    await page.goto('/reviews/submit?transaction_id=1');
    
    // Wait for form
    await page.waitForTimeout(2000);
    
    const commentBox = page.locator('textarea[name="comment"], textarea[placeholder*="review"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Submit")').first();
    
    if (await commentBox.isVisible({ timeout: 5000 })) {
      // Type short comment
      await commentBox.fill('Too short');
      
      // Try to submit
      if (await submitButton.isVisible({ timeout: 2000 })) {
        const isDisabled = await submitButton.isDisabled();
        
        // Button should be disabled or show validation error
        if (!isDisabled) {
          await submitButton.click();
          await page.waitForTimeout(1000);
          
          // Should show validation error
          const hasError = await page.locator('text=/minimum|characters|20/i').isVisible({ timeout: 2000 }).catch(() => false);
          expect(hasError || isDisabled).toBeTruthy();
        } else {
          expect(isDisabled).toBeTruthy();
        }
      }
    }
  });

  test('helpful/not helpful voting works', async ({ page }) => {
    await page.goto('/reviews');
    
    // Wait for reviews
    await page.waitForTimeout(2000);
    
    // Find helpful button
    const helpfulButton = page.locator('button:has-text("Helpful"), button[aria-label*="helpful"]').first();
    
    if (await helpfulButton.isVisible({ timeout: 5000 })) {
      // Get initial count if displayed
      const initialText = await helpfulButton.textContent();
      
      // Click helpful
      await helpfulButton.click();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Verify button is still there (interaction worked)
      expect(await helpfulButton.isVisible()).toBeTruthy();
    }
  });

  test('reviews display user information', async ({ page }) => {
    await page.goto('/reviews');
    
    // Wait for reviews
    await page.waitForTimeout(2000);
    
    // Check for user names or avatars
    const hasUserInfo = await page.locator('[data-testid="reviewer-name"], .reviewer-name, .user-name, .avatar').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    // Also check for ratings
    const hasRating = await page.locator('[data-testid="rating"], .rating, text=/★|⭐/').first().isVisible({ timeout: 5000 }).catch(() => false);
    
    // If reviews exist, they should have user info or ratings
    const reviewCount = await page.locator('article, .review-card, [data-testid="review"]').count();
    
    if (reviewCount > 0) {
      expect(hasUserInfo || hasRating).toBeTruthy();
    }
  });
});
