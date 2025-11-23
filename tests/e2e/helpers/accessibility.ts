/**
 * Accessibility Testing Utilities
 *
 * Provides comprehensive WCAG 2.1 AA compliance testing tools:
 * - Axe-core integration for automated accessibility audits
 * - Keyboard navigation testing
 * - Screen reader compatibility validation
 * - Color contrast checking
 * - Focus management verification
 * - ARIA attributes validation
 */

import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility violation found by axe-core
 */
export interface A11yViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

/**
 * Accessibility audit results
 */
export interface A11yAuditResults {
  violations: A11yViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  timestamp: string;
  url: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

/**
 * Keyboard navigation test result
 */
export interface KeyboardNavResult {
  passed: boolean;
  elementsReached: number;
  elementsExpected: number;
  failedElements: string[];
}

/**
 * Run comprehensive axe-core accessibility audit
 *
 * @param page - Playwright page instance
 * @param wcagLevel - WCAG conformance level to test against
 * @returns Detailed audit results
 */
export async function runAccessibilityAudit(
  page: Page,
  wcagLevel: 'A' | 'AA' | 'AAA' = 'AA'
): Promise<A11yAuditResults> {
  // Run axe-core analysis
  const results = await new AxeBuilder({ page })
    .withTags([`wcag2${wcagLevel.toLowerCase()}`, 'best-practice'])
    .analyze();

  return {
    violations: results.violations as A11yViolation[],
    passes: results.passes.length,
    incomplete: results.incomplete.length,
    inapplicable: results.inapplicable.length,
    timestamp: new Date().toISOString(),
    url: page.url(),
    wcagLevel
  };
}

/**
 * Test keyboard navigation through interactive elements
 * Validates that all interactive elements can be reached via Tab key
 */
export async function testKeyboardNavigation(
  page: Page,
  expectedInteractiveElements: number
): Promise<KeyboardNavResult> {
  const focusedElements: string[] = [];
  const failedElements: string[] = [];

  // Get all interactive elements
  const interactiveSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];

  const allInteractive = await page.locator(interactiveSelectors.join(', ')).all();

  // Start from beginning
  await page.keyboard.press('Tab');

  // Tab through elements
  for (let i = 0; i < allInteractive.length + 5; i++) {
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;

      return {
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        ariaLabel: el.getAttribute('aria-label'),
        text: el.textContent?.substring(0, 50)
      };
    });

    if (focused) {
      const elementId = `${focused.tagName}#${focused.id || focused.className}`;
      if (!focusedElements.includes(elementId)) {
        focusedElements.push(elementId);
      }
    }

    await page.keyboard.press('Tab');
    await page.waitForTimeout(100); // Small delay for focus to settle
  }

  // Check for elements that should be focusable but weren't reached
  for (const element of allInteractive) {
    const isVisible = await element.isVisible();
    if (isVisible) {
      const isFocusable = await element.evaluate((el) => {
        const tabindex = el.getAttribute('tabindex');
        return tabindex !== '-1';
      });

      if (isFocusable) {
        const elementInfo = await element.evaluate((el) =>
          `${el.tagName}#${el.id || el.className}`
        );

        if (!focusedElements.includes(elementInfo)) {
          failedElements.push(elementInfo);
        }
      }
    }
  }

  return {
    passed: failedElements.length === 0,
    elementsReached: focusedElements.length,
    elementsExpected: expectedInteractiveElements,
    failedElements
  };
}

/**
 * Test specific keyboard shortcuts and interactions
 */
export async function testKeyboardShortcuts(page: Page): Promise<void> {
  // Test Escape key (should close modals)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Test Enter key on focused buttons
  const firstButton = page.locator('button').first();
  if (await firstButton.isVisible()) {
    await firstButton.focus();
    await page.keyboard.press('Enter');
  }

  // Test Space key on checkboxes/buttons
  await page.keyboard.press('Space');
  await page.waitForTimeout(300);
}

/**
 * Verify ARIA labels and roles are properly set
 */
export async function validateARIAAttributes(page: Page): Promise<{
  passed: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  // Check for buttons without accessible names
  const buttonsWithoutLabels = await page.locator('button:not([aria-label]):not([aria-labelledby])').filter({
    hasText: /^$/
  }).count();

  if (buttonsWithoutLabels > 0) {
    issues.push(`Found ${buttonsWithoutLabels} buttons without accessible names`);
  }

  // Check for images without alt text
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  if (imagesWithoutAlt > 0) {
    issues.push(`Found ${imagesWithoutAlt} images without alt text`);
  }

  // Check for form inputs without labels
  const inputsWithoutLabels = await page.locator('input:not([aria-label]):not([aria-labelledby])').filter({
    has: page.locator(':not(label)')
  }).count();

  if (inputsWithoutLabels > 0) {
    issues.push(`Found ${inputsWithoutLabels} inputs without labels`);
  }

  // Check for proper heading hierarchy
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  let lastLevel = 0;

  for (const heading of headings) {
    const tagName = await heading.evaluate(el => el.tagName);
    const level = parseInt(tagName.substring(1));

    if (level > lastLevel + 1) {
      issues.push(`Heading hierarchy skip: ${tagName} after H${lastLevel}`);
    }

    lastLevel = level;
  }

  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Test color contrast ratios (WCAG AA requires 4.5:1 for normal text)
 */
export async function validateColorContrast(page: Page): Promise<{
  passed: boolean;
  violations: Array<{ element: string; ratio: number; required: number }>;
}> {
  const violations = await page.evaluate(() => {
    const issues: Array<{ element: string; ratio: number; required: number }> = [];

    // Helper to calculate relative luminance
    function getLuminance(r: number, g: number, b: number): number {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    // Helper to calculate contrast ratio
    function getContrastRatio(lum1: number, lum2: number): number {
      const lighter = Math.max(lum1, lum2);
      const darker = Math.min(lum1, lum2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    // Check all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button, label');

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const bgColor = styles.backgroundColor;

      // Parse RGB values
      const colorMatch = color.match(/\d+/g);
      const bgMatch = bgColor.match(/\d+/g);

      if (colorMatch && bgMatch) {
        const [r1, g1, b1] = colorMatch.map(Number);
        const [r2, g2, b2] = bgMatch.map(Number);

        const lum1 = getLuminance(r1, g1, b1);
        const lum2 = getLuminance(r2, g2, b2);
        const ratio = getContrastRatio(lum1, lum2);

        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;
        const isLarge = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
        const required = isLarge ? 3 : 4.5;

        if (ratio < required) {
          issues.push({
            element: element.tagName + (element.id ? `#${element.id}` : ''),
            ratio: parseFloat(ratio.toFixed(2)),
            required
          });
        }
      }
    });

    return issues;
  });

  return {
    passed: violations.length === 0,
    violations
  };
}

/**
 * Test screen reader compatibility
 * Validates that screen readers can properly navigate the page
 */
export async function testScreenReaderCompatibility(page: Page): Promise<{
  passed: boolean;
  landmarks: string[];
  regions: string[];
  issues: string[];
}> {
  const landmarks = await page.locator('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]').allTextContents();

  const regions = await page.locator('[role], [aria-label], [aria-labelledby]').count();

  const issues: string[] = [];

  // Check for main landmark
  const hasMain = await page.locator('[role="main"], main').count() > 0;
  if (!hasMain) {
    issues.push('Missing main landmark');
  }

  // Check for skip links
  const hasSkipLink = await page.locator('a[href^="#"]').first().textContent();
  if (!hasSkipLink?.toLowerCase().includes('skip')) {
    issues.push('Missing skip navigation link');
  }

  return {
    passed: issues.length === 0,
    landmarks,
    regions: [`${regions} regions with ARIA labels`],
    issues
  };
}

/**
 * Test focus management (focus should be visible and logical)
 */
export async function testFocusManagement(page: Page): Promise<{
  passed: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  // Check if focus is visible
  const focusVisible = await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = ':focus { outline: none; }';
    document.head.appendChild(style);

    const button = document.querySelector('button');
    if (button) {
      button.focus();
      const outline = window.getComputedStyle(button).outline;
      return outline !== 'none';
    }
    return false;
  });

  if (!focusVisible) {
    issues.push('Focus indicators may not be visible');
  }

  // Check focus trap in modals
  const modalCount = await page.locator('[role="dialog"], [role="modal"]').count();
  if (modalCount > 0) {
    // Tab through modal - focus should stay within
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const focusedInModal = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"], [role="modal"]');
        return modal?.contains(document.activeElement);
      });

      if (!focusedInModal) {
        issues.push('Focus escaped from modal dialog');
        break;
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Generate comprehensive accessibility report
 */
export function generateAccessibilityReport(
  auditResults: A11yAuditResults,
  keyboardNav: KeyboardNavResult,
  ariaValidation: { passed: boolean; issues: string[] },
  colorContrast: { passed: boolean; violations: any[] }
): string {
  const criticalCount = auditResults.violations.filter(v => v.impact === 'critical').length;
  const seriousCount = auditResults.violations.filter(v => v.impact === 'serious').length;

  return `
Accessibility Audit Report
===========================
Date: ${auditResults.timestamp}
URL: ${auditResults.url}
WCAG Level: ${auditResults.wcagLevel}

SUMMARY
-------
Total Violations: ${auditResults.violations.length} ${auditResults.violations.length === 0 ? '✅' : '❌'}
  Critical: ${criticalCount}
  Serious: ${seriousCount}
  Moderate: ${auditResults.violations.filter(v => v.impact === 'moderate').length}
  Minor: ${auditResults.violations.filter(v => v.impact === 'minor').length}

Passed Checks: ${auditResults.passes} ✅
Incomplete: ${auditResults.incomplete}

KEYBOARD NAVIGATION
-------------------
Status: ${keyboardNav.passed ? '✅ PASSED' : '❌ FAILED'}
Elements Reached: ${keyboardNav.elementsReached}/${keyboardNav.elementsExpected}
${keyboardNav.failedElements.length > 0 ? `Failed Elements: ${keyboardNav.failedElements.join(', ')}` : ''}

ARIA VALIDATION
---------------
Status: ${ariaValidation.passed ? '✅ PASSED' : '❌ FAILED'}
${ariaValidation.issues.length > 0 ? `Issues:\n${ariaValidation.issues.map(i => `  - ${i}`).join('\n')}` : ''}

COLOR CONTRAST
--------------
Status: ${colorContrast.passed ? '✅ PASSED' : '❌ FAILED'}
${colorContrast.violations.length > 0 ? `Violations: ${colorContrast.violations.length}` : ''}

${auditResults.violations.length > 0 ? `
DETAILED VIOLATIONS
-------------------
${auditResults.violations.slice(0, 5).map(v => `
${v.impact.toUpperCase()}: ${v.id}
Description: ${v.description}
Help: ${v.help}
URL: ${v.helpUrl}
Affected Elements: ${v.nodes.length}
`).join('\n')}
` : ''}

WCAG 2.1 ${auditResults.wcagLevel} Compliance: ${auditResults.violations.length === 0 ? '✅ PASSED' : '❌ FAILED'}
  `.trim();
}
