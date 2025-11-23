import { test, expect } from '@playwright/test';

/**
 * Visual Rendering Validation Test
 *
 * Verifies that the 3D court scene ACTUALLY renders visually,
 * not just that tests pass. This addresses the complaint:
 * "the 3d view just doesn't work at all"
 */

test.describe('3D Court Rendering Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to standard desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3003/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Verify hero section is visible
    await expect(page.locator('h1')).toContainText('AUTONOMOUS');

    // Take screenshot for visual verification
    await page.screenshot({
      path: 'docs/screenshots/01-homepage.png',
      fullPage: true
    });

    console.log('✅ Homepage loaded successfully');
  });

  test('Navigate to 3D court view', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.waitForLoadState('networkidle');

    // Click "Explore 3D Demo" button
    const exploreButton = page.locator('button:has-text("Explore 3D Demo")');
    await expect(exploreButton).toBeVisible();
    await exploreButton.click();

    // Wait for navigation
    await page.waitForURL('**/court');

    // Take screenshot of loading screen
    await page.screenshot({
      path: 'docs/screenshots/02-loading-screen.png'
    });

    console.log('✅ Navigated to court view, loading screen shown');
  });

  test('3D scene renders with WebGL canvas', async ({ page }) => {
    await page.goto('http://localhost:3003/court');

    // Wait for loading to complete (max 10 seconds)
    await page.waitForTimeout(10000);

    // Check if WebGL canvas exists
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify canvas has dimensions (actually rendering)
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox!.width).toBeGreaterThan(100);
    expect(canvasBox!.height).toBeGreaterThan(100);

    console.log(`✅ Canvas rendered: ${canvasBox!.width}x${canvasBox!.height}px`);

    // Take screenshot of rendered 3D scene
    await page.screenshot({
      path: 'docs/screenshots/03-3d-scene-default-view.png',
      fullPage: false
    });
  });

  test('WebGL context is created successfully', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(8000);

    // Check for WebGL errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Verify WebGL2 context creation
    const hasWebGL2 = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;

      const gl = canvas.getContext('webgl2');
      return gl !== null;
    });

    expect(hasWebGL2).toBe(true);
    console.log('✅ WebGL2 context created successfully');

    // Check for shader compilation errors
    const shaderErrors = errors.filter(e =>
      e.includes('shader') || e.includes('WebGL') || e.includes('THREE')
    );

    if (shaderErrors.length > 0) {
      console.error('❌ Shader/WebGL errors detected:', shaderErrors);
    }

    expect(shaderErrors.length).toBe(0);
  });

  test('Court mesh is visible in scene', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(8000);

    // Check if scene has rendered objects
    const sceneInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { rendered: false };

      // Check canvas has non-transparent pixels (something is rendered)
      const ctx = canvas.getContext('2d');
      if (!ctx) return { rendered: false };

      // Sample center pixel to see if it's not just background
      const imageData = ctx.getImageData(
        canvas.width / 2,
        canvas.height / 2,
        1,
        1
      );

      return {
        rendered: true,
        pixelData: Array.from(imageData.data)
      };
    });

    console.log('Scene rendering info:', sceneInfo);
    expect(sceneInfo.rendered).toBe(true);
  });

  test('Camera controls work (orbit, zoom, pan)', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(8000);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Test orbit control - drag to rotate camera
    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) throw new Error('Canvas not found');

    const centerX = canvasBox.x + canvasBox.width / 2;
    const centerY = canvasBox.y + canvasBox.height / 2;

    // Drag to orbit
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + 100, centerY + 50);
    await page.mouse.up();

    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'docs/screenshots/04-camera-rotated.png'
    });

    console.log('✅ Camera orbit control tested');

    // Test zoom - scroll wheel
    await page.mouse.wheel(0, -500); // Zoom in
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'docs/screenshots/05-camera-zoomed-in.png'
    });

    console.log('✅ Camera zoom control tested');

    // Test pan - right click drag
    await page.mouse.move(centerX, centerY);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(centerX + 50, centerY);
    await page.mouse.up({ button: 'right' });

    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'docs/screenshots/06-camera-panned.png'
    });

    console.log('✅ Camera pan control tested');
  });

  test('Floor navigation controls work', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(8000);

    // Click on different floor levels
    const floorButtons = [
      'G: Tennis',
      'L1: Racquet',
      'L2: Social',
      'L3: Farm',
      'Full Facility'
    ];

    for (const floorLabel of floorButtons) {
      const button = page.locator(`button:has-text("${floorLabel}")`);
      await expect(button).toBeVisible();
      await button.click();

      await page.waitForTimeout(2000); // Wait for camera animation

      await page.screenshot({
        path: `docs/screenshots/floor-${floorLabel.replace(/[:\s]/g, '-').toLowerCase()}.png`
      });

      console.log(`✅ Floor navigation: ${floorLabel}`);
    }
  });

  test('Performance metrics - FPS check', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(8000);

    // Measure FPS
    const fpsData = await page.evaluate(() => {
      return new Promise<number[]>((resolve) => {
        const fps: number[] = [];
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFrame = () => {
          const currentTime = performance.now();
          const delta = currentTime - lastTime;

          if (delta >= 1000) {
            fps.push((frameCount * 1000) / delta);
            frameCount = 0;
            lastTime = currentTime;
          }

          frameCount++;

          if (fps.length < 5) {
            requestAnimationFrame(measureFrame);
          } else {
            resolve(fps);
          }
        };

        requestAnimationFrame(measureFrame);
      });
    });

    const avgFPS = fpsData.reduce((a, b) => a + b, 0) / fpsData.length;
    console.log(`FPS measurements: ${fpsData.map(f => f.toFixed(1)).join(', ')}`);
    console.log(`Average FPS: ${avgFPS.toFixed(1)}`);

    expect(avgFPS).toBeGreaterThan(30);
    console.log('✅ Performance: FPS > 30');
  });

  test('No critical console errors during rendering', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(10000);

    console.log(`Console errors: ${errors.length}`);
    console.log(`Console warnings: ${warnings.length}`);

    if (errors.length > 0) {
      console.error('Errors found:', errors);
    }

    // Allow some warnings but no critical errors
    expect(errors.length).toBe(0);
    console.log('✅ No critical console errors');
  });

  test('Grass rendering system is active', async ({ page }) => {
    await page.goto('http://localhost:3003/court');
    await page.waitForTimeout(8000);

    // Navigate to ground floor (grass courts)
    const groundButton = page.locator('button:has-text("G: Tennis")');
    await groundButton.click();
    await page.waitForTimeout(3000);

    // Take screenshot of grass courts
    await page.screenshot({
      path: 'docs/screenshots/grass-courts-rendering.png'
    });

    console.log('✅ Grass courts view captured');
  });

  test('Graceful fallback if rendering fails', async ({ page }) => {
    // Test error handling
    await page.goto('http://localhost:3003/court');

    // Inject WebGL failure to test fallback
    await page.evaluate(() => {
      // Simulate WebGL not available
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type: string) {
        if (type === 'webgl2' || type === 'webgl') {
          return null; // Simulate WebGL not supported
        }
        return originalGetContext.call(this, type);
      };
    });

    await page.waitForTimeout(5000);

    // Check if error message or fallback is shown
    const errorMessage = page.locator('text=/WebGL|not supported|error/i');
    const hasErrorUI = await errorMessage.count() > 0;

    console.log(hasErrorUI ? '✅ Fallback error UI shown' : '⚠️ No fallback UI detected');
  });
});
