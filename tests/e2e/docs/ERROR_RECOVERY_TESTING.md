# Error Recovery Testing Guide

## Overview

This document describes the comprehensive error recovery test suite that ensures users see meaningful feedback instead of blank/broken screens when errors occur.

## Test Philosophy

**Core Principle**: The application should NEVER show a blank screen or crash completely. Users should always see:

1. **Clear error messages** - Human-readable, actionable feedback
2. **Graceful degradation** - Reduced functionality rather than complete failure
3. **Recovery options** - Ways to retry, reload, or navigate away
4. **Maintained navigation** - Core UI remains accessible

## Test Coverage

### 1. Asset Loading Failures

#### 1.1 Missing 3D Model Assets (404)

**Test**: `should show meaningful message when 3D model assets return 404`

**Scenario**:
- User navigates to 3D demo
- Model files (.glb, .gltf) return 404
- Textures fail to load

**Expected Behavior**:
- ✅ Canvas still renders with fallback geometry
- ✅ Building mesh loads successfully
- ✅ User sees indication that some assets are unavailable
- ✅ App remains interactive
- ❌ NO blank screen
- ❌ NO white screen of death

**Implementation**:
```typescript
await page.route('**/*.glb', (route) => route.abort('failed'));
```

#### 1.2 Texture Loading Failures

**Test**: `should show graceful degradation when texture assets fail to load`

**Scenario**:
- 3D models load successfully
- Texture images fail to load

**Expected Behavior**:
- ✅ Scene renders with fallback materials
- ✅ WebGL context remains active
- ✅ App continues to function
- ❌ NO broken/missing textures crash the renderer

### 2. Network Failures

#### 2.1 Offline During Initial Load

**Test**: `should show network error message when offline during load`

**Scenario**:
- User has no network connection
- Attempts to load application

**Expected Behavior**:
- ✅ Clear error message about network unavailability
- ✅ Graceful failure (not hanging indefinitely)
- ✅ When network returns, can reload successfully

**Implementation**:
```typescript
await context.setOffline(true);
```

#### 2.2 Network Failure During Asset Loading

**Test**: `should show retry mechanism when network fails during 3D asset loading`

**Scenario**:
- Initial page loads
- Network drops during 3D asset download

**Expected Behavior**:
- ✅ Automatic retry mechanism kicks in
- ✅ Retries at least 2-3 times before showing error
- ✅ User sees loading indicator during retries
- ✅ Eventually loads or shows clear error

#### 2.3 Intermittent Network

**Test**: `should handle intermittent network during scene interaction`

**Scenario**:
- Scene loads successfully
- Network drops after initial load
- Network returns

**Expected Behavior**:
- ✅ Already-loaded assets continue to work
- ✅ Scene remains interactive (assets cached)
- ✅ No crash when network returns

### 3. WebGL Support Issues

#### 3.1 WebGL Not Supported

**Test**: `should detect and handle missing WebGL support gracefully`

**Scenario**:
- User's browser doesn't support WebGL
- WebGL is disabled in settings

**Expected Behavior**:
- ✅ Clear message: "3D view requires WebGL support"
- ✅ Fallback to 2D view or static content
- ✅ Links to enable WebGL or upgrade browser
- ❌ NO blank screen
- ❌ NO infinite loading

**Implementation**:
```typescript
await page.addInitScript(() => {
  HTMLCanvasElement.prototype.getContext = function(type: string) {
    if (type === 'webgl' || type === 'webgl2') return null;
    return originalGetContext.apply(this, arguments);
  };
});
```

#### 3.2 WebGL Context Loss

**Test**: `should provide fallback when WebGL context is lost`

**Scenario**:
- Scene is running normally
- WebGL context is lost (browser tab backgrounded, GPU reset, etc.)

**Expected Behavior**:
- ✅ Context loss detected
- ✅ Attempt automatic context restoration
- ✅ User sees "Restoring 3D view..." message
- ✅ Scene restores successfully OR shows reload option

**Implementation**:
```typescript
canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
```

### 4. Loading Timeouts

#### 4.1 Assets Never Load

**Test**: `should show timeout message for assets that never load`

**Scenario**:
- Asset requests hang indefinitely
- Network extremely slow

**Expected Behavior**:
- ✅ Timeout after maximum 60 seconds
- ✅ Message: "Loading is taking longer than expected"
- ✅ Option to skip or continue waiting
- ✅ Option to reload page
- ❌ NO infinite loading spinner

#### 4.2 Long Loading Operations

**Test**: `should provide skip/cancel button for long loading operations`

**Scenario**:
- Large assets taking 30+ seconds to load

**Expected Behavior**:
- ✅ Progress indicator visible
- ✅ "Skip" or "Cancel" button available
- ✅ Can navigate back to homepage
- ✅ Can cancel loading and use app without 3D view

### 5. JavaScript Errors

#### 5.1 Initialization Errors

**Test**: `should catch and display friendly error when JS error occurs during loading`

**Scenario**:
- JavaScript error during app initialization
- Error in scene setup code

**Expected Behavior**:
- ✅ Error boundary catches exception
- ✅ User sees: "Something went wrong"
- ✅ "Reload Page" button available
- ✅ Error logged to console for debugging
- ❌ NO white screen
- ❌ NO technical stack trace shown to user

#### 5.2 Critical Application Errors

**Test**: `should provide reload button when critical error occurs`

**Scenario**:
- Unhandled exception in React component
- Critical Three.js error

**Expected Behavior**:
- ✅ Error boundary displays
- ✅ Clear "Reload" or "Try Again" button
- ✅ Option to report error (optional)
- ✅ Navigation to home page available

#### 5.3 Three.js Scene Errors

**Test**: `should handle errors in Three.js scene initialization gracefully`

**Scenario**:
- Error creating renderer
- Error loading geometry
- Error in shader compilation

**Expected Behavior**:
- ✅ Fallback to simpler rendering
- ✅ Error message about 3D view unavailability
- ✅ Rest of app continues to work

## User Feedback Quality Standards

### 1. No Blank Screens

**Test**: `should never show blank white screen on any error`

**Requirements**:
- Background must be visible (dark theme)
- Text content visible
- At least basic navigation available
- Minimum 20 characters of meaningful text

### 2. Consistent Error Messaging

**Test**: `should show consistent error messaging across all error types`

**Requirements**:
- Human-readable language
- No technical jargon or error codes
- Actionable instructions
- Consistent tone and style

**Good Examples**:
- ✅ "We couldn't load the 3D view. Please check your connection."
- ✅ "Your browser doesn't support 3D graphics. Try updating to a newer version."
- ✅ "Loading is taking longer than expected. You can skip this step."

**Bad Examples**:
- ❌ "Error: GLB_LOAD_FAILED"
- ❌ "undefined is not a function"
- ❌ "ERR_NETWORK_TIMEOUT"

### 3. Maintained Navigation

**Test**: `should maintain app navigation even when 3D scene fails`

**Requirements**:
- Core navigation always visible
- Buttons remain clickable
- Can navigate to other pages
- Can return to homepage

### 4. Progressive Enhancement

**Test**: `should show basic content before 3D assets load`

**Requirements**:
- UI shell loads first
- Critical content visible immediately
- 3D view loads progressively
- Page usable before 3D ready

## Helper Functions

### Error Simulation

```typescript
// Simulate network failure
await simulateNetworkFailure(page, ['image', 'xhr']);

// Simulate 404 errors
await simulateAsset404(page, ['.glb', '.gltf']);

// Simulate slow loading
await simulateSlowLoading(page, ['.glb'], 30000);

// Disable WebGL
await disableWebGL(page);

// Trigger context loss
await triggerWebGLContextLoss(page);
```

### Error Verification

```typescript
// Verify meaningful content
await expectMeaningfulContent(page);

// Verify error boundary
await expectErrorBoundary(page);

// Verify timeout handling
await expectTimeoutHandling(page, 10000);

// Verify graceful degradation
await expectGracefulDegradation(page);

// Verify app remains functional
await expectAppRemainsFunctional(page);
```

## Running the Tests

### Run All Error Recovery Tests

```bash
npm run test:e2e tests/e2e/error-recovery.spec.ts
```

### Run with UI

```bash
npm run test:e2e:ui tests/e2e/error-recovery.spec.ts
```

### Run in Debug Mode

```bash
npm run test:e2e:debug tests/e2e/error-recovery.spec.ts
```

### Run Specific Test

```bash
npx playwright test -g "should show meaningful message when 3D model assets return 404"
```

## CI/CD Integration

These tests should run on every PR to ensure error handling remains robust.

```yaml
# .github/workflows/e2e-tests.yml
- name: Run Error Recovery Tests
  run: npm run test:e2e tests/e2e/error-recovery.spec.ts
```

## Performance Considerations

Error recovery tests simulate failures and timeouts, which can be slow. Optimize by:

1. **Parallel Execution**: Run independent tests in parallel
2. **Shorter Timeouts**: Use minimum timeout values for tests
3. **Mock Delays**: Use shortest delays that still test behavior
4. **Skip in Watch Mode**: Don't run timeout tests during development

## Maintenance

### When to Update Tests

1. **New Error Scenarios**: Add test when new error case discovered
2. **Changed Error Messages**: Update assertions when error text changes
3. **New Features**: Add error tests for new functionality
4. **Browser Updates**: Verify tests pass on new browser versions

### Test Stability

Error recovery tests can be flaky due to timing. Ensure stability by:

1. Using `waitForTimeout` appropriately
2. Checking multiple indicators of state
3. Adding retry logic for transient failures
4. Using deterministic error simulation

## Accessibility

Error messages must be accessible:

- Screen reader compatible
- Sufficient color contrast
- Keyboard navigable buttons
- Focus management maintained

## Future Enhancements

Planned improvements to error recovery testing:

1. **Visual regression**: Capture error screen snapshots
2. **Performance budgets**: Ensure errors don't cause memory leaks
3. **Analytics tracking**: Verify error events logged
4. **A/B testing**: Test different error message variants
5. **Internationalization**: Test error messages in multiple languages

## Related Documentation

- [Playwright Testing Guide](./PLAYWRIGHT_GUIDE.md)
- [Accessibility Testing](./ACCESSIBILITY_TESTING.md)
- [Performance Testing](./PERFORMANCE_TESTING.md)
- [Visual Regression Testing](./VISUAL_REGRESSION.md)
