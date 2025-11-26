# Visual Validation Testing

This directory contains visual regression tests that verify 3D scenes are **actually rendering**, not just checking if canvas elements exist.

## Problem Solved

Previous tests only verified structural elements:
```typescript
// ❌ Only checks canvas exists
const canvas = page.locator('canvas');
await expect(canvas).toBeVisible();
```

Visual validation tests verify **actual rendering**:
```typescript
// ✅ Verifies scene is rendering 3D content
const screenshot = await canvas.screenshot();
expect(screenshot.length).toBeGreaterThan(1000);
await expect(canvas).toHaveScreenshot('baseline.png');
```

## Test Categories

### 1. Rendering Verification
- **3D court renders after loading**: Verifies scene appears after loading screen
- **Non-uniform pixel data**: Ensures canvas contains actual 3D content, not solid color
- **No WebGL errors**: Checks for rendering errors in console

### 2. Interaction Validation
- **Camera movement**: Verifies scene updates when user orbits camera
- **Control interaction**: Validates UI controls affect 3D scene
- **Multiple scenes**: Ensures independent rendering of multiple canvases

### 3. Consistency Testing
- **Reload consistency**: Verifies deterministic rendering across page reloads
- **Baseline comparison**: Visual regression against known good states

### 4. Performance Validation
- **Render time**: Ensures scene renders within acceptable time
- **Frame rate**: Monitors FPS to detect performance issues

## Running Tests

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate baseline screenshots:**
   ```bash
   npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts
   ```

   This creates baseline screenshots in `tests/e2e/visual-validation.spec.ts-snapshots/`

### Running Visual Tests

```bash
# Run all visual validation tests
npm run test:e2e tests/e2e/visual-validation.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed tests/e2e/visual-validation.spec.ts

# Run in debug mode (step through)
npm run test:e2e:debug tests/e2e/visual-validation.spec.ts

# Update snapshots after intentional UI changes
npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts
```

### Interpreting Results

#### ✅ Passing Test
```
✓ 3D court should render after loading completes (5.2s)
```
Scene rendered correctly and matches baseline.

#### ❌ Failing Test - Visual Regression
```
✗ 3D court should render after loading completes (5.2s)
  Error: Screenshot comparison failed:
  Expected: 3d-court-rendered.png
  Actual:   3d-court-rendered-actual.png
  Diff:     3d-court-rendered-diff.png
```

**Resolution:**
1. Check diff image in test output
2. If change is intentional: update baseline with `--update-snapshots`
3. If change is a bug: fix rendering code

#### ❌ Failing Test - Not Rendering
```
✗ 3D scene should contain non-uniform pixel data
  Error: expect(received).toBeGreaterThan(expected)
  Expected: > 100
  Received: 0
```

Scene is rendering solid color (not 3D content). Check:
- WebGL initialization errors
- Asset loading failures
- Scene setup code

## Test Structure

### Basic Rendering Test
```typescript
test('3D court should render', async ({ page }) => {
  // 1. Navigate and wait for loading
  await page.goto('/');
  await page.waitForSelector('[data-testid="loading-screen"]', {
    state: 'hidden',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  // 2. Verify canvas has content
  const canvas = page.locator('canvas').first();
  const screenshot = await canvas.screenshot();
  expect(screenshot.length).toBeGreaterThan(1000);

  // 3. Visual regression test
  await expect(canvas).toHaveScreenshot('baseline.png', {
    maxDiffPixels: 1000,
    threshold: 0.2
  });
});
```

### Interaction Test
```typescript
test('camera movement changes view', async ({ page }) => {
  await page.goto('/facility-demo');
  await page.waitForLoadState('networkidle');

  const canvas = page.locator('canvas').first();

  // Capture before interaction
  const before = await canvas.screenshot();

  // Perform interaction
  await canvas.hover({ position: { x: 200, y: 200 } });
  await page.mouse.down();
  await page.mouse.move(400, 200);
  await page.mouse.up();
  await page.waitForTimeout(500);

  // Capture after interaction
  const after = await canvas.screenshot();

  // Verify change occurred
  expect(Buffer.compare(before, after)).not.toBe(0);
});
```

### Pixel Analysis Test
```typescript
test('scene contains non-uniform pixels', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="loading-screen"]', {
    state: 'hidden',
    timeout: 60000
  });

  const canvas = page.locator('canvas').first();
  const screenshot = await canvas.screenshot();

  // Parse PNG and analyze pixel variance
  const png = PNG.sync.read(screenshot);
  const samples: number[] = [];

  for (let i = 0; i < png.data.length; i += 400) {
    samples.push(png.data[i]);
  }

  const mean = samples.reduce((a, b) => a + b) / samples.length;
  const variance = samples.reduce((sum, val) =>
    sum + Math.pow(val - mean, 2), 0) / samples.length;

  // Variance should indicate 3D content, not solid color
  expect(variance).toBeGreaterThan(100);
});
```

## Snapshot Management

### Baseline Location
Snapshots stored in: `tests/e2e/visual-validation.spec.ts-snapshots/`

### When to Update Baselines

**Update baselines when:**
- Intentional UI/3D scene changes
- Asset updates (models, textures)
- Lighting changes
- Camera default position changes

**Don't update for:**
- Rendering bugs
- WebGL errors
- Loading failures
- Performance regressions

### Platform-Specific Snapshots

Playwright can generate platform-specific baselines:
```bash
# Generate baselines for each OS
npm run test:e2e -- --update-snapshots --project=chromium
npm run test:e2e -- --update-snapshots --project=firefox
npm run test:e2e -- --update-snapshots --project=webkit
```

Snapshots organized by browser:
```
visual-validation.spec.ts-snapshots/
├── chromium/
│   └── 3d-court-rendered.png
├── firefox/
│   └── 3d-court-rendered.png
└── webkit/
    └── 3d-court-rendered.png
```

## Configuration

### Comparison Thresholds

Adjust in individual tests:
```typescript
await expect(canvas).toHaveScreenshot('baseline.png', {
  maxDiffPixels: 1000,  // Maximum different pixels allowed
  threshold: 0.2        // 20% per-pixel difference threshold
});
```

**Guidelines:**
- Static scenes: `maxDiffPixels: 100`, `threshold: 0.1`
- Animated scenes: `maxDiffPixels: 1000`, `threshold: 0.2`
- Dynamic lighting: `maxDiffPixels: 2000`, `threshold: 0.3`

### Timeouts

```typescript
// Loading timeout
await page.waitForSelector('[data-testid="loading-screen"]', {
  state: 'hidden',
  timeout: 60000  // 60 seconds for large assets
});

// Render stabilization
await page.waitForTimeout(3000);  // Allow scene to fully render
```

## CI/CD Integration

### GitHub Actions Example
```yaml
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
```

### Handling Failures

1. **Review diff images** in CI artifacts
2. **Verify change is intentional**
3. **Update baselines** if approved
4. **Commit new baselines** to repository

## Troubleshooting

### Test Fails: "Screenshot has no data"
**Cause**: Canvas not rendering

**Solutions:**
- Check WebGL initialization
- Verify asset loading completed
- Check console for errors
- Increase wait timeout

### Test Fails: "Variance too low"
**Cause**: Scene rendering solid color

**Solutions:**
- Check lighting setup
- Verify models loaded
- Check camera position
- Review shader compilation

### Test Fails: "Screenshots don't match"
**Cause**: Visual regression

**Solutions:**
1. Review diff image: `playwright show-report`
2. If intentional: `--update-snapshots`
3. If bug: fix rendering code

### Test Timeout
**Cause**: Scene taking too long to render

**Solutions:**
- Optimize asset loading
- Reduce polygon count
- Check for loading bottlenecks
- Increase timeout value

## Best Practices

### 1. Wait for Stability
```typescript
// ❌ Too early
await page.goto('/');
await canvas.screenshot();  // May capture loading state

// ✅ Wait for scene to stabilize
await page.goto('/');
await page.waitForSelector('[data-testid="loading-screen"]', {
  state: 'hidden'
});
await page.waitForTimeout(3000);  // Allow render to complete
await canvas.screenshot();
```

### 2. Consistent Viewport
```typescript
test.beforeEach(async ({ page }) => {
  // Set consistent viewport for reproducible screenshots
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

### 4. Meaningful Test Names
```typescript
// ❌ Vague
test('canvas test', async ({ page }) => { ... });

// ✅ Descriptive
test('3D court should render with correct lighting after scene load', async ({ page }) => { ... });
```

### 5. Appropriate Thresholds
```typescript
// Static UI: strict comparison
await expect(canvas).toHaveScreenshot('static.png', {
  maxDiffPixels: 100,
  threshold: 0.1
});

// Animated scene: allow variance
await expect(canvas).toHaveScreenshot('animated.png', {
  maxDiffPixels: 1000,
  threshold: 0.2
});
```

## Visual Testing vs Unit Testing

| Aspect | Unit Tests | Visual Tests |
|--------|-----------|--------------|
| **Scope** | Component logic | Actual rendering |
| **Speed** | Fast (ms) | Slower (seconds) |
| **Precision** | Exact values | Fuzzy matching |
| **Detects** | Logic errors | Visual regressions |
| **Baseline** | Expected values | Reference screenshots |
| **CI/CD** | Every commit | Pull requests |

**Use both together:**
- Unit tests verify component behavior
- Visual tests verify rendering output

## Advanced Techniques

### Pixel Sampling
```typescript
// Sample specific regions
const png = PNG.sync.read(screenshot);
const centerX = png.width / 2;
const centerY = png.height / 2;
const idx = (png.width * centerY + centerX) << 2;
const r = png.data[idx];
const g = png.data[idx + 1];
const b = png.data[idx + 2];

// Verify center pixel is not black (scene rendered)
expect(r + g + b).toBeGreaterThan(0);
```

### Diff Visualization
```typescript
// Generate custom diff image
const before = await canvas.screenshot();
// ... interaction ...
const after = await canvas.screenshot();

const png1 = PNG.sync.read(before);
const png2 = PNG.sync.read(after);
const diff = new PNG({ width: png1.width, height: png1.height });

// Highlight changed pixels
for (let i = 0; i < png1.data.length; i++) {
  const delta = Math.abs(png1.data[i] - png2.data[i]);
  diff.data[i] = delta > 10 ? 255 : 0;
}

// Save custom diff
await page.screenshot({ path: 'custom-diff.png' });
```

### Performance Monitoring
```typescript
// Track render performance
const startTime = Date.now();
await page.goto('/');
await page.waitForSelector('[data-testid="loading-screen"]', {
  state: 'hidden'
});
const renderTime = Date.now() - startTime;

// Assert reasonable render time
expect(renderTime).toBeLessThan(5000);  // 5 seconds
```

## References

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [pngjs Documentation](https://github.com/lukeapage/pngjs)
- [Three.js Testing Best Practices](https://threejs.org/docs/#manual/en/introduction/Testing)
- [WebGL Testing Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
