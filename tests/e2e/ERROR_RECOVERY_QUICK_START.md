# Error Recovery Testing - Quick Start Guide

## 🚀 Quick Start

### Run All Error Recovery Tests
```bash
npm run test:e2e tests/e2e/error-recovery.spec.ts
```

### Run Single Test
```bash
npx playwright test -g "should show meaningful message when 3D model assets return 404"
```

### Run in UI Mode (Recommended for Development)
```bash
npm run test:e2e:ui tests/e2e/error-recovery.spec.ts
```

### Debug Failing Test
```bash
npm run test:e2e:debug tests/e2e/error-recovery.spec.ts
```

## 📋 Test Categories

### 1. Asset Loading (2 tests)
Tests that 3D models and textures fail gracefully.

```bash
npx playwright test -g "Asset Loading"
```

### 2. Network Failures (3 tests)
Tests offline, slow, and intermittent network scenarios.

```bash
npx playwright test -g "Network Failures"
```

### 3. WebGL Support (2 tests)
Tests WebGL missing or context loss scenarios.

```bash
npx playwright test -g "WebGL Support"
```

### 4. Loading Timeouts (2 tests)
Tests long loading and timeout scenarios.

```bash
npx playwright test -g "Loading Timeouts"
```

### 5. JavaScript Errors (3 tests)
Tests error boundaries and crash recovery.

```bash
npx playwright test -g "JavaScript Errors"
```

### 6. User Feedback (3 tests)
Tests error message quality and consistency.

```bash
npx playwright test -g "User Feedback Quality"
```

### 7. Progressive Enhancement (2 tests)
Tests loading order and progressive rendering.

```bash
npx playwright test -g "Progressive Enhancement"
```

## 🔧 Common Helper Functions

### Simulate Errors

```typescript
import {
  simulateNetworkFailure,
  simulateAsset404,
  simulateSlowLoading,
  disableWebGL,
  triggerWebGLContextLoss,
  injectLoadError,
} from './helpers/error-recovery';

// Network failure
await simulateNetworkFailure(page, ['image', 'xhr']);

// 404 errors
await simulateAsset404(page, ['.glb', '.gltf']);

// Slow loading (30 seconds)
await simulateSlowLoading(page, ['.glb'], 30000);

// Disable WebGL
await disableWebGL(page);

// Trigger WebGL context loss
await triggerWebGLContextLoss(page);

// Inject JS error
await injectLoadError(page, 'Test error message');
```

### Validate Responses

```typescript
import {
  expectMeaningfulContent,
  expectErrorBoundary,
  expectTimeoutHandling,
  expectGracefulDegradation,
  expectAppRemainsFunctional,
  expectQualityErrorMessage,
} from './helpers/error-recovery';

// Verify no blank screen
await expectMeaningfulContent(page);

// Verify error boundary shows
await expectErrorBoundary(page);

// Verify timeout handling (10 second max)
await expectTimeoutHandling(page, 10000);

// Verify graceful degradation
await expectGracefulDegradation(page);

// Verify app still works
await expectAppRemainsFunctional(page);

// Verify error message quality
await expectQualityErrorMessage(page);
```

## 🎯 What to Look For

### ✅ Good Error Handling
- Error message is visible and readable
- Message is user-friendly (no technical jargon)
- App remains interactive
- Navigation still works
- Background is visible (not white screen)
- Has reload/retry/cancel button

### ❌ Bad Error Handling
- Blank white screen
- Technical error messages ("undefined is not a function")
- App completely frozen
- No way to recover or navigate away
- Infinite loading spinner
- Console errors visible to user

## 🐛 Debugging Failed Tests

### 1. Run in UI Mode
```bash
npm run test:e2e:ui tests/e2e/error-recovery.spec.ts
```

This shows you:
- Browser window
- Test steps
- Network requests
- Console output
- DOM snapshots

### 2. Run in Debug Mode
```bash
npm run test:e2e:debug tests/e2e/error-recovery.spec.ts
```

This opens the Playwright Inspector where you can:
- Step through test line by line
- Inspect page state at each step
- See what the test sees
- Modify selectors in real-time

### 3. Check Test Results
```bash
npm run test:e2e:report
```

Shows detailed HTML report with:
- Screenshots of failures
- Video recordings
- Network logs
- Console output

### 4. Increase Timeout
If test is timing out, increase the timeout:

```typescript
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### 5. Check Playwright Version
```bash
npx playwright --version
```

Update if needed:
```bash
npm install -D @playwright/test@latest
npx playwright install
```

## 📊 Test Results

After running tests, check:

```bash
# View HTML report
npm run test:e2e:report

# Check test results JSON
cat tests/e2e/reports/results.json | jq

# List all screenshots
ls tests/e2e/screenshots/

# View latest screenshot
open tests/e2e/screenshots/latest.png
```

## 🔄 Adding New Error Tests

### Step 1: Write Test
```typescript
test.describe('My Error Category', () => {
  test('should handle my error scenario', async ({ page }) => {
    // 1. Simulate error
    await page.route('**/*.my-file', route => route.abort('failed'));

    // 2. Navigate to page
    await goToHome(page);
    await page.click('button', { hasText: 'My Feature' });

    // 3. Verify graceful handling
    await expectMeaningfulContent(page);
    await expectAppRemainsFunctional(page);

    // 4. Verify error message
    const errorText = await page.textContent('body');
    expect(errorText).toContain('My friendly error message');
  });
});
```

### Step 2: Add Helper (Optional)
```typescript
// In error-recovery.ts
export async function simulateMyError(page: Page): Promise<void> {
  await page.route('**/*.my-file', route => route.abort('failed'));
}
```

### Step 3: Document
Add to `ERROR_RECOVERY_TESTING.md` with:
- Test description
- Scenario steps
- Expected behavior
- Implementation notes

### Step 4: Run Test
```bash
npx playwright test -g "should handle my error scenario"
```

## 🎨 Error Message Templates

### Network Error
```
"We couldn't load [feature]. Please check your connection."
```

### Asset Missing
```
"Some [assets] couldn't be loaded. Showing simplified view."
```

### WebGL Missing
```
"3D view requires WebGL support. Please update your browser."
```

### Loading Timeout
```
"Loading is taking longer than expected. You can skip this step."
```

### General Error
```
"Something went wrong. Please reload the page."
```

## 📝 Checklist for Error Handling

When implementing error handling, verify:

- [ ] Error detected and logged
- [ ] User-friendly message shown
- [ ] No blank/white screen
- [ ] App remains interactive
- [ ] Navigation still works
- [ ] Retry/reload option available
- [ ] Error boundary catches exceptions
- [ ] Console has debugging info
- [ ] Analytics event fired (optional)
- [ ] Accessibility maintained

## 🚨 Common Issues

### Issue: "WebServer not starting"
**Solution**: Make sure dev server is running
```bash
npm run dev
```

### Issue: "Timeout waiting for selector"
**Solution**: Check if element selector is correct
```bash
npx playwright test --debug
```

### Issue: "Browser not found"
**Solution**: Install Playwright browsers
```bash
npx playwright install
```

### Issue: "Tests flaky on CI"
**Solution**: Increase timeouts for CI
```typescript
timeout: process.env.CI ? 60000 : 30000
```

### Issue: "Can't reproduce locally"
**Solution**: Run in same browser as CI
```bash
npm run test:e2e:chromium
```

## 📚 Resources

- **Full Documentation**: `tests/e2e/docs/ERROR_RECOVERY_TESTING.md`
- **Test Suite**: `tests/e2e/error-recovery.spec.ts`
- **Helper Functions**: `tests/e2e/helpers/error-recovery.ts`
- **Playwright Docs**: https://playwright.dev
- **Existing Tests**: `tests/e2e/*.spec.ts`

## 💡 Tips

1. **Run tests before PR** - Catch errors early
2. **Use UI mode** - Debug visually
3. **Check reports** - Screenshots tell the story
4. **Update snapshots** - When UI changes intentionally
5. **Keep tests focused** - One scenario per test
6. **Use helpers** - Reuse common patterns
7. **Document failures** - Help future you
8. **Test edge cases** - Where bugs hide

## 🎯 Success Metrics

Good error recovery test should:
- ✅ Complete in < 30 seconds
- ✅ Be deterministic (not flaky)
- ✅ Test one clear scenario
- ✅ Have meaningful assertions
- ✅ Provide clear failure messages
- ✅ Be maintainable

## 🏆 Best Practices

1. **Isolate tests** - Each test independent
2. **Clean state** - Reset between tests
3. **Clear names** - Describe what's tested
4. **Good selectors** - Use data-testid when possible
5. **Meaningful waits** - Wait for specific conditions
6. **Error context** - Log why test failed
7. **Retry logic** - For transient failures only
8. **CI friendly** - Works in headless mode

## 📞 Getting Help

If you're stuck:

1. Check the full documentation
2. Review existing tests for patterns
3. Use Playwright Inspector (--debug)
4. Check Playwright docs
5. Ask the team

Happy testing! 🎉
