import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing LIVE production servers.
 * 
 * Frontend: https://www.autoscout24safetrade.com
 * Admin: https://adminautoscout.dev/admin
 */
export default defineConfig({
  testDir: './e2e/live',
  fullyParallel: false, // Run sequentially to avoid rate limiting
  forbidOnly: true,
  retries: 2,
  workers: 1, // Single worker for live testing
  timeout: 90000, // Longer timeout for live servers
  
  reporter: [
    ['html', { outputFolder: 'playwright-report/live' }],
    ['json', { outputFile: 'test-results/live-results.json' }],
    ['list']
  ],
  
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20000,
    navigationTimeout: 60000,
  },

  projects: [
    // Frontend Tests - autoscout24safetrade.com
    {
      name: 'frontend-chrome',
      testMatch: '**/frontend*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },
    {
      name: 'frontend-firefox',
      testMatch: '**/frontend*.spec.ts',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },
    {
      name: 'frontend-mobile',
      testMatch: '**/frontend*.spec.ts',
      use: { 
        ...devices['iPhone 13'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },

    // Admin Panel Tests - adminautoscout.dev
    {
      name: 'admin-chrome',
      testMatch: '**/admin*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://adminautoscout.dev',
      },
    },
    {
      name: 'admin-firefox',
      testMatch: '**/admin*.spec.ts',
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: 'https://adminautoscout.dev',
      },
    },

    // E2E Complete Flow Tests - spans both servers
    {
      name: 'e2e-flows',
      testMatch: '**/e2e-complete*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://adminautoscout.dev', // Start from admin, tests navigate between servers
      },
    },

    // Comprehensive Tests - User flows, API, Dashboard, Transactions
    {
      name: 'comprehensive-user-flows',
      testMatch: '**/complete-user-flows.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },
    {
      name: 'comprehensive-api',
      testMatch: '**/backend-api-tests.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://adminautoscout.dev',
      },
    },
    {
      name: 'comprehensive-dashboard',
      testMatch: '**/dashboard-seller-flows.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },
    {
      name: 'comprehensive-transactions',
      testMatch: '**/transaction-flow.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },

    // Integration tests that verify persistence across frontend/backend
    {
      name: 'integration',
      testMatch: '**/integration-tests.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.autoscout24safetrade.com',
      },
    },
  ],
});
