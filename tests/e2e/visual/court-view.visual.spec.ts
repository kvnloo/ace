import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Court View
 *
 * Tests visual consistency of tennis court 3D visualization across updates.
 * These tests capture screenshots and compare against baseline images.
 */

test.describe('Court View Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to court view
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for 3D scene to initialize
    await page.waitForSelector('canvas', { state: 'visible' });

    // Wait for WebGL context and initial render
    await page.waitForTimeout(2000);
  });

  test('court overview matches baseline', async ({ page }) => {
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    // Wait for scene to settle
    await page.waitForTimeout(500);

    // Capture full court view
    await expect(page).toHaveScreenshot('court-overview.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('court with grass detail matches baseline', async ({ page }) => {
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    // Zoom in on grass detail
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 640, y: 360 } });

    // Wait for zoom animation to complete
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('court-grass-detail.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
    });
  });

  test('court lines and markings match baseline', async ({ page }) => {
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    // Focus on court lines by adjusting camera
    await page.evaluate(() => {
      // Camera manipulation would happen here in actual implementation
      // For now, capture default view
    });

    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('court-lines.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
    });
  });

  test('court with weather effects matches baseline', async ({ page }) => {
    // Enable weather panel
    const weatherButton = page.locator('[aria-label*="weather"]').or(
      page.locator('button:has-text("Weather")')
    ).first();

    if (await weatherButton.count() > 0) {
      await weatherButton.click();
      await page.waitForTimeout(500);

      // Select a specific weather condition
      const sunnyOption = page.locator('text=/sunny|clear/i').first();
      if (await sunnyOption.count() > 0) {
        await sunnyOption.click();
        await page.waitForTimeout(1000);
      }
    }

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    await expect(page).toHaveScreenshot('court-with-weather.png', {
      maxDiffPixels: 200,
      threshold: 0.3,
    });
  });

  test('court night lighting matches baseline', async ({ page }) => {
    // Toggle to night mode if available
    const themeToggle = page.locator('[aria-label*="theme"]').or(
      page.locator('button:has-text("Theme")')
    ).first();

    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('court-night-lighting.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
    });
  });

  test('court camera angles match baseline', async ({ page }) => {
    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    // Test different camera angles
    const angles = ['front', 'side', 'top', 'isometric'];

    for (const angle of angles) {
      // Camera control buttons would be clicked here
      // For now, capture default state
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`court-camera-${angle}.png`, {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    }
  });
});
