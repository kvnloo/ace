# End-to-End Testing Guide

This guide covers the Playwright E2E testing setup for the LawnTech Dynamics project.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

## Overview

The E2E test suite uses [Playwright](https://playwright.dev/) to test the application from a user's perspective. Tests are written in TypeScript and cover:

- Homepage functionality
- Navigation between views
- 3D demo interactions
- Responsive design (mobile and desktop)
- Browser compatibility (Chromium, Firefox, WebKit)

### Test Coverage

| Test File | Description | Test Count |
|-----------|-------------|------------|
| `homepage.spec.ts` | Homepage loading, hero section, CTAs, statistics | 11 tests |
| `navigation.spec.ts` | Navigation between views, mobile menu, routing | 13 tests |
| `3d-demo.spec.ts` | 3D scene loading, floor controls, camera interaction | 14 tests |

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Project dependencies installed

### Installation

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps
   ```

   This command installs Chromium, Firefox, and WebKit browsers needed for testing.

### Verify Installation

Check that Playwright is correctly installed:
```bash
npx playwright --version
```

## Running Tests

### All Tests (Headless Mode)

Run all E2E tests across all configured browsers:
```bash
npm run test:e2e
```

### Interactive UI Mode

Run tests with Playwright's interactive UI:
```bash
npm run test:e2e:ui
```

This opens a UI where you can:
- Select which tests to run
- Watch tests execute in real-time
- Debug failed tests
- View trace files

### Headed Mode (Watch Browser)

Run tests with visible browser windows:
```bash
npm run test:e2e:headed
```

### Browser-Specific Tests

Run tests on a specific browser:

```bash
# Chromium only
npm run test:e2e:chromium

# Firefox only
npm run test:e2e:firefox

# WebKit/Safari only
npm run test:e2e:webkit
```

### Mobile Device Testing

Run tests on mobile viewports:
```bash
npm run test:e2e:mobile
```

This runs tests on:
- Pixel 5 (Mobile Chrome)
- iPhone 12 (Mobile Safari)

### Debug Mode

Run tests in debug mode with step-through debugging:
```bash
npm run test:e2e:debug
```

### Single Test File

Run a specific test file:
```bash
npx playwright test e2e/homepage.spec.ts
```

### Single Test

Run a specific test by name:
```bash
npx playwright test -g "should load successfully"
```

### View Test Report

After running tests, view the HTML report:
```bash
npm run test:e2e:report
```

## Test Structure

```
/home/user/ace/
├── e2e/                          # E2E test directory
│   ├── homepage.spec.ts          # Homepage tests
│   ├── navigation.spec.ts        # Navigation tests
│   └── 3d-demo.spec.ts          # 3D demo interaction tests
├── playwright.config.ts          # Playwright configuration
└── E2E_TESTING.md               # This guide
```

## Configuration

### Playwright Config (`playwright.config.ts`)

Key configuration options:

```typescript
{
  testDir: './e2e',                    // Test directory
  baseURL: 'http://localhost:3000',    // Base URL for tests
  fullyParallel: true,                 // Run tests in parallel
  retries: process.env.CI ? 2 : 0,     // Retry on CI
  use: {
    trace: 'on-first-retry',           // Trace on retry
    screenshot: 'only-on-failure',     // Screenshots on failure
    video: 'retain-on-failure',        // Videos on failure
  }
}
```

### Browser Projects

Tests run on multiple browser configurations:

1. **Desktop Browsers:**
   - Chromium (Chrome/Edge)
   - Firefox
   - WebKit (Safari)

2. **Mobile Devices:**
   - Mobile Chrome (Pixel 5 viewport)
   - Mobile Safari (iPhone 12 viewport)

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test logic here
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Common Patterns

#### Waiting for Network Idle

```typescript
await page.waitForLoadState('networkidle');
```

#### Checking Element Visibility

```typescript
await expect(page.locator('text=Hello')).toBeVisible();
```

#### Clicking Elements

```typescript
await page.locator('button:has-text("Click Me")').click();
```

#### Mobile-Specific Tests

```typescript
test('mobile test', async ({ page, isMobile }) => {
  if (isMobile) {
    // Mobile-specific logic
  }
});
```

#### Waiting for Animations

```typescript
await page.waitForTimeout(500); // Wait for animation
```

### Selectors

Playwright supports various selector strategies:

```typescript
// Text selector
page.locator('text=Welcome')

// CSS selector
page.locator('.button-class')

// Button with text
page.locator('button:has-text("Submit")')

// nth element
page.locator('button').first()
page.locator('button').nth(2)

// Filtering
page.locator('button').filter({ hasText: 'Submit' })
```

## Best Practices

### 1. Use Data Test IDs (Recommended)

Add `data-testid` attributes to important elements:

```tsx
<button data-testid="cta-explore">Explore 3D Demo</button>
```

```typescript
await page.locator('[data-testid="cta-explore"]').click();
```

### 2. Avoid Hard-Coded Waits

Instead of:
```typescript
await page.waitForTimeout(5000); // ❌ Bad
```

Use:
```typescript
await page.waitForLoadState('networkidle'); // ✅ Good
await expect(element).toBeVisible({ timeout: 5000 }); // ✅ Good
```

### 3. Keep Tests Independent

Each test should be able to run independently:
```typescript
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/');
});
```

### 4. Use Descriptive Test Names

```typescript
// ❌ Bad
test('test 1', async ({ page }) => { });

// ✅ Good
test('should display hero section with main heading', async ({ page }) => { });
```

### 5. Handle Errors Gracefully

```typescript
const errors: string[] = [];

page.on('console', (msg) => {
  if (msg.type() === 'error') {
    errors.push(msg.text());
  }
});

// Filter known acceptable errors
const criticalErrors = errors.filter(e => !e.includes('API_KEY'));
expect(criticalErrors).toHaveLength(0);
```

### 6. Test Responsiveness

```typescript
test('should be responsive', async ({ page, isMobile }) => {
  if (isMobile) {
    // Mobile-specific assertions
  } else {
    // Desktop-specific assertions
  }
});
```

## Debugging

### Visual Debugging

1. **Run in headed mode:**
   ```bash
   npm run test:e2e:headed
   ```

2. **Use debug mode:**
   ```bash
   npm run test:e2e:debug
   ```

3. **View traces:**
   ```bash
   npx playwright show-trace trace.zip
   ```

### Console Logs

Add console logs in tests:
```typescript
console.log('Current URL:', page.url());
console.log('Element text:', await element.textContent());
```

### Screenshots

Take manual screenshots:
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Pause Execution

Pause test execution:
```typescript
await page.pause();
```

## Performance

### Fast Test Execution

- Tests run in parallel by default
- Use `fullyParallel: true` in config
- Skip unnecessary waits

### Test Isolation

Each test gets a fresh browser context, ensuring isolation.

## Troubleshooting

### Issue: Tests Fail to Start Dev Server

**Solution:** Make sure the dev server is not already running:
```bash
# Kill existing dev server
pkill -f "vite"

# Run tests again
npm run test:e2e
```

### Issue: WebGL/Canvas Tests Fail

**Solution:** Ensure browsers are properly installed:
```bash
npx playwright install --with-deps chromium
```

### Issue: Timeout Errors

**Solution:** Increase timeout in test:
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Issue: Element Not Found

**Solution:** Wait for element to be visible:
```typescript
await page.waitForSelector('text=Element', { state: 'visible' });
```

### Issue: Tests Pass Locally but Fail on CI

**Solution:**
- Ensure browsers are installed in CI
- Use `retries: 2` in CI environment
- Check for timing issues (increase timeouts)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables

Set base URL for different environments:
```bash
BASE_URL=https://staging.example.com npm run test:e2e
```

## Continuous Improvement

### Adding New Tests

1. Create a new `.spec.ts` file in `/e2e/`
2. Follow the existing test structure
3. Run the new test: `npx playwright test e2e/your-test.spec.ts`
4. Update this documentation

### Test Maintenance

- Review failing tests regularly
- Update selectors when UI changes
- Keep tests fast and focused
- Remove redundant tests

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Test Assertions](https://playwright.dev/docs/test-assertions)

## Support

For questions or issues:
1. Check the [Playwright Discord](https://discord.gg/playwright)
2. Review [Playwright GitHub Issues](https://github.com/microsoft/playwright/issues)
3. Consult the team's internal documentation

---

**Last Updated:** 2025-11-23
**Playwright Version:** 1.49.1
