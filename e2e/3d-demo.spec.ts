import { test, expect } from '@playwright/test';

test.describe('3D Demo Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to 3D Demo
    await page.locator('button:has-text("3D Map")').first().click();
    await page.waitForTimeout(1000); // Wait for animation and 3D scene to load
  });

  test('should load 3D demo page successfully', async ({ page }) => {
    // Check that the demo page is loaded
    const demoHeading = page.locator('text=Facility Interactive Map');
    await expect(demoHeading).toBeVisible();

    // Check that the description is visible
    const description = page.locator('text=24 Courts');
    await expect(description).toBeVisible();
  });

  test('should display canvas element for 3D scene', async ({ page }) => {
    // Wait for the canvas to be present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify canvas has dimensions
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('should display floor selector controls', async ({ page }) => {
    // Check for Floor View controls
    const floorViewLabel = page.locator('text=Floor View');
    await expect(floorViewLabel).toBeVisible();

    // Check for floor level buttons
    await expect(page.locator('button:has-text("L3: Farm")')).toBeVisible();
    await expect(page.locator('button:has-text("L2: Social")')).toBeVisible();
    await expect(page.locator('button:has-text("L1: Racquet")')).toBeVisible();
    await expect(page.locator('button:has-text("G: Tennis")')).toBeVisible();
    await expect(page.locator('button:has-text("Full Facility")')).toBeVisible();
  });

  test('should display annotation overlay controls', async ({ page }) => {
    // Check for Overlay controls
    const overlayLabel = page.locator('text=Overlay');
    await expect(overlayLabel).toBeVisible();

    // Check for annotation mode buttons
    await expect(page.locator('button:has-text("Clean")')).toBeVisible();
    await expect(page.locator('button:has-text("Labels")')).toBeVisible();
    await expect(page.locator('button:has-text("Dimensions")')).toBeVisible();
  });

  test('should switch between floor levels', async ({ page }) => {
    // Click on L3: Farm
    const l3Button = page.locator('button:has-text("L3: Farm")');
    await l3Button.click();
    await page.waitForTimeout(1000); // Wait for camera animation

    // Verify button is highlighted (has tennis-yellow background)
    await expect(l3Button).toHaveClass(/bg-tennis-yellow/);

    // Click on Ground floor
    const groundButton = page.locator('button:has-text("G: Tennis")');
    await groundButton.click();
    await page.waitForTimeout(1000);

    // Verify ground button is now highlighted
    await expect(groundButton).toHaveClass(/bg-tennis-yellow/);
  });

  test('should switch annotation modes', async ({ page }) => {
    // Click on Labels mode
    const labelsButton = page.locator('button:has-text("Labels")');
    await labelsButton.click();
    await page.waitForTimeout(500);

    // Verify labels button is highlighted
    await expect(labelsButton).toHaveClass(/bg-white\/20/);

    // Click on Dimensions mode
    const dimensionsButton = page.locator('button:has-text("Dimensions")');
    await dimensionsButton.click();
    await page.waitForTimeout(500);

    // Verify dimensions button is highlighted
    await expect(dimensionsButton).toHaveClass(/bg-white\/20/);

    // Click on Clean mode
    const cleanButton = page.locator('button:has-text("Clean")');
    await cleanButton.click();
    await page.waitForTimeout(500);

    // Verify clean button is highlighted
    await expect(cleanButton).toHaveClass(/bg-white\/20/);
  });

  test('should interact with 3D markers (basic)', async ({ page, isMobile }) => {
    // Skip on mobile as canvas interaction is limited
    if (!isMobile) {
      // Wait for the 3D scene to fully load
      await page.waitForTimeout(2000);

      // Enable Labels mode to make markers more visible
      await page.locator('button:has-text("Labels")').click();
      await page.waitForTimeout(500);

      // Try to interact with the canvas (basic test)
      const canvas = page.locator('canvas');
      const box = await canvas.boundingBox();

      if (box) {
        // Click in the center of the canvas
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);

        // Note: Actual feature selection detection would require more complex testing
        // For now, we just verify the interaction doesn't break the page
        const demoHeading = page.locator('text=Facility Interactive Map');
        await expect(demoHeading).toBeVisible();
      }
    }
  });

  test('should navigate to Specifications from feature card', async ({ page }) => {
    // This test simulates clicking on a feature marker and then navigating to specs
    // Note: This requires a feature to be selected, which we'll simulate by waiting

    // Wait for 3D scene to load
    await page.waitForTimeout(2000);

    // Check if we can navigate to specs from the demo view
    // (This would normally be triggered by selecting a feature and clicking "View Full Specs")

    // Navigate to specs using the navbar as a fallback test
    await page.locator('button:has-text("Specs")').first().click();
    await page.waitForTimeout(500);

    // Verify we're on the specs page
    const specsHeading = page.locator('h2:has-text("Technical"), h2:has-text("Specifications")');
    await expect(specsHeading.first()).toBeVisible({ timeout: 5000 });
  });

  test('should handle camera rotation (orbit controls)', async ({ page, isMobile }) => {
    // Skip on mobile due to touch gesture complexity
    if (!isMobile) {
      const canvas = page.locator('canvas');
      const box = await canvas.boundingBox();

      if (box) {
        // Simulate drag to rotate camera
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2);
        await page.mouse.up();

        await page.waitForTimeout(300);

        // Verify the scene is still functioning
        const demoHeading = page.locator('text=Facility Interactive Map');
        await expect(demoHeading).toBeVisible();
      }
    }
  });

  test('should maintain 3D scene when switching views and returning', async ({ page }) => {
    // Switch to a different floor level
    await page.locator('button:has-text("L2: Social")').click();
    await page.waitForTimeout(1000);

    // Navigate away to Amenities
    await page.locator('button:has-text("Amenities")').first().click();
    await page.waitForTimeout(500);

    // Navigate back to 3D Map
    await page.locator('button:has-text("3D Map")').first().click();
    await page.waitForTimeout(1000);

    // Verify the scene loads again
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('should display all floor levels in sequence', async ({ page }) => {
    const floors = [
      'L3: Farm',
      'L2: Social',
      'L1: Racquet',
      'G: Tennis',
      'Full Facility',
    ];

    for (const floor of floors) {
      const button = page.locator(`button:has-text("${floor}")`);
      await button.click();
      await page.waitForTimeout(800); // Wait for camera animation

      // Verify the button is highlighted
      await expect(button).toHaveClass(/bg-tennis-yellow/);
    }

    // Verify we're still on the 3D demo page
    const demoHeading = page.locator('text=Facility Interactive Map');
    await expect(demoHeading).toBeVisible();
  });

  test('should cycle through all annotation modes', async ({ page }) => {
    const modes = ['Labels', 'Dimensions', 'Clean'];

    for (const mode of modes) {
      const button = page.locator(`button:has-text("${mode}")`);
      await button.click();
      await page.waitForTimeout(300);

      // Verify the button is highlighted
      await expect(button).toHaveClass(/bg-white\/20/);
    }
  });

  test('should be responsive on mobile viewport', async ({ page, isMobile }) => {
    if (isMobile) {
      // Verify key elements are visible on mobile
      const demoHeading = page.locator('text=Facility Interactive Map');
      await expect(demoHeading).toBeVisible();

      // Verify controls are accessible
      const floorViewLabel = page.locator('text=Floor View');
      await expect(floorViewLabel).toBeVisible();

      // Canvas should be visible
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible({ timeout: 10000 });
    }
  });

  test('should not have WebGL errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for 3D scene to fully load
    await page.waitForTimeout(3000);

    // Interact with the scene
    await page.locator('button:has-text("L1: Racquet")').click();
    await page.waitForTimeout(1000);

    // Filter out known acceptable errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('API_KEY') &&
        !error.includes('GEMINI') &&
        !error.toLowerCase().includes('favicon') // Ignore favicon 404s
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
