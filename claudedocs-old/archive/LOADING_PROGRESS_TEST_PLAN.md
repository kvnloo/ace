# Loading Progress Test Plan

**Version**: 1.0
**Date**: 2025-11-25
**Purpose**: Test specification for verifying loading progress feature functionality and user experience

---

## Overview

This document provides a comprehensive testing strategy for the loading progress system, including the loading screen, FPS monitor, and progress tracking features. Tests can be executed manually or automated using Playwright.

---

## Test Categories

### 1. Loading Screen Display & Progress

#### 1.1 Loading Screen Appears
**Priority**: Critical
**Test ID**: LS-001

**Prerequisites**:
- Application running on http://localhost:3000
- No cached data (clear localStorage)

**Test Steps (Manual)**:
1. Navigate to application home page
2. Click "Explore 3D Demo" button
3. Observe loading screen appears

**Verification**:
- [ ] Loading screen is visible immediately
- [ ] Background gradient is displayed
- [ ] Loading title "Loading 3D Environment" is visible
- [ ] Element has `data-testid="loading-screen"`

**Automated Test**: `tests/loading-screen.spec.ts` → "shows loading screen with FPS counter and asset bars"

---

#### 1.2 Progress Counter Shows Valid Values
**Priority**: Critical
**Test ID**: LS-002

**Prerequisites**:
- Loading screen is visible

**Test Steps (Manual)**:
1. Observe the progress counter (XX%)
2. Note the asset count (X/Y format)
3. Watch for several seconds

**Verification**:
- [ ] Progress percentage displays (0-100%)
- [ ] Progress is NOT 0/0 (shows actual asset counts)
- [ ] Asset count format is "loadedCount/totalCount" (e.g., "3/10")
- [ ] Both numbers are greater than 0
- [ ] Loaded count ≤ total count

**Known Issue**: If shows "0/0", there's a data flow problem from LoadingProvider

**Automated Test**: Check for `data-testid="loading-progress"` content

---

#### 1.3 Progress Updates Dynamically
**Priority**: Critical
**Test ID**: LS-003

**Prerequisites**:
- Loading screen is visible

**Test Steps (Manual)**:
1. Record initial progress percentage
2. Wait 2 seconds
3. Record new progress percentage
4. Wait until loading completes

**Verification**:
- [ ] Progress percentage increases over time
- [ ] Progress never decreases (monotonic)
- [ ] Eventually reaches 100%
- [ ] Asset count increments (loaded count increases)
- [ ] Progress bar visual fills from left to right

**Automated Test**: `tests/loading-screen.spec.ts` → "shows increasing progress percentage"

---

#### 1.4 Phase Information Displays
**Priority**: High
**Test ID**: LS-004

**Prerequisites**:
- Loading screen is visible

**Test Steps (Manual)**:
1. Observe "Phase:" text below title
2. Monitor phase changes during loading

**Verification**:
- [ ] Phase text is visible (`data-testid="loading-phase"`)
- [ ] Shows one of: "Essential", "Core", "Visual", "Enhanced"
- [ ] Phase progresses in order (Essential → Core → Visual → Enhanced)
- [ ] Phase changes are smooth (no flashing)
- [ ] Phase text updates as loading progresses

**Automated Test**: `tests/loading-screen.spec.ts` → "displays phase information"

---

### 2. Asset List Display

#### 2.1 Asset Items Visible
**Priority**: High
**Test ID**: AL-001

**Prerequisites**:
- Loading screen is visible

**Test Steps (Manual)**:
1. Scroll to asset list section
2. Count visible asset items
3. Observe asset item structure

**Verification**:
- [ ] At least one asset item is visible
- [ ] Each asset has a name (truncated if long)
- [ ] Each asset has a status icon (spinner/check/error)
- [ ] Each asset has a progress indicator or percentage
- [ ] Items have `data-testid` starting with "asset-item-"

**Automated Test**: `tests/loading-screen.spec.ts` → Check asset items count > 0

---

#### 2.2 Asset Status Icons Accurate
**Priority**: Medium
**Test ID**: AL-002

**Prerequisites**:
- Loading screen is visible
- Multiple assets loading

**Test Steps (Manual)**:
1. Observe asset status icons during loading
2. Watch for icon transitions

**Verification**:
- [ ] Loading assets show spinning loader icon (blue)
- [ ] Completed assets show checkmark icon (green)
- [ ] Failed assets show X icon (red)
- [ ] Icon changes match actual loading state
- [ ] Icons are color-coded appropriately

---

#### 2.3 Asset Progress Bars Update
**Priority**: Medium
**Test ID**: AL-003

**Prerequisites**:
- Loading screen is visible
- Assets actively loading

**Test Steps (Manual)**:
1. Watch individual asset progress bars
2. Monitor progress bar animations

**Verification**:
- [ ] Progress bars visible for loading assets
- [ ] Progress bars animate smoothly (0% → 100%)
- [ ] Progress bars disappear when asset completes
- [ ] Percentage text updates (e.g., "45%")
- [ ] Failed assets show "Failed" text instead of percentage

---

### 3. FPS Monitor Integration

#### 3.1 FPS Monitor Visible During Loading
**Priority**: High
**Test ID**: FPS-001

**Prerequisites**:
- Loading screen is visible
- `showFPSMonitor={true}` (default)

**Test Steps (Manual)**:
1. Observe loading screen for FPS monitor section
2. Locate FPS counter

**Verification**:
- [ ] FPS monitor is visible (`data-testid="fps-meter"`)
- [ ] FPS value is displayed (numeric)
- [ ] FPS value is > 0 (not zero or blank)
- [ ] Performance level indicator visible (Excellent/Good/Fair/Poor)
- [ ] Performance icon matches level (Sparkles/TrendingUp/AlertTriangle)

**Automated Test**: `tests/loading-screen.spec.ts` → "FPS counter should be visible"

---

#### 3.2 FPS Values Update During Loading
**Priority**: High
**Test ID**: FPS-002

**Prerequisites**:
- Loading screen is visible
- FPS monitor showing

**Test Steps (Manual)**:
1. Record initial FPS value
2. Wait 1 second
3. Record new FPS value
4. Repeat several times

**Verification**:
- [ ] FPS value updates continuously
- [ ] FPS value changes over time (not static)
- [ ] FPS value is reasonable (0-120 range)
- [ ] Average FPS is calculated and displayed
- [ ] Min/Max FPS statistics shown

**Automated Test**: `tests/e2e/asset-loading-experience.spec.ts` → "FPS Meter Updates Continuously"

---

#### 3.3 FPS Monitor Statistics Accurate
**Priority**: Medium
**Test ID**: FPS-003

**Prerequisites**:
- FPS monitor visible
- Loading in progress for >5 seconds

**Test Steps (Manual)**:
1. Observe FPS statistics row (Avg, Min, Max)
2. Compare values to current FPS

**Verification**:
- [ ] Average FPS is displayed
- [ ] Minimum FPS ≤ Average FPS ≤ Maximum FPS
- [ ] Min FPS shows lowest observed value
- [ ] Max FPS shows highest observed value
- [ ] Statistics update as loading progresses

---

#### 3.4 FPS Graph Displays History
**Priority**: Low
**Test ID**: FPS-004

**Prerequisites**:
- FPS monitor visible in embedded mode

**Test Steps (Manual)**:
1. Observe mini FPS graph below statistics
2. Watch graph bars animate

**Verification**:
- [ ] Graph shows multiple bars (FPS history)
- [ ] Bar heights correspond to FPS values
- [ ] Bars are color-coded by performance level
- [ ] Graph updates as new FPS data arrives
- [ ] Older bars fade (opacity gradient)

---

### 4. Loading Screen Dismissal

#### 4.1 Loading Screen Dismisses on Completion
**Priority**: Critical
**Test ID**: DIS-001

**Prerequisites**:
- Loading in progress

**Test Steps (Manual)**:
1. Wait for loading to complete
2. Observe when progress reaches 100%
3. Watch for loading screen to disappear

**Verification**:
- [ ] Loading screen dismisses when all assets loaded
- [ ] Loading screen disappears when progress = 100%
- [ ] Loading screen has fade-out animation (smooth)
- [ ] 3D canvas becomes visible after dismissal
- [ ] No loading screen elements remain visible

**Automated Test**: `tests/loading-screen.spec.ts` → "completes loading within reasonable time"

---

#### 4.2 Loading Completes Within Time Budget
**Priority**: High
**Test ID**: DIS-002

**Prerequisites**:
- Fresh application load

**Test Steps (Manual)**:
1. Start timer when loading screen appears
2. Wait for loading to complete
3. Stop timer when loading screen disappears

**Verification**:
- [ ] Loading completes within 30 seconds
- [ ] No timeout warnings or errors
- [ ] Loading doesn't hang indefinitely
- [ ] All assets load successfully (or skip failed)

**Automated Test**: `tests/loading-screen.spec.ts` → Max timeout 30000ms

---

#### 4.3 Minimum Display Time Honored
**Priority**: Low
**Test ID**: DIS-003

**Prerequisites**:
- Fast loading scenario (cached assets)

**Test Steps (Manual)**:
1. Reload application with cached assets
2. Measure loading screen display time

**Verification**:
- [ ] Loading screen shows for at least 2 seconds (minimumDisplayTime)
- [ ] Even if assets load instantly, screen doesn't flash
- [ ] Smooth user experience (no jarring transitions)

**Automated Test**: Check `minimumDisplayTime` prop default value

---

### 5. FPS Monitor Transition (Post-Loading)

#### 5.1 FPS Monitor Stays Visible After Loading
**Priority**: Critical
**Test ID**: TRANS-001

**Prerequisites**:
- Loading screen just completed
- showFPSMonitor={true}

**Test Steps (Manual)**:
1. Wait for loading screen to dismiss
2. Look for FPS monitor in bottom-right corner
3. Verify it's still visible

**Verification**:
- [ ] FPS monitor transitions from embedded to overlay mode
- [ ] FPS monitor moves to bottom-right corner (fixed position)
- [ ] FPS monitor remains visible after loading screen dismisses
- [ ] Transition animation is smooth (no jumping)
- [ ] FPS monitor continues updating in overlay mode

**Known Issue**: This is the current bug being fixed

**Automated Test**: `tests/e2e/fps-3d-scene-verify.spec.ts` → Verify overlay FPS monitor

---

#### 5.2 FPS Monitor Transition Animation
**Priority**: Medium
**Test ID**: TRANS-002

**Prerequisites**:
- Loading completing
- FPS monitor transitioning

**Test Steps (Manual)**:
1. Watch FPS monitor during transition
2. Observe animation smoothness

**Verification**:
- [ ] FPS monitor shrinks slightly during transition
- [ ] Position animates from center to bottom-right
- [ ] Animation uses spring physics (smooth)
- [ ] Transition duration is approximately 0.8s
- [ ] No visual glitches or flashing

**Automated Test**: Check animation variants in FPSMonitor component

---

#### 5.3 FPS Monitor Overlay Positioning
**Priority**: High
**Test ID**: TRANS-003

**Prerequisites**:
- FPS monitor in overlay mode
- Application fully loaded

**Test Steps (Manual)**:
1. Verify FPS monitor is in bottom-right corner
2. Check it doesn't overlap other UI elements
3. Verify it's above 3D canvas (z-index)

**Verification**:
- [ ] FPS monitor positioned bottom-24 right-6 (Tailwind)
- [ ] Has z-index of 50 or higher
- [ ] Doesn't overlap navigation or other controls
- [ ] Visible above 3D scene
- [ ] Maintains position on window resize

**Automated Test**: `tests/e2e/fps-monitor-position.spec.ts`

---

### 6. Error Handling & Edge Cases

#### 6.1 Zero Assets Scenario
**Priority**: High
**Test ID**: ERR-001

**Test Steps (Manual)**:
1. Mock scenario where totalCount = 0
2. Trigger loading screen

**Verification**:
- [ ] Loading screen shows gracefully
- [ ] Progress shows "0/0" or hides count
- [ ] Loading completes immediately or after minimumDisplayTime
- [ ] No division-by-zero errors
- [ ] No infinite loading

**Automated Test**: Add test with mocked empty asset list

---

#### 6.2 Failed Asset Handling
**Priority**: Medium
**Test ID**: ERR-002

**Test Steps (Manual)**:
1. Trigger loading with intentionally failing asset
2. Observe error handling

**Verification**:
- [ ] Failed asset shows red X icon
- [ ] Asset name shows "Failed" status
- [ ] Loading continues for other assets
- [ ] Overall progress still reaches 100%
- [ ] Console shows error (but doesn't break UI)

---

#### 6.3 Loading Timeout Fallback
**Priority**: Critical
**Test ID**: ERR-003

**Test Steps (Manual)**:
1. Mock scenario where assets never complete
2. Wait 10 seconds

**Verification**:
- [ ] Loading screen has 10-second timeout fallback
- [ ] After 10s, loading screen dismisses anyway
- [ ] Console warning logged about timeout
- [ ] Application remains functional
- [ ] FPS monitor still transitions properly

**Automated Test**: Check timeout logic in LoadingScreen useEffect

---

#### 6.4 Performance Degradation Handling
**Priority**: Medium
**Test ID**: ERR-004

**Test Steps (Manual)**:
1. Throttle CPU using browser DevTools (4x slowdown)
2. Trigger loading screen
3. Observe FPS monitor behavior

**Verification**:
- [ ] FPS monitor shows reduced FPS values
- [ ] Performance level changes to "Fair" or "Poor"
- [ ] Icon changes to AlertTriangle
- [ ] Color changes to yellow/red
- [ ] Recommendation card may appear (if implemented)

**Automated Test**: `tests/e2e/asset-loading-experience.spec.ts` → CPU throttling tests

---

### 7. Visual & Animation Quality

#### 7.1 Progress Bar Animation Smoothness
**Priority**: Medium
**Test ID**: VIS-001

**Test Steps (Manual)**:
1. Watch main progress bar during loading
2. Observe animation characteristics

**Verification**:
- [ ] Progress bar animates smoothly (no stuttering)
- [ ] Progress bar has shimmer effect
- [ ] Progress bar color matches FPS level
- [ ] Progress bar fills from left to right consistently
- [ ] No visual artifacts or glitches

---

#### 7.2 Milestone Celebrations
**Priority**: Low
**Test ID**: VIS-002

**Test Steps (Manual)**:
1. Watch for progress reaching 25%, 50%, 75%, 100%
2. Observe celebration animations

**Verification**:
- [ ] Celebration card appears at milestones
- [ ] Shows "25% Complete!", "50% Complete!", etc.
- [ ] Has sparkles icon
- [ ] Appears in top-right corner
- [ ] Dismisses after 2 seconds automatically

---

#### 7.3 Asset Item Animations
**Priority**: Low
**Test ID**: VIS-003

**Test Steps (Manual)**:
1. Watch asset items as they appear
2. Observe completion animations

**Verification**:
- [ ] Asset items fade in with stagger effect
- [ ] Completed assets animate checkmark (bounce)
- [ ] Failed assets shake slightly
- [ ] Items have smooth transitions
- [ ] No layout shift or jumping

---

### 8. Accessibility & Responsiveness

#### 8.1 Screen Reader Support
**Priority**: High
**Test ID**: A11Y-001

**Test Steps (Manual)**:
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to loading screen
3. Listen to announcements

**Verification**:
- [ ] Loading screen has role="progressbar"
- [ ] Progress percentage is announced
- [ ] Phase changes are announced
- [ ] Asset completions are announced
- [ ] Has aria-label describing state

**Automated Test**: `tests/e2e/adaptive-loading.spec.ts` → Accessibility tests

---

#### 8.2 Mobile Responsiveness
**Priority**: Medium
**Test ID**: A11Y-002

**Test Steps (Manual)**:
1. Test on mobile viewport (375px width)
2. Verify layout adapts

**Verification**:
- [ ] Loading screen fits within viewport
- [ ] Text is readable (not too small)
- [ ] FPS monitor scales appropriately
- [ ] Progress bar visible and usable
- [ ] No horizontal scrolling

---

#### 8.3 Keyboard Navigation
**Priority**: Low
**Test ID**: A11Y-003

**Test Steps (Manual)**:
1. Use Tab key to navigate
2. Test keyboard interactions

**Verification**:
- [ ] Focus indicators visible
- [ ] Can dismiss with Escape (if skip button implemented)
- [ ] No keyboard traps
- [ ] Logical tab order

---

## Test Execution Strategy

### Automated Test Runs
```bash
# Run all loading-related tests
npm run test:e2e -- tests/loading-screen.spec.ts
npm run test:e2e -- tests/e2e/asset-loading-experience.spec.ts
npm run test:e2e -- tests/e2e/performance/loading-performance.spec.ts
npm run test:e2e -- tests/e2e/adaptive-loading.spec.ts

# Run FPS monitor tests
npm run test:e2e -- tests/e2e/fps-*.spec.ts
npm run test:e2e -- tests/e2e/test-fps-overlay.spec.ts
```

### Manual Test Sessions
1. **Quick Smoke Test** (5 minutes):
   - Tests: LS-001, LS-002, LS-003, DIS-001, TRANS-001
   - Verify core functionality works

2. **Detailed Test Pass** (30 minutes):
   - All Critical and High priority tests
   - Document any failures or deviations

3. **Visual QA Session** (15 minutes):
   - All VIS-* tests
   - Record video for reference

4. **Performance Testing** (20 minutes):
   - FPS-* tests with CPU throttling
   - Network throttling scenarios
   - Memory profiling

### Test Environment Requirements
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **Viewport**: Desktop 1920x1080, Mobile 375x667
- **Network**: Fast 3G, Regular 4G, Offline (cached)
- **CPU**: Normal, 4x throttled, 10x throttled
- **Cache**: Fresh load, Cached assets

---

## Test Data & Fixtures

### Mock Asset Lists
Located in: `tests/e2e/fixtures/`

**Small Asset List** (5 items):
- 3 textures
- 1 model
- 1 configuration

**Medium Asset List** (15 items):
- 8 textures
- 4 models
- 2 HDRI maps
- 1 configuration

**Large Asset List** (30 items):
- 15 textures
- 8 models
- 5 HDRI maps
- 2 configurations

---

## Known Issues & Workarounds

### Issue 1: FPS Monitor Disappears After Loading
**Status**: IN PROGRESS
**Workaround**: None currently
**Fix**: Implementing transition from embedded to overlay mode
**Tests Affected**: TRANS-001, TRANS-002, TRANS-003

### Issue 2: Progress Shows 0/0 on Fast Load
**Status**: INVESTIGATING
**Workaround**: Add artificial delay
**Tests Affected**: LS-002

---

## Success Criteria

A successful test pass requires:
- [ ] All Critical tests pass (100%)
- [ ] ≥95% of High priority tests pass
- [ ] ≥85% of Medium priority tests pass
- [ ] No console errors during loading
- [ ] No visual regressions
- [ ] Performance within budgets (<30s total load)

---

## Reporting Template

```markdown
## Test Run Report

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: [Browser + Version]
**Build**: [Commit SHA]

### Summary
- Total Tests: XX
- Passed: XX
- Failed: XX
- Skipped: XX
- Pass Rate: XX%

### Failed Tests
- [TEST-ID] - [Description] - [Reason]

### Issues Found
1. [Issue description]
   - Severity: Critical/High/Medium/Low
   - Steps to reproduce
   - Expected vs Actual

### Screenshots/Videos
- [Attach evidence]

### Notes
[Any additional observations]
```

---

## Maintenance

This test plan should be updated when:
- New loading features are added
- FPS monitor functionality changes
- Asset loading pipeline is modified
- New accessibility requirements emerge
- Performance budgets change

**Last Updated**: 2025-11-25
**Next Review**: When TRANS-001 fix is complete
