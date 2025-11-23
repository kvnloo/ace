import { test, expect } from './fixtures';
import { goToHome, waitForScene } from './helpers/navigation';
import { expectCanvasRendered } from './helpers/assertions';

/**
 * Smoke Tests for ACE Facility
 * Basic validation that the application loads and core features work
 */

test.describe('Application Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await goToHome(page);

    // Check page title
    await expect(page).toHaveTitle(/ACE|Facility/i);

    // Verify page is loaded
    const isLoaded = await page.evaluate(() => document.readyState === 'complete');
    expect(isLoaded).toBeTruthy();
  });

  test('should render Three.js canvas', async ({ canvasPage }) => {
    // Canvas is already loaded by fixture
    await expectCanvasRendered(canvasPage);

    // Verify canvas has dimensions
    const canvasSize = await canvasPage.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      return {
        width: canvas.width,
        height: canvas.height,
      };
    });

    expect(canvasSize.width).toBeGreaterThan(0);
    expect(canvasSize.height).toBeGreaterThan(0);
  });

  test('should have no console errors on load', async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await goToHome(page);
    await waitForScene(page);

    // Allow some time for any delayed errors
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter(
      (error) => !error.includes('DevTools') && !error.includes('Extension')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await goToHome(page);

    // Check canvas adapts to viewport
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    expect(canvasBox!.width).toBeLessThanOrEqual(375);
  });

  test('should handle page reload without errors', async ({ page }) => {
    await goToHome(page);
    await waitForScene(page);

    // Reload page
    await page.reload({ waitUntil: 'networkidle' });

    // Verify still works
    await expectCanvasRendered(page);
  });

  test('should have navigation elements', async ({ page }) => {
    await goToHome(page);

    // Check for common navigation elements (adjust selectors as needed)
    const nav = page.locator('nav, [role="navigation"], header');
    const navCount = await nav.count();

    // At least one navigation element should exist
    expect(navCount).toBeGreaterThan(0);
  });

  test('should load without JavaScript errors in production build', async ({ page }) => {
    const jsErrors: Error[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error);
    });

    await goToHome(page);
    await waitForScene(page);

    expect(jsErrors).toHaveLength(0);
  });

  test('should have WebGL2 support', async ({ page }) => {
    await goToHome(page);

    const hasWebGL2 = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      return gl !== null;
    });

    expect(hasWebGL2).toBeTruthy();
  });

  test('should measure performance metrics', async ({ page }) => {
    await goToHome(page);
    await waitForScene(page);

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      };
    });

    // Sanity checks (not strict performance requirements)
    expect(metrics.loadTime).toBeGreaterThanOrEqual(0);
    expect(metrics.domContentLoaded).toBeGreaterThanOrEqual(0);
  });
});

test.describe('3D Scene Interaction', () => {
  test('should initialize 3D scene', async ({ canvasPage }) => {
    // Wait for scene to be ready
    await waitForScene(canvasPage);

    // Check if scene has rendered content
    const hasRenderedContent = await canvasPage.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return false;

      const gl = canvas.getContext('webgl2');
      if (!gl) return false;

      // Check if something was drawn (non-zero pixels)
      const pixels = new Uint8Array(4);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

      return pixels.some((p) => p !== 0);
    });

    expect(hasRenderedContent).toBeTruthy();
  });

  test('should handle mouse interaction', async ({ canvasPage }) => {
    await waitForScene(canvasPage);

    const canvas = canvasPage.locator('canvas');

    // Simulate mouse movement over canvas
    await canvas.hover();

    // Simulate click on canvas
    await canvas.click();

    // Verify no errors occurred
    await canvasPage.waitForTimeout(500);

    // Page should still be functional
    await expect(canvas).toBeVisible();
  });
});
