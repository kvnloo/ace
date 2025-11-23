import { test, expect, devices } from '@playwright/test';

/**
 * Visual Regression Tests - Mobile Responsive Design
 *
 * Tests visual consistency across different mobile viewports and orientations.
 * Ensures responsive design maintains quality on various devices.
 */

const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'iPad Mini', device: devices['iPad Mini'] },
];

test.describe('Mobile Responsive Visual Regression', () => {
  for (const { name, device } of mobileDevices) {
    test.describe(`${name}`, () => {
      test.use({ ...device });

      test('home screen portrait matches baseline', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Wait for 3D scene to initialize
        await page.waitForTimeout(2000);

        await page.addStyleTag({
          content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
        });

        await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}-portrait.png`, {
          maxDiffPixels: 150,
          threshold: 0.2,
          fullPage: true,
        });
      });

      test('navigation menu matches baseline', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Open mobile menu
        const menuButton = page.locator('[aria-label*="menu"]').or(
          page.locator('button:has-text("Menu")')
        ).first();

        if (await menuButton.count() > 0) {
          await menuButton.click();
          await page.waitForTimeout(500);
        }

        await page.addStyleTag({
          content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
        });

        await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}-menu.png`, {
          maxDiffPixels: 100,
          threshold: 0.2,
        });
      });

      test('court view mobile matches baseline', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        await page.addStyleTag({
          content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
        });

        // Capture court view on mobile
        await expect(page).toHaveScreenshot(`${name.toLowerCase().replace(/\s+/g, '-')}-court.png`, {
          maxDiffPixels: 200,
          threshold: 0.3,
        });
      });
    });
  }

  test.describe('Tablet Landscape', () => {
    test.use({ ...devices['iPad Pro'] });

    test('landscape orientation matches baseline', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      await page.addStyleTag({
        content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
      });

      await expect(page).toHaveScreenshot('tablet-landscape.png', {
        maxDiffPixels: 200,
        threshold: 0.2,
        fullPage: true,
      });
    });
  });

  test.describe('Touch Interactions', () => {
    test.use({ ...devices['Pixel 5'] });

    test('touch controls panel matches baseline', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Simulate touch interaction
      const canvas = page.locator('canvas').first();
      if (await canvas.count() > 0) {
        await canvas.tap();
        await page.waitForTimeout(1000);
      }

      await page.addStyleTag({
        content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
      });

      await expect(page).toHaveScreenshot('mobile-touch-controls.png', {
        maxDiffPixels: 150,
        threshold: 0.2,
      });
    });
  });
});
