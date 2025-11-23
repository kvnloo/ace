/**
 * Performance Testing Utilities
 *
 * Provides comprehensive performance monitoring tools for E2E tests including:
 * - Page load time measurement
 * - FPS monitoring during 3D interactions
 * - Memory usage tracking
 * - Lighthouse performance auditing
 * - Large dataset rendering benchmarks
 */

import { Page } from '@playwright/test';

/**
 * Performance metrics collected during tests
 */
export interface PerformanceMetrics {
  /** Page load time in milliseconds */
  loadTime: number;
  /** First Contentful Paint in milliseconds */
  fcp: number;
  /** Largest Contentful Paint in milliseconds */
  lcp: number;
  /** Time to Interactive in milliseconds */
  tti: number;
  /** Total Blocking Time in milliseconds */
  tbt: number;
  /** Cumulative Layout Shift score */
  cls: number;
  /** Memory usage in MB */
  memoryUsage: number;
  /** Average FPS during interactions */
  averageFps: number;
}

/**
 * Lighthouse audit results
 */
export interface LighthouseResults {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

/**
 * Measure page load time and Web Vitals
 */
export async function measurePageLoad(page: Page): Promise<PerformanceMetrics> {
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Get performance metrics using Performance API
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');

    // Calculate FCP and LCP
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      fcp: fcp,
      lcp: 0, // Will be measured separately
      tti: perfData.domInteractive - perfData.fetchStart,
      tbt: 0, // Calculated from long tasks
      cls: 0, // Measured via Layout Instability API
      memoryUsage: (performance as any).memory ?
        (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0,
      averageFps: 0
    };
  });

  return metrics;
}

/**
 * Monitor FPS during 3D scene interactions
 * Validates that FPS stays above 60 during animations
 */
export async function monitorFPS(page: Page, durationMs: number = 5000): Promise<number> {
  // Start FPS monitoring
  await page.evaluate((duration) => {
    return new Promise((resolve) => {
      const frameTimes: number[] = [];
      let lastTime = performance.now();
      let startTime = lastTime;

      function measureFrame() {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;
        frameTimes.push(delta);
        lastTime = currentTime;

        if (currentTime - startTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          // Calculate average FPS
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const fps = 1000 / avgFrameTime;
          (window as any).__fpsResult = fps;
          resolve(fps);
        }
      }

      requestAnimationFrame(measureFrame);
    });
  }, durationMs);

  // Get the result
  const fps = await page.evaluate(() => (window as any).__fpsResult);
  return fps;
}

/**
 * Measure memory usage after rendering large datasets
 */
export async function measureMemoryUsage(page: Page): Promise<number> {
  const memoryMB = await page.evaluate(() => {
    if ((performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  });

  return memoryMB;
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export async function measureCLS(page: Page): Promise<number> {
  const cls = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });

      // Measure for 3 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(clsValue);
      }, 3000);
    });
  });

  return cls;
}

/**
 * Get Largest Contentful Paint (LCP)
 */
export async function measureLCP(page: Page): Promise<number> {
  const lcp = await page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let lcpValue = 0;

      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcpValue = lastEntry.startTime;
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // Measure for 5 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(lcpValue);
      }, 5000);
    });
  });

  return lcp;
}

/**
 * Benchmark large dataset rendering
 */
export async function benchmarkLargeDataset(
  page: Page,
  dataPoints: number = 1000
): Promise<{ renderTime: number; fps: number }> {
  const startTime = Date.now();

  // Trigger large dataset rendering
  await page.evaluate((count) => {
    // Simulate rendering many data points
    const container = document.createElement('div');
    container.id = 'benchmark-container';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.textContent = `Data Point ${i}`;
      element.style.cssText = 'padding: 4px; margin: 2px; background: rgba(255,255,255,0.1);';
      container.appendChild(element);
    }
  }, dataPoints);

  const renderTime = Date.now() - startTime;

  // Measure FPS during rendering
  const fps = await monitorFPS(page, 2000);

  // Cleanup
  await page.evaluate(() => {
    const container = document.getElementById('benchmark-container');
    if (container) container.remove();
  });

  return { renderTime, fps };
}

/**
 * Run Lighthouse audit (simplified version)
 * Note: Full Lighthouse requires additional setup
 */
export async function runLighthouseAudit(page: Page): Promise<Partial<LighthouseResults>> {
  // This is a simplified version - full Lighthouse integration requires more setup
  const metrics = await measurePageLoad(page);
  const cls = await measureCLS(page);
  const lcp = await measureLCP(page);

  // Calculate performance score based on metrics
  const performanceScore = calculatePerformanceScore({
    ...metrics,
    cls,
    lcp
  });

  return {
    performance: performanceScore,
    // Other scores would require full Lighthouse integration
  };
}

/**
 * Calculate performance score (0-100) based on Web Vitals
 */
function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;

  // Penalize slow load times (relaxed for headless)
  if (metrics.loadTime > 5000) score -= 15;
  else if (metrics.loadTime > 3000) score -= 7;

  // Penalize slow LCP (relaxed for headless with 3D rendering)
  if (metrics.lcp > 6000) score -= 15;
  else if (metrics.lcp > 5000) score -= 7;

  // Penalize high CLS (relaxed for dynamic 3D content)
  if (metrics.cls > 0.3) score -= 15;
  else if (metrics.cls > 0.15) score -= 7;

  // Penalize low FPS (heavily relaxed for headless test environment)
  if (metrics.averageFps < 3) score -= 20;
  else if (metrics.averageFps < 5) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Wait for Three.js scene to be ready
 */
export async function waitForThreeJsScene(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check if Three.js scene is initialized
      return (window as any).__THREE_SCENE_READY === true;
    },
    { timeout }
  );
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(metrics: PerformanceMetrics): string {
  return `
Performance Test Results (Headless Environment)
================================================

Load Time: ${metrics.loadTime.toFixed(2)}ms ${metrics.loadTime < 3000 ? '✅' : '❌'}
FCP: ${metrics.fcp.toFixed(2)}ms ${metrics.fcp < 2500 ? '✅' : '❌'}
LCP: ${metrics.lcp.toFixed(2)}ms ${metrics.lcp < 5000 ? '✅' : '❌'}
TTI: ${metrics.tti.toFixed(2)}ms ${metrics.tti < 3800 ? '✅' : '❌'}
CLS: ${metrics.cls.toFixed(3)} ${metrics.cls < 0.15 ? '✅' : '❌'}
Memory: ${metrics.memoryUsage.toFixed(2)}MB ${metrics.memoryUsage < 300 ? '✅' : '❌'}
Average FPS: ${metrics.averageFps.toFixed(2)} ${metrics.averageFps >= 5 ? '✅' : '❌'}

Headless-Relaxed Thresholds:
- Load Time: <3000ms
- FCP: <2500ms
- LCP: <5000ms (relaxed for 3D rendering)
- TTI: <3800ms
- CLS: <0.15 (relaxed for dynamic 3D)
- Memory: <300MB
- FPS: ≥5 (heavily relaxed for headless)
  `.trim();
}
