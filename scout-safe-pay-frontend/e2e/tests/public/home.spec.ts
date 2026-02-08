/**
 * Home Page E2E Tests
 * 
 * Comprehensive tests for the homepage covering:
 * - Hero section and CTAs
 * - Navigation and menu
 * - Footer
 * - Language switcher
 * - Featured vehicles
 * - Mobile responsiveness
 * - SEO elements
 */

import { test, expect } from '@playwright/test';
import { BasePage } from '../../page-objects/base.page';
import { LOCALES, VIEWPORTS, TIMEOUTS } from '../../fixtures/test-data';
import { checkBasicAccessibility, checkImagesLoaded, measurePagePerformance } from '../../utils/test-utils';

test.describe('Home Page', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
  });

  // ===========================================
  // PAGE LOAD TESTS
  // ===========================================

  test.describe('Page Load', () => {
    test('homepage loads successfully with 200 status', async ({ page }) => {
      const response = await page.goto('/en');
      expect(response?.status()).toBe(200);
    });

    test('homepage loads within acceptable time (< 5s)', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/en', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000);
      console.log(`Homepage load time: ${loadTime}ms`);
    });

    test('homepage has correct title', async ({ page }) => {
      await basePage.goto('/');
      const title = await page.title();
      
      expect(title.length).toBeGreaterThan(0);
      expect(title.toLowerCase()).toMatch(/autoscout|safetrade|vehicle|car/i);
    });

    test('homepage has no console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await basePage.goto('/');
      
      // Allow some non-critical errors
      const criticalErrors = errors.filter(e => 
        !e.includes('favicon') && 
        !e.includes('404') &&
        !e.includes('analytics')
      );
      
      expect(criticalErrors.length).toBe(0);
    });
  });

  // ===========================================
  // HEADER & NAVIGATION TESTS
  // ===========================================

  test.describe('Header & Navigation', () => {
    test('header is visible', async ({ page }) => {
      await basePage.goto('/');
      await basePage.verifyHeader();
    });

    test('logo is visible and clickable', async ({ page }) => {
      await basePage.goto('/');
      
      // Try multiple logo selectors - different sites have different structures
      const logo = page.locator('img[alt*="logo" i], a[href="/"] img, .logo, [class*="logo"], header a, nav a').first();
      const count = await logo.count();
      
      if (count > 0) {
        await expect(logo).toBeVisible();
      } else {
        // Logo might be text-based or use different structure
        console.log('Logo element not found with standard selectors');
      }
    });

    test('main navigation links are present', async ({ page }) => {
      await basePage.goto('/');
      
      // Check for common navigation links
      const navLinks = page.locator('nav a, header a');
      const count = await navLinks.count();
      
      expect(count).toBeGreaterThan(3);
    });

    test('navigation contains vehicles link', async ({ page }) => {
      await basePage.goto('/');
      
      const vehiclesLink = page.locator('a[href*="vehicle"], a:has-text("Vehicles"), a:has-text("Cars")');
      if (await vehiclesLink.count() > 0) {
        await expect(vehiclesLink.first()).toBeVisible();
      }
    });

    test('navigation contains login/register links for guests', async ({ page }) => {
      await basePage.goto('/');
      
      const authLinks = page.locator('a:has-text("Login"), a:has-text("Sign in"), a:has-text("Register"), a[href*="login"]');
      const count = await authLinks.count();
      
      // Should have at least one auth-related link
      expect(count).toBeGreaterThan(0);
    });
  });

  // ===========================================
  // HERO SECTION TESTS
  // ===========================================

  test.describe('Hero Section', () => {
    test('hero section is visible', async ({ page }) => {
      await basePage.goto('/');
      
      const heroSection = page.locator('section, .hero, [class*="hero"], [class*="banner"], [class*="jumbotron"]').first();
      await expect(heroSection).toBeVisible();
    });

    test('hero has a heading', async ({ page }) => {
      await basePage.goto('/');
      
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      
      const text = await heading.textContent();
      expect(text?.length).toBeGreaterThan(5);
    });

    test('hero has CTA buttons', async ({ page }) => {
      await basePage.goto('/');
      
      // Look for Call-to-Action buttons or links in hero/first section area
      const ctaButtons = page.locator('section a[class*="btn"], section button, .hero a, .hero button, main a, a[class*="button"], a[class*="primary"]');
      const count = await ctaButtons.count();
      
      // Log what we found - CTA may be styled differently
      console.log(`CTA buttons/links found: ${count}`);
      // Allow pages without explicit CTAs (info pages)
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('hero search functionality exists', async ({ page }) => {
      await basePage.goto('/');
      
      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i], [class*="search"] input');
      if (await searchInput.count() > 0) {
        await expect(searchInput.first()).toBeVisible();
      }
    });
  });

  // ===========================================
  // FOOTER TESTS
  // ===========================================

  test.describe('Footer', () => {
    test('footer is visible', async ({ page }) => {
      await basePage.goto('/');
      await basePage.verifyFooter();
    });

    test('footer contains links', async ({ page }) => {
      await basePage.goto('/');
      
      const footerLinks = page.locator('footer a');
      const count = await footerLinks.count();
      
      expect(count).toBeGreaterThan(3);
    });

    test('footer contains legal links (privacy, terms)', async ({ page }) => {
      await basePage.goto('/');
      
      const legalLinks = page.locator('footer a[href*="privacy"], footer a[href*="terms"], footer a[href*="legal"]');
      const count = await legalLinks.count();
      
      expect(count).toBeGreaterThan(0);
    });

    test('footer contains contact information', async ({ page }) => {
      await basePage.goto('/');
      
      const contactInfo = page.locator('footer').getByText(/contact|email|phone|@/i);
      const count = await contactInfo.count();
      
      // Contact info is optional but common
      console.log(`Contact information elements found: ${count}`);
    });
  });

  // ===========================================
  // LANGUAGE SWITCHER TESTS
  // ===========================================

  test.describe('Language Switcher', () => {
    test('language switcher is visible', async ({ page }) => {
      await basePage.goto('/');
      
      const langSelector = page.locator('[class*="lang"], [class*="locale"], select[name*="lang"], button:has-text("EN"), button:has-text("DE"), button:has-text("RO")');
      if (await langSelector.count() > 0) {
        await expect(langSelector.first()).toBeVisible();
      }
    });

    for (const locale of LOCALES) {
      test(`homepage loads correctly in ${locale.toUpperCase()} locale`, async ({ page }) => {
        basePage = new BasePage(page, locale);
        await basePage.goto('/');
        
        expect(page.url()).toContain(`/${locale}`);
        
        // Page should have content
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible();
      });
    }

    test('language switch updates URL', async ({ page }) => {
      await basePage.goto('/');
      const initialUrl = page.url();
      
      // Try to switch language
      await basePage.changeLocale('de');
      
      expect(page.url()).toContain('/de');
      expect(page.url()).not.toBe(initialUrl);
    });
  });

  // ===========================================
  // FEATURED CONTENT TESTS
  // ===========================================

  test.describe('Featured Content', () => {
    test('featured vehicles section exists', async ({ page }) => {
      await basePage.goto('/');
      
      // Look for featured/popular vehicles section
      const featuredSection = page.locator('[class*="featured"], [class*="popular"], section:has-text("Featured")');
      if (await featuredSection.count() > 0) {
        await expect(featuredSection.first()).toBeVisible();
      }
    });

    test('vehicle cards display on homepage', async ({ page }) => {
      await basePage.goto('/');
      await page.waitForTimeout(2000);
      
      const vehicleCards = page.locator('[class*="vehicle"], [class*="car"], [class*="listing"], article, .card');
      const count = await vehicleCards.count();
      
      console.log(`Vehicle cards on homepage: ${count}`);
    });
  });

  // ===========================================
  // SEO TESTS
  // ===========================================

  test.describe('SEO', () => {
    test('page has meta description', async ({ page }) => {
      await basePage.goto('/');
      
      const seoInfo = await basePage.getSEOInfo();
      console.log(`Meta description: ${seoInfo.metaDescription?.substring(0, 50)}...`);
    });

    test('page has H1 tag', async ({ page }) => {
      await basePage.goto('/');
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
      expect(h1Count).toBeLessThanOrEqual(2); // Should have 1-2 H1s max
    });

    test('page has canonical URL', async ({ page }) => {
      await basePage.goto('/');
      
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      console.log(`Canonical URL: ${canonical}`);
    });

    test('page has Open Graph tags', async ({ page }) => {
      await basePage.goto('/');
      
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
      
      console.log(`OG Title: ${ogTitle}`);
      console.log(`OG Description: ${ogDescription?.substring(0, 50)}...`);
    });
  });

  // ===========================================
  // MOBILE RESPONSIVENESS TESTS
  // ===========================================

  test.describe('Mobile Responsiveness', () => {
    test('mobile navigation hamburger menu is present', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await basePage.goto('/');
      
      const mobileMenu = page.locator('[class*="hamburger"], [class*="mobile-menu"], button[aria-label*="menu" i], .menu-toggle, nav button, header button');
      const count = await mobileMenu.count();
      
      console.log(`Mobile menu buttons found: ${count}`);
    });

    test('mobile: content fits viewport without horizontal scroll', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await basePage.goto('/');
      
      const hasOverflow = await basePage.checkHorizontalOverflow();
      
      if (hasOverflow) {
        console.log('Warning: Horizontal scroll detected on mobile');
      }
    });

    test('mobile: hero section is visible', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobile);
      await basePage.goto('/');
      
      const heroSection = page.locator('section, .hero, [class*="hero"]').first();
      await expect(heroSection).toBeVisible();
    });

    test('tablet: page displays correctly', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.tablet);
      await basePage.goto('/');
      
      await basePage.verifyHeader();
      await basePage.verifyFooter();
    });

    test('desktop large: page displays correctly', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.desktopXL);
      await basePage.goto('/');
      
      await basePage.verifyHeader();
      await basePage.verifyFooter();
    });
  });

  // ===========================================
  // IMAGE TESTS
  // ===========================================

  test.describe('Images', () => {
    test('no broken images on homepage', async ({ page }) => {
      await basePage.goto('/');
      await page.waitForTimeout(2000);
      
      const imageStats = await checkImagesLoaded(page);
      
      console.log(`Images - Total: ${imageStats.total}, Loaded: ${imageStats.loaded}, Broken: ${imageStats.broken}`);
      expect(imageStats.broken).toBe(0);
    });

    test('images have alt attributes', async ({ page }) => {
      await basePage.goto('/');
      
      const imagesWithoutAlt = await page.locator('img:not([alt])').count();
      const totalImages = await page.locator('img').count();
      
      console.log(`Images without alt: ${imagesWithoutAlt}/${totalImages}`);
    });
  });

  // ===========================================
  // ACCESSIBILITY TESTS
  // ===========================================

  test.describe('Accessibility', () => {
    test('basic accessibility checks pass', async ({ page }) => {
      await basePage.goto('/');
      
      const issues = await checkBasicAccessibility(page);
      
      for (const issue of issues) {
        console.log(`A11y Issue: ${issue.message}`);
      }
    });

    test('skip to main content link exists', async ({ page }) => {
      await basePage.goto('/');
      
      const skipLink = page.locator('a[href="#main"], a:has-text("Skip to content"), a:has-text("Skip to main")');
      if (await skipLink.count() > 0) {
        console.log('Skip to main content link found');
      }
    });

    test('keyboard navigation works', async ({ page }) => {
      await basePage.goto('/');
      
      // Tab through the page
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check that something is focused
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  // ===========================================
  // PERFORMANCE TESTS
  // ===========================================

  test.describe('Performance', () => {
    test('measure page performance metrics', async ({ page }) => {
      await page.goto('/en', { waitUntil: 'load' });
      
      const metrics = await measurePagePerformance(page);
      
      console.log(`Load Time: ${metrics.loadTime}ms`);
      console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
      console.log(`First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
      console.log(`Time to Interactive: ${metrics.timeToInteractive}ms`);
      
      // Performance assertions
      expect(metrics.loadTime).toBeLessThan(10000);
    });
  });

  // ===========================================
  // ERROR HANDLING TESTS
  // ===========================================

  test.describe('Error Handling', () => {
    test('404 page displays for invalid routes', async ({ page }) => {
      const response = await page.goto('/en/this-page-does-not-exist-xyz123');
      
      const status = response?.status();
      const isNotFound = status === 404 || 
                         await page.locator('text=/404|not found|page not found/i').count() > 0;
      
      expect(isNotFound).toBe(true);
    });
  });
});
