# E2E Test Suite for AutoScout24 SafeTrade

Comprehensive end-to-end testing suite for the AutoScout24 SafeTrade platform using Playwright.

## 📁 Project Structure

```
e2e/
├── fixtures/                    # Test data and fixtures
│   ├── test-data.ts            # Test constants, selectors, user credentials
│   └── auth.fixture.ts         # Authentication fixtures and helpers
├── page-objects/               # Page Object Models
│   ├── base.page.ts            # Base page with common methods
│   └── [feature]/              # Feature-specific page objects
├── tests/                      # Test specifications
│   ├── public/                 # Public pages tests
│   │   ├── home.spec.ts        # Homepage tests
│   │   ├── vehicles.spec.ts    # Vehicle listing & detail tests
│   │   └── static-pages.spec.ts # About, FAQ, Contact, etc.
│   ├── auth/                   # Authentication tests
│   │   └── auth.spec.ts        # Login, register, password reset
│   ├── legal/                  # Legal pages tests
│   │   └── legal-pages.spec.ts # Privacy, terms, cookies, etc.
│   ├── flows/                  # End-to-end user flows
│   │   └── user-flows.spec.ts  # Complete user journeys
│   ├── i18n/                   # Internationalization tests
│   │   └── i18n.spec.ts        # Multi-language support
│   └── [other features]/       # Dashboard, buyer, seller, etc.
├── utils/                      # Utility functions
│   └── test-utils.ts           # Helpers for a11y, performance, etc.
├── live/                       # Live server tests (production)
│   └── *.spec.ts               # Tests against live servers
└── helpers.ts                  # Legacy helpers
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test e2e/tests/public/home.spec.ts

# Run tests matching a pattern
npx playwright test --grep "home"

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Running Live Server Tests

```bash
# Run all live tests
npm run test:live

# Run frontend tests only
npm run test:live:frontend

# Run admin panel tests
npm run test:live:admin

# Run comprehensive flow tests
npm run test:comprehensive
```

## 📋 Test Coverage

### Public Pages (12 pages × 3 locales = 36 tests)
- ✅ Homepage - Hero, navigation, footer, language switcher
- ✅ Vehicles listing - Filters, search, pagination
- ✅ Vehicle detail - Gallery, specs, contact seller
- ✅ Marketplace - Advanced filtering
- ✅ About, How It Works, Benefits, Careers
- ✅ Contact - Form validation, submission
- ✅ FAQ - Accordion, search
- ✅ Dealers - Listing, detail
- ✅ UI Showcase

### Authentication (4 flows × 3 locales)
- ✅ Login - Form validation, error handling
- ✅ Registration - User types, password strength
- ✅ Password Reset - Email flow
- ✅ Protected Routes - Redirect to login

### Legal Pages (7 pages × 3 locales = 21 tests)
- ✅ Legal Hub
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Cookie Policy
- ✅ Imprint
- ✅ Refund Policy
- ✅ Purchase Agreement

### User Flows
- ✅ Complete purchase flow (guest to checkout)
- ✅ Buyer journey (browse, filter, save)
- ✅ Seller journey (add vehicle, manage listings)
- ✅ Dealer journey (inventory, analytics)
- ✅ Multi-language experience
- ✅ Mobile user journey

### Cross-Cutting Concerns
- ✅ Internationalization (EN, DE, RO)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Accessibility basics
- ✅ Performance metrics
- ✅ Error handling (404, network errors)

## 🔧 Configuration

### Environment Variables

Create a `.env` file or set these variables:

```bash
# Base URLs
PLAYWRIGHT_BASE_URL=https://www.autoscout24safetrade.com
ADMIN_BASE_URL=https://adminautoscout.dev
API_BASE_URL=https://adminautoscout.dev/api
```

### Test Users

Test credentials are defined in `e2e/fixtures/test-data.ts`:

```typescript
export const TEST_USERS = {
  buyer: {
    email: 'buyer.test@autoscout.dev',
    password: 'BuyerPass123!',
  },
  seller: {
    email: 'seller.test@autoscout.dev',
    password: 'SellerPass123!',
  },
  dealer: {
    email: 'dealer.test@autoscout.dev',
    password: 'DealerPass123!',
  },
  admin: {
    email: 'admin@autoscout.dev',
    password: 'Admin123!@#',
  },
};
```

## 📊 Reports

### HTML Report

```bash
# Generate and open HTML report
npm run test:e2e
npm run test:e2e:report
```

Reports are generated in:
- `playwright-report/` - Default HTML report
- `playwright-report/live/` - Live test reports
- `test-results/` - JSON/JUnit reports

### Screenshots & Videos

- Screenshots are captured on failure
- Videos are retained on failure
- Located in `test-results/`

## 🏗️ Writing Tests

### Using Page Objects

```typescript
import { test, expect } from '@playwright/test';
import { BasePage } from '../../page-objects/base.page';

test('example test', async ({ page }) => {
  const basePage = new BasePage(page, 'en');
  
  // Navigate with locale
  await basePage.goto('/vehicles');
  
  // Use common assertions
  await basePage.verifyHeader();
  await basePage.verifyFooter();
  
  // Check for issues
  const brokenImages = await basePage.checkBrokenImages();
  expect(brokenImages).toBe(0);
});
```

### Using Auth Fixtures

```typescript
import { test, expect } from '../../fixtures/auth.fixture';

test('authenticated test', async ({ buyerPage }) => {
  // buyerPage is already logged in as buyer
  await buyerPage.goto('/en/dashboard');
  // ... test authenticated features
});
```

### Using Test Utilities

```typescript
import { 
  checkBasicAccessibility,
  measurePagePerformance,
  checkImagesLoaded
} from '../../utils/test-utils';

test('performance test', async ({ page }) => {
  await page.goto('/en');
  
  const metrics = await measurePagePerformance(page);
  expect(metrics.loadTime).toBeLessThan(5000);
  
  const a11yIssues = await checkBasicAccessibility(page);
  console.log(a11yIssues);
});
```

## 🎯 Best Practices

1. **Use data-testid selectors** when possible for stable tests
2. **Avoid hard-coded waits** - use `waitForSelector`, `waitForLoadState`
3. **Test in all locales** - Use the `LOCALES` constant
4. **Handle optional elements** - Check if elements exist before interacting
5. **Clean up after tests** - Logout, clear state if needed
6. **Use Page Objects** - Keep selectors and actions organized
7. **Run tests in parallel** - Playwright handles parallelization

## 🐛 Debugging

```bash
# Debug mode with browser visible
npx playwright test --debug

# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip

# Use Playwright Inspector
PWDEBUG=1 npx playwright test
```

## 📝 Adding New Tests

1. Create a new spec file in the appropriate directory
2. Import test utilities and fixtures
3. Use the BasePage or create a new page object
4. Follow existing patterns for consistency
5. Test in all 3 locales when applicable
6. Add mobile viewport tests for UI components

## 🔗 Related Documentation

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)
- [Project AGENTS.md](../AGENTS.md)

## 📈 Success Criteria

- [ ] 100% of pages have E2E tests
- [ ] All user flows covered
- [ ] Tests run in < 30 minutes
- [ ] No flaky tests
- [ ] HTML + JSON reports generated
- [ ] Screenshots on failures
- [ ] Video recordings on failures
