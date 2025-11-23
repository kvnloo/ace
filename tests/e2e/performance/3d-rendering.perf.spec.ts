import { test, expect } from '@playwright/test';

/**
 * Performance Benchmarking - 3D Rendering
 *
 * Measures Three.js rendering performance:
 * - Frame rate (FPS)
 * - Memory usage during rendering
 * - GPU performance
 * - Scene complexity handling
 */

interface RenderingMetrics {
  avgFps: number;
  minFps: number;
  maxFps: number;
  frameDrops: number;
  memoryDelta: number;
  renderTime: number;
}

// Performance budgets
const RENDERING_BUDGETS = {
  minFps: 30,        // Minimum acceptable FPS
  avgFps: 50,        // Target average FPS
  maxMemoryMB: 200,  // Maximum memory increase
  maxRenderMs: 16.67, // Max render time per frame (60 FPS)
};

test.describe('3D Rendering Performance', () => {
  test('measures frame rate during idle scene', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Let scene stabilize

    const metrics = await measureFrameRate(page, 5000);

    console.log('\n=== Idle Scene FPS ===');
    console.log(`Average FPS: ${metrics.avgFps.toFixed(2)}`);
    console.log(`Min FPS: ${metrics.minFps.toFixed(2)}`);
    console.log(`Max FPS: ${metrics.maxFps.toFixed(2)}`);
    console.log(`Frame Drops: ${metrics.frameDrops}`);

    expect(metrics.avgFps).toBeGreaterThan(RENDERING_BUDGETS.avgFps);
    expect(metrics.minFps).toBeGreaterThan(RENDERING_BUDGETS.minFps);
  });

  test('measures FPS during camera movement', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Start measuring before interaction
    const metricsPromise = measureFrameRate(page, 3000);

    // Simulate camera movement
    const canvas = page.locator('canvas').first();
    await canvas.hover();

    // Drag to rotate camera
    await page.mouse.down();
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(100 + i * 50, 100);
      await page.waitForTimeout(100);
    }
    await page.mouse.up();

    const metrics = await metricsPromise;

    console.log('\n=== Camera Movement FPS ===');
    console.log(`Average FPS: ${metrics.avgFps.toFixed(2)}`);
    console.log(`Min FPS: ${metrics.minFps.toFixed(2)}`);
    console.log(`Frame Drops: ${metrics.frameDrops}`);

    expect(metrics.minFps).toBeGreaterThan(RENDERING_BUDGETS.minFps);
  });

  test('measures memory usage during scene rendering', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const memoryMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const perf = performance as Performance & {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
          };
        };

        if (!perf.memory) {
          resolve({ initialMemory: 0, peakMemory: 0, delta: 0 });
          return;
        }

        const initialMemory = perf.memory.usedJSHeapSize / (1024 * 1024);
        let peakMemory = initialMemory;

        const checkMemory = setInterval(() => {
          if (perf.memory) {
            const current = perf.memory.usedJSHeapSize / (1024 * 1024);
            peakMemory = Math.max(peakMemory, current);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkMemory);
          resolve({
            initialMemory,
            peakMemory,
            delta: peakMemory - initialMemory,
          });
        }, 5000);
      });
    });

    console.log('\n=== Memory Usage ===');
    console.log(`Initial: ${(memoryMetrics as any).initialMemory.toFixed(2)}MB`);
    console.log(`Peak: ${(memoryMetrics as any).peakMemory.toFixed(2)}MB`);
    console.log(`Delta: ${(memoryMetrics as any).delta.toFixed(2)}MB`);

    expect((memoryMetrics as any).delta).toBeLessThan(RENDERING_BUDGETS.maxMemoryMB);
  });

  test('measures render time per frame', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const renderTimes = await page.evaluate(() => {
      return new Promise((resolve) => {
        const times: number[] = [];
        let frameCount = 0;
        const maxFrames = 60; // Measure 60 frames

        const measureFrame = () => {
          const start = performance.now();

          requestAnimationFrame(() => {
            const renderTime = performance.now() - start;
            times.push(renderTime);
            frameCount++;

            if (frameCount < maxFrames) {
              measureFrame();
            } else {
              const avg = times.reduce((a, b) => a + b, 0) / times.length;
              const max = Math.max(...times);
              const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

              resolve({ avg, max, p95 });
            }
          });
        };

        measureFrame();
      });
    });

    console.log('\n=== Render Time Per Frame ===');
    console.log(`Average: ${(renderTimes as any).avg.toFixed(2)}ms`);
    console.log(`Max: ${(renderTimes as any).max.toFixed(2)}ms`);
    console.log(`95th Percentile: ${(renderTimes as any).p95.toFixed(2)}ms`);

    expect((renderTimes as any).p95).toBeLessThan(RENDERING_BUDGETS.maxRenderMs);
  });

  test('measures GPU performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const gpuInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';

      return {
        vendor,
        renderer,
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
        maxFragmentUniforms: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
      };
    });

    console.log('\n=== GPU Information ===');
    console.log(`Vendor: ${(gpuInfo as any)?.vendor}`);
    console.log(`Renderer: ${(gpuInfo as any)?.renderer}`);
    console.log(`Max Texture Size: ${(gpuInfo as any)?.maxTextureSize}`);

    expect(gpuInfo).not.toBeNull();
  });

  test('measures performance under scene complexity', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Try to increase scene complexity if controls available
    const weatherButton = page.locator('[aria-label*="weather"]').first();
    if (await weatherButton.count() > 0) {
      await weatherButton.click();
      await page.waitForTimeout(500);

      // Enable weather effects
      const rainOption = page.locator('text=/rain|weather/i').first();
      if (await rainOption.count() > 0) {
        await rainOption.click();
        await page.waitForTimeout(1000);
      }
    }

    const metrics = await measureFrameRate(page, 3000);

    console.log('\n=== Complex Scene FPS ===');
    console.log(`Average FPS: ${metrics.avgFps.toFixed(2)}`);
    console.log(`Min FPS: ${metrics.minFps.toFixed(2)}`);

    // Complex scenes should maintain at least minimum FPS
    expect(metrics.minFps).toBeGreaterThan(RENDERING_BUDGETS.minFps);
  });
});

async function measureFrameRate(page: any, duration: number): Promise<RenderingMetrics> {
  return await page.evaluate((measureDuration: number) => {
    return new Promise((resolve) => {
      const fps: number[] = [];
      let lastTime = performance.now();
      let frameCount = 0;
      let frameDrops = 0;

      const measure = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;

        if (delta > 0) {
          const currentFps = 1000 / delta;
          fps.push(currentFps);

          if (currentFps < 30) {
            frameDrops++;
          }
        }

        lastTime = currentTime;
        frameCount++;

        if (currentTime - startTime < measureDuration) {
          requestAnimationFrame(measure);
        } else {
          const avgFps = fps.reduce((a, b) => a + b, 0) / fps.length;
          const minFps = Math.min(...fps);
          const maxFps = Math.max(...fps);

          resolve({
            avgFps,
            minFps,
            maxFps,
            frameDrops,
            memoryDelta: 0,
            renderTime: measureDuration,
          });
        }
      };

      const startTime = performance.now();
      requestAnimationFrame(measure);
    });
  }, duration);
}
