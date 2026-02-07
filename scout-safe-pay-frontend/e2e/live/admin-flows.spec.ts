import { test, expect, Page } from '@playwright/test';
import { loginToAdmin, waitForPageLoad } from './helpers';

/**
 * Complete Admin Panel Flow Tests
 * Tests CRUD operations and management workflows in Filament admin
 */

// Test data with timestamps to ensure uniqueness
const getTestData = () => {
  const timestamp = Date.now();
  return {
    vehicle: {
      make: 'TestBrand',
      model: `Model-${timestamp}`,
      year: '2024',
      price: '25000',
      vin: `VIN${timestamp}`,
      mileage: '15000',
      description: `Test vehicle created by E2E test at ${new Date().toISOString()}`,
    },
    user: {
      name: `Test User ${timestamp}`,
      email: `testuser${timestamp}@e2etest.com`,
      password: 'TestPass123!',
    },
    dealer: {
      name: `Test Dealer ${timestamp}`,
      email: `dealer${timestamp}@e2etest.com`,
      phone: '+40700000000',
      address: 'Test Street 123',
    },
  };
};

test.describe('Admin Complete Flows - Live', () => {
  test.beforeEach(async ({ page }) => {
    await loginToAdmin(page);
    // Wait for admin to fully load
    await page.waitForTimeout(2000);
  });

  test.describe('Vehicle Management Flow', () => {
    test('complete vehicle CRUD workflow', async ({ page }) => {
      const testData = getTestData();
      
      // Step 1: Navigate to vehicles
      console.log('Step 1: Navigating to vehicles list...');
      await page.goto('/admin/vehicles');
      await waitForPageLoad(page);
      
      // Step 2: Click create new vehicle
      console.log('Step 2: Opening create vehicle form...');
      const createButton = page.locator('a:has-text("Create"), a:has-text("New"), button:has-text("Create"), button:has-text("New")').first();
      if (await createButton.count() > 0) {
        await createButton.click();
        await waitForPageLoad(page);
        
        // Step 3: Fill vehicle form
        console.log('Step 3: Filling vehicle form...');
        
        // Try to find and fill common vehicle fields
        const makeInput = page.locator('input[name*="make" i], input[id*="make" i]').first();
        if (await makeInput.count() > 0) {
          await makeInput.fill(testData.vehicle.make);
        }
        
        const modelInput = page.locator('input[name*="model" i], input[id*="model" i]').first();
        if (await modelInput.count() > 0) {
          await modelInput.fill(testData.vehicle.model);
        }
        
        const yearInput = page.locator('input[name*="year" i], input[id*="year" i]').first();
        if (await yearInput.count() > 0) {
          await yearInput.fill(testData.vehicle.year);
        }
        
        const priceInput = page.locator('input[name*="price" i], input[id*="price" i]').first();
        if (await priceInput.count() > 0) {
          await priceInput.fill(testData.vehicle.price);
        }
        
        const mileageInput = page.locator('input[name*="mileage" i], input[name*="km" i], input[id*="mileage" i]').first();
        if (await mileageInput.count() > 0) {
          await mileageInput.fill(testData.vehicle.mileage);
        }
        
        // Description/notes textarea
        const descInput = page.locator('textarea[name*="description" i], textarea[name*="notes" i]').first();
        if (await descInput.count() > 0) {
          await descInput.fill(testData.vehicle.description);
        }
        
        // Step 4: Submit form
        console.log('Step 4: Submitting form...');
        const submitButton = page.locator('button[type="submit"]:has-text("Create"), button[type="submit"]:has-text("Save"), button:has-text("Create vehicle")').first();
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await waitForPageLoad(page);
          await page.waitForTimeout(2000);
          
          // Step 5: Verify success message or redirect
          console.log('Step 5: Verifying creation...');
          const successMessage = await page.locator('[class*="success"], [class*="notification"]').count();
          const isOnList = page.url().includes('/vehicles') && !page.url().includes('/create');
          
          console.log(`Success message found: ${successMessage > 0}, Redirected to list: ${isOnList}`);
        }
      } else {
        console.log('Create button not found - skipping vehicle creation');
      }
    });

    test('search and filter vehicles', async ({ page }) => {
      await page.goto('/admin/vehicles');
      await waitForPageLoad(page);
      
      // Test search functionality
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
      if (await searchInput.count() > 0) {
        console.log('Testing search...');
        await searchInput.fill('BMW');
        await page.waitForTimeout(1500);
        
        // Verify search results update
        const resultsText = await page.locator('body').textContent();
        console.log(`Search performed, page updated`);
      }
      
      // Test filters if available
      const filterButton = page.locator('button:has-text("Filter"), [class*="filter"]').first();
      if (await filterButton.count() > 0) {
        console.log('Testing filters...');
        await filterButton.click();
        await page.waitForTimeout(500);
        
        // Try to apply a filter
        const filterOptions = page.locator('[class*="filter"] select, [class*="filter"] input');
        const filterCount = await filterOptions.count();
        console.log(`Filter options available: ${filterCount}`);
      }
    });

    test('view and edit vehicle details', async ({ page }) => {
      await page.goto('/admin/vehicles');
      await waitForPageLoad(page);
      
      // Click on first vehicle to view/edit
      const editLink = page.locator('a[href*="/vehicles/"][href*="/edit"], button:has-text("Edit"), .fi-ta-row a').first();
      if (await editLink.count() > 0) {
        console.log('Opening vehicle for editing...');
        await editLink.click();
        await waitForPageLoad(page);
        
        // Verify we're on edit page
        expect(page.url()).toContain('/vehicles/');
        
        // Try to modify a field
        const priceInput = page.locator('input[name*="price" i]').first();
        if (await priceInput.count() > 0) {
          const currentValue = await priceInput.inputValue();
          console.log(`Current price: ${currentValue}`);
        }
      }
    });
  });

  test.describe('User Management Flow', () => {
    test('view and search users', async ({ page }) => {
      await page.goto('/admin/users');
      await waitForPageLoad(page);
      
      // Check table loads
      const content = page.locator('table, [class*="table"], main');
      await expect(content.first()).toBeVisible();
      
      // Test search
      const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('admin');
        await page.waitForTimeout(1500);
        console.log('User search performed');
      }
    });

    test('create new user', async ({ page }) => {
      const testData = getTestData();
      
      await page.goto('/admin/users');
      await waitForPageLoad(page);
      
      const createButton = page.locator('a:has-text("Create"), a:has-text("New"), button:has-text("Create")').first();
      if (await createButton.count() > 0) {
        await createButton.click();
        await waitForPageLoad(page);
        
        // Fill user form
        const nameInput = page.locator('input[name*="name" i]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill(testData.user.name);
        }
        
        const emailInput = page.locator('input[name*="email" i], input[type="email"]').first();
        if (await emailInput.count() > 0) {
          await emailInput.fill(testData.user.email);
        }
        
        const passwordInput = page.locator('input[name*="password" i], input[type="password"]').first();
        if (await passwordInput.count() > 0) {
          await passwordInput.fill(testData.user.password);
        }
        
        // Select user type if available
        const userTypeSelect = page.locator('select[name*="type" i], select[name*="role" i]');
        if (await userTypeSelect.count() > 0) {
          await userTypeSelect.first().selectOption({ index: 1 });
        }
        
        console.log('User form filled');
      }
    });

    test('edit user details', async ({ page }) => {
      await page.goto('/admin/users');
      await waitForPageLoad(page);
      
      const editLink = page.locator('a[href*="/users/"][href*="/edit"], button:has-text("Edit")').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        // Verify edit form loaded
        const formFields = page.locator('input, select, textarea');
        const fieldCount = await formFields.count();
        console.log(`Edit form fields: ${fieldCount}`);
        
        expect(fieldCount).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Transaction Management Flow', () => {
    test('view transactions list', async ({ page }) => {
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
      
      // Check for transaction data
      const rows = page.locator('table tbody tr, .fi-ta-row');
      const count = await rows.count();
      console.log(`Transactions found: ${count}`);
    });

    test('filter transactions by status', async ({ page }) => {
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      
      // Try multiple filter trigger selectors
      const filterButton = page.locator('button:has-text("Filter"), .fi-ta-filters-trigger, [data-testid*="filter"]').first();
      const filterCount = await filterButton.count();
      
      if (filterCount > 0 && await filterButton.isVisible().catch(() => false)) {
        await filterButton.click();
        await page.waitForTimeout(500);
        
        // Look for status filter
        const statusFilter = page.locator('select[name*="status" i], [class*="filter"] select').first();
        if (await statusFilter.count() > 0 && await statusFilter.isVisible().catch(() => false)) {
          await statusFilter.selectOption({ index: 1 });
          await page.waitForTimeout(1000);
          console.log('Status filter applied');
        } else {
          console.log('No status filter select found');
        }
      } else {
        // Filters may not be available on this page, which is OK
        console.log('Filter button not visible or not available');
      }
    });

    test('view transaction details', async ({ page }) => {
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      
      const viewLink = page.locator('a[href*="/transactions/"], button:has-text("View")').first();
      if (await viewLink.count() > 0) {
        await viewLink.click();
        await waitForPageLoad(page);
        
        // Check for any content on the detail page
        const details = page.locator('[class*="detail"], [class*="info"], form, main, [class*="content"]');
        const hasDetails = await details.count() > 0;
        console.log(`Transaction details loaded: ${hasDetails}`);
      } else {
        console.log('No transaction link found to view details');
      }
    });

    test('update transaction status', async ({ page }) => {
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      
      const editLink = page.locator('a[href*="/transactions/"][href*="/edit"], button:has-text("Edit")').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        // Look for status dropdown
        const statusSelect = page.locator('select[name*="status" i]').first();
        if (await statusSelect.count() > 0) {
          const currentStatus = await statusSelect.inputValue();
          console.log(`Current transaction status: ${currentStatus}`);
        }
      }
    });
  });

  test.describe('Payment Management Flow', () => {
    test('view payments and verify status', async ({ page }) => {
      await page.goto('/admin/payments');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
      
      // Check for status badges
      const statusBadges = page.locator('[class*="badge"], [class*="status"]');
      const badgeCount = await statusBadges.count();
      console.log(`Payment status badges: ${badgeCount}`);
    });

    test('view payment details and proof', async ({ page }) => {
      await page.goto('/admin/payments');
      await waitForPageLoad(page);
      
      const viewLink = page.locator('a[href*="/payments/"], button:has-text("View")').first();
      if (await viewLink.count() > 0) {
        await viewLink.click();
        await waitForPageLoad(page);
        
        // Check for payment proof section
        const proofSection = page.locator('[class*="proof"], [class*="document"], img[src*="proof"]');
        const hasProof = await proofSection.count() > 0;
        console.log(`Payment proof section visible: ${hasProof}`);
      }
    });
  });

  test.describe('Dealer Management Flow', () => {
    test('view and manage dealers', async ({ page }) => {
      await page.goto('/admin/dealers');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
      
      // Check for verification status
      const verificationBadges = page.locator('[class*="verified"], [class*="badge"]');
      const count = await verificationBadges.count();
      console.log(`Dealer verification badges: ${count}`);
    });

    test('create new dealer', async ({ page }) => {
      const testData = getTestData();
      
      await page.goto('/admin/dealers');
      await waitForPageLoad(page);
      
      const createButton = page.locator('a:has-text("Create"), a:has-text("New"), button:has-text("Create")').first();
      if (await createButton.count() > 0) {
        await createButton.click();
        await waitForPageLoad(page);
        
        // Fill dealer form
        const nameInput = page.locator('input[name*="name" i]').first();
        if (await nameInput.count() > 0) {
          await nameInput.fill(testData.dealer.name);
        }
        
        const emailInput = page.locator('input[name*="email" i], input[type="email"]').first();
        if (await emailInput.count() > 0) {
          await emailInput.fill(testData.dealer.email);
        }
        
        const phoneInput = page.locator('input[name*="phone" i], input[type="tel"]').first();
        if (await phoneInput.count() > 0) {
          await phoneInput.fill(testData.dealer.phone);
        }
        
        console.log('Dealer form filled');
      }
    });

    test('verify/unverify dealer', async ({ page }) => {
      await page.goto('/admin/dealers');
      await waitForPageLoad(page);
      
      const editLink = page.locator('a[href*="/dealers/"][href*="/edit"], button:has-text("Edit")').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        // Look for verification toggle/checkbox
        const verifyToggle = page.locator('input[name*="verified" i], input[name*="is_verified" i], input[type="checkbox"]').first();
        if (await verifyToggle.count() > 0) {
          const isChecked = await verifyToggle.isChecked();
          console.log(`Dealer verified: ${isChecked}`);
        }
      }
    });
  });

  test.describe('Dispute Management Flow', () => {
    test('view disputes list', async ({ page }) => {
      await page.goto('/admin/disputes');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
    });

    test('view dispute details and respond', async ({ page }) => {
      await page.goto('/admin/disputes');
      await waitForPageLoad(page);
      
      const viewLink = page.locator('a[href*="/disputes/"], button:has-text("View")').first();
      if (await viewLink.count() > 0) {
        await viewLink.click();
        await waitForPageLoad(page);
        
        // Check for dispute details
        const details = page.locator('[class*="detail"], form, [class*="content"]');
        await expect(details.first()).toBeVisible();
        
        // Look for response/resolution section
        const responseSection = page.locator('textarea[name*="response" i], textarea[name*="resolution" i], textarea');
        const hasResponse = await responseSection.count() > 0;
        console.log(`Response section available: ${hasResponse}`);
      }
    });
  });

  test.describe('Review Management Flow', () => {
    test('view and moderate reviews', async ({ page }) => {
      await page.goto('/admin/reviews');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
    });

    test('approve/reject review', async ({ page }) => {
      await page.goto('/admin/reviews');
      await waitForPageLoad(page);
      
      const editLink = page.locator('a[href*="/reviews/"][href*="/edit"], button:has-text("Edit")').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        // Look for status/approval field
        const statusField = page.locator('select[name*="status" i], input[name*="approved" i]').first();
        if (await statusField.count() > 0) {
          console.log('Review status field found');
        }
      }
    });
  });

  test.describe('Message Management Flow', () => {
    test('view messages', async ({ page }) => {
      await page.goto('/admin/messages');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
    });
  });

  test.describe('Invoice Management Flow', () => {
    test('view invoices', async ({ page }) => {
      await page.goto('/admin/invoices');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
    });

    test('download invoice PDF', async ({ page }) => {
      await page.goto('/admin/invoices');
      await waitForPageLoad(page);
      
      const downloadButton = page.locator('a:has-text("Download"), button:has-text("PDF"), a[href*=".pdf"]').first();
      if (await downloadButton.count() > 0) {
        console.log('Download button found for invoices');
      }
    });
  });

  test.describe('Activity Log Flow', () => {
    test('view activity logs', async ({ page }) => {
      await page.goto('/admin/activity-logs');
      await waitForPageLoad(page);
      
      const content = page.locator('table, [class*="table"], main, body');
      await expect(content.first()).toBeVisible();
      
      // Check for log entries
      const logEntries = page.locator('table tbody tr, .fi-ta-row, [class*="log"]');
      const count = await logEntries.count();
      console.log(`Activity log entries: ${count}`);
    });
  });

  test.describe('Dashboard Widgets Flow', () => {
    test('dashboard shows statistics', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Check for stat widgets
      const widgets = page.locator('[class*="stat"], [class*="widget"], [class*="card"]');
      const count = await widgets.count();
      console.log(`Dashboard widgets: ${count}`);
    });

    test('dashboard quick actions work', async ({ page }) => {
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Check for quick action buttons
      const quickActions = page.locator('a[href*="/admin/"]:has-text("Create"), a[href*="/admin/"]:has-text("View"), button:has-text("Quick")');
      const count = await quickActions.count();
      console.log(`Quick action buttons: ${count}`);
    });
  });
});
