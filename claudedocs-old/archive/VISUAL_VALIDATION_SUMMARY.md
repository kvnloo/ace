# Visual Validation Testing - Implementation Summary

## Problem Statement

**Issue**: Existing E2E tests verify structural elements (canvas exists, buttons present) but don't verify that 3D scenes are **actually rendering**.

**Example of Insufficient Testing:**
```typescript
// ❌ This only checks if canvas exists
const canvas = page.locator('canvas');
await expect(canvas).toBeVisible();

// Problem: Canvas could be blank, WebGL could have failed,
// scene might not have loaded - test still passes
```

## Solution Implemented

**Visual validation testing** that verifies actual rendering by:
1. Taking screenshots of canvas elements
2. Analyzing pixel data to detect 3D content
3. Comparing screenshots against baseline images
4. Detecting visual regressions across code changes

## Files Created

### 1. Test Suite
**Location**: `/home/kvn/workspace/evolve/repos/ace/tests/e2e/visual-validation.spec.ts`

**Test Categories**:
- **Rendering Verification** (7 tests)
  - 3D court renders after loading
  - Non-uniform pixel data (not solid color)
  - No WebGL errors
  - Multiple 3D scenes render independently
  - Consistent rendering across reloads

- **Interaction Validation** (2 tests)
  - Camera movement changes view
  - UI controls affect 3D scene

- **Loading States** (2 tests)
  - Loading screen transitions correctly
  - Progress reaches 100% before render

- **Performance** (2 tests)
  - Scene renders within time limit
  - Maintains stable frame rate

**Total**: 13 comprehensive visual validation tests

### 2. Documentation

**Quick Start Guide**: `tests/e2e/VISUAL_TESTING_QUICKSTART.md`
- 5-minute setup instructions
- Common commands
- Troubleshooting guide
- Threshold guidelines

**Detailed Documentation**: `tests/e2e/VISUAL_VALIDATION.md`
- Test structure explained
- Snapshot management
- CI/CD integration
- Advanced techniques
- Best practices

**Summary**: `docs/VISUAL_VALIDATION_SUMMARY.md` (this file)

### 3. Setup Automation

**Script**: `scripts/setup-visual-tests.sh`
- Automated dependency installation
- Playwright browser setup
- Baseline generation
- Initial test execution
- Next steps guidance

**Usage**:
```bash
chmod +x scripts/setup-visual-tests.sh
./scripts/setup-visual-tests.sh
```

### 4. Dependencies Added

**Added to `package.json`**:
```json
{
  "devDependencies": {
    "pngjs": "^7.0.0",
    "@types/pngjs": "^6.0.5"
  }
}
```

## How It Works

### 1. Basic Rendering Verification

```typescript
test('3D court should render', async ({ page }) => {
  // Navigate to page
  await page.goto('/');

  // Wait for loading to complete
  await page.waitForSelector('[data-testid="loading-screen"]', {
    state: 'hidden',
    timeout: 60000
  });

  // Allow scene to fully render
  await page.waitForTimeout(3000);

  // Capture screenshot
  const canvas = page.locator('canvas').first();
  const screenshot = await canvas.screenshot();

  // Verify screenshot has data (not blank)
  expect(screenshot.length).toBeGreaterThan(1000);

  // Visual regression test against baseline
  await expect(canvas).toHaveScreenshot('3d-court-rendered.png', {
    maxDiffPixels: 1000,  // Allow variance for animations
    threshold: 0.2        // 20% per-pixel difference allowed
  });
});
```

### 2. Interaction Validation

```typescript
test('camera movement changes view', async ({ page }) => {
  await page.goto('/facility-demo');
  await page.waitForLoadState('networkidle');

  const canvas = page.locator('canvas').first();

  // Capture initial view
  const before = await canvas.screenshot();

  // Simulate camera orbit
  const box = await canvas.boundingBox();
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();
  await page.mouse.move(centerX + 200, centerY);
  await page.mouse.up();
  await page.waitForTimeout(500);

  // Capture after interaction
  const after = await canvas.screenshot();

  // Views should be different
  expect(Buffer.compare(before, after)).not.toBe(0);
});
```

### 3. Pixel Analysis

```typescript
test('scene contains non-uniform pixels', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="loading-screen"]', {
    state: 'hidden'
  });

  const canvas = page.locator('canvas').first();
  const screenshot = await canvas.screenshot();

  // Parse PNG and sample pixels
  const png = PNG.sync.read(screenshot);
  const samples: number[] = [];
  const step = Math.floor(png.data.length / 400);

  for (let i = 0; i < png.data.length; i += step) {
    samples.push(png.data[i]);  // Sample red channel
  }

  // Calculate variance
  const mean = samples.reduce((a, b) => a + b) / samples.length;
  const variance = samples.reduce((sum, val) =>
    sum + Math.pow(val - mean, 2), 0) / samples.length;

  // Significant variance indicates 3D content (not solid color)
  expect(variance).toBeGreaterThan(100);
});
```

## Running the Tests

### First Time Setup

```bash
# Automated setup (recommended)
./scripts/setup-visual-tests.sh

# Manual setup
npm install
npx playwright install chromium
npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts
```

### Running Tests

```bash
# All visual validation tests
npm run test:e2e tests/e2e/visual-validation.spec.ts

# Headed mode (see browser)
npm run test:e2e:headed tests/e2e/visual-validation.spec.ts

# Debug mode (step through)
npm run test:e2e:debug tests/e2e/visual-validation.spec.ts

# View test report
npm run test:e2e:report
```

### Updating Baselines

```bash
# Update all baselines
npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts

# Update specific test
npm run test:e2e -- --update-snapshots -g "3D court should render"

# Commit updated baselines
git add tests/e2e/visual-validation.spec.ts-snapshots/
git commit -m "Update visual test baselines after UI changes"
```

## Test Output Examples

### ✅ Passing Test
```
✓ 3D court should render after loading completes (5.2s)
✓ 3D scene should contain non-uniform pixel data (4.8s)
✓ Camera movement changes view (3.9s)

3 passed (14s)
```

### ❌ Visual Regression Detected
```
✗ 3D court should render after loading completes (5.2s)

  Error: Screenshot comparison failed:
    Expected: tests/e2e/visual-validation.spec.ts-snapshots/3d-court-rendered.png
    Actual:   tests/e2e/visual-validation.spec.ts-snapshots/3d-court-rendered-actual.png
    Diff:     tests/e2e/visual-validation.spec.ts-snapshots/3d-court-rendered-diff.png

  2,347 pixels (3.2%) differ from baseline
```

**Resolution**:
1. View diff: `npm run test:e2e:report`
2. If change is intentional: `--update-snapshots`
3. If regression: fix rendering code

### ❌ Rendering Failure
```
✗ 3D scene should contain non-uniform pixel data (4.8s)

  Error: expect(received).toBeGreaterThan(expected)
    Expected: > 100
    Received: 0
```

**Diagnosis**: Scene rendering solid color (not 3D content)

**Actions**:
1. Check console for WebGL errors
2. Verify asset loading completed
3. Review scene initialization code

## Baseline Management

### Location
Baselines stored in:
```
tests/e2e/visual-validation.spec.ts-snapshots/
├── chromium/
│   ├── 3d-court-rendered.png
│   ├── consistent-render.png
│   └── [other baselines]
├── firefox/
│   └── [firefox-specific baselines]
└── webkit/
    └── [webkit-specific baselines]
```

### When to Update Baselines

**DO update when**:
- Intentional UI/3D changes
- Asset updates (models, textures)
- Lighting adjustments
- Camera position changes
- Design refinements

**DON'T update for**:
- Rendering bugs
- WebGL errors
- Loading failures
- Performance regressions

### Platform-Specific Baselines

Generate for each browser:
```bash
npm run test:e2e -- --update-snapshots --project=chromium
npm run test:e2e -- --update-snapshots --project=firefox
npm run test:e2e -- --update-snapshots --project=webkit
```

## Comparison Thresholds

### Configuration Options

```typescript
await expect(canvas).toHaveScreenshot('baseline.png', {
  maxDiffPixels: 1000,  // Maximum different pixels allowed
  threshold: 0.2        // Per-pixel difference threshold (0-1)
});
```

### Recommended Values

| Scene Type | maxDiffPixels | threshold | Use Case |
|------------|---------------|-----------|----------|
| Static UI | 100 | 0.1 | No animations |
| Animated scenes | 1000 | 0.2 | Standard 3D |
| Dynamic lighting | 2000 | 0.3 | Complex lighting |
| Particle effects | 3000 | 0.4 | Heavy animations |

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Visual Validation Tests

on: [pull_request]

jobs:
  visual-tests:
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

      - name: Run visual validation tests
        run: npm run test:e2e tests/e2e/visual-validation.spec.ts

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: visual-test-results
          path: |
            tests/e2e/visual-validation.spec.ts-snapshots/
            playwright-report/

      - name: Upload failure screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-test-failures
          path: |
            tests/e2e/visual-validation.spec.ts-snapshots/*-actual.png
            tests/e2e/visual-validation.spec.ts-snapshots/*-diff.png
```

## Troubleshooting

### Common Issues

#### 1. Test Timeout
**Symptom**: Tests timeout waiting for loading screen

**Solutions**:
```typescript
// Increase timeout
await page.waitForSelector('[data-testid="loading-screen"]', {
  state: 'hidden',
  timeout: 90000  // 90 seconds for large assets
});
```

#### 2. Screenshot Has No Data
**Symptom**: `screenshot.length` is very small

**Causes**:
- Canvas not rendering
- WebGL initialization failed
- Assets not loaded

**Debug**:
```bash
# Run in headed mode to see what's happening
npm run test:e2e:headed tests/e2e/visual-validation.spec.ts

# Check console errors
npm run monitor:errors
```

#### 3. Variance Too Low
**Symptom**: Scene rendering solid color

**Causes**:
- Lighting not configured
- Models not loaded
- Camera position wrong

**Fix**: Review scene initialization in browser DevTools

#### 4. Flaky Tests
**Symptom**: Tests pass/fail intermittently

**Solutions**:
```typescript
// Add stabilization wait
await page.waitForTimeout(3000);

// Increase thresholds
await expect(canvas).toHaveScreenshot('baseline.png', {
  maxDiffPixels: 2000,  // More lenient
  threshold: 0.3
});
```

## Performance Targets

| Metric | Target | Measured By |
|--------|--------|-------------|
| Render time | < 10s | Time to first screenshot |
| Frame rate | > 30 FPS | `requestAnimationFrame` counter |
| Screenshot size | > 1KB | Buffer length |
| Pixel variance | > 100 | Standard deviation |

## Best Practices

### 1. Wait for Stability
```typescript
// ❌ Bad: Screenshot too early
await page.goto('/');
await canvas.screenshot();

// ✅ Good: Wait for scene to stabilize
await page.goto('/');
await page.waitForSelector('[data-testid="loading-screen"]', {
  state: 'hidden'
});
await page.waitForTimeout(3000);
await canvas.screenshot();
```

### 2. Consistent Viewport
```typescript
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
});
```

### 3. Verify Before Compare
```typescript
// First verify rendering occurred
const screenshot = await canvas.screenshot();
expect(screenshot.length).toBeGreaterThan(1000);

// Then compare against baseline
await expect(canvas).toHaveScreenshot('baseline.png');
```

### 4. Meaningful Names
```typescript
// ❌ Vague
test('canvas test', ...);

// ✅ Descriptive
test('3D court should render with correct lighting after scene load', ...);
```

## Testing Strategy

### Unit vs Visual Tests

| Aspect | Unit Tests | Visual Tests |
|--------|-----------|--------------|
| **Scope** | Component logic | Actual rendering |
| **Speed** | Fast (ms) | Slower (seconds) |
| **Precision** | Exact values | Fuzzy matching |
| **Detects** | Logic errors | Visual regressions |
| **Run On** | Every commit | Pull requests |

**Use both together**:
- Unit tests verify component behavior
- Visual tests verify rendering output

## Benefits

### What Visual Tests Catch

1. **WebGL Errors**: Shader compilation failures
2. **Asset Loading**: Missing models/textures
3. **Rendering Bugs**: Black screens, solid colors
4. **Visual Regressions**: Unintended UI changes
5. **Performance Issues**: Slow render times
6. **Browser Compatibility**: Cross-browser rendering

### What They Don't Replace

- Unit tests for component logic
- Integration tests for API interactions
- Performance benchmarks for optimization
- Accessibility audits for WCAG compliance

## Next Steps

### Immediate
1. ✅ Run setup script: `./scripts/setup-visual-tests.sh`
2. ✅ Generate baselines
3. ✅ Run tests to verify
4. ✅ Review test report

### Short Term
1. Integrate into CI/CD pipeline
2. Add tests for new 3D features
3. Set up baseline review process
4. Document visual testing standards

### Long Term
1. Expand test coverage to all 3D scenes
2. Implement automated baseline updates
3. Set up visual regression tracking dashboard
4. Create visual testing guidelines for team

## Resources

### Documentation
- Quick start: `tests/e2e/VISUAL_TESTING_QUICKSTART.md`
- Detailed guide: `tests/e2e/VISUAL_VALIDATION.md`
- This summary: `docs/VISUAL_VALIDATION_SUMMARY.md`

### External Resources
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [pngjs Documentation](https://github.com/lukeapage/pngjs)
- [Three.js Testing Best Practices](https://threejs.org/docs/#manual/en/introduction/Testing)
- [WebGL Testing Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

## Support

**Issues?** Open a GitHub issue with:
- Test output
- Screenshots (actual, expected, diff)
- Browser console errors
- Steps to reproduce

---

**Status**: ✅ Implementation complete and ready for use

**Last Updated**: 2025-11-22

**Test Coverage**: 13 visual validation tests across 4 categories
