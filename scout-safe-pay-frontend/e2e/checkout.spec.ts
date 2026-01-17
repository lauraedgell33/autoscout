import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as buyer
    await page.goto('/login')
    await page.fill('input[name="email"]', 'buyer@test.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should complete full checkout flow', async ({ page }) => {
    // 1. Go to marketplace and select a vehicle
    await page.goto('/marketplace')
    await page.click('.vehicle-card:first-child')
    
    await expect(page.getByRole('heading', { name: /vehicle details/i })).toBeVisible()
    
    // 2. Click Buy Now
    await page.click('button:has-text("Buy Now")')
    
    // Should be on checkout page
    await expect(page).toHaveURL(/.*checkout/)
    
    // 3. Step 1: Buyer Information
    await expect(page.getByText(/buyer information/i)).toBeVisible()
    await page.fill('input[name="address"]', '123 Test Street')
    await page.fill('input[name="city"]', 'Berlin')
    await page.fill('input[name="postalCode"]', '10115')
    await page.click('button:has-text("Next")')
    
    // 4. Step 2: KYC Verification
    await expect(page.getByText(/kyc verification/i)).toBeVisible()
    await page.selectOption('select[name="idType"]', 'passport')
    await page.fill('input[name="idNumber"]', 'AB1234567')
    
    // Upload ID document
    const idFileInput = page.locator('input[type="file"][name="idDocument"]')
    await idFileInput.setInputFiles('./e2e/fixtures/sample-id.jpg')
    
    await page.click('button:has-text("Next")')
    
    // 5. Step 3: Payment Method
    await expect(page.getByText(/payment method/i)).toBeVisible()
    await page.click('input[value="bank_transfer"]')
    
    // Fill bank details
    await page.fill('input[name="iban"]', 'DE89370400440532013000')
    await page.fill('input[name="accountHolder"]', 'John Doe')
    await page.click('button:has-text("Next")')
    
    // 6. Step 4: Review & Confirm
    await expect(page.getByText(/review.*confirm/i)).toBeVisible()
    
    // Accept terms
    await page.check('input[name="termsAccepted"]')
    await page.check('input[name="privacyAccepted"]')
    
    // Submit
    await page.click('button:has-text("Complete Purchase")')
    
    // 7. Should redirect to transaction page
    await expect(page).toHaveURL(/.*transaction.*/, { timeout: 15000 })
    await expect(page.getByText(/transaction created/i)).toBeVisible()
  })

  test('should not proceed without KYC documents', async ({ page }) => {
    await page.goto('/marketplace')
    await page.click('.vehicle-card:first-child')
    await page.click('button:has-text("Buy Now")')
    
    // Fill buyer info
    await page.fill('input[name="address"]', '123 Test Street')
    await page.fill('input[name="city"]', 'Berlin')
    await page.fill('input[name="postalCode"]', '10115')
    await page.click('button:has-text("Next")')
    
    // Try to proceed without KYC
    await page.click('button:has-text("Next")')
    
    // Should show validation errors
    await expect(page.getByText(/id.*required/i)).toBeVisible()
  })

  test('should show payment instructions after transaction creation', async ({ page }) => {
    // Complete checkout (simplified for test)
    // This assumes we have a test helper that creates a transaction
    await page.goto('/transaction/TEST-123')
    
    // Should show bank transfer instructions
    await expect(page.getByText(/payment instructions/i)).toBeVisible()
    await expect(page.getByText(/iban/i)).toBeVisible()
    await expect(page.getByText(/reference number/i)).toBeVisible()
    
    // Should have upload payment proof button
    await expect(page.getByRole('button', { name: /upload.*proof/i })).toBeVisible()
  })
})
