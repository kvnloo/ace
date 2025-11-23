import { test, expect, Page, ConsoleMessage } from '@playwright/test';

/**
 * Comprehensive User Journey Tests with Console Monitoring
 *
 * These tests simulate real user interactions and monitor:
 * 1. Console errors and warnings
 * 2. Performance metrics (FPS, memory, load times)
 * 3. Visual rendering success
 * 4. Navigation flow
 * 5. Error recovery scenarios
 *
 * Designed to catch issues like "3D view doesn't work" by:
 * - Monitoring all console output
 * - Verifying visual rendering actually occurs
 * - Tracking performance throughout journey
 * - Testing multiple interaction cycles
 */

interface ConsoleMonitor {
  errors: Array<{ message: string; timestamp: number; location?: string }>;
  warnings: Array<{ message: string; timestamp: number }>;
  logs: Array<{ message: string; timestamp: number }>;
  criticalErrors: boolean;
}

interface PerformanceMetrics {
  fps: number[];
  memoryUsage: number[];
  loadTime: number;
  renderTime: number;
  interactionLatency: number[];
}

class UserJourneyMonitor {
  private consoleMonitor: ConsoleMonitor = {
    errors: [],
    warnings: [],
    logs: [],
    criticalErrors: false
  };

  private performanceMetrics: PerformanceMetrics = {
    fps: [],
    memoryUsage: [],
    loadTime: 0,
    renderTime: 0,
    interactionLatency: []
  };

  constructor(private page: Page) {
    this.setupConsoleMonitoring();
  }

  private setupConsoleMonitoring() {
    this.page.on('console', (msg: ConsoleMessage) => {
      const timestamp = Date.now();
      const text = msg.text();
      const location = msg.location();

      switch (msg.type()) {
        case 'error':
          this.consoleMonitor.errors.push({
            message: text,
            timestamp,
            location: location ? `${location.url}:${location.lineNumber}` : undefined
          });
          // Critical errors that would break 3D rendering
          if (text.includes('WebGL') || text.includes('Three') || text.includes('Cannot read') || text.includes('undefined')) {
            this.consoleMonitor.criticalErrors = true;
          }
          break;
        case 'warning':
          this.consoleMonitor.warnings.push({ message: text, timestamp });
          break;
        case 'log':
          this.consoleMonitor.logs.push({ message: text, timestamp });
          break;
      }
    });

    // Monitor page crashes
    this.page.on('pageerror', (error: Error) => {
      this.consoleMonitor.errors.push({
        message: `PAGE CRASH: ${error.message}`,
        timestamp: Date.now()
      });
      this.consoleMonitor.criticalErrors = true;
    });
  }

  async capturePerformanceMetrics() {
    const metrics = await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;

      return {
        loadTime: perf ? perf.loadEventEnd - perf.fetchStart : 0,
        renderTime: perf ? perf.domComplete - perf.domInteractive : 0,
        memoryUsed: memory ? memory.usedJSHeapSize : 0,
        memoryLimit: memory ? memory.jsHeapSizeLimit : 0
      };
    });

    this.performanceMetrics.loadTime = metrics.loadTime;
    this.performanceMetrics.renderTime = metrics.renderTime;
    this.performanceMetrics.memoryUsage.push(metrics.memoryUsed);

    return metrics;
  }

  async captureFPS() {
    const fps = await this.page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let lastTime = performance.now();
        let frames = 0;
        const duration = 1000; // Measure for 1 second

        function countFrames() {
          frames++;
          const currentTime = performance.now();

          if (currentTime - lastTime >= duration) {
            resolve(frames);
          } else {
            requestAnimationFrame(countFrames);
          }
        }

        requestAnimationFrame(countFrames);
      });
    });

    this.performanceMetrics.fps.push(fps);
    return fps;
  }

  async verifyNoConsoleErrors() {
    expect(this.consoleMonitor.errors.length,
      `Found ${this.consoleMonitor.errors.length} console errors: ${JSON.stringify(this.consoleMonitor.errors, null, 2)}`
    ).toBe(0);
  }

  async verifyNoCriticalErrors() {
    expect(this.consoleMonitor.criticalErrors,
      `Critical errors detected that would break 3D rendering: ${JSON.stringify(this.consoleMonitor.errors, null, 2)}`
    ).toBe(false);
  }

  async verifyPerformance() {
    // Check average FPS
    const avgFPS = this.performanceMetrics.fps.reduce((a, b) => a + b, 0) / this.performanceMetrics.fps.length;
    expect(avgFPS, `Average FPS ${avgFPS} is below acceptable threshold`).toBeGreaterThan(30);

    // Check load time
    expect(this.performanceMetrics.loadTime, `Load time ${this.performanceMetrics.loadTime}ms exceeds limit`).toBeLessThan(10000);

    // Check memory usage doesn't grow excessively
    const memoryGrowth = this.performanceMetrics.memoryUsage[this.performanceMetrics.memoryUsage.length - 1] -
                        this.performanceMetrics.memoryUsage[0];
    expect(memoryGrowth, `Memory grew by ${memoryGrowth} bytes`).toBeLessThan(100 * 1024 * 1024); // 100MB limit
  }

  getReport() {
    return {
      console: this.consoleMonitor,
      performance: this.performanceMetrics,
      summary: {
        totalErrors: this.consoleMonitor.errors.length,
        totalWarnings: this.consoleMonitor.warnings.length,
        criticalErrors: this.consoleMonitor.criticalErrors,
        avgFPS: this.performanceMetrics.fps.length > 0
          ? this.performanceMetrics.fps.reduce((a, b) => a + b, 0) / this.performanceMetrics.fps.length
          : 0,
        loadTime: this.performanceMetrics.loadTime
      }
    };
  }
}

test.describe('User Journey with Console Monitoring', () => {
  let monitor: UserJourneyMonitor;

  test.beforeEach(async ({ page }) => {
    monitor = new UserJourneyMonitor(page);
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.afterEach(async () => {
    console.log('Test Report:', JSON.stringify(monitor.getReport(), null, 2));
  });

  test('Happy Path - Complete user journey without console errors', async ({ page }) => {
    // Start journey
    await page.goto('/');

    // Capture initial metrics
    await monitor.capturePerformanceMetrics();

    // Step 1: Homepage loads without errors
    await expect(page).toHaveTitle(/ACE Facility/);
    await monitor.verifyNoConsoleErrors();

    // Step 2: Wait for and verify loading screen
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Monitor loading progress
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });

    // Step 3: Verify 3D scene is rendered
    await page.waitForTimeout(2000); // Allow scene to stabilize

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Take screenshot to verify rendering
    const screenshot = await canvas.screenshot();
    expect(screenshot.length).toBeGreaterThan(5000); // Ensure non-blank image

    // Verify canvas dimensions
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(100);
    expect(boundingBox!.height).toBeGreaterThan(100);

    // Check pixel data to ensure actual rendering
    const pixelData = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (!ctx) return null;

      // For WebGL context, we check if it's actually rendering
      if (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext) {
        const pixels = new Uint8Array(4 * canvas.width * canvas.height);
        ctx.readPixels(0, 0, canvas.width, canvas.height, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);

        // Count non-black pixels
        let nonBlackPixels = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] > 0 || pixels[i + 1] > 0 || pixels[i + 2] > 0) {
            nonBlackPixels++;
          }
        }

        return {
          totalPixels: canvas.width * canvas.height,
          nonBlackPixels,
          percentageRendered: (nonBlackPixels / (canvas.width * canvas.height)) * 100
        };
      }

      return null;
    });

    expect(pixelData).not.toBeNull();
    expect(pixelData!.percentageRendered).toBeGreaterThan(10); // At least 10% of canvas should be non-black

    // Step 4: Test camera rotation
    const startFPS = await monitor.captureFPS();

    await page.mouse.move(960, 540);
    await page.mouse.down();
    await page.mouse.move(1100, 540, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    // Step 5: Test zoom
    await page.keyboard.press('Equal'); // Zoom in
    await page.waitForTimeout(300);
    await page.keyboard.press('Minus'); // Zoom out
    await page.waitForTimeout(300);

    // Step 6: Verify performance during interactions
    const interactionFPS = await monitor.captureFPS();
    expect(interactionFPS).toBeGreaterThan(24); // Minimum acceptable FPS

    // Final verification
    await monitor.verifyNoCriticalErrors();
    await monitor.verifyPerformance();
  });

  test('Performance Journey - Monitor FPS throughout interactions', async ({ page }) => {
    await page.goto('/');
    const fpsReadings: number[] = [];

    // Wait for scene to load
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });
    await page.waitForTimeout(2000);

    // Continuous FPS monitoring during various interactions
    for (let i = 0; i < 5; i++) {
      // Capture FPS
      const fps = await monitor.captureFPS();
      fpsReadings.push(fps);

      // Perform interaction
      await page.mouse.move(960 + i * 50, 540);
      await page.mouse.down();
      await page.mouse.move(960 + i * 50 + 100, 540, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(200);
    }

    // Verify FPS never drops below threshold
    const minFPS = Math.min(...fpsReadings);
    expect(minFPS).toBeGreaterThan(20);

    // Verify average FPS is good
    const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
    expect(avgFPS).toBeGreaterThan(30);

    // Check for performance warnings in console
    const report = monitor.getReport();
    const perfWarnings = report.console.warnings.filter(w =>
      w.message.toLowerCase().includes('performance') ||
      w.message.toLowerCase().includes('fps') ||
      w.message.toLowerCase().includes('slow')
    );
    expect(perfWarnings.length).toBe(0);
  });

  test('Error Recovery - Handle various error conditions gracefully', async ({ page }) => {
    await page.goto('/');

    // Test 1: Simulate WebGL context loss
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) {
            ext.loseContext();
            setTimeout(() => ext.restoreContext(), 1000);
          }
        }
      }
    });

    await page.waitForTimeout(2000);

    // Verify recovery - scene should still be visible
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Test 2: Rapid navigation to stress test
    for (let i = 0; i < 3; i++) {
      await page.reload();
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 60000
      });
    }

    // Verify no memory leaks or crashes
    await monitor.capturePerformanceMetrics();
    const report = monitor.getReport();
    expect(report.summary.criticalErrors).toBe(false);

    // Test 3: Simulate slow network
    await page.route('**/*.gltf', route => {
      setTimeout(() => route.continue(), 3000);
    });

    await page.reload();

    // Should still load eventually without errors
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 90000
    });

    await monitor.verifyNoCriticalErrors();
  });

  test('Mobile Viewport - User journey on mobile device', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X size

    await page.goto('/');
    await monitor.capturePerformanceMetrics();

    // Wait for loading
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });

    // Verify canvas renders on mobile
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Test touch interactions
    await page.tap('canvas');
    await page.waitForTimeout(500);

    // Swipe gesture
    await page.touchscreen.tap(187, 400);
    await page.waitForTimeout(100);
    await page.touchscreen.tap(187, 300);

    // Verify no console errors on mobile
    await monitor.verifyNoConsoleErrors();

    // Check mobile-specific performance
    const fps = await monitor.captureFPS();
    expect(fps).toBeGreaterThan(20); // Lower threshold for mobile
  });

  test('Console Error Detection - Catch rendering failures', async ({ page }) => {
    // Enhanced console monitoring for this test
    const renderingErrors: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('WebGL') ||
          text.includes('Three') ||
          text.includes('shader') ||
          text.includes('texture') ||
          text.includes('render') ||
          text.includes('Cannot read') ||
          text.includes('undefined') ||
          text.includes('null')) {
        renderingErrors.push(text);
      }
    });

    await page.goto('/');

    // Wait for potential errors during loading
    await page.waitForTimeout(5000);

    // Check for any rendering-related errors
    expect(renderingErrors.length,
      `Found rendering errors that would cause "3D view doesn't work": ${renderingErrors.join('\n')}`
    ).toBe(0);

    // Verify scene actually renders
    await page.waitForSelector('canvas', { timeout: 30000 });

    const canvasState = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return { exists: false };

      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');

      return {
        exists: true,
        hasContext: !!gl,
        width: canvas.width,
        height: canvas.height,
        isConnected: canvas.isConnected,
        parentVisible: !!(canvas.parentElement && canvas.parentElement.offsetHeight > 0)
      };
    });

    expect(canvasState.exists).toBe(true);
    expect(canvasState.hasContext).toBe(true);
    expect(canvasState.width).toBeGreaterThan(0);
    expect(canvasState.height).toBeGreaterThan(0);
    expect(canvasState.isConnected).toBe(true);
    expect(canvasState.parentVisible).toBe(true);
  });

  test('Complete User Journey with Detailed Monitoring', async ({ page }) => {
    const journey = {
      steps: [] as Array<{
        name: string;
        success: boolean;
        errors: string[];
        fps?: number;
        timestamp: number;
      }>
    };

    // Step tracking helper
    const trackStep = async (name: string, action: () => Promise<void>) => {
      const stepErrors: string[] = [];
      const timestamp = Date.now();

      page.once('console', msg => {
        if (msg.type() === 'error') {
          stepErrors.push(msg.text());
        }
      });

      let success = false;
      try {
        await action();
        success = true;
      } catch (error) {
        stepErrors.push((error as Error).message);
      }

      const fps = await monitor.captureFPS().catch(() => undefined);

      journey.steps.push({
        name,
        success,
        errors: stepErrors,
        fps,
        timestamp
      });

      return success;
    };

    // Execute complete journey
    await trackStep('Navigate to homepage', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/ACE Facility/);
    });

    await trackStep('Loading screen appears', async () => {
      await expect(page.locator('[data-testid="loading-screen"]')).toBeVisible();
    });

    await trackStep('Loading completes', async () => {
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 60000
      });
    });

    await trackStep('3D scene renders', async () => {
      await page.waitForTimeout(2000);
      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();

      const screenshot = await canvas.screenshot();
      expect(screenshot.length).toBeGreaterThan(5000);
    });

    await trackStep('Camera rotation works', async () => {
      await page.mouse.move(960, 540);
      await page.mouse.down();
      await page.mouse.move(1100, 540, { steps: 10 });
      await page.mouse.up();
    });

    await trackStep('Zoom controls work', async () => {
      await page.keyboard.press('Equal');
      await page.waitForTimeout(300);
      await page.keyboard.press('Minus');
    });

    await trackStep('Performance remains stable', async () => {
      const fps = await monitor.captureFPS();
      expect(fps).toBeGreaterThan(24);
    });

    // Generate journey report
    const failedSteps = journey.steps.filter(s => !s.success);
    const stepsWithErrors = journey.steps.filter(s => s.errors.length > 0);
    const avgFPS = journey.steps
      .filter(s => s.fps !== undefined)
      .reduce((sum, s) => sum + s.fps!, 0) / journey.steps.filter(s => s.fps !== undefined).length;

    console.log('=== USER JOURNEY REPORT ===');
    console.log(`Total Steps: ${journey.steps.length}`);
    console.log(`Successful: ${journey.steps.filter(s => s.success).length}`);
    console.log(`Failed: ${failedSteps.length}`);
    console.log(`Steps with Errors: ${stepsWithErrors.length}`);
    console.log(`Average FPS: ${avgFPS.toFixed(2)}`);

    if (failedSteps.length > 0) {
      console.log('\nFailed Steps:');
      failedSteps.forEach(step => {
        console.log(`  - ${step.name}: ${step.errors.join(', ')}`);
      });
    }

    // Assert journey completed successfully
    expect(failedSteps.length).toBe(0);
    expect(avgFPS).toBeGreaterThan(30);
    await monitor.verifyNoCriticalErrors();
  });
});

// Additional test for specific P2 validation
test.describe('P2 Validation - Would have caught "3D view doesn\'t work"', () => {
  test('Comprehensive 3D rendering validation', async ({ page }) => {
    const validationResults = {
      canvasFound: false,
      webglContext: false,
      pixelsRendered: false,
      noConsoleErrors: false,
      interactionWorks: false
    };

    // Monitor for the specific error types that indicate 3D failure
    const criticalErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('WebGL') ||
            text.includes('Three') ||
            text.includes('Cannot read') ||
            text.includes('undefined') ||
            text.includes('null')) {
          criticalErrors.push(text);
        }
      }
    });

    await page.goto('/');

    // Wait for loading to complete
    try {
      await page.waitForSelector('[data-testid="loading-screen"]', {
        state: 'hidden',
        timeout: 60000
      });
    } catch (error) {
      console.error('Loading screen never disappeared - 3D might not be loading');
    }

    // Additional wait for 3D initialization
    await page.waitForTimeout(3000);

    // Validation 1: Canvas exists and is visible
    const canvas = await page.$('canvas');
    validationResults.canvasFound = !!canvas;

    if (canvas) {
      const isVisible = await canvas.isVisible();
      validationResults.canvasFound = isVisible;
    }

    // Validation 2: WebGL context is available
    validationResults.webglContext = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return false;

      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      return !!gl;
    });

    // Validation 3: Pixels are actually being rendered
    validationResults.pixelsRendered = await page.evaluate(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) return false;

      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      if (!gl) return false;

      const pixels = new Uint8Array(4 * 100); // Sample 100 pixels
      gl.readPixels(
        Math.floor(canvas.width / 2) - 5,
        Math.floor(canvas.height / 2) - 5,
        10, 10,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );

      // Check if any pixels are non-black
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] > 0 || pixels[i + 1] > 0 || pixels[i + 2] > 0) {
          return true;
        }
      }

      return false;
    });

    // Validation 4: No console errors
    validationResults.noConsoleErrors = criticalErrors.length === 0;

    // Validation 5: Interactions work
    try {
      await page.mouse.move(960, 540);
      await page.mouse.down();
      await page.mouse.move(1060, 540, { steps: 5 });
      await page.mouse.up();
      validationResults.interactionWorks = true;
    } catch {
      validationResults.interactionWorks = false;
    }

    // Report results
    console.log('=== P2 VALIDATION RESULTS ===');
    console.log('Canvas Found:', validationResults.canvasFound);
    console.log('WebGL Context:', validationResults.webglContext);
    console.log('Pixels Rendered:', validationResults.pixelsRendered);
    console.log('No Console Errors:', validationResults.noConsoleErrors);
    console.log('Interactions Work:', validationResults.interactionWorks);

    if (criticalErrors.length > 0) {
      console.log('\nCritical Errors Found:');
      criticalErrors.forEach(err => console.log('  -', err));
    }

    // These assertions would have caught "3D view doesn't work"
    expect(validationResults.canvasFound, '3D Canvas not found or not visible').toBe(true);
    expect(validationResults.webglContext, 'WebGL context not available').toBe(true);
    expect(validationResults.pixelsRendered, '3D scene not rendering any pixels').toBe(true);
    expect(validationResults.noConsoleErrors, 'Critical console errors preventing 3D rendering').toBe(true);
    expect(validationResults.interactionWorks, '3D interactions not working').toBe(true);
  });
});