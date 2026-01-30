# Testing Guide - AutoScout SafeTrade Platform

This guide covers all testing approaches for the AutoScout SafeTrade platform, including backend tests, frontend tests, and end-to-end tests.

## Table of Contents

- [Overview](#overview)
- [Backend Tests (PHPUnit)](#backend-tests-phpunit)
- [Frontend Tests (Jest + React Testing Library)](#frontend-tests-jest--react-testing-library)
- [End-to-End Tests (Playwright)](#end-to-end-tests-playwright)
- [Coverage Goals](#coverage-goals)
- [CI/CD Integration](#cicd-integration)

## Overview

The AutoScout SafeTrade platform uses a comprehensive testing strategy:

- **Backend**: PHPUnit for unit and feature tests
- **Frontend**: Jest + React Testing Library for component and hook tests
- **E2E**: Playwright for end-to-end user flow testing

## Backend Tests (PHPUnit)

### Running Tests

```bash
cd scout-safe-pay-backend

# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/VehicleTest.php

# Run with coverage
php artisan test --coverage

# Run specific test method
php artisan test --filter test_user_can_submit_review_after_completed_transaction
```

### Test Structure

Backend tests are organized into:

- **Feature Tests** (`tests/Feature/`): Integration tests for API endpoints
- **Unit Tests** (`tests/Unit/`): Unit tests for individual classes/methods
- **Helper Traits** (`tests/TestHelpers.php`): Reusable test utilities

### Available Test Files

1. **AuthenticationTest.php** - User registration, login, logout
2. **CookieConsentTest.php** - Cookie preference management
3. **VehicleTest.php** - Vehicle CRUD, filtering, search (12 tests)
4. **FavoritesTest.php** - Add/remove favorites, authentication checks
5. **ReviewTest.php** - Review submission, verification, flagging (11 tests)
6. **ReviewModerationTest.php** - Admin moderation workflows (6 tests)
7. **TransactionTest.php** - Transaction lifecycle management (5 tests)
8. **DashboardStatsTest.php** - Dashboard statistics for different user types (4 tests)

### Test Helpers

The `TestHelpers` trait provides utility methods:

```php
use Tests\TestHelpers;

// Create authenticated users
$buyer = $this->createAuthenticatedUser('buyer');
$seller = $this->createAuthenticatedUser('seller');

// Create test vehicles
$vehicle = $this->createVehicleWithSeller();

// Create transactions
$transaction = $this->createCompletedTransaction($buyer, $vehicle);
```

### Database

Tests use SQLite in-memory database (`phpunit.xml` configuration):

```xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

## Frontend Tests (Jest + React Testing Library)

### Running Tests

```bash
cd scout-safe-pay-frontend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test VehicleCard.test.tsx
```

### Test Structure

Frontend tests are in `src/__tests__/`:

- `components/` - Component tests
- `hooks/` - Custom hook tests
- `contexts/` - Context provider tests
- `lib/` - Utility function tests

### Available Test Files

1. **VehicleCard.test.tsx** - Vehicle card component rendering and interactions
2. **VehicleGrid.test.tsx** - Vehicle grid with null safety checks
3. **ReviewCard.test.tsx** - Review display with verified badges
4. **ReviewForm.test.tsx** - Review submission form validation
5. **button.test.tsx** - Button component variants and loading states
6. **useAuth.test.ts** - Authentication hook state management

### Writing Tests

Example component test:

```tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Mocking

Common mocks are set up in `jest.setup.js`:

- `next/router`
- `next/navigation`
- `next/image`
- `window.matchMedia`
- `IntersectionObserver`

## End-to-End Tests (Playwright)

### Running E2E Tests

```bash
cd scout-safe-pay-frontend

# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/auth.spec.ts

# Run on specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

### Test Structure

E2E tests are in `e2e/`:

- `auth.spec.ts` - Authentication flows
- `vehicles.spec.ts` - Vehicle browsing and filtering
- `favorites.spec.ts` - Favorites management
- `reviews.spec.ts` - Review submission and display
- `helpers.ts` - Reusable helper functions

### Helper Functions

Use helper functions from `e2e/helpers.ts`:

```typescript
import { login, logout, createTestVehicle } from './helpers';

test('user flow', async ({ page }) => {
  await login(page, 'user@example.com', 'password');
  await createTestVehicle(page);
  await logout(page);
});
```

### Browsers

Tests run on multiple browsers (configured in `playwright.config.ts`):

- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Screenshots and Traces

Playwright automatically captures:

- Screenshots on failure
- Videos on failure
- Traces on retry

View test results:

```bash
npx playwright show-report
```

## Coverage Goals

### Backend Coverage Target: 80%+

```bash
php artisan test --coverage --min=80
```

Coverage includes:

- All controller methods
- Service classes
- Model relationships
- Middleware
- Request validation

### Frontend Coverage Target: 75%+

```bash
npm run test:coverage -- --coverageThreshold='{"global":{"branches":75,"functions":75,"lines":75,"statements":75}}'
```

Coverage includes:

- React components
- Custom hooks
- Utility functions
- Context providers

### Viewing Coverage Reports

**Backend:**
```bash
php artisan test --coverage-html=coverage
# Open coverage/index.html in browser
```

**Frontend:**
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html in browser
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:

- Pull requests
- Pushes to main branch
- Manual workflow dispatch

Example workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      - name: Install Dependencies
        run: composer install
      - name: Run Tests
        run: php artisan test --coverage

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
```

## Best Practices

### Backend Tests

1. **Use factories** for test data creation
2. **Use database transactions** (`RefreshDatabase` trait)
3. **Test authorization** - Verify users can't access others' data
4. **Test validation** - Check required fields and format validation
5. **Test edge cases** - Null values, empty arrays, boundary conditions

### Frontend Tests

1. **Test user interactions** - Clicks, typing, form submissions
2. **Test accessibility** - Use semantic HTML and ARIA labels
3. **Mock external dependencies** - API calls, routers, image loading
4. **Test loading states** - Spinners, skeletons, disabled buttons
5. **Test error states** - Error messages, fallbacks, retry logic

### E2E Tests

1. **Test critical user flows** - Registration, purchase, review submission
2. **Use data-testid** for reliable selectors
3. **Wait for elements** - Use `waitForSelector`, not fixed timeouts
4. **Clean up test data** - Reset state between tests
5. **Test across browsers** - Verify cross-browser compatibility

## Troubleshooting

### Backend Tests Failing

```bash
# Clear cache and config
php artisan config:clear
php artisan cache:clear

# Regenerate autoload
composer dump-autoload

# Run migrations fresh
php artisan migrate:fresh --env=testing
```

### Frontend Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Node version
node --version  # Should be 18+
```

### E2E Tests Failing

```bash
# Install Playwright browsers
npx playwright install

# Run with headed mode to see browser
npx playwright test --headed

# Enable debug mode
npx playwright test --debug
```

## Running Tests Locally Before Push

```bash
# Full test suite (backend + frontend + e2e)
cd scout-safe-pay-backend && php artisan test && cd ..
cd scout-safe-pay-frontend && npm test && npm run test:e2e
```

## Additional Resources

- [PHPUnit Documentation](https://phpunit.de/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Laravel Testing](https://laravel.com/docs/testing)

## Support

For questions or issues with tests:

1. Check this documentation
2. Review existing tests for examples
3. Check CI/CD logs for error details
4. Open an issue with test output and error messages
