# Console Error Monitoring System

## Overview

The Console Error Monitoring system provides comprehensive detection and categorization of browser console errors during E2E test execution. This system helps catch critical issues like "3D view doesn't work" before they reach production by monitoring for JavaScript errors, network failures, WebGL issues, and more.

## Features

### Error Detection
- **Console Errors**: All `console.error()` calls
- **Unhandled Exceptions**: Runtime errors and uncaught exceptions
- **Promise Rejections**: Unhandled promise rejections
- **Network Failures**: Failed resource loads (404s, CORS, timeouts)
- **WebGL/Three.js Errors**: 3D rendering and graphics issues
- **Memory Issues**: Memory leaks and high memory usage warnings
- **Component Errors**: React/framework-specific errors

### Error Categorization

The system categorizes errors by type and severity:

#### Error Types
- `asset` - Failed resource loads (JS, CSS, images, models)
- `component` - React/UI component errors
- `threejs` - Three.js rendering errors
- `webgl` - WebGL context and shader errors
- `network` - Network and fetch failures
- `script` - JavaScript syntax and reference errors
- `promise` - Unhandled promise rejections
- `runtime` - Runtime exceptions
- `memory` - Memory-related issues
- `3d-render` - 3D scene and court rendering errors
- `other` - Uncategorized errors

#### Severity Levels
- `critical` - Application-breaking errors (must fix)
- `high` - Significant functionality impact
- `medium` - Noticeable issues
- `low` - Minor issues

## Usage

### Basic Setup

```typescript
import { ConsoleMonitor, createConsoleMonitor } from './helpers/consoleMonitor';

test('should load without errors', async ({ page }) => {
  // Create monitor for the page
  const monitor = createConsoleMonitor(page);

  // Perform test actions
  await page.goto('/');

  // Assert no errors occurred
  monitor.assertNoErrors();
});
```

### Advanced Usage

```typescript
test('3D view should render without errors', async ({ page }) => {
  const monitor = createConsoleMonitor(page);

  await page.goto('/court');
  await page.waitForLoadState('networkidle');

  // Specific error type assertions
  monitor.assertNo3DRenderErrors();    // No 3D rendering issues
  monitor.assertNoWebGLErrors();       // No WebGL context errors
  monitor.assertNoThreeJSErrors();     // No Three.js errors
  monitor.assertNoAssetErrors();       // All assets loaded
  monitor.assertNoPromiseRejections(); // No unhandled promises
  monitor.assertNoCriticalErrors();    // No critical severity errors

  // Check for warnings (non-blocking)
  const webglWarnings = monitor.getWebGLWarnings();
  if (webglWarnings.length > 0) {
    console.log('WebGL warnings:', webglWarnings);
  }
});
```

### Error Analysis

```typescript
test.afterEach(async () => {
  // Get detailed error information
  const errors = monitor.getCategorizedErrors();

  if (errors.length > 0) {
    // Print summary for debugging
    monitor.printSummary();

    // Get detailed report
    console.log(monitor.getDetailedReport());

    // Analyze by category
    const criticalErrors = errors.filter(e => e.severity === 'critical');
    const renderErrors = errors.filter(e => e.type === '3d-render');

    // Log specific issues
    if (renderErrors.length > 0) {
      console.error('3D rendering failed!', renderErrors);
    }
  }
});
```

## API Reference

### ConsoleMonitor Class

#### Constructor
```typescript
new ConsoleMonitor(page: Page)
```
Creates a new console monitor for the specified Playwright page.

#### Methods

##### Error Assertions
- `assertNoErrors()` - Assert no console errors occurred
- `assertNoCriticalErrors()` - Assert no critical severity errors
- `assertNoWarnings()` - Assert no console warnings
- `assertNoAssetErrors()` - Assert all assets loaded successfully
- `assertNoComponentErrors()` - Assert no React/component errors
- `assertNoThreeJSErrors()` - Assert no Three.js errors
- `assertNoWebGLErrors()` - Assert no WebGL errors
- `assertNo3DRenderErrors()` - Assert no 3D rendering errors
- `assertNoPromiseRejections()` - Assert no unhandled promise rejections
- `assertNoMemoryErrors()` - Assert no memory errors
- `assertNoRuntimeErrors()` - Assert no runtime exceptions
- `assertNoNetworkErrors()` - Assert no network failures
- `assertNoScriptErrors()` - Assert no script errors

##### Error Retrieval
- `getErrors(): string[]` - Get all error messages
- `getWarnings(): string[]` - Get all warning messages
- `getCategorizedErrors(): ErrorCategory[]` - Get categorized error details
- `getNetworkErrors()` - Get network failure details
- `getWebGLWarnings()` - Get WebGL-specific warnings
- `getMemoryWarnings()` - Get memory-related warnings
- `getErrorsByCategory(type)` - Get errors of specific type
- `getErrorsBySeverity(severity)` - Get errors of specific severity

##### Error Checking
- `getErrorCount(): number` - Get total error count
- `getWarningCount(): number` - Get total warning count
- `hasError(pattern): boolean` - Check if error matching pattern exists
- `has3DRenderErrors(): boolean` - Check for 3D rendering errors
- `hasPromiseErrors(): boolean` - Check for promise rejections
- `hasComponentErrors(): boolean` - Check for component errors
- `hasCriticalErrors(): boolean` - Check for critical errors

##### Utilities
- `clear()` - Clear all captured messages
- `printSummary()` - Print error summary to console
- `getDetailedReport(): string` - Get detailed error report
- `getAllLogs()` - Get all console logs for debugging

### Helper Functions

```typescript
createConsoleMonitor(page: Page): ConsoleMonitor
```
Convenience function to create and attach a console monitor to a page.

## Test Files Using Console Monitoring

### Core Test Files
- `tests/e2e/console-errors-detection.spec.ts` - Comprehensive error detection tests
- `tests/e2e/smoke.spec.ts` - Smoke tests with error monitoring
- `tests/e2e/critical/visualization.spec.ts` - 3D visualization error checking
- `tests/e2e/critical/court-navigation.spec.ts` - Court view error monitoring
- `tests/e2e/critical/ai-chat.spec.ts` - AI chat interface error checking

### Dedicated Error Detection Test
The `console-errors-detection.spec.ts` file provides comprehensive testing:

1. **Homepage Loading** - Ensures homepage loads without errors
2. **3D Court View** - Validates 3D rendering without WebGL/Three.js errors
3. **User Interactions** - Tests navigation and button clicks don't cause errors
4. **Loading Screen** - Verifies loading completes without timeouts
5. **Critical Resources** - Ensures all JS/CSS/WASM files load
6. **Memory Monitoring** - Checks for memory leaks
7. **Full Smoke Test** - Tests all routes without errors
8. **Error Recovery** - Tests graceful error handling

## Known Noise Filtering

The system automatically filters out known harmless console messages:

- React DevTools warnings
- Browser extension messages
- Development server (HMR, webpack, Vite) messages
- ResizeObserver loop warnings
- Non-critical Three.js development warnings

## Best Practices

### 1. Always Monitor Critical Paths
```typescript
test.describe('Critical User Journey', () => {
  let monitor: ConsoleMonitor;

  test.beforeEach(async ({ page }) => {
    monitor = createConsoleMonitor(page);
  });

  test.afterEach(async () => {
    // Always check for errors after each test
    monitor.assertNoCriticalErrors();
  });
});
```

### 2. Be Specific About Error Types
```typescript
// For 3D views
monitor.assertNo3DRenderErrors();
monitor.assertNoWebGLErrors();

// For data loading
monitor.assertNoAssetErrors();
monitor.assertNoNetworkErrors();

// For UI components
monitor.assertNoComponentErrors();
monitor.assertNoRuntimeErrors();
```

### 3. Use Clear Error Messages
```typescript
try {
  monitor.assertNoErrors();
} catch (error) {
  throw new Error(`Console errors on route ${route}:\n${error.message}`);
}
```

### 4. Monitor Performance Issues
```typescript
const memoryWarnings = monitor.getMemoryWarnings();
if (memoryWarnings.length > 0) {
  console.log('Potential memory leak detected:', memoryWarnings);
}
```

### 5. Debug with Detailed Reports
```typescript
if (monitor.getErrorCount() > 0) {
  console.log(monitor.getDetailedReport());
  // Includes timestamps, URLs, stack traces, and categorization
}
```

## CI/CD Integration

### Failing Tests on Errors
Tests automatically fail when critical errors are detected:

```yaml
# Example GitHub Actions output
✗ 3D Court view should render without errors
  Error: 3D rendering errors found:
    1. [CRITICAL] Failed to load /models/court.glb: 404 Not Found
    2. [CRITICAL] WebGL context lost
```

### Error Reporting
The system provides detailed error reports in CI logs:

```
=== Console Monitor Summary ===
Errors: 3
Warnings: 2
Network Errors: 1

Categorized Errors:
  By Category: { '3d-render': 2, 'asset': 1 }
  By Severity: { 'critical': 2, 'high': 1 }

Errors:
  1. Failed to load /models/court.glb: 404 Not Found
  2. THREE.WebGLRenderer: Context Lost
  3. Unhandled promise rejection: Court data failed to load
```

## Troubleshooting

### Common Issues

#### 1. False Positives
If tests fail due to harmless warnings:
```typescript
// Add to known noise patterns in consoleMonitor.ts
private isKnownNoise(text: string): boolean {
  const noisePatterns = [
    /your-harmless-pattern/,
    // ...
  ];
  return noisePatterns.some(pattern => pattern.test(text));
}
```

#### 2. Missing Errors
If errors aren't being caught:
```typescript
// Ensure monitor is created before navigation
const monitor = createConsoleMonitor(page);
await page.goto('/');  // Monitor is already listening
```

#### 3. Flaky Tests
For intermittent errors:
```typescript
// Add retries for network-related issues
test('flaky test', async ({ page }) => {
  test.slow();  // Increase timeout
  const monitor = createConsoleMonitor(page);

  // Retry logic for transient network issues
  await test.step('Load with retries', async () => {
    for (let i = 0; i < 3; i++) {
      monitor.clear();
      await page.goto('/');

      if (monitor.getErrorCount() === 0) break;
      await page.waitForTimeout(1000);
    }
  });

  monitor.assertNoErrors();
});
```

## Future Enhancements

Planned improvements for the console monitoring system:

1. **Error Trending** - Track error frequency over time
2. **Smart Categorization** - ML-based error classification
3. **Error Deduplication** - Group similar errors
4. **Performance Metrics** - Track long tasks and jank
5. **Custom Thresholds** - Configurable severity levels
6. **Error Recovery Testing** - Automated recovery scenarios
7. **Integration with APM** - Send errors to monitoring services
8. **Visual Error Reporting** - Screenshots on error occurrence

## Contributing

To add new error detection capabilities:

1. Update error categories in `ErrorCategory` type
2. Add detection logic to `categorizeError()` method
3. Create specific assertion methods
4. Add tests to `console-errors-detection.spec.ts`
5. Update this documentation

## Support

For issues or questions about console error monitoring:
- Check test output for detailed error reports
- Review `consoleMonitor.ts` for implementation details
- Run tests with `--debug` flag for verbose output
- Enable Playwright traces for visual debugging