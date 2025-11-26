# E2E Testing Setup Guide

## Overview

This document describes the End-to-End (E2E) testing infrastructure for the ACE Facility project using Playwright.

## Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Open Playwright UI for interactive testing
npm run test:e2e:ui

# View test report
npm run test:e2e:report
```

## Project Structure

```
tests/e2e/
├── fixtures/          # Custom test fixtures
│   └── index.ts       # Canvas and page fixtures
├── helpers/           # Reusable test utilities
│   ├── assertions.ts  # Custom assertions
│   ├── navigation.ts  # Navigation helpers
│   ├── viewport.ts    # Viewport utilities
│   └── index.ts       # Centralized exports
├── setup/             # Global setup and teardown
│   ├── global-setup.ts
│   └── global-teardown.ts
├── critical/          # Critical path smoke tests
├── screenshots/       # Visual regression tests
└── smoke.spec.ts      # Basic smoke tests
```

## Configuration

### Playwright Config (`playwright.config.ts`)

The configuration includes:

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL**: `http://localhost:3000`
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Enabled for faster execution
- **Web Server**: Automatically starts dev server before tests

### Environment Variables

```bash
# Set to true in CI environments
CI=true

# Override base URL
BASE_URL=http://localhost:3000
```

## Available Test Scripts

| Script | Description |
|--------|-------------|
| `test:e2e` | Run all tests (headless) |
| `test:e2e:headed` | Run with visible browser |
| `test:e2e:debug` | Run in debug mode with step-through |
| `test:e2e:ui` | Open Playwright UI for interactive testing |
| `test:e2e:report` | View HTML test report |
| `test:e2e:chromium` | Run tests in Chromium only |
| `test:e2e:firefox` | Run tests in Firefox only |
| `test:e2e:webkit` | Run tests in WebKit only |

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from './fixtures';
import { goToHome, waitForScene } from './helpers';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await goToHome(page);
    // Test logic here
    await expect(page).toHaveTitle(/Expected Title/);
  });
});
```

### Using Custom Fixtures

```typescript
test('should render canvas', async ({ canvasPage }) => {
  // canvasPage fixture automatically loads and waits for Three.js
  const canvas = canvasPage.locator('canvas');
  await expect(canvas).toBeVisible();
});
```

### Using Helpers

```typescript
import {
  goToHome,
  waitForScene,
  expectCanvasRendered,
  setViewport,
  VIEWPORTS
} from './helpers';

test('should work on mobile', async ({ page }) => {
  await setViewport(page, 'mobile');
  await goToHome(page);
  await waitForScene(page);
  await expectCanvasRendered(page);
});
```

## Best Practices

### 1. Use Fixtures for Common Setup

Create fixtures for repeated setup logic:

```typescript
export const test = base.extend<CustomFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    // Perform authentication
    await use(page);
  },
});
```

### 2. Use Page Object Model

For complex pages, use Page Object Model pattern:

```typescript
// pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async getTitle() {
    return this.page.title();
  }
}

// In test
const homePage = new HomePage(page);
await homePage.navigate();
```

### 3. Handle Three.js Specifics

When testing Three.js applications:

```typescript
// Wait for canvas
await page.waitForSelector('canvas');

// Wait for WebGL context
await page.waitForFunction(() => {
  const canvas = document.querySelector('canvas');
  return canvas && canvas.getContext('webgl2') !== null;
});

// Check if scene rendered
const hasContent = await page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl2');
  const pixels = new Uint8Array(4);
  gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return pixels.some(p => p !== 0);
});
```

### 4. Test Responsiveness

```typescript
import { VIEWPORTS, testAcrossViewports } from './helpers/viewport';

test('should be responsive', async ({ page }) => {
  await testAcrossViewports(page, async (viewport) => {
    console.log(`Testing ${viewport}`);
    // Test logic for each viewport
  });
});
```

### 5. Handle Animations

For deterministic tests, disable animations:

```typescript
test('should have stable layout', async ({ staticPage }) => {
  // staticPage fixture disables all animations
  // Take screenshots or measure layouts
});
```

## CI/CD Integration

### GitHub Actions Workflow

The E2E tests run automatically on:

- Push to `main`, `develop`, or `enhance/**` branches
- Pull requests to `main` or `develop`

### Workflow Features

- **Matrix Testing**: Tests run on Chromium, Firefox, and WebKit
- **Parallel Execution**: Tests run concurrently for speed
- **Artifact Upload**: Test results, videos, screenshots, and traces uploaded
- **Test Reports**: Combined HTML report generated
- **PR Comments**: Test results posted to pull requests

### Viewing CI Test Results

1. Go to Actions tab in GitHub repository
2. Select the workflow run
3. Download artifacts to view:
   - Test results (HTML report)
   - Screenshots (failures only)
   - Videos (failures only)
   - Traces (failures only)

## Debugging Failed Tests

### Local Debugging

```bash
# Run in debug mode with step-through
npm run test:e2e:debug

# Run specific test file
npx playwright test smoke.spec.ts --debug

# Run with headed browser
npm run test:e2e:headed

# Show trace viewer
npx playwright show-trace trace.zip
```

### Debugging in CI

1. Download trace artifacts from failed CI run
2. View locally:
   ```bash
   npx playwright show-trace path/to/trace.zip
   ```

### Common Issues

**Issue: Tests timeout waiting for canvas**
```typescript
// Solution: Increase timeout for Three.js heavy scenes
await page.waitForSelector('canvas', { timeout: 30000 });
```

**Issue: WebGL not available in headless**
```typescript
// Solution: Use headed mode or check browser capabilities
const hasWebGL = await page.evaluate(() => {
  const canvas = document.createElement('canvas');
  return !!canvas.getContext('webgl2');
});
```

**Issue: Flaky tests due to animations**
```typescript
// Solution: Use staticPage fixture or wait for animations
await page.waitForTimeout(1000); // After animation completes
```

## Test Coverage Goals

### Current Status
- **E2E Coverage**: 15% → Target: 40%

### Coverage Areas

- ✅ Application loads successfully
- ✅ Three.js canvas renders
- ✅ No console errors on load
- ✅ Responsive on mobile
- ✅ Page reload works
- ✅ Navigation elements present
- ✅ WebGL2 support verified
- ⏳ User interactions
- ⏳ 3D scene interactions
- ⏳ Performance metrics
- ⏳ Accessibility compliance

## Reporting

### HTML Report

```bash
# Generate and view report
npm run test:e2e:report
```

Reports include:
- Test pass/fail status
- Execution time
- Screenshots
- Videos (on failure)
- Traces (on failure)

### JSON Report

Located at: `tests/e2e/reports/results.json`

Use for CI integration or custom reporting.

## Performance Testing

### Measuring Load Time

```typescript
test('should load quickly', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: perfData.loadEventEnd - perfData.loadEventStart,
      domContentLoaded: perfData.domContentLoadedEventEnd -
                        perfData.domContentLoadedEventStart,
    };
  });

  expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds
});
```

## Accessibility Testing

### Using @axe-core/playwright

```typescript
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('should have no accessibility violations', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});
```

## Visual Regression Testing

### Taking Screenshots

```typescript
test('should match visual snapshot', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'tests/e2e/screenshots/home.png' });

  // Or use toHaveScreenshot for automatic comparison
  await expect(page).toHaveScreenshot('home.png');
});
```

## Maintenance

### Updating Playwright

```bash
# Update Playwright
npm install -D @playwright/test@latest

# Update browsers
npx playwright install
```

### Adding New Browsers

Edit `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'edge',
    use: { ...devices['Desktop Edge'] },
  },
],
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Three.js Applications](https://threejs.org/docs/#manual/en/introduction/Testing)
- [Project Repository](https://github.com/yourusername/ace-facility)

## Support

For issues or questions:
1. Check this documentation
2. Review Playwright docs
3. Check existing tests for examples
4. Open an issue in the repository

---

**Last Updated**: 2025-11-22
**Version**: 1.0.0
