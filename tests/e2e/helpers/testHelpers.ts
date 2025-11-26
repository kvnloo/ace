import { Page, expect } from '@playwright/test';

/**
 * Test helper utilities
 */

/**
 * Wait for WebGL context to be ready
 */
export async function waitForWebGL(page: Page, canvasSelector: string, timeout: number = 5000) {
  await page.waitForFunction(
    (selector) => {
      const canvas = document.querySelector(selector) as HTMLCanvasElement;
      if (!canvas) return false;
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return gl !== null;
    },
    canvasSelector,
    { timeout }
  );
}

/**
 * Wait for 3D scene to render (check for non-empty canvas)
 */
export async function waitFor3DRender(page: Page, canvasSelector: string, timeout: number = 5000) {
  await page.waitForFunction(
    (selector) => {
      const canvas = document.querySelector(selector) as HTMLCanvasElement;
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // Check if canvas has non-transparent pixels
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] !== 0) return true;
      }
      return false;
    },
    canvasSelector,
    { timeout }
  );
}

/**
 * Mock API endpoint with response
 */
export async function mockAPI(page: Page, endpoint: string | RegExp, response: any, status: number = 200, delay: number = 0) {
  await page.route(endpoint, async (route) => {
    if (delay > 0) {
      await page.waitForTimeout(delay);
    }
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Simulate API error
 */
export async function simulateAPIError(page: Page, endpoint: string | RegExp, errorCode: number = 500) {
  await page.route(endpoint, async (route) => {
    await route.fulfill({
      status: errorCode,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });
}

/**
 * Wait for element with retry
 */
export async function waitForElementWithRetry(
  page: Page,
  selector: string,
  maxRetries: number = 3,
  timeout: number = 5000
) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout });
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(1000);
    }
  }
  throw lastError;
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
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Measure page load performance
 */
export async function measurePerformance(page: Page) {
  return await page.evaluate(() => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const connectTime = perfData.responseEnd - perfData.requestStart;
    const renderTime = perfData.domComplete - perfData.domLoading;

    return {
      pageLoadTime,
      connectTime,
      renderTime,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart
    };
  });
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 5000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Take accessibility snapshot
 */
export async function checkAccessibility(page: Page) {
  const accessibilityTree = await page.accessibility.snapshot();
  return accessibilityTree;
}

/**
 * Verify console has no errors
 */
export async function verifyNoConsoleErrors(page: Page, allowedErrors: string[] = []) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!allowedErrors.some(allowed => text.includes(allowed))) {
        errors.push(text);
      }
    }
  });
  return errors;
}
