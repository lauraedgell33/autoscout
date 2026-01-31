import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Transactions', () => {
  test('complete purchase flow', async ({ page }) => {
    // Login as buyer
    await login(page, 'buyer@test.com', 'password123');

    // Navigate to vehicle
    await page.goto('/vehicle/1');

    // Click "Buy Now"
    await page.click('button:has-text("Buy Now")');

    // Assert transaction form modal opens
    await expect(page.locator('[data-testid="transaction-modal"]')).toBeVisible();

    // Fill transaction form
    await page.fill('input[name="full_name"]', 'Test Buyer');
    await page.fill('input[name="phone"]', '+40123456789');
    await page.fill('input[name="address"]', '123 Test Street');
    await page.selectOption('select[name="payment_method"]', 'bank_transfer');

    // Submit
    await page.click('button[type="submit"]:has-text("Confirm Purchase")');

    // Assert redirect to transaction page
    await expect(page).toHaveURL(/\/transaction\/\d+/);

    // Assert payment instructions visible
    await expect(page.locator('text=/payment instructions/i')).toBeVisible();

    // Upload payment proof
    await page.setInputFiles('input[type="file"]', 'test-files/payment-proof.pdf');

    // Submit upload
    await page.click('button:has-text("Upload Proof")');

    // Assert proof uploaded
    await expect(page.locator('text=/proof uploaded successfully/i')).toBeVisible();
    await expect(page.locator('[data-testid="payment-proof-status"]')).toContainText('Uploaded');
  });

  test('view transaction history', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');

    // Navigate to transactions page
    await page.goto('/buyer/transactions');

    // Assert transactions list loads
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();

    // Assert transaction cards present
    const transactionCards = page.locator('[data-testid="transaction-card"]');
    expect(await transactionCards.count()).toBeGreaterThan(0);
  });

  test('transaction status tracking works', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');

    // Navigate to specific transaction
    await page.goto('/transaction/1');

    // Assert status tracker visible
    await expect(page.locator('[data-testid="status-tracker"]')).toBeVisible();

    // Assert current status highlighted
    await expect(page.locator('[data-testid="current-status"]')).toBeVisible();
  });

  test('seller can view incoming transactions', async ({ page }) => {
    await login(page, 'seller@test.com', 'password123');

    // Navigate to seller transactions
    await page.goto('/seller/transactions');

    // Assert incoming transactions visible
    await expect(page.locator('[data-testid="transaction-list"]')).toBeVisible();
  });

  test('cannot access other users transactions', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');

    // Try to access another user's transaction
    await page.goto('/transaction/9999');

    // Assert access denied or redirected
    await expect(page.locator('text=/access denied|not found/i')).toBeVisible();
  });

  test('transaction details display correctly', async ({ page }) => {
    await login(page, 'buyer@test.com', 'password123');
    await page.goto('/transaction/1');

    // Assert all transaction details present
    await expect(page.locator('[data-testid="transaction-amount"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-vehicle"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-seller"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-date"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-reference"]')).toBeVisible();
  });
});
