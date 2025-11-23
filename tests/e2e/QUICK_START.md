# Quick Start - User Journey E2E Test

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Run the Test

### Option 1: Quick Run (Chromium only)
```bash
npm run test:e2e -- user-journey --project=chromium
```

### Option 2: All Browsers
```bash
npm run test:e2e -- user-journey
```

### Option 3: With Visible Browser
```bash
npm run test:e2e:headed -- user-journey
```

### Option 4: Interactive Debug Mode
```bash
npm run test:e2e:ui
# Then select "user-journey.spec.ts" from the list
```

## Expected Output

### Success ✅
```
Running 1 test using 1 worker

  ✓ Complete user journey - homepage to 3D court (45.2s)

    Step 1: Loading homepage...
    Step 2: Verifying loading screen appears...
    Step 3: Monitoring console during loading...
    Step 4: Waiting for loading completion...
    Step 5: Verifying 3D court rendered...
    Step 6: Checking for console errors...
    Step 7: Testing user interactions...
    Step 8: Verifying canvas stability...
    Step 9: Final error check...
    Step 10: Capturing final state...
    ✅ User journey completed successfully
    Total warnings: 0
    Network errors: 0

  1 passed (45.2s)
```

### Failure ❌
```
Running 1 test using 1 worker

  ✗ Complete user journey - homepage to 3D court (30.1s)

    Step 1: Loading homepage...
    Step 2: Verifying loading screen appears...
    Step 3: Monitoring console during loading...
    Step 4: Waiting for loading completion...
    Error: Loading screen timeout after 60s

  1 failed
    user-journey.spec.ts:Complete user journey - homepage to 3D court

Screenshot saved: docs/test-failure-complete-user-journey.png
```

## What Gets Tested

1. **Homepage Load** ✓
   - Page loads successfully
   - No initial errors

2. **Loading Screen** ✓
   - Appears immediately
   - Shows loading phases
   - Completes within 60s

3. **Console Errors** ✓
   - No critical errors
   - Warnings are filtered

4. **3D Canvas** ✓
   - Visible on screen
   - WebGL context active
   - Reasonable dimensions

5. **User Interactions** ✓
   - Click works
   - Hover works
   - Drag/orbit works

6. **Stability** ✓
   - Canvas remains visible
   - No errors after interaction

## Quick Debug

### Check Screenshots
```bash
ls docs/screenshots/
ls docs/test-failure-*.png
```

### View HTML Report
```bash
npm run test:e2e:report
```

### Run with Browser Visible
```bash
npm run test:e2e:headed -- user-journey
```

## Common Issues

### Issue: "Loading timeout"
**Cause**: Assets not loading or dev server not running
**Fix**: Start dev server first: `npm run dev`

### Issue: "Canvas not found"
**Cause**: Three.js failed to initialize
**Fix**: Check browser WebGL support, review console errors

### Issue: "Console errors found"
**Cause**: JavaScript errors in application
**Fix**: Review error output, fix application code

## Next Steps

After successful test:
1. Run on all browsers: `npm run test:e2e -- user-journey`
2. Test on mobile: Check mobile projects pass
3. Review screenshots: `docs/user-journey-success.png`
4. Check performance: Review timing in output

## Files Created

- `/tests/e2e/user-journey.spec.ts` - Main test
- `/tests/e2e/helpers.ts` - Utilities
- `/tests/README.md` - Full documentation
- `/tests/e2e/example-usage.md` - Examples
- `/docs/e2e-test-summary.md` - Summary
