import { Page, expect } from '@playwright/test';

/**
 * E2E Test Helper Functions
 *
 * Reusable utilities for user journey testing
 */

export interface LoadingMetrics {
  startTime: number;
  endTime: number;
  duration: number;
  phasesObserved: string[];
}

export interface ConsoleMonitor {
  errors: string[];
  warnings: string[];
  logs: string[];
  clear: () => void;
}

/**
 * Wait for loading screen to complete
 */
export async function waitForLoadingComplete(page: Page, timeout = 60000): Promise<LoadingMetrics> {
  const startTime = Date.now();
  const phasesObserved: string[] = [];

  const loadingScreen = page.locator('[data-testid="loading-screen"]');

  // Verify loading screen appears first
  await expect(loadingScreen).toBeVisible({ timeout: 5000 });

  // Monitor loading phases
  const phasePatterns = [
    /Initializing/i,
    /Loading/i,
    /Preparing/i,
    /Ready/i
  ];

  // Sample phases during loading
  const checkInterval = setInterval(async () => {
    for (const pattern of phasePatterns) {
      const phase = page.locator(`text=${pattern}`);
      const isVisible = await phase.isVisible().catch(() => false);
      if (isVisible && !phasesObserved.includes(pattern.source)) {
        phasesObserved.push(pattern.source);
      }
    }
  }, 500);

  // Wait for loading to complete
  await expect(loadingScreen).not.toBeVisible({ timeout });

  clearInterval(checkInterval);

  const endTime = Date.now();

  return {
    startTime,
    endTime,
    duration: endTime - startTime,
    phasesObserved
  };
}

/**
 * Verify 3D canvas is rendering
 */
export async function verifyCanvasRendering(page: Page): Promise<void> {
  const canvas = page.locator('canvas');

  // Canvas should be visible
  await expect(canvas).toBeVisible({ timeout: 10000 });

  // Canvas should have reasonable dimensions
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(100);
  expect(box!.height).toBeGreaterThan(100);

  // Verify WebGL context exists
  const hasWebGL = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    return gl !== null;
  });

  expect(hasWebGL).toBe(true);
}

/**
 * Setup console monitoring
 */
export function setupConsoleMonitor(page: Page): ConsoleMonitor {
  const monitor: ConsoleMonitor = {
    errors: [],
    warnings: [],
    logs: [],
    clear: () => {
      monitor.errors = [];
      monitor.warnings = [];
      monitor.logs = [];
    }
  };

  page.on('console', msg => {
    const text = msg.text();
    switch (msg.type()) {
      case 'error':
        monitor.errors.push(text);
        break;
      case 'warning':
        monitor.warnings.push(text);
        break;
      default:
        monitor.logs.push(text);
    }
  });

  page.on('pageerror', error => {
    monitor.errors.push(`Page Error: ${error.message}`);
  });

  return monitor;
}

/**
 * Filter out non-critical console errors
 */
export function filterCriticalErrors(errors: string[]): string[] {
  const ignoredPatterns = [
    /Download the React DevTools/i,
    /Failed to load resource.*favicon/i,
    /Chrome extensions/i,
    /WebSocket connection/i, // Common dev warning
    /Download the Vue Devtools/i
  ];

  return errors.filter(error => {
    return !ignoredPatterns.some(pattern => pattern.test(error));
  });
}

/**
 * Perform orbit camera interaction
 */
export async function orbitCamera(page: Page, fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
  const canvas = page.locator('canvas');

  await canvas.hover({ position: { x: fromX, y: fromY } });
  await page.mouse.down();
  await page.mouse.move(toX, toY, { steps: 10 });
  await page.mouse.up();

  // Allow animation to settle
  await page.waitForTimeout(500);
}

/**
 * Perform zoom interaction
 */
export async function zoomCamera(page: Page, delta: number): Promise<void> {
  const canvas = page.locator('canvas');

  await canvas.hover({ position: { x: 400, y: 300 } });
  await page.mouse.wheel(0, delta);

  // Allow animation to settle
  await page.waitForTimeout(300);
}

/**
 * Take labeled screenshot
 */
export async function takeScreenshot(
  page: Page,
  label: string,
  options?: { fullPage?: boolean }
): Promise<void> {
  const filename = `/home/kvn/workspace/evolve/repos/ace/docs/screenshots/${label}-${Date.now()}.png`;
  await page.screenshot({
    path: filename,
    fullPage: options?.fullPage ?? false
  });
  console.log(`📸 Screenshot saved: ${filename}`);
}

/**
 * Verify no critical errors occurred
 */
export function assertNoCriticalErrors(monitor: ConsoleMonitor): void {
  const critical = filterCriticalErrors(monitor.errors);

  if (critical.length > 0) {
    console.error('❌ Critical errors detected:');
    critical.forEach(err => console.error(`  - ${err}`));
    throw new Error(`${critical.length} critical errors occurred during test`);
  }
}

/**
 * Wait for network idle (all assets loaded)
 */
export async function waitForNetworkIdle(page: Page, timeout = 30000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Get performance metrics from browser
 */
export async function getPerformanceMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    };
  });
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }, selector);
}

/**
 * Simulate different network conditions
 */
export async function setNetworkConditions(
  page: Page,
  preset: 'fast-3g' | 'slow-3g' | '4g' | 'offline'
): Promise<void> {
  const cdp = await page.context().newCDPSession(page);

  const conditions = {
    'offline': {
      offline: true,
      downloadThroughput: 0,
      uploadThroughput: 0,
      latency: 0
    },
    'slow-3g': {
      offline: false,
      downloadThroughput: 500 * 1024 / 8,
      uploadThroughput: 500 * 1024 / 8,
      latency: 400
    },
    'fast-3g': {
      offline: false,
      downloadThroughput: 1.6 * 1024 * 1024 / 8,
      uploadThroughput: 750 * 1024 / 8,
      latency: 150
    },
    '4g': {
      offline: false,
      downloadThroughput: 4 * 1024 * 1024 / 8,
      uploadThroughput: 3 * 1024 * 1024 / 8,
      latency: 50
    }
  };

  await cdp.send('Network.emulateNetworkConditions', conditions[preset]);
}
