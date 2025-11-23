/**
 * Performance Assertions
 *
 * Reusable assertion helpers for validating performance metrics
 * in E2E tests.
 */

import { Page, expect } from '@playwright/test';

/**
 * Assert UI response time is within acceptable threshold
 */
export async function assertResponseTime(
  page: Page,
  action: () => Promise<void>,
  maxDuration: number = 100
): Promise<void> {
  const startTime = Date.now();
  await action();
  const duration = Date.now() - startTime;

  expect(duration).toBeLessThan(maxDuration);
}

/**
 * Assert frame rate is above minimum threshold
 */
export async function assertFrameRate(
  page: Page,
  minFPS: number = 30,
  duration: number = 2000
): Promise<void> {
  const fps = await page.evaluate((testDuration) => {
    return new Promise<number>((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();

      function countFrame() {
        frameCount++;
        const elapsed = performance.now() - startTime;

        if (elapsed < testDuration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = (frameCount / elapsed) * 1000;
          resolve(fps);
        }
      }

      requestAnimationFrame(countFrame);
    });
  }, duration);

  expect(fps).toBeGreaterThanOrEqual(minFPS);
}

/**
 * Assert memory usage is within limits
 */
export async function assertMemoryUsage(
  page: Page,
  maxMemoryMB: number = 100
): Promise<void> {
  const memoryInfo = await page.evaluate(() => {
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      return {
        usedJSHeapSize: mem.usedJSHeapSize / (1024 * 1024),
        totalJSHeapSize: mem.totalJSHeapSize / (1024 * 1024)
      };
    }
    return null;
  });

  if (memoryInfo) {
    expect(memoryInfo.usedJSHeapSize).toBeLessThan(maxMemoryMB);
  }
}

/**
 * Assert no layout shifts occurred
 */
export async function assertNoLayoutShifts(
  page: Page,
  maxShifts: number = 0
): Promise<void> {
  const shifts = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let shiftCount = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            shiftCount++;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });

      setTimeout(() => {
        observer.disconnect();
        resolve(shiftCount);
      }, 2000);
    });
  });

  expect(shifts).toBeLessThanOrEqual(maxShifts);
}

/**
 * Assert page load time
 */
export async function assertPageLoadTime(
  page: Page,
  maxLoadTime: number = 3000
): Promise<void> {
  const loadTime = await page.evaluate(() => {
    const timing = performance.timing;
    return timing.loadEventEnd - timing.navigationStart;
  });

  expect(loadTime).toBeLessThan(maxLoadTime);
}

/**
 * Assert no console errors
 */
export async function assertNoConsoleErrors(
  page: Page,
  allowedErrors: string[] = []
): Promise<void> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!allowedErrors.some(allowed => text.includes(allowed))) {
        errors.push(text);
      }
    }
  });

  await page.waitForTimeout(1000);
  expect(errors).toHaveLength(0);
}
