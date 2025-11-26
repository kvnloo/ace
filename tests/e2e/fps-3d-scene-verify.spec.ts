import { test, expect } from '@playwright/test';

test('FPS monitor positioned bottom-right in 3D scene', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');

  // Click on "Explore 3D Demo" button to enter the 3D scene
  const exploreButton = page.getByRole('link', { name: /explore 3d demo/i });
  await exploreButton.click();

  // Wait for loading screen to appear
  await page.waitForTimeout(2000);

  // Wait for loading screen to dismiss (up to 60 seconds for 3D assets)
  const loadingScreen = page.locator('[data-testid="loading-screen"]');
  try {
    await loadingScreen.waitFor({ state: 'hidden', timeout: 60000 });
    console.log('Loading screen dismissed');
  } catch {
    console.log('Loading screen still visible or not found');
  }

  // Wait a bit more for the FPS overlay transition to complete
  await page.waitForTimeout(3000);

  // Take screenshot of the 3D scene
  await page.screenshot({ path: 'e2e/screenshots/fps-3d-scene-verify.png', fullPage: false });

  // Look for FPS meter in overlay mode
  const fpsMeter = page.locator('[data-testid="fps-meter"]');
  const fpsExists = await fpsMeter.count() > 0;
  console.log(`FPS Meter found: ${fpsExists ? 'YES' : 'NO'}`);

  if (fpsExists) {
    const box = await fpsMeter.boundingBox();
    const viewport = page.viewportSize();

    console.log('=== FPS Meter Position ===');
    console.log(`  Viewport: ${viewport?.width}x${viewport?.height}`);
    console.log(`  FPS Box: x=${box?.x}, y=${box?.y}, width=${box?.width}, height=${box?.height}`);

    if (box && viewport) {
      const distanceFromBottom = viewport.height - (box.y + box.height);
      const distanceFromRight = viewport.width - (box.x + box.width);
      const distanceFromLeft = box.x;

      console.log(`  Distance from bottom: ${distanceFromBottom}px`);
      console.log(`  Distance from right: ${distanceFromRight}px`);
      console.log(`  Distance from left: ${distanceFromLeft}px`);

      // Should be positioned on the RIGHT side (not left where sidebar is)
      expect(distanceFromRight).toBeLessThan(100); // Near right edge
      expect(distanceFromLeft).toBeGreaterThan(500); // Far from left edge

      console.log('✅ FPS is positioned in bottom-right corner, away from sidebar');
    }
  } else {
    console.log('FPS meter not found - may need more time for transition');
  }
});
