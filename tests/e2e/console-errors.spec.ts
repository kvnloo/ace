import { test, expect, Page } from '@playwright/test';

/**
 * Console Error Detection Test Suite
 *
 * Comprehensive tests to detect console errors, warnings, and failed network requests
 * across critical user journeys and page loads.
 */

interface ConsoleMessage {
  type: string;
  text: string;
  url?: string;
  timestamp: Date;
}

interface NetworkFailure {
  url: string;
  status: number;
  statusText: string;
  timestamp: Date;
}

/**
 * Helper to capture console messages
 */
function captureConsoleMessages(page: Page): ConsoleMessage[] {
  const messages: ConsoleMessage[] = [];

  page.on('console', msg => {
    messages.push({
      type: msg.type(),
      text: msg.text(),
      url: msg.location()?.url,
      timestamp: new Date()
    });
  });

  return messages;
}

/**
 * Helper to capture network failures
 */
function captureNetworkFailures(page: Page): NetworkFailure[] {
  const failures: NetworkFailure[] = [];

  page.on('response', response => {
    if (response.status() >= 400) {
      failures.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        timestamp: new Date()
      });
    }
  });

  return failures;
}

/**
 * Helper to filter out expected/acceptable console messages
 */
function filterExpectedMessages(messages: ConsoleMessage[]): ConsoleMessage[] {
  const expectedPatterns = [
    /Download the React DevTools/i,
    /webpack/i, // Development build warnings
  ];

  return messages.filter(msg => {
    return !expectedPatterns.some(pattern => pattern.test(msg.text));
  });
}

test.describe('Console Error Detection - Critical Pages', () => {
  test('Homepage should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow for delayed scripts

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    if (filteredErrors.length > 0) {
      console.log('Console errors found:', filteredErrors);
    }

    expect(filteredErrors, 'Homepage should have no console errors').toHaveLength(0);
    expect(networkFailures, 'Homepage should have no failed network requests').toHaveLength(0);
  });

  test('3D Demo page should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for 3D initialization

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    if (filteredErrors.length > 0) {
      console.log('Console errors found:', filteredErrors);
    }

    expect(filteredErrors, '3D Demo page should have no console errors').toHaveLength(0);
    expect(networkFailures, '3D Demo should have no failed network requests').toHaveLength(0);
  });

  test('About page should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    expect(filteredErrors, 'About page should have no console errors').toHaveLength(0);
    expect(networkFailures, 'About page should have no failed network requests').toHaveLength(0);
  });

  test('Contact page should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    expect(filteredErrors, 'Contact page should have no console errors').toHaveLength(0);
    expect(networkFailures, 'Contact page should have no failed network requests').toHaveLength(0);
  });
});

test.describe('Console Error Detection - User Journeys', () => {
  test('Full navigation journey should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    // Navigate through main pages
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.click('text=About');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.click('text=Contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.click('text=Explore 3D Demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for 3D

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    if (filteredErrors.length > 0) {
      console.log('Console errors during navigation:', filteredErrors);
    }

    expect(filteredErrors, 'Navigation journey should have no console errors').toHaveLength(0);
    expect(networkFailures, 'Navigation should have no failed network requests').toHaveLength(0);
  });

  test('3D interaction journey should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for 3D initialization

    // Interact with canvas
    const canvas = page.locator('canvas');
    if (await canvas.count() > 0) {
      await canvas.click({ position: { x: 100, y: 100 } });
      await page.waitForTimeout(1000);

      // Try dragging
      await canvas.hover({ position: { x: 200, y: 200 } });
      await page.mouse.down();
      await page.mouse.move(300, 300);
      await page.mouse.up();
      await page.waitForTimeout(1000);
    }

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    if (filteredErrors.length > 0) {
      console.log('Console errors during 3D interaction:', filteredErrors);
    }

    expect(filteredErrors, '3D interaction should have no console errors').toHaveLength(0);
    expect(networkFailures, '3D interaction should have no failed network requests').toHaveLength(0);
  });

  test('Form submission journey should have no console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const networkFailures = captureNetworkFailures(page);

    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    // Fill form if exists
    const nameInput = page.locator('input[name="name"], input[type="text"]').first();
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const messageInput = page.locator('textarea, input[name="message"]').first();

    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await messageInput.fill('Test message for console error detection');
      await page.waitForTimeout(1000);
    }

    const errors = messages.filter(m => m.type === 'error');
    const filteredErrors = filterExpectedMessages(errors);

    expect(filteredErrors, 'Form interaction should have no console errors').toHaveLength(0);
    expect(networkFailures, 'Form interaction should have no failed network requests').toHaveLength(0);
  });
});

test.describe('Console Error Detection - Asset Loading', () => {
  test('Asset loading should not produce 404 errors', async ({ page }) => {
    const failed404s: NetworkFailure[] = [];

    page.on('response', response => {
      if (response.status() === 404) {
        failed404s.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000); // Wait for lazy-loaded assets

    if (failed404s.length > 0) {
      console.log('404 errors found:', failed404s);
    }

    expect(failed404s, 'Should have no 404 errors').toHaveLength(0);
  });

  test('JavaScript assets should load without errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);
    const jsFailures: NetworkFailure[] = [];

    page.on('response', response => {
      const url = response.url();
      if ((url.endsWith('.js') || url.includes('.js?')) && !response.ok()) {
        jsFailures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const errors = messages.filter(m => m.type === 'error' && m.text.includes('.js'));

    expect(jsFailures, 'All JavaScript files should load successfully').toHaveLength(0);
    expect(errors, 'No JavaScript loading errors in console').toHaveLength(0);
  });

  test('CSS assets should load without errors', async ({ page }) => {
    const cssFailures: NetworkFailure[] = [];

    page.on('response', response => {
      const url = response.url();
      if ((url.endsWith('.css') || url.includes('.css?')) && !response.ok()) {
        cssFailures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (cssFailures.length > 0) {
      console.log('CSS loading failures:', cssFailures);
    }

    expect(cssFailures, 'All CSS files should load successfully').toHaveLength(0);
  });

  test('Image assets should load without errors', async ({ page }) => {
    const imageFailures: NetworkFailure[] = [];

    page.on('response', response => {
      const url = response.url();
      if (/(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)(\?|$)/i.test(url) && !response.ok()) {
        imageFailures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          timestamp: new Date()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000); // Wait for lazy-loaded images

    if (imageFailures.length > 0) {
      console.log('Image loading failures:', imageFailures);
    }

    expect(imageFailures, 'All images should load successfully').toHaveLength(0);
  });
});

test.describe('Console Error Detection - Warning and Info Messages', () => {
  test('Should not have excessive console warnings', async ({ page }) => {
    const messages = captureConsoleMessages(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const warnings = messages.filter(m => m.type === 'warning');
    const filteredWarnings = filterExpectedMessages(warnings);

    if (filteredWarnings.length > 5) {
      console.log('Excessive warnings found:', filteredWarnings);
    }

    expect(filteredWarnings.length, 'Should have fewer than 5 console warnings').toBeLessThan(5);
  });

  test('3D Demo should not have Three.js warnings', async ({ page }) => {
    const messages = captureConsoleMessages(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    const threeJsWarnings = messages.filter(m =>
      m.type === 'warning' &&
      (m.text.includes('THREE') || m.text.includes('WebGL'))
    );

    if (threeJsWarnings.length > 0) {
      console.log('Three.js warnings found:', threeJsWarnings);
    }

    expect(threeJsWarnings, 'Should have no Three.js or WebGL warnings').toHaveLength(0);
  });
});

test.describe('Console Error Detection - Performance', () => {
  test('Should not have performance degradation warnings', async ({ page }) => {
    const messages = captureConsoleMessages(page);

    await page.goto('/facility-demo');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(30000); // Monitor for 30 seconds

    const performanceWarnings = messages.filter(m =>
      m.text.toLowerCase().includes('performance') ||
      m.text.toLowerCase().includes('slow') ||
      m.text.toLowerCase().includes('memory')
    );

    if (performanceWarnings.length > 0) {
      console.log('Performance warnings found:', performanceWarnings);
    }

    expect(performanceWarnings, 'Should have no performance warnings').toHaveLength(0);
  });
});

test.describe('Console Error Detection - Accessibility', () => {
  test('Should not have accessibility console errors', async ({ page }) => {
    const messages = captureConsoleMessages(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const a11yErrors = messages.filter(m =>
      m.type === 'error' && (
        m.text.toLowerCase().includes('aria') ||
        m.text.toLowerCase().includes('accessibility') ||
        m.text.toLowerCase().includes('a11y')
      )
    );

    if (a11yErrors.length > 0) {
      console.log('Accessibility errors found:', a11yErrors);
    }

    expect(a11yErrors, 'Should have no accessibility console errors').toHaveLength(0);
  });
});
