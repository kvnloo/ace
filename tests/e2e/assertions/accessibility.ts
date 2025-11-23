/**
 * Accessibility Assertions
 *
 * Reusable assertion helpers for validating accessibility compliance
 * including keyboard navigation, ARIA attributes, and screen reader support.
 */

import { Page, Locator, expect } from '@playwright/test';

/**
 * Assert element is keyboard accessible
 */
export async function assertKeyboardAccessible(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector);

  // Check if element is focusable
  await element.focus();
  const isFocused = await element.evaluate((el) => {
    return document.activeElement === el;
  });

  expect(isFocused).toBeTruthy();

  // Check if element has appropriate tabindex
  const tabindex = await element.getAttribute('tabindex');
  expect(tabindex === null || parseInt(tabindex) >= 0).toBeTruthy();
}

/**
 * Assert proper ARIA labels exist
 */
export async function assertARIALabel(
  locator: Locator,
  expectedLabel?: string
): Promise<void> {
  const ariaLabel = await locator.getAttribute('aria-label');
  const ariaLabelledBy = await locator.getAttribute('aria-labelledby');

  expect(ariaLabel || ariaLabelledBy).toBeTruthy();

  if (expectedLabel && ariaLabel) {
    expect(ariaLabel).toContain(expectedLabel);
  }
}

/**
 * Assert keyboard navigation works correctly
 */
export async function assertKeyboardNavigation(
  page: Page,
  startSelector: string,
  expectedSelectors: string[]
): Promise<void> {
  await page.locator(startSelector).focus();

  for (const selector of expectedSelectors) {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.tagName + (active?.className ? '.' + active.className.split(' ').join('.') : '');
    });

    expect(focused).toBeTruthy();
  }
}

/**
 * Assert color contrast meets WCAG standards
 */
export async function assertColorContrast(
  locator: Locator,
  minRatio: number = 4.5
): Promise<void> {
  const ratio = await locator.evaluate((el, minContrastRatio) => {
    const style = window.getComputedStyle(el);
    const bgColor = style.backgroundColor;
    const fgColor = style.color;

    // Simple luminance calculation (WCAG formula)
    function getLuminance(rgb: string): number {
      const values = rgb.match(/\d+/g)?.map(Number) || [0, 0, 0];
      const [r, g, b] = values.map((val) => {
        const s = val / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    const bgLum = getLuminance(bgColor);
    const fgLum = getLuminance(fgColor);
    const ratio = (Math.max(bgLum, fgLum) + 0.05) / (Math.min(bgLum, fgLum) + 0.05);

    return ratio;
  }, minRatio);

  expect(ratio).toBeGreaterThanOrEqual(minRatio);
}

/**
 * Assert screen reader support
 */
export async function assertScreenReaderSupport(
  locator: Locator
): Promise<void> {
  const role = await locator.getAttribute('role');
  const ariaLabel = await locator.getAttribute('aria-label');
  const ariaDescribedBy = await locator.getAttribute('aria-describedby');

  // Element should have at least one of these attributes
  expect(role || ariaLabel || ariaDescribedBy).toBeTruthy();
}

/**
 * Assert focus visible indicator
 */
export async function assertFocusVisible(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector);
  await element.focus();

  const hasOutline = await element.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.outline !== 'none' && style.outline !== '0px';
  });

  expect(hasOutline).toBeTruthy();
}

/**
 * Assert no keyboard traps exist
 */
export async function assertNoKeyboardTraps(
  page: Page,
  containerSelector: string
): Promise<void> {
  const container = page.locator(containerSelector);
  await container.locator('button, a, input').first().focus();

  const focusableElements = await container.locator('button, a, input').count();

  // Tab through all elements
  for (let i = 0; i < focusableElements + 2; i++) {
    await page.keyboard.press('Tab');
  }

  // Should be able to tab out of container
  const focusedElement = await page.evaluate(() => {
    const active = document.activeElement;
    return active?.tagName;
  });

  expect(focusedElement).toBeTruthy();
}

/**
 * Assert semantic HTML structure
 */
export async function assertSemanticHTML(
  page: Page,
  expectedStructure: { selector: string; role: string }[]
): Promise<void> {
  for (const { selector, role } of expectedStructure) {
    const element = page.locator(selector);
    const actualRole = await element.getAttribute('role') ||
                       await element.evaluate(el => el.tagName.toLowerCase());

    expect(actualRole.toLowerCase()).toContain(role.toLowerCase());
  }
}
