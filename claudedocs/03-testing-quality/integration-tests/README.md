# Integration Tests

This directory contains comprehensive integration tests for the loading system and other application workflows.

## Test Files Created

### 1. E2E Test Suites (`/e2e/`)

#### `/e2e/loading-system.spec.ts`
**16 comprehensive integration tests** covering the complete loading flow:

**Complete Flow Tests (6):**
- Complete loading flow: App → Assets → Loading → Scene
- Asset registration before loading screen
- Monotonic progress tracking
- Canvas blanking prevention (tests recent fix)
- Minimum display time enforcement
- User interaction capability

**Error Scenario Tests (4):**
- No assets registered (timeout fallback)
- Asset load failure handling
- Rapid view switching
- Browser refresh during loading

**Edge Case Tests (4):**
- Slow network connection
- Mobile viewport compatibility
- Skip button functionality
- Multiple navigation cycles

**Performance Tests (2):**
- Loading timeout compliance
- Acceptable FPS rendering (≥30fps)

#### `/e2e/visual-regression.spec.ts`
**13 visual regression tests** ensuring consistent rendering:

**Loading Screen Tests (2):**
- Loading screen appearance baseline
- Loading progress indicator visual

**Canvas Rendering Tests (4):**
- Canvas renders with content (not blank)
- Canvas stays visible after loading (tests canvas blanking fix)
- Canvas after camera interaction
- Mobile viewport rendering

**Cross-Browser Tests (1):**
- Consistent rendering across browsers

**Animation Tests (2):**
- Smooth loading to scene transition
- No flicker during transitions

**Error State Tests (1):**
- Fallback materials when assets fail

**Canvas Blanking Fix Tests (2):**
- Canvas never blanks after minimum display time
- Canvas persists during rapid interactions

#### `/e2e/example-3d-demo.spec.ts`
**11 example tests** for 3D demo workflow (pre-existing)

### 2. Test Utilities

#### `/e2e/helpers/loading-test-utils.ts`
Reusable helper functions for loading system tests:

**Loading Screen Helpers:**
- `waitForLoadingScreen()` - Wait for loading screen to appear
- `waitForLoadingComplete()` - Wait for loading to finish
- `getLoadingProgress()` - Get current progress data

**Canvas Verification:**
- `verifyCanvasRendered()` - Check canvas is visible with content
- `hasCanvasContent()` - Verify canvas has rendered pixels
- `waitForStableCanvas()` - Wait for rendering to stabilize
- `getCanvasHash()` - Get canvas content hash for comparison

**Navigation:**
- `navigateTo3DDemo()` - Navigate to FACILITY_DEMO view
- `navigateToHome()` - Navigate to home page
- `rotateCamera()` - Simulate camera rotation

**Performance:**
- `startFPSMeasurement()` - Begin FPS tracking
- `getFPSMetrics()` - Get FPS performance data
- `monitorLoadingProgress()` - Track progress with callback

**Error Handling:**
- `setupConsoleErrorMonitoring()` - Monitor console errors
- `expectNoConsoleErrors()` - Verify no critical errors

**Network Simulation:**
- `simulateSlowNetwork()` - Add network latency
- `blockAssetTypes()` - Block specific asset types

### 3. Documentation

#### `/tests/integration/LOADING_SYSTEM_TESTS.md`
**Comprehensive test documentation** including:
- Test suite overview
- Detailed test descriptions
- Running instructions
- Configuration details
- Coverage matrix
- Critical fixes tested (canvas blanking, minimum display time)
- Debugging guide
- CI/CD integration
- Performance benchmarks
- Troubleshooting guide
- Future enhancements

#### `/tests/integration/QUICK_START.md`
**Quick reference guide** for:
- Running tests
- Common commands
- Understanding results
- Debugging failures
- Expected performance metrics

## Test Coverage

### User Paths Tested

✅ Complete flow: Home → Navigation → Loading → Scene → Interaction
✅ Error recovery: Asset failures, network issues, timeouts
✅ Edge cases: Mobile, slow network, rapid navigation, multiple cycles
✅ Visual consistency: No blanking, smooth transitions, cross-browser
✅ Performance: Loading time, FPS, responsiveness

### Critical Fixes Verified

#### Canvas Blanking Fix
**Problem:** Canvas would blank out after loading completed.
**Solution:** Keep PersistentThreeScene mounted when `loadingComplete` is true.
**Tests:**
- Test 4: "Canvas never blanks after initial render"
- Visual: "Canvas never blanks after minimum display time"
- Visual: "Canvas content persists during rapid interactions"

#### Minimum Display Time
**Problem:** Loading screen could flash too quickly.
**Solution:** Enforce 1.5s minimum display time in LoadingProgress.
**Tests:**
- Test 5: "Minimum display time is enforced"

## Running Tests

### Quick Start

```bash
# Install dependencies and browsers (first time)
npm install
npx playwright install --with-deps

# Run all integration tests
npm run test:integration

# Run with UI
npm run test:integration -- --ui

# Run loading system tests only
npm run test:e2e:loading

# Run visual regression tests
npm run test:visual
```

### All Available Commands

```bash
npm run test:e2e              # All E2E tests
npm run test:e2e:ui           # Interactive mode
npm run test:e2e:headed       # Browser visible
npm run test:e2e:debug        # Debug mode
npm run test:e2e:loading      # Loading tests only
npm run test:e2e:loading:ui   # Loading tests (UI mode)
npm run test:visual           # Visual regression tests
npm run test:visual:update    # Update baselines
npm run test:integration      # Loading + Visual tests
npm run test:all              # Unit + E2E tests
npm run test:ci               # CI test suite
```

## Test Architecture

### Test Data Flow

```
1. User Action (navigate to demo)
   ↓
2. LoadingProvider initializes
   ↓
3. LazyThreeScene registers assets
   ↓
4. LoadingProgress tracks progress
   ↓
5. Assets load via priority queue
   ↓
6. Loading completes (min 1.5s)
   ↓
7. PersistentThreeScene renders
   ↓
8. User can interact with scene
```

### Test Verification Points

- ✅ LoadingProvider context available
- ✅ Assets registered with priorities
- ✅ Progress updates monotonically
- ✅ Loading screen displays correctly
- ✅ Minimum display time enforced
- ✅ Canvas renders without blanking
- ✅ Scene is interactive
- ✅ No console errors

## Requirements for Components

For tests to work correctly, components should expose test attributes:

```typescript
// Example: LoadingProgress component
<div
  data-testid="loading-progress"
  data-progress={overallProgress}
  data-loaded={loadedAssets}
  data-total={totalAssets}
>
  {/* ... */}
</div>

// Example: Canvas element
<Canvas data-testid="threejs-canvas">
  {/* ... */}
</Canvas>
```

## Performance Expectations

| Metric | Target | Test |
|--------|--------|------|
| Loading Time | < 30s | Test 15 |
| Minimum Display | ≥ 1.5s | Test 5 |
| Scene FPS | ≥ 30fps | Test 16 |
| Asset Registration | < 5s | Test 2 |

## CI/CD Integration

Tests are configured for CI environments:

```yaml
# .github/workflows/test.yml example
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run Integration Tests
  run: npm run test:integration

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Common Issues

**Tests timeout:**
- Check network in CI environment
- Increase timeout values if needed

**Visual tests fail:**
- Review screenshot diffs in HTML report
- Update baselines if changes are intentional: `npm run test:visual:update`

**Canvas blanking detected:**
- Verify App.tsx `loadingComplete` state management
- Check PersistentThreeScene mounting logic

**Flaky tests:**
- Add `waitForLoadState('networkidle')`
- Use `waitForStableCanvas()` for visual tests
- Check for race conditions

## Future Enhancements

### Planned Tests
- [ ] Asset priority queue ordering verification
- [ ] Memory usage monitoring during loading
- [ ] Error recovery and retry logic
- [ ] Accessibility testing (screen readers)
- [ ] Performance regression detection

### Infrastructure
- [ ] Custom Playwright matchers for 3D testing
- [ ] Visual diff tool for canvas content
- [ ] Integration with visual regression service
- [ ] Load testing for concurrent users

## Resources

- [LOADING_SYSTEM_TESTS.md](./LOADING_SYSTEM_TESTS.md) - Full documentation
- [QUICK_START.md](./QUICK_START.md) - Quick reference
- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## Test Maintenance

### Updating Baselines

After intentional visual changes:

```bash
# Update all visual baselines
npm run test:visual:update

# Review changes before committing
npx playwright show-report
```

### Monitoring Test Health

Track these metrics:
- Pass rate over time
- Average test duration
- Flakiness rate
- Coverage gaps

## Contact

For questions about tests:
- See [LOADING_SYSTEM_TESTS.md](./LOADING_SYSTEM_TESTS.md)
- Check [QUICK_START.md](./QUICK_START.md)
- Review `/tests/MANUAL_VERIFICATION.md` for manual testing
