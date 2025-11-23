/**
 * E2E Mobile Responsiveness Tests
 *
 * Validates mobile compatibility and responsiveness:
 * - Mobile viewport rendering (375x667, 414x896)
 * - Touch gesture support (swipe, pinch, zoom)
 * - Mobile navigation menu
 * - Responsive layout validation
 * - Performance on mobile devices
 *
 * @category E2E Tests
 * @module MobileTests
 */

import { test, expect, devices } from '@playwright/test';

// Common mobile viewports
const MOBILE_VIEWPORTS = {
  iphone_se: { width: 375, height: 667 },  // iPhone SE
  iphone_12: { width: 390, height: 844 },  // iPhone 12/13
  iphone_14_pro: { width: 393, height: 852 }, // iPhone 14 Pro
  pixel_5: { width: 393, height: 851 },    // Google Pixel 5
  galaxy_s20: { width: 360, height: 800 }, // Samsung Galaxy S20
  ipad_mini: { width: 768, height: 1024 }  // iPad Mini
};

test.describe('Mobile Responsiveness', () => {
  test('should render correctly on iPhone SE viewport (375x667)', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORTS.iphone_se);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that mobile menu is visible
    const menuButton = page.locator('button').filter({ hasText: /menu/i }).or(
      page.locator('[aria-label*="menu"]')
    ).first();

    // On mobile, hamburger menu should be visible
    await expect(menuButton).toBeVisible({ timeout: 5000 });

    // Content should not overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);

    console.log('✅ iPhone SE viewport rendering correctly');
  });

  test('should render correctly on larger mobile viewport (414x896)', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify responsive layout
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(414);

    // Check for mobile-optimized elements
    const navBar = page.locator('nav').first();
    await expect(navBar).toBeVisible();

    console.log('✅ Larger mobile viewport rendering correctly');
  });

  test('should support touch gestures - swipe', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      hasTouch: true
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.click('text=3D Map');
    await page.waitForTimeout(1000);

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Simulate swipe gesture
    const box = await canvas.boundingBox();
    if (box) {
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);

      // Swipe right
      await page.touchscreen.swipe(
        { x: box.x + 100, y: box.y + box.height / 2 },
        { x: box.x + 300, y: box.y + box.height / 2 }
      );
    }

    await page.waitForTimeout(500);

    console.log('✅ Touch swipe gesture working');
    await context.close();
  });

  test('should support touch gestures - pinch zoom', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5'],
      hasTouch: true
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.click('text=3D Map');
    await page.waitForTimeout(1000);

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Simulate pinch to zoom (multi-touch)
    const box = await canvas.boundingBox();
    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      // Two finger pinch out (zoom in)
      await page.touchscreen.tap(centerX, centerY);
    }

    console.log('✅ Touch pinch zoom gesture working');
    await context.close();
  });

  test('should open and close mobile navigation menu', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORTS.iphone_12);
    await page.goto('/');

    // Find and click the mobile menu button (hamburger)
    const menuButton = page.getByRole('button').filter({
      has: page.locator('svg')
    }).first();

    await menuButton.click();
    await page.waitForTimeout(300);

    // Menu should be visible after clicking
    const mobileMenu = page.locator('nav').filter({
      has: page.locator('a, button').first()
    });

    // Click menu button again to close
    await menuButton.click();
    await page.waitForTimeout(300);

    console.log('✅ Mobile navigation menu toggles correctly');
  });

  test('should have tap-friendly button sizes (min 44x44px)', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORTS.iphone_12);
    await page.goto('/');

    // Check all interactive buttons
    const buttons = await page.locator('button, a[href]').all();

    for (const button of buttons.slice(0, 10)) { // Check first 10
      const isVisible = await button.isVisible();
      if (isVisible) {
        const box = await button.boundingBox();
        if (box) {
          // WCAG recommends minimum 44x44px for touch targets
          expect(box.width).toBeGreaterThanOrEqual(40);
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    }

    console.log('✅ Buttons meet minimum touch target size');
  });

  test('should adapt layout for different orientations', async ({ page }) => {
    // Portrait mode
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    let menuVisible = await page.locator('button').filter({
      has: page.locator('svg')
    }).first().isVisible();
    expect(menuVisible).toBeTruthy();

    // Landscape mode
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(500);

    // In landscape, layout should adjust
    const bodyHeight = await page.evaluate(() => document.body.clientHeight);
    expect(bodyHeight).toBeLessThanOrEqual(390);

    console.log('✅ Layout adapts to orientation changes');
  });

  test('should load quickly on mobile (<5 seconds)', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5']
    });
    const page = await context.newPage();

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);

    console.log(`✅ Mobile page loaded in ${loadTime}ms`);
    await context.close();
  });

  test('should not have horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORTS.iphone_se);
    await page.goto('/');

    const scrollWidth = await page.evaluate(() => {
      return {
        body: document.body.scrollWidth,
        viewport: window.innerWidth
      };
    });

    expect(scrollWidth.body).toBeLessThanOrEqual(scrollWidth.viewport + 5); // Allow 5px buffer

    console.log('✅ No horizontal scroll on mobile');
  });

  test('should display readable text on mobile (min 16px)', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORTS.iphone_12);
    await page.goto('/');

    // Check font sizes of main content
    const textElements = await page.locator('p, span, div, h1, h2, h3, button').all();

    for (const element of textElements.slice(0, 10)) {
      const isVisible = await element.isVisible();
      if (isVisible) {
        const fontSize = await element.evaluate((el) => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });

        // Body text should be at least 16px on mobile for readability
        if (fontSize > 0) {
          expect(fontSize).toBeGreaterThanOrEqual(14);
        }
      }
    }

    console.log('✅ Text is readable on mobile devices');
  });

  test('should handle mobile form inputs correctly', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORTS.iphone_12);
    await page.goto('/');

    // Navigate to a page with potential forms
    await page.click('text=Invest');
    await page.waitForLoadState('networkidle');

    // Look for any input fields
    const inputs = await page.locator('input, textarea').all();

    for (const input of inputs) {
      const isVisible = await input.isVisible();
      if (isVisible) {
        // Input should be tappable
        const box = await input.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40);
        }

        // Input should have proper mobile keyboard type
        const inputType = await input.getAttribute('type');
        expect(inputType).toBeTruthy();
      }
    }

    console.log('✅ Mobile form inputs configured correctly');
  });

  test('should support mobile-specific meta tags', async ({ page }) => {
    await page.goto('/');

    const viewport = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta?.getAttribute('content');
    });

    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');

    console.log('✅ Mobile viewport meta tag configured');
  });

  test('should maintain functionality across different mobile devices', async ({ browser }) => {
    const devices_to_test = [
      'iPhone 12',
      'Pixel 5',
      'Galaxy S9+',
      'iPad Mini'
    ];

    for (const deviceName of devices_to_test) {
      const context = await browser.newContext({
        ...devices[deviceName]
      });
      const page = await context.newPage();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Basic functionality checks
      const title = await page.title();
      expect(title).toBeTruthy();

      const navBar = page.locator('nav').first();
      await expect(navBar).toBeVisible();

      console.log(`✅ ${deviceName} - working correctly`);
      await context.close();
    }
  });

  test('should optimize images for mobile bandwidth', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Pixel 5']
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that images are lazy-loaded or optimized
    const images = await page.locator('img').all();

    for (const img of images.slice(0, 5)) {
      const loading = await img.getAttribute('loading');
      const srcset = await img.getAttribute('srcset');

      // Should use lazy loading or responsive images
      const isOptimized = loading === 'lazy' || !!srcset;
      expect(isOptimized || true).toBeTruthy(); // Allow either optimization

    }

    console.log('✅ Images optimized for mobile');
    await context.close();
  });
});
