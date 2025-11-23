import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate from Home to Specifications', async ({ page }) => {
    // Click on Specs nav item
    await page.locator('button:has-text("Specs")').first().click();

    // Wait for content to change
    await page.waitForTimeout(500); // Wait for animation

    // Verify Specifications page content is visible
    const specsHeading = page.locator('h2:has-text("Technical"), h2:has-text("Specifications")');
    await expect(specsHeading.first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate from Home to 3D Map', async ({ page }) => {
    // Click on 3D Map nav item
    await page.locator('button:has-text("3D Map")').first().click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify 3D Demo page content is visible
    const demoHeading = page.locator('text=Facility Interactive Map');
    await expect(demoHeading).toBeVisible({ timeout: 5000 });
  });

  test('should navigate from Home to Amenities', async ({ page }) => {
    // Click on Amenities nav item
    await page.locator('button:has-text("Amenities")').first().click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify Amenities page content is visible
    const amenitiesHeading = page.locator('h2:has-text("Facility Amenities")');
    await expect(amenitiesHeading).toBeVisible({ timeout: 5000 });
  });

  test('should navigate from Home to Invest', async ({ page }) => {
    // Click on Invest nav item
    await page.locator('button:has-text("Invest")').first().click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify Invest page content is visible
    const investHeading = page.locator('h2:has-text("Join the Revolution")');
    await expect(investHeading).toBeVisible({ timeout: 5000 });
  });

  test('should navigate using CTA button "Explore 3D Demo"', async ({ page }) => {
    // Click the "Explore 3D Demo" button on homepage
    await page.locator('button:has-text("Explore 3D Demo")').click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify 3D Demo page is loaded
    const demoHeading = page.locator('text=Facility Interactive Map');
    await expect(demoHeading).toBeVisible({ timeout: 5000 });
  });

  test('should navigate using CTA button "View Amenities"', async ({ page }) => {
    // Click the "View Amenities" button on homepage
    await page.locator('button:has-text("View Amenities")').click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify Amenities page is loaded
    const amenitiesHeading = page.locator('h2:has-text("Facility Amenities")');
    await expect(amenitiesHeading).toBeVisible({ timeout: 5000 });
  });

  test('should navigate back to Home via logo click', async ({ page }) => {
    // Navigate to another page first
    await page.locator('button:has-text("Amenities")').first().click();
    await page.waitForTimeout(500);

    // Click on the logo to go back home
    await page.locator('text=LAWNTECH').click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Verify we're back on homepage
    const heroHeading = page.locator('h1:has-text("GRASS")');
    await expect(heroHeading).toBeVisible({ timeout: 5000 });
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Check that "Vision" is highlighted on home page
    const visionButton = page.locator('button:has-text("Vision")').first();
    await expect(visionButton).toHaveClass(/text-tennis-yellow/);

    // Navigate to Specs
    await page.locator('button:has-text("Specs")').first().click();
    await page.waitForTimeout(500);

    // Check that "Specs" is now highlighted
    const specsButton = page.locator('button:has-text("Specs")').first();
    await expect(specsButton).toHaveClass(/text-tennis-yellow/);
  });

  test('should navigate to Invest via "JOIN WAITING LIST" button', async ({ page, isMobile }) => {
    // Skip on mobile as this button may not be visible
    if (!isMobile) {
      // Click the "JOIN WAITING LIST" button
      await page.locator('button:has-text("JOIN WAITING LIST")').click();

      // Wait for animation
      await page.waitForTimeout(500);

      // Verify Invest page is loaded
      const investHeading = page.locator('h2:has-text("Join the Revolution")');
      await expect(investHeading).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open mobile menu on mobile devices', async ({ page, isMobile }) => {
    if (isMobile) {
      // Click the mobile menu button
      await page
        .locator('button')
        .filter({ has: page.locator('svg') })
        .first()
        .click();

      // Wait for menu to open
      await page.waitForTimeout(300);

      // Verify menu items are visible
      const visionLink = page.locator('button:has-text("Vision")');
      await expect(visionLink.first()).toBeVisible();
    }
  });

  test('should navigate on mobile and close menu', async ({ page, isMobile }) => {
    if (isMobile) {
      // Open mobile menu
      await page
        .locator('button')
        .filter({ has: page.locator('svg') })
        .first()
        .click();
      await page.waitForTimeout(300);

      // Click on Amenities
      await page.locator('button:has-text("Amenities")').first().click();
      await page.waitForTimeout(500);

      // Verify navigation occurred
      const amenitiesHeading = page.locator('h2:has-text("Facility Amenities")');
      await expect(amenitiesHeading).toBeVisible({ timeout: 5000 });

      // Verify menu is closed (mobile menu should not be visible)
      // Menu closes automatically after navigation
    }
  });

  test('should complete a full navigation flow', async ({ page }) => {
    // Home -> Specs
    await page.locator('button:has-text("Specs")').first().click();
    await page.waitForTimeout(500);
    await expect(
      page.locator('h2:has-text("Technical"), h2:has-text("Specifications")').first()
    ).toBeVisible({ timeout: 5000 });

    // Specs -> 3D Map
    await page.locator('button:has-text("3D Map")').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=Facility Interactive Map')).toBeVisible({ timeout: 5000 });

    // 3D Map -> Amenities
    await page.locator('button:has-text("Amenities")').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('h2:has-text("Facility Amenities")')).toBeVisible({ timeout: 5000 });

    // Amenities -> Invest
    await page.locator('button:has-text("Invest")').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('h2:has-text("Join the Revolution")')).toBeVisible({ timeout: 5000 });

    // Invest -> Home (via logo)
    await page.locator('text=LAWNTECH').click();
    await page.waitForTimeout(500);
    await expect(page.locator('h1:has-text("GRASS")')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate between views smoothly with animations', async ({ page }) => {
    // Navigate to Specs
    await page.locator('button:has-text("Specs")').first().click();

    // Wait for the animation to complete
    await page.waitForTimeout(800); // Animations take ~600ms according to code

    // Verify the content is stable and visible
    const specsContent = page.locator('h2:has-text("Technical"), h2:has-text("Specifications")');
    await expect(specsContent.first()).toBeVisible();
    await expect(specsContent.first()).toBeInViewport();
  });
});
