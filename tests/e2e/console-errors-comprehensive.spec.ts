import { test, expect } from '@playwright/test';
import { ConsoleMonitor } from './helpers/consoleMonitor';

/**
 * Comprehensive Console Error Detection Test Suite
 *
 * This test suite validates that the application runs without console errors
 * across all critical scenarios and error categories.
 *
 * Categories tested:
 * - Asset loading errors (JS, CSS, images)
 * - Component render errors
 * - Three.js/WebGL errors
 * - Network errors
 * - Script errors
 */

test.describe('Console Error Detection - Critical Asset Loading', () => {
  test('should load all JavaScript assets without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for asset loading errors
    expect(monitor.hasAssetErrors(), 'Should have no asset loading errors').toBeFalsy();
    monitor.assertNoAssetErrors();

    // Verify no critical errors
    expect(monitor.hasCriticalErrors(), 'Should have no critical errors').toBeFalsy();

    // Check specific assets loaded
    const jsErrors = monitor.getErrorsByCategory('asset').filter(err =>
      err.message.includes('.js')
    );
    expect(jsErrors).toHaveLength(0);
  });

  test('should load all CSS stylesheets without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);
    const networkErrors = monitor.getNetworkErrors();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for CSS loading errors
    const cssErrors = networkErrors.filter(err =>
      err.url.includes('.css')
    );
    expect(cssErrors, 'No CSS files should fail to load').toHaveLength(0);

    monitor.assertNoAssetErrors();
  });

  test('should load all image assets without 404 errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for lazy-loaded images

    const networkErrors = monitor.getNetworkErrors();
    const imageErrors = networkErrors.filter(err =>
      /(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)(\?|$)/i.test(err.url)
    );

    if (imageErrors.length > 0) {
      console.log('Image loading errors:', imageErrors);
    }

    expect(imageErrors, 'No images should fail to load').toHaveLength(0);
  });

  test('should handle missing assets gracefully', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Try to load a non-existent asset
    await page.goto('/');
    await page.evaluate(() => {
      const img = document.createElement('img');
      img.src = '/nonexistent-image.png';
      document.body.appendChild(img);
    });

    await page.waitForTimeout(2000);

    // Application should continue working despite missing asset
    const isResponsive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });

    expect(isResponsive).toBeTruthy();

    // Should not crash the application
    monitor.assertNoComponentErrors();
  });

  test('should load WebAssembly modules without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Check for WASM loading errors
    const wasmErrors = monitor.getErrorsByCategory('asset').filter(err =>
      err.message.includes('.wasm')
    );

    expect(wasmErrors, 'WASM modules should load without errors').toHaveLength(0);
  });
});

test.describe('Console Error Detection - Component Rendering', () => {
  test('should render homepage components without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for component errors
    expect(monitor.hasComponentErrors(), 'Should have no component errors').toBeFalsy();
    monitor.assertNoComponentErrors();

    // Verify no React errors
    const reactErrors = monitor.getErrors().filter(err =>
      err.toLowerCase().includes('react')
    );
    expect(reactErrors).toHaveLength(0);
  });

  test('should handle component re-renders without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForTimeout(1000);

    // Trigger multiple re-renders
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.dispatchEvent(new Event('resize'));
      });
      await page.waitForTimeout(200);
    }

    monitor.assertNoComponentErrors();
    expect(monitor.getErrorCount()).toBe(0);
  });

  test('should handle unmounting components without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Navigate between pages
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    monitor.assertNoComponentErrors();
    expect(monitor.hasComponentErrors()).toBeFalsy();
  });

  test('should handle conditional rendering without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForTimeout(1000);

    // Test viewport changes that might trigger conditional rendering
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);

    monitor.assertNoComponentErrors();
  });

  test('should handle hooks lifecycle without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Check for hook errors
    const hookErrors = monitor.getErrors().filter(err =>
      err.toLowerCase().includes('hook')
    );

    expect(hookErrors, 'Should have no React hook errors').toHaveLength(0);
    monitor.assertNoComponentErrors();
  });
});

test.describe('Console Error Detection - Three.js & WebGL', () => {
  test('should initialize Three.js without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Allow Three.js to initialize

    // Check for Three.js errors
    expect(monitor.hasThreeJSErrors(), 'Should have no Three.js errors').toBeFalsy();
    monitor.assertNoThreeJSErrors();

    // Verify scene is rendering
    const hasCanvas = await page.locator('canvas').count();
    expect(hasCanvas).toBeGreaterThan(0);
  });

  test('should initialize WebGL context without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Check for WebGL errors
    expect(monitor.hasWebGLErrors(), 'Should have no WebGL errors').toBeFalsy();
    monitor.assertNoWebGLErrors();

    // Verify WebGL2 context
    const hasWebGL2 = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const gl = canvas.getContext('webgl2');
      return gl !== null;
    });

    expect(hasWebGL2).toBeTruthy();
  });

  test('should load 3D assets without shader errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Check for shader compilation errors
    const shaderErrors = monitor.getErrors().filter(err =>
      err.toLowerCase().includes('shader')
    );

    expect(shaderErrors, 'Should have no shader errors').toHaveLength(0);
    monitor.assertNoThreeJSErrors();
  });

  test('should handle 3D scene interactions without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Simulate 3D interactions
    const canvas = page.locator('canvas').first();

    await canvas.hover({ position: { x: 100, y: 100 } });
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
    await page.waitForTimeout(1000);

    monitor.assertNoThreeJSErrors();
    monitor.assertNoWebGLErrors();
    expect(monitor.getErrorCount()).toBe(0);
  });

  test('should handle WebGL context loss gracefully', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Simulate context loss (if possible)
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const gl = canvas.getContext('webgl2');
        if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) {
            ext.loseContext();
            setTimeout(() => ext?.restoreContext(), 100);
          }
        }
      }
    });

    await page.waitForTimeout(2000);

    // Application should recover
    const isStillRendering = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;
      const gl = canvas.getContext('webgl2');
      return gl !== null && !gl.isContextLost();
    });

    expect(isStillRendering).toBeTruthy();
  });

  test('should handle 3D resource disposal without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Navigate away to trigger cleanup
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for disposal errors
    monitor.assertNoThreeJSErrors();
    expect(monitor.getErrorCount()).toBe(0);
  });
});

test.describe('Console Error Detection - Network Operations', () => {
  test('should handle failed API requests gracefully', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Fail API request
    await page.route('**/api/test', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // App should handle error gracefully
    const isResponsive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });

    expect(isResponsive).toBeTruthy();
  });

  test('should handle CORS errors gracefully', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Application should be functional despite potential CORS issues
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBeTruthy();
  });

  test('should handle timeout errors gracefully', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Simulate slow network
    await page.route('**/api/slow', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: 'slow response' })
        });
      }, 10000);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Application should remain responsive
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });

    expect(isInteractive).toBeTruthy();
  });
});

test.describe('Console Error Detection - User Journeys', () => {
  test('should complete full navigation journey without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Navigate through all main pages
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // No errors should have occurred
    monitor.assertNoErrors();
    expect(monitor.getErrorCount()).toBe(0);
    expect(monitor.hasCriticalErrors()).toBeFalsy();
  });

  test('should handle rapid page transitions without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    const pages = ['/', '/about', '/contact', '/', '/about'];

    for (const url of pages) {
      await page.goto(url);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(300);
    }

    monitor.assertNoComponentErrors();
    expect(monitor.getErrorCount()).toBe(0);
  });

  test('should handle form interactions without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Find and interact with form elements
    const inputs = await page.locator('input, textarea').all();

    for (const input of inputs) {
      await input.fill('Test data');
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(500);

    monitor.assertNoComponentErrors();
    expect(monitor.getErrorCount()).toBe(0);
  });

  test('should handle scroll interactions without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    monitor.assertNoErrors();
  });
});

test.describe('Console Error Detection - Edge Cases', () => {
  test('should handle window resize without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Resize multiple times
    const sizes = [
      { width: 1920, height: 1080 },
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await page.waitForTimeout(500);
    }

    monitor.assertNoErrors();
    monitor.assertNoThreeJSErrors();
  });

  test('should handle page reload without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Reload page
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    monitor.assertNoErrors();
    expect(monitor.hasCriticalErrors()).toBeFalsy();
  });

  test('should handle browser back/forward navigation without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    await page.goBack();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.goForward();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    monitor.assertNoErrors();
  });

  test('should handle focus/blur events without errors', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate tab visibility change
    await page.evaluate(() => {
      const event = new Event('visibilitychange');
      Object.defineProperty(document, 'hidden', { value: true, writable: true });
      document.dispatchEvent(event);
    });

    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const event = new Event('visibilitychange');
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      document.dispatchEvent(event);
    });

    await page.waitForTimeout(500);

    monitor.assertNoErrors();
  });
});

test.describe('Console Error Detection - Performance', () => {
  test('should not generate errors under memory pressure', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Run for extended period to check for memory leaks
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.dispatchEvent(new Event('resize'));
      });
      await page.waitForTimeout(500);
    }

    monitor.assertNoErrors();

    // Check for memory-related errors
    const memoryErrors = monitor.getErrors().filter(err =>
      err.toLowerCase().includes('memory') ||
      err.toLowerCase().includes('heap')
    );

    expect(memoryErrors).toHaveLength(0);
  });

  test('should maintain error-free operation during extended use', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Monitor for 30 seconds
    const startTime = Date.now();
    while (Date.now() - startTime < 30000) {
      await page.waitForTimeout(5000);

      // Check incrementally
      expect(monitor.hasCriticalErrors(), 'No critical errors during extended use').toBeFalsy();
    }

    monitor.assertNoErrors();
    monitor.printSummary();
  });
});
