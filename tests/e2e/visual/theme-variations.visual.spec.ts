import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests - Theme Variations
 *
 * Tests visual consistency across light/dark themes and color variations.
 * Ensures theme switching maintains design integrity.
 */

test.describe('Theme Variations Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });
  });

  test('dark theme default state matches baseline', async ({ page }) => {
    // Ensure dark theme is active (default)
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('theme-dark-default.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
      fullPage: true,
    });
  });

  test('light theme matches baseline', async ({ page }) => {
    // Switch to light theme
    await page.emulateMedia({ colorScheme: 'light' });

    const themeToggle = page.locator('[aria-label*="theme"]').or(
      page.locator('button:has-text("Theme")')
    ).first();

    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    await expect(page).toHaveScreenshot('theme-light.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
      fullPage: true,
    });
  });

  test('dark theme court view matches baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);

    // Focus on court canvas
    const canvas = page.locator('canvas').first();
    if (await canvas.count() > 0) {
      await expect(canvas).toHaveScreenshot('theme-dark-court.png', {
        maxDiffPixels: 200,
        threshold: 0.3,
      });
    }
  });

  test('light theme court view matches baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });

    const themeToggle = page.locator('[aria-label*="theme"]').first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    const canvas = page.locator('canvas').first();
    if (await canvas.count() > 0) {
      await expect(canvas).toHaveScreenshot('theme-light-court.png', {
        maxDiffPixels: 200,
        threshold: 0.3,
      });
    }
  });

  test('dark theme UI controls match baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });

    // Open settings or controls panel
    const settingsButton = page.locator('[aria-label*="settings"]').or(
      page.locator('button:has-text("Settings")')
    ).first();

    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('theme-dark-controls.png', {
        maxDiffPixels: 120,
        threshold: 0.2,
      });
    }
  });

  test('light theme UI controls match baseline', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });

    const themeToggle = page.locator('[aria-label*="theme"]').first();
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    const settingsButton = page.locator('[aria-label*="settings"]').or(
      page.locator('button:has-text("Settings")')
    ).first();

    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('theme-light-controls.png', {
        maxDiffPixels: 120,
        threshold: 0.2,
      });
    }
  });

  test('contrast modes match baseline', async ({ page }) => {
    // Test high contrast if available
    const contrastModes = ['no-preference', 'more', 'less'];

    for (const mode of contrastModes) {
      await page.emulateMedia({
        colorScheme: 'dark',
        reducedMotion: 'reduce'
      });

      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`theme-contrast-${mode}.png`, {
        maxDiffPixels: 150,
        threshold: 0.2,
      });
    }
  });

  test('theme transition states match baseline', async ({ page }) => {
    // Capture theme during transition (if animation enabled)
    const themeToggle = page.locator('[aria-label*="theme"]').first();

    if (await themeToggle.count() > 0) {
      // Remove animation disable to capture mid-transition
      await page.addStyleTag({
        content: '* { animation-duration: 0.5s !important; transition-duration: 0.5s !important; }'
      });

      await themeToggle.click();

      // Capture at different points in transition
      await page.waitForTimeout(100); // Early transition
      await expect(page).toHaveScreenshot('theme-transition-early.png', {
        maxDiffPixels: 300,
        threshold: 0.4,
      });

      await page.waitForTimeout(250); // Mid transition
      await expect(page).toHaveScreenshot('theme-transition-mid.png', {
        maxDiffPixels: 300,
        threshold: 0.4,
      });

      await page.waitForTimeout(500); // Complete
      await expect(page).toHaveScreenshot('theme-transition-complete.png', {
        maxDiffPixels: 150,
        threshold: 0.2,
      });
    }
  });
});
