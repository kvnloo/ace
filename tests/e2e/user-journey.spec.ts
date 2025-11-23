import { test, expect, Page } from '@playwright/test';

/**
 * User Journey Test Suite
 *
 * Tests the complete user flow from landing on homepage through
 * loading sequence to interacting with the 3D basketball court.
 *
 * Test Coverage:
 * - Initial page load
 * - Loading screen visibility and progression
 * - Console error detection
 * - 3D canvas rendering
 * - User interactions (click, hover)
 * - Performance metrics
 */

test.describe('Complete User Journey - Homepage to 3D Court', () => {
  let consoleErrors: string[] = [];
  let consoleWarnings: string[] = [];
  let networkErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset error collectors
    consoleErrors = [];
    consoleWarnings = [];
    networkErrors = [];

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // Capture network failures
    page.on('requestfailed', request => {
      networkErrors.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    // Capture page errors
    page.on('pageerror', error => {
      consoleErrors.push(`Page Error: ${error.message}`);
    });
  });

  test('Complete user journey - homepage to 3D court', async ({ page }) => {
    // Step 1: Load homepage
    console.log('Step 1: Loading homepage...');
    await page.goto('/');

    // Verify page loaded
    await expect(page).toHaveTitle(/ACE/i);

    // Step 2: Loading screen appears immediately
    console.log('Step 2: Verifying loading screen appears...');
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // Verify loading phases exist
    const loadingPhases = [
      page.locator('text=/Initializing.*system/i'),
      page.locator('text=/Loading.*assets/i'),
      page.locator('text=/Preparing.*experience/i')
    ];

    // At least one phase should be visible
    const visiblePhases = await Promise.all(
      loadingPhases.map(phase => phase.isVisible().catch(() => false))
    );
    expect(visiblePhases.some(v => v)).toBeTruthy();

    // Step 3: Monitor for console errors during loading
    console.log('Step 3: Monitoring console during loading...');

    // Step 4: Wait for loading to complete
    console.log('Step 4: Waiting for loading completion...');
    await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

    // Step 5: Verify 3D court canvas is visible
    console.log('Step 5: Verifying 3D court rendered...');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify canvas has reasonable dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox!.width).toBeGreaterThan(100);
    expect(canvasBox!.height).toBeGreaterThan(100);

    // Step 6: Verify NO critical console errors occurred
    console.log('Step 6: Checking for console errors...');

    // Filter out non-critical warnings
    const criticalErrors = consoleErrors.filter(error => {
      // Ignore known non-critical errors
      const ignoredPatterns = [
        /Download the React DevTools/i,
        /Failed to load resource.*favicon/i,
        /Chrome extensions/i
      ];
      return !ignoredPatterns.some(pattern => pattern.test(error));
    });

    if (criticalErrors.length > 0) {
      console.error('Critical console errors found:', criticalErrors);
    }
    expect(criticalErrors).toHaveLength(0);

    // Step 7: Test basic interactions
    console.log('Step 7: Testing user interactions...');

    // Click on canvas (user trying to interact)
    await canvas.click({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500); // Allow interaction to process

    // Hover over different area (orbit camera preview)
    await canvas.hover({ position: { x: 200, y: 200 } });
    await page.waitForTimeout(500);

    // Drag gesture (simulate orbit camera control)
    await canvas.hover({ position: { x: 150, y: 150 } });
    await page.mouse.down();
    await page.mouse.move(250, 250);
    await page.mouse.up();
    await page.waitForTimeout(500);

    // Step 8: Verify canvas still rendering after interactions
    console.log('Step 8: Verifying canvas stability...');
    await expect(canvas).toBeVisible();

    // Step 9: Check for errors after interactions
    console.log('Step 9: Final error check...');
    const postInteractionErrors = consoleErrors.filter(error => {
      const ignoredPatterns = [
        /Download the React DevTools/i,
        /Failed to load resource.*favicon/i,
        /Chrome extensions/i
      ];
      return !ignoredPatterns.some(pattern => pattern.test(error));
    });

    expect(postInteractionErrors).toHaveLength(0);

    // Step 10: Take screenshot of final state
    console.log('Step 10: Capturing final state...');
    await page.screenshot({
      path: '/home/kvn/workspace/evolve/repos/ace/docs/user-journey-success.png',
      fullPage: true
    });

    // Report summary
    console.log('✅ User journey completed successfully');
    console.log(`Total warnings: ${consoleWarnings.length}`);
    console.log(`Network errors: ${networkErrors.length}`);
  });

  test('Loading screen phases progression', async ({ page }) => {
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Track which phases we see
    const phasesObserved: string[] = [];

    // Check for phase indicators
    const checkPhase = async (phaseText: RegExp) => {
      const phase = page.locator(`text=${phaseText}`);
      const isVisible = await phase.isVisible().catch(() => false);
      if (isVisible) {
        phasesObserved.push(phaseText.source);
      }
    };

    // Sample phases during loading
    for (let i = 0; i < 10; i++) {
      await checkPhase(/Initializing/i);
      await checkPhase(/Loading/i);
      await checkPhase(/Preparing/i);
      await page.waitForTimeout(500);
    }

    // Should have observed at least one phase
    expect(phasesObserved.length).toBeGreaterThan(0);

    console.log('Phases observed:', phasesObserved);
  });

  test('Performance metrics - loading time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const endTime = Date.now();
    const totalLoadTime = endTime - startTime;

    console.log(`Total load time: ${totalLoadTime}ms`);

    // Should complete within reasonable time (60 seconds)
    expect(totalLoadTime).toBeLessThan(60000);

    // Ideally within 30 seconds for good UX
    if (totalLoadTime > 30000) {
      console.warn(`⚠️ Loading took ${totalLoadTime}ms (>30s)`);
    }
  });

  test('3D canvas rendering validation', async ({ page }) => {
    await page.goto('/');

    // Wait for loading complete
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check canvas is WebGL-enabled
    const isWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;

      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      return gl !== null;
    });

    expect(isWebGL).toBe(true);

    // Verify canvas dimensions are responsive
    const initialBox = await canvas.boundingBox();
    expect(initialBox).not.toBeNull();

    // Resize viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(1000);

    const resizedBox = await canvas.boundingBox();
    expect(resizedBox).not.toBeNull();

    // Canvas should have adjusted
    expect(resizedBox!.width).toBeGreaterThan(100);
    expect(resizedBox!.height).toBeGreaterThan(100);
  });

  test('User interactions - camera controls', async ({ page }) => {
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Test multiple interaction patterns
    const interactions = [
      // Click and hold (orbit)
      async () => {
        await canvas.hover({ position: { x: 200, y: 200 } });
        await page.mouse.down();
        await page.mouse.move(300, 300);
        await page.mouse.up();
      },
      // Zoom gesture (scroll)
      async () => {
        await canvas.hover({ position: { x: 400, y: 300 } });
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(300);
      },
      // Pan gesture
      async () => {
        await canvas.hover({ position: { x: 250, y: 250 } });
        await page.mouse.down({ button: 'middle' });
        await page.mouse.move(350, 350);
        await page.mouse.up({ button: 'middle' });
      }
    ];

    for (const interaction of interactions) {
      await interaction();
      await page.waitForTimeout(500);

      // Verify canvas still stable after each interaction
      await expect(canvas).toBeVisible();
    }

    // No errors should occur from interactions
    const interactionErrors = consoleErrors.filter(error => {
      const ignoredPatterns = [
        /Download the React DevTools/i,
        /Failed to load resource.*favicon/i
      ];
      return !ignoredPatterns.some(pattern => pattern.test(error));
    });

    expect(interactionErrors).toHaveLength(0);
  });

  test('Mobile viewport user journey', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify mobile-friendly dimensions
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox!.width).toBeLessThanOrEqual(375);
    expect(canvasBox!.height).toBeGreaterThan(0);

    // Test touch interactions
    await canvas.tap({ position: { x: 100, y: 100 } });
    await page.waitForTimeout(500);

    await expect(canvas).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Log test results
    if (testInfo.status !== 'passed') {
      console.error('Test failed:', testInfo.title);
      console.error('Console errors:', consoleErrors);
      console.error('Network errors:', networkErrors);

      // Take failure screenshot
      await page.screenshot({
        path: `/home/kvn/workspace/evolve/repos/ace/docs/test-failure-${testInfo.title.replace(/\s+/g, '-')}.png`,
        fullPage: true
      });
    }
  });
});

/**
 * Additional Test Utilities
 */

test.describe('Error Boundary Testing', () => {
  test('Graceful error handling', async ({ page }) => {
    // Test that app doesn't crash on errors
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Simulate potential error scenarios
    await page.evaluate(() => {
      // Try to trigger errors
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('orientationchange'));
    });

    await page.waitForTimeout(1000);

    // App should still be functional
    await expect(canvas).toBeVisible();
  });
});
