import { Page } from '@playwright/test';

/**
 * Navigation helper utilities for E2E tests
 */

/**
 * Navigate to home page and wait for it to be ready
 */
export async function goToHome(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Wait for Three.js scene to be rendered
 */
export async function waitForScene(page: Page): Promise<void> {
  // Wait for canvas element (any canvas)
  await page.waitForSelector('canvas', { timeout: 10000 });

  // Wait for WebGL context on any canvas
  await page.waitForFunction(() => {
    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
      const gl = (canvas as HTMLCanvasElement).getContext('webgl2');
      if (gl !== null) return true;
    }
    return false;
  }, { timeout: 10000 });

  // Give some time for initial render
  await page.waitForTimeout(1000);
}

/**
 * Check if page has loaded successfully
 */
export async function isPageLoaded(page: Page): Promise<boolean> {
  try {
    await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Reload page and wait for it to be ready
 */
export async function reloadPage(page: Page): Promise<void> {
  await page.reload({ waitUntil: 'networkidle' });
}
