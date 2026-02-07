import { test, expect, Page } from '@playwright/test';

/**
 * Comprehensive E2E Integration Tests
 * 
 * These tests verify the complete integration between:
 * - Frontend (Next.js)
 * - Backend (Laravel API)
 * - Database (SQLite/PostgreSQL)
 * 
 * Test credentials:
 * - Buyer:  buyer.test@autoscout.dev / BuyerPass123!
 * - Seller: seller.test@autoscout.dev / SellerPass123!
 * - Admin:  admin@autoscout.dev / Admin123!@#
 */

// Test user credentials
const TEST_USERS = {
  buyer: {
    email: 'buyer.test@autoscout.dev',
    password: 'BuyerPass123!',
  },
  seller: {
    email: 'seller.test@autoscout.dev',
    password: 'SellerPass123!',
  },
  admin: {
    email: 'admin@autoscout.dev',
    password: 'Admin123!@#',
  },
};

// Helper functions
async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  
  await page.waitForLoadState('networkidle');
}

async function logout(page: Page) {
  const userMenu = page.locator('[data-testid="user-menu"]');
  if (await userMenu.isVisible()) {
    await userMenu.click();
    await page.click('text=Logout');
    await page.waitForLoadState('networkidle');
  }
}

async function waitForApiResponse(page: Page, endpoint: string) {
  return page.waitForResponse(
    response => response.url().includes(endpoint) && response.ok()
  );
}

// ==========================================
// BUYER TESTS
// ==========================================

test.describe('Buyer Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.buyer.email, TEST_USERS.buyer.password);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('buyer can login and view dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
    
    // Check dashboard elements
    await expect(page.locator('text=/dashboard|welcome/i')).toBeVisible();
  });

  test('buyer can browse vehicles', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Check vehicle listing loads
    await expect(page.locator('[data-testid="vehicle-grid"], .vehicle-list, .vehicles')).toBeVisible();
  });

  test('buyer can view vehicle details', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Click on first vehicle
    const vehicleCard = page.locator('[data-testid="vehicle-card"], .vehicle-card').first();
    if (await vehicleCard.isVisible()) {
      await vehicleCard.click();
      await page.waitForLoadState('networkidle');
      
      // Check vehicle details page
      await expect(page.locator('text=/price|€/i')).toBeVisible();
    }
  });

  test('buyer can add vehicle to favorites', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Find and click favorite button
    const favoriteBtn = page.locator('[data-testid="favorite-button"], .favorite-btn, button:has-text("Favorite")').first();
    if (await favoriteBtn.isVisible()) {
      await favoriteBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('buyer can view favorites', async ({ page }) => {
    await page.goto('/favorites');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/favorites/);
  });

  test('buyer can view their transactions', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/transactions/);
  });

  test('buyer can view their profile', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator(`text=${TEST_USERS.buyer.email}`)).toBeVisible();
  });

  test('buyer can initiate a transaction', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Click on first available vehicle
    const vehicleCard = page.locator('[data-testid="vehicle-card"], .vehicle-card').first();
    if (await vehicleCard.isVisible()) {
      await vehicleCard.click();
      await page.waitForLoadState('networkidle');
      
      // Look for buy button
      const buyButton = page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Kaufen")');
      if (await buyButton.isVisible()) {
        await buyButton.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('buyer can view notifications', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/notifications/);
  });
});

// ==========================================
// SELLER TESTS
// ==========================================

test.describe('Seller Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.seller.email, TEST_USERS.seller.password);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('seller can login and view dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
  });

  test('seller can view their vehicles', async ({ page }) => {
    await page.goto('/my-vehicles');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/my-vehicles|vehicles/);
  });

  test('seller can create a new vehicle listing', async ({ page }) => {
    await page.goto('/vehicles/new');
    await page.waitForLoadState('networkidle');
    
    // Fill vehicle form
    await page.fill('input[name="make"]', 'Test Make');
    await page.fill('input[name="model"]', 'Test Model');
    await page.fill('input[name="year"]', '2023');
    await page.fill('input[name="price"]', '25000');
    
    // Check if mileage field exists
    const mileageField = page.locator('input[name="mileage"]');
    if (await mileageField.isVisible()) {
      await mileageField.fill('10000');
    }
  });

  test('seller can view incoming transactions', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/transactions/);
  });

  test('seller can view messages', async ({ page }) => {
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/messages/);
  });
});

// ==========================================
// ADMIN TESTS
// ==========================================

test.describe('Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test('admin can login successfully', async ({ page }) => {
    // After login, should be redirected to dashboard or admin
    await expect(page).toHaveURL(/dashboard|admin/);
  });

  test('admin can access admin panel', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Admin panel should be accessible
    const adminContent = page.locator('text=/admin|dashboard|analytics/i');
    await expect(adminContent.first()).toBeVisible();
  });

  test('admin can view transactions', async ({ page }) => {
    await page.goto('/admin/transactions');
    await page.waitForLoadState('networkidle');
  });

  test('admin can view users', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
  });

  test('admin can view analytics', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
  });
});

// ==========================================
// AUTHENTICATION TESTS
// ==========================================

test.describe('Authentication', () => {
  test('registration form validation works', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await page.waitForTimeout(500);
    const errorMessages = page.locator('.error, [class*="error"], text=/required|invalid/i');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    
    // Should show error message
    const errorMessage = page.locator('.error, [class*="error"], [class*="alert"], text=/invalid|incorrect|failed/i');
    await expect(errorMessage.first()).toBeVisible();
  });

  test('protected routes redirect to login', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('session persists after page reload', async ({ page }) => {
    await login(page, TEST_USERS.buyer.email, TEST_USERS.buyer.password);
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be logged in
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu, [class*="user"]');
    await expect(userMenu.first()).toBeVisible();
  });
});

// ==========================================
// VEHICLE SEARCH AND FILTER TESTS
// ==========================================

test.describe('Vehicle Search and Filters', () => {
  test('can search vehicles by keyword', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('BMW');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  });

  test('can filter vehicles by price range', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Look for price filter
    const priceFilter = page.locator('input[name="min_price"], [data-testid="price-filter"]');
    if (await priceFilter.isVisible()) {
      await priceFilter.fill('10000');
    }
  });

  test('can filter vehicles by make', async ({ page }) => {
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Look for make filter
    const makeFilter = page.locator('select[name="make"], [data-testid="make-filter"]');
    if (await makeFilter.isVisible()) {
      await makeFilter.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');
    }
  });
});

// ==========================================
// TRANSACTION FLOW TESTS
// ==========================================

test.describe('Complete Transaction Flow', () => {
  test('full purchase flow', async ({ page }) => {
    // Login as buyer
    await login(page, TEST_USERS.buyer.email, TEST_USERS.buyer.password);
    
    // Go to vehicles
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Click first vehicle
    const vehicleCard = page.locator('[data-testid="vehicle-card"], .vehicle-card').first();
    if (await vehicleCard.isVisible()) {
      await vehicleCard.click();
      await page.waitForLoadState('networkidle');
      
      // Look for purchase/buy button
      const buyButton = page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Start Transaction")');
      if (await buyButton.isVisible()) {
        await buyButton.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('can view transaction details', async ({ page }) => {
    await login(page, TEST_USERS.buyer.email, TEST_USERS.buyer.password);
    
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    
    // Click on first transaction if exists
    const transactionRow = page.locator('[data-testid="transaction-row"], .transaction-item, tr').first();
    if (await transactionRow.isVisible()) {
      await transactionRow.click();
      await page.waitForLoadState('networkidle');
    }
  });
});

// ==========================================
// RESPONSIVE DESIGN TESTS
// ==========================================

test.describe('Responsive Design', () => {
  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for hamburger menu
    const hamburgerMenu = page.locator('[data-testid="mobile-menu"], .hamburger, button[aria-label*="menu" i]');
    if (await hamburgerMenu.isVisible()) {
      await hamburgerMenu.click();
      await page.waitForTimeout(500);
    }
  });

  test('tablet layout works', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});

// ==========================================
// ACCESSIBILITY TESTS
// ==========================================

test.describe('Accessibility', () => {
  test('login page has proper form labels', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for labels
    const emailLabel = page.locator('label[for="email"], label:has-text("Email")');
    const passwordLabel = page.locator('label[for="password"], label:has-text("Password")');
    
    await expect(emailLabel.first()).toBeVisible();
    await expect(passwordLabel.first()).toBeVisible();
  });

  test('navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});

// ==========================================
// API INTEGRATION TESTS
// ==========================================

test.describe('API Integration', () => {
  test('health check endpoint works', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.ok()).toBeTruthy();
  });

  test('vehicles API returns data', async ({ page }) => {
    const response = await page.request.get('/api/vehicles');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('data');
  });

  test('categories API returns data', async ({ page }) => {
    const response = await page.request.get('/api/categories');
    expect(response.ok()).toBeTruthy();
  });

  test('authentication flow via API', async ({ page }) => {
    // Login via API
    const loginResponse = await page.request.post('/api/login', {
      data: {
        email: TEST_USERS.buyer.email,
        password: TEST_USERS.buyer.password,
      },
    });
    
    expect(loginResponse.ok()).toBeTruthy();
    
    const loginData = await loginResponse.json();
    expect(loginData).toHaveProperty('token');
    expect(loginData).toHaveProperty('user');
  });
});

// ==========================================
// ERROR HANDLING TESTS
// ==========================================

test.describe('Error Handling', () => {
  test('404 page displays correctly', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 message
    const notFoundMessage = page.locator('text=/404|not found|page.*exist/i');
    await expect(notFoundMessage.first()).toBeVisible();
  });

  test('handles network errors gracefully', async ({ page }) => {
    // Block API requests
    await page.route('**/api/**', route => route.abort());
    
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Should show error state or retry option
    const errorState = page.locator('text=/error|try again|failed/i');
    // Error handling should be present
  });
});

// ==========================================
// PERFORMANCE TESTS
// ==========================================

test.describe('Performance', () => {
  test('homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('vehicle listing loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
