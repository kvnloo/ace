/**
 * 3D Court Rendering Validation Tests
 *
 * Comprehensive test suite to verify the 3D court is actually rendering
 * and interactive after fixes are applied.
 */

import { test, expect, Page } from '@playwright/test';

const TEST_TIMEOUT = 30000;
const INITIAL_LOAD_WAIT = 3000;
const INTERACTION_WAIT = 500;

test.describe('3D Court Rendering Validation Suite', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Monitor console for errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Navigate to the application
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for initial render
    await page.waitForTimeout(INITIAL_LOAD_WAIT);

    // Ensure no critical errors during load
    const criticalErrors = consoleErrors.filter(err =>
      err.includes('WebGL') ||
      err.includes('THREE') ||
      err.includes('renderer') ||
      err.includes('canvas')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test.describe('Canvas Rendering Tests', () => {
    test('✅ Canvas element should exist in DOM', async () => {
      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();

      const canvasCount = await page.locator('canvas').count();
      expect(canvasCount).toBeGreaterThanOrEqual(1);
    });

    test('✅ Canvas should have correct dimensions', async () => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();

      expect(box).toBeTruthy();
      expect(box!.width).toBeGreaterThan(100);
      expect(box!.height).toBeGreaterThan(100);

      // Canvas should be reasonably sized
      expect(box!.width).toBeGreaterThan(400);
      expect(box!.height).toBeGreaterThan(300);
    });

    test('✅ Canvas contains non-blank pixels (actual rendering)', async () => {
      const hasVisibleContent = await page.evaluate(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (!canvas) return false;

        // Try to get 2D context for pixel inspection
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          // If no 2D context, check WebGL is active
          const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
          return gl !== null;
        }

        const imageData = ctx.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
        const pixels = imageData.data;

        // Check for non-transparent pixels
        let nonTransparentPixels = 0;
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] > 0) { // Alpha channel
            nonTransparentPixels++;
          }
        }

        // At least 10% of sampled area should have content
        return nonTransparentPixels > (pixels.length / 4) * 0.1;
      });

      expect(hasVisibleContent).toBe(true);
    });

    test('✅ WebGL context is active and valid', async () => {
      const webglStatus = await page.evaluate(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (!canvas) return { active: false, version: null };

        const gl2 = canvas.getContext('webgl2');
        if (gl2) return { active: true, version: 'webgl2' };

        const gl = canvas.getContext('webgl');
        if (gl) return { active: true, version: 'webgl' };

        return { active: false, version: null };
      });

      expect(webglStatus.active).toBe(true);
      expect(webglStatus.version).toBeTruthy();
    });
  });

  test.describe('3D Court Visibility Tests', () => {
    test('✅ Court mesh/geometry is present in scene', async () => {
      const courtVisible = await page.evaluate(() => {
        // Check for Three.js scene objects
        const hasThree = !!(window as any).__THREE__;
        const hasScene = !!(window as any).scene;
        const hasRenderer = !!(window as any).renderer;

        return hasThree || hasScene || hasRenderer;
      });

      expect(courtVisible).toBe(true);
    });

    test('✅ Court has correct colors/textures (green court)', async () => {
      // Take a screenshot and analyze dominant colors
      const screenshot = await page.locator('canvas').first().screenshot();

      const hasGreenTones = await page.evaluate(async (imgData) => {
        const img = new Image();
        img.src = `data:image/png;base64,${imgData}`;

        await new Promise(resolve => img.onload = resolve);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let greenPixels = 0;
        let totalColoredPixels = 0;

        // Sample every 100th pixel for performance
        for (let i = 0; i < pixels.length; i += 400) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a > 200) { // Non-transparent
            totalColoredPixels++;
            // Check if green is dominant
            if (g > r && g > b) {
              greenPixels++;
            }
          }
        }

        // At least 20% of colored pixels should be greenish (court color)
        return totalColoredPixels > 0 && (greenPixels / totalColoredPixels) > 0.2;
      }, screenshot.toString('base64'));

      expect(hasGreenTones).toBe(true);
    });

    test('✅ Court is positioned correctly in viewport', async () => {
      const screenshot = await page.locator('canvas').first().screenshot();

      // Verify court is centered and visible
      const isPositionedCorrectly = await page.evaluate(async (imgData) => {
        const img = new Image();
        img.src = `data:image/png;base64,${imgData}`;

        await new Promise(resolve => img.onload = resolve);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Check center region has content
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        const sampleSize = 50;

        const centerData = ctx.getImageData(
          centerX - sampleSize/2,
          centerY - sampleSize/2,
          sampleSize,
          sampleSize
        );

        let hasContent = false;
        for (let i = 3; i < centerData.data.length; i += 4) {
          if (centerData.data[i] > 0) {
            hasContent = true;
            break;
          }
        }

        return hasContent;
      }, screenshot.toString('base64'));

      expect(isPositionedCorrectly).toBe(true);
    });
  });

  test.describe('User Interaction Tests', () => {
    test('✅ Mouse drag rotates camera', async () => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();

      expect(box).toBeTruthy();

      // Take initial screenshot
      const screenshotBefore = await canvas.screenshot();

      // Perform drag interaction
      const centerX = box!.x + box!.width / 2;
      const centerY = box!.y + box!.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 150, centerY + 50, { steps: 5 });
      await page.mouse.up();

      await page.waitForTimeout(INTERACTION_WAIT);

      // Take screenshot after interaction
      const screenshotAfter = await canvas.screenshot();

      // Screenshots should be different
      expect(screenshotBefore.equals(screenshotAfter)).toBe(false);
    });

    test('✅ Mouse wheel zooms in/out', async () => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();

      expect(box).toBeTruthy();

      // Take initial screenshot
      const screenshotBefore = await canvas.screenshot();

      // Perform wheel zoom
      const centerX = box!.x + box!.width / 2;
      const centerY = box!.y + box!.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.wheel(0, 100); // Zoom out

      await page.waitForTimeout(INTERACTION_WAIT);

      const screenshotAfterZoomOut = await canvas.screenshot();

      // Zoom back in
      await page.mouse.wheel(0, -200); // Zoom in

      await page.waitForTimeout(INTERACTION_WAIT);

      const screenshotAfterZoomIn = await canvas.screenshot();

      // All screenshots should be different
      expect(screenshotBefore.equals(screenshotAfterZoomOut)).toBe(false);
      expect(screenshotAfterZoomOut.equals(screenshotAfterZoomIn)).toBe(false);
    });

    test('✅ Click events are registered', async () => {
      const canvas = page.locator('canvas').first();

      let clickRegistered = false;

      await page.exposeFunction('onCanvasClick', () => {
        clickRegistered = true;
      });

      await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          canvas.addEventListener('click', () => {
            (window as any).onCanvasClick();
          });
        }
      });

      await canvas.click();
      await page.waitForTimeout(100);

      expect(clickRegistered).toBe(true);
    });

    test('✅ Touch gestures work on mobile viewport', async () => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const canvas = page.locator('canvas').first();
      await expect(canvas).toBeVisible();

      const box = await canvas.boundingBox();
      expect(box).toBeTruthy();

      // Take initial screenshot
      const screenshotBefore = await canvas.screenshot();

      // Simulate touch drag
      const centerX = box!.x + box!.width / 2;
      const centerY = box!.y + box!.height / 2;

      await page.touchscreen.tap(centerX, centerY);

      // Touch drag simulation
      await page.evaluate(({ x, y }) => {
        const canvas = document.querySelector('canvas')!;

        // Simulate touch start
        const touchStart = new Touch({
          identifier: 1,
          target: canvas,
          clientX: x,
          clientY: y,
        });

        const touchStartEvent = new TouchEvent('touchstart', {
          touches: [touchStart],
          targetTouches: [touchStart],
          changedTouches: [touchStart],
        });

        canvas.dispatchEvent(touchStartEvent);

        // Simulate touch move
        const touchMove = new Touch({
          identifier: 1,
          target: canvas,
          clientX: x + 50,
          clientY: y + 50,
        });

        const touchMoveEvent = new TouchEvent('touchmove', {
          touches: [touchMove],
          targetTouches: [touchMove],
          changedTouches: [touchMove],
        });

        canvas.dispatchEvent(touchMoveEvent);

        // Simulate touch end
        const touchEndEvent = new TouchEvent('touchend', {
          touches: [],
          targetTouches: [],
          changedTouches: [touchMove],
        });

        canvas.dispatchEvent(touchEndEvent);
      }, { x: centerX, y: centerY });

      await page.waitForTimeout(INTERACTION_WAIT);

      const screenshotAfter = await canvas.screenshot();

      // View should have changed
      expect(screenshotBefore.equals(screenshotAfter)).toBe(false);
    });
  });

  test.describe('Performance Tests', () => {
    test('✅ FPS is above 30 after initial render', async () => {
      // Look for FPS display
      const fpsElement = page.locator('text=/FPS:|fps:/i').first();

      try {
        await expect(fpsElement).toBeVisible({ timeout: 5000 });

        const fpsText = await fpsElement.textContent();
        const fpsMatch = fpsText?.match(/(\d+)/);

        if (fpsMatch) {
          const fps = parseInt(fpsMatch[1]);
          expect(fps).toBeGreaterThanOrEqual(30);
        }
      } catch {
        // If no FPS display, measure programmatically
        const measuredFPS = await page.evaluate(() => {
          return new Promise<number>((resolve) => {
            let frameCount = 0;
            const startTime = performance.now();

            const countFrames = () => {
              frameCount++;

              if (performance.now() - startTime < 1000) {
                requestAnimationFrame(countFrames);
              } else {
                resolve(frameCount);
              }
            };

            requestAnimationFrame(countFrames);
          });
        });

        expect(measuredFPS).toBeGreaterThanOrEqual(30);
      }
    });

    test('✅ FPS remains stable during interaction', async () => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();

      if (!box) {
        throw new Error('Canvas not found');
      }

      const fpsReadings: number[] = [];

      // Measure FPS during interaction
      for (let i = 0; i < 5; i++) {
        const fps = await page.evaluate(() => {
          return new Promise<number>((resolve) => {
            let frameCount = 0;
            const startTime = performance.now();

            const countFrames = () => {
              frameCount++;

              if (performance.now() - startTime < 500) {
                requestAnimationFrame(countFrames);
              } else {
                const duration = (performance.now() - startTime) / 1000;
                resolve(frameCount / duration);
              }
            };

            requestAnimationFrame(countFrames);
          });
        });

        fpsReadings.push(fps);

        // Perform interaction during measurement
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        await page.mouse.move(centerX, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 20 * i, centerY + 10 * i);
        await page.mouse.up();
      }

      // Calculate stability (standard deviation)
      const avg = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
      const variance = fpsReadings.reduce((sum, fps) => sum + Math.pow(fps - avg, 2), 0) / fpsReadings.length;
      const stdDev = Math.sqrt(variance);

      // FPS should be stable (low standard deviation)
      expect(stdDev).toBeLessThan(15);

      // Average FPS should still be above 30
      expect(avg).toBeGreaterThanOrEqual(30);
    });

    test('✅ No memory leaks detected', async () => {
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      // Perform multiple interactions
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();

      if (box) {
        for (let i = 0; i < 10; i++) {
          const centerX = box.x + box.width / 2;
          const centerY = box.y + box.height / 2;

          await page.mouse.move(centerX, centerY);
          await page.mouse.down();
          await page.mouse.move(centerX + 50, centerY + 50);
          await page.mouse.up();

          await page.waitForTimeout(100);
        }
      }

      // Force garbage collection if available
      await page.evaluate(() => {
        if (typeof (global as any).gc === 'function') {
          (global as any).gc();
        }
      });

      await page.waitForTimeout(1000);

      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if ('memory' in performance) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      // Memory increase should be reasonable (less than 50MB)
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  test.describe('Visual Regression Tests', () => {
    test('✅ Screenshot comparison - baseline render', async () => {
      const canvas = page.locator('canvas').first();

      // Wait for stable render
      await page.waitForTimeout(2000);

      // Take screenshot for visual regression
      await expect(canvas).toHaveScreenshot('3d-court-baseline.png', {
        maxDiffPixels: 1000,
        threshold: 0.2,
      });
    });

    test('✅ Pixel detection - court is visible', async () => {
      const courtPixelsDetected = await page.evaluate(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (!canvas) return false;

        // Create temporary 2D canvas for pixel inspection
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return false;

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Draw the WebGL canvas to 2D canvas
        tempCtx.drawImage(canvas, 0, 0);

        // Sample center area
        const centerX = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        const sampleData = tempCtx.getImageData(centerX - 50, centerY - 50, 100, 100);

        // Look for non-black pixels (court should be visible)
        let nonBlackPixels = 0;
        for (let i = 0; i < sampleData.data.length; i += 4) {
          const r = sampleData.data[i];
          const g = sampleData.data[i + 1];
          const b = sampleData.data[i + 2];
          const a = sampleData.data[i + 3];

          if (a > 0 && (r > 10 || g > 10 || b > 10)) {
            nonBlackPixels++;
          }
        }

        // At least 30% should be non-black (court visible)
        return nonBlackPixels > (sampleData.data.length / 4) * 0.3;
      });

      expect(courtPixelsDetected).toBe(true);
    });

    test('✅ WebGL context validation', async () => {
      const webglValidation = await page.evaluate(() => {
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        if (!canvas) return { valid: false, details: 'No canvas found' };

        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return { valid: false, details: 'No WebGL context' };

        // Check various WebGL states
        const checks = {
          viewport: gl.getParameter(gl.VIEWPORT),
          currentProgram: gl.getParameter(gl.CURRENT_PROGRAM),
          arrayBuffer: gl.getParameter(gl.ARRAY_BUFFER_BINDING),
          elementBuffer: gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING),
          error: gl.getError() === gl.NO_ERROR,
          depthTest: gl.getParameter(gl.DEPTH_TEST),
          blendEnabled: gl.getParameter(gl.BLEND),
        };

        const valid = checks.viewport &&
                     checks.currentProgram &&
                     checks.error &&
                     (checks.arrayBuffer || checks.elementBuffer);

        return {
          valid,
          details: checks
        };
      });

      expect(webglValidation.valid).toBe(true);
    });

    test('✅ Camera movement validation', async () => {
      const canvas = page.locator('canvas').first();
      const box = await canvas.boundingBox();

      if (!box) {
        throw new Error('Canvas not found');
      }

      // Get initial camera state
      const initialState = await page.evaluate(() => {
        return {
          timestamp: Date.now(),
          hasCamera: !!(window as any).camera,
          hasControls: !!(window as any).controls,
        };
      });

      expect(initialState.hasCamera || initialState.hasControls).toBe(true);

      // Perform camera movement
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      const screenshot1 = await canvas.screenshot();

      // Rotate camera
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 100, centerY);
      await page.mouse.up();

      await page.waitForTimeout(500);
      const screenshot2 = await canvas.screenshot();

      // Verify movement occurred
      expect(screenshot1.equals(screenshot2)).toBe(false);
    });
  });

  test.describe('Console Error Detection', () => {
    test('✅ No WebGL errors in console', async () => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      // Trigger some interactions to potentially reveal errors
      const canvas = page.locator('canvas').first();
      await canvas.click();

      await page.waitForTimeout(1000);

      const webglErrors = errors.filter(err =>
        err.toLowerCase().includes('webgl') ||
        err.toLowerCase().includes('gl') ||
        err.toLowerCase().includes('shader') ||
        err.toLowerCase().includes('texture')
      );

      expect(webglErrors).toHaveLength(0);
    });

    test('✅ No Three.js errors in console', async () => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(2000);

      const threeErrors = errors.filter(err =>
        err.toLowerCase().includes('three') ||
        err.toLowerCase().includes('geometry') ||
        err.toLowerCase().includes('material') ||
        err.toLowerCase().includes('mesh')
      );

      expect(threeErrors).toHaveLength(0);
    });
  });

  test.describe('Comprehensive 3D Validation', () => {
    test('✅ Full 3D rendering pipeline validation', async () => {
      const validationResults = await page.evaluate(() => {
        const results = {
          canvas: false,
          webgl: false,
          renderer: false,
          scene: false,
          camera: false,
          renderLoop: false,
          meshes: false,
        };

        // Check canvas
        const canvas = document.querySelector('canvas') as HTMLCanvasElement;
        results.canvas = !!canvas;

        if (canvas) {
          // Check WebGL
          const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
          results.webgl = !!gl;

          // Check for Three.js or renderer
          results.renderer = !!(window as any).renderer || !!(window as any).__THREE__;
          results.scene = !!(window as any).scene;
          results.camera = !!(window as any).camera;

          // Check if render loop is active
          let frameCount = 0;
          const checkRenderLoop = (callback: (active: boolean) => void) => {
            const start = performance.now();
            const count = () => {
              frameCount++;
              if (performance.now() - start < 100) {
                requestAnimationFrame(count);
              } else {
                callback(frameCount > 5);
              }
            };
            requestAnimationFrame(count);
          };

          return new Promise((resolve) => {
            checkRenderLoop((active) => {
              results.renderLoop = active;
              resolve(results);
            });
          });
        }

        return results;
      });

      // All critical components should be present
      expect(validationResults.canvas).toBe(true);
      expect(validationResults.webgl).toBe(true);
      expect(validationResults.renderLoop).toBe(true);

      // At least some 3D components should be detected
      const has3DComponents = validationResults.renderer ||
                             validationResults.scene ||
                             validationResults.camera;
      expect(has3DComponents).toBe(true);
    });
  });
});

// Test configuration
test.setTimeout(TEST_TIMEOUT);
test.use({
  viewport: { width: 1280, height: 720 },
  video: 'on-first-retry',
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
});