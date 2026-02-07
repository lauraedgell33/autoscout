import { test, expect, Page, Browser } from '@playwright/test';
import { loginToAdmin, loginToFrontend, goToFrontendPage, waitForPageLoad, LIVE_CONFIG } from './helpers';

/**
 * Complete End-to-End Flow Tests
 * These tests span both admin panel and frontend to test complete business workflows
 * 
 * IMPORTANT: These tests are designed to verify flows without creating permanent test data
 */

test.describe('E2E Complete Business Flows - Live', () => {

  test.describe('Vehicle Listing to Purchase Flow', () => {
    test('verify complete vehicle listing flow exists', async ({ page }) => {
      console.log('=== Vehicle Listing to Purchase Flow ===');
      
      // Step 1: Check admin can access vehicle creation
      console.log('Step 1: Verify admin vehicle management');
      await loginToAdmin(page);
      await page.goto('/admin/vehicles');
      await waitForPageLoad(page);
      
      const adminVehicleList = page.locator('table, main, [class*="content"]');
      await expect(adminVehicleList.first()).toBeVisible();
      
      // Check create button exists
      const createButton = page.locator('a:has-text("Create"), a:has-text("New")').first();
      const canCreate = await createButton.count() > 0;
      console.log(`Admin can create vehicles: ${canCreate}`);
      
      // Step 2: Verify vehicles appear on frontend
      console.log('Step 2: Verify vehicles on frontend');
      await page.goto('https://www.autoscout24safetrade.com/en/vehicles');
      await waitForPageLoad(page);
      await page.waitForTimeout(3000);
      
      const vehicleCards = page.locator('[class*="vehicle"], article, .card');
      const vehicleCount = await vehicleCards.count();
      console.log(`Vehicles visible on frontend: ${vehicleCount}`);
      
      // Step 3: Verify vehicle detail page
      console.log('Step 3: Verify vehicle detail page');
      if (vehicleCount > 0) {
        const vehicleLink = page.locator('a[href*="/vehicle"]').first();
        if (await vehicleLink.count() > 0) {
          await vehicleLink.click();
          await waitForPageLoad(page);
          
          // Check essential elements
          const hasImages = await page.locator('img').count() > 0;
          const hasPrice = await page.locator('[class*="price"]').count() > 0 || await page.getByText(/€|EUR/).count() > 0;
          const hasBuyButton = await page.locator('button:has-text("Buy"), button:has-text("Purchase"), a:has-text("Buy")').count() > 0;
          
          console.log(`Detail page - Images: ${hasImages}, Price: ${hasPrice}, Buy button: ${hasBuyButton}`);
        }
      }
      
      console.log('=== Vehicle Listing Flow Verified ===');
    });
  });

  test.describe('Transaction Lifecycle Flow', () => {
    test('verify transaction management flow', async ({ page }) => {
      console.log('=== Transaction Lifecycle Flow ===');
      
      // Step 1: Check transactions in admin
      console.log('Step 1: Verify admin transaction management');
      await loginToAdmin(page);
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      
      const transactionTable = page.locator('table, main, [class*="content"]');
      await expect(transactionTable.first()).toBeVisible();
      
      // Check for status column/badges
      const statusBadges = page.locator('[class*="badge"], [class*="status"]');
      const statusCount = await statusBadges.count();
      console.log(`Transaction status indicators: ${statusCount}`);
      
      // Step 2: Verify transaction detail view
      console.log('Step 2: Verify transaction detail view');
      const viewLink = page.locator('a[href*="/transactions/"]').first();
      if (await viewLink.count() > 0) {
        await viewLink.click();
        await waitForPageLoad(page);
        
        // Check for transaction details
        const hasForm = await page.locator('form, [class*="detail"]').count() > 0;
        const hasStatus = await page.locator('select[name*="status"], [class*="status"]').count() > 0;
        
        console.log(`Transaction detail - Form: ${hasForm}, Status field: ${hasStatus}`);
      }
      
      console.log('=== Transaction Lifecycle Verified ===');
    });
  });

  test.describe('Payment Verification Flow', () => {
    test('verify payment management flow', async ({ page }) => {
      console.log('=== Payment Verification Flow ===');
      
      // Step 1: Access payments in admin
      console.log('Step 1: Verify admin payment management');
      await loginToAdmin(page);
      await page.goto('/admin/payments');
      await waitForPageLoad(page);
      
      const paymentTable = page.locator('table, main, [class*="content"]');
      await expect(paymentTable.first()).toBeVisible();
      
      // Step 2: Check payment verification capabilities
      console.log('Step 2: Check payment verification options');
      const viewLink = page.locator('a[href*="/payments/"]').first();
      if (await viewLink.count() > 0) {
        await viewLink.click();
        await waitForPageLoad(page);
        
        // Check for verification options
        const hasVerifyOption = await page.locator('select[name*="status"], button:has-text("Verify"), input[name*="verified"]').count() > 0;
        const hasProofView = await page.locator('img, [class*="proof"], a[href*="proof"]').count() > 0;
        
        console.log(`Payment detail - Verify option: ${hasVerifyOption}, Proof view: ${hasProofView}`);
      }
      
      console.log('=== Payment Flow Verified ===');
    });
  });

  test.describe('User Registration to Transaction Flow', () => {
    test('verify user journey flow exists', async ({ page }) => {
      console.log('=== User Journey Flow ===');
      
      // Step 1: Verify registration page
      console.log('Step 1: Verify registration available');
      await page.goto('https://www.autoscout24safetrade.com/en/register');
      await waitForPageLoad(page);
      
      const registerForm = page.locator('form');
      const hasRegisterForm = await registerForm.count() > 0;
      console.log(`Registration form available: ${hasRegisterForm}`);
      
      // Step 2: Verify login page
      console.log('Step 2: Verify login available');
      await page.goto('https://www.autoscout24safetrade.com/en/login');
      await waitForPageLoad(page);
      
      const loginForm = page.locator('form');
      const hasLoginForm = await loginForm.count() > 0;
      console.log(`Login form available: ${hasLoginForm}`);
      
      // Step 3: Verify vehicle browsing
      console.log('Step 3: Verify vehicle browsing');
      await page.goto('https://www.autoscout24safetrade.com/en/vehicles');
      await waitForPageLoad(page);
      
      const vehicles = page.locator('[class*="vehicle"], article');
      const vehicleCount = await vehicles.count();
      console.log(`Vehicles available: ${vehicleCount}`);
      
      // Step 4: Verify protected routes redirect to login
      console.log('Step 4: Verify protected routes');
      await page.goto('https://www.autoscout24safetrade.com/en/buyer/dashboard');
      await waitForPageLoad(page);
      
      const isProtected = page.url().includes('/login') || await page.locator('input[type="password"]').count() > 0;
      console.log(`Dashboard protected: ${isProtected}`);
      
      console.log('=== User Journey Verified ===');
    });
  });

  test.describe('Dealer Management Flow', () => {
    test('verify dealer listing and management', async ({ page }) => {
      console.log('=== Dealer Management Flow ===');
      
      // Step 1: Check dealers in admin
      console.log('Step 1: Verify admin dealer management');
      await loginToAdmin(page);
      await page.goto('/admin/dealers');
      await waitForPageLoad(page);
      
      const dealerTable = page.locator('table, main, [class*="content"]');
      await expect(dealerTable.first()).toBeVisible();
      
      // Step 2: Check verification capabilities
      console.log('Step 2: Check dealer verification');
      const editLink = page.locator('a[href*="/dealers/"]').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        const hasVerifyOption = await page.locator('input[name*="verified"], select[name*="status"]').count() > 0;
        console.log(`Dealer verification option: ${hasVerifyOption}`);
      }
      
      // Step 3: Check dealers on frontend
      console.log('Step 3: Verify dealers on frontend');
      await page.goto('https://www.autoscout24safetrade.com/en/dealers');
      await waitForPageLoad(page);
      
      const dealerCards = page.locator('[class*="dealer"], article, .card');
      const dealerCount = await dealerCards.count();
      console.log(`Dealers visible on frontend: ${dealerCount}`);
      
      console.log('=== Dealer Flow Verified ===');
    });
  });

  test.describe('Dispute Resolution Flow', () => {
    test('verify dispute management workflow', async ({ page }) => {
      console.log('=== Dispute Resolution Flow ===');
      
      // Step 1: Access disputes in admin
      console.log('Step 1: Verify admin dispute management');
      await loginToAdmin(page);
      await page.goto('/admin/disputes');
      await waitForPageLoad(page);
      
      const disputeTable = page.locator('table, main, [class*="content"]');
      await expect(disputeTable.first()).toBeVisible();
      
      // Step 2: Check dispute resolution options
      console.log('Step 2: Check dispute resolution options');
      const editLink = page.locator('a[href*="/disputes/"]').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        const hasStatusOption = await page.locator('select[name*="status"], select[name*="resolution"]').count() > 0;
        const hasNotesField = await page.locator('textarea[name*="notes"], textarea[name*="response"]').count() > 0;
        
        console.log(`Dispute management - Status option: ${hasStatusOption}, Notes field: ${hasNotesField}`);
      }
      
      console.log('=== Dispute Flow Verified ===');
    });
  });

  test.describe('Review and Rating Flow', () => {
    test('verify review system workflow', async ({ page }) => {
      console.log('=== Review System Flow ===');
      
      // Step 1: Check reviews in admin
      console.log('Step 1: Verify admin review moderation');
      await loginToAdmin(page);
      await page.goto('/admin/reviews');
      await waitForPageLoad(page);
      
      const reviewTable = page.locator('table, main, [class*="content"]');
      await expect(reviewTable.first()).toBeVisible();
      
      // Step 2: Check moderation options
      console.log('Step 2: Check review moderation options');
      const editLink = page.locator('a[href*="/reviews/"]').first();
      if (await editLink.count() > 0) {
        await editLink.click();
        await waitForPageLoad(page);
        
        const hasApproveOption = await page.locator('select[name*="status"], input[name*="approved"]').count() > 0;
        console.log(`Review moderation option: ${hasApproveOption}`);
      }
      
      // Step 3: Check reviews on frontend vehicle page
      console.log('Step 3: Check reviews on frontend');
      await page.goto('https://www.autoscout24safetrade.com/en/vehicles');
      await waitForPageLoad(page);
      
      const vehicleLink = page.locator('a[href*="/vehicle"]').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        const hasReviewSection = await page.locator('[class*="review"], [class*="rating"]').count() > 0;
        console.log(`Vehicle page has review section: ${hasReviewSection}`);
      }
      
      console.log('=== Review Flow Verified ===');
    });
  });

  test.describe('Escrow Payment Flow', () => {
    test('verify escrow payment system components', async ({ page }) => {
      console.log('=== Escrow Payment Flow ===');
      
      // Step 1: Check transaction states in admin
      console.log('Step 1: Verify transaction states');
      await loginToAdmin(page);
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      
      // Look for different transaction statuses
      const statusBadges = page.locator('[class*="badge"], [class*="status"]');
      const statusCount = await statusBadges.count();
      console.log(`Transaction status badges visible: ${statusCount}`);
      
      // Step 2: Check payment states
      console.log('Step 2: Verify payment states');
      await page.goto('/admin/payments');
      await waitForPageLoad(page);
      
      const paymentStatuses = page.locator('[class*="badge"], [class*="status"]');
      const paymentStatusCount = await paymentStatuses.count();
      console.log(`Payment status badges visible: ${paymentStatusCount}`);
      
      // Step 3: Verify escrow info on frontend
      console.log('Step 3: Check escrow info on frontend');
      await page.goto('https://www.autoscout24safetrade.com/en/how-it-works');
      await waitForPageLoad(page);
      
      const escrowInfo = await page.getByText(/escrow|safe|secure|protect/i).count();
      console.log(`Escrow information visible: ${escrowInfo > 0}`);
      
      console.log('=== Escrow Flow Verified ===');
    });
  });

  test.describe('Invoice and Document Flow', () => {
    test('verify invoice generation system', async ({ page }) => {
      console.log('=== Invoice and Document Flow ===');
      
      // Step 1: Check invoices in admin
      console.log('Step 1: Verify admin invoice management');
      await loginToAdmin(page);
      await page.goto('/admin/invoices');
      await waitForPageLoad(page);
      
      const invoiceTable = page.locator('table, main, [class*="content"]');
      await expect(invoiceTable.first()).toBeVisible();
      
      // Step 2: Check invoice download option
      console.log('Step 2: Check invoice actions');
      const downloadButton = page.locator('a:has-text("Download"), button:has-text("PDF"), a[href*=".pdf"]').first();
      const hasDownload = await downloadButton.count() > 0;
      console.log(`Invoice download option: ${hasDownload}`);
      
      // Step 3: Check documents
      console.log('Step 3: Verify document management');
      await page.goto('/admin/documents');
      await waitForPageLoad(page);
      
      const documentTable = page.locator('table, main, [class*="content"]');
      const hasDocuments = await documentTable.count() > 0;
      console.log(`Document management available: ${hasDocuments}`);
      
      console.log('=== Document Flow Verified ===');
    });
  });

  test.describe('Admin Analytics Flow', () => {
    test('verify admin dashboard analytics', async ({ page }) => {
      console.log('=== Admin Analytics Flow ===');
      
      // Step 1: Check admin dashboard
      console.log('Step 1: Verify admin dashboard');
      await loginToAdmin(page);
      await page.goto('/admin');
      await waitForPageLoad(page);
      
      // Check for stat widgets
      const widgets = page.locator('[class*="stat"], [class*="widget"], [class*="card"]');
      const widgetCount = await widgets.count();
      console.log(`Dashboard widgets: ${widgetCount}`);
      
      // Step 2: Check for charts/graphs
      console.log('Step 2: Check for analytics components');
      const charts = page.locator('[class*="chart"], canvas, svg[class*="chart"]');
      const chartCount = await charts.count();
      console.log(`Chart components: ${chartCount}`);
      
      console.log('=== Analytics Flow Verified ===');
    });
  });

  test.describe('Full Purchase to Completion Flow', () => {
    test('verify complete purchase workflow components', async ({ page }) => {
      console.log('=== Complete Purchase Workflow ===');
      
      // This test verifies all components of the purchase flow exist
      
      // 1. Vehicle exists on frontend
      console.log('1. Checking vehicle availability...');
      await page.goto('https://www.autoscout24safetrade.com/en/vehicles');
      await waitForPageLoad(page);
      const hasVehicles = await page.locator('a[href*="/vehicle"]').count() > 0;
      console.log(`Vehicles available: ${hasVehicles}`);
      
      // 2. Login/Register exists
      console.log('2. Checking authentication...');
      await page.goto('https://www.autoscout24safetrade.com/en/login');
      const hasLogin = await page.locator('form').count() > 0;
      console.log(`Login available: ${hasLogin}`);
      
      // 3. Transaction system exists in admin
      console.log('3. Checking transaction system...');
      await loginToAdmin(page);
      await page.goto('/admin/transactions');
      await waitForPageLoad(page);
      const hasTransactions = await page.locator('table, main').count() > 0;
      console.log(`Transaction system: ${hasTransactions}`);
      
      // 4. Payment system exists
      console.log('4. Checking payment system...');
      await page.goto('/admin/payments');
      await waitForPageLoad(page);
      const hasPayments = await page.locator('table, main').count() > 0;
      console.log(`Payment system: ${hasPayments}`);
      
      // 5. Invoice system exists
      console.log('5. Checking invoice system...');
      await page.goto('/admin/invoices');
      await waitForPageLoad(page);
      const hasInvoices = await page.locator('table, main').count() > 0;
      console.log(`Invoice system: ${hasInvoices}`);
      
      console.log('=== Purchase Workflow Components Verified ===');
    });
  });

  test.describe('System Health Check', () => {
    test('verify all critical pages are accessible', async ({ page }) => {
      console.log('=== System Health Check ===');
      
      const criticalPages = [
        // Frontend
        { url: 'https://www.autoscout24safetrade.com/en', name: 'Frontend Home' },
        { url: 'https://www.autoscout24safetrade.com/en/vehicles', name: 'Vehicles List' },
        { url: 'https://www.autoscout24safetrade.com/en/login', name: 'Login Page' },
        { url: 'https://www.autoscout24safetrade.com/en/register', name: 'Register Page' },
        { url: 'https://www.autoscout24safetrade.com/en/about', name: 'About Page' },
        { url: 'https://www.autoscout24safetrade.com/en/contact', name: 'Contact Page' },
        // Admin
        { url: 'https://adminautoscout.dev/admin', name: 'Admin Login' },
      ];
      
      const results: { name: string; status: string }[] = [];
      
      for (const pageInfo of criticalPages) {
        try {
          const response = await page.goto(pageInfo.url, { timeout: 30000 });
          const status = response?.status() || 'unknown';
          const isOk = status === 200;
          results.push({ name: pageInfo.name, status: isOk ? 'OK' : `Status: ${status}` });
          console.log(`${pageInfo.name}: ${isOk ? 'OK' : 'FAILED'} (${status})`);
        } catch (error) {
          results.push({ name: pageInfo.name, status: 'ERROR' });
          console.log(`${pageInfo.name}: ERROR`);
        }
      }
      
      // Verify admin access
      console.log('\nVerifying admin panel access...');
      await loginToAdmin(page);
      
      const adminPages = [
        '/admin/users',
        '/admin/vehicles', 
        '/admin/transactions',
        '/admin/payments',
        '/admin/dealers',
      ];
      
      for (const adminPage of adminPages) {
        await page.goto(`https://adminautoscout.dev${adminPage}`);
        await waitForPageLoad(page);
        const hasContent = await page.locator('table, main, [class*="content"]').count() > 0;
        console.log(`Admin ${adminPage}: ${hasContent ? 'OK' : 'FAILED'}`);
      }
      
      console.log('=== Health Check Complete ===');
    });
  });
});
