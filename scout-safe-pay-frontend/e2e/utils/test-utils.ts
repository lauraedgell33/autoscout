/**
 * Test Utilities for E2E Tests
 * 
 * Contains helper functions for performance testing, accessibility checks,
 * and common test operations.
 */

import { Page, expect, Locator } from '@playwright/test';
import { TIMEOUTS, VIEWPORTS } from '../fixtures/test-data';

// ===========================================
// PERFORMANCE UTILITIES
// ===========================================

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
}

/**
 * Measure page load performance
 */
export async function measurePagePerformance(page: Page): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  // Get performance timing data
  const performanceData = await page.evaluate(() => {
    const timing = performance.timing;
    const paintEntries = performance.getEntriesByType('paint');
    
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    const lcp = performance.getEntriesByType('largest-contentful-paint').pop();
    
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      firstContentfulPaint: fcp ? fcp.startTime : 0,
      largestContentfulPaint: lcp ? (lcp as any).startTime : 0,
      timeToInteractive: timing.domInteractive - timing.navigationStart,
    };
  });
  
  return {
    loadTime,
    ...performanceData,
  };
}

/**
 * Assert page loads within acceptable time
 */
export async function assertLoadTimeUnder(page: Page, maxMs: number): Promise<void> {
  const metrics = await measurePagePerformance(page);
  expect(metrics.loadTime).toBeLessThan(maxMs);
}

// ===========================================
// ACCESSIBILITY UTILITIES
// ===========================================

export interface A11yIssue {
  type: string;
  message: string;
  element?: string;
}

/**
 * Check basic accessibility issues
 */
export async function checkBasicAccessibility(page: Page): Promise<A11yIssue[]> {
  const issues: A11yIssue[] = [];
  
  // Check for images without alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'missing-alt',
      message: `${imagesWithoutAlt} images without alt text`,
    });
  }
  
  // Check for empty links
  const emptyLinks = await page.locator('a:not([aria-label]):not(:has(*))').filter({
    hasText: /^$/
  }).count();
  if (emptyLinks > 0) {
    issues.push({
      type: 'empty-link',
      message: `${emptyLinks} empty links without text or aria-label`,
    });
  }
  
  // Check for form inputs without labels
  const inputsWithoutLabel = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
    let count = 0;
    inputs.forEach(input => {
      const id = input.id;
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      if (!hasLabel && !hasAriaLabel) {
        count++;
      }
    });
    return count;
  });
  if (inputsWithoutLabel > 0) {
    issues.push({
      type: 'input-without-label',
      message: `${inputsWithoutLabel} form inputs without labels`,
    });
  }
  
  // Check for buttons without accessible names
  const buttonsWithoutNames = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let count = 0;
    buttons.forEach(button => {
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.hasAttribute('aria-label');
      const hasTitle = button.hasAttribute('title');
      if (!hasText && !hasAriaLabel && !hasTitle) {
        count++;
      }
    });
    return count;
  });
  if (buttonsWithoutNames > 0) {
    issues.push({
      type: 'button-without-name',
      message: `${buttonsWithoutNames} buttons without accessible names`,
    });
  }
  
  return issues;
}

/**
 * Check keyboard navigation works
 */
export async function checkKeyboardNavigation(page: Page): Promise<boolean> {
  // Tab through the page
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Check that something is focused
    const hasFocus = await page.evaluate(() => {
      return document.activeElement !== document.body;
    });
    
    if (hasFocus) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check focus visibility
 */
export async function checkFocusVisibility(page: Page): Promise<boolean> {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  
  const hasFocusStyle = await page.evaluate(() => {
    const focused = document.activeElement;
    if (!focused || focused === document.body) return false;
    
    const styles = window.getComputedStyle(focused);
    const hasOutline = styles.outline !== 'none' && styles.outlineWidth !== '0px';
    const hasBoxShadow = styles.boxShadow !== 'none';
    const hasBorder = styles.borderColor !== 'transparent';
    
    return hasOutline || hasBoxShadow || hasBorder;
  });
  
  return hasFocusStyle;
}

// ===========================================
// RESPONSIVE UTILITIES
// ===========================================

/**
 * Test page at multiple viewports
 */
export async function testAtViewports(
  page: Page,
  viewports: Array<{ name: string; width: number; height: number }>,
  testFn: (viewport: { name: string; width: number; height: number }) => Promise<void>
): Promise<void> {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(500);
    await testFn(viewport);
  }
}

/**
 * Check mobile menu is present on mobile viewport
 */
export async function checkMobileMenu(page: Page): Promise<boolean> {
  await page.setViewportSize(VIEWPORTS.mobile);
  await page.waitForTimeout(500);
  
  const mobileMenu = page.locator('[class*="hamburger"], [class*="mobile-menu"], button[aria-label*="menu" i], .menu-toggle');
  return await mobileMenu.count() > 0;
}

// ===========================================
// FORM UTILITIES
// ===========================================

/**
 * Fill form with data
 */
export async function fillForm(
  page: Page,
  formData: Record<string, string>,
  options?: { clearFirst?: boolean }
): Promise<void> {
  for (const [name, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
    
    if (await input.count() > 0) {
      const tagName = await input.first().evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'select') {
        await input.first().selectOption(value);
      } else {
        if (options?.clearFirst) {
          await input.first().clear();
        }
        await input.first().fill(value);
      }
    }
  }
}

/**
 * Submit form and wait for response
 */
export async function submitFormAndWait(
  page: Page,
  submitSelector: string = 'button[type="submit"]'
): Promise<void> {
  await page.click(submitSelector);
  await page.waitForLoadState('networkidle');
}

/**
 * Check form validation errors are displayed
 */
export async function checkFormErrors(page: Page): Promise<string[]> {
  const errorElements = page.locator('.error, [class*="error"], [role="alert"], .invalid-feedback');
  const errors: string[] = [];
  
  const count = await errorElements.count();
  for (let i = 0; i < count; i++) {
    const text = await errorElements.nth(i).textContent();
    if (text) {
      errors.push(text.trim());
    }
  }
  
  return errors;
}

// ===========================================
// API UTILITIES
// ===========================================

/**
 * Wait for specific API response
 */
export async function waitForApi(
  page: Page,
  endpoint: string,
  options?: { timeout?: number; status?: number }
): Promise<any> {
  const response = await page.waitForResponse(
    resp => resp.url().includes(endpoint) && 
           (options?.status ? resp.status() === options.status : resp.ok()),
    { timeout: options?.timeout || TIMEOUTS.apiResponse }
  );
  
  return response.json();
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  endpoint: string,
  response: any,
  status: number = 200
): Promise<void> {
  await page.route(`**${endpoint}**`, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

// ===========================================
// IMAGE UTILITIES
// ===========================================

/**
 * Check all images are loaded
 */
export async function checkImagesLoaded(page: Page): Promise<{
  total: number;
  loaded: number;
  broken: number;
}> {
  const result = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    let total = 0;
    let loaded = 0;
    let broken = 0;
    
    images.forEach(img => {
      total++;
      if (img.complete) {
        if (img.naturalWidth > 0) {
          loaded++;
        } else {
          broken++;
        }
      }
    });
    
    return { total, loaded, broken };
  });
  
  return result;
}

/**
 * Check for lazy loaded images
 */
export async function scrollAndCheckLazyImages(page: Page): Promise<void> {
  // Scroll to bottom
  await page.evaluate(async () => {
    const scrollStep = window.innerHeight;
    let currentScroll = 0;
    
    while (currentScroll < document.body.scrollHeight) {
      window.scrollTo(0, currentScroll);
      currentScroll += scrollStep;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  });
  
  await page.waitForTimeout(1000);
}

// ===========================================
// LOCALE UTILITIES
// ===========================================

/**
 * Test page in all locales
 */
export async function testInAllLocales(
  page: Page,
  path: string,
  testFn: (locale: string) => Promise<void>
): Promise<void> {
  const locales = ['en', 'de', 'ro'];
  
  for (const locale of locales) {
    await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' });
    await testFn(locale);
  }
}

/**
 * Check text is different across locales (translation check)
 */
export async function checkTranslations(
  page: Page,
  path: string,
  selector: string
): Promise<{ locale: string; text: string }[]> {
  const results: { locale: string; text: string }[] = [];
  const locales = ['en', 'de', 'ro'];
  
  for (const locale of locales) {
    await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' });
    const text = await page.locator(selector).first().textContent();
    results.push({ locale, text: text || '' });
  }
  
  return results;
}

// ===========================================
// SCREENSHOT UTILITIES
// ===========================================

/**
 * Take full page screenshot with timestamp
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean }
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `test-results/screenshots/${name}-${timestamp}.png`;
  
  await page.screenshot({ 
    path, 
    fullPage: options?.fullPage ?? true 
  });
  
  return path;
}

/**
 * Compare visual screenshot (requires baseline)
 */
export async function visualCompare(
  page: Page,
  name: string,
  threshold: number = 0.2
): Promise<void> {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    maxDiffPixelRatio: threshold,
  });
}

// ===========================================
// NETWORK UTILITIES
// ===========================================

/**
 * Block specific requests (for testing error states)
 */
export async function blockRequests(
  page: Page,
  patterns: string[]
): Promise<void> {
  for (const pattern of patterns) {
    await page.route(`**${pattern}**`, route => route.abort());
  }
}

/**
 * Simulate slow network
 */
export async function simulateSlowNetwork(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (500 * 1024) / 8, // 500 Kbps
    uploadThroughput: (500 * 1024) / 8,
    latency: 400,
  });
}

/**
 * Simulate offline mode
 */
export async function simulateOffline(page: Page): Promise<void> {
  await page.context().setOffline(true);
}

/**
 * Restore online mode
 */
export async function simulateOnline(page: Page): Promise<void> {
  await page.context().setOffline(false);
}

// ===========================================
// STORAGE UTILITIES
// ===========================================

/**
 * Clear local storage
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Clear session storage
 */
export async function clearSessionStorage(page: Page): Promise<void> {
  await page.evaluate(() => sessionStorage.clear());
}

/**
 * Set local storage item
 */
export async function setLocalStorage(page: Page, key: string, value: string): Promise<void> {
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
}

/**
 * Get local storage item
 */
export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return await page.evaluate(k => localStorage.getItem(k), key);
}

// ===========================================
// WAIT UTILITIES
// ===========================================

/**
 * Wait for element to be stable (no movement/resize)
 */
export async function waitForStable(locator: Locator, timeout: number = 5000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  
  // Wait for no animations
  let lastBox = await locator.boundingBox();
  let stable = false;
  const startTime = Date.now();
  
  while (!stable && Date.now() - startTime < timeout) {
    await locator.page().waitForTimeout(100);
    const currentBox = await locator.boundingBox();
    
    if (lastBox && currentBox) {
      stable = 
        Math.abs(lastBox.x - currentBox.x) < 1 &&
        Math.abs(lastBox.y - currentBox.y) < 1 &&
        Math.abs(lastBox.width - currentBox.width) < 1 &&
        Math.abs(lastBox.height - currentBox.height) < 1;
    }
    
    lastBox = currentBox;
  }
}

/**
 * Wait for animations to complete
 */
export async function waitForAnimations(page: Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}
