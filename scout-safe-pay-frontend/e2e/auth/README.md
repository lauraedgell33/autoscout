# Authentication E2E Test Suite

Comprehensive end-to-end tests for authentication functionality in the AutoScout24 SafeTrade application.

## 📋 Overview

This test suite provides complete coverage of authentication flows including registration, login, logout, password reset, email verification, and protected route access.

**Total Tests:** 102  
**Test Files:** 6  
**Total Lines:** ~2,065

## 📁 Test Files

### 1. **registration.spec.ts** (13 tests)
Tests complete user registration flows for all user types.

**Coverage:**
- ✅ Successful registration for buyer, seller, and dealer
- ✅ Email format validation
- ✅ Password mismatch validation
- ✅ Password minimum length validation (8 characters)
- ✅ Duplicate email validation
- ✅ Required fields validation
- ✅ Redirect to appropriate dashboard after registration
- ✅ Welcome message/toast after registration
- ✅ User menu display after registration

**Key Tests:**
- `should successfully register as a buyer`
- `should successfully register as a seller`
- `should successfully register as a dealer`
- `should validate email format`
- `should validate password mismatch`
- `should validate password minimum length (8 characters)`
- `should validate duplicate email`
- `should validate required fields`

### 2. **login.spec.ts** (16 tests)
Tests login functionality for different user types and scenarios.

**Coverage:**
- ✅ Successful login for buyer, seller, and dealer
- ✅ Invalid credentials error handling
- ✅ Unregistered email handling
- ✅ Remember me checkbox functionality
- ✅ Redirect to intended page after login
- ✅ Session persistence after page refresh
- ✅ Session persistence after navigation
- ✅ Loading state during login
- ✅ Case-insensitive email login

**Key Tests:**
- `should successfully login as a buyer`
- `should show error with invalid credentials`
- `should show error with unregistered email`
- `should handle remember me checkbox`
- `should redirect to intended page after login`
- `should maintain session after page refresh`
- `should maintain session after navigation`

### 3. **logout.spec.ts** (17 tests)
Tests logout functionality and session clearing.

**Coverage:**
- ✅ Session clearing after logout
- ✅ Redirect to homepage/login after logout
- ✅ User menu disappears after logout
- ✅ Protected routes not accessible after logout
- ✅ All storage data cleared
- ✅ Logout from different pages
- ✅ Handle double logout gracefully
- ✅ Prevent back button access after logout
- ✅ Require re-login after logout

**Key Tests:**
- `should clear session after logout for buyer`
- `should redirect to homepage after logout`
- `should hide user menu after logout`
- `should not be able to access buyer dashboard after logout`
- `should not be able to access seller dashboard after logout`
- `should clear all storage data after logout`

### 4. **password-reset.spec.ts** (16 tests)
Tests complete password reset flow.

**Coverage:**
- ✅ Request password reset
- ✅ Email format validation
- ✅ Password confirmation match validation
- ✅ Weak password validation
- ✅ Invalid/expired token handling
- ✅ Success message after reset
- ✅ Link to forgot password from login
- ✅ Link back to login from forgot password
- ✅ Rate limiting for multiple requests

**Key Tests:**
- `should successfully request password reset`
- `should validate email format in password reset request`
- `should validate password confirmation match in reset`
- `should validate weak password in reset`
- `should show error for invalid or expired token`
- `should have link to forgot password from login page`

### 5. **email-verification.spec.ts** (17 tests)
Tests email verification flow.

**Coverage:**
- ✅ Unverified user sees verification message
- ✅ Resend verification email functionality
- ✅ Verify email with valid token
- ✅ Invalid/expired token handling
- ✅ Verification status in profile
- ✅ Rate limiting for resend requests
- ✅ Preserve verification state after logout/login
- ✅ Handle verification link from email

**Key Tests:**
- `should show verification message for unverified user`
- `should allow resending verification email`
- `should verify email with valid token`
- `should show error for invalid verification token`
- `should send verification email on registration`
- `should preserve verification state after logout and login`

### 6. **protected-routes.spec.ts** (23 tests)
Tests route protection and access control.

**Coverage:**
- ✅ Unauthenticated users redirected to /login
- ✅ Multiple protected routes (buyer/seller dashboards, vehicles, transactions, profile)
- ✅ "You must login to continue" message displayed
- ✅ Redirect back to intended URL after login
- ✅ Public routes accessible without authentication
- ✅ Role-based access control (buyer vs seller routes)
- ✅ Session expiry handling
- ✅ Query parameter preservation in redirects

**Key Tests:**
- `should redirect unauthenticated user from buyer dashboard to login`
- `should redirect unauthenticated user from seller dashboard to login`
- `should show "You must login to continue" message`
- `should redirect back to intended buyer dashboard URL after login`
- `should allow access to public routes without authentication`
- `should protect multiple buyer routes`
- `should protect multiple seller routes`

## 🚀 Running the Tests

### Run all authentication tests:
```bash
npm run test:e2e e2e/auth
```

### Run specific test file:
```bash
npm run test:e2e e2e/auth/registration.spec.ts
npm run test:e2e e2e/auth/login.spec.ts
npm run test:e2e e2e/auth/logout.spec.ts
npm run test:e2e e2e/auth/password-reset.spec.ts
npm run test:e2e e2e/auth/email-verification.spec.ts
npm run test:e2e e2e/auth/protected-routes.spec.ts
```

### Run in headed mode (see browser):
```bash
npm run test:e2e:headed e2e/auth
```

### Run in UI mode (interactive):
```bash
npm run test:e2e:ui e2e/auth
```

### View test report:
```bash
npm run test:e2e:report
```

## 🛠️ Test Structure

All tests follow these best practices:

1. **Independent Tests**: Each test is self-contained with proper setup/teardown
2. **Unique Data**: Uses `generateUniqueEmail()` to avoid conflicts
3. **Proper Waits**: Uses `waitForLoadState('networkidle')` for stable tests
4. **Multiple Selectors**: Falls back from `data-testid` to semantic selectors
5. **Clear Assertions**: Descriptive test names and assertions
6. **Helper Functions**: Reuses auth helpers from `e2e/helpers/auth.helpers.ts`
7. **Test Fixtures**: Uses test data from `e2e/helpers/fixtures.ts`

## 📦 Helper Functions Used

From `e2e/helpers/auth.helpers.ts`:
- `registerUser()` - Register a new user
- `loginUser()` - Login with credentials
- `logoutUser()` - Logout current user
- `clearAuth()` - Clear all authentication data
- `isAuthenticated()` - Check authentication status
- `getAuthToken()` - Get current auth token
- `requestPasswordReset()` - Request password reset
- `resetPassword()` - Reset password with token
- `verifyEmail()` - Verify email with token
- `resendVerificationEmail()` - Resend verification email
- `enableRememberMe()` - Enable remember me option

From `e2e/helpers/fixtures.ts`:
- `generateUniqueEmail()` - Generate unique test emails
- `TEST_USERS` - Predefined test user data

## 🎯 Coverage Summary

| Feature | Tests | Status |
|---------|-------|--------|
| Registration | 13 | ✅ Complete |
| Login | 16 | ✅ Complete |
| Logout | 17 | ✅ Complete |
| Password Reset | 16 | ✅ Complete |
| Email Verification | 17 | ✅ Complete |
| Protected Routes | 23 | ✅ Complete |

## 🔍 Test Patterns

### Registration Pattern:
```typescript
test('should successfully register as a buyer', async ({ page }) => {
  const email = generateUniqueEmail('buyer');
  const password = 'TestPass123!';

  await page.goto('/register');
  await page.waitForLoadState('networkidle');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  // ... fill other fields

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/\/buyer\/dashboard/);
});
```

### Login Pattern:
```typescript
test('should successfully login as a buyer', async ({ page }) => {
  const credentials = await registerUser(page, 'buyer');
  await clearAuth(page);

  await loginUser(page, credentials.email, credentials.password);

  await expect(page).toHaveURL(/\/buyer\/dashboard/);
  const authenticated = await isAuthenticated(page);
  expect(authenticated).toBe(true);
});
```

### Protected Route Pattern:
```typescript
test('should redirect unauthenticated user to login', async ({ page }) => {
  await page.goto('/buyer/dashboard');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/\/login/);
});
```

## 📝 Notes

- Tests use flexible selectors to accommodate different UI implementations
- Some assertions are commented with notes about backend-dependent behavior
- Tests handle both modal and page-based authentication flows
- Rate limiting and API error tests are included but may need backend support

## 🐛 Troubleshooting

### Tests failing due to timing:
- Increase `waitForLoadState` timeouts
- Add `page.waitForTimeout()` after specific actions
- Use `networkidle` instead of `load` for better stability

### Selector not found:
- Check if the app uses different attribute names
- Update selectors in the test to match your DOM structure
- Use `data-testid` attributes in your components for stable selectors

### Session not persisting:
- Check browser storage implementation (localStorage vs cookies)
- Verify `auth_token` key name matches your app
- Update `getAuthToken()` helper if needed

## 🔗 Related Files

- `e2e/helpers/auth.helpers.ts` - Authentication helper functions
- `e2e/helpers/fixtures.ts` - Test data and fixtures
- `e2e/auth.spec.ts` - Original auth tests (legacy)
- `playwright.config.ts` - Playwright configuration

## 📄 License

Part of the AutoScout24 SafeTrade project.
