# Visual Regression Testing Guide

Complete guide to visual regression testing and performance benchmarking for the ACE Facility.

## Table of Contents

- [Overview](#overview)
- [Visual Regression Testing](#visual-regression-testing)
- [Performance Benchmarking](#performance-benchmarking)
- [Running Tests](#running-tests)
- [Updating Baselines](#updating-baselines)
- [Investigating Failures](#investigating-failures)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Overview

The ACE Facility uses Playwright for visual regression testing and performance benchmarking. This ensures:

- **Visual Consistency**: Catch unintended UI changes across updates
- **Performance Standards**: Maintain performance budgets and detect regressions
- **Cross-Browser Compatibility**: Verify rendering across different browsers
- **Responsive Design**: Ensure layouts work across devices

## Visual Regression Testing

### What is Visual Regression Testing?

Visual regression testing captures screenshots of your application and compares them against baseline images to detect visual changes.

### Configuration

Visual regression settings are in `playwright.config.ts`:

```typescript
expect: {
  toHaveScreenshot: {
    // Maximum allowed pixel difference (0.2%)
    maxDiffPixelRatio: 0.002,
    // Disable animations for consistent screenshots
    animations: 'disabled',
    // Use CSS pixels for scaling
    scale: 'css',
  },
}
```

### Test Suites

#### 1. Court View (`tests/e2e/visual/court-view.visual.spec.ts`)

Tests the 3D tennis court visualization:

- Court overview
- Grass detail rendering
- Court lines and markings
- Weather effects
- Night lighting
- Camera angles

#### 2. BMS Dashboard (`tests/e2e/visual/bms-dashboard.visual.spec.ts`)

Tests the Building Management System UI:

- Dashboard overview
- Sensor data panels
- Irrigation controls
- Environmental data displays
- Alert notifications
- Historical charts
- System status indicators

#### 3. Mobile Responsive (`tests/e2e/visual/mobile-responsive.visual.spec.ts`)

Tests responsive design across devices:

- iPhone 12, iPhone SE, Pixel 5, iPad Mini
- Portrait and landscape orientations
- Touch interactions
- Mobile navigation menus

#### 4. Theme Variations (`tests/e2e/visual/theme-variations.visual.spec.ts`)

Tests light/dark theme consistency:

- Dark theme (default)
- Light theme
- Theme transitions
- Contrast modes
- UI control theming

### Running Visual Tests

```bash
# Run all visual regression tests
npm run test:e2e:visual

# Run specific test suite
npx playwright test tests/e2e/visual/court-view.visual.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:visual -- --headed

# Run with debug mode
npm run test:e2e:visual -- --debug
```

## Performance Benchmarking

### Performance Metrics

The test suite measures:

#### Core Web Vitals
- **Time to Interactive (TTI)**: Budget < 3500ms
- **First Contentful Paint (FCP)**: Budget < 1800ms
- **Largest Contentful Paint (LCP)**: Budget < 2500ms
- **Cumulative Layout Shift (CLS)**: Budget < 0.1
- **Total Blocking Time (TBT)**: Budget < 300ms
- **First Input Delay (FID)**: Budget < 100ms

#### 3D Rendering Performance
- **Average FPS**: Target > 50fps
- **Minimum FPS**: Target > 30fps
- **Frame drops**: Monitor and minimize
- **Memory usage**: Budget < 200MB increase
- **Render time per frame**: Budget < 16.67ms (60fps)

#### Memory Profiling
- **Memory leak detection**: Growth rate < 1MB/s
- **Memory during interactions**: Retained < 5MB
- **Garbage collection impact**: Monitor heap size
- **Scene complexity handling**: Maintain FPS under load

### Test Suites

#### 1. Core Metrics (`tests/e2e/performance/core-metrics.perf.spec.ts`)

- Initial page load performance
- 3D scene initialization
- Interaction responsiveness
- JavaScript coverage analysis

#### 2. 3D Rendering (`tests/e2e/performance/3d-rendering.perf.spec.ts`)

- Frame rate during idle
- FPS during camera movement
- Memory usage during rendering
- Render time per frame
- GPU performance metrics
- Complex scene handling

#### 3. Memory Profiling (`tests/e2e/performance/memory-profiling.perf.spec.ts`)

- Memory leak detection
- Interaction memory patterns
- Scene change memory impact
- Long-running session stability

### Running Performance Tests

```bash
# Run all performance tests
npm run test:e2e:performance

# Run specific performance suite
npx playwright test tests/e2e/performance/core-metrics.perf.spec.ts

# Generate performance report
npm run test:e2e:report
```

## Updating Baselines

### When to Update

Update baseline images when:

- Intentional design changes are made
- New features alter the UI
- Layout improvements are implemented
- Theme changes are applied

### How to Update

```bash
# Update all baselines
npx playwright test --update-snapshots

# Update specific test baselines
npx playwright test court-view.visual.spec.ts --update-snapshots

# Update for specific browser
npx playwright test --project=chromium --update-snapshots
```

### Update Workflow

1. **Review Changes**: Ensure changes are intentional
2. **Run Tests First**: Verify failures are expected
3. **Update Baselines**: Use `--update-snapshots`
4. **Verify Updates**: Re-run tests to confirm
5. **Commit Baselines**: Add updated snapshots to Git

```bash
# Example workflow
npm run test:e2e:visual                # See failures
git diff tests/e2e/__snapshots__/       # Review changes
npm run test:e2e:visual -- --update-snapshots
npm run test:e2e:visual                # Verify updates
git add tests/e2e/__snapshots__/
git commit -m "test: Update visual regression baselines"
```

## Investigating Failures

### Visual Regression Failures

When a visual test fails:

1. **Check the Diff**: Playwright generates a diff image showing changes
2. **Review Test Report**: Open HTML report with `npm run test:e2e:report`
3. **Examine Screenshots**: Compare actual vs. expected in `__snapshots__`
4. **Identify Root Cause**: Determine if change is intentional or a bug

```bash
# Open test report with visual diffs
npm run test:e2e:report
```

### Performance Regression Failures

When a performance test fails:

1. **Check Console Output**: Review metrics printed during test
2. **Generate Report**: Run `npm run test:perf:report`
3. **Compare Trends**: Review historical performance data
4. **Profile the Issue**: Use browser DevTools for deeper analysis

```bash
# Generate detailed performance report
npx tsx scripts/generate-performance-report.ts
```

### Common Issues

#### Visual Regression

**Issue**: Inconsistent screenshots across runs
- **Solution**: Ensure animations are disabled, wait for loading states
- **Check**: `waitForLoadState('networkidle')` and animation CSS

**Issue**: Font rendering differences
- **Solution**: Use `scale: 'css'` and ensure fonts are loaded
- **Check**: Font loading in `beforeEach` hooks

**Issue**: Dynamic content causing failures
- **Solution**: Mock dynamic data or use fixed timestamps
- **Check**: API mocks and test fixtures

#### Performance

**Issue**: Inconsistent FPS measurements
- **Solution**: Increase measurement duration, stabilize scene first
- **Check**: Wait times and scene initialization

**Issue**: Memory measurements unavailable
- **Solution**: Enable `--enable-precise-memory-info` in Chrome
- **Check**: Browser flags in test configuration

**Issue**: Performance varies across machines
- **Solution**: Use relative thresholds or CI-specific budgets
- **Check**: Environment-specific configuration

## Best Practices

### Visual Regression

1. **Disable Animations**: Always disable animations for consistent screenshots
   ```typescript
   await page.addStyleTag({
     content: '* { animation: none !important; transition: none !important; }'
   });
   ```

2. **Wait for Stability**: Ensure content is fully loaded
   ```typescript
   await page.waitForLoadState('networkidle');
   await page.waitForTimeout(500); // Extra settling time
   ```

3. **Use Specific Selectors**: Target specific elements when possible
   ```typescript
   await expect(page.locator('.court-view')).toHaveScreenshot();
   ```

4. **Set Appropriate Thresholds**: Balance strictness with practicality
   ```typescript
   await expect(page).toHaveScreenshot({
     maxDiffPixels: 100,  // Allow minor differences
     threshold: 0.2,      // 20% pixel difference tolerance
   });
   ```

5. **Organize Snapshots**: Use descriptive names and organize by feature
   ```typescript
   await expect(page).toHaveScreenshot('court-overview-dark-theme.png');
   ```

### Performance Testing

1. **Stabilize Before Measuring**: Let scenes initialize completely
   ```typescript
   await page.waitForTimeout(2000); // Let 3D scene stabilize
   ```

2. **Measure Multiple Samples**: Average over multiple runs for accuracy
   ```typescript
   const samples = [];
   for (let i = 0; i < 60; i++) {
     samples.push(measureFrame());
   }
   const avg = samples.reduce((a, b) => a + b) / samples.length;
   ```

3. **Set Realistic Budgets**: Base budgets on actual device capabilities
   ```typescript
   const BUDGETS = {
     desktop: { avgFps: 60, minFps: 50 },
     mobile: { avgFps: 30, minFps: 24 },
   };
   ```

4. **Monitor Trends**: Track performance over time, not just absolute values
   ```typescript
   // Compare against historical average, not just budget
   expect(currentFps).toBeGreaterThan(historicalAvgFps * 0.95);
   ```

5. **Profile Hotspots**: Identify specific performance bottlenecks
   ```typescript
   // Enable detailed profiling for failing tests
   await page.coverage.startJSCoverage();
   // ... run test ...
   const coverage = await page.coverage.stopJSCoverage();
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Regression & Performance Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run visual regression tests
        run: npm run test:e2e:visual

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: visual-test-results
          path: tests/e2e/reports/

  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run performance tests
        run: npm run test:e2e:performance

      - name: Generate performance report
        if: always()
        run: npx tsx scripts/generate-performance-report.ts

      - name: Upload performance report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: tests/e2e/reports/performance-report.html
```

### Environment Variables

```bash
# CI-specific configuration
CI=true                           # Enable CI mode
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0 # Ensure browsers are available
PLAYWRIGHT_BROWSERS_PATH=0        # Use default browser path
```

## Troubleshooting

### Common Commands

```bash
# Clear test cache
npx playwright test --clear-cache

# Run in debug mode with inspector
npx playwright test --debug

# Run with verbose logging
DEBUG=pw:api npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui

# Update snapshots for specific test
npx playwright test court-view --update-snapshots

# Generate report from existing results
npx playwright show-report tests/e2e/reports/html
```

### Getting Help

- **Playwright Docs**: https://playwright.dev
- **Visual Testing Guide**: https://playwright.dev/docs/test-snapshots
- **Performance Testing**: https://playwright.dev/docs/test-performance
- **Project Issues**: Create an issue in the repository

---

## Quick Reference

### Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e:visual` | Run all visual regression tests |
| `npm run test:e2e:performance` | Run all performance benchmarks |
| `npm run test:e2e:report` | Open HTML test report |
| `npm run test:perf:report` | Generate performance report |
| `npx playwright test --update-snapshots` | Update all baseline images |

### Performance Budgets

| Metric | Budget | Importance |
|--------|--------|------------|
| Time to Interactive | < 3500ms | Critical |
| First Contentful Paint | < 1800ms | Critical |
| Largest Contentful Paint | < 2500ms | Critical |
| Average FPS | > 50fps | High |
| Minimum FPS | > 30fps | High |
| Memory Growth | < 200MB | Medium |

### File Locations

- **Visual Tests**: `tests/e2e/visual/`
- **Performance Tests**: `tests/e2e/performance/`
- **Snapshots**: `tests/e2e/__snapshots__/`
- **Reports**: `tests/e2e/reports/`
- **Scripts**: `scripts/generate-performance-report.ts`
- **Config**: `playwright.config.ts`
