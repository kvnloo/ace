# E2E Test Examples - User Journey Testing

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Run User Journey Test
```bash
# Run on Chromium only (fastest)
npm run test:e2e:journey

# Run on all browsers
npm run test:e2e:journey:all

# Run with UI mode (interactive)
npm run test:e2e:ui
```

## Example Test Execution

### Successful Test Output
```
Running 1 test using 1 worker

✓ Complete user journey - homepage to 3D court (45s)

Step 1: Loading homepage...
Step 2: Verifying loading screen appears...
Step 3: Monitoring console during loading...
Step 4: Waiting for loading completion...
Step 5: Verifying 3D court rendered...
Step 6: Checking for console errors...
Step 7: Testing user interactions...
Step 8: Verifying canvas stability...
Step 9: Final error check...
Step 10: Capturing final state...
✅ User journey completed successfully
Total warnings: 0
Network errors: 0

1 passed (45s)
```

### Test Failure Example
```
✗ Complete user journey - homepage to 3D court (30s)

Step 1: Loading homepage...
Step 2: Verifying loading screen appears...
Step 3: Monitoring console during loading...
Step 4: Waiting for loading completion...
❌ Loading screen timeout after 60s

Screenshot saved: docs/test-failure-complete-user-journey.png
Console errors: ["TypeError: Cannot read property 'position' of undefined"]
```

## Using Helper Functions

### Basic Usage
```typescript
import { test, expect } from '@playwright/test';
import {
  waitForLoadingComplete,
  setupConsoleMonitor,
  verifyCanvasRendering,
  assertNoCriticalErrors
} from './helpers';

test('My custom test', async ({ page }) => {
  // Setup monitoring
  const monitor = setupConsoleMonitor(page);

  // Navigate and wait for loading
  await page.goto('/');
  const metrics = await waitForLoadingComplete(page);

  console.log(`Loading took ${metrics.duration}ms`);
  console.log(`Phases: ${metrics.phasesObserved.join(', ')}`);

  // Verify 3D rendering
  await verifyCanvasRendering(page);

  // Check for errors
  assertNoCriticalErrors(monitor);
});
```

### Testing Camera Interactions
```typescript
import { orbitCamera, zoomCamera } from './helpers';

test('Camera controls', async ({ page }) => {
  await page.goto('/');
  await waitForLoadingComplete(page);

  // Orbit camera
  await orbitCamera(page, 200, 200, 400, 400);

  // Zoom in
  await zoomCamera(page, -100);

  // Zoom out
  await zoomCamera(page, 100);
});
```

### Performance Monitoring
```typescript
import { getPerformanceMetrics } from './helpers';

test('Performance check', async ({ page }) => {
  await page.goto('/');
  await waitForLoadingComplete(page);

  const perf = await getPerformanceMetrics(page);

  console.log('DOM Content Loaded:', perf.domContentLoaded, 'ms');
  console.log('Load Complete:', perf.loadComplete, 'ms');
  console.log('First Paint:', perf.firstPaint, 'ms');
  console.log('First Contentful Paint:', perf.firstContentfulPaint, 'ms');
});
```

### Network Conditions Testing
```typescript
import { setNetworkConditions } from './helpers';

test('Slow 3G loading', async ({ page }) => {
  // Simulate slow connection
  await setNetworkConditions(page, 'slow-3g');

  await page.goto('/');
  const metrics = await waitForLoadingComplete(page);

  console.log(`Loading on slow 3G: ${metrics.duration}ms`);

  // Should still complete within 60s even on slow connection
  expect(metrics.duration).toBeLessThan(60000);
});
```

## Common Test Patterns

### Pattern 1: Full User Journey
```typescript
test('Complete flow', async ({ page }) => {
  // 1. Setup monitoring
  const monitor = setupConsoleMonitor(page);

  // 2. Navigate
  await page.goto('/');

  // 3. Wait for loading
  await waitForLoadingComplete(page);

  // 4. Verify rendering
  await verifyCanvasRendering(page);

  // 5. Interact
  const canvas = page.locator('canvas');
  await canvas.click();

  // 6. Verify no errors
  assertNoCriticalErrors(monitor);
});
```

### Pattern 2: Loading Performance
```typescript
test('Fast loading', async ({ page }) => {
  const start = Date.now();

  await page.goto('/');
  await waitForLoadingComplete(page, 30000); // 30s target

  const duration = Date.now() - start;

  expect(duration).toBeLessThan(30000);
});
```

### Pattern 3: Cross-Browser Testing
```typescript
test.describe('Cross-browser compatibility', () => {
  test('Chromium', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    await page.goto('/');
    await verifyCanvasRendering(page);
  });

  test('Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox');
    await page.goto('/');
    await verifyCanvasRendering(page);
  });

  test('WebKit', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit');
    await page.goto('/');
    await verifyCanvasRendering(page);
  });
});
```

### Pattern 4: Mobile Testing
```typescript
test('Mobile experience', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');
  await waitForLoadingComplete(page);

  const canvas = page.locator('canvas');

  // Test touch interaction
  await canvas.tap({ position: { x: 100, y: 100 } });

  await verifyCanvasRendering(page);
});
```

## Debugging Tests

### 1. Run with Browser UI
```bash
npm run test:e2e:headed
```
Watch the browser as test runs.

### 2. Debug Mode
```bash
npm run test:e2e:debug
```
Step through test with Playwright Inspector.

### 3. UI Mode
```bash
npm run test:e2e:ui
```
Interactive test runner with time travel debugging.

### 4. Check Screenshots
After test failure, check:
```
docs/test-failure-{test-name}.png
docs/screenshots/*.png
```

### 5. View HTML Report
```bash
npm run test:e2e:report
```

## Best Practices

### ✅ DO
- Use helper functions for common operations
- Setup console monitoring in every test
- Wait for loading complete before testing
- Take screenshots on important states
- Test on multiple browsers before release
- Verify no critical console errors
- Test real user interactions

### ❌ DON'T
- Skip loading wait (will fail)
- Ignore console errors (will cause issues)
- Use fixed timeouts (use expect with timeout)
- Test without monitoring
- Forget to verify canvas rendering
- Hard-code coordinates (use relative positions)

## Continuous Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: |
            tests/e2e/reports/
            docs/screenshots/
```

## Troubleshooting

### Issue: "Loading screen timeout"
**Solution**: Check if dev server is running, verify assets load correctly.

### Issue: "Canvas not found"
**Solution**: Verify Three.js initialized, check browser WebGL support.

### Issue: "Console errors found"
**Solution**: Review errors, fix JavaScript issues, update error filters.

### Issue: "Test too slow"
**Solution**: Optimize asset loading, reduce loading phases, check network.

### Issue: "Flaky test"
**Solution**: Add proper waits, increase timeouts, check for race conditions.

## Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Three.js Apps](https://threejs.org/docs/#manual/en/introduction/Testing)
- [WebGL Testing Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
