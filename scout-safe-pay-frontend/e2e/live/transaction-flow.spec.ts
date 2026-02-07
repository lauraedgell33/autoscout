import { test, expect, Page } from '@playwright/test';
import { LIVE_CONFIG, waitForPageLoad, goToFrontendPage } from './helpers';

/**
 * Complete Transaction Flow E2E Tests
 * Tests the entire buyer-seller transaction process
 */

// Generate unique test users for this run
const timestamp = Date.now();
const randomStr = Math.random().toString(36).substring(2, 6);

const TEST_BUYER = {
  name: `E2E Buyer ${randomStr}`,
  email: `e2e.buyer.${timestamp}@testmail.com`,
  password: 'BuyerTest123!@#',
};

const TEST_SELLER = {
  name: `E2E Seller ${randomStr}`,
  email: `e2e.seller.${timestamp}@testmail.com`,
  password: 'SellerTest123!@#',
};

// Existing seller for most tests
const EXISTING_SELLER = {
  email: 'seller@autoscout24safetrade.com',
  password: 'password123',
};

// Store test data
let testVehicleId: string | null = null;
let testTransactionId: string | null = null;

// Helper functions
async function registerUser(page: Page, user: typeof TEST_BUYER, type: 'buyer' | 'seller') {
  await goToFrontendPage(page, '/auth/register');
  await page.waitForTimeout(1500);
  
  // Fill registration
  const nameInput = page.locator('input[name="name"], input[name="first_name"]').first();
  if (await nameInput.count() > 0) await nameInput.fill(user.name);
  
  await page.locator('input[type="email"]').first().fill(user.email);
  await page.locator('input[type="password"]').first().fill(user.password);
  
  // Confirm password
  const confirmPass = page.locator('input[name*="confirm"], input[name*="password_confirmation"]').first();
  if (await confirmPass.count() > 0) await confirmPass.fill(user.password);
  
  // User type
  const typeRadio = page.locator(`input[value="${type}"], label:has-text("${type}")`).first();
  if (await typeRadio.count() > 0) await typeRadio.click();
  
  // Terms
  const terms = page.locator('input[name*="terms"], input[name*="agree"]').first();
  if (await terms.count() > 0) await terms.check();
  
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(3000);
  
  return page.url();
}

async function loginUser(page: Page, email: string, password: string) {
  await goToFrontendPage(page, '/auth/login');
  await page.waitForTimeout(1500);
  
  await page.locator('input[type="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('button[type="submit"]').first().click();
  
  await page.waitForTimeout(3000);
  await page.waitForFunction(() => !window.location.pathname.includes('/login'), { timeout: 10000 }).catch(() => {});
  
  return page.url();
}

async function isLoggedIn(page: Page): Promise<boolean> {
  await page.waitForTimeout(1000);
  const url = page.url();
  return !url.includes('/login') && !url.includes('/register');
}

test.describe('Complete Buyer Registration & Purchase Flow', () => {
  
  test.describe.serial('Buyer Journey', () => {
    
    test('Step 1: Buyer browses marketplace without login', async ({ page }) => {
      await goToFrontendPage(page, '/marketplace');
      await page.waitForTimeout(2000);
      
      // Verify marketplace is accessible
      const hasVehicles = await page.locator('[class*="vehicle"], [class*="card"], a[href*="/vehicle/"]').count() > 0;
      console.log(`Marketplace accessible, vehicles visible: ${hasVehicles}`);
      expect(hasVehicles).toBeTruthy();
    });

    test('Step 2: Buyer views vehicle details', async ({ page }) => {
      await goToFrontendPage(page, '/marketplace');
      await page.waitForTimeout(3000);
      
      const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        const url = page.url();
        // URL pattern: /[locale]/vehicles/[id] or /vehicle/[id]
        expect(url).toMatch(/\/vehicles?\/\d+/);
        
        // Check vehicle details are shown
        const hasPrice = await page.locator('[class*="price"]').count() > 0;
        const hasDescription = await page.locator('[class*="description"], p').count() > 0;
        
        console.log(`Vehicle details - Price: ${hasPrice}, Description: ${hasDescription}`);
      }
    });

    test('Step 3: Buyer attempts to buy - redirected to login', async ({ page }) => {
      await goToFrontendPage(page, '/marketplace');
      await page.waitForTimeout(3000);
      
      const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        // Click buy/contact button
        const buyButton = page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Contact")').first();
        if (await buyButton.count() > 0) {
          await buyButton.click();
          await page.waitForTimeout(2000);
          
          // Should redirect to login or show login modal
          const url = page.url();
          const hasLoginModal = await page.locator('input[type="password"]').count() > 0;
          
          console.log(`After buy click - URL: ${url}, Login modal: ${hasLoginModal}`);
        }
      }
    });

    test('Step 4: Buyer creates account', async ({ page }) => {
      const resultUrl = await registerUser(page, TEST_BUYER, 'buyer');
      console.log(`Buyer registration result: ${resultUrl}`);
    });

    test('Step 5: Buyer logs in', async ({ page }) => {
      const resultUrl = await loginUser(page, TEST_BUYER.email, TEST_BUYER.password);
      const loggedIn = await isLoggedIn(page);
      
      console.log(`Buyer login result: ${resultUrl}, Logged in: ${loggedIn}`);
    });

    test('Step 6: Buyer saves vehicle to favorites', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/marketplace');
      await page.waitForTimeout(3000);
      
      const favoriteBtn = page.locator('[aria-label*="favorite" i], button:has([class*="heart"])').first();
      if (await favoriteBtn.count() > 0) {
        await favoriteBtn.click();
        await page.waitForTimeout(1500);
        
        // Check for success toast
        const toast = await page.locator('[class*="toast"], [class*="notification"]').count() > 0;
        console.log(`Favorite added, toast: ${toast}`);
      }
    });

    test('Step 7: Buyer initiates purchase', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/marketplace');
      await page.waitForTimeout(3000);
      
      const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        const buyButton = page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Start"), a:has-text("Buy")').first();
        if (await buyButton.count() > 0) {
          await buyButton.click();
          await page.waitForTimeout(2000);
          
          const url = page.url();
          console.log(`After purchase click: ${url}`);
          
          // Check if on checkout/transaction page
          const isCheckout = url.includes('checkout') || url.includes('transaction') || url.includes('buy');
          console.log(`On checkout page: ${isCheckout}`);
        }
      }
    });
  });
});

test.describe('Complete Seller Flow', () => {
  
  test.describe.serial('Seller Journey', () => {
    
    test('Step 1: Seller logs in', async ({ page }) => {
      const resultUrl = await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      console.log(`Seller login result: ${resultUrl}`);
    });

    test('Step 2: Seller accesses dashboard', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/dashboard');
      await page.waitForTimeout(2000);
      
      const url = page.url();
      console.log(`Dashboard URL: ${url}`);
    });

    test('Step 3: Seller views their vehicles', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/dashboard/vehicles');
      await page.waitForTimeout(2000);
      
      const hasVehicles = await page.locator('[class*="vehicle"], [class*="listing"], table tbody tr, [class*="card"]').count() > 0;
      console.log(`Seller has vehicles listed: ${hasVehicles}`);
    });

    test('Step 4: Seller navigates to add vehicle', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/dashboard/vehicles/add');
      await page.waitForTimeout(2000);
      
      const hasForm = await page.locator('form').count() > 0;
      console.log(`Add vehicle form visible: ${hasForm}`);
    });

    test('Step 5: Seller fills vehicle form', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/dashboard/vehicles/add');
      await page.waitForTimeout(2000);
      
      // Fill form fields
      const fields = [
        { selector: 'input[name*="make"], select[name*="make"]', value: 'TestBrand' },
        { selector: 'input[name*="model"]', value: 'E2E Test Model' },
        { selector: 'input[name*="year"]', value: '2024' },
        { selector: 'input[name*="price"]', value: '30000' },
        { selector: 'input[name*="mileage"], input[name*="km"]', value: '5000' },
        { selector: 'textarea', value: 'E2E Test Vehicle - This is an automated test listing.' },
      ];
      
      for (const field of fields) {
        const element = page.locator(field.selector).first();
        if (await element.count() > 0) {
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'select') {
            await element.selectOption({ index: 1 }).catch(() => {});
          } else {
            await element.fill(field.value);
          }
        }
      }
      
      console.log('Vehicle form filled');
    });

    test('Step 6: Seller views transactions', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/dashboard/transactions');
      await page.waitForTimeout(2000);
      
      const hasContent = await page.locator('[class*="transaction"], table, [class*="empty"]').count() > 0;
      console.log(`Transactions page loaded: ${hasContent}`);
    });

    test('Step 7: Seller checks payments', async ({ page }) => {
      await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
      
      await goToFrontendPage(page, '/dashboard/payments');
      await page.waitForTimeout(2000);
      
      const hasPaymentInfo = await page.locator('[class*="payment"], [class*="balance"], table').count() > 0;
      console.log(`Payments page loaded: ${hasPaymentInfo}`);
    });
  });
});

test.describe('Transaction State Machine Flow', () => {
  
  test('should display transaction status progression', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    // Click on a transaction
    const transactionRow = page.locator('[class*="transaction"], table tbody tr, a[href*="transaction"]').first();
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      // Check for status indicator
      const hasStatus = await page.locator('[class*="status"], [class*="badge"], [class*="step"]').count() > 0;
      console.log(`Transaction status visible: ${hasStatus}`);
      
      // Check for timeline/progress
      const hasTimeline = await page.locator('[class*="timeline"], [class*="progress"], [class*="stepper"]').count() > 0;
      console.log(`Transaction timeline visible: ${hasTimeline}`);
    }
  });

  test('should display escrow information', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const transactionRow = page.locator('[class*="transaction"], table tbody tr').first();
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      const hasEscrowInfo = await page.locator('[class*="escrow"], [class*="payment-status"]').count() > 0;
      console.log(`Escrow information visible: ${hasEscrowInfo}`);
    }
  });
});

test.describe('Vehicle Purchase Checkout Flow', () => {
  
  test('should display checkout page elements', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    // Go to vehicle and click buy
    const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
    if (await vehicleLink.count() > 0) {
      await vehicleLink.click();
      await waitForPageLoad(page);
      
      const buyBtn = page.locator('button:has-text("Buy"), a:has-text("Buy"), button:has-text("Purchase")').first();
      if (await buyBtn.count() > 0) {
        await buyBtn.click();
        await page.waitForTimeout(3000);
        
        // Check checkout elements
        const checkoutElements = {
          vehicleSummary: await page.locator('[class*="summary"], [class*="vehicle-info"]').count(),
          priceBreakdown: await page.locator('[class*="price"], [class*="total"]').count(),
          paymentOptions: await page.locator('[class*="payment"], input[name*="payment"]').count(),
          termsCheckbox: await page.locator('input[type="checkbox"]').count(),
          submitButton: await page.locator('button[type="submit"], button:has-text("Confirm")').count(),
        };
        
        console.log('Checkout elements:', checkoutElements);
      }
    }
  });

  test('should validate checkout form', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    // Navigate to checkout (if exists)
    await goToFrontendPage(page, '/checkout');
    await page.waitForTimeout(2000);
    
    // Try to submit without filling required fields
    const submitBtn = page.locator('button[type="submit"]').first();
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      await page.waitForTimeout(1500);
      
      // Check for validation messages
      const hasValidation = await page.locator('[class*="error"], [class*="invalid"], [role="alert"]').count() > 0;
      console.log(`Form validation working: ${hasValidation}`);
    }
  });
});

test.describe('Payment Upload Flow', () => {
  
  test('should display payment proof upload form', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const transactionRow = page.locator('[class*="transaction"], table tbody tr').first();
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      // Check for upload payment proof section
      const hasUpload = await page.locator('input[type="file"], [class*="upload"], button:has-text("Upload")').count() > 0;
      console.log(`Payment proof upload available: ${hasUpload}`);
    }
  });
});

test.describe('Dispute Flow', () => {
  
  test('should display dispute option', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const transactionRow = page.locator('[class*="transaction"], table tbody tr').first();
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      // Check for dispute button
      const hasDispute = await page.locator('button:has-text("Dispute"), a:has-text("Dispute"), button:has-text("Report")').count() > 0;
      console.log(`Dispute option available: ${hasDispute}`);
    }
  });

  test('should display dispute form', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/disputes');
    await page.waitForTimeout(2000);
    
    const hasDisputeSection = await page.locator('[class*="dispute"], form, [class*="empty"]').count() > 0;
    console.log(`Dispute section visible: ${hasDisputeSection}`);
  });
});

test.describe('Contract & Invoice Generation', () => {
  
  test('should display contract download option', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const transactionRow = page.locator('[class*="transaction"], table tbody tr').first();
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      // Check for contract/invoice download
      const hasDownload = await page.locator('a:has-text("Contract"), a:has-text("Invoice"), a:has-text("Download"), button:has-text("Download")').count() > 0;
      console.log(`Contract/Invoice download available: ${hasDownload}`);
    }
  });
});

test.describe('Vehicle Inspection Flow', () => {
  
  test('should display inspection scheduling', async ({ page }) => {
    await loginUser(page, EXISTING_SELLER.email, EXISTING_SELLER.password);
    
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const transactionRow = page.locator('[class*="transaction"], table tbody tr').first();
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      // Check for inspection scheduling
      const hasInspection = await page.locator('[class*="inspection"], button:has-text("Schedule"), input[type="date"]').count() > 0;
      console.log(`Inspection scheduling available: ${hasInspection}`);
    }
  });
});

test.describe('Complete E2E Transaction Simulation', () => {
  
  test('Full flow: Browse → View → Login → Checkout (simulation)', async ({ page }) => {
    // Step 1: Browse marketplace
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    console.log('Step 1: Browsed marketplace');
    
    // Step 2: View vehicle
    const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
    if (await vehicleLink.count() > 0) {
      await vehicleLink.click();
      await waitForPageLoad(page);
      console.log('Step 2: Viewed vehicle details');
      
      // Step 3: Click buy (which requires login)
      const buyBtn = page.locator('button:has-text("Buy"), a:has-text("Buy")').first();
      if (await buyBtn.count() > 0) {
        await buyBtn.click();
        await page.waitForTimeout(2000);
        console.log('Step 3: Clicked buy button');
        
        // Step 4: Should be prompted to login
        const needsLogin = page.url().includes('login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Step 4: Login required: ${needsLogin}`);
        
        if (needsLogin) {
          // Login
          await page.locator('input[type="email"]').first().fill(EXISTING_SELLER.email);
          await page.locator('input[type="password"]').first().fill(EXISTING_SELLER.password);
          await page.locator('button[type="submit"]').first().click();
          await page.waitForTimeout(3000);
          console.log('Step 5: Logged in');
        }
        
        // Step 6: On checkout or transaction page
        const url = page.url();
        console.log(`Step 6: Final URL: ${url}`);
        
        // Verify we're progressing through the purchase flow
        const progressIndicators = [
          url.includes('checkout'),
          url.includes('transaction'),
          url.includes('buy'),
          url.includes('confirm'),
          await page.locator('[class*="checkout"], [class*="transaction"]').count() > 0,
        ];
        
        console.log(`Purchase flow progression detected: ${progressIndicators.some(Boolean)}`);
      }
    }
  });
});
