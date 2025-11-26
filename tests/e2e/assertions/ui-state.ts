/**
 * UI State Assertions
 *
 * Reusable assertion helpers for validating UI state changes
 * and component behavior in E2E tests.
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * Assert element is visible and stable
 */
export async function assertElementVisible(
  locator: Locator,
  timeout: number = 5000
): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
  await expect(locator).toHaveCount(1);
}

/**
 * Assert slider value matches expected
 */
export async function assertSliderValue(
  slider: Locator,
  expectedValue: number,
  tolerance: number = 1
): Promise<void> {
  const value = await slider.inputValue();
  const numValue = parseFloat(value);
  expect(Math.abs(numValue - expectedValue)).toBeLessThanOrEqual(tolerance);
}

/**
 * Assert active state of button or control
 */
export async function assertActiveState(
  element: Locator,
  shouldBeActive: boolean
): Promise<void> {
  const classes = await element.getAttribute('class');
  const isActive = classes?.includes('active') || classes?.includes('bg-white/20');

  if (shouldBeActive) {
    expect(isActive).toBeTruthy();
  } else {
    expect(isActive).toBeFalsy();
  }
}

/**
 * Assert text content matches pattern
 */
export async function assertTextMatches(
  locator: Locator,
  pattern: string | RegExp
): Promise<void> {
  if (typeof pattern === 'string') {
    await expect(locator).toContainText(pattern);
  } else {
    const text = await locator.textContent();
    expect(text).toMatch(pattern);
  }
}

/**
 * Assert data refresh occurred
 */
export async function assertDataRefreshed(
  page: Page,
  dataSelector: string,
  refreshInterval: number = 5000
): Promise<void> {
  const initialData = await page.locator(dataSelector).textContent();
  await page.waitForTimeout(refreshInterval + 500);
  const updatedData = await page.locator(dataSelector).textContent();

  expect(initialData).not.toBe(updatedData);
}

/**
 * Assert localStorage persistence
 */
export async function assertLocalStoragePersistence(
  page: Page,
  key: string,
  expectedValue: any
): Promise<void> {
  const storedValue = await page.evaluate((storageKey) => {
    const item = localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : null;
  }, key);

  expect(storedValue).toEqual(expectedValue);
}

/**
 * Assert element count
 */
export async function assertElementCount(
  locator: Locator,
  expectedCount: number
): Promise<void> {
  await expect(locator).toHaveCount(expectedCount);
}

/**
 * Assert CSS property value
 */
export async function assertCSSProperty(
  locator: Locator,
  property: string,
  expectedValue: string | RegExp
): Promise<void> {
  const value = await locator.evaluate((el, prop) => {
    return window.getComputedStyle(el).getPropertyValue(prop);
  }, property);

  if (typeof expectedValue === 'string') {
    expect(value).toBe(expectedValue);
  } else {
    expect(value).toMatch(expectedValue);
  }
}

/**
 * Assert animation completed
 */
export async function assertAnimationCompleted(
  page: Page,
  element: Locator,
  timeout: number = 2000
): Promise<void> {
  await page.waitForTimeout(100); // Wait for animation to start

  const isAnimating = await element.evaluate((el) => {
    const animations = el.getAnimations();
    return animations.length > 0;
  });

  expect(isAnimating).toBeTruthy();

  await page.waitForTimeout(timeout);

  const animationFinished = await element.evaluate((el) => {
    const animations = el.getAnimations();
    return animations.every((anim) => anim.playState === 'finished' || anim.playState === 'idle');
  });

  expect(animationFinished).toBeTruthy();
}

/**
 * Assert attribute value
 */
export async function assertAttributeValue(
  locator: Locator,
  attribute: string,
  expectedValue: string | RegExp
): Promise<void> {
  const value = await locator.getAttribute(attribute);

  if (typeof expectedValue === 'string') {
    expect(value).toBe(expectedValue);
  } else {
    expect(value).toMatch(expectedValue);
  }
}

/**
 * Assert element has focus
 */
export async function assertHasFocus(locator: Locator): Promise<void> {
  const isFocused = await locator.evaluate((el) => {
    return document.activeElement === el;
  });

  expect(isFocused).toBeTruthy();
}

/**
 * Assert real-time update within timeframe
 */
export async function assertRealTimeUpdate(
  page: Page,
  selector: string,
  maxWaitTime: number = 6000
): Promise<void> {
  const initialContent = await page.locator(selector).textContent();
  const startTime = Date.now();

  let updated = false;
  while (Date.now() - startTime < maxWaitTime && !updated) {
    await page.waitForTimeout(1000);
    const currentContent = await page.locator(selector).textContent();
    updated = currentContent !== initialContent;
  }

  expect(updated).toBeTruthy();
  expect(Date.now() - startTime).toBeLessThan(maxWaitTime);
}
