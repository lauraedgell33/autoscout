/**
 * Vehicle helper functions for E2E tests
 */

import { Page } from '@playwright/test';
import { TEST_VEHICLE } from './fixtures';

export interface VehicleData {
  category?: string;
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  currency?: string;
  vin?: string;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  doors?: number;
  seats?: number;
  body_type?: string;
  engine_size?: number;
  power_hp?: number;
  city?: string;
  country?: string;
  description?: string;
  status?: string;
}

export interface VehicleFilters {
  category?: string;
  make?: string;
  model?: string;
  price_min?: number;
  price_max?: number;
  year_from?: number;
  year_to?: number;
  mileage_max?: number;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  city?: string;
  country?: string;
}

/**
 * Create a new vehicle listing
 */
export async function createVehicle(
  page: Page,
  vehicleData: Partial<VehicleData> = {}
): Promise<string> {
  const data = { ...TEST_VEHICLE, ...vehicleData };

  await page.goto('/seller/vehicles/new');
  await page.waitForLoadState('networkidle');

  // Fill category
  if (data.category) {
    const categorySelector = page.locator('select[name="category"]');
    if (await categorySelector.count() > 0) {
      await categorySelector.selectOption(data.category);
    }
  }

  // Fill make
  if (data.make) {
    await page.fill('input[name="make"]', data.make);
  }

  // Fill model
  if (data.model) {
    await page.fill('input[name="model"]', data.model);
  }

  // Fill year
  if (data.year) {
    await page.fill('input[name="year"]', data.year.toString());
  }

  // Fill price
  if (data.price) {
    await page.fill('input[name="price"]', data.price.toString());
  }

  // Fill VIN
  if (data.vin) {
    const vinInput = page.locator('input[name="vin"]');
    if (await vinInput.count() > 0) {
      await vinInput.fill(data.vin);
    }
  }

  // Fill mileage
  if (data.mileage) {
    const mileageInput = page.locator('input[name="mileage"]');
    if (await mileageInput.count() > 0) {
      await mileageInput.fill(data.mileage.toString());
    }
  }

  // Select fuel type
  if (data.fuel_type) {
    const fuelTypeSelector = page.locator('select[name="fuel_type"]');
    if (await fuelTypeSelector.count() > 0) {
      await fuelTypeSelector.selectOption(data.fuel_type);
    }
  }

  // Select transmission
  if (data.transmission) {
    const transmissionSelector = page.locator('select[name="transmission"]');
    if (await transmissionSelector.count() > 0) {
      await transmissionSelector.selectOption(data.transmission);
    }
  }

  // Fill color
  if (data.color) {
    const colorInput = page.locator('input[name="color"]');
    if (await colorInput.count() > 0) {
      await colorInput.fill(data.color);
    }
  }

  // Fill doors
  if (data.doors) {
    const doorsInput = page.locator('input[name="doors"]');
    if (await doorsInput.count() > 0) {
      await doorsInput.fill(data.doors.toString());
    }
  }

  // Fill seats
  if (data.seats) {
    const seatsInput = page.locator('input[name="seats"]');
    if (await seatsInput.count() > 0) {
      await seatsInput.fill(data.seats.toString());
    }
  }

  // Select body type
  if (data.body_type) {
    const bodyTypeSelector = page.locator('select[name="body_type"]');
    if (await bodyTypeSelector.count() > 0) {
      await bodyTypeSelector.selectOption(data.body_type);
    }
  }

  // Fill engine size
  if (data.engine_size) {
    const engineSizeInput = page.locator('input[name="engine_size"]');
    if (await engineSizeInput.count() > 0) {
      await engineSizeInput.fill(data.engine_size.toString());
    }
  }

  // Fill power
  if (data.power_hp) {
    const powerInput = page.locator('input[name="power_hp"]');
    if (await powerInput.count() > 0) {
      await powerInput.fill(data.power_hp.toString());
    }
  }

  // Fill location
  if (data.city) {
    const cityInput = page.locator('input[name="city"]');
    if (await cityInput.count() > 0) {
      await cityInput.fill(data.city);
    }
  }

  if (data.country) {
    const countryInput = page.locator('input[name="country"]');
    if (await countryInput.count() > 0) {
      await countryInput.fill(data.country);
    }
  }

  // Fill description
  if (data.description) {
    const descriptionTextarea = page.locator('textarea[name="description"]');
    if (await descriptionTextarea.count() > 0) {
      await descriptionTextarea.fill(data.description);
    }
  }

  // Submit form
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  // Extract vehicle ID from URL
  const url = page.url();
  const match = url.match(/\/vehicle\/(\d+)/);
  return match ? match[1] : '';
}

/**
 * Upload vehicle images
 */
export async function uploadVehicleImages(
  page: Page,
  imagePaths: string[]
): Promise<void> {
  const fileInput = page.locator('input[type="file"]');
  
  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles(imagePaths);
    await page.waitForTimeout(1000); // Wait for upload
  }
}

/**
 * Add vehicle to favorites
 */
export async function addToFavorites(
  page: Page,
  vehicleId: string
): Promise<void> {
  await page.goto(`/vehicle/${vehicleId}`);
  await page.waitForLoadState('networkidle');

  const favoriteButton = page.locator('[data-testid="favorite-button"]');
  if (await favoriteButton.count() > 0) {
    await favoriteButton.click();
    await page.waitForTimeout(500);
  }
}

/**
 * Remove vehicle from favorites
 */
export async function removeFromFavorites(
  page: Page,
  vehicleId: string
): Promise<void> {
  await page.goto(`/vehicle/${vehicleId}`);
  await page.waitForLoadState('networkidle');

  const favoriteButton = page.locator('[data-testid="favorite-button"]');
  if (await favoriteButton.count() > 0) {
    // If already favorited, click to unfavorite
    const isFavorited = await favoriteButton.getAttribute('aria-pressed');
    if (isFavorited === 'true') {
      await favoriteButton.click();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Search for vehicles by keyword
 */
export async function searchVehicles(
  page: Page,
  query: string
): Promise<void> {
  await page.goto('/vehicles');
  await page.waitForLoadState('networkidle');

  const searchInput = page.locator('input[name="search"], input[placeholder*="Search"]');
  if (await searchInput.count() > 0) {
    await searchInput.fill(query);
    await page.waitForTimeout(500); // Wait for debounced search
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Apply filters to vehicle search
 */
export async function applyFilters(
  page: Page,
  filters: VehicleFilters
): Promise<void> {
  await page.goto('/vehicles');
  await page.waitForLoadState('networkidle');

  // Category filter
  if (filters.category) {
    const categorySelect = page.locator('select[name="category"]');
    if (await categorySelect.count() > 0) {
      await categorySelect.selectOption(filters.category);
    }
  }

  // Make filter
  if (filters.make) {
    const makeSelect = page.locator('select[name="make"]');
    if (await makeSelect.count() > 0) {
      await makeSelect.selectOption(filters.make);
      await page.waitForTimeout(300);
    }
  }

  // Model filter
  if (filters.model) {
    const modelSelect = page.locator('select[name="model"]');
    if (await modelSelect.count() > 0) {
      await modelSelect.selectOption(filters.model);
    }
  }

  // Price range
  if (filters.price_min) {
    const priceMinInput = page.locator('input[name="price_min"]');
    if (await priceMinInput.count() > 0) {
      await priceMinInput.fill(filters.price_min.toString());
    }
  }

  if (filters.price_max) {
    const priceMaxInput = page.locator('input[name="price_max"]');
    if (await priceMaxInput.count() > 0) {
      await priceMaxInput.fill(filters.price_max.toString());
    }
  }

  // Year range
  if (filters.year_from) {
    const yearFromInput = page.locator('input[name="year_from"]');
    if (await yearFromInput.count() > 0) {
      await yearFromInput.fill(filters.year_from.toString());
    }
  }

  if (filters.year_to) {
    const yearToInput = page.locator('input[name="year_to"]');
    if (await yearToInput.count() > 0) {
      await yearToInput.fill(filters.year_to.toString());
    }
  }

  // Mileage
  if (filters.mileage_max) {
    const mileageMaxInput = page.locator('input[name="mileage_max"]');
    if (await mileageMaxInput.count() > 0) {
      await mileageMaxInput.fill(filters.mileage_max.toString());
    }
  }

  // Fuel type
  if (filters.fuel_type) {
    const fuelTypeSelect = page.locator('select[name="fuel_type"]');
    if (await fuelTypeSelect.count() > 0) {
      await fuelTypeSelect.selectOption(filters.fuel_type);
    }
  }

  // Transmission
  if (filters.transmission) {
    const transmissionSelect = page.locator('select[name="transmission"]');
    if (await transmissionSelect.count() > 0) {
      await transmissionSelect.selectOption(filters.transmission);
    }
  }

  // Body type
  if (filters.body_type) {
    const bodyTypeSelect = page.locator('select[name="body_type"]');
    if (await bodyTypeSelect.count() > 0) {
      await bodyTypeSelect.selectOption(filters.body_type);
    }
  }

  // Apply filters button
  const applyButton = page.locator('button:has-text("Apply"), button:has-text("Search")');
  if (await applyButton.count() > 0) {
    await applyButton.first().click();
  }

  await page.waitForLoadState('networkidle');
}

/**
 * Clear all filters
 */
export async function clearAllFilters(page: Page): Promise<void> {
  const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")');
  if (await clearButton.count() > 0) {
    await clearButton.first().click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Navigate to vehicle detail page
 */
export async function goToVehicleDetail(page: Page, vehicleId: string): Promise<void> {
  await page.goto(`/vehicle/${vehicleId}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Edit vehicle
 */
export async function editVehicle(
  page: Page,
  vehicleId: string,
  updates: Partial<VehicleData>
): Promise<void> {
  await page.goto(`/seller/vehicles/${vehicleId}/edit`);
  await page.waitForLoadState('networkidle');

  // Apply updates
  if (updates.price) {
    await page.fill('input[name="price"]', updates.price.toString());
  }

  if (updates.description) {
    const descriptionTextarea = page.locator('textarea[name="description"]');
    if (await descriptionTextarea.count() > 0) {
      await descriptionTextarea.fill(updates.description);
    }
  }

  if (updates.mileage) {
    const mileageInput = page.locator('input[name="mileage"]');
    if (await mileageInput.count() > 0) {
      await mileageInput.fill(updates.mileage.toString());
    }
  }

  // Submit changes
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
}

/**
 * Delete vehicle (soft delete)
 */
export async function deleteVehicle(page: Page, vehicleId: string): Promise<void> {
  await page.goto(`/seller/vehicles/${vehicleId}/edit`);
  await page.waitForLoadState('networkidle');

  const deleteButton = page.locator('button:has-text("Delete")');
  if (await deleteButton.count() > 0) {
    await deleteButton.click();
    
    // Confirm deletion
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }
    
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Get vehicle count from page
 */
export async function getVehicleCount(page: Page): Promise<number> {
  const countText = page.locator('[data-testid="vehicle-count"]');
  if (await countText.count() > 0) {
    const text = await countText.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  return 0;
}

/**
 * Wait for vehicles to load
 */
export async function waitForVehiclesToLoad(page: Page): Promise<void> {
  await page.waitForSelector('[data-testid="vehicle-card"]', { timeout: 10000 });
}
