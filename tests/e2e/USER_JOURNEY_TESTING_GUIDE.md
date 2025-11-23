# User Journey Testing Guide

## Overview

This guide documents the comprehensive user journey tests with console monitoring designed to catch issues like "3D view doesn't work" before they reach production.

## Test Coverage

### 1. Happy Path Journey
Complete user flow from homepage to 3D interaction without any console errors.

**Journey Steps:**
1. Navigate to homepage
2. Verify loading screen appears
3. Wait for loading to complete (up to 60s)
4. Verify 3D canvas is visible and rendering
5. Test camera rotation via mouse drag
6. Test zoom controls via keyboard
7. Monitor FPS throughout journey
8. Verify no console errors at any point

**Key Validations:**
- ✅ Zero console errors
- ✅ Canvas renders actual pixels (not blank)
- ✅ FPS > 30 throughout journey
- ✅ Memory usage stable
- ✅ All interactions responsive

### 2. Performance Monitoring Journey
Continuous FPS and memory monitoring during interactions.

**Metrics Tracked:**
- FPS readings every second
- Memory usage growth
- Load times
- Render times
- Interaction latency

**Performance Thresholds:**
- Minimum FPS: 20 (mobile), 24 (desktop)
- Average FPS: > 30
- Load time: < 10 seconds
- Memory growth: < 100MB per session

### 3. Error Recovery Journey
Tests system resilience to various error conditions.

**Scenarios Tested:**
- WebGL context loss and recovery
- Rapid navigation/reload cycles
- Slow network simulation
- Memory pressure situations
- Invalid state recovery

### 4. Mobile Journey
Complete user journey on mobile viewport.

**Mobile-Specific Tests:**
- Touch interactions
- Swipe gestures
- Viewport constraints
- Performance on limited hardware
- Orientation changes

### 5. Console Error Detection
Specific monitoring for rendering failures.

**Monitored Error Types:**
- WebGL errors
- Three.js exceptions
- Shader compilation failures
- Texture loading errors
- Null/undefined reference errors
- Memory allocation failures

## How Tests Would Have Caught "3D View Doesn't Work"

### Detection Points

1. **Console Monitoring**
   ```javascript
   // Catches errors like:
   - "Cannot read property 'scene' of undefined"
   - "WebGL context lost"
   - "Three.js: Shader Error"
   ```

2. **Visual Validation**
   ```javascript
   // Verifies actual rendering:
   - Canvas has non-zero dimensions
   - Pixels are being drawn (not all black)
   - Screenshot has substantial data
   ```

3. **Performance Tracking**
   ```javascript
   // Detects performance issues:
   - FPS drops to 0 (frozen scene)
   - Memory leaks causing crashes
   - Render loop not running
   ```

4. **Interaction Testing**
   ```javascript
   // Confirms functionality:
   - Mouse events properly handled
   - Camera controls responsive
   - No errors during interactions
   ```

## Running the Tests

### Full Test Suite
```bash
npm run test:e2e tests/e2e/user-journey-with-monitoring.spec.ts
```

### Specific Journey Tests
```bash
# Happy path only
npx playwright test -g "Happy Path"

# Performance monitoring
npx playwright test -g "Performance Journey"

# Error recovery
npx playwright test -g "Error Recovery"

# Mobile testing
npx playwright test -g "Mobile Viewport"

# P2 validation specific
npx playwright test -g "P2 Validation"
```

### Headed Mode (Visual Debugging)
```bash
npm run test:e2e:headed tests/e2e/user-journey-with-monitoring.spec.ts
```

### Generate Report
```bash
npm run test:e2e:report
```

## Test Report Structure

Each test generates a detailed report including:

```json
{
  "console": {
    "errors": [],
    "warnings": [],
    "criticalErrors": false
  },
  "performance": {
    "fps": [60, 58, 61, 59],
    "memoryUsage": [45234567, 45334567],
    "loadTime": 3421,
    "renderTime": 234
  },
  "summary": {
    "totalErrors": 0,
    "avgFPS": 59.5,
    "loadTime": 3421
  }
}
```

## Critical Error Patterns

The tests specifically monitor for these error patterns that indicate 3D rendering failure:

### WebGL Errors
- "Failed to create WebGL context"
- "WebGL: CONTEXT_LOST_WEBGL"
- "Too many active WebGL contexts"

### Three.js Errors
- "THREE.WebGLRenderer: Error creating WebGL context"
- "THREE.ShaderMaterial: shader not compiled"
- "THREE.Texture: Unable to load texture"

### JavaScript Errors
- "Cannot read property 'scene' of undefined"
- "Cannot read property 'render' of null"
- "Uncaught TypeError in render loop"

### Performance Issues
- FPS = 0 (frozen/crashed)
- Memory usage > limit
- Render loop stopped

## Validation Checklist

### P2 Requirements Met ✅

- [x] **Console Error Monitoring**: All console errors captured and analyzed
- [x] **Visual Rendering Validation**: Pixel analysis confirms actual rendering
- [x] **Performance Tracking**: FPS monitored throughout journey
- [x] **User Interaction Testing**: Complete interaction flow validated
- [x] **Error Recovery**: System resilience tested
- [x] **Mobile Support**: Mobile viewport journey included
- [x] **Automated Execution**: Full CI/CD integration ready
- [x] **Detailed Reporting**: Comprehensive test reports generated

## Continuous Improvement

### Adding New Journey Steps

To add new journey steps, extend the test:

```typescript
await trackStep('New interaction', async () => {
  // Your test code
  await page.click('[data-testid="new-feature"]');
  // Verify expected outcome
  await expect(page.locator('.result')).toBeVisible();
});
```

### Custom Error Patterns

Add new error patterns to monitor:

```typescript
const customErrors = [];
page.on('console', msg => {
  if (msg.text().includes('YourErrorPattern')) {
    customErrors.push(msg.text());
  }
});
```

### Performance Baselines

Update performance thresholds based on metrics:

```typescript
const PERFORMANCE_BASELINES = {
  fps: { min: 24, target: 30, optimal: 60 },
  loadTime: { max: 10000, target: 5000, optimal: 3000 },
  memory: { maxGrowth: 100_000_000 } // 100MB
};
```

## Integration with CI/CD

### GitHub Actions Configuration

```yaml
- name: Run User Journey Tests
  run: npm run test:e2e tests/e2e/user-journey-with-monitoring.spec.ts

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: journey-test-results
    path: tests/e2e/reports/
```

### Test Failure Alerts

Configure alerts for critical failures:

1. Console errors detected
2. FPS below threshold
3. Canvas not rendering
4. Critical errors in production

## Best Practices

1. **Run tests regularly**: Include in PR checks
2. **Monitor trends**: Track performance over time
3. **Update baselines**: Adjust thresholds as needed
4. **Add scenarios**: Cover new features in journey
5. **Review reports**: Analyze failures thoroughly
6. **Fix immediately**: Console errors = broken experience

## Conclusion

These comprehensive user journey tests with console monitoring provide a robust safety net that would have caught the "3D view doesn't work" issue through multiple detection mechanisms:

1. Console error monitoring would detect JavaScript errors
2. Visual validation would catch blank canvas issues
3. Performance monitoring would identify frozen scenes
4. Interaction testing would reveal unresponsive controls

By running these tests before every deployment, we ensure users always have a working 3D experience.