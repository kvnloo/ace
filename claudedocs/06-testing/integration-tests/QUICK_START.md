# Loading System Tests - Quick Start Guide

Quick reference for running the comprehensive loading system integration tests.

## Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install --with-deps
```

## Quick Commands

### Run All Tests

```bash
# Run all E2E tests (including loading system tests)
npm run test:e2e

# Run all tests (unit + E2E)
npm run test:all

# Run CI test suite (with coverage)
npm run test:ci
```

### Run Loading System Tests

```bash
# Run only loading system integration tests
npm run test:e2e:loading

# Run with interactive UI
npm run test:e2e:loading:ui

# Run with browser visible
npm run test:e2e:loading -- --headed

# Debug specific test
npm run test:e2e:debug -- -g "Complete loading flow"
```

### Run Visual Regression Tests

```bash
# Run all visual tests
npm run test:visual

# Run with browser visible
npm run test:visual -- --headed

# Update visual baselines (after intentional changes)
npm run test:visual:update
```

### Run Both Loading + Visual Tests

```bash
# Run all integration tests
npm run test:integration

# With UI
npm run test:integration -- --ui

# On specific browser
npm run test:integration -- --project=chromium
```

## Test Structure

```
e2e/
├── loading-system.spec.ts       # Main integration tests (16 tests)
├── visual-regression.spec.ts    # Visual regression tests (13 tests)
├── example-3d-demo.spec.ts      # Example tests
└── helpers/
    └── loading-test-utils.ts    # Reusable test utilities
```

## What Gets Tested

### Complete Flow (loading-system.spec.ts)

✅ App initialization → LoadingProvider setup
✅ Navigation to FACILITY_DEMO view
✅ Asset registration (LazyThreeScene)
✅ LoadingProgress displays correctly
✅ Assets load with priority queue
✅ Loading completes after minimum time (1.5s)
✅ 3D scene renders without errors
✅ Canvas stays visible (no blanking) ← **Recent Fix**
✅ User can interact with scene

### Error Scenarios

✅ No assets registered (timeout fallback)
✅ Asset load failures (network errors)
✅ Rapid view switching
✅ Browser refresh during loading

### Edge Cases

✅ Slow network connection
✅ Mobile viewport
✅ Skip button functionality
✅ Multiple navigation cycles

### Visual Regression (visual-regression.spec.ts)

✅ Loading screen appearance
✅ Canvas renders with content (not blank)
✅ Canvas never blanks after loading ← **Recent Fix**
✅ Canvas persists during interactions
✅ Smooth transitions
✅ Cross-browser consistency

## Understanding Results

### Test Output

```
Running 16 tests using 4 workers
  ✓ e2e/loading-system.spec.ts:23:3 › Complete loading flow (5.2s)
  ✓ e2e/loading-system.spec.ts:54:3 › Assets registered before loading (2.1s)
  ...

16 passed (1.2m)
```

### Screenshots

Failed tests automatically capture:
- Screenshot of failure state
- Video recording of test
- Trace for debugging

Location: `test-results/`

### HTML Report

```bash
# View detailed HTML report
npx playwright show-report
```

## Debugging Failed Tests

### Interactive Debug Mode

```bash
# Debug specific test
npx playwright test --debug -g "Canvas never blanks"

# Or use debug script
npm run test:e2e:debug -- -g "Canvas never blanks"
```

### Check Artifacts

After test failure:

```bash
# View screenshots
ls test-results/

# View HTML report
npx playwright show-report

# View specific trace
npx playwright show-trace test-results/<trace-file>.zip
```

### Common Failures

**Timeout Errors:**
- Increase timeout: `test.setTimeout(60000)`
- Check network in CI environment

**Visual Differences:**
- Review diff in HTML report
- Update baseline if intentional: `npm run test:visual:update`

**Canvas Blanking:**
- Check App.tsx `loadingComplete` state
- Verify PersistentThreeScene stays mounted

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Test Performance

Expected test durations:

| Test Suite | Duration | Tests |
|------------|----------|-------|
| loading-system.spec.ts | ~90s | 16 |
| visual-regression.spec.ts | ~120s | 13 |
| Total Integration | ~3-4min | 29 |

## Next Steps

After running tests:

1. ✅ All passing? Great! System is working correctly.
2. ❌ Some failing? Check `LOADING_SYSTEM_TESTS.md` for troubleshooting.
3. 🎨 Visual differences? Review screenshots and update baselines if intentional.
4. 📊 Want more detail? See full documentation in `LOADING_SYSTEM_TESTS.md`.

## Related Documentation

- **Full Documentation**: `/tests/integration/LOADING_SYSTEM_TESTS.md`
- **Manual Testing**: `/tests/MANUAL_VERIFICATION.md`
- **Test Helpers**: `/e2e/helpers/loading-test-utils.ts`
- **Playwright Config**: `/playwright.config.ts`
