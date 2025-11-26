import { test, expect } from '@playwright/test';

/**
 * Performance Benchmarking - Core Web Vitals
 *
 * Measures critical performance metrics:
 * - Time to Interactive (TTI)
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - Cumulative Layout Shift (CLS)
 */

interface PerformanceMetrics {
  tti: number;
  fcp: number;
  lcp: number;
  cls: number;
  tbt: number; // Total Blocking Time
  fid: number; // First Input Delay
}

// Performance budgets (in milliseconds)
const PERFORMANCE_BUDGETS = {
  tti: 3500,      // Time to Interactive
  fcp: 1800,      // First Contentful Paint
  lcp: 2500,      // Largest Contentful Paint
  cls: 0.1,       // Cumulative Layout Shift (score)
  tbt: 300,       // Total Blocking Time
  fid: 100,       // First Input Delay
};

test.describe('Core Web Vitals Performance', () => {
  test('measures initial page load performance', async ({ page }) => {
    // Enable performance tracing
    await page.coverage.startJSCoverage();

    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    // Collect performance metrics
    const metrics = await page.evaluate(() => {
      const perf = performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };

      const timing = perf.timing;
      const paint = perf.getEntriesByType('paint');
      const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      // First Contentful Paint
      const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
      const fcp = fcpEntry ? fcpEntry.startTime : 0;

      // Largest Contentful Paint
      const lcpEntries = perf.getEntriesByType('largest-contentful-paint');
      const lcp = lcpEntries.length > 0
        ? (lcpEntries[lcpEntries.length - 1] as PerformancePaintTiming).startTime
        : 0;

      // Time to Interactive (approximation)
      const tti = navigation ? navigation.domInteractive - navigation.fetchStart : 0;

      // Layout Shift (if available)
      const layoutShiftEntries = perf.getEntriesByType('layout-shift') as any[];
      const cls = layoutShiftEntries.reduce((sum, entry) => {
        if (!entry.hadRecentInput) {
          return sum + entry.value;
        }
        return sum;
      }, 0);

      return {
        fcp,
        lcp,
        tti,
        cls,
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        memoryUsed: perf.memory ? perf.memory.usedJSHeapSize / (1024 * 1024) : 0,
        memoryLimit: perf.memory ? perf.memory.jsHeapSizeLimit / (1024 * 1024) : 0,
      };
    });

    // Stop coverage
    const jsCoverage = await page.coverage.stopJSCoverage();

    console.log('\n=== Performance Metrics ===');
    console.log(`First Contentful Paint: ${metrics.fcp.toFixed(2)}ms`);
    console.log(`Largest Contentful Paint: ${metrics.lcp.toFixed(2)}ms`);
    console.log(`Time to Interactive: ${metrics.tti.toFixed(2)}ms`);
    console.log(`Cumulative Layout Shift: ${metrics.cls.toFixed(4)}`);
    console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    console.log(`Memory Used: ${metrics.memoryUsed.toFixed(2)}MB`);
    console.log(`Total Page Load: ${loadTime}ms`);

    // Performance budget assertions
    expect(metrics.fcp).toBeLessThan(PERFORMANCE_BUDGETS.fcp);
    expect(metrics.lcp).toBeLessThan(PERFORMANCE_BUDGETS.lcp);
    expect(metrics.tti).toBeLessThan(PERFORMANCE_BUDGETS.tti);
    expect(metrics.cls).toBeLessThan(PERFORMANCE_BUDGETS.cls);

    // Store metrics for reporting
    await page.evaluate((data) => {
      (window as any).__performanceMetrics = data;
    }, { ...metrics, loadTime, jsCoveragePercent: calculateCoverage(jsCoverage) });
  });

  test('measures 3D scene initialization performance', async ({ page }) => {
    await page.goto('/');

    const sceneMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const startTime = performance.now();
        let canvasReady = false;

        const checkCanvas = setInterval(() => {
          const canvas = document.querySelector('canvas');
          if (canvas && !canvasReady) {
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (gl) {
              canvasReady = true;
              const initTime = performance.now() - startTime;

              clearInterval(checkCanvas);

              // Wait for first frame render
              requestAnimationFrame(() => {
                const firstFrameTime = performance.now() - startTime;

                resolve({
                  canvasInitTime: initTime,
                  firstFrameTime,
                  webglVersion: gl instanceof WebGL2RenderingContext ? 2 : 1,
                });
              });
            }
          }
        }, 50);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkCanvas);
          resolve({ canvasInitTime: -1, firstFrameTime: -1, webglVersion: 0 });
        }, 10000);
      });
    });

    console.log('\n=== 3D Scene Performance ===');
    console.log(`Canvas Init: ${(sceneMetrics as any).canvasInitTime.toFixed(2)}ms`);
    console.log(`First Frame: ${(sceneMetrics as any).firstFrameTime.toFixed(2)}ms`);
    console.log(`WebGL Version: ${(sceneMetrics as any).webglVersion}`);

    expect((sceneMetrics as any).canvasInitTime).toBeLessThan(2000);
    expect((sceneMetrics as any).firstFrameTime).toBeLessThan(3000);
  });

  test('measures interaction responsiveness', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'visible' });

    // Measure click response time
    const clickResponseTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
          resolve(-1);
          return;
        }

        const startTime = performance.now();
        let responded = false;

        const handleInteraction = () => {
          if (!responded) {
            responded = true;
            const responseTime = performance.now() - startTime;
            canvas.removeEventListener('click', handleInteraction);
            resolve(responseTime);
          }
        };

        canvas.addEventListener('click', handleInteraction);

        // Simulate click
        canvas.click();

        // Timeout
        setTimeout(() => {
          if (!responded) {
            canvas.removeEventListener('click', handleInteraction);
            resolve(-1);
          }
        }, 5000);
      });
    });

    console.log('\n=== Interaction Performance ===');
    console.log(`Click Response Time: ${clickResponseTime}ms`);

    expect(clickResponseTime).toBeLessThan(PERFORMANCE_BUDGETS.fid);
  });
});

function calculateCoverage(coverage: any[]): number {
  if (!coverage || coverage.length === 0) return 0;

  let totalBytes = 0;
  let usedBytes = 0;

  for (const entry of coverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start;
    }
  }

  return totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;
}
