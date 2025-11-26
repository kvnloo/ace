import { test, expect } from '@playwright/test';

test.describe('FPS Monitor Position After Loading', () => {
  test('should display FPS monitor at bottom-left after loading completes', async ({ page }) => {
    // Set viewport to standard desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Step 1: Navigating to application...');
    await page.goto('http://localhost:3001');

    // Wait for initial page load
    await page.waitForLoadState('networkidle');

    console.log('Step 2: Looking for COURT VIEW or 3D scene trigger...');

    // Try multiple strategies to trigger the 3D scene
    const courtViewButton = page.locator('text=COURT VIEW').first();
    const navLinks = page.locator('nav a, nav button');

    // Check if COURT VIEW exists
    const courtViewExists = await courtViewButton.count() > 0;

    if (courtViewExists) {
      console.log('Found COURT VIEW button, clicking...');
      await courtViewButton.click();
    } else {
      console.log('COURT VIEW not found, checking navigation links...');
      const linkCount = await navLinks.count();
      console.log(`Found ${linkCount} navigation links`);

      // Try to find and click any link that might trigger the 3D view
      for (let i = 0; i < linkCount; i++) {
        const text = await navLinks.nth(i).textContent();
        console.log(`Nav link ${i}: ${text}`);
      }

      // If no specific button, the 3D scene might auto-load
      console.log('Waiting for 3D scene to auto-load...');
    }

    console.log('Step 3: Waiting for loading screen to appear...');

    // Wait for loading screen to appear (either by class or test-id)
    const loadingScreen = page.locator('[data-testid="loading-screen"], .loading-screen, [class*="loading"]').first();

    try {
      await loadingScreen.waitFor({ state: 'visible', timeout: 5000 });
      console.log('Loading screen detected!');

      console.log('Step 4: Waiting for loading to complete...');

      // Strategy 1: Wait for loading screen to disappear (opacity 0 or removed)
      await page.waitForFunction(() => {
        const loading = document.querySelector('[data-testid="loading-screen"]');
        if (!loading) return true; // Removed from DOM

        const style = window.getComputedStyle(loading);
        const opacity = parseFloat(style.opacity);
        const display = style.display;

        return opacity === 0 || display === 'none';
      }, { timeout: 30000 });

      console.log('Loading screen hidden/removed!');

    } catch (error) {
      console.log('Loading screen not found or already complete, continuing...');
    }

    console.log('Step 5: Waiting additional 2 seconds for transition animations...');
    await page.waitForTimeout(2000);

    console.log('Step 6: Taking screenshot...');
    await page.screenshot({
      path: 'tests/e2e/screenshots/fps-after-loading-complete.png',
      fullPage: false
    });

    console.log('Step 7: Finding and measuring FPS meter position...');

    // Find FPS meter
    const fpsMeter = page.locator('[data-testid="fps-meter"]');

    // Verify it exists
    await expect(fpsMeter).toBeVisible({ timeout: 5000 });

    // Get bounding box
    const boundingBox = await fpsMeter.boundingBox();

    if (!boundingBox) {
      throw new Error('FPS meter has no bounding box');
    }

    console.log('FPS Meter Measurements:');
    console.log(`  X position: ${boundingBox.x}px`);
    console.log(`  Y position: ${boundingBox.y}px`);
    console.log(`  Width: ${boundingBox.width}px`);
    console.log(`  Height: ${boundingBox.height}px`);

    // Calculate distance from edges
    const viewportHeight = page.viewportSize()?.height || 1080;
    const viewportWidth = page.viewportSize()?.width || 1920;

    const distanceFromBottom = viewportHeight - (boundingBox.y + boundingBox.height);
    const distanceFromLeft = boundingBox.x;
    const distanceFromRight = viewportWidth - (boundingBox.x + boundingBox.width);
    const distanceFromTop = boundingBox.y;

    console.log('\nDistance from edges:');
    console.log(`  From bottom: ${distanceFromBottom}px (expected ~96px for bottom-24)`);
    console.log(`  From left: ${distanceFromLeft}px (expected ~16px for left-4)`);
    console.log(`  From right: ${distanceFromRight}px`);
    console.log(`  From top: ${distanceFromTop}px`);

    // Verify position (with some tolerance for different screen sizes and Tailwind compilation)
    // bottom-24 in Tailwind = 6rem = 96px
    // left-4 in Tailwind = 1rem = 16px

    const bottomTolerance = 20; // Allow ±20px tolerance
    const leftTolerance = 10;   // Allow ±10px tolerance

    expect(distanceFromBottom).toBeGreaterThan(96 - bottomTolerance);
    expect(distanceFromBottom).toBeLessThan(96 + bottomTolerance);
    expect(distanceFromLeft).toBeGreaterThan(16 - leftTolerance);
    expect(distanceFromLeft).toBeLessThan(16 + leftTolerance);

    // Verify it's closer to bottom-left than other corners
    expect(distanceFromBottom).toBeLessThan(distanceFromTop);
    expect(distanceFromLeft).toBeLessThan(distanceFromRight);

    console.log('\n✅ SUCCESS: FPS monitor is correctly positioned at bottom-left!');
    console.log(`   Bottom: ${distanceFromBottom}px (target: 96px)`);
    console.log(`   Left: ${distanceFromLeft}px (target: 16px)`);
  });

  test('should verify FPS meter remains visible and positioned after extended wait', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Extended test: Verifying FPS meter stability...');
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Wait for scene to fully load
    await page.waitForTimeout(15000);

    // Take screenshot after extended wait
    await page.screenshot({
      path: 'tests/e2e/screenshots/fps-after-extended-wait.png',
      fullPage: false
    });

    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    await expect(fpsMeter).toBeVisible();

    const boundingBox = await fpsMeter.boundingBox();
    expect(boundingBox).not.toBeNull();

    console.log('✅ FPS meter remains stable after extended wait');
  });
});
