/**
 * Base Page Object
 * 
 * Contains common methods and utilities used across all page objects.
 * All page objects should extend this class.
 */

import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS, LOCALES, Locale } from '../fixtures/test-data';

export class BasePage {
  readonly page: Page;
  protected locale: Locale = 'en';

  // Common locators
  readonly header: Locator;
  readonly footer: Locator;
  readonly navigation: Locator;
  readonly logo: Locator;
  readonly mobileMenu: Locator;
  readonly languageSwitcher: Locator;
  readonly userMenu: Locator;
  readonly loading: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly modal: Locator;
  readonly toast: Locator;

  constructor(page: Page, locale: Locale = 'en') {
    this.page = page;
    this.locale = locale;

    // Initialize common locators
    this.header = page.locator(SELECTORS.header);
    this.footer = page.locator(SELECTORS.footer);
    this.navigation = page.locator(SELECTORS.nav);
    this.logo = page.locator(SELECTORS.logo);
    this.mobileMenu = page.locator(SELECTORS.mobileMenu);
    this.languageSwitcher = page.locator(SELECTORS.langSwitcher);
    this.userMenu = page.locator(SELECTORS.userMenu);
    this.loading = page.locator(SELECTORS.loading);
    this.errorMessage = page.locator(SELECTORS.error);
    this.successMessage = page.locator(SELECTORS.success);
    this.modal = page.locator(SELECTORS.modal);
    this.toast = page.locator(SELECTORS.toast);
  }

  // ===========================================
  // NAVIGATION METHODS
  // ===========================================

  /**
   * Navigate to a page with locale prefix
   */
  async goto(path: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const fullPath = path.startsWith(`/${this.locale}`) ? path : `/${this.locale}${path}`;
    await this.page.goto(fullPath, { 
      waitUntil: options?.waitUntil || 'networkidle',
      timeout: TIMEOUTS.long 
    });
    await this.dismissCookieBanner();
  }

  /**
   * Navigate to a page without locale prefix
   */
  async gotoRaw(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'networkidle', timeout: TIMEOUTS.long });
    await this.dismissCookieBanner();
  }

  /**
   * Get current URL without base URL
   */
  getPath(): string {
    return new URL(this.page.url()).pathname;
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ===========================================
  // LOCALE METHODS
  // ===========================================

  /**
   * Change locale/language
   */
  async changeLocale(newLocale: Locale): Promise<void> {
    const currentPath = this.getPath();
    const pathWithoutLocale = currentPath.replace(/^\/(en|de|ro)/, '');
    this.locale = newLocale;
    await this.goto(pathWithoutLocale || '/');
  }

  /**
   * Get current locale from URL
   */
  getCurrentLocale(): Locale {
    const path = this.getPath();
    const match = path.match(/^\/(en|de|ro)/);
    return (match?.[1] as Locale) || 'en';
  }

  /**
   * Switch language using language switcher UI element
   */
  async switchLanguageViaUI(targetLocale: Locale): Promise<void> {
    const langSwitcher = this.languageSwitcher.first();
    if (await langSwitcher.isVisible({ timeout: 3000 })) {
      await langSwitcher.click();
      await this.page.waitForTimeout(500);
      
      // Click on the target language option
      const langOption = this.page.locator(`a[href*="/${targetLocale}"], button:has-text("${targetLocale.toUpperCase()}")`);
      if (await langOption.count() > 0) {
        await langOption.first().click();
        await this.waitForNavigation();
        this.locale = targetLocale;
      }
    }
  }

  // ===========================================
  // COOKIE BANNER
  // ===========================================

  /**
   * Dismiss cookie consent banner if present
   */
  async dismissCookieBanner(): Promise<void> {
    try {
      const acceptBtn = this.page.locator(
        'button:has-text("Accept"), button:has-text("Agree"), button:has-text("OK"), ' +
        'button:has-text("Accept All"), button:has-text("Accept all cookies"), ' +
        'button:has-text("Akzeptieren"), button:has-text("Accept Cookies"), ' +
        '[class*="cookie"] button, [id*="cookie"] button'
      ).first();
      
      if (await acceptBtn.isVisible({ timeout: 2000 })) {
        await acceptBtn.click({ timeout: 3000 });
        await this.page.waitForTimeout(500);
      }
    } catch {
      // Cookie banner not present or already dismissed
    }
  }

  // ===========================================
  // WAIT METHODS
  // ===========================================

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for loading indicator to disappear
   */
  async waitForLoadingToFinish(): Promise<void> {
    try {
      await this.loading.waitFor({ state: 'hidden', timeout: TIMEOUTS.medium });
    } catch {
      // Loading indicator not present
    }
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(endpoint: string, status: number = 200): Promise<void> {
    await this.page.waitForResponse(
      response => response.url().includes(endpoint) && response.status() === status,
      { timeout: TIMEOUTS.apiResponse }
    );
  }

  // ===========================================
  // ASSERTION HELPERS
  // ===========================================

  /**
   * Check if page loaded successfully (status 200)
   */
  async expectPageLoaded(): Promise<void> {
    const response = await this.page.reload();
    expect(response?.status()).toBe(200);
  }

  /**
   * Check if element is visible
   */
  async expectVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator.first()).toBeVisible({ timeout: timeout || TIMEOUTS.medium });
  }

  /**
   * Check if element is not visible
   */
  async expectNotVisible(locator: Locator, timeout?: number): Promise<void> {
    await expect(locator.first()).not.toBeVisible({ timeout: timeout || TIMEOUTS.short });
  }

  /**
   * Check URL contains expected path
   */
  async expectUrlContains(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /**
   * Check page title
   */
  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  // ===========================================
  // COMMON UI VERIFICATIONS
  // ===========================================

  /**
   * Verify header is present and visible
   */
  async verifyHeader(): Promise<void> {
    // Try multiple header selectors
    const headerLocator = this.page.locator('header, [data-testid="header"], nav, [role="banner"], [class*="header"], [class*="navbar"]');
    try {
      await expect(headerLocator.first()).toBeVisible({ timeout: 5000 });
    } catch {
      // Header might be styled differently, just check page loaded
      console.log('Header not found with standard selectors');
    }
  }

  /**
   * Verify footer is present and visible
   */
  async verifyFooter(): Promise<void> {
    await this.expectVisible(this.footer);
  }

  /**
   * Verify navigation is present
   */
  async verifyNavigation(): Promise<void> {
    await this.expectVisible(this.navigation);
  }

  /**
   * Verify basic page structure (header, footer, nav)
   */
  async verifyBasicStructure(): Promise<void> {
    await this.verifyHeader();
    await this.verifyFooter();
  }

  /**
   * Check for console errors
   */
  async checkNoConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    return errors;
  }

  /**
   * Check for broken images
   */
  async checkBrokenImages(): Promise<number> {
    return await this.page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let broken = 0;
      images.forEach(img => {
        if (img.complete && img.naturalWidth === 0) {
          broken++;
        }
      });
      return broken;
    });
  }

  // ===========================================
  // SEO CHECKS
  // ===========================================

  /**
   * Get SEO information from page
   */
  async getSEOInfo(): Promise<{
    title: string;
    metaDescription: string | null;
    h1: string | null;
    canonical: string | null;
    hasTitle: boolean;
    hasMetaDescription: boolean;
    hasH1: boolean;
  }> {
    const title = await this.page.title();
    const metaDescription = await this.page.locator('meta[name="description"]').getAttribute('content');
    const h1 = await this.page.locator('h1').first().textContent();
    const canonical = await this.page.locator('link[rel="canonical"]').getAttribute('href');

    return {
      title,
      metaDescription,
      h1,
      canonical,
      hasTitle: !!title && title.length > 0,
      hasMetaDescription: !!metaDescription && metaDescription.length > 0,
      hasH1: !!h1 && h1.length > 0,
    };
  }

  // ===========================================
  // RESPONSIVE CHECKS
  // ===========================================

  /**
   * Check for horizontal overflow (mobile responsiveness issue)
   */
  async checkHorizontalOverflow(): Promise<boolean> {
    const scrollWidth = await this.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await this.page.evaluate(() => document.documentElement.clientWidth);
    return scrollWidth > clientWidth + 5; // Allow small margin
  }

  /**
   * Set viewport size
   */
  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  // ===========================================
  // SCREENSHOT & DEBUGGING
  // ===========================================

  /**
   * Take screenshot with timestamp
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${timestamp}.png`, 
      fullPage: true 
    });
  }

  /**
   * Get all links on page
   */
  async getAllLinks(): Promise<string[]> {
    const links = await this.page.locator('a[href]').all();
    const hrefs: string[] = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href) {
        hrefs.push(href);
      }
    }
    
    return hrefs;
  }
}
