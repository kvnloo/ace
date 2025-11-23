import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';

/**
 * Complete User Journey E2E Tests
 *
 * Tests the full user experience from homepage load through 3D interaction,
 * including performance monitoring, error handling, and graceful degradation.
 */

test.describe('Complete User Journey Tests', () => {
  let consoleErrors: ConsoleMessage[] = [];
  let consoleWarnings: ConsoleMessage[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset error tracking
    consoleErrors = [];
    consoleWarnings = [];

    // Monitor console messages
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg);
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg);
      }
    });

    // Monitor page errors
    page.on('pageerror', (error) => {
      consoleErrors.push({
        type: () => 'error',
        text: () => error.message,
      } as ConsoleMessage);
    });
  });

  test.afterEach(async () => {
    // Report console errors if any
    if (consoleErrors.length > 0) {
      console.log('Console Errors Detected:');
      consoleErrors.forEach((msg, idx) => {
        console.log(`  ${idx + 1}. ${msg.text()}`);
      });
    }
  });

  /**
   * TEST 1: Happy Path - Complete Loading and Interaction
   */
  test('should complete happy path: load → 3D court → interaction', async ({ page }) => {
    // Step 1: Navigate to homepage
    await page.goto('/');
    await page.screenshot({ path: 'tests/screenshots/01-homepage-load.png' });

    // Step 2: Verify loading screen appears
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible({ timeout: 2000 });
    await page.screenshot({ path: 'tests/screenshots/02-loading-screen.png' });

    // Step 3: Verify FPS meter is visible
    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    await expect(fpsMeter).toBeVisible();

    // Step 4: Track FPS during loading
    const fpsReadings: number[] = [];
    for (let i = 0; i < 5; i++) {
      const fpsText = await fpsMeter.textContent();
      const fps = parseInt(fpsText?.match(/\d+/)?.[0] || '0');
      fpsReadings.push(fps);
      await page.waitForTimeout(200);
    }

    console.log('FPS readings during loading:', fpsReadings);
    expect(fpsReadings.some(fps => fps > 0)).toBe(true);

    // Step 5: Wait for progressive loading stages
    const loadingProgress = page.locator('[data-testid="loading-progress"]');
    await expect(loadingProgress).toContainText('Essential', { timeout: 5000 });
    await page.screenshot({ path: 'tests/screenshots/03-loading-essential.png' });

    await expect(loadingProgress).toContainText('Enhanced', { timeout: 10000 });
    await page.screenshot({ path: 'tests/screenshots/04-loading-enhanced.png' });

    // Step 6: Wait for loading to complete
    await expect(loadingScreen).toBeHidden({ timeout: 20000 });
    await page.screenshot({ path: 'tests/screenshots/05-loading-complete.png' });

    // Step 7: Verify 3D court is visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await page.waitForTimeout(1000); // Let scene render

    // Step 8: Verify no console errors during loading
    expect(consoleErrors.length).toBe(0);

    // Step 9: Test camera controls interaction
    const canvasBox = await canvas.boundingBox();
    if (canvasBox) {
      // Click to focus
      await page.mouse.click(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);

      // Drag to rotate camera
      await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 300, canvasBox.y + 200);
      await page.mouse.up();

      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/06-camera-interaction.png' });
    }

    // Step 10: Verify scene is still responsive
    const finalFps = await fpsMeter.textContent();
    const finalFpsValue = parseInt(finalFps?.match(/\d+/)?.[0] || '0');
    expect(finalFpsValue).toBeGreaterThan(20);

    // Step 11: Final validation - no errors throughout journey
    expect(consoleErrors.length).toBe(0);
  });

  /**
   * TEST 2: Performance Degradation with Quality Recommendation
   */
  test('should handle performance degradation with quality recommendation', async ({ page }) => {
    await page.goto('/');

    // Wait for loading screen
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Simulate FPS drop by throttling CPU
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 6 }); // 6x slowdown

    await page.waitForTimeout(2000); // Let FPS drop

    // Check for quality recommendation
    const qualityRecommendation = page.locator('[data-testid="quality-recommendation"]');
    const recommendationVisible = await qualityRecommendation.isVisible().catch(() => false);

    if (recommendationVisible) {
      await page.screenshot({ path: 'tests/screenshots/07-quality-recommendation.png' });

      // Apply recommendation
      const applyButton = qualityRecommendation.locator('button:has-text("Apply")');
      await applyButton.click();
      await page.screenshot({ path: 'tests/screenshots/08-quality-applied.png' });

      // Verify components disabled
      const performanceIndicator = page.locator('[data-testid="performance-mode"]');
      await expect(performanceIndicator).toContainText(/reduced|performance/i);
    }

    // Restore normal CPU
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });

    // Verify FPS recovers
    await page.waitForTimeout(1000);
    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    const fps = await fpsMeter.textContent();
    const fpsValue = parseInt(fps?.match(/\d+/)?.[0] || '0');
    expect(fpsValue).toBeGreaterThan(15);

    // Verify 3D still functional
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await client.detach();
  });

  /**
   * TEST 3: Critical Failure with Automatic Fallback
   */
  test('should handle critical failure with automatic fallback', async ({ page }) => {
    await page.goto('/');

    // Wait for loading to start
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Simulate severe performance drop
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setCPUThrottlingRate', { rate: 20 }); // Extreme slowdown

    // Wait for potential fallback trigger
    await page.waitForTimeout(5000);

    // Check for fallback activation
    const fallbackIndicator = page.locator('[data-testid="fallback-mode"]');
    const buildingOnlyMode = page.locator('[data-testid="building-only-mode"]');

    const isFallback = await fallbackIndicator.isVisible().catch(() => false);
    const isBuildingOnly = await buildingOnlyMode.isVisible().catch(() => false);

    if (isFallback || isBuildingOnly) {
      await page.screenshot({ path: 'tests/screenshots/09-fallback-mode.png' });

      // Verify meaningful error message exists
      const errorMessage = page.locator('[data-testid="error-message"]');
      await expect(errorMessage).toBeVisible();
      const errorText = await errorMessage.textContent();
      expect(errorText).toBeTruthy();
      expect(errorText!.length).toBeGreaterThan(20); // Meaningful message

      // Verify building mesh still visible
      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();

      // Verify NO blank screen
      const body = await page.locator('body').screenshot();
      expect(body.length).toBeGreaterThan(1000); // Not blank
    }

    // Cleanup
    await client.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await client.detach();
  });

  /**
   * TEST 4: Loading Progress Stages
   */
  test('should show all loading progress stages', async ({ page }) => {
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    const loadingProgress = page.locator('[data-testid="loading-progress"]');

    // Track all stages
    const stages: string[] = [];
    const stageCheckInterval = setInterval(async () => {
      const text = await loadingProgress.textContent().catch(() => '');
      if (text && !stages.includes(text)) {
        stages.push(text);
      }
    }, 100);

    // Wait for loading to complete
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });
    clearInterval(stageCheckInterval);

    console.log('Loading stages observed:', stages);

    // Verify essential stages were shown
    expect(stages.some(s => s.toLowerCase().includes('essential'))).toBe(true);
    expect(stages.some(s => s.toLowerCase().includes('enhanced'))).toBe(true);
  });

  /**
   * TEST 5: FPS Monitoring Accuracy
   */
  test('should accurately track FPS throughout journey', async ({ page }) => {
    await page.goto('/');

    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    await expect(fpsMeter).toBeVisible({ timeout: 5000 });

    // Collect FPS readings over time
    const fpsHistory: Array<{ time: number; fps: number }> = [];
    const startTime = Date.now();

    for (let i = 0; i < 20; i++) {
      const fpsText = await fpsMeter.textContent();
      const fps = parseInt(fpsText?.match(/\d+/)?.[0] || '0');
      fpsHistory.push({
        time: Date.now() - startTime,
        fps,
      });
      await page.waitForTimeout(500);
    }

    console.log('FPS History:', fpsHistory);

    // Validate FPS readings
    expect(fpsHistory.length).toBe(20);
    expect(fpsHistory.every(reading => reading.fps >= 0)).toBe(true);
    expect(fpsHistory.some(reading => reading.fps > 0)).toBe(true);

    // Calculate average FPS
    const avgFps = fpsHistory.reduce((sum, r) => sum + r.fps, 0) / fpsHistory.length;
    console.log('Average FPS:', avgFps);
    expect(avgFps).toBeGreaterThan(10);
  });

  /**
   * TEST 6: Component Visibility During Loading
   */
  test('should show correct components at each loading stage', async ({ page }) => {
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Essential stage
    await page.waitForTimeout(2000);
    const essentialComponents = page.locator('[data-component="essential"]');
    const essentialCount = await essentialComponents.count();
    expect(essentialCount).toBeGreaterThan(0);
    await page.screenshot({ path: 'tests/screenshots/10-essential-components.png' });

    // Enhanced stage
    await page.waitForTimeout(3000);
    const enhancedComponents = page.locator('[data-component="enhanced"]');
    const enhancedCount = await enhancedComponents.count();
    // Enhanced components may or may not be visible depending on performance
    console.log('Enhanced components count:', enhancedCount);

    // Verify loading completes
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });
  });

  /**
   * TEST 7: Error Recovery
   */
  test('should recover from temporary errors', async ({ page }) => {
    await page.goto('/');

    // Inject temporary network failure
    await page.route('**/*', (route) => {
      if (Math.random() < 0.1) { // 10% failure rate
        route.abort('failed');
      } else {
        route.continue();
      }
    });

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Should eventually load despite errors
    await expect(loadingScreen).toBeHidden({ timeout: 60000 });

    // Verify 3D court loads
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Some errors are expected due to injected failures
    console.log('Error count (expected due to test):', consoleErrors.length);
  });

  /**
   * TEST 8: Mobile Viewport Journey
   */
  test('should complete journey on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/11-mobile-loading.png' });

    // Verify FPS meter visible on mobile
    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    await expect(fpsMeter).toBeVisible();

    // Wait for loading
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });
    await page.screenshot({ path: 'tests/screenshots/12-mobile-complete.png' });

    // Verify 3D canvas adapts to mobile
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    const canvasBox = await canvas.boundingBox();
    expect(canvasBox?.width).toBeLessThanOrEqual(375);
    expect(canvasBox?.height).toBeLessThanOrEqual(667);

    // Test touch interaction
    if (canvasBox) {
      await page.touchscreen.tap(canvasBox.x + 100, canvasBox.y + 100);
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/screenshots/13-mobile-interaction.png' });
    }

    // Verify no errors on mobile
    expect(consoleErrors.length).toBe(0);
  });

  /**
   * TEST 9: Progressive Enhancement Validation
   */
  test('should progressively enhance from minimal to full', async ({ page }) => {
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Track component additions
    const componentStates: Array<{ stage: string; count: number }> = [];

    // Essential stage
    await page.waitForTimeout(2000);
    const essentialCount = await page.locator('[data-loaded="true"]').count();
    componentStates.push({ stage: 'essential', count: essentialCount });

    // Mid-loading
    await page.waitForTimeout(3000);
    const midCount = await page.locator('[data-loaded="true"]').count();
    componentStates.push({ stage: 'mid', count: midCount });

    // Complete loading
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });
    const finalCount = await page.locator('[data-loaded="true"]').count();
    componentStates.push({ stage: 'complete', count: finalCount });

    console.log('Component progression:', componentStates);

    // Verify progressive increase
    expect(componentStates[0].count).toBeGreaterThan(0);
    expect(componentStates[2].count).toBeGreaterThanOrEqual(componentStates[0].count);
  });

  /**
   * TEST 10: Memory Leak Detection
   */
  test('should not leak memory during journey', async ({ page }) => {
    await page.goto('/');

    // Get initial memory
    const initialMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    // Complete loading journey
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });

    // Interact with scene
    const canvas = page.locator('canvas');
    const canvasBox = await canvas.boundingBox();
    if (canvasBox) {
      for (let i = 0; i < 5; i++) {
        await page.mouse.move(canvasBox.x + i * 50, canvasBox.y + i * 50);
        await page.waitForTimeout(200);
      }
    }

    // Force garbage collection if available
    await page.evaluate(() => {
      if (window.gc) {
        window.gc();
      }
    });

    await page.waitForTimeout(2000);

    // Get final memory
    const finalMetrics = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
        };
      }
      return null;
    });

    if (initialMetrics && finalMetrics) {
      const memoryIncrease = finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize;
      const percentIncrease = (memoryIncrease / initialMetrics.usedJSHeapSize) * 100;

      console.log('Memory metrics:', {
        initial: initialMetrics.usedJSHeapSize,
        final: finalMetrics.usedJSHeapSize,
        increase: memoryIncrease,
        percentIncrease: `${percentIncrease.toFixed(2)}%`,
      });

      // Verify memory increase is reasonable (< 100% increase)
      expect(percentIncrease).toBeLessThan(100);
    }
  });
});

test.describe('Performance Assertions', () => {
  test('should maintain minimum FPS threshold', async ({ page }) => {
    await page.goto('/');

    const fpsMeter = page.locator('[data-testid="fps-meter"]');
    await expect(fpsMeter).toBeVisible({ timeout: 5000 });

    // Sample FPS for 10 seconds
    const fpsReadings: number[] = [];
    for (let i = 0; i < 20; i++) {
      const fpsText = await fpsMeter.textContent();
      const fps = parseInt(fpsText?.match(/\d+/)?.[0] || '0');
      fpsReadings.push(fps);
      await page.waitForTimeout(500);
    }

    const avgFps = fpsReadings.reduce((sum, fps) => sum + fps, 0) / fpsReadings.length;
    const minFps = Math.min(...fpsReadings);

    console.log('FPS Performance:', {
      average: avgFps.toFixed(2),
      minimum: minFps,
      maximum: Math.max(...fpsReadings),
    });

    // Performance assertions
    expect(avgFps).toBeGreaterThan(20); // Average should be > 20 FPS
    expect(minFps).toBeGreaterThan(10); // Minimum should be > 10 FPS
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');

    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });

    const loadTime = Date.now() - startTime;
    console.log('Total load time:', loadTime, 'ms');

    // Should load within 30 seconds
    expect(loadTime).toBeLessThan(30000);
  });
});
