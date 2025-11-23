# E2E Test Fix Execution Plan
**Status**: READY FOR EXECUTION
**Date**: 2025-11-22
**Estimated Total Time**: 6-8 hours

---

## ⚡ CRITICAL BLOCKER - Must Fix First

### Issue: Playwright Configuration Error
**File**: `tests/e2e/visual/mobile-responsive.visual.spec.ts`
**Lines**: 20, 83, 103
**Error**: `test.use()` called inside `test.describe()` blocks
**Impact**: Blocks ALL 168+ tests from executing
**Fix Time**: 30 minutes
**Complexity**: LOW

### Quick Fix (Choose One Approach):

**Option A: Direct Viewport Setting** (RECOMMENDED - Fastest)
```typescript
for (const { name, device } of mobileDevices) {
  test.describe(`${name}`, () => {
    test('home screen portrait', async ({ page }) => {
      await page.setViewportSize(device.viewport);
      await page.setUserAgent(device.userAgent);
      await page.goto('/');
      // ... rest of test
    });
  });
}
```

**Option B: Separate Files Per Device**
```bash
# Create separate files
tests/e2e/visual/mobile-iphone12.visual.spec.ts
tests/e2e/visual/mobile-iphonese.visual.spec.ts
tests/e2e/visual/mobile-pixel5.visual.spec.ts
tests/e2e/visual/mobile-ipadmini.visual.spec.ts
```

**Option C: Playwright Config Projects**
```typescript
// In playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'iphone12', use: { ...devices['iPhone 12'] } },
    { name: 'iphonese', use: { ...devices['iPhone SE'] } },
    { name: 'pixel5', use: { ...devices['Pixel 5'] } },
    { name: 'ipadmini', use: { ...devices['iPad Mini'] } },
  ],
});
```

---

## 🔄 Sequential Execution (Must Complete in Order)

### Step 1: Fix Configuration (Agent: Coder)
```bash
# Time: 30 minutes
1. Fix mobile-responsive.visual.spec.ts
2. Run: npm run test:e2e -- visual/mobile-responsive.visual.spec.ts
3. Verify: Tests execute without config error
4. Commit: "fix: Playwright configuration error in mobile responsive tests"
5. Signal: Coordinator that fix is complete
```

### Step 2: Validation Run (Agent: Tester)
```bash
# Time: 1 hour
1. Run smoke tests: npm run test:e2e -- smoke.spec.ts
2. Run critical tests: npm run test:e2e -- critical/
3. Run all tests: npm run test:e2e
4. Capture full failure output to /tmp/real-failures.txt
5. Update categorization with actual failures
6. Signal: Coordinator with failure breakdown
```

---

## ⚡ Parallel Execution (After Step 2 Complete)

### Stream A: Accessibility Fixes (Agent: Accessibility Specialist)
**Time**: 2-3 hours | **Priority**: P2

```bash
# Pre-work
npx claude-flow@alpha hooks pre-task --description "Fix accessibility test failures"

# Tasks
1. Fix ARIA violations (missing labels, roles)
2. Fix color contrast issues (WCAG AA 4.5:1)
3. Fix keyboard navigation issues
4. Fix focus management
5. Ensure screen reader compatibility
6. Generate accessibility report

# Validation
npm run test:e2e -- accessibility.spec.ts

# Post-work
npx claude-flow@alpha hooks post-task --task-id "accessibility-fixes"
npx claude-flow@alpha hooks notify --message "Accessibility fixes complete"
```

**Expected Fixes**:
- Add `aria-label` to unlabeled buttons
- Add `alt` text to images
- Fix heading hierarchy
- Improve color contrast ratios
- Add skip navigation link
- Fix focus indicators

---

### Stream B: Critical Path Fixes (Agent: Full-Stack Developer)
**Time**: 2-3 hours | **Priority**: P1

```bash
# Pre-work
npx claude-flow@alpha hooks pre-task --description "Fix critical path test failures"

# Tasks
1. Fix AI chat functionality (ai-chat.spec.ts)
   - Mock API responses
   - Fix chat UI interactions
   - Handle error states
2. Fix court navigation (court-navigation.spec.ts)
   - Fix navigation elements
   - Fix route handling
3. Fix visualization (visualization.spec.ts)
   - Fix 3D rendering
   - Fix scene initialization

# Validation
npm run test:e2e -- critical/

# Post-work
npx claude-flow@alpha hooks post-task --task-id "critical-path-fixes"
npx claude-flow@alpha hooks notify --message "Critical path fixes complete"
```

**Expected Fixes**:
- Implement missing Page Object Models
- Add test fixtures
- Mock API endpoints
- Fix element selectors
- Handle timing issues

---

### Stream C: Visual Regression Baselines (Agent: Frontend Developer)
**Time**: 1-2 hours | **Priority**: P2

```bash
# Pre-work
npx claude-flow@alpha hooks pre-task --description "Generate visual regression baselines"

# Tasks
1. Generate screenshot baselines for all visual tests
2. Fix responsive design issues
3. Tune screenshot comparison thresholds
4. Fix CSS animations in tests

# Generate baselines
npm run test:e2e -- visual/ --update-snapshots

# Validation
npm run test:e2e -- visual/

# Post-work
npx claude-flow@alpha hooks post-task --task-id "visual-regression-fixes"
npx claude-flow@alpha hooks notify --message "Visual regression baselines complete"
```

**Expected Fixes**:
- Generate all baseline screenshots
- Fix responsive layout issues
- Disable animations for stable screenshots
- Adjust maxDiffPixels thresholds

---

### Stream D: Performance Optimization (Agent: Performance Engineer)
**Time**: 2-3 hours | **Priority**: P2

```bash
# Pre-work
npx claude-flow@alpha hooks pre-task --description "Fix performance test failures"

# Tasks
1. Fix core metrics tests (core-metrics.perf.spec.ts)
2. Optimize 3D rendering performance (3d-rendering.perf.spec.ts)
3. Fix memory profiling (memory-profiling.perf.spec.ts)
4. Tune performance thresholds
5. Add performance budgets

# Validation
npm run test:e2e -- performance/

# Post-work
npx claude-flow@alpha hooks post-task --task-id "performance-fixes"
npx claude-flow@alpha hooks notify --message "Performance fixes complete"
```

**Expected Fixes**:
- Adjust FPS thresholds
- Optimize WebGL rendering
- Fix memory leak detection
- Tune Core Web Vitals thresholds

---

### Stream E: Component Tests (Agent: QA Engineer)
**Time**: 2-3 hours | **Priority**: P3

```bash
# Pre-work
npx claude-flow@alpha hooks pre-task --description "Fix component test failures"

# Tasks
1. Fix weather controls tests (weather-controls.spec.ts)
2. Fix grass system tests (grass-system.spec.ts)
3. Fix BMS monitoring tests (bms-monitoring.spec.ts)
4. Fix settings tests (settings.spec.ts)
5. Fix mobile tests (mobile.spec.ts)
6. Fix debug system tests (debug-system.spec.ts)
7. Fix adaptive loading tests (adaptive-loading.spec.ts)

# Validation
npm run test:e2e -- weather-controls.spec.ts grass-system.spec.ts bms-monitoring.spec.ts settings.spec.ts mobile.spec.ts debug-system.spec.ts adaptive-loading.spec.ts

# Post-work
npx claude-flow@alpha hooks post-task --task-id "component-fixes"
npx claude-flow@alpha hooks notify --message "Component fixes complete"
```

**Expected Fixes**:
- Fix component selectors
- Mock sensor data
- Fix form validations
- Handle loading states
- Fix mobile interactions

---

## 🎯 Final Integration (Sequential After All Parallel Streams)

### Step 3: Integration Validation (Agent: Integration Tester)
```bash
# Time: 1 hour

# Pre-work
npx claude-flow@alpha hooks pre-task --description "Final integration validation"

# Full test suite run
npm run test:e2e

# Generate reports
npm run test:e2e -- --reporter=html
npx playwright show-report

# Verify success criteria
# Target: 90%+ pass rate

# Post-work
npx claude-flow@alpha hooks post-task --task-id "integration-validation"
npx claude-flow@alpha hooks notify --message "Integration validation complete - XX% pass rate"
```

---

## 📊 Success Criteria

**Phase 1**: ✅ Configuration error fixed, tests execute
**Phase 2**: ✅ Real failure categorization complete
**Phase 3**: ✅ 90%+ test pass rate achieved
**Phase 4**: ✅ Full test suite passing in CI/CD

---

## 🚀 Execution Commands

### Start Parallel Execution (After Step 2)
```bash
# Coordinator spawns 5 agents concurrently
Task("Accessibility Specialist", "Fix accessibility test failures per Stream A plan", "tester")
Task("Full-Stack Developer", "Fix critical path test failures per Stream B plan", "coder")
Task("Frontend Developer", "Generate visual regression baselines per Stream C plan", "coder")
Task("Performance Engineer", "Fix performance test failures per Stream D plan", "perf-analyzer")
Task("QA Engineer", "Fix component test failures per Stream E plan", "tester")
```

### Monitor Progress
```bash
# Check memory for agent status
npx claude-flow@alpha hooks session-restore --session-id "swarm-test-fixes"

# View notifications
cat .swarm/memory.db | grep notification
```

---

## 📈 Estimated Timeline

| Phase | Time | Type | Status |
|-------|------|------|--------|
| **Fix Config** | 30min | Sequential | ⏳ Pending |
| **Validation** | 1hr | Sequential | ⏳ Blocked |
| **Parallel Fixes** | 3hrs | Parallel (5 streams) | ⏳ Blocked |
| **Integration** | 1hr | Sequential | ⏳ Blocked |
| **TOTAL** | **5.5hrs** | - | - |

**Note**: Parallel execution reduces total time from ~10hrs to ~5.5hrs

---

## 🔧 Tools & Dependencies

**Required Packages**:
- `@playwright/test` - Test runner
- `@axe-core/playwright` - Accessibility testing
- `playwright` - Browser automation

**Helper Files**:
- `tests/e2e/helpers/accessibility.ts`
- `tests/e2e/helpers/navigation.ts`
- `tests/e2e/helpers/assertions.ts`
- `tests/e2e/fixtures.ts`

**Page Objects** (May need creation):
- `tests/e2e/pages/HomePage.ts`
- `tests/e2e/pages/AIChatPage.ts`

---

**Execution Status**: READY
**Next Action**: Fix configuration error in mobile-responsive.visual.spec.ts
