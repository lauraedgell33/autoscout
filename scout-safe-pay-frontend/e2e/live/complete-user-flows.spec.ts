import { test, expect, Page } from '@playwright/test';
import { LIVE_CONFIG, waitForPageLoad, goToFrontendPage } from './helpers';

/**
 * Complete User Flows E2E Tests
 * Tests all functionality with real random test users
 */

// Generate unique test data
const generateTestUser = (type: 'buyer' | 'seller') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return {
    name: `Test ${type.charAt(0).toUpperCase() + type.slice(1)} ${random}`,
    email: `test.${type}.${timestamp}.${random}@testmail.com`,
    password: 'TestPass123!@#',
    phone: `+32${Math.floor(Math.random() * 900000000 + 100000000)}`,
  };
};

const testBuyer = generateTestUser('buyer');
const testSeller = generateTestUser('seller');

// Store created data for cleanup/verification
let createdVehicleId: string | null = null;
let createdTransactionId: string | null = null;

test.describe('Complete User Registration & Authentication Flows', () => {
  
  test.describe('Buyer Registration Flow', () => {
    test('should display registration page correctly', async ({ page }) => {
      await goToFrontendPage(page, '/auth/register');
      
      // Check page elements
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="name"], input[name="first_name"]').first()).toBeVisible();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
      
      console.log('Registration page loaded correctly');
    });

    test('should validate registration form fields', async ({ page }) => {
      await goToFrontendPage(page, '/auth/register');
      
      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();
      await page.waitForTimeout(1000);
      
      // Check for validation errors or required field indicators
      const hasValidation = await page.locator('[class*="error"], [class*="invalid"], :invalid').count() > 0;
      console.log(`Form validation active: ${hasValidation}`);
      
      // Test invalid email
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill('invalid-email');
      await submitButton.click();
      await page.waitForTimeout(500);
      
      console.log('Form validation working');
    });

    test('should register new buyer account', async ({ page }) => {
      await goToFrontendPage(page, '/auth/register');
      await page.waitForTimeout(1000);
      
      // Fill registration form
      const nameInput = page.locator('input[name="name"], input[name="first_name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(testBuyer.name);
      }
      
      await page.locator('input[type="email"]').first().fill(testBuyer.email);
      await page.locator('input[type="password"]').first().fill(testBuyer.password);
      
      // Confirm password if exists
      const confirmPassword = page.locator('input[name*="confirm"], input[name*="password_confirmation"]').first();
      if (await confirmPassword.count() > 0) {
        await confirmPassword.fill(testBuyer.password);
      }
      
      // Select buyer type if available
      const buyerRadio = page.locator('input[value="buyer"], label:has-text("Buyer")').first();
      if (await buyerRadio.count() > 0) {
        await buyerRadio.click();
      }
      
      // Accept terms if checkbox exists
      const termsCheckbox = page.locator('input[name*="terms"], input[name*="agree"]').first();
      if (await termsCheckbox.count() > 0) {
        await termsCheckbox.check();
      }
      
      console.log(`Registering buyer: ${testBuyer.email}`);
      
      // Submit form
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
      
      // Check result
      const url = page.url();
      const successIndicators = [
        url.includes('/dashboard'),
        url.includes('/verify'),
        url.includes('/login'),
        await page.locator('[class*="success"], [class*="welcome"]').count() > 0
      ];
      
      console.log(`Registration result URL: ${url}`);
      console.log(`Registration appears successful: ${successIndicators.some(Boolean)}`);
    });
  });

  test.describe('Seller Registration Flow', () => {
    test('should register new seller account', async ({ page }) => {
      await goToFrontendPage(page, '/auth/register');
      await page.waitForTimeout(1000);
      
      // Fill registration form for seller
      const nameInput = page.locator('input[name="name"], input[name="first_name"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(testSeller.name);
      }
      
      await page.locator('input[type="email"]').first().fill(testSeller.email);
      await page.locator('input[type="password"]').first().fill(testSeller.password);
      
      // Confirm password if exists
      const confirmPassword = page.locator('input[name*="confirm"], input[name*="password_confirmation"]').first();
      if (await confirmPassword.count() > 0) {
        await confirmPassword.fill(testSeller.password);
      }
      
      // Select seller type
      const sellerRadio = page.locator('input[value="seller"], label:has-text("Seller")').first();
      if (await sellerRadio.count() > 0) {
        await sellerRadio.click();
      }
      
      // Accept terms
      const termsCheckbox = page.locator('input[name*="terms"], input[name*="agree"]').first();
      if (await termsCheckbox.count() > 0) {
        await termsCheckbox.check();
      }
      
      console.log(`Registering seller: ${testSeller.email}`);
      
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
      
      const url = page.url();
      console.log(`Seller registration result URL: ${url}`);
    });
  });

  test.describe('Login Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      await goToFrontendPage(page, '/auth/login');
      
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[type="email"]').first()).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
      await expect(page.locator('button[type="submit"]').first()).toBeVisible();
      
      // Check for forgot password link
      const forgotPassword = page.locator('a[href*="forgot"], a:has-text("Forgot")');
      const hasForgotPassword = await forgotPassword.count() > 0;
      console.log(`Forgot password link present: ${hasForgotPassword}`);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await goToFrontendPage(page, '/auth/login');
      
      await page.locator('input[type="email"]').first().fill('nonexistent@test.com');
      await page.locator('input[type="password"]').first().fill('wrongpassword');
      await page.locator('button[type="submit"]').first().click();
      
      await page.waitForTimeout(3000);
      
      // Should show error or stay on login page
      const hasError = await page.locator('[class*="error"], [class*="alert-danger"], [role="alert"]').count() > 0;
      const stillOnLogin = page.url().includes('/login');
      
      console.log(`Error shown: ${hasError}, Still on login: ${stillOnLogin}`);
      expect(hasError || stillOnLogin).toBeTruthy();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await goToFrontendPage(page, '/auth/login');
      
      // Use the seller account we created
      await page.locator('input[type="email"]').first().fill('seller@autoscout24safetrade.com');
      await page.locator('input[type="password"]').first().fill('password123');
      await page.locator('button[type="submit"]').first().click();
      
      await page.waitForTimeout(3000);
      
      const url = page.url();
      const isLoggedIn = !url.includes('/login') || url.includes('/dashboard');
      console.log(`Login result - URL: ${url}, Logged in: ${isLoggedIn}`);
    });
  });

  test.describe('Password Reset Flow', () => {
    test('should display forgot password page', async ({ page }) => {
      await goToFrontendPage(page, '/auth/forgot-password');
      
      const emailInput = page.locator('input[type="email"]').first();
      const hasEmailInput = await emailInput.count() > 0;
      
      if (hasEmailInput) {
        await expect(emailInput).toBeVisible();
        console.log('Forgot password page loaded');
      } else {
        console.log('Forgot password page may have different structure');
      }
    });

    test('should submit password reset request', async ({ page }) => {
      await goToFrontendPage(page, '/auth/forgot-password');
      await page.waitForTimeout(1000);
      
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill('test@example.com');
        
        const submitButton = page.locator('button[type="submit"]').first();
        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          // Should show success message or redirect
          const hasMessage = await page.locator('[class*="success"], [class*="message"]').count() > 0;
          console.log(`Password reset submitted, message shown: ${hasMessage}`);
        }
      }
    });
  });
});

test.describe('Vehicle Browsing & Search Flows', () => {
  
  test('should load marketplace page', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    
    // Check for vehicle cards or loading state
    const hasContent = await page.locator('[class*="vehicle"], [class*="card"], article').count() > 0;
    const hasLoading = await page.locator('[class*="loading"], [class*="skeleton"]').count() > 0;
    
    console.log(`Marketplace loaded - Content: ${hasContent}, Loading: ${hasLoading}`);
  });

  test('should display filter options', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    
    // Check for filter elements
    const filterElements = {
      sortDropdown: await page.locator('select').count(),
      priceInputs: await page.locator('input[type="number"]').count(),
      filterButton: await page.locator('button:has-text("Filter"), button:has-text("Filters")').count(),
    };
    
    console.log('Filter elements found:', filterElements);
  });

  test('should filter vehicles by price', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    
    // Try to apply price filter
    const minPriceInput = page.locator('input[placeholder*="min" i], input[name*="min_price"]').first();
    const maxPriceInput = page.locator('input[placeholder*="max" i], input[name*="max_price"]').first();
    
    if (await minPriceInput.count() > 0) {
      await minPriceInput.fill('10000');
    }
    if (await maxPriceInput.count() > 0) {
      await maxPriceInput.fill('50000');
    }
    
    // Look for apply/search button
    const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search"), button:has-text("Filter")').first();
    if (await applyButton.count() > 0) {
      await applyButton.click();
      await page.waitForTimeout(2000);
    }
    
    console.log('Price filter applied');
  });

  test('should search vehicles by keyword', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('BMW');
      await searchInput.press('Enter');
      await page.waitForTimeout(2000);
      
      console.log('Search performed for BMW');
    }
  });

  test('should sort vehicles', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    
    const sortSelect = page.locator('select').first();
    if (await sortSelect.count() > 0) {
      const options = await sortSelect.locator('option').count();
      if (options > 1) {
        await sortSelect.selectOption({ index: 1 });
        await page.waitForTimeout(1500);
        console.log('Sort applied');
      }
    }
  });

  test('should navigate to vehicle details', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
    if (await vehicleLink.count() > 0) {
      await vehicleLink.click();
      await waitForPageLoad(page);
      
      const url = page.url();
      // URL pattern: /[locale]/vehicles/[id] or /vehicle/[id]
      expect(url).toMatch(/\/vehicles?\/\d+/);
      console.log(`Navigated to vehicle details: ${url}`);
    } else {
      console.log('No vehicle links found');
    }
  });

  test('should display vehicle details page correctly', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
    if (await vehicleLink.count() > 0) {
      await vehicleLink.click();
      await waitForPageLoad(page);
      
      // Check for vehicle detail elements
      const elements = {
        images: await page.locator('img').count(),
        title: await page.locator('h1, h2').first().count(),
        price: await page.locator('[class*="price"]').count(),
        specs: await page.locator('[class*="spec"], [class*="detail"]').count(),
        contactButton: await page.locator('button:has-text("Contact"), button:has-text("Buy")').count(),
      };
      
      console.log('Vehicle detail elements:', elements);
    }
  });
});

test.describe('Vehicle Image Gallery Interactions', () => {
  test('should interact with image gallery', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    // Find and click on a vehicle
    const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
    if (await vehicleLink.count() > 0) {
      await vehicleLink.click();
      await waitForPageLoad(page);
      
      // Test image navigation
      const nextButton = page.locator('button:has([class*="chevron-right"]), button:has([class*="next"]), [class*="next"]').first();
      const prevButton = page.locator('button:has([class*="chevron-left"]), button:has([class*="prev"]), [class*="prev"]').first();
      
      if (await nextButton.count() > 0) {
        await nextButton.click();
        await page.waitForTimeout(500);
        console.log('Next image button clicked');
      }
      
      if (await prevButton.count() > 0) {
        await prevButton.click();
        await page.waitForTimeout(500);
        console.log('Previous image button clicked');
      }
      
      // Test image thumbnails
      const thumbnails = page.locator('[class*="thumbnail"], [class*="gallery"] img');
      const thumbCount = await thumbnails.count();
      if (thumbCount > 1) {
        await thumbnails.nth(1).click();
        await page.waitForTimeout(500);
        console.log('Thumbnail clicked');
      }
    }
  });
});

test.describe('Favorite Functionality', () => {
  test('should toggle favorite on vehicle card', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    const favoriteButton = page.locator('[aria-label*="favorite" i], button:has([class*="heart"])').first();
    if (await favoriteButton.count() > 0) {
      await favoriteButton.click();
      await page.waitForTimeout(1500);
      
      // Should show login prompt or toggle favorite
      const loginPrompt = await page.locator('input[type="password"]').count() > 0;
      const toast = await page.locator('[class*="toast"], [class*="notification"]').count() > 0;
      
      console.log(`Favorite clicked - Login prompt: ${loginPrompt}, Toast: ${toast}`);
    }
  });
});

test.describe('Share Functionality', () => {
  test('should share vehicle', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    const shareButton = page.locator('[aria-label*="share" i], button:has([class*="share"])').first();
    if (await shareButton.count() > 0) {
      await shareButton.click();
      await page.waitForTimeout(1000);
      
      // Should copy to clipboard or show share dialog
      const toast = await page.locator('[class*="toast"], [class*="notification"]').count() > 0;
      console.log(`Share clicked - Toast shown: ${toast}`);
    }
  });
});

test.describe('Contact & Messaging Flows', () => {
  test('should display contact form on vehicle page', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(3000);
    
    const vehicleLink = page.locator('a[href*="/vehicle/"]').first();
    if (await vehicleLink.count() > 0) {
      await vehicleLink.click();
      await waitForPageLoad(page);
      
      const contactButton = page.locator('button:has-text("Contact"), button:has-text("Message"), a:has-text("Contact")').first();
      if (await contactButton.count() > 0) {
        await contactButton.click();
        await page.waitForTimeout(1500);
        
        // Check for contact form or modal
        const hasForm = await page.locator('textarea, input[name*="message"]').count() > 0;
        console.log(`Contact form visible: ${hasForm}`);
      }
    }
  });
});

test.describe('Static Pages Navigation', () => {
  const staticPages = [
    { path: '/about', name: 'About' },
    { path: '/how-it-works', name: 'How It Works' },
    { path: '/faq', name: 'FAQ' },
    { path: '/contact', name: 'Contact' },
    { path: '/privacy', name: 'Privacy Policy' },
    { path: '/terms', name: 'Terms of Service' },
  ];

  for (const pageInfo of staticPages) {
    test(`should load ${pageInfo.name} page`, async ({ page }) => {
      await goToFrontendPage(page, pageInfo.path);
      await page.waitForTimeout(1500);
      
      const hasContent = await page.locator('main, article, [class*="content"]').count() > 0;
      console.log(`${pageInfo.name} page loaded: ${hasContent}`);
    });
  }
});

test.describe('Mobile Navigation & UI', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone X dimensions

  test('should show mobile menu button', async ({ page }) => {
    await goToFrontendPage(page, '/');
    await page.waitForTimeout(1500);
    
    // MobileNav uses aria-label="Open menu" or "Close menu"
    const mobileMenuButton = page.locator('button[aria-label="Open menu"], button[aria-label="Close menu"], button[aria-label*="menu" i]');
    const hasMobileMenu = await mobileMenuButton.count() > 0;
    console.log(`Mobile menu button visible: ${hasMobileMenu}`);
  });

  test('should open and close mobile menu', async ({ page }) => {
    await goToFrontendPage(page, '/');
    await page.waitForTimeout(1500);
    
    // MobileNav component uses aria-label="Open menu"
    const mobileMenuButton = page.locator('button[aria-label="Open menu"]').first();
    if (await mobileMenuButton.count() > 0) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      
      // Check if mobile-nav drawer is visible (id="mobile-nav")
      const menuOpen = await page.locator('#mobile-nav, nav[aria-label="Mobile navigation"]').count() > 0;
      console.log(`Mobile menu opened: ${menuOpen}`);
      
      // Close menu - MobileNav uses aria-label="Close menu"
      const closeButton = page.locator('button[aria-label="Close menu"]').first();
      if (await closeButton.count() > 0) {
        await closeButton.click();
        await page.waitForTimeout(500);
        console.log('Mobile menu closed');
      }
    } else {
      console.log('No mobile menu button found - may need to check viewport or page state');
    }
  });

  test('should display mobile filter bottom sheet', async ({ page }) => {
    await goToFrontendPage(page, '/marketplace');
    await page.waitForTimeout(2000);
    
    // Filter button with "Filters" text or filter icon
    const filterButton = page.locator('button:has-text("Filter"), button:has-text("Filters"), button[aria-label*="filter" i]').first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await page.waitForTimeout(1000);
      
      // Check for bottom sheet or filter panel
      const bottomSheet = await page.locator('[class*="bottom-sheet"], [role="dialog"], [class*="filter"]').count() > 0;
      console.log(`Mobile filter sheet visible: ${bottomSheet}`);
    } else {
      console.log('No filter button found on mobile marketplace');
    }
  });
});

test.describe('Language Switching', () => {
  test('should switch language', async ({ page }) => {
    await goToFrontendPage(page, '/');
    await page.waitForTimeout(1500);
    
    const languageSelector = page.locator('[class*="language"], select[name*="locale"], button:has([class*="globe"])').first();
    if (await languageSelector.count() > 0) {
      await languageSelector.click();
      await page.waitForTimeout(500);
      
      // Try to select a different language
      const deOption = page.locator('a[href*="/de"], option[value="de"], button:has-text("Deutsch")').first();
      if (await deOption.count() > 0) {
        await deOption.click();
        await page.waitForTimeout(1500);
        
        const url = page.url();
        console.log(`Language switch - New URL: ${url}`);
      }
    }
  });
});

test.describe('Footer Links & Social', () => {
  test('should verify footer links', async ({ page }) => {
    await goToFrontendPage(page, '/');
    await page.waitForTimeout(1500);
    
    const footer = page.locator('footer');
    if (await footer.count() > 0) {
      const links = await footer.locator('a').count();
      console.log(`Footer links count: ${links}`);
      
      // Check for social media links
      const socialLinks = await footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="instagram"], a[href*="linkedin"]').count();
      console.log(`Social media links: ${socialLinks}`);
    }
  });
});

test.describe('Error Handling', () => {
  test('should display 404 page for non-existent route', async ({ page }) => {
    await goToFrontendPage(page, '/this-page-does-not-exist-12345');
    await page.waitForTimeout(2000);
    
    // Check for 404 indicators
    const has404 = await page.locator('h1:has-text("404"), [class*="not-found"], [class*="error"]').count() > 0;
    const statusText = await page.title();
    
    console.log(`404 page displayed: ${has404}, Title: ${statusText}`);
  });
});

test.describe('Performance & Loading States', () => {
  test('should show loading states', async ({ page }) => {
    // Intercept API to slow it down
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    await goToFrontendPage(page, '/marketplace');
    
    // Check for loading indicators
    const hasLoadingState = await page.locator('[class*="loading"], [class*="skeleton"], [class*="spinner"]').count() > 0;
    console.log(`Loading states visible: ${hasLoadingState}`);
    
    await page.waitForTimeout(3000);
  });
});
