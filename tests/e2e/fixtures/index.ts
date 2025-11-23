import { test as base, Page } from '@playwright/test';

/**
 * Custom test fixtures for ACE Facility E2E tests
 * Provides reusable setup and teardown logic
 */

export interface CustomFixtures {
  /**
   * Page with Three.js canvas loaded and ready
   */
  canvasPage: Page;

  /**
   * Page with animations and transitions disabled for faster tests
   */
  staticPage: Page;
}

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Canvas page fixture - ensures Three.js canvas is loaded
   */
  canvasPage: async ({ page }, use) => {
    await page.goto('/');

    // Wait for Three.js canvas to be present
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Wait for WebGL context initialization
    await page.waitForFunction(() => {
      const canvas = document.querySelector('canvas');
      return canvas && (canvas as HTMLCanvasElement).getContext('webgl2') !== null;
    });

    await use(page);
  },

  /**
   * Static page fixture - disables animations for deterministic tests
   */
  staticPage: async ({ page }, use) => {
    // Disable animations and transitions
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });

    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';
