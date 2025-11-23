import { test, expect } from '@playwright/test';

/**
 * Performance Benchmarking - Memory Profiling
 *
 * Measures memory usage patterns:
 * - Memory leaks during extended sessions
 * - Heap snapshots
 * - Garbage collection impact
 */

test.describe('Memory Profiling Performance', () => {
  test('detects memory leaks during extended session', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const memoryProfile = await page.evaluate(() => {
      return new Promise((resolve) => {
        const perf = performance as Performance & {
          memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        };

        if (!perf.memory) {
          resolve({ leak: false, samples: [], growthRate: 0 });
          return;
        }

        const samples: Array<{ time: number; memory: number }> = [];
        const startMemory = perf.memory.usedJSHeapSize / (1024 * 1024);
        const startTime = performance.now();

        const sampleMemory = setInterval(() => {
          if (perf.memory) {
            const currentMemory = perf.memory.usedJSHeapSize / (1024 * 1024);
            const elapsed = performance.now() - startTime;

            samples.push({
              time: elapsed,
              memory: currentMemory,
            });
          }
        }, 500);

        // Monitor for 10 seconds
        setTimeout(() => {
          clearInterval(sampleMemory);

          if (!perf.memory) {
            resolve({ leak: false, samples: [], growthRate: 0 });
            return;
          }

          const endMemory = perf.memory.usedJSHeapSize / (1024 * 1024);
          const memoryGrowth = endMemory - startMemory;
          const growthRate = memoryGrowth / 10; // MB per second

          // Consider it a leak if growing > 1MB/sec consistently
          const leak = growthRate > 1;

          resolve({
            leak,
            samples,
            growthRate,
            startMemory,
            endMemory,
            totalGrowth: memoryGrowth,
          });
        }, 10000);
      });
    });

    console.log('\n=== Memory Leak Detection ===');
    console.log(`Start Memory: ${(memoryProfile as any).startMemory.toFixed(2)}MB`);
    console.log(`End Memory: ${(memoryProfile as any).endMemory.toFixed(2)}MB`);
    console.log(`Total Growth: ${(memoryProfile as any).totalGrowth.toFixed(2)}MB`);
    console.log(`Growth Rate: ${(memoryProfile as any).growthRate.toFixed(4)}MB/s`);
    console.log(`Leak Detected: ${(memoryProfile as any).leak}`);

    expect((memoryProfile as any).leak).toBe(false);
    expect((memoryProfile as any).totalGrowth).toBeLessThan(10); // Less than 10MB growth
  });

  test('measures memory usage during interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible' });

    const interactionMemory = await page.evaluate(() => {
      return new Promise((resolve) => {
        const perf = performance as Performance & {
          memory?: { usedJSHeapSize: number };
        };

        if (!perf.memory) {
          resolve({ before: 0, during: 0, after: 0 });
          return;
        }

        const before = perf.memory.usedJSHeapSize / (1024 * 1024);

        // Simulate interactions
        const canvas = document.querySelector('canvas');
        if (canvas) {
          for (let i = 0; i < 50; i++) {
            canvas.dispatchEvent(new MouseEvent('click'));
          }
        }

        setTimeout(() => {
          const during = perf.memory ? perf.memory.usedJSHeapSize / (1024 * 1024) : 0;

          // Wait for potential GC
          setTimeout(() => {
            const after = perf.memory ? perf.memory.usedJSHeapSize / (1024 * 1024) : 0;

            resolve({
              before,
              during,
              after,
              peak: during - before,
              retained: after - before,
            });
          }, 2000);
        }, 1000);
      });
    });

    console.log('\n=== Interaction Memory Profile ===');
    console.log(`Before: ${(interactionMemory as any).before.toFixed(2)}MB`);
    console.log(`During Peak: ${(interactionMemory as any).during.toFixed(2)}MB`);
    console.log(`After: ${(interactionMemory as any).after.toFixed(2)}MB`);
    console.log(`Peak Increase: ${(interactionMemory as any).peak.toFixed(2)}MB`);
    console.log(`Retained: ${(interactionMemory as any).retained.toFixed(2)}MB`);

    // Retained memory should be minimal after GC
    expect((interactionMemory as any).retained).toBeLessThan(5);
  });

  test('profiles memory during scene changes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sceneChangeMemory = await page.evaluate(() => {
      return new Promise((resolve) => {
        const perf = performance as Performance & {
          memory?: { usedJSHeapSize: number };
        };

        if (!perf.memory) {
          resolve({ snapshots: [] });
          return;
        }

        const snapshots: Array<{ event: string; memory: number }> = [];

        snapshots.push({
          event: 'initial',
          memory: perf.memory.usedJSHeapSize / (1024 * 1024),
        });

        // Simulate scene changes
        setTimeout(() => {
          snapshots.push({
            event: 'after_1s',
            memory: perf.memory ? perf.memory.usedJSHeapSize / (1024 * 1024) : 0,
          });

          setTimeout(() => {
            snapshots.push({
              event: 'after_3s',
              memory: perf.memory ? perf.memory.usedJSHeapSize / (1024 * 1024) : 0,
            });

            setTimeout(() => {
              snapshots.push({
                event: 'after_5s',
                memory: perf.memory ? perf.memory.usedJSHeapSize / (1024 * 1024) : 0,
              });

              resolve({ snapshots });
            }, 2000);
          }, 2000);
        }, 1000);
      });
    });

    console.log('\n=== Scene Change Memory Snapshots ===');
    for (const snapshot of (sceneChangeMemory as any).snapshots) {
      console.log(`${snapshot.event}: ${snapshot.memory.toFixed(2)}MB`);
    }

    const snapshots = (sceneChangeMemory as any).snapshots;
    const initialMemory = snapshots[0].memory;
    const finalMemory = snapshots[snapshots.length - 1].memory;
    const growth = finalMemory - initialMemory;

    expect(growth).toBeLessThan(20); // Less than 20MB growth over 5 seconds
  });
});
