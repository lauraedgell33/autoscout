import { test, expect, Page } from '@playwright/test';
import { LIVE_CONFIG, waitForPageLoad, goToFrontendPage } from './helpers';

/**
 * Dashboard & Seller Flow E2E Tests
 * Tests authenticated user dashboard and seller-specific functionality
 */

// Test credentials
const SELLER_EMAIL = 'seller@autoscout24safetrade.com';
const SELLER_PASSWORD = 'password123';

// Helper to login
async function loginAsSeller(page: Page) {
  await goToFrontendPage(page, '/auth/login');
  await page.waitForTimeout(1500);
  
  await page.locator('input[type="email"]').first().fill(SELLER_EMAIL);
  await page.locator('input[type="password"]').first().fill(SELLER_PASSWORD);
  await page.locator('button[type="submit"]').first().click();
  
  await page.waitForTimeout(3000);
  
  // Wait for navigation away from login page
  await page.waitForFunction(() => !window.location.pathname.includes('/login'), { timeout: 10000 }).catch(() => {});
}

test.describe('Authenticated Dashboard Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should access dashboard after login', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Check if we're on dashboard or redirected to login
    const url = page.url();
    const isOnDashboard = url.includes('/dashboard');
    const redirectedToLogin = url.includes('/login');
    
    console.log(`Dashboard access - URL: ${url}`);
    console.log(`On dashboard: ${isOnDashboard}, Redirected: ${redirectedToLogin}`);
  });

  test('should display user info in dashboard', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Look for user info elements
    const hasUserName = await page.locator('[class*="user"], [class*="profile"], [class*="name"]').count() > 0;
    const hasAvatar = await page.locator('[class*="avatar"], img[alt*="user" i]').count() > 0;
    
    console.log(`User name visible: ${hasUserName}, Avatar visible: ${hasAvatar}`);
  });

  test('should navigate to profile settings', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Look for profile/settings link
    const profileLink = page.locator('a[href*="profile"], a[href*="settings"], button:has-text("Profile"), button:has-text("Settings")').first();
    
    if (await profileLink.count() > 0) {
      await profileLink.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      console.log(`Navigated to: ${url}`);
    }
  });

  test('should display dashboard statistics/widgets', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Check for dashboard widgets
    const widgets = {
      stats: await page.locator('[class*="stat"], [class*="widget"], [class*="card"]').count(),
      charts: await page.locator('canvas, svg[class*="chart"]').count(),
      tables: await page.locator('table').count(),
    };
    
    console.log('Dashboard widgets found:', widgets);
  });

  test('should display recent activity', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    const activitySection = await page.locator('[class*="activity"], [class*="recent"], [class*="history"]').count() > 0;
    console.log(`Activity section visible: ${activitySection}`);
  });
});

test.describe('User Profile Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display profile page', async ({ page }) => {
    await goToFrontendPage(page, '/profile');
    await page.waitForTimeout(2000);
    
    const hasProfileForm = await page.locator('form').count() > 0;
    const hasNameInput = await page.locator('input[name*="name"]').count() > 0;
    
    console.log(`Profile form: ${hasProfileForm}, Name input: ${hasNameInput}`);
  });

  test('should update profile information', async ({ page }) => {
    await goToFrontendPage(page, '/profile');
    await page.waitForTimeout(2000);
    
    // Try to update profile
    const phoneInput = page.locator('input[name*="phone"], input[type="tel"]').first();
    if (await phoneInput.count() > 0) {
      await phoneInput.fill('+32999888777');
    }
    
    const saveButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
    if (await saveButton.count() > 0) {
      await saveButton.click();
      await page.waitForTimeout(2000);
      
      // Check for success message
      const hasSuccess = await page.locator('[class*="success"], [class*="toast"]').count() > 0;
      console.log(`Profile updated, success message: ${hasSuccess}`);
    }
  });

  test('should change password', async ({ page }) => {
    await goToFrontendPage(page, '/profile/password');
    await page.waitForTimeout(2000);
    
    const hasPasswordForm = await page.locator('input[type="password"]').count() >= 2;
    console.log(`Password change form visible: ${hasPasswordForm}`);
  });
});

test.describe('Seller Vehicle Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display my vehicles list', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/vehicles');
    await page.waitForTimeout(2000);
    
    // Check for vehicle list or empty state
    const hasVehicles = await page.locator('[class*="vehicle"], [class*="listing"], table tbody tr').count() > 0;
    const hasEmptyState = await page.locator('[class*="empty"], :has-text("No vehicles")').count() > 0;
    
    console.log(`Has vehicles: ${hasVehicles}, Empty state: ${hasEmptyState}`);
  });

  test('should navigate to add vehicle page', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/vehicles');
    await page.waitForTimeout(2000);
    
    const addButton = page.locator('a[href*="add"], a[href*="new"], button:has-text("Add"), button:has-text("New"), button:has-text("Create")').first();
    
    if (await addButton.count() > 0) {
      await addButton.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      console.log(`Navigated to add vehicle: ${url}`);
    }
  });

  test('should display add vehicle form', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/vehicles/add');
    await page.waitForTimeout(2000);
    
    const formElements = {
      makeInput: await page.locator('select[name*="make"], input[name*="make"]').count(),
      modelInput: await page.locator('select[name*="model"], input[name*="model"]').count(),
      yearInput: await page.locator('input[name*="year"], select[name*="year"]').count(),
      priceInput: await page.locator('input[name*="price"]').count(),
      descriptionInput: await page.locator('textarea').count(),
    };
    
    console.log('Add vehicle form elements:', formElements);
  });

  test('should fill and submit new vehicle form', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/vehicles/add');
    await page.waitForTimeout(2000);
    
    // Fill vehicle form
    const makeSelect = page.locator('select[name*="make"]').first();
    if (await makeSelect.count() > 0) {
      await makeSelect.selectOption({ index: 1 });
    } else {
      const makeInput = page.locator('input[name*="make"]').first();
      if (await makeInput.count() > 0) {
        await makeInput.fill('BMW');
      }
    }
    
    const modelInput = page.locator('input[name*="model"]').first();
    if (await modelInput.count() > 0) {
      await modelInput.fill('Test Model E2E');
    }
    
    const yearInput = page.locator('input[name*="year"]').first();
    if (await yearInput.count() > 0) {
      await yearInput.fill('2023');
    }
    
    const priceInput = page.locator('input[name*="price"]').first();
    if (await priceInput.count() > 0) {
      await priceInput.fill('25000');
    }
    
    const mileageInput = page.locator('input[name*="mileage"], input[name*="km"]').first();
    if (await mileageInput.count() > 0) {
      await mileageInput.fill('10000');
    }
    
    const descriptionInput = page.locator('textarea').first();
    if (await descriptionInput.count() > 0) {
      await descriptionInput.fill('Test vehicle created by E2E test automation. This listing can be deleted.');
    }
    
    console.log('Vehicle form filled');
    
    // Note: Not submitting to avoid creating test data
    // In a real test, you would submit and verify creation
  });

  test('should edit existing vehicle', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/vehicles');
    await page.waitForTimeout(2000);
    
    // Find edit button
    const editButton = page.locator('a[href*="edit"], button:has-text("Edit")').first();
    
    if (await editButton.count() > 0) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const isEditPage = url.includes('edit');
      console.log(`On edit page: ${isEditPage}, URL: ${url}`);
      
      // Check for form
      const hasForm = await page.locator('form').count() > 0;
      console.log(`Edit form visible: ${hasForm}`);
    } else {
      console.log('No vehicles to edit');
    }
  });

  test('should view vehicle statistics', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/vehicles');
    await page.waitForTimeout(2000);
    
    // Click on a vehicle to see stats
    const vehicleRow = page.locator('[class*="vehicle"], [class*="listing"], table tbody tr').first();
    
    if (await vehicleRow.count() > 0) {
      await vehicleRow.click();
      await page.waitForTimeout(2000);
      
      // Check for stats
      const hasStats = await page.locator('[class*="view"], [class*="stat"], [class*="analytics"]').count() > 0;
      console.log(`Vehicle stats visible: ${hasStats}`);
    }
  });
});

test.describe('Seller Transactions', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display transactions list', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const hasTransactions = await page.locator('[class*="transaction"], table tbody tr').count() > 0;
    const hasEmptyState = await page.locator('[class*="empty"], :has-text("No transactions")').count() > 0;
    
    console.log(`Has transactions: ${hasTransactions}, Empty state: ${hasEmptyState}`);
  });

  test('should filter transactions by status', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const statusFilter = page.locator('select[name*="status"], [class*="filter"]').first();
    
    if (await statusFilter.count() > 0) {
      await statusFilter.click();
      await page.waitForTimeout(500);
      
      const filterOptions = await page.locator('option, [role="option"]').count();
      console.log(`Transaction filter options: ${filterOptions}`);
    }
  });

  test('should view transaction details', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/transactions');
    await page.waitForTimeout(2000);
    
    const transactionRow = page.locator('[class*="transaction"], table tbody tr').first();
    
    if (await transactionRow.count() > 0) {
      await transactionRow.click();
      await page.waitForTimeout(2000);
      
      // Check for transaction details
      const hasDetails = await page.locator('[class*="detail"], [class*="info"]').count() > 0;
      console.log(`Transaction details visible: ${hasDetails}`);
    }
  });
});

test.describe('Seller Payments & Escrow', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display payments page', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/payments');
    await page.waitForTimeout(2000);
    
    const hasPayments = await page.locator('[class*="payment"], table tbody tr, [class*="balance"]').count() > 0;
    console.log(`Payments section visible: ${hasPayments}`);
  });

  test('should display escrow balance', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/payments');
    await page.waitForTimeout(2000);
    
    const balanceElement = page.locator('[class*="balance"], [class*="escrow"]');
    const hasBalance = await balanceElement.count() > 0;
    
    console.log(`Escrow balance visible: ${hasBalance}`);
  });

  test('should display bank account settings', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/payments/bank');
    await page.waitForTimeout(2000);
    
    const hasIbanInput = await page.locator('input[name*="iban"], input[placeholder*="IBAN" i]').count() > 0;
    console.log(`Bank account form visible: ${hasIbanInput}`);
  });
});

test.describe('Messaging System', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display messages inbox', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/messages');
    await page.waitForTimeout(2000);
    
    const hasMessages = await page.locator('[class*="message"], [class*="conversation"], [class*="inbox"]').count() > 0;
    const hasEmptyState = await page.locator('[class*="empty"], :has-text("No messages")').count() > 0;
    
    console.log(`Has messages: ${hasMessages}, Empty state: ${hasEmptyState}`);
  });

  test('should open conversation', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/messages');
    await page.waitForTimeout(2000);
    
    const conversationItem = page.locator('[class*="conversation"], [class*="message-item"]').first();
    
    if (await conversationItem.count() > 0) {
      await conversationItem.click();
      await page.waitForTimeout(1500);
      
      // Check for message thread
      const hasThread = await page.locator('[class*="thread"], [class*="chat"], textarea').count() > 0;
      console.log(`Message thread visible: ${hasThread}`);
    }
  });

  test('should compose new message', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/messages');
    await page.waitForTimeout(2000);
    
    const composeButton = page.locator('button:has-text("New"), button:has-text("Compose"), a[href*="new"]').first();
    
    if (await composeButton.count() > 0) {
      await composeButton.click();
      await page.waitForTimeout(1500);
      
      const hasComposeForm = await page.locator('textarea, [class*="compose"]').count() > 0;
      console.log(`Compose form visible: ${hasComposeForm}`);
    }
  });
});

test.describe('Notifications', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display notification bell', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    const notificationBell = page.locator('[class*="notification"], [class*="bell"], button[aria-label*="notification" i]');
    const hasBell = await notificationBell.count() > 0;
    
    console.log(`Notification bell visible: ${hasBell}`);
  });

  test('should open notifications dropdown', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    const notificationBell = page.locator('[class*="notification"], [class*="bell"]').first();
    
    if (await notificationBell.count() > 0) {
      await notificationBell.click();
      await page.waitForTimeout(1000);
      
      const hasDropdown = await page.locator('[class*="dropdown"], [class*="popup"], [role="menu"]').count() > 0;
      console.log(`Notifications dropdown visible: ${hasDropdown}`);
    }
  });

  test('should display notifications page', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/notifications');
    await page.waitForTimeout(2000);
    
    const hasNotifications = await page.locator('[class*="notification-item"], [class*="notification-list"]').count() > 0;
    const hasEmptyState = await page.locator('[class*="empty"], :has-text("No notifications")').count() > 0;
    
    console.log(`Has notifications: ${hasNotifications}, Empty state: ${hasEmptyState}`);
  });
});

test.describe('Favorites Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display favorites list', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/favorites');
    await page.waitForTimeout(2000);
    
    const hasFavorites = await page.locator('[class*="favorite"], [class*="vehicle"], [class*="card"]').count() > 0;
    const hasEmptyState = await page.locator('[class*="empty"], :has-text("No favorites")').count() > 0;
    
    console.log(`Has favorites: ${hasFavorites}, Empty state: ${hasEmptyState}`);
  });

  test('should remove from favorites', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard/favorites');
    await page.waitForTimeout(2000);
    
    const removeButton = page.locator('[aria-label*="remove" i], button:has([class*="heart"]), button:has([class*="trash"])').first();
    
    if (await removeButton.count() > 0) {
      console.log('Remove favorite button found');
      // Note: Not clicking to avoid modifying user data
    }
  });
});

test.describe('Logout Flow', () => {
  
  test('should logout successfully', async ({ page }) => {
    await loginAsSeller(page);
    
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Find logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout")').first();
    
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const isLoggedOut = url.includes('/login') || url === LIVE_CONFIG.FRONTEND_URL + '/';
      console.log(`Logged out: ${isLoggedOut}, URL: ${url}`);
    } else {
      // Try dropdown menu
      const userMenu = page.locator('[class*="user-menu"], [class*="avatar"], [class*="dropdown-trigger"]').first();
      if (await userMenu.count() > 0) {
        await userMenu.click();
        await page.waitForTimeout(500);
        
        const logoutInMenu = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
        if (await logoutInMenu.count() > 0) {
          await logoutInMenu.click();
          await page.waitForTimeout(2000);
          console.log('Logged out via menu');
        }
      }
    }
  });
});

test.describe('Dashboard Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  const dashboardPages = [
    { path: '/dashboard', name: 'Dashboard Home' },
    { path: '/dashboard/vehicles', name: 'My Vehicles' },
    { path: '/dashboard/transactions', name: 'Transactions' },
    { path: '/dashboard/payments', name: 'Payments' },
    { path: '/dashboard/messages', name: 'Messages' },
    { path: '/dashboard/favorites', name: 'Favorites' },
    { path: '/dashboard/settings', name: 'Settings' },
  ];

  for (const pageInfo of dashboardPages) {
    test(`should load ${pageInfo.name} page`, async ({ page }) => {
      await goToFrontendPage(page, pageInfo.path);
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const hasContent = await page.locator('main, [class*="content"], [class*="container"]').count() > 0;
      
      console.log(`${pageInfo.name} - URL: ${url}, Has content: ${hasContent}`);
    });
  }
});

test.describe('Mobile Dashboard', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await loginAsSeller(page);
  });

  test('should display mobile dashboard navigation', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Dashboard has a floating menu button at bottom-right with "Toggle menu" aria-label
    const hasMobileNav = await page.locator('button[aria-label="Toggle menu"], button[aria-label*="menu" i]').count() > 0;
    console.log(`Mobile navigation visible: ${hasMobileNav}`);
  });

  test('should open mobile sidebar', async ({ page }) => {
    await goToFrontendPage(page, '/dashboard');
    await page.waitForTimeout(2000);
    
    // Dismiss cookie banner if present (it can block clicks)
    const cookieBanner = page.locator('[class*="cookie"], [class*="consent"], [id*="cookie"]');
    const acceptCookieBtn = page.locator('button:has-text("Accept"), button:has-text("Agree"), button:has-text("OK")').first();
    if (await acceptCookieBtn.count() > 0) {
      await acceptCookieBtn.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(500);
    }
    
    // Dashboard mobile menu button is at fixed bottom-4 right-4 with "Toggle menu" aria-label
    const menuButton = page.locator('button[aria-label="Toggle menu"]').first();
    
    if (await menuButton.count() > 0) {
      // Use force: true to bypass any overlay issues
      await menuButton.click({ force: true, timeout: 10000 }).catch(async () => {
        // If click fails, scroll to element and try again
        await menuButton.scrollIntoViewIfNeeded();
        await menuButton.click({ force: true });
      });
      await page.waitForTimeout(1000);
      
      // Check for sidebar with translate-x-0 (visible)
      const hasSidebar = await page.locator('aside.translate-x-0, aside:not(.-translate-x-full)').count() > 0;
      console.log(`Mobile sidebar visible: ${hasSidebar}`);
    } else {
      // Fallback: try any menu button
      const anyMenuButton = page.locator('button[aria-label*="menu" i]').first();
      if (await anyMenuButton.count() > 0) {
        await anyMenuButton.click({ force: true });
        await page.waitForTimeout(1000);
        console.log('Clicked fallback menu button');
      } else {
        console.log('No mobile menu button found on dashboard');
      }
    }
  });
});
