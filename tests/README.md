# E2E Testing Guide - ACE Application

## Overview

This directory contains end-to-end tests for the ACE basketball court 3D application using Playwright.

## Test Coverage

### User Journey Tests (`e2e/user-journey.spec.ts`)

Complete user flow testing from homepage to 3D court interaction:

- **Homepage Load**: Verify initial page load
- **Loading Screen**: Test loading sequence and phase progression
- **Console Monitoring**: Detect and report errors/warnings
- **3D Canvas**: Validate WebGL rendering
- **User Interactions**: Test camera controls (orbit, zoom, pan)
- **Performance**: Measure load times and responsiveness
- **Cross-Browser**: Test on Chrome, Firefox, Safari
- **Mobile**: Verify mobile/tablet viewports

## Running Tests

### Prerequisites

```bash
npm install
npx playwright install
```

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test

```bash
npx playwright test user-journey
```

### Run with UI Mode

```bash
npx playwright test --ui
```

### Run on Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug Mode

```bash
npx playwright test --debug
```

## Test Structure

```
tests/
├── e2e/
│   ├── user-journey.spec.ts  # Main user journey tests
│   └── helpers.ts             # Reusable test utilities
├── README.md                  # This file
playwright.config.ts           # Playwright configuration
```

## Helper Functions

The `helpers.ts` file provides utilities:

### Loading Utilities
- `waitForLoadingComplete()` - Wait for loading screen with metrics
- `verifyCanvasRendering()` - Validate 3D canvas is working

### Monitoring
- `setupConsoleMonitor()` - Track console messages
- `filterCriticalErrors()` - Ignore non-critical warnings
- `assertNoCriticalErrors()` - Fail test if critical errors

### Interactions
- `orbitCamera()` - Simulate camera orbit gesture
- `zoomCamera()` - Simulate zoom interaction
- `takeScreenshot()` - Capture labeled screenshots

### Performance
- `getPerformanceMetrics()` - Browser performance data
- `setNetworkConditions()` - Simulate network conditions

## Test Scenarios

### 1. Complete User Journey
```typescript
test('Complete user journey - homepage to 3D court', async ({ page }) => {
  // 1. Load homepage
  await page.goto('/');

  // 2. Verify loading screen
  await expect(loadingScreen).toBeVisible();

  // 3. Wait for completion
  await expect(loadingScreen).not.toBeVisible({ timeout: 60000 });

  // 4. Verify 3D court rendered
  await expect(canvas).toBeVisible();

  // 5. Test interactions
  await canvas.click();

  // 6. Verify no errors
  expect(consoleErrors).toHaveLength(0);
});
```

### 2. Loading Phases
Tests that loading screen progresses through expected phases.

### 3. Performance Metrics
Measures and validates loading time targets.

### 4. Canvas Rendering
Validates WebGL context and responsive dimensions.

### 5. Camera Controls
Tests orbit, zoom, and pan interactions.

### 6. Mobile Experience
Validates touch interactions and mobile viewports.

## Expected Results

### Success Criteria
- ✅ Loading completes within 60 seconds
- ✅ No critical console errors
- ✅ 3D canvas renders with WebGL
- ✅ User interactions work smoothly
- ✅ Canvas responsive to viewport changes

### Performance Targets
- **Good**: < 10 seconds total load time
- **Acceptable**: < 30 seconds total load time
- **Max**: < 60 seconds total load time

## Debugging Failed Tests

### Check Screenshots
Failed tests automatically capture screenshots:
```
docs/test-failure-{test-name}.png
```

### Check Test Results
HTML report generated after test run:
```bash
npx playwright show-report
```

### Check Console Logs
Console errors logged during test execution

### Common Issues

**Loading Timeout**
```
Error: Loading screen didn't disappear within 60s
```
- Check if assets are loading (network tab)
- Verify dev server is running
- Check for JavaScript errors blocking loading

**Canvas Not Visible**
```
Error: Canvas element not found
```
- Verify Three.js loaded correctly
- Check WebGL browser support
- Inspect for rendering errors

**Console Errors**
```
Error: Critical console errors found
```
- Review console output in test logs
- Filter non-critical warnings
- Fix JavaScript errors in code

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
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Wait for Loading Complete**: Always wait for loading screen before testing
2. **Monitor Console**: Track errors throughout test execution
3. **Use Helpers**: Leverage helper functions for common operations
4. **Take Screenshots**: Capture state on success and failure
5. **Test Real Interactions**: Simulate actual user behavior
6. **Cross-Browser**: Run on multiple browsers before release
7. **Mobile Testing**: Verify mobile viewports and touch

## Adding New Tests

1. Create test file in `tests/e2e/`
2. Import helpers: `import { waitForLoadingComplete } from './helpers'`
3. Use descriptive test names
4. Add console monitoring
5. Take screenshots on failure
6. Document expected behavior

Example:
```typescript
import { test, expect } from '@playwright/test';
import { waitForLoadingComplete, setupConsoleMonitor } from './helpers';

test('New feature test', async ({ page }) => {
  const monitor = setupConsoleMonitor(page);

  await page.goto('/');
  await waitForLoadingComplete(page);

  // Test your feature

  assertNoCriticalErrors(monitor);
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Three.js Testing Guide](https://threejs.org/docs/#manual/en/introduction/Testing)
- [WebGL Testing Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
