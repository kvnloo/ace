import { test, expect } from '@playwright/test';

test.describe('FPS Monitor - TRUE Bottom Left Position', () => {
  test('should be positioned at true bottom-left corner (24px from edges)', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3001');

    // Click "Court View" in navigation to load 3D scene
    await page.click('text=Court View');

    // Wait for loading screen to appear first
    await page.waitForSelector('[data-testid="loading-screen"]', { state: 'visible', timeout: 10000 });

    // Wait for loading screen to disappear
    await page.waitForSelector('[data-testid="loading-screen"]', { state: 'hidden', timeout: 60000 });

    // Wait additional 3 seconds for scene to fully load and FPS monitor to settle
    await page.waitForTimeout(3000);

    // Get the FPS meter element
    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    await expect(fpsMeter).toBeVisible();

    // Get bounding box of FPS meter
    const boundingBox = await fpsMeter.boundingBox();
    expect(boundingBox).not.toBeNull();

    if (!boundingBox) {
      throw new Error('FPS meter bounding box is null');
    }

    // Get viewport size
    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();

    if (!viewportSize) {
      throw new Error('Viewport size is null');
    }

    // Calculate distances from edges
    const distanceFromLeft = boundingBox.x;
    const distanceFromBottom = viewportSize.height - (boundingBox.y + boundingBox.height);

    console.log('FPS Meter Position:');
    console.log('  Distance from left edge:', distanceFromLeft, 'px');
    console.log('  Distance from bottom edge:', distanceFromBottom, 'px');
    console.log('  Bounding box:', boundingBox);
    console.log('  Viewport:', viewportSize);

    // Take screenshot
    await page.screenshot({
      path: 'tests/e2e/screenshots/fps-true-bottom-left.png',
      fullPage: false
    });

    // Verify position - should be 24px from bottom and left edges (bottom-6 left-6 in Tailwind)
    // Allow 2px tolerance for potential browser rendering differences
    const tolerance = 2;

    expect(distanceFromLeft).toBeGreaterThanOrEqual(24 - tolerance);
    expect(distanceFromLeft).toBeLessThanOrEqual(24 + tolerance);

    expect(distanceFromBottom).toBeGreaterThanOrEqual(24 - tolerance);
    expect(distanceFromBottom).toBeLessThanOrEqual(24 + tolerance);

    // Additional verification: ensure it's not at the top
    const distanceFromTop = boundingBox.y;
    expect(distanceFromTop).toBeGreaterThan(100); // Should be far from top

    console.log('✅ FPS monitor is correctly positioned at TRUE bottom-left corner');
  });

  test('should capture annotated screenshot showing position', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3001');

    // Click "Court View" in navigation to load 3D scene
    await page.click('text=Court View');

    // Wait for loading screen to appear first
    await page.waitForSelector('[data-testid="loading-screen"]', { state: 'visible', timeout: 10000 });

    // Wait for loading screen to disappear
    await page.waitForSelector('[data-testid="loading-screen"]', { state: 'hidden', timeout: 60000 });

    // Wait additional 3 seconds for scene to fully load and FPS monitor to settle
    await page.waitForTimeout(3000);

    // Add visual indicators using JavaScript injection
    await page.evaluate(() => {
      const fpsMeter = document.querySelector('[data-testid="fps-meter"]') as HTMLElement;
      if (fpsMeter) {
        const rect = fpsMeter.getBoundingClientRect();

        // Create overlay div to show measurements
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '999999';

        // Draw lines showing distances
        overlay.innerHTML = `
          <!-- Left edge indicator -->
          <div style="position: absolute; left: 0; top: ${rect.bottom}px; width: ${rect.left}px; height: 2px; background: red;"></div>
          <div style="position: absolute; left: ${rect.left / 2 - 20}px; top: ${rect.bottom - 20}px; color: red; font-weight: bold; font-size: 14px; background: rgba(0,0,0,0.8); padding: 2px 4px; border-radius: 2px;">${Math.round(rect.left)}px</div>

          <!-- Bottom edge indicator -->
          <div style="position: absolute; left: ${rect.right}px; top: ${rect.bottom}px; width: 2px; height: ${window.innerHeight - rect.bottom}px; background: red;"></div>
          <div style="position: absolute; left: ${rect.right + 5}px; top: ${rect.bottom + (window.innerHeight - rect.bottom) / 2 - 10}px; color: red; font-weight: bold; font-size: 14px; background: rgba(0,0,0,0.8); padding: 2px 4px; border-radius: 2px;">${Math.round(window.innerHeight - rect.bottom)}px</div>

          <!-- Border around FPS meter -->
          <div style="position: absolute; left: ${rect.left - 2}px; top: ${rect.top - 2}px; width: ${rect.width + 4}px; height: ${rect.height + 4}px; border: 2px solid lime; box-sizing: border-box;"></div>
        `;

        document.body.appendChild(overlay);
      }
    });

    // Take annotated screenshot
    await page.screenshot({
      path: 'tests/e2e/screenshots/fps-true-bottom-left-annotated.png',
      fullPage: false
    });

    console.log('✅ Annotated screenshot saved');
  });
});
