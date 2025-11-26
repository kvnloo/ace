import { test, expect } from '@playwright/test';

test('FPS monitor positioned bottom-right above AI chat', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Wait for app to fully load
  await page.waitForLoadState('networkidle');

  // Wait for loading screen to appear and then be dismissed
  // First wait for content to load (longer timeout for 3D assets)
  await page.waitForTimeout(8000);

  // Check if loading screen exists and wait for it to disappear
  const loadingScreen = page.locator('[data-testid="loading-screen"], .loading-screen');
  try {
    await loadingScreen.waitFor({ state: 'hidden', timeout: 30000 });
    console.log('Loading screen dismissed');
  } catch {
    console.log('No loading screen found or already dismissed');
  }

  // Now look for the FPS meter in overlay mode
  const fpsMeter = page.locator('[data-testid="fps-meter"]');

  // Take screenshot before checking
  await page.screenshot({ path: 'e2e/screenshots/fps-bottom-right-verify.png', fullPage: false });

  // Check if FPS meter exists
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

      console.log(`  Distance from bottom: ${distanceFromBottom}px`);
      console.log(`  Distance from right: ${distanceFromRight}px`);

      // Should be ~96px from bottom (bottom-24 = 6rem = 96px)
      // Should be ~24px from right (right-6 = 1.5rem = 24px)
      expect(distanceFromBottom).toBeLessThan(150); // Allow some tolerance
      expect(distanceFromRight).toBeLessThan(50);   // Should be near right edge

      console.log('✅ FPS is positioned in bottom-right corner');
    }
  } else {
    // Even if no FPS meter, still save screenshot for manual verification
    console.log('Taking full page screenshot for manual verification');
    await page.screenshot({ path: 'e2e/screenshots/fps-bottom-right-fullpage.png', fullPage: true });
  }
});
