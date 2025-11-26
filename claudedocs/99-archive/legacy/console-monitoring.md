# Console Monitoring in E2E Tests

## Overview

The ConsoleMonitor helper provides comprehensive browser console error tracking for all E2E tests. It ensures that tests not only pass functionally but also run without console errors, warnings, or unhandled exceptions.

## Problem Statement

**Before:** Tests could pass while browser console showed errors. Tests only verified functional behavior, not console cleanliness.

**After:** Every critical test includes console monitoring. Tests fail if console errors are detected, ensuring production-quality code.

## Usage

### Basic Usage

```typescript
import { ConsoleMonitor } from './helpers/consoleMonitor';

test('should load page without errors', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  await page.goto('/');
  // ... test actions ...

  // Assert no console errors at the end
  monitor.assertNoErrors();
});
```

### Advanced Usage

```typescript
test('multi-step test with console monitoring', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  // Step 1
  await page.goto('/');
  monitor.assertNoErrors(); // Check after navigation

  // Step 2
  await page.click('button');
  monitor.assertNoErrors(); // Check after interaction

  // Step 3 - Clear and start fresh
  monitor.clear();
  await page.reload();
  monitor.assertNoErrors(); // Check fresh state

  // Check for specific errors
  if (monitor.hasError(/WebGL/)) {
    console.log('WebGL error detected');
  }

  // Print summary for debugging
  monitor.printSummary();
});
```

## API Reference

### Constructor

```typescript
new ConsoleMonitor(page: Page)
```

Automatically attaches to page console and pageerror events.

### Methods

#### `assertNoErrors()`
Throws error if any console errors were captured. Use at end of tests.

#### `assertNoWarnings()`
Throws error if any console warnings were captured.

#### `assertMaxErrors(maxCount: number)`
Allows up to `maxCount` errors before failing.

#### `getErrors(): string[]`
Returns array of captured error messages.

#### `getWarnings(): string[]`
Returns array of captured warning messages.

#### `getErrorCount(): number`
Returns count of errors.

#### `getWarningCount(): number`
Returns count of warnings.

#### `hasError(pattern: string | RegExp): boolean`
Checks if specific error pattern exists.

#### `clear()`
Clears all captured messages. Useful for multi-step tests.

#### `printSummary()`
Prints formatted summary to console for debugging.

#### `getAllLogs()`
Returns all captured console messages with timestamps.

## Filtered Noise Patterns

The monitor automatically filters out known acceptable patterns:

- React DevTools messages
- Browser extension messages
- Webpack/HMR messages
- Vite development warnings
- ResizeObserver loop warnings (browser quirk)
- Three.js development warnings (non-critical)

To add more patterns, update `isKnownNoise()` in `consoleMonitor.ts`.

## Test Coverage

### Updated Test Files

All critical tests now include console monitoring:

#### Smoke Tests (`smoke.spec.ts`)
- ✅ Homepage load
- ✅ Canvas rendering
- ✅ Mobile responsiveness
- ✅ Page reload
- ✅ Navigation elements
- ✅ WebGL2 support
- ✅ Performance metrics
- ✅ 3D scene initialization
- ✅ Mouse interaction

#### Critical Tests

**Visualization (`critical/visualization.spec.ts`)**
- ✅ 3D visualization access
- ✅ Heat map toggle
- ✅ Camera controls
- ✅ Weather effects
- ✅ Performance monitoring

**AI Chat (`critical/ai-chat.spec.ts`)**
- ✅ Chat interface opening
- ✅ Message sending/receiving
- ✅ Chat history persistence

**Court Navigation (`critical/court-navigation.spec.ts`)**
- Updates in progress...

#### Adaptive Loading (`adaptive-loading.spec.ts`)
- ✅ High-performance device loading
- ✅ Phase progression
- Updates in progress...

## Benefits

### 1. Early Error Detection
Catch console errors immediately during test runs, not in production.

### 2. Production Quality
Ensures code runs cleanly without browser console pollution.

### 3. Debugging Support
Full log capture with timestamps helps debug test failures.

### 4. Regression Prevention
Console errors from code changes are caught automatically.

### 5. Better Test Coverage
Tests verify both functional behavior AND console cleanliness.

## Best Practices

### 1. Monitor Creation
Create monitor at start of test, before any page actions:

```typescript
test('example', async ({ page }) => {
  const monitor = new ConsoleMonitor(page); // First line
  await page.goto('/'); // Then navigate
});
```

### 2. Assertion Placement
Add assertion at end of test, after all actions:

```typescript
test('example', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  // ... all test actions ...

  monitor.assertNoErrors(); // Last line
});
```

### 3. Multi-Step Tests
For complex tests with multiple phases, use `clear()`:

```typescript
test('multi-phase test', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  // Phase 1
  await page.goto('/step1');
  monitor.assertNoErrors();

  // Phase 2 - start fresh
  monitor.clear();
  await page.goto('/step2');
  monitor.assertNoErrors();
});
```

### 4. Debugging Failures
When tests fail due to console errors:

```typescript
test('debugging example', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  await page.goto('/');

  // Print summary before assertion
  monitor.printSummary();

  // This will show detailed error info if it fails
  monitor.assertNoErrors();
});
```

## Examples

### Smoke Test Example

```typescript
test('should load homepage successfully', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  await goToHome(page);

  // Check page title
  await expect(page).toHaveTitle(/LawnTech Dynamics/i);

  // Verify page is loaded
  const isLoaded = await page.evaluate(() => document.readyState === 'complete');
  expect(isLoaded).toBeTruthy();

  // Assert no console errors
  monitor.assertNoErrors();
});
```

### Critical Test Example

```typescript
test('should access 3D visualization', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);

  // Verify 3D canvas is visible
  await expect(vizPage.canvas3D).toBeVisible();

  // Verify WebGL context
  await waitForWebGL(page, '[data-testid="3d-canvas"]');

  // Verify visualization controls are present
  await expect(vizPage.cameraControls).toBeVisible();
  await expect(vizPage.heatMapToggle).toBeVisible();
  await expect(vizPage.weatherToggle).toBeVisible();

  // Take snapshot
  await expect(page).toHaveScreenshot('visualization-initial.png');

  // Assert no console errors
  monitor.assertNoErrors();
});
```

### Adaptive Test Example

```typescript
test('should progress through all phases', async ({ page }) => {
  const monitor = new ConsoleMonitor(page);
  const phases = ['Essential', 'Core', 'Visual', 'Enhanced'];

  for (const phase of phases) {
    await expect(page.locator('[data-testid="loading-phase"]'))
      .toContainText(phase, { timeout: 15000 });
  }

  // Loading should complete
  await expect(page.locator('[data-testid="loading-screen"]'))
    .not.toBeVisible({ timeout: 30000 });

  // Assert no console errors
  monitor.assertNoErrors();
});
```

## Troubleshooting

### Test Fails with Console Errors

**Problem:** Test fails with "Console errors found" message.

**Solution:**
1. Read the error messages in the failure output
2. Fix the underlying code issue causing the error
3. If it's acceptable noise, add pattern to `isKnownNoise()`

### False Positives

**Problem:** Test fails on acceptable warnings.

**Solution:**
Update `isKnownNoise()` in `consoleMonitor.ts`:

```typescript
private isKnownNoise(text: string): boolean {
  const noisePatterns = [
    // ... existing patterns ...
    /Your acceptable pattern here/,
  ];
  return noisePatterns.some(pattern => pattern.test(text));
}
```

### Need to Allow Some Errors

**Problem:** Specific test legitimately produces errors.

**Solution:**
Use `assertMaxErrors()` instead:

```typescript
// Allow up to 2 errors
monitor.assertMaxErrors(2);
```

Or check specific patterns:

```typescript
const errors = monitor.getErrors();
const criticalErrors = errors.filter(err => !err.includes('acceptable'));
expect(criticalErrors).toHaveLength(0);
```

## Migration Status

### Completed ✅
- `tests/e2e/helpers/consoleMonitor.ts` - Helper created
- `tests/e2e/smoke.spec.ts` - All 10 tests updated
- `tests/e2e/critical/visualization.spec.ts` - Critical tests updated
- `tests/e2e/critical/ai-chat.spec.ts` - Critical tests updated
- `tests/e2e/adaptive-loading.spec.ts` - Partially updated

### In Progress 🔄
- `tests/e2e/critical/court-navigation.spec.ts`
- Remaining adaptive-loading tests
- Other test files

### Pending 📋
- Performance tests
- Mobile tests
- Visual regression tests
- Integration tests

## Future Enhancements

### 1. Performance Tracking
Track console message frequency and performance impact.

### 2. Error Categorization
Categorize errors by severity (critical, warning, info).

### 3. Custom Reporters
Integration with test reporters for better visualization.

### 4. CI/CD Integration
Fail builds on console error thresholds.

### 5. Historical Analysis
Track console error trends over time.

## Related Documentation

- [Playwright Console Events](https://playwright.dev/docs/api/class-page#page-event-console)
- [Test Helpers](/tests/e2e/helpers/README.md)
- [E2E Testing Guide](/docs/testing-guide.md)

## Support

For questions or issues with console monitoring:
1. Check this documentation
2. Review `consoleMonitor.ts` implementation
3. Check existing test examples
4. Open issue with console error details
