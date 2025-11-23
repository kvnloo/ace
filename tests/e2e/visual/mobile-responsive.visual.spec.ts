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

// iPhone 12 tests
test.use({ ...devices['iPhone 12'] });
test.describe('iPhone 12 Responsive Visual Regression', () => {
  test('home screen portrait matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    await expect(page).toHaveScreenshot('iphone-12-portrait.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
      fullPage: true,
    });
  });

  test('navigation menu matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

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

    await expect(page).toHaveScreenshot('iphone-12-menu.png', {
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

    await expect(page).toHaveScreenshot('iphone-12-court.png', {
      maxDiffPixels: 200,
      threshold: 0.3,
    });
  });
});

// iPhone SE tests
test.use({ ...devices['iPhone SE'] });
test.describe('iPhone SE Responsive Visual Regression', () => {
  test('home screen portrait matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    await expect(page).toHaveScreenshot('iphone-se-portrait.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
      fullPage: true,
    });
  });

  test('navigation menu matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

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

    await expect(page).toHaveScreenshot('iphone-se-menu.png', {
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

    await expect(page).toHaveScreenshot('iphone-se-court.png', {
      maxDiffPixels: 200,
      threshold: 0.3,
    });
  });
});

// Pixel 5 tests
test.use({ ...devices['Pixel 5'] });
test.describe('Pixel 5 Responsive Visual Regression', () => {
  test('home screen portrait matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    await expect(page).toHaveScreenshot('pixel-5-portrait.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
      fullPage: true,
    });
  });

  test('navigation menu matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

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

    await expect(page).toHaveScreenshot('pixel-5-menu.png', {
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

    await expect(page).toHaveScreenshot('pixel-5-court.png', {
      maxDiffPixels: 200,
      threshold: 0.3,
    });
  });

  test.describe('Touch Interactions', () => {
    test('touch controls panel matches baseline', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

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

// iPad Mini tests
test.use({ ...devices['iPad Mini'] });
test.describe('iPad Mini Responsive Visual Regression', () => {
  test('home screen portrait matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.addStyleTag({
      content: '*, *::before, *::after { animation: none !important; transition: none !important; }'
    });

    await expect(page).toHaveScreenshot('ipad-mini-portrait.png', {
      maxDiffPixels: 150,
      threshold: 0.2,
      fullPage: true,
    });
  });

  test('navigation menu matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

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

    await expect(page).toHaveScreenshot('ipad-mini-menu.png', {
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

    await expect(page).toHaveScreenshot('ipad-mini-court.png', {
      maxDiffPixels: 200,
      threshold: 0.3,
    });
  });
});

// Tablet Landscape tests
test.use({ ...devices['iPad Pro'] });
test.describe('Tablet Landscape Responsive Visual Regression', () => {
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
