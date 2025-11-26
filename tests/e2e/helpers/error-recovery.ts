import { Page, expect } from '@playwright/test';

/**
 * Error Recovery Testing Utilities
 *
 * Helper functions for testing error scenarios and user feedback
 */

/**
 * Simulate network failure for specific resource types
 */
export async function simulateNetworkFailure(
  page: Page,
  resourceTypes: ('image' | 'font' | 'script' | 'stylesheet' | 'document' | 'xhr' | 'fetch' | 'other')[]
): Promise<void> {
  await page.route('**/*', (route) => {
    if (resourceTypes.includes(route.request().resourceType() as any)) {
      route.abort('failed');
    } else {
      route.continue();
    }
  });
}

/**
 * Simulate asset 404 errors for specific file patterns
 */
export async function simulateAsset404(
  page: Page,
  patterns: string[]
): Promise<void> {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    const shouldFail = patterns.some(pattern => url.includes(pattern));

    if (shouldFail) {
      route.fulfill({
        status: 404,
        contentType: 'text/plain',
        body: 'Not Found',
      });
    } else {
      route.continue();
    }
  });
}

/**
 * Simulate slow loading for specific resources
 */
export async function simulateSlowLoading(
  page: Page,
  patterns: string[],
  delayMs: number
): Promise<void> {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    const shouldDelay = patterns.some(pattern => url.includes(pattern));

    if (shouldDelay) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    route.continue();
  });
}

/**
 * Disable WebGL support
 */
export async function disableWebGL(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (contextType: string, ...args: any[]) {
      if (contextType === 'webgl' || contextType === 'webgl2') {
        return null;
      }
      return getContext.apply(this, [contextType, ...args]);
    };
  });
}

/**
 * Trigger WebGL context loss
 */
export async function triggerWebGLContextLoss(page: Page): Promise<void> {
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const gl = canvas.getContext('webgl2');
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.loseContext();
        }
      }
    }
  });
}

/**
 * Restore WebGL context after loss
 */
export async function restoreWebGLContext(page: Page): Promise<void> {
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const gl = canvas.getContext('webgl2');
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.restoreContext();
        }
      }
    }
  });
}

/**
 * Inject JavaScript error during page load
 */
export async function injectLoadError(page: Page, errorMessage: string): Promise<void> {
  await page.addInitScript((msg) => {
    setTimeout(() => {
      throw new Error(msg);
    }, 100);
  }, errorMessage);
}

/**
 * Check if error message is user-friendly
 */
export function isUserFriendlyError(message: string): boolean {
  // User-friendly errors should:
  // 1. Not contain technical stack traces
  // 2. Not contain raw error codes
  // 3. Be human-readable

  const technicalPatterns = [
    /undefined is not a function/i,
    /cannot read property.*of null/i,
    /cannot read property.*of undefined/i,
    /ERR_[A-Z_]+/,
    /at Object\./,
    /at Function\./,
    /at HTMLElement\./,
    /webpack:/,
    /node_modules/,
  ];

  return !technicalPatterns.some(pattern => pattern.test(message));
}

/**
 * Verify page shows meaningful content (not blank)
 */
export async function expectMeaningfulContent(page: Page): Promise<void> {
  // Check background is not white
  const bgColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });

  expect(bgColor).not.toBe('rgb(255, 255, 255)');
  expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');

  // Check has visible text
  const bodyText = await page.textContent('body');
  expect(bodyText).toBeTruthy();
  expect(bodyText!.trim().length).toBeGreaterThan(20);

  // Check has interactive elements
  const buttons = await page.locator('button').count();
  expect(buttons).toBeGreaterThan(0);
}

/**
 * Verify error boundary is working
 */
export async function expectErrorBoundary(page: Page): Promise<void> {
  const bodyText = await page.textContent('body');

  // Should show error boundary UI
  const hasErrorUI = bodyText && (
    bodyText.toLowerCase().includes('error') ||
    bodyText.toLowerCase().includes('something went wrong') ||
    bodyText.toLowerCase().includes('reload') ||
    bodyText.toLowerCase().includes('try again')
  );

  expect(hasErrorUI).toBeTruthy();

  // Should have reload/retry button
  const buttons = page.locator('button');
  const buttonTexts = await buttons.allTextContents();

  const hasActionButton = buttonTexts.some((text) =>
    text.toLowerCase().includes('reload') ||
    text.toLowerCase().includes('refresh') ||
    text.toLowerCase().includes('try again') ||
    text.toLowerCase().includes('retry') ||
    text.toLowerCase().includes('home')
  );

  expect(hasActionButton).toBeTruthy();
}

/**
 * Verify loading timeout handling
 */
export async function expectTimeoutHandling(
  page: Page,
  maxWaitMs: number = 10000
): Promise<void> {
  const startTime = Date.now();

  // Wait for timeout period
  await page.waitForTimeout(maxWaitMs);

  const elapsed = Date.now() - startTime;

  // Should show timeout message or loading indicator
  const bodyText = await page.textContent('body');

  const hasTimeoutUI = bodyText && (
    bodyText.toLowerCase().includes('loading') ||
    bodyText.toLowerCase().includes('wait') ||
    bodyText.toLowerCase().includes('timeout') ||
    bodyText.toLowerCase().includes('taking longer') ||
    bodyText.toLowerCase().includes('slow')
  );

  // Page should remain interactive
  const isInteractive = await page.evaluate(() => {
    return document.readyState === 'complete';
  });

  expect(isInteractive).toBeTruthy();

  // Should have some visual feedback
  if (!hasTimeoutUI) {
    // At minimum, check for loading spinner or progress indicator
    const hasLoadingUI = await page.locator('[role="progressbar"], .loading, .spinner').count();
    expect(hasLoadingUI).toBeGreaterThan(0);
  }
}

/**
 * Collect console errors
 */
export async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

/**
 * Collect JavaScript errors
 */
export async function collectJavaScriptErrors(page: Page): Promise<Error[]> {
  const errors: Error[] = [];

  page.on('pageerror', (error) => {
    errors.push(error);
  });

  return errors;
}

/**
 * Verify graceful degradation
 * App should work with reduced functionality instead of breaking
 */
export async function expectGracefulDegradation(page: Page): Promise<void> {
  // Page should be visible
  const body = page.locator('body');
  await expect(body).toBeVisible();

  // Should have meaningful content
  await expectMeaningfulContent(page);

  // Should be interactive
  const isInteractive = await page.evaluate(() => {
    return document.readyState === 'complete';
  });
  expect(isInteractive).toBeTruthy();

  // Should have navigation available
  const buttons = await page.locator('button').count();
  expect(buttons).toBeGreaterThan(0);

  // Should not show blank/broken screen
  const bodyText = await page.textContent('body');
  expect(bodyText!.trim().length).toBeGreaterThan(50);
}

/**
 * Verify app remains functional after error
 */
export async function expectAppRemainsFunctional(page: Page): Promise<void> {
  // Check DOM is complete
  const readyState = await page.evaluate(() => document.readyState);
  expect(readyState).toBe('complete');

  // Check can still click buttons
  const firstButton = page.locator('button').first();
  const isClickable = await firstButton.isVisible().catch(() => false);
  expect(isClickable).toBeTruthy();

  // Check no white screen
  const bgColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  expect(bgColor).not.toBe('rgb(255, 255, 255)');

  // Check has content
  const bodyText = await page.textContent('body');
  expect(bodyText!.trim().length).toBeGreaterThan(10);
}

/**
 * Simulate and verify retry mechanism
 */
export async function testRetryMechanism(
  page: Page,
  pattern: string,
  maxRetries: number = 3
): Promise<number> {
  let attemptCount = 0;

  await page.route('**/*', (route) => {
    const url = route.request().url();

    if (url.includes(pattern)) {
      attemptCount++;

      if (attemptCount <= maxRetries) {
        route.abort('failed');
      } else {
        route.continue();
      }
    } else {
      route.continue();
    }
  });

  return attemptCount;
}

/**
 * Verify error message quality standards
 */
export async function expectQualityErrorMessage(page: Page): Promise<void> {
  const bodyText = await page.textContent('body');
  expect(bodyText).toBeTruthy();

  // Should be human-readable
  expect(isUserFriendlyError(bodyText!)).toBeTruthy();

  // Should not be empty or too short
  expect(bodyText!.trim().length).toBeGreaterThan(10);

  // Should not expose technical details
  expect(bodyText).not.toContain('node_modules');
  expect(bodyText).not.toContain('webpack');
  expect(bodyText).not.toContain('undefined is not');
  expect(bodyText).not.toContain('Cannot read property');
}
