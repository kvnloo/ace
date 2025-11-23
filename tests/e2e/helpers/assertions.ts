import { Page, expect } from '@playwright/test';

/**
 * Custom assertion helpers for ACE Facility tests
 */

/**
 * Assert that Three.js canvas is rendered
 */
export async function expectCanvasRendered(page: Page): Promise<void> {
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Check WebGL context exists
  const hasWebGL = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return canvas && (canvas as HTMLCanvasElement).getContext('webgl2') !== null;
  });

  expect(hasWebGL).toBeTruthy();
}

/**
 * Assert page has no console errors
 */
export async function expectNoConsoleErrors(page: Page): Promise<void> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  // Give some time for errors to appear
  await page.waitForTimeout(1000);

  expect(errors).toHaveLength(0);
}

/**
 * Assert element has specific CSS property value
 */
export async function expectCSSProperty(
  page: Page,
  selector: string,
  property: string,
  value: string | RegExp
): Promise<void> {
  const actualValue = await page.evaluate(
    ({ sel, prop }) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      return window.getComputedStyle(element).getPropertyValue(prop);
    },
    { sel: selector, prop: property }
  );

  if (typeof value === 'string') {
    expect(actualValue).toBe(value);
  } else {
    expect(actualValue).toMatch(value);
  }
}

/**
 * Assert page has valid accessibility
 */
export async function expectAccessible(page: Page): Promise<void> {
  // Check for basic accessibility features
  const hasLandmarks = await page.evaluate(() => {
    return document.querySelectorAll('[role="main"], main').length > 0;
  });

  expect(hasLandmarks).toBeTruthy();
}
