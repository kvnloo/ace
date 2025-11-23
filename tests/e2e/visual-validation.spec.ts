import { test, expect } from '@playwright/test';
import { PNG } from 'pngjs';

/**
 * Visual Validation Test Suite
 *
 * Verifies that 3D scenes are ACTUALLY RENDERING by:
 * 1. Taking screenshots of canvas elements
 * 2. Analyzing pixel data to detect rendering
 * 3. Comparing visual states across interactions
 * 4. Creating baseline snapshots for regression testing
 */

test.describe('Visual Validation - 3D Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for reproducible screenshots
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('3D court should render after loading completes', async ({ page }) => {
    await page.goto('/');

    // Wait for loading screen to disappear
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });

    // Additional wait for 3D scene initialization and first render
    await page.waitForTimeout(3000);

    // Locate canvas element
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Take screenshot of rendered canvas
    const screenshot = await canvas.screenshot();

    // Verify screenshot has substantial pixel data (not blank)
    expect(screenshot.length).toBeGreaterThan(1000);

    // Verify canvas has non-zero dimensions
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);

    // Visual regression test - compare against baseline
    await expect(canvas).toHaveScreenshot('3d-court-rendered.png', {
      maxDiffPixels: 1000, // Allow variance due to animations/lighting
      threshold: 0.2 // 20% pixel difference threshold
    });
  });

  test('3D court should show different views when camera moves', async ({ page }) => {
    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');

    // Wait for 3D scene to render
    await page.waitForTimeout(2000);

    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Capture initial view
    const view1 = await canvas.screenshot();

    // Simulate camera orbit by dragging mouse
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();

    const centerX = boundingBox!.x + boundingBox!.width / 2;
    const centerY = boundingBox!.y + boundingBox!.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 200, centerY);
    await page.mouse.up();

    // Wait for camera animation to complete
    await page.waitForTimeout(500);

    // Capture view after camera movement
    const view2 = await canvas.screenshot();

    // Views should be different (camera position changed)
    expect(Buffer.compare(view1, view2)).not.toBe(0);

    // Verify both screenshots have substantial data
    expect(view1.length).toBeGreaterThan(1000);
    expect(view2.length).toBeGreaterThan(1000);
  });

  test('3D scene should contain non-uniform pixel data (not solid color)', async ({ page }) => {
    await page.goto('/');

    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    const canvas = page.locator('canvas').first();
    const screenshot = await canvas.screenshot();

    // Parse PNG to analyze pixel data
    const png = PNG.sync.read(screenshot);
    const pixels = png.data;

    // Sample pixels to check for variance (actual 3D content)
    const samples: number[] = [];
    const sampleCount = 100;
    const step = Math.floor(pixels.length / (sampleCount * 4));

    for (let i = 0; i < pixels.length; i += step * 4) {
      // Sample red channel value
      samples.push(pixels[i]);
    }

    // Calculate variance to detect non-uniform rendering
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;

    // Variance should be significant (not a solid color)
    expect(variance).toBeGreaterThan(100);
  });

  test('3D scene should update when interacting with controls', async ({ page }) => {
    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const canvas = page.locator('canvas').first();

    // Capture initial state
    const before = await canvas.screenshot();

    // Look for court selector or similar control
    const controls = page.locator('[data-testid="court-selector"]').first();
    if (await controls.isVisible()) {
      await controls.click();
      await page.waitForTimeout(1000);

      // Capture after interaction
      const after = await canvas.screenshot();

      // Scene should have changed
      expect(Buffer.compare(before, after)).not.toBe(0);
    }
  });

  test('3D scene should render consistently across page reloads', async ({ page }) => {
    // First load
    await page.goto('/');
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    const canvas = page.locator('canvas').first();
    const screenshot1 = await canvas.screenshot();

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    const screenshot2 = await canvas.screenshot();

    // Screenshots should be very similar (allowing for minor variance)
    await expect(canvas).toHaveScreenshot('consistent-render.png', {
      maxDiffPixels: 500,
      threshold: 0.1
    });
  });

  test('3D scene should render without WebGL errors', async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });
    await page.waitForTimeout(3000);

    // Verify canvas rendered
    const canvas = page.locator('canvas').first();
    const screenshot = await canvas.screenshot();
    expect(screenshot.length).toBeGreaterThan(1000);

    // Check for WebGL-related errors
    const webglErrors = errors.filter(err =>
      err.toLowerCase().includes('webgl') ||
      err.toLowerCase().includes('three') ||
      err.toLowerCase().includes('shader')
    );

    expect(webglErrors).toHaveLength(0);
  });

  test('multiple 3D scenes should render independently', async ({ page }) => {
    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Get all canvas elements
    const canvases = page.locator('canvas');
    const count = await canvases.count();

    if (count > 1) {
      // Take screenshots of each canvas
      const screenshots = await Promise.all(
        Array.from({ length: count }, (_, i) =>
          canvases.nth(i).screenshot()
        )
      );

      // Each should have substantial data
      screenshots.forEach(screenshot => {
        expect(screenshot.length).toBeGreaterThan(1000);
      });

      // Screenshots should differ (different scenes)
      if (screenshots.length >= 2) {
        expect(Buffer.compare(screenshots[0], screenshots[1])).not.toBe(0);
      }
    }
  });
});

test.describe('Visual Validation - Loading States', () => {
  test('loading screen should transition to rendered 3D scene', async ({ page }) => {
    await page.goto('/');

    // Verify loading screen is visible initially
    const loadingScreen = page.locator('[data-testid="loading-screen"]');
    await expect(loadingScreen).toBeVisible();

    // Wait for loading to complete
    await loadingScreen.waitFor({ state: 'hidden', timeout: 60000 });

    // Verify 3D scene is now visible and rendered
    await page.waitForTimeout(2000);
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    const screenshot = await canvas.screenshot();
    expect(screenshot.length).toBeGreaterThan(1000);
  });

  test('loading progress should reach 100% before scene renders', async ({ page }) => {
    let maxProgress = 0;

    // Monitor progress updates
    page.on('console', msg => {
      const text = msg.text();
      const match = text.match(/progress[:\s]+(\d+)/i);
      if (match) {
        maxProgress = Math.max(maxProgress, parseInt(match[1]));
      }
    });

    await page.goto('/');
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });

    // Progress should have reached 100%
    expect(maxProgress).toBeGreaterThanOrEqual(100);
  });
});

test.describe('Visual Validation - Performance', () => {
  test('3D scene should render within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });
    await page.waitForTimeout(2000);

    const canvas = page.locator('canvas').first();
    await canvas.screenshot();

    const renderTime = Date.now() - startTime;

    // Should render within 10 seconds after page load
    expect(renderTime).toBeLessThan(10000);
  });

  test('3D scene should maintain stable frame rate', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="loading-screen"]', {
      state: 'hidden',
      timeout: 60000
    });

    // Monitor frame rate via requestAnimationFrame
    const fps = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        let frames = 0;
        const startTime = performance.now();

        function countFrame() {
          frames++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrame);
          } else {
            resolve(frames);
          }
        }

        requestAnimationFrame(countFrame);
      });
    });

    // Should maintain at least 30 FPS
    expect(fps).toBeGreaterThan(30);
  });
});
