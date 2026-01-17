import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show login page', async ({ page }) => {
    await page.click('text=Login')
    await expect(page).toHaveURL(/.*login/)
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })

  test('should display validation errors for invalid login', async ({ page }) => {
    await page.goto('/login')

    // Submit empty form
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.getByText(/email.*required/i)).toBeVisible()
    await expect(page.getByText(/password.*required/i)).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form
    await page.fill('input[name="email"]', 'buyer@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 })
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@test.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Check for error message
    await expect(page.getByText(/invalid.*credentials/i)).toBeVisible()
  })

  test('should logout successfully', async ({ page, context }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'buyer@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/.*dashboard/)

    // Logout
    await page.click('button[aria-label="User menu"]')
    await page.click('text=Logout')

    // Should redirect to home
    await expect(page).toHaveURL('/')

    // Cookie should be cleared - verify by trying to access dashboard
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*login/)
  })
})

test.describe('Registration Flow', () => {
  test('should register new buyer successfully', async ({ page }) => {
    await page.goto('/register')

    // Fill registration form
    await page.fill('input[name="name"]', 'New Buyer')
    await page.fill('input[name="email"]', `buyer-${Date.now()}@test.com`)
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.fill('input[name="password_confirmation"]', 'SecurePass123!')
    await page.fill('input[name="phone"]', '+40123456789')
    await page.click('input[value="buyer"]')

    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard.*buyer/, { timeout: 10000 })
  })

  test('should show password mismatch error', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="password_confirmation"]', 'different')
    await page.click('button[type="submit"]')

    await expect(page.getByText(/passwords.*match/i)).toBeVisible()
  })
})
