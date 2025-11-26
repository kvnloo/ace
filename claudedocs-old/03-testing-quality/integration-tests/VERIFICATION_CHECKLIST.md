# Integration Tests Verification Checklist

Use this checklist to verify the integration test implementation is complete and working correctly.

## Pre-Verification Setup

- [ ] Dependencies installed: `npm install`
- [ ] Playwright browsers installed: `npx playwright install --with-deps`
- [ ] Development server can start: `npm run dev`

## File Structure Verification

### Test Files
- [ ] `/e2e/loading-system.spec.ts` exists (16 tests)
- [ ] `/e2e/visual-regression.spec.ts` exists (13 tests)
- [ ] `/e2e/helpers/loading-test-utils.ts` exists (25+ utilities)
- [ ] `/e2e/example-3d-demo.spec.ts` exists (pre-existing)

### Documentation
- [ ] `/tests/integration/LOADING_SYSTEM_TESTS.md` exists
- [ ] `/tests/integration/QUICK_START.md` exists
- [ ] `/tests/integration/README.md` exists
- [ ] `/tests/integration/IMPLEMENTATION_SUMMARY.md` exists
- [ ] `/tests/integration/VERIFICATION_CHECKLIST.md` exists (this file)

### Configuration
- [ ] `package.json` has test scripts added
- [ ] `package.json` has required dependencies
- [ ] `playwright.config.ts` exists and configured

## Test Execution Verification

### Basic Test Runs

```bash
# Run these commands and verify they work:

# 1. All E2E tests
npm run test:e2e
# Expected: Tests run without errors

# 2. Loading system tests only
npm run test:e2e:loading
# Expected: 16 tests run and pass

# 3. Visual regression tests
npm run test:visual
# Expected: 13 tests run (may fail on first run - need baselines)

# 4. Integration tests (loading + visual)
npm run test:integration
# Expected: 29 tests run

# 5. Interactive UI mode
npm run test:e2e:ui
# Expected: Playwright UI opens
```

### Test Results Checklist

- [ ] All 16 loading system tests pass
- [ ] All 13 visual regression tests pass (after baseline generation)
- [ ] No timeout errors
- [ ] No console errors (except DevTools warnings)
- [ ] Test duration <5 minutes for full suite
- [ ] HTML report generates: `npx playwright show-report`

## Test Coverage Verification

### User Flows
- [ ] Complete flow test passes (home → demo → loading → scene → interaction)
- [ ] Asset registration test passes
- [ ] Progress tracking test passes
- [ ] Canvas blanking prevention test passes ← **Critical**
- [ ] Minimum display time test passes ← **Critical**
- [ ] User interaction test passes

### Error Scenarios
- [ ] No assets timeout test passes
- [ ] Asset failure handling test passes
- [ ] Rapid view switching test passes
- [ ] Browser refresh test passes

### Edge Cases
- [ ] Slow network test passes
- [ ] Mobile viewport test passes
- [ ] Multiple navigation cycles test passes

### Visual Tests
- [ ] Loading screen visual baseline created
- [ ] Canvas rendered visual baseline created
- [ ] No blanking visual test passes ← **Critical**
- [ ] Canvas persistence visual test passes ← **Critical**

## Utility Function Verification

### Test each helper independently:

```typescript
// In browser console or test file:
import {
  waitForLoadingScreen,
  waitForLoadingComplete,
  verifyCanvasRendered,
  hasCanvasContent,
  waitForStableCanvas,
} from './e2e/helpers/loading-test-utils';

// Verify each function works as expected
```

- [ ] `waitForLoadingScreen()` detects loading screen
- [ ] `waitForLoadingComplete()` waits for completion
- [ ] `verifyCanvasRendered()` correctly identifies rendered canvas
- [ ] `hasCanvasContent()` detects canvas pixels
- [ ] `waitForStableCanvas()` waits for stability
- [ ] `setupConsoleErrorMonitoring()` captures errors
- [ ] `rotateCamera()` simulates interaction
- [ ] `startFPSMeasurement()` / `getFPSMetrics()` work

## Documentation Verification

### LOADING_SYSTEM_TESTS.md
- [ ] Overview is clear and complete
- [ ] Test descriptions are accurate
- [ ] Running instructions work
- [ ] Configuration details are correct
- [ ] Coverage matrix is complete
- [ ] Critical fixes documented
- [ ] Troubleshooting guide is helpful

### QUICK_START.md
- [ ] Prerequisites are clear
- [ ] Quick commands work
- [ ] Examples are accurate
- [ ] Next steps are helpful

### README.md
- [ ] Overview is complete
- [ ] File structure is accurate
- [ ] Test coverage summary is correct
- [ ] Running instructions work

## Critical Fix Verification

### Canvas Blanking Fix
**Manual verification:**
1. Start dev server: `npm run dev`
2. Navigate to 3D demo
3. Wait for loading to complete
4. Observe canvas for 5 seconds
5. Verify: **Canvas NEVER blanks out**

**Automated verification:**
- [ ] Test 4 passes: "Canvas never blanks after initial render"
- [ ] Visual test passes: "Canvas never blanks after minimum display time"
- [ ] Visual test passes: "Canvas content persists during rapid interactions"

### Minimum Display Time
**Manual verification:**
1. Start dev server
2. Navigate to 3D demo
3. Time the loading screen display
4. Verify: **Loading screen displays for at least 1.5 seconds**

**Automated verification:**
- [ ] Test 5 passes: "Minimum display time is enforced"

## Performance Benchmarks

Run tests and verify metrics:

```bash
npm run test:integration
# Check test output for durations
```

- [ ] Loading completes in <30s
- [ ] Minimum display time ≥1.5s
- [ ] Scene FPS ≥30fps
- [ ] Asset registration <5s
- [ ] Full test suite <5 minutes

## CI/CD Verification

### Local CI Simulation

```bash
# Simulate CI environment
CI=true npm run test:ci
```

- [ ] Tests run in CI mode
- [ ] Retries work (2 retries configured)
- [ ] Screenshots captured on failure
- [ ] Videos captured on failure
- [ ] HTML report generated

### GitHub Actions (if applicable)

```yaml
# Add to .github/workflows/test.yml
- name: Run Integration Tests
  run: npm run test:integration
```

- [ ] Workflow file exists
- [ ] Tests run on push
- [ ] Artifacts uploaded
- [ ] Test results visible

## Browser Compatibility

Run tests on each browser:

```bash
# Chromium
npx playwright test --project=chromium

# Firefox
npx playwright test --project=firefox

# WebKit
npx playwright test --project=webkit
```

- [ ] All tests pass on Chromium
- [ ] All tests pass on Firefox
- [ ] All tests pass on WebKit
- [ ] Mobile viewports work

## Visual Baseline Management

### Initial Baseline Creation

```bash
# Run visual tests to create baselines
npm run test:visual
# First run may fail - this is expected
```

- [ ] Screenshot directory created
- [ ] Baseline images saved
- [ ] Re-run passes after baselines created

### Baseline Updates

```bash
# After intentional visual changes
npm run test:visual:update
```

- [ ] Update command works
- [ ] New baselines saved
- [ ] Tests pass with new baselines

## Error Handling Verification

### Simulate Errors

```typescript
// In test file, simulate:
- Network failures
- Asset load errors
- Timeout scenarios
- Rapid navigation
```

- [ ] Network errors handled gracefully
- [ ] Asset failures don't crash app
- [ ] Timeouts trigger fallback
- [ ] Console errors captured

## Documentation Accuracy

### Run Examples from Docs

From LOADING_SYSTEM_TESTS.md:
- [ ] All code examples run without modification
- [ ] All commands work as documented
- [ ] Expected outputs match actual results

From QUICK_START.md:
- [ ] All quick commands work
- [ ] Setup instructions are accurate
- [ ] Troubleshooting steps help

## Maintenance Preparation

### Test Health Monitoring

- [ ] Baseline test durations recorded
- [ ] Pass rate tracked (should be 100%)
- [ ] Flaky tests identified (should be none)
- [ ] Coverage gaps documented

### Update Procedures

- [ ] Baseline update process documented
- [ ] New test addition guide clear
- [ ] Maintenance schedule defined

## Final Verification

### Complete Test Run

```bash
# Run everything
npm run test:all
```

- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] No errors in output
- [ ] HTML report clean

### Manual Testing

Use `/tests/MANUAL_VERIFICATION.md`:
- [ ] Manual loading flow works
- [ ] Canvas renders correctly
- [ ] No blanking observed
- [ ] User interaction smooth

## Sign-Off Checklist

- [ ] All test files created and functional
- [ ] All documentation complete and accurate
- [ ] All tests passing (29/29)
- [ ] Critical fixes verified (canvas blanking, minimum time)
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility confirmed
- [ ] CI/CD ready
- [ ] Visual baselines established
- [ ] Maintenance procedures documented
- [ ] Team trained on running tests

## Known Issues / Notes

Document any issues found during verification:

```
Issue: [Description]
Status: [Open/Resolved]
Workaround: [If applicable]
```

## Next Steps

After verification:

1. ✅ Commit test files to repository
2. ✅ Set up CI/CD integration
3. ✅ Train team on running tests
4. ✅ Establish test maintenance schedule
5. ✅ Add tests to PR checklist

## Verification Complete

Date: _______________
Verified By: _______________
Notes: _______________

---

**Status**: Ready for production ✅
