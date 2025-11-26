# Continuous Validation System

Autonomous testing feedback loop for ACE application with console error monitoring.

## Overview

The continuous validation script runs smoke tests every 5 minutes, checking for:
- Page load errors
- Console errors (errors, warnings, 404s)
- Critical user journeys
- TypeScript/JavaScript runtime errors

## Usage

### Start Continuous Validation

```bash
# Make script executable (first time only)
chmod +x scripts/continuous-validation.sh

# Run continuous validation
./scripts/continuous-validation.sh
```

### Run with Development Server

```bash
# Add to package.json first (see Integration section)
npm run dev:validated
```

This starts both the dev server and continuous validation in parallel.

## Integration

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "validate:continuous": "./scripts/continuous-validation.sh",
    "dev:validated": "npm run dev & npm run validate:continuous"
  }
}
```

## What It Tests

### Test Suite Coverage

1. **Smoke Tests** (`tests/e2e/smoke.spec.ts`)
   - Homepage loads
   - Navigation works
   - Core components render
   - No critical errors

2. **Console Error Tests** (`tests/e2e/console-errors.spec.ts`)
   - No console.error() calls
   - No console.warn() for critical issues
   - No 404 resource errors
   - No TypeScript/JavaScript errors

3. **User Journey Tests** (`tests/e2e/user-journey.spec.ts`)
   - Complete user workflows
   - Form submissions
   - Navigation flows
   - Data interactions

## Validation Loop Details

### Iteration Cycle

```
Start → Run Tests → Check Results → Log → Wait 5 min → Repeat
```

### Test Execution

- Runs every 5 minutes
- Maximum 3 failures before stopping current iteration
- Logs saved to `/tmp/validation-{iteration}.log`
- Console output shows real-time results

### Success Criteria

✅ **Pass**: All tests complete with no errors
- No console errors detected
- All assertions pass
- No 404 or resource loading errors

❌ **Fail**: Any test failure
- Critical errors highlighted
- Log file location provided
- Specific error types flagged

## Output Format

### Iteration Header
```
========================================
🔄 Validation Iteration #1
⏰ Fri Nov 22 12:00:00 UTC 2025
========================================
```

### Test Results
```
Running 3 tests using 1 worker
  ✓ tests/e2e/smoke.spec.ts:3:5 - homepage loads (1s)
  ✓ tests/e2e/console-errors.spec.ts:3:5 - no console errors (2s)
  ✓ tests/e2e/user-journey.spec.ts:3:5 - user can navigate (3s)

✅ All tests passed - No console errors
```

### Error Detection
```
❌ Tests failed - Check console errors
📄 Log saved to: /tmp/validation-1.log

🚨 CRITICAL ERRORS DETECTED!
  - Console error: TypeError: Cannot read property 'x' of undefined
  - 404: /api/missing-endpoint
```

## Log Files

### Location
- `/tmp/validation-{iteration}.log`
- One log file per iteration
- Contains complete test output

### Log Retention
- Automatically overwrites old logs
- Keep last 10 iterations manually if needed
- Critical errors highlighted in console output

## Monitoring

### Watch for Critical Patterns

The script automatically alerts on:
- `console error` - JavaScript errors
- `404` - Missing resources
- `TypeError` - Type-related runtime errors
- Network failures
- Assertion failures

### Manual Inspection

Check logs for patterns:
```bash
# View latest log
tail -f /tmp/validation-*.log

# Search for specific errors
grep -i "error\|fail\|404" /tmp/validation-*.log

# Check console errors specifically
grep "Console error:" /tmp/validation-*.log
```

## Stopping Validation

```bash
# Press Ctrl+C to stop
^C

# Or kill by process name
pkill -f continuous-validation
```

## Best Practices

### Development Workflow

1. **Start validation with dev server**
   ```bash
   npm run dev:validated
   ```

2. **Make code changes**
   - Validation runs automatically every 5 minutes
   - Immediate feedback on breaks

3. **Check validation output**
   - Monitor console for failures
   - Review logs for details

4. **Fix issues before committing**
   - Ensure validation passes
   - No console errors present

### CI/CD Integration

Run single validation cycle in CI:
```bash
# In CI pipeline
npx playwright test tests/e2e/smoke.spec.ts \
  tests/e2e/console-errors.spec.ts \
  tests/e2e/user-journey.spec.ts \
  --reporter=list
```

### Production Monitoring

For production monitoring, consider:
- Reduce interval to 15-30 minutes
- Send alerts to monitoring service
- Log to persistent storage
- Track trends over time

## Customization

### Adjust Test Interval

Edit `scripts/continuous-validation.sh`:
```bash
sleep 300  # Change 300 (5 min) to desired seconds
```

Examples:
- 1 minute: `sleep 60`
- 10 minutes: `sleep 600`
- 30 minutes: `sleep 1800`

### Add More Tests

Include additional test files:
```bash
npx playwright test tests/e2e/smoke.spec.ts \
  tests/e2e/console-errors.spec.ts \
  tests/e2e/user-journey.spec.ts \
  tests/e2e/performance.spec.ts \    # Add new tests
  tests/e2e/accessibility.spec.ts \  # Add more tests
  --reporter=list
```

### Change Failure Threshold

```bash
--max-failures=3  # Change to desired number
```

## Troubleshooting

### Script Won't Execute
```bash
chmod +x scripts/continuous-validation.sh
```

### Tests Not Running
- Ensure Playwright is installed: `npm install -D @playwright/test`
- Install browsers: `npx playwright install`

### High CPU Usage
- Increase sleep interval
- Reduce number of tests
- Run on fewer browsers

### Logs Not Saving
- Check `/tmp` directory permissions
- Use alternative log path if needed

## Related Documentation

- `/home/kvn/workspace/evolve/repos/ace/tests/e2e/smoke.spec.ts` - Smoke tests
- `/home/kvn/workspace/evolve/repos/ace/tests/e2e/console-errors.spec.ts` - Console error tests
- `/home/kvn/workspace/evolve/repos/ace/tests/e2e/user-journey.spec.ts` - User journey tests
- `/home/kvn/workspace/evolve/repos/ace/playwright.config.ts` - Playwright configuration
