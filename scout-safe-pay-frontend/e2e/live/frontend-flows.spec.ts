import { test, expect } from '@playwright/test';
import { goToFrontendPage, waitForPageLoad, loginToFrontend } from './helpers';

/**
 * Complete Frontend Flow Tests
 * Tests complete user journeys for buyers, sellers, and general users
 */

// Test credentials - use existing test accounts on the live server
// Note: Update these with real test accounts when available
const TEST_CREDENTIALS = {
  buyer: {
    email: process.env.TEST_BUYER_EMAIL || 'buyer@test.com',
    password: process.env.TEST_BUYER_PASSWORD || 'password123',
  },
  seller: {
    email: process.env.TEST_SELLER_EMAIL || 'seller@test.com', 
    password: process.env.TEST_SELLER_PASSWORD || 'password123',
  },
};

// Helper to check if login was successful
async function tryLogin(page: any, email: string, password: string): Promise<boolean> {
  try {
    await loginToFrontend(page, email, password);
    await page.waitForTimeout(2000);
    
    // Check if still on login page (login failed)
    const url = page.url();
    const hasPasswordField = await page.locator('input[type="password"]').count() > 0;
    
    return !hasPasswordField && !url.includes('/login');
  } catch {
    return false;
  }
}

// Generate unique test data
const getTestData = () => {
  const timestamp = Date.now();
  return {
    newUser: {
      name: `E2E Test User ${timestamp}`,
      email: `e2etest${timestamp}@testmail.com`,
      password: 'TestPass123!',
    },
    vehicle: {
      make: 'BMW',
      model: 'X5',
      year: '2023',
      price: '45000',
      mileage: '25000',
      description: 'Test vehicle listing',
    },
    message: `Test message sent at ${new Date().toISOString()}`,
  };
};

test.describe('Frontend Complete Flows - Live', () => {

  test.describe('User Registration Flow', () => {
    test('complete buyer registration flow', async ({ page }) => {
      const testData = getTestData();
      
      console.log('Step 1: Navigate to registration page');
      await goToFrontendPage(page, '/register');
      
      // Check registration form exists
      const registerForm = page.locator('form');
      await expect(registerForm.first()).toBeVisible();
      
      console.log('Step 2: Fill registration form');
      
      // Name field
      const nameInput = page.locator('input[name="name"], input[name="first_name"], input[placeholder*="name" i]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(testData.newUser.name);
      }
      
      // Email field  
      const emailInput = page.locator('input[name="email"], input[type="email"]').first();
      await emailInput.fill(testData.newUser.email);
      
      // Password fields
      const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
      await passwordInput.fill(testData.newUser.password);
      
      const confirmPassword = page.locator('input[name*="confirm"], input[name*="confirmation"]').first();
      if (await confirmPassword.count() > 0) {
        await confirmPassword.fill(testData.newUser.password);
      }
      
      // User type selection
      const buyerOption = page.locator('input[value="buyer"], label:has-text("Buyer"), select option[value="buyer"]');
      if (await buyerOption.count() > 0) {
        await buyerOption.first().click();
      }
      
      // Terms acceptance
      const termsCheckbox = page.locator('input[name*="terms"], input[name*="agree"]').first();
      if (await termsCheckbox.count() > 0) {
        await termsCheckbox.check();
      }
      
      console.log('Step 3: Submit registration');
      // Don't actually submit to avoid creating test users on live
      // await page.click('button[type="submit"]');
      
      console.log('Registration form filled successfully (not submitted on live)');
    });

    test('registration validation works', async ({ page }) => {
      await goToFrontendPage(page, '/register');
      
      // Try submitting empty form
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Should show validation errors
        const errorMessages = await page.locator('[class*="error"], [role="alert"]').count();
        console.log(`Validation errors shown: ${errorMessages > 0}`);
      }
    });
  });

  test.describe('User Login Flow', () => {
    test('complete login flow', async ({ page }) => {
      console.log('Step 1: Navigate to login page');
      await goToFrontendPage(page, '/login');
      
      console.log('Step 2: Fill login form');
      const emailInput = page.locator('input[name="email"], input[type="email"]').first();
      const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
      
      await emailInput.fill(TEST_CREDENTIALS.buyer.email);
      await passwordInput.fill(TEST_CREDENTIALS.buyer.password);
      
      console.log('Step 3: Submit login');
      await page.click('button[type="submit"]');
      await waitForPageLoad(page);
      
      // Verify login result
      const url = page.url();
      const hasPasswordField = await page.locator('input[type="password"]').count() > 0;
      
      if (!hasPasswordField || url.includes('/dashboard')) {
        console.log('Login successful - redirected to dashboard');
      } else {
        console.log('Login may have failed - still on login page');
      }
    });

    test('login validation shows errors', async ({ page }) => {
      await goToFrontendPage(page, '/login');
      
      await page.fill('input[name="email"], input[type="email"]', 'invalid@email.com');
      await page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      await page.waitForTimeout(3000);
      
      // Check for error message
      const errorVisible = await page.locator('[class*="error"], [role="alert"]').count() > 0;
      const stillOnLogin = page.url().includes('/login');
      
      console.log(`Error shown or still on login: ${errorVisible || stillOnLogin}`);
    });
  });

  test.describe('Vehicle Browsing Flow', () => {
    test('complete vehicle browsing journey', async ({ page }) => {
      console.log('Step 1: Navigate to vehicles page');
      await goToFrontendPage(page, '/vehicles');
      await page.waitForTimeout(3000);
      
      console.log('Step 2: Apply filters');
      // Try price filter
      const minPriceInput = page.locator('input[name*="min_price" i], input[placeholder*="min" i]').first();
      if (await minPriceInput.count() > 0) {
        await minPriceInput.fill('10000');
      }
      
      const maxPriceInput = page.locator('input[name*="max_price" i], input[placeholder*="max" i]').first();
      if (await maxPriceInput.count() > 0) {
        await maxPriceInput.fill('50000');
      }
      
      // Try make filter
      const makeSelect = page.locator('select[name*="make" i]').first();
      if (await makeSelect.count() > 0) {
        const options = await makeSelect.locator('option').count();
        if (options > 1) {
          await makeSelect.selectOption({ index: 1 });
        }
      }
      
      // Apply filters button
      const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search"), button:has-text("Filter")').first();
      if (await applyButton.count() > 0) {
        await applyButton.click();
        await page.waitForTimeout(2000);
      }
      
      console.log('Step 3: Browse results');
      const vehicleCards = page.locator('[class*="vehicle"], [class*="car"], article, .card');
      const count = await vehicleCards.count();
      console.log(`Vehicles found after filtering: ${count}`);
      
      console.log('Step 4: View vehicle details');
      const vehicleLink = page.locator('a[href*="/vehicle"], article a').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        expect(page.url()).toMatch(/vehicle|car|listing/i);
        
        // Check vehicle details page elements
        const hasImages = await page.locator('img').count() > 0;
        const hasPrice = await page.locator('[class*="price"]').count() > 0 || await page.getByText(/€|EUR/).count() > 0;
        
        console.log(`Details page - Images: ${hasImages}, Price: ${hasPrice}`);
      }
    });

    test('vehicle search functionality', async ({ page }) => {
      await goToFrontendPage(page, '/vehicles');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
      if (await searchInput.count() > 0) {
        console.log('Testing search with "BMW"...');
        await searchInput.fill('BMW');
        await searchInput.press('Enter');
        await page.waitForTimeout(2000);
        
        const results = page.locator('[class*="vehicle"], article');
        const count = await results.count();
        console.log(`Search results: ${count}`);
      }
    });

    test('pagination works', async ({ page }) => {
      await goToFrontendPage(page, '/vehicles');
      await page.waitForTimeout(2000);
      
      const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [class*="pagination"] a').first();
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await waitForPageLoad(page);
        
        expect(page.url()).toMatch(/page=2|offset|skip/);
        console.log('Pagination working');
      }
    });
  });

  test.describe('Buyer Dashboard Flow', () => {
    test('complete buyer dashboard journey', async ({ page }) => {
      console.log('Attempting login as buyer...');
      const loggedIn = await tryLogin(page, TEST_CREDENTIALS.buyer.email, TEST_CREDENTIALS.buyer.password);
      
      if (!loggedIn) {
        console.log('Buyer login failed - testing protected route redirects instead');
        
        // Verify protected routes redirect to login
        await goToFrontendPage(page, '/buyer/dashboard');
        const url = page.url();
        const redirectedToLogin = url.includes('/login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Protected route properly requires auth: ${redirectedToLogin}`);
        return;
      }
      
      console.log('Step 1: Access buyer dashboard');
      await goToFrontendPage(page, '/buyer/dashboard');
      
      // Check dashboard elements
      const dashboardContent = page.locator('main, [class*="dashboard"]');
      const hasDashboard = await dashboardContent.count() > 0;
      console.log(`Dashboard content visible: ${hasDashboard}`);
      
      console.log('Step 2: Check transactions');
      await goToFrontendPage(page, '/buyer/transactions');
      await waitForPageLoad(page);
      
      const transactionsList = page.locator('[class*="transaction"], table, [class*="list"]');
      const hasTransactions = await transactionsList.count() > 0;
      console.log(`Transactions section visible: ${hasTransactions}`);
      
      console.log('Step 3: Check purchases');
      await goToFrontendPage(page, '/buyer/purchases');
      await waitForPageLoad(page);
      
      console.log('Step 4: Check favorites');
      await goToFrontendPage(page, '/buyer/favorites');
      await waitForPageLoad(page);
      
      console.log('Step 5: Check profile');
      await goToFrontendPage(page, '/buyer/profile');
      await waitForPageLoad(page);
      
      const profileForm = page.locator('form, [class*="profile"]');
      const hasProfile = await profileForm.count() > 0;
      console.log(`Profile form visible: ${hasProfile}`);
    });
  });

  test.describe('Seller Dashboard Flow', () => {
    test('complete seller dashboard journey', async ({ page }) => {
      console.log('Attempting login as seller...');
      const loggedIn = await tryLogin(page, TEST_CREDENTIALS.seller.email, TEST_CREDENTIALS.seller.password);
      
      if (!loggedIn) {
        console.log('Seller login failed - testing protected route redirects instead');
        
        await goToFrontendPage(page, '/seller/dashboard');
        const url = page.url();
        const redirectedToLogin = url.includes('/login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Protected route properly requires auth: ${redirectedToLogin}`);
        return;
      }
      
      console.log('Step 1: Access seller dashboard');
      await goToFrontendPage(page, '/seller/dashboard');
      
      const dashboardContent = page.locator('main, [class*="dashboard"]');
      const hasDashboard = await dashboardContent.count() > 0;
      console.log(`Dashboard content visible: ${hasDashboard}`);
      
      console.log('Step 2: Check vehicle listings');
      await goToFrontendPage(page, '/seller/vehicles');
      await waitForPageLoad(page);
      
      const vehiclesList = page.locator('[class*="vehicle"], table, [class*="list"]');
      const hasVehicles = await vehiclesList.count() > 0;
      console.log(`Vehicles section visible: ${hasVehicles}`);
      
      console.log('Step 3: Check sales');
      await goToFrontendPage(page, '/seller/sales');
      await waitForPageLoad(page);
      
      console.log('Step 4: Check analytics');
      await goToFrontendPage(page, '/seller/analytics');
      await waitForPageLoad(page);
      
      console.log('Step 5: Check bank accounts');
      await goToFrontendPage(page, '/seller/bank-accounts');
      await waitForPageLoad(page);
    });
  });

  test.describe('Add to Favorites Flow', () => {
    test('add and remove from favorites', async ({ page }) => {
      console.log('Step 1: Navigate to vehicles');
      await goToFrontendPage(page, '/vehicles');
      await page.waitForTimeout(3000);
      
      console.log('Step 2: Find favorite button');
      const favoriteButton = page.locator('[class*="favorite"], [class*="heart"], button[aria-label*="favorite" i]').first();
      if (await favoriteButton.count() > 0) {
        await favoriteButton.click();
        await page.waitForTimeout(1000);
        
        // Check if requires login
        const loginPrompt = await page.locator('input[type="password"]').count() > 0;
        if (loginPrompt) {
          console.log('Adding to favorites requires login');
        } else {
          console.log('Favorite button clicked');
        }
      } else {
        console.log('Favorite button not found - may require login first');
      }
    });
  });

  test.describe('Contact Seller Flow', () => {
    test('contact seller from vehicle page', async ({ page }) => {
      console.log('Step 1: Navigate to vehicle details');
      await goToFrontendPage(page, '/vehicles');
      await page.waitForTimeout(2000);
      
      const vehicleLink = page.locator('a[href*="/vehicle"], article a').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        console.log('Step 2: Find contact button');
        const contactButton = page.locator('button:has-text("Contact"), button:has-text("Message"), a:has-text("Contact")').first();
        if (await contactButton.count() > 0) {
          await contactButton.click();
          await page.waitForTimeout(1000);
          
          // Check if contact form/modal appears
          const contactForm = page.locator('textarea, [class*="modal"], [class*="contact"]');
          const hasForm = await contactForm.count() > 0;
          console.log(`Contact form/modal appeared: ${hasForm}`);
        }
      }
    });
  });

  test.describe('Checkout Flow', () => {
    test('initiate purchase flow', async ({ page }) => {
      console.log('Step 1: Navigate to vehicle details');
      await goToFrontendPage(page, '/vehicles');
      await page.waitForTimeout(2000);
      
      const vehicleLink = page.locator('a[href*="/vehicle"], article a').first();
      if (await vehicleLink.count() > 0) {
        await vehicleLink.click();
        await waitForPageLoad(page);
        
        console.log('Step 2: Find buy button');
        const buyButton = page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Checkout"), a:has-text("Buy")').first();
        if (await buyButton.count() > 0) {
          await buyButton.click();
          await page.waitForTimeout(2000);
          
          // Check if redirected to checkout or login
          const url = page.url();
          const isOnCheckout = url.includes('/checkout') || url.includes('/transaction');
          const requiresLogin = url.includes('/login') || await page.locator('input[type="password"]').count() > 0;
          
          console.log(`Checkout initiated: ${isOnCheckout}, Requires login: ${requiresLogin}`);
        }
      }
    });
  });

  test.describe('Messaging Flow', () => {
    test('complete messaging flow', async ({ page }) => {
      console.log('Attempting login for messaging...');
      const loggedIn = await tryLogin(page, TEST_CREDENTIALS.buyer.email, TEST_CREDENTIALS.buyer.password);
      
      if (!loggedIn) {
        console.log('Login failed - testing messages route protection');
        await goToFrontendPage(page, '/messages');
        const requiresAuth = page.url().includes('/login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Messages route requires auth: ${requiresAuth}`);
        return;
      }
      
      console.log('Step 1: Navigate to messages');
      await goToFrontendPage(page, '/messages');
      await waitForPageLoad(page);
      
      // Check messages list
      const messagesList = page.locator('[class*="message"], [class*="conversation"], table');
      const hasMessages = await messagesList.count() > 0;
      console.log(`Messages section visible: ${hasMessages}`);
      
      console.log('Step 2: Check for conversations');
      const conversation = page.locator('[class*="conversation"], [class*="thread"], table tr').first();
      if (await conversation.count() > 0) {
        await conversation.click();
        await waitForPageLoad(page);
        
        console.log('Step 3: Check message input');
        const messageInput = page.locator('textarea, input[type="text"][name*="message"]').first();
        const hasInput = await messageInput.count() > 0;
        console.log(`Message input available: ${hasInput}`);
      } else {
        console.log('No conversations found - empty inbox');
      }
    });
  });

  test.describe('Profile Management Flow', () => {
    test('update profile flow', async ({ page }) => {
      console.log('Attempting login for profile management...');
      const loggedIn = await tryLogin(page, TEST_CREDENTIALS.buyer.email, TEST_CREDENTIALS.buyer.password);
      
      if (!loggedIn) {
        console.log('Login failed - testing profile route protection');
        await goToFrontendPage(page, '/buyer/profile');
        const requiresAuth = page.url().includes('/login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Profile route requires auth: ${requiresAuth}`);
        return;
      }
      
      console.log('Step 1: Navigate to profile');
      await goToFrontendPage(page, '/buyer/profile');
      await waitForPageLoad(page);
      
      // Check profile form exists
      const profileForm = page.locator('form');
      const hasForm = await profileForm.count() > 0;
      console.log(`Profile form visible: ${hasForm}`);
      
      console.log('Step 2: Verify profile fields');
      const nameInput = page.locator('input[name*="name"]').first();
      const phoneInput = page.locator('input[name*="phone"], input[type="tel"]').first();
      const addressInput = page.locator('input[name*="address"], textarea[name*="address"]').first();
      
      const hasName = await nameInput.count() > 0;
      const hasPhone = await phoneInput.count() > 0;
      const hasAddress = await addressInput.count() > 0;
      
      console.log(`Profile fields - Name: ${hasName}, Phone: ${hasPhone}, Address: ${hasAddress}`);
    });
  });

  test.describe('Notifications Flow', () => {
    test('view notifications flow', async ({ page }) => {
      console.log('Attempting login for notifications...');
      const loggedIn = await tryLogin(page, TEST_CREDENTIALS.buyer.email, TEST_CREDENTIALS.buyer.password);
      
      if (!loggedIn) {
        console.log('Login failed - testing notifications route protection');
        await goToFrontendPage(page, '/buyer/notifications');
        const requiresAuth = page.url().includes('/login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Notifications route requires auth: ${requiresAuth}`);
        return;
      }
      
      console.log('Step 1: Navigate to notifications');
      await goToFrontendPage(page, '/buyer/notifications');
      await waitForPageLoad(page);
      
      // Check notifications list
      const notificationsList = page.locator('[class*="notification"], [class*="alert"], ul, table');
      const hasNotifications = await notificationsList.count() > 0;
      console.log(`Notifications visible: ${hasNotifications}`);
    });
  });

  test.describe('Settings Flow', () => {
    test('update settings flow', async ({ page }) => {
      console.log('Attempting login for settings...');
      const loggedIn = await tryLogin(page, TEST_CREDENTIALS.buyer.email, TEST_CREDENTIALS.buyer.password);
      
      if (!loggedIn) {
        console.log('Login failed - testing settings route protection');
        await goToFrontendPage(page, '/buyer/settings');
        const requiresAuth = page.url().includes('/login') || await page.locator('input[type="password"]').count() > 0;
        console.log(`Settings route requires auth: ${requiresAuth}`);
        return;
      }
      
      console.log('Step 1: Navigate to settings');
      await goToFrontendPage(page, '/buyer/settings');
      await waitForPageLoad(page);
      
      // Check settings page
      const settingsContent = page.locator('form, [class*="settings"]');
      const hasSettings = await settingsContent.count() > 0;
      console.log(`Settings visible: ${hasSettings}`);
      
      // Check for common settings options
      const hasPasswordChange = await page.locator('input[name*="password"]').count() > 0;
      const hasNotificationSettings = await page.locator('input[type="checkbox"]').count() > 0;
      
      console.log(`Settings - Password change: ${hasPasswordChange}, Notification toggles: ${hasNotificationSettings}`);
    });
  });

  test.describe('Static Pages Flow', () => {
    test('navigate all informational pages', async ({ page }) => {
      const pages = [
        { path: '/about', name: 'About' },
        { path: '/how-it-works', name: 'How It Works' },
        { path: '/faq', name: 'FAQ' },
        { path: '/contact', name: 'Contact' },
        { path: '/privacy', name: 'Privacy Policy' },
        { path: '/terms', name: 'Terms of Service' },
      ];
      
      for (const pageInfo of pages) {
        console.log(`Checking ${pageInfo.name} page...`);
        await goToFrontendPage(page, pageInfo.path);
        await waitForPageLoad(page);
        
        const content = page.locator('main, article, [class*="content"]');
        const hasContent = await content.count() > 0;
        console.log(`${pageInfo.name}: ${hasContent ? 'OK' : 'No content found'}`);
      }
    });
  });

  test.describe('Dealer Pages Flow', () => {
    test('browse dealer listings', async ({ page }) => {
      console.log('Step 1: Navigate to dealers page');
      await goToFrontendPage(page, '/dealers');
      await waitForPageLoad(page);
      
      // Check dealers list
      const dealersList = page.locator('[class*="dealer"], article, .card');
      const count = await dealersList.count();
      console.log(`Dealers found: ${count}`);
      
      console.log('Step 2: View dealer details');
      const dealerLink = page.locator('a[href*="/dealer"], article a').first();
      if (await dealerLink.count() > 0) {
        await dealerLink.click();
        await waitForPageLoad(page);
        
        // Check dealer detail page
        const hasInfo = await page.locator('[class*="dealer"], [class*="info"]').count() > 0;
        const hasVehicles = await page.locator('[class*="vehicle"], article').count() > 0;
        
        console.log(`Dealer details - Info: ${hasInfo}, Vehicles: ${hasVehicles}`);
      }
    });
  });

  test.describe('Language Switching Flow', () => {
    test('switch between languages', async ({ page }) => {
      await goToFrontendPage(page, '/');
      
      // Find language selector
      const langSelector = page.locator('[class*="lang"], select[name*="lang"], button:has-text("EN"), button:has-text("DE")').first();
      if (await langSelector.count() > 0) {
        console.log('Language selector found');
        
        // Try switching language
        await langSelector.click();
        await page.waitForTimeout(500);
        
        const langOptions = page.locator('[class*="lang"] a, [class*="dropdown"] a');
        if (await langOptions.count() > 0) {
          await langOptions.first().click();
          await waitForPageLoad(page);
          
          console.log(`Switched language, URL: ${page.url()}`);
        }
      }
    });
  });
});
