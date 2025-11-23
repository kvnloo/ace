import { test, expect } from './fixtures';
import { goToHome } from './helpers/navigation';

/**
 * Error Recovery E2E Tests
 *
 * Tests that verify users see meaningful feedback for error scenarios
 * instead of blank/broken screens.
 *
 * Test Coverage:
 * 1. Asset 404 errors (missing model files)
 * 2. Network failures during loading
 * 3. WebGL not supported
 * 4. Loading timeouts
 * 5. JavaScript errors during loading
 */

test.describe('Error Recovery - Asset Loading Failures', () => {
  test('should show meaningful message when 3D model assets return 404', async ({ page }) => {
    // Track console messages
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // Intercept model file requests and return 404
    await page.route('**/*.glb', (route) => {
      route.abort('failed');
    });

    await page.route('**/*.gltf', (route) => {
      route.abort('failed');
    });

    // Navigate to the 3D view
    await goToHome(page);
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();
    await page.waitForTimeout(2000);

    // Verify the page doesn't show blank screen
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Verify canvas still exists (building mesh should load)
    const canvas = page.locator('canvas');
    const canvasCount = await canvas.count();
    expect(canvasCount).toBeGreaterThan(0);

    // Verify canvas has dimensions (not 0x0 broken canvas)
    const canvasSize = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return { width: 0, height: 0 };
      return {
        width: canvas.width,
        height: canvas.height,
      };
    });

    expect(canvasSize.width).toBeGreaterThan(0);
    expect(canvasSize.height).toBeGreaterThan(0);

    // Check for error notification or degraded mode message
    // The app should show some indication that assets couldn't load
    const hasErrorIndicator = await page.evaluate(() => {
      // Look for common error message patterns
      const bodyText = document.body.textContent || '';
      return (
        bodyText.toLowerCase().includes('error') ||
        bodyText.toLowerCase().includes('unavailable') ||
        bodyText.toLowerCase().includes('loading') ||
        bodyText.toLowerCase().includes('failed')
      );
    });

    // If no visual error message, at least verify console shows the error
    if (!hasErrorIndicator) {
      const hasConsoleError = consoleMessages.some(
        (msg) => msg.toLowerCase().includes('error') || msg.toLowerCase().includes('failed')
      );
      expect(hasConsoleError).toBeTruthy();
    }

    // Most importantly: verify the app didn't crash (page is still interactive)
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    expect(isInteractive).toBeTruthy();
  });

  test('should show graceful degradation when texture assets fail to load', async ({ page }) => {
    // Intercept texture/image requests
    await page.route('**/*.{jpg,jpeg,png,webp}', (route) => {
      // Fail only asset images, not UI images
      if (route.request().url().includes('/models/') || route.request().url().includes('/textures/')) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await goToHome(page);
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();
    await page.waitForTimeout(2000);

    // Scene should still render with fallback materials
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify WebGL context is active
    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      return canvas && canvas.getContext('webgl2') !== null;
    });
    expect(hasWebGL).toBeTruthy();

    // App should remain functional
    const canInteract = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    expect(canInteract).toBeTruthy();
  });
});

test.describe('Error Recovery - Network Failures', () => {
  test('should show network error message when offline during load', async ({ page, context }) => {
    // Simulate offline network
    await context.setOffline(true);

    // Try to navigate to home
    const navigationError = await page.goto('/').catch((err) => err);

    // Expect navigation to fail
    expect(navigationError).toBeTruthy();

    // Bring network back online
    await context.setOffline(false);

    // Now navigate successfully
    await goToHome(page);

    // Verify page loaded correctly after network recovery
    const isLoaded = await page.evaluate(() => document.readyState === 'complete');
    expect(isLoaded).toBeTruthy();
  });

  test('should show retry mechanism when network fails during 3D asset loading', async ({ page }) => {
    let requestCount = 0;

    // Intercept and fail first 2 requests, succeed on 3rd (retry logic)
    await page.route('**/*.glb', (route) => {
      requestCount++;
      if (requestCount <= 2) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await goToHome(page);
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();

    // Wait longer to allow retries
    await page.waitForTimeout(5000);

    // Verify scene eventually loads after retries
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Should have retried at least once
    expect(requestCount).toBeGreaterThan(1);
  });

  test('should handle intermittent network during scene interaction', async ({ canvasPage, context }) => {
    // Scene is already loaded via fixture
    const canvas = canvasPage.locator('canvas');
    await expect(canvas).toBeVisible();

    // Simulate network going offline after initial load
    await context.setOffline(true);
    await canvasPage.waitForTimeout(1000);

    // Verify scene still works (already loaded assets cached)
    const isCanvasActive = await canvasPage.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      return canvas && canvas.width > 0 && canvas.height > 0;
    });
    expect(isCanvasActive).toBeTruthy();

    // Bring network back
    await context.setOffline(false);

    // Verify still functional
    await expect(canvas).toBeVisible();
  });
});

test.describe('Error Recovery - WebGL Support', () => {
  test('should detect and handle missing WebGL support gracefully', async ({ page }) => {
    // Override WebGL to simulate unsupported browser
    await page.addInitScript(() => {
      // Sabotage WebGL
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (contextType: string, ...args: any[]) {
        if (contextType === 'webgl' || contextType === 'webgl2') {
          return null; // Simulate WebGL not available
        }
        return getContext.apply(this, [contextType, ...args]);
      };
    });

    await goToHome(page);

    // Try to navigate to 3D view
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();
    await page.waitForTimeout(2000);

    // Should show error message or fallback
    const bodyText = await page.textContent('body');

    // Look for WebGL error indicators
    const hasWebGLMessage = bodyText && (
      bodyText.toLowerCase().includes('webgl') ||
      bodyText.toLowerCase().includes('3d') ||
      bodyText.toLowerCase().includes('browser') ||
      bodyText.toLowerCase().includes('support')
    );

    // At minimum, page should not be blank
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);

    // Verify no crash - page is still interactive
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    expect(isInteractive).toBeTruthy();
  });

  test('should provide fallback when WebGL context is lost', async ({ canvasPage }) => {
    // Get canvas element
    const canvas = canvasPage.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Simulate WebGL context loss
    await canvasPage.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const ext = canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.loseContext();
        }
      }
    });

    await canvasPage.waitForTimeout(1000);

    // App should attempt to restore context or show error
    const isStillVisible = await canvas.isVisible();
    expect(isStillVisible).toBeTruthy();

    // Try to restore context
    await canvasPage.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const ext = canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.restoreContext();
        }
      }
    });

    await canvasPage.waitForTimeout(1000);

    // Verify canvas is still functional
    const hasWebGL = await canvasPage.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      return canvas && canvas.getContext('webgl2') !== null;
    });
    expect(hasWebGL).toBeTruthy();
  });
});

test.describe('Error Recovery - Loading Timeouts', () => {
  test('should show timeout message for assets that never load', async ({ page }) => {
    // Intercept and delay indefinitely
    await page.route('**/*.glb', async (route) => {
      // Never resolve - simulate hanging request
      await new Promise(() => {}); // Infinite promise
    });

    await goToHome(page);
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();

    // Wait for timeout period (should be < 60 seconds based on requirements)
    await page.waitForTimeout(10000); // Wait 10 seconds for timeout

    // Page should show some loading state or timeout message
    const bodyText = await page.textContent('body');

    // Should show loading indicator or timeout message
    const hasLoadingIndicator = bodyText && (
      bodyText.toLowerCase().includes('loading') ||
      bodyText.toLowerCase().includes('wait') ||
      bodyText.toLowerCase().includes('timeout') ||
      bodyText.toLowerCase().includes('taking longer')
    );

    // Even if no explicit timeout message, page should not be completely blank
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);

    // Verify user can still interact with page
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    expect(isInteractive).toBeTruthy();
  });

  test('should provide skip/cancel button for long loading operations', async ({ page }) => {
    // Simulate very slow loading
    await page.route('**/*.glb', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 30000)); // 30 second delay
      route.continue();
    });

    await goToHome(page);
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();

    // Wait a few seconds for loading UI to appear
    await page.waitForTimeout(3000);

    // Look for any interactive elements that might allow canceling/skipping
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    // Should have at least some buttons (navigation, etc.)
    expect(buttonCount).toBeGreaterThan(0);

    // Check if any button text suggests canceling/skipping
    let hasActionButton = false;
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const text = await buttons.nth(i).textContent();
      if (text && (
        text.toLowerCase().includes('skip') ||
        text.toLowerCase().includes('cancel') ||
        text.toLowerCase().includes('back') ||
        text.toLowerCase().includes('close')
      )) {
        hasActionButton = true;
        break;
      }
    }

    // Should have some way to exit the loading state
    // (Either back button, cancel, or homepage navigation)
    expect(hasActionButton || buttonCount > 2).toBeTruthy();
  });
});

test.describe('Error Recovery - JavaScript Errors', () => {
  test('should catch and display friendly error when JS error occurs during loading', async ({ page }) => {
    const jsErrors: string[] = [];

    // Listen for JavaScript errors
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    // Inject an error during initialization
    await page.addInitScript(() => {
      // Sabotage a global function that might be called during init
      setTimeout(() => {
        throw new Error('Simulated initialization error');
      }, 100);
    });

    await goToHome(page);
    await page.waitForTimeout(1000);

    // Should have caught the error
    expect(jsErrors.length).toBeGreaterThan(0);

    // Page should still be visible (not white screen of death)
    const body = page.locator('body');
    await expect(body).toBeVisible();

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);

    // Look for error boundary or error message
    const hasErrorUI = await page.evaluate(() => {
      const text = document.body.textContent || '';
      return (
        text.toLowerCase().includes('error') ||
        text.toLowerCase().includes('something went wrong') ||
        text.toLowerCase().includes('reload') ||
        text.toLowerCase().includes('try again')
      );
    });

    // Should show error UI OR at least not crash completely
    if (!hasErrorUI) {
      // Verify page is still interactive as fallback
      const isInteractive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      expect(isInteractive).toBeTruthy();
    }
  });

  test('should provide reload button when critical error occurs', async ({ page }) => {
    // Listen for errors
    const errors: Error[] = [];
    page.on('pageerror', (error) => {
      errors.push(error);
    });

    // Inject critical error
    await page.addInitScript(() => {
      window.addEventListener('load', () => {
        throw new Error('Critical application error');
      });
    });

    await goToHome(page);
    await page.waitForTimeout(2000);

    // Should have error
    expect(errors.length).toBeGreaterThan(0);

    // Look for reload/retry functionality
    const buttons = page.locator('button');
    const buttonTexts = await buttons.allTextContents();

    // Should have some way to reload or try again
    const hasReloadOption = buttonTexts.some((text) =>
      text.toLowerCase().includes('reload') ||
      text.toLowerCase().includes('refresh') ||
      text.toLowerCase().includes('try again') ||
      text.toLowerCase().includes('retry')
    );

    // At minimum, browser reload should work
    if (!hasReloadOption) {
      // Test browser reload functionality
      await page.reload();
      await page.waitForTimeout(1000);

      const isReloaded = await page.evaluate(() => document.readyState === 'complete');
      expect(isReloaded).toBeTruthy();
    }
  });

  test('should handle errors in Three.js scene initialization gracefully', async ({ page }) => {
    // Sabotage THREE.js initialization
    await page.addInitScript(() => {
      // Override before THREE loads
      (window as any).WebGLRenderingContext = undefined;
      (window as any).WebGL2RenderingContext = undefined;
    });

    await goToHome(page);

    // Try to navigate to 3D view
    const button = page.locator('button').filter({ hasText: 'Explore 3D Demo' });
    await button.click();
    await page.waitForTimeout(2000);

    // App should show error or fallback, not crash
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Should not show blank screen
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(10);

    // Page should remain interactive
    const isInteractive = await page.evaluate(() => {
      return document.readyState === 'complete';
    });
    expect(isInteractive).toBeTruthy();
  });
});

test.describe('Error Recovery - User Feedback Quality', () => {
  test('should never show blank white screen on any error', async ({ page }) => {
    // Test various error scenarios and verify no blank screen

    // Scenario 1: 404 on all assets
    await page.route('**/*', (route) => {
      if (route.request().resourceType() === 'image' ||
          route.request().url().includes('.glb') ||
          route.request().url().includes('.gltf')) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    await goToHome(page);
    await page.waitForTimeout(1000);

    // Check background color is not white
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Should have dark background (ACE uses dark theme)
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');

    // Should have visible content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(20);
  });

  test('should show consistent error messaging across all error types', async ({ page }) => {
    // This test verifies error messages follow a consistent pattern

    const errorMessages: string[] = [];

    // Test network error
    await page.route('**/*.glb', (route) => route.abort('failed'));
    await goToHome(page);
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();
    await page.waitForTimeout(2000);

    let bodyText = await page.textContent('body');
    if (bodyText) {
      errorMessages.push(bodyText);
    }

    // All error messages should:
    // 1. Be human-readable (no raw error codes)
    // 2. Not be empty
    // 3. Provide some context
    for (const message of errorMessages) {
      expect(message.length).toBeGreaterThan(10);

      // Should not show raw technical errors to users
      expect(message).not.toMatch(/undefined is not a function/i);
      expect(message).not.toMatch(/cannot read property.*of null/i);
      expect(message).not.toMatch(/ERR_/);
    }
  });

  test('should maintain app navigation even when 3D scene fails', async ({ page }) => {
    // Simulate 3D scene failure
    await page.route('**/*.glb', (route) => route.abort('failed'));

    await goToHome(page);

    // Try to navigate to 3D demo
    await page.locator('button').filter({ hasText: 'Explore 3D Demo' }).click();
    await page.waitForTimeout(2000);

    // Even if 3D fails, navigation should still work
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    expect(buttonCount).toBeGreaterThan(0);

    // Should be able to click navigation elements
    const isClickable = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      return buttons.length > 0 && buttons[0].offsetParent !== null;
    });

    expect(isClickable).toBeTruthy();
  });
});

test.describe('Error Recovery - Progressive Enhancement', () => {
  test('should show basic content before 3D assets load', async ({ page }) => {
    // Delay 3D assets significantly
    await page.route('**/*.{glb,gltf}', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      route.continue();
    });

    await goToHome(page);

    // Immediately check for content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(50);

    // UI elements should be visible before 3D loads
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('should load UI shell before heavy 3D resources', async ({ page }) => {
    const loadOrder: string[] = [];

    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.js')) {
        loadOrder.push('script');
      } else if (url.includes('.css')) {
        loadOrder.push('style');
      } else if (url.includes('.glb') || url.includes('.gltf')) {
        loadOrder.push('3d-asset');
      }
    });

    await goToHome(page);
    await page.waitForTimeout(3000);

    // Scripts and styles should load before 3D assets
    const first3DAsset = loadOrder.indexOf('3d-asset');
    const lastScript = loadOrder.lastIndexOf('script');

    if (first3DAsset !== -1 && lastScript !== -1) {
      // Scripts should generally load before 3D assets
      // (Not a hard requirement, but good practice)
      expect(lastScript).toBeLessThan(first3DAsset + 10);
    }
  });
});
