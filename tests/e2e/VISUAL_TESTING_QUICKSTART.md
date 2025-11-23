# Visual Validation Testing - Quick Start

## The Problem
Tests were checking if canvas exists, but not if 3D scenes actually render.

## The Solution
Screenshot-based validation that verifies **actual rendering**.

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Baselines
```bash
npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts
```

### 3. Run Tests
```bash
npm run test:e2e tests/e2e/visual-validation.spec.ts
```

## What Gets Tested

| Test | What It Verifies |
|------|------------------|
| **3D court renders** | Scene appears after loading |
| **Camera movement** | Scene updates with interaction |
| **Pixel variance** | Canvas contains 3D content (not solid color) |
| **Reload consistency** | Deterministic rendering |
| **No WebGL errors** | Clean console output |
| **Frame rate** | Performance meets threshold |

## How It Works

### 1. Rendering Verification
```typescript
// Take screenshot
const canvas = page.locator('canvas').first();
const screenshot = await canvas.screenshot();

// Verify it has data
expect(screenshot.length).toBeGreaterThan(1000);

// Compare against baseline
await expect(canvas).toHaveScreenshot('3d-court.png');
```

### 2. Interaction Validation
```typescript
// Before interaction
const before = await canvas.screenshot();

// Orbit camera
await canvas.hover({ position: { x: 200, y: 200 } });
await page.mouse.down();
await page.mouse.move(400, 200);
await page.mouse.up();

// After interaction
const after = await canvas.screenshot();

// Should be different
expect(Buffer.compare(before, after)).not.toBe(0);
```

### 3. Pixel Analysis
```typescript
// Parse PNG
const png = PNG.sync.read(screenshot);

// Sample pixels
const samples = [];
for (let i = 0; i < png.data.length; i += 400) {
  samples.push(png.data[i]);
}

// Calculate variance
const variance = /* standard variance calculation */;

// Should have variety (3D content, not solid color)
expect(variance).toBeGreaterThan(100);
```

## Common Commands

```bash
# Run all visual tests
npm run test:e2e tests/e2e/visual-validation.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed tests/e2e/visual-validation.spec.ts

# Debug step-by-step
npm run test:e2e:debug tests/e2e/visual-validation.spec.ts

# Update baselines after UI changes
npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts

# View test report
npm run test:e2e:report
```

## When Tests Fail

### ❌ "Screenshots don't match"
**Cause**: Visual regression detected

**Fix:**
1. Run: `npm run test:e2e:report`
2. Review diff images
3. If change is intentional: `--update-snapshots`
4. If change is a bug: fix rendering code

### ❌ "Screenshot has no data"
**Cause**: Canvas not rendering

**Fix:**
1. Check browser console for WebGL errors
2. Verify assets are loading
3. Increase wait timeout

### ❌ "Variance too low"
**Cause**: Scene rendering solid color

**Fix:**
1. Check lighting setup
2. Verify models loaded
3. Review shader compilation

## Best Practices

### ✅ DO
- Wait for loading to complete before screenshots
- Use consistent viewport sizes
- Update baselines after intentional changes
- Review diff images before updating

### ❌ DON'T
- Update baselines blindly
- Take screenshots during animations
- Ignore WebGL errors
- Use tight thresholds for animated content

## File Structure

```
tests/e2e/
├── visual-validation.spec.ts          # Test suite
├── visual-validation.spec.ts-snapshots/ # Baselines
│   ├── 3d-court-rendered.png
│   └── consistent-render.png
├── VISUAL_VALIDATION.md               # Detailed docs
└── VISUAL_TESTING_QUICKSTART.md       # This file
```

## Baseline Management

### When to Update
- UI/3D scene changes (intentional)
- Asset updates
- Lighting changes
- Camera position changes

### How to Update
```bash
# All baselines
npm run test:e2e -- --update-snapshots tests/e2e/visual-validation.spec.ts

# Specific test
npm run test:e2e -- --update-snapshots -g "3D court should render"
```

### Commit Baselines
```bash
git add tests/e2e/visual-validation.spec.ts-snapshots/
git commit -m "Update visual test baselines after UI changes"
```

## Threshold Guidelines

| Scene Type | maxDiffPixels | threshold |
|------------|---------------|-----------|
| Static | 100 | 0.1 |
| Animated | 1000 | 0.2 |
| Dynamic lighting | 2000 | 0.3 |

```typescript
await expect(canvas).toHaveScreenshot('baseline.png', {
  maxDiffPixels: 1000,  // Maximum different pixels
  threshold: 0.2        // 20% per-pixel difference
});
```

## Integration with Existing Tests

Visual tests complement structural tests:

**Structural Test** (existing):
```typescript
test('canvas exists', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();  // ✅ Canvas exists
});
```

**Visual Test** (new):
```typescript
test('canvas renders 3D', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="loading-screen"]', {
    state: 'hidden'
  });
  const canvas = page.locator('canvas').first();
  const screenshot = await canvas.screenshot();
  expect(screenshot.length).toBeGreaterThan(1000);  // ✅ Actually rendering
});
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Render time | < 10 seconds |
| Frame rate | > 30 FPS |
| Screenshot size | > 1KB |
| Pixel variance | > 100 |

## Troubleshooting

### Timeouts
```typescript
// Increase timeout for slow scenes
await page.waitForSelector('[data-testid="loading-screen"]', {
  state: 'hidden',
  timeout: 60000  // 60 seconds
});
```

### Flaky Tests
```typescript
// Add stabilization wait
await page.waitForTimeout(3000);  // Let animations settle
```

### Platform Differences
```bash
# Generate per-platform baselines
npm run test:e2e -- --update-snapshots --project=chromium
npm run test:e2e -- --update-snapshots --project=firefox
```

## Next Steps

1. ✅ Run tests to verify setup
2. ✅ Generate baselines
3. ✅ Integrate into CI/CD
4. ✅ Review test reports regularly
5. ✅ Update baselines as UI evolves

## Resources

- Detailed docs: `tests/e2e/VISUAL_VALIDATION.md`
- Test suite: `tests/e2e/visual-validation.spec.ts`
- Playwright docs: https://playwright.dev/docs/test-snapshots
- Report issues: Open GitHub issue with screenshots

---

**Remember**: Visual tests verify **actual rendering**, not just structure. They catch regressions that structural tests miss.
