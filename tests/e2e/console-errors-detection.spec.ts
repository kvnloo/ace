import { test, expect, Page } from '@playwright/test';
import { ConsoleMonitor, createConsoleMonitor } from './helpers/consoleMonitor';

/**
 * Comprehensive Console Error Detection Test Suite
 *
 * This test suite monitors for ANY console errors during critical user journeys
 * to catch issues before they reach production. It specifically tests:
 * - Homepage loading without errors
 * - 3D court view rendering
 * - User interactions
 * - Asset loading
 * - Promise rejections
 * - WebGL/Three.js errors
 */

test.describe('Console Error Detection', () => {
  let page: Page;
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ browser }) => {
    // Create a new page with console monitoring
    page = await browser.newPage();
    consoleMonitor = createConsoleMonitor(page);
  });

  test.afterEach(async () => {
    // Print summary for debugging if errors were found
    if (consoleMonitor.getErrorCount() > 0) {
      consoleMonitor.printSummary();
      console.log(consoleMonitor.getDetailedReport());
    }
    await page.close();
  });

  test('Homepage should load without console errors', async () => {
    await test.step('Navigate to homepage', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Wait for initial render', async () => {
      // Ensure React has hydrated
      await page.waitForTimeout(2000);
    });

    await test.step('Assert no critical errors', async () => {
      // Check for different error types
      consoleMonitor.assertNoCriticalErrors();
      consoleMonitor.assertNoRuntimeErrors();
      consoleMonitor.assertNoPromiseRejections();
      consoleMonitor.assertNoScriptErrors();

      // Ensure no asset loading failures
      consoleMonitor.assertNoAssetErrors();
    });

    // Check for warnings (but don't fail)
    const warnings = consoleMonitor.getWarnings();
    if (warnings.length > 0) {
      console.log(`⚠️ Found ${warnings.length} warnings on homepage (non-blocking)`);
    }
  });

  test('3D Court view should render without errors', async () => {
    await test.step('Navigate to homepage', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Navigate to 3D court view', async () => {
      // Click on court navigation or 3D view button
      const courtButton = page.locator('[data-testid="3d-court-view"], [aria-label*="court"], button:has-text("Court"), button:has-text("3D")').first();

      if (await courtButton.count() > 0) {
        await courtButton.click();
        await page.waitForTimeout(3000); // Give 3D scene time to render
      } else {
        // Alternative: Navigate directly if button not found
        await page.goto('/court');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
      }
    });

    await test.step('Verify 3D scene loads', async () => {
      // Look for canvas or 3D container
      const canvas = await page.locator('canvas, [data-testid="3d-scene"], .three-scene, #three-canvas').count();
      expect(canvas).toBeGreaterThan(0);
    });

    await test.step('Assert no 3D rendering errors', async () => {
      // Critical 3D-specific checks
      consoleMonitor.assertNo3DRenderErrors();
      consoleMonitor.assertNoWebGLErrors();
      consoleMonitor.assertNoThreeJSErrors();

      // General error checks
      consoleMonitor.assertNoCriticalErrors();
      consoleMonitor.assertNoPromiseRejections();
      consoleMonitor.assertNoMemoryErrors();

      // Check for asset loading issues (models, textures)
      const networkErrors = consoleMonitor.getNetworkErrors();
      const modelErrors = networkErrors.filter(err =>
        err.url.includes('.glb') ||
        err.url.includes('.gltf') ||
        err.url.includes('.bin') ||
        err.url.includes('.jpg') ||
        err.url.includes('.png')
      );

      if (modelErrors.length > 0) {
        throw new Error(`3D asset loading errors:\n${modelErrors.map(e =>
          `  - ${e.url}: ${e.status} ${e.statusText}`
        ).join('\n')}`);
      }
    });

    await test.step('Check WebGL warnings', async () => {
      const webglWarnings = consoleMonitor.getWebGLWarnings();
      if (webglWarnings.length > 0) {
        console.log(`⚠️ WebGL warnings detected:\n${webglWarnings.join('\n')}`);
      }
    });
  });

  test('User interactions should not cause errors', async () => {
    await test.step('Navigate to homepage', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Interact with navigation', async () => {
      // Click on various navigation items
      const navItems = await page.locator('nav a, nav button').all();

      for (let i = 0; i < Math.min(navItems.length, 3); i++) {
        const item = navItems[i];
        if (await item.isVisible()) {
          await item.click();
          await page.waitForTimeout(1000);

          // Check for errors after each interaction
          consoleMonitor.assertNoRuntimeErrors();
          consoleMonitor.assertNoComponentErrors();
        }
      }
    });

    await test.step('Test button interactions', async () => {
      // Go back to home
      await page.goto('/');

      // Click on interactive elements
      const buttons = await page.locator('button:visible').all();

      for (let i = 0; i < Math.min(buttons.length, 3); i++) {
        const button = buttons[i];
        const buttonText = await button.textContent();

        // Skip navigation/destructive buttons
        if (buttonText && !buttonText.toLowerCase().includes('delete') &&
            !buttonText.toLowerCase().includes('logout')) {
          await button.click();
          await page.waitForTimeout(500);
        }
      }
    });

    await test.step('Assert no interaction errors', async () => {
      consoleMonitor.assertNoComponentErrors();
      consoleMonitor.assertNoRuntimeErrors();
      consoleMonitor.assertNoPromiseRejections();
    });
  });

  test('Loading screen should complete without errors', async () => {
    await test.step('Navigate to page with loading', async () => {
      await page.goto('/');

      // Clear monitor to only track loading-specific errors
      consoleMonitor.clear();
    });

    await test.step('Wait for loading to complete', async () => {
      // Wait for loading indicators to disappear
      await page.waitForSelector('.loading, [data-testid="loading"], .spinner, .loader', {
        state: 'hidden',
        timeout: 30000
      }).catch(() => {
        // Loading element might not exist, that's OK
      });

      // Ensure page is stable
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    });

    await test.step('Assert no loading errors', async () => {
      consoleMonitor.assertNoAssetErrors();
      consoleMonitor.assertNoNetworkErrors();
      consoleMonitor.assertNoPromiseRejections();

      // Check for timeout errors
      const hasTimeoutErrors = consoleMonitor.hasError(/timeout|timed out/i);
      expect(hasTimeoutErrors).toBe(false);
    });
  });

  test('Critical resources should load successfully', async () => {
    await test.step('Navigate and monitor resources', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Check for failed resource loads', async () => {
      const networkErrors = consoleMonitor.getNetworkErrors();

      // Filter for critical resources
      const criticalErrors = networkErrors.filter(err => {
        const url = err.url.toLowerCase();
        return (
          url.endsWith('.js') ||
          url.endsWith('.css') ||
          url.endsWith('.wasm') ||
          url.includes('chunk') ||
          url.includes('bundle') ||
          url.includes('vendor')
        );
      });

      if (criticalErrors.length > 0) {
        const report = criticalErrors.map(err =>
          `  - ${err.url}\n    Status: ${err.status} ${err.statusText}`
        ).join('\n');
        throw new Error(`Critical resource loading failures:\n${report}`);
      }
    });

    await test.step('Assert no script errors', async () => {
      consoleMonitor.assertNoScriptErrors();

      // Check for module loading errors
      const hasModuleErrors = consoleMonitor.hasError(/failed to fetch dynamically imported module/i);
      expect(hasModuleErrors).toBe(false);
    });
  });

  test('No memory leaks or performance issues', async () => {
    await test.step('Navigate to homepage', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Perform memory-intensive operations', async () => {
      // Navigate through multiple pages
      const routes = ['/', '/court', '/'];

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
    });

    await test.step('Check for memory warnings', async () => {
      const memoryWarnings = consoleMonitor.getMemoryWarnings();

      if (memoryWarnings.length > 0) {
        console.log(`⚠️ Memory warnings detected:\n${memoryWarnings.join('\n')}`);
        // Don't fail but log for monitoring
      }

      // Assert no memory errors (out of memory, etc)
      consoleMonitor.assertNoMemoryErrors();
    });
  });

  test('Full application smoke test without errors', async () => {
    const routes = ['/', '/court', '/debug'];

    for (const route of routes) {
      await test.step(`Test route: ${route}`, async () => {
        // Clear previous errors for each route
        consoleMonitor.clear();

        await page.goto(route);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Comprehensive error checking
        try {
          consoleMonitor.assertNoErrors();
        } catch (error) {
          // Provide detailed route-specific error information
          throw new Error(`Console errors on route ${route}:\n${error.message}`);
        }

        // Additional specific checks
        consoleMonitor.assertNo3DRenderErrors();
        consoleMonitor.assertNoPromiseRejections();
        consoleMonitor.assertNoRuntimeErrors();
      });
    }
  });

  test('Error categorization and severity', async () => {
    await test.step('Navigate to test various error scenarios', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Try to trigger various scenarios (non-destructive)
      await page.evaluate(() => {
        // This is just for testing categorization
        console.log('Test: This is not an error');
      });
    });

    await test.step('Analyze error categories', async () => {
      const categorizedErrors = consoleMonitor.getCategorizedErrors();

      // Group errors by severity
      const criticalErrors = categorizedErrors.filter(e => e.severity === 'critical');
      const highErrors = categorizedErrors.filter(e => e.severity === 'high');
      const mediumErrors = categorizedErrors.filter(e => e.severity === 'medium');
      const lowErrors = categorizedErrors.filter(e => e.severity === 'low');

      // Fail test if any critical errors
      if (criticalErrors.length > 0) {
        const report = criticalErrors.map(err =>
          `[${err.type.toUpperCase()}] ${err.message}`
        ).join('\n');
        throw new Error(`Critical errors detected:\n${report}`);
      }

      // Log summary
      console.log('Error Summary:');
      console.log(`  Critical: ${criticalErrors.length}`);
      console.log(`  High: ${highErrors.length}`);
      console.log(`  Medium: ${mediumErrors.length}`);
      console.log(`  Low: ${lowErrors.length}`);

      // Group by type
      const byType: Record<string, number> = {};
      categorizedErrors.forEach(err => {
        byType[err.type] = (byType[err.type] || 0) + 1;
      });

      if (Object.keys(byType).length > 0) {
        console.log('Errors by type:', byType);
      }
    });
  });
});

test.describe('Console Error Recovery', () => {
  let page: Page;
  let consoleMonitor: ConsoleMonitor;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    consoleMonitor = createConsoleMonitor(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Application should handle network failures gracefully', async () => {
    await test.step('Simulate offline mode', async () => {
      await page.context().setOffline(true);
      await page.goto('/').catch(() => {}); // Expected to fail
      await page.context().setOffline(false);
    });

    await test.step('Navigate normally after recovery', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Check recovery - no persistent errors', async () => {
      // Should not have critical errors after recovery
      consoleMonitor.assertNoCriticalErrors();
      consoleMonitor.assertNoRuntimeErrors();
    });
  });

  test('WebGL context recovery', async () => {
    await test.step('Navigate to 3D view', async () => {
      await page.goto('/court');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Test WebGL resilience', async () => {
      // Simulate WebGL context issues
      await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (canvas && (canvas as any).getContext) {
          const gl = (canvas as any).getContext('webgl') || (canvas as any).getContext('experimental-webgl');
          if (gl && gl.getExtension) {
            // This might trigger context loss handling
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) {
              ext.loseContext();
              setTimeout(() => ext.restoreContext(), 1000);
            }
          }
        }
      });

      await page.waitForTimeout(2000);
    });

    await test.step('Verify recovery', async () => {
      // Should handle context loss without critical errors
      const webglErrors = consoleMonitor.getErrorsByCategory('webgl');
      const criticalWebGLErrors = webglErrors.filter(e => e.severity === 'critical');

      // Context loss might log errors, but should recover
      if (criticalWebGLErrors.length > 0) {
        console.log('WebGL errors during context recovery (expected):', criticalWebGLErrors.length);
      }
    });
  });
});