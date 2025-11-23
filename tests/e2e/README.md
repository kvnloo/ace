# End-to-End User Journey Tests

Complete user journey tests simulating real user behavior from homepage to 3D interaction.

## Test Coverage

### 1. Happy Path (Complete Journey)
- ✅ Homepage load
- ✅ Loading screen with FPS meter
- ✅ Progressive loading stages (Essential → Enhanced)
- ✅ Loading completion
- ✅ 3D court visibility and interaction
- ✅ No console errors throughout

**Screenshots**: 01-06

### 2. Performance Degradation
- ✅ FPS drop simulation (CPU throttling)
- ✅ Quality recommendation appears
- ✅ User applies recommendation
- ✅ Components disabled appropriately
- ✅ FPS recovery
- ✅ 3D functionality with reduced components

**Screenshots**: 07-08

### 3. Critical Failure Handling
- ✅ Severe FPS drop (extreme throttling)
- ✅ Automatic fallback to building-only mode
- ✅ Meaningful error message
- ✅ Building mesh still visible
- ✅ No blank screen

**Screenshots**: 09

### 4. Loading Progress Stages
- ✅ All loading stages tracked
- ✅ Essential and Enhanced stages verified
- ✅ Stage transitions monitored

**Screenshots**: 10

### 5. FPS Monitoring Accuracy
- ✅ 20 FPS readings over 10 seconds
- ✅ FPS validation (≥0, >0 average)
- ✅ Average FPS calculation

### 6. Component Visibility
- ✅ Essential components at start
- ✅ Enhanced components as performance allows
- ✅ Component counting and verification

**Screenshots**: 10

### 7. Error Recovery
- ✅ Temporary network failures (10% rate)
- ✅ Recovery and eventual load
- ✅ 3D court loads despite errors

### 8. Mobile Viewport Journey
- ✅ Mobile viewport (375×667)
- ✅ FPS meter visibility
- ✅ Canvas adaptation to mobile
- ✅ Touch interaction
- ✅ No errors on mobile

**Screenshots**: 11-13

### 9. Progressive Enhancement
- ✅ Component progression tracking
- ✅ Essential → Mid → Complete stages
- ✅ Progressive increase validation

### 10. Memory Leak Detection
- ✅ Initial memory capture
- ✅ Interaction simulation
- ✅ Final memory capture
- ✅ Memory increase validation (<100%)

## Performance Assertions

### Minimum FPS Threshold
- ✅ Average FPS > 20
- ✅ Minimum FPS > 10
- ✅ 20 samples over 10 seconds

### Load Time
- ✅ Total load time < 30 seconds
- ✅ Timed from navigation to completion

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- user-journey-complete

# Run with UI (headed mode)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- -g "happy path"

# Generate screenshots
npm run test:e2e -- --screenshot=on
```

## Test Structure

```
tests/
├── e2e/
│   ├── user-journey-complete.spec.ts  # Main journey tests
│   └── README.md                       # This file
└── screenshots/
    ├── 01-homepage-load.png
    ├── 02-loading-screen.png
    ├── 03-loading-essential.png
    ├── 04-loading-enhanced.png
    ├── 05-loading-complete.png
    ├── 06-camera-interaction.png
    ├── 07-quality-recommendation.png
    ├── 08-quality-applied.png
    ├── 09-fallback-mode.png
    ├── 10-essential-components.png
    ├── 11-mobile-loading.png
    ├── 12-mobile-complete.png
    └── 13-mobile-interaction.png
```

## Console Error Monitoring

Every test monitors console errors and warnings:
- `consoleErrors` array tracks all errors
- `consoleWarnings` array tracks all warnings
- Errors reported in `afterEach` hook
- Page errors also captured

## FPS Tracking

FPS monitoring strategy:
- Multiple readings over time
- Validation of positive values
- Average and minimum calculations
- Performance degradation detection

## Screenshot Documentation

Screenshots capture key moments:
1. Homepage load
2. Loading screen appearance
3. Essential stage
4. Enhanced stage
5. Loading complete
6. Camera interaction
7. Quality recommendation (if shown)
8. Quality applied (if applicable)
9. Fallback mode (if triggered)
10. Essential components
11. Mobile loading
12. Mobile complete
13. Mobile interaction

## Test Data Attributes

Tests rely on these data attributes:
- `data-testid="loading-screen"` - Loading overlay
- `data-testid="fps-meter"` - FPS display
- `data-testid="loading-progress"` - Progress text
- `data-testid="quality-recommendation"` - Quality dialog
- `data-testid="performance-mode"` - Performance indicator
- `data-testid="fallback-mode"` - Fallback indicator
- `data-testid="building-only-mode"` - Building-only indicator
- `data-testid="error-message"` - Error message
- `data-component="essential"` - Essential components
- `data-component="enhanced"` - Enhanced components
- `data-loaded="true"` - Loaded components

## Performance Targets

- **Average FPS**: > 20 FPS
- **Minimum FPS**: > 10 FPS
- **Load Time**: < 30 seconds
- **Memory Increase**: < 100%
- **Console Errors**: 0 (happy path)

## Coordination Hooks

Tests use coordination hooks for tracking:
```bash
npx claude-flow@alpha hooks pre-task --description "..."
npx claude-flow@alpha hooks session-restore --session-id "..."
npx claude-flow@alpha hooks post-edit --file "..." --memory-key "..."
npx claude-flow@alpha hooks post-task --task-id "..."
```

## Next Steps

1. Add visual regression tests
2. Add accessibility tests (ARIA, keyboard navigation)
3. Add network condition tests (slow 3G, offline)
4. Add browser-specific tests (Chrome, Firefox, Safari)
5. Add performance budget tests
6. Add lighthouse score tests
