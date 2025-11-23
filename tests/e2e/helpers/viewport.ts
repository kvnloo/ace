import { Page } from '@playwright/test';

/**
 * Viewport and device helper utilities
 */

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  desktopLarge: { width: 1920, height: 1080 },
} as const;

/**
 * Set viewport to specific size
 */
export async function setViewport(
  page: Page,
  viewport: keyof typeof VIEWPORTS
): Promise<void> {
  await page.setViewportSize(VIEWPORTS[viewport]);
}

/**
 * Test responsive behavior across viewports
 */
export async function testAcrossViewports(
  page: Page,
  testFn: (viewport: keyof typeof VIEWPORTS) => Promise<void>
): Promise<void> {
  for (const viewport of Object.keys(VIEWPORTS) as Array<keyof typeof VIEWPORTS>) {
    await setViewport(page, viewport);
    await testFn(viewport);
  }
}

/**
 * Check if element is visible in viewport
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
