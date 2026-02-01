/**
 * Transaction helper functions for E2E tests
 */

import { Page } from '@playwright/test';
import { TEST_TRANSACTION } from './fixtures';

export interface TransactionData {
  full_name?: string;
  phone?: string;
  address?: string;
  payment_method?: string;
  terms_accepted?: boolean;
}

export interface DisputeData {
  reason: string;
  description: string;
  images?: string[];
}

/**
 * Create a transaction (initiate purchase)
 */
export async function createTransaction(
  page: Page,
  vehicleId: string,
  transactionData: Partial<TransactionData> = {}
): Promise<string> {
  const data = { ...TEST_TRANSACTION, ...transactionData };

  // Navigate to vehicle and click buy now
  await page.goto(`/vehicle/${vehicleId}`);
  await page.waitForLoadState('networkidle');

  const buyNowButton = page.locator('button:has-text("Buy Now")');
  if (await buyNowButton.count() > 0) {
    await buyNowButton.click();
    await page.waitForLoadState('networkidle');
  }

  // Fill transaction form
  if (data.full_name) {
    const nameInput = page.locator('input[name="full_name"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill(data.full_name);
    }
  }

  if (data.phone) {
    const phoneInput = page.locator('input[name="phone"]');
    if (await phoneInput.count() > 0) {
      await phoneInput.fill(data.phone);
    }
  }

  if (data.address) {
    const addressInput = page.locator('input[name="address"], textarea[name="address"]');
    if (await addressInput.count() > 0) {
      await addressInput.fill(data.address);
    }
  }

  if (data.payment_method) {
    const paymentMethodSelect = page.locator('select[name="payment_method"]');
    if (await paymentMethodSelect.count() > 0) {
      await paymentMethodSelect.selectOption(data.payment_method);
    }
  }

  // Accept terms and conditions
  const termsCheckbox = page.locator('input[type="checkbox"][name="terms"], input[type="checkbox"][id*="terms"]');
  if (await termsCheckbox.count() > 0) {
    await termsCheckbox.check();
  }

  // Submit transaction
  const submitButton = page.locator('button[type="submit"]:has-text("Confirm"), button:has-text("Complete Purchase")');
  if (await submitButton.count() > 0) {
    await submitButton.click();
  }

  await page.waitForLoadState('networkidle');

  // Extract transaction ID from URL
  const url = page.url();
  const match = url.match(/\/transaction[s]?\/(\d+)/);
  return match ? match[1] : '';
}

/**
 * Upload payment proof for a transaction
 */
export async function uploadPaymentProof(
  page: Page,
  transactionId: string,
  filePath: string
): Promise<void> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  // Look for upload button
  const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Payment Proof")');
  if (await uploadButton.count() > 0) {
    await uploadButton.click();
    await page.waitForTimeout(300);
  }

  // Upload file
  const fileInput = page.locator('input[type="file"]');
  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles(filePath);
    await page.waitForTimeout(1000);
  }

  // Submit upload
  const submitButton = page.locator('button[type="submit"]:has-text("Submit"), button:has-text("Upload")');
  if (await submitButton.count() > 0) {
    await submitButton.click();
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Admin verifies payment
 */
export async function verifyPayment(
  page: Page,
  transactionId: string,
  approve: boolean = true
): Promise<void> {
  await page.goto(`/admin/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  if (approve) {
    const approveButton = page.locator('button:has-text("Approve"), button:has-text("Verify")');
    if (await approveButton.count() > 0) {
      await approveButton.click();
    }
  } else {
    const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Decline")');
    if (await rejectButton.count() > 0) {
      await rejectButton.click();
      
      // Fill rejection reason
      const reasonTextarea = page.locator('textarea[name="rejection_reason"]');
      if (await reasonTextarea.count() > 0) {
        await reasonTextarea.fill('Payment proof is not clear or invalid');
      }
      
      // Confirm rejection
      const confirmButton = page.locator('button[type="submit"]:has-text("Confirm")');
      if (await confirmButton.count() > 0) {
        await confirmButton.click();
      }
    }
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Approve inspection (buyer confirms vehicle)
 */
export async function approveInspection(
  page: Page,
  transactionId: string
): Promise<void> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  const approveButton = page.locator('button:has-text("Approve"), button:has-text("Confirm Receipt")');
  if (await approveButton.count() > 0) {
    await approveButton.click();
    
    // Confirm approval
    const confirmButton = page.locator('button:has-text("Yes"), button:has-text("Confirm")');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Reject inspection and open dispute
 */
export async function rejectInspection(
  page: Page,
  transactionId: string,
  reason: string = 'Vehicle not as described'
): Promise<void> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Dispute")');
  if (await rejectButton.count() > 0) {
    await rejectButton.click();
    
    // Fill reason
    const reasonTextarea = page.locator('textarea[name="reason"]');
    if (await reasonTextarea.count() > 0) {
      await reasonTextarea.fill(reason);
    }
    
    // Submit dispute
    const submitButton = page.locator('button[type="submit"]:has-text("Submit")');
    if (await submitButton.count() > 0) {
      await submitButton.click();
    }
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Open a dispute for a transaction
 */
export async function openDispute(
  page: Page,
  transactionId: string,
  disputeData: DisputeData
): Promise<void> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  // Click dispute button
  const disputeButton = page.locator('button:has-text("Open Dispute"), button:has-text("Dispute")');
  if (await disputeButton.count() > 0) {
    await disputeButton.click();
    await page.waitForTimeout(300);
  }

  // Select reason
  const reasonSelect = page.locator('select[name="reason"]');
  if (await reasonSelect.count() > 0) {
    await reasonSelect.selectOption(disputeData.reason);
  }

  // Fill description
  const descriptionTextarea = page.locator('textarea[name="description"]');
  if (await descriptionTextarea.count() > 0) {
    await descriptionTextarea.fill(disputeData.description);
  }

  // Upload images if provided
  if (disputeData.images && disputeData.images.length > 0) {
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles(disputeData.images);
      await page.waitForTimeout(1000);
    }
  }

  // Submit dispute
  const submitButton = page.locator('button[type="submit"]:has-text("Submit")');
  if (await submitButton.count() > 0) {
    await submitButton.click();
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Resolve dispute (admin action)
 */
export async function resolveDispute(
  page: Page,
  transactionId: string,
  resolution: 'refund_buyer' | 'release_to_seller',
  notes?: string
): Promise<void> {
  await page.goto(`/admin/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  // Select resolution
  const resolutionSelect = page.locator('select[name="resolution"]');
  if (await resolutionSelect.count() > 0) {
    await resolutionSelect.selectOption(resolution);
  }

  // Add notes
  if (notes) {
    const notesTextarea = page.locator('textarea[name="notes"], textarea[name="admin_notes"]');
    if (await notesTextarea.count() > 0) {
      await notesTextarea.fill(notes);
    }
  }

  // Submit resolution
  const submitButton = page.locator('button[type="submit"]:has-text("Resolve")');
  if (await submitButton.count() > 0) {
    await submitButton.click();
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Cancel transaction
 */
export async function cancelTransaction(
  page: Page,
  transactionId: string,
  reason?: string
): Promise<void> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  const cancelButton = page.locator('button:has-text("Cancel")');
  if (await cancelButton.count() > 0) {
    await cancelButton.click();
    
    // Fill cancellation reason if required
    if (reason) {
      const reasonTextarea = page.locator('textarea[name="cancellation_reason"]');
      if (await reasonTextarea.count() > 0) {
        await reasonTextarea.fill(reason);
      }
    }
    
    // Confirm cancellation
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(page: Page, transactionId: string): Promise<string> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  const statusBadge = page.locator('[data-testid="transaction-status"]');
  if (await statusBadge.count() > 0) {
    return (await statusBadge.textContent())?.toLowerCase().trim() || '';
  }
  return '';
}

/**
 * Submit review after transaction completion
 */
export async function submitReview(
  page: Page,
  transactionId: string,
  rating: number,
  review: string
): Promise<void> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  // Look for review button
  const reviewButton = page.locator('button:has-text("Leave Review"), button:has-text("Write Review")');
  if (await reviewButton.count() > 0) {
    await reviewButton.click();
    await page.waitForTimeout(300);
  }

  // Select rating (click on stars)
  const stars = page.locator('[data-testid="star-rating"]');
  if (await stars.count() > 0) {
    await stars.nth(rating - 1).click();
  }

  // Write review
  const reviewTextarea = page.locator('textarea[name="review"], textarea[name="comment"]');
  if (await reviewTextarea.count() > 0) {
    await reviewTextarea.fill(review);
  }

  // Submit review
  const submitButton = page.locator('button[type="submit"]:has-text("Submit")');
  if (await submitButton.count() > 0) {
    await submitButton.click();
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Wait for transaction status change
 */
export async function waitForStatusChange(
  page: Page,
  transactionId: string,
  expectedStatus: string,
  timeout: number = 10000
): Promise<void> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const currentStatus = await getTransactionStatus(page, transactionId);
    if (currentStatus === expectedStatus.toLowerCase()) {
      return;
    }
    await page.waitForTimeout(1000);
    await page.reload();
  }
  
  throw new Error(`Transaction status did not change to ${expectedStatus} within ${timeout}ms`);
}

/**
 * Get transaction reference number
 */
export async function getTransactionReference(page: Page, transactionId: string): Promise<string> {
  await page.goto(`/transactions/${transactionId}`);
  await page.waitForLoadState('networkidle');

  const reference = page.locator('[data-testid="transaction-reference"]');
  if (await reference.count() > 0) {
    return (await reference.textContent())?.trim() || '';
  }
  return '';
}
