import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for running tests against live server.
 * No webServer - tests run directly against production.
 */
export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: false,
  forbidOnly: true,
  retries: 1,
  workers: 1,
  timeout: 60000,
  
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/tests' }],
  ],
  
  use: {
    baseURL: 'https://www.autoscout24safetrade.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer - tests run against live
});
