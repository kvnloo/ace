import { test, expect } from './fixtures';
import { goToHome, waitForScene } from './helpers/navigation';
import { expectCanvasRendered } from './helpers/assertions';
import { ConsoleMonitor, createConsoleMonitor } from './helpers/consoleMonitor';

/**
 * Smoke Tests for ACE Facility
 * Basic validation that the application loads and core features work
 * Enhanced with comprehensive console error monitoring
 */

test.describe('Application Smoke Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    const monitor = createConsoleMonitor(page);

    await goToHome(page);

    // Check page title
    await expect(page).toHaveTitle(/LawnTech Dynamics/i);

    // Verify page is loaded
    const isLoaded = await page.evaluate(() => document.readyState === 'complete');
    expect(isLoaded).toBeTruthy();

    // Comprehensive error assertions
    monitor.assertNoErrors();
    monitor.assertNoCriticalErrors();
    monitor.assertNoPromiseRejections();
    monitor.assertNoAssetErrors();
    monitor.assertNoRuntimeErrors();

    // Print summary if any warnings
    if (monitor.getWarningCount() > 0) {
      console.log(`⚠️ Warnings found on homepage: ${monitor.getWarningCount()}`);
    }
  });

  test('should render Three.js canvas', async ({ canvasPage }) => {
    const monitor = createConsoleMonitor(canvasPage);

    // Canvas is already loaded by fixture
    await expectCanvasRendered(canvasPage);

    // Verify at least one canvas has dimensions
    const canvasSize = await canvasPage.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      for (const canvas of canvases) {
        const htmlCanvas = canvas as HTMLCanvasElement;
        if (htmlCanvas.width > 0 && htmlCanvas.height > 0) {
          return {
            width: htmlCanvas.width,
            height: htmlCanvas.height,
          };
        }
      }
      return { width: 0, height: 0 };
    });

    expect(canvasSize.width).toBeGreaterThan(0);
    expect(canvasSize.height).toBeGreaterThan(0);

    // Comprehensive 3D-specific error assertions
    monitor.assertNoErrors();
    monitor.assertNo3DRenderErrors();
    monitor.assertNoWebGLErrors();
    monitor.assertNoThreeJSErrors();
    monitor.assertNoAssetErrors();
    monitor.assertNoPromiseRejections();

    // Check for WebGL warnings
    const webglWarnings = monitor.getWebGLWarnings();
    if (webglWarnings.length > 0) {
      console.log(`⚠️ WebGL warnings in 3D canvas: ${webglWarnings.length}`);
    }
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

    // Just wait for page to be stable, don't require canvas on homepage
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (if any)
    const criticalErrors = errors.filter(
      (error) => !error.includes('DevTools') && !error.includes('Extension')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    const monitor = createConsoleMonitor(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await goToHome(page);

    // Page should adapt to mobile viewport - check general layout
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox).toBeTruthy();
    expect(bodyBox!.width).toBeLessThanOrEqual(375);

    // Enhanced error assertions for mobile
    monitor.assertNoErrors();
    monitor.assertNoComponentErrors();
    monitor.assertNoRuntimeErrors();
    monitor.assertNoAssetErrors();
  });

  test('should handle page reload without errors', async ({ page }) => {
    const monitor = createConsoleMonitor(page);

    await goToHome(page);
    await page.waitForLoadState('networkidle');

    // Reload page
    await page.reload({ waitUntil: 'networkidle' });

    // Verify page still loads
    const isLoaded = await page.evaluate(() => document.readyState === 'complete');
    expect(isLoaded).toBeTruthy();

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should have navigation elements', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await goToHome(page);

    // Check for common navigation elements (adjust selectors as needed)
    const nav = page.locator('nav, [role="navigation"], header');
    const navCount = await nav.count();

    // At least one navigation element should exist
    expect(navCount).toBeGreaterThan(0);

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should load without JavaScript errors in production build', async ({ page }) => {
    const jsErrors: Error[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error);
    });

    await goToHome(page);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    expect(jsErrors).toHaveLength(0);
  });

  test('should have WebGL2 support', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await goToHome(page);

    const hasWebGL2 = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      return gl !== null;
    });

    expect(hasWebGL2).toBeTruthy();

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should measure performance metrics', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await goToHome(page);
    await page.waitForLoadState('networkidle');

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

    // Assert no console errors
    monitor.assertNoErrors();
  });
});

test.describe('3D Scene Interaction', () => {
  test('should initialize 3D scene', async ({ canvasPage }) => {
    const monitor = new ConsoleMonitor(canvasPage);

    // Wait for scene to be ready
    await waitForScene(canvasPage);

    // Give more time for actual rendering to occur
    await canvasPage.waitForTimeout(2000);

    // Check if WebGL context is active and canvas exists
    const hasActiveGL = await canvasPage.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      for (const canvas of canvases) {
        const htmlCanvas = canvas as HTMLCanvasElement;
        const gl = htmlCanvas.getContext('webgl2');
        if (gl) {
          // Just check if context exists and canvas has size
          return htmlCanvas.width > 0 && htmlCanvas.height > 0;
        }
      }
      return false;
    });

    expect(hasActiveGL).toBeTruthy();

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should handle mouse interaction', async ({ canvasPage }) => {
    const monitor = new ConsoleMonitor(canvasPage);

    await waitForScene(canvasPage);

    // Verify canvas is visible
    const canvas = canvasPage.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Simulate mouse movement over the scene container (not the canvas which has pointer-events-none)
    const sceneContainer = canvasPage.locator('main');
    await sceneContainer.hover({ position: { x: 100, y: 100 } });

    // Simulate click on the scene area
    await sceneContainer.click({ position: { x: 100, y: 100 } });

    // Verify no errors occurred and page is still functional
    await canvasPage.waitForTimeout(500);
    await expect(canvas).toBeVisible();

    // Assert no console errors
    monitor.assertNoErrors();
  });
});
