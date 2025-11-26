import { test, expect } from '@playwright/test';

test('verify FPS monitor is at bottom-left', async ({ page }) => {
  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001');

  // Wait for page to be ready
  await page.waitForLoadState('networkidle');

  // Click "Explore Facility" or "COURT VIEW" button
  console.log('Looking for Explore Facility or COURT VIEW button...');
  const exploreButton = page.locator('button:has-text("Explore Facility"), button:has-text("COURT VIEW")').first();
  await expect(exploreButton).toBeVisible({ timeout: 10000 });
  await exploreButton.click();
  console.log('Clicked button to load 3D scene');

  // Wait for loading screen to disappear (wait for it to appear first, then disappear)
  console.log('Waiting for loading screen to appear and then disappear...');
  const loadingScreen = page.locator('[data-testid="loading-screen"], .loading-screen, text="Loading"').first();

  try {
    // Wait for loading screen to appear (max 5 seconds)
    await loadingScreen.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Loading screen appeared');

    // Wait for loading screen to disappear (max 30 seconds)
    await loadingScreen.waitFor({ state: 'hidden', timeout: 30000 });
    console.log('Loading screen disappeared');
  } catch (error) {
    console.log('Loading screen might not have appeared or already finished:', error);
  }

  // Give extra time for FPS monitor to appear
  await page.waitForTimeout(2000);

  // Take screenshot
  console.log('Taking screenshot...');
  await page.screenshot({
    path: 'e2e/screenshots/fps-bottom-left-verify.png',
    fullPage: true
  });

  // Find FPS monitor element
  console.log('Looking for FPS monitor element...');
  const fpsMeter = page.locator('[data-testid="fps-meter"]');
  await expect(fpsMeter).toBeVisible({ timeout: 10000 });

  // Get bounding box
  const boundingBox = await fpsMeter.boundingBox();
  console.log('FPS Monitor Bounding Box:', boundingBox);

  if (!boundingBox) {
    throw new Error('Could not get bounding box for FPS monitor');
  }

  // Get viewport size
  const viewport = page.viewportSize();
  console.log('Viewport size:', viewport);

  if (!viewport) {
    throw new Error('Could not get viewport size');
  }

  // Calculate positions
  const { x, y, width, height } = boundingBox;
  const bottom = y + height;
  const viewportHeight = viewport.height;
  const viewportWidth = viewport.width;

  // Report positions
  console.log('\n=== FPS Monitor Position Report ===');
  console.log(`Top: ${y}px`);
  console.log(`Left: ${x}px`);
  console.log(`Bottom: ${bottom}px`);
  console.log(`Width: ${width}px`);
  console.log(`Height: ${height}px`);
  console.log(`Viewport Height: ${viewportHeight}px`);
  console.log(`Viewport Width: ${viewportWidth}px`);
  console.log(`Distance from bottom: ${viewportHeight - bottom}px`);
  console.log(`Distance from left: ${x}px`);

  // Verify it's near the bottom-left
  const distanceFromBottom = viewportHeight - bottom;
  const distanceFromLeft = x;

  console.log('\n=== Position Verification ===');
  console.log(`Is near bottom? (< 100px from bottom): ${distanceFromBottom < 100 ? '✅ YES' : '❌ NO'}`);
  console.log(`Is near left? (< 100px from left): ${distanceFromLeft < 100 ? '✅ YES' : '❌ NO'}`);

  // Assertions
  expect(distanceFromBottom).toBeLessThan(100); // Should be within 100px of bottom
  expect(distanceFromLeft).toBeLessThan(100);   // Should be within 100px of left

  console.log('\n✅ FPS monitor is correctly positioned at BOTTOM-LEFT');
});
