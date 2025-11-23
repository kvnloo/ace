# E2E CI/CD Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with E2E tests running in GitHub Actions CI/CD pipeline.

## Quick Diagnostic Checklist

When E2E tests fail in CI, check these in order:

1. ✅ **Workflow file syntax** - Valid YAML?
2. ✅ **Node.js version** - Matches local environment?
3. ✅ **Browser installation** - Completed successfully?
4. ✅ **Application build** - Build succeeded?
5. ✅ **Web server startup** - Dev server running?
6. ✅ **Test execution** - Which specific tests failed?
7. ✅ **Artifacts** - Download and inspect

## Common Issues and Solutions

### 1. Browser Installation Failures

#### Symptoms
```
Error: browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium-1091/chrome-linux/chrome
```

#### Causes
- Playwright version mismatch
- Missing system dependencies
- Cache corruption

#### Solutions

**A. Update Playwright installation step:**
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps ${{ matrix.browser }}
```

**B. Clear cache and reinstall:**
```yaml
- name: Clear Playwright cache
  run: rm -rf ~/.cache/ms-playwright

- name: Install Playwright browsers
  run: npx playwright install --with-deps ${{ matrix.browser }}
```

**C. Check Playwright version consistency:**
```bash
# package.json and package-lock.json should match
grep "@playwright/test" package.json
grep "@playwright/test" package-lock.json
```

### 2. Web Server Startup Failures

#### Symptoms
```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000
Error: Timed out waiting 120s for the server to start
```

#### Causes
- Dev server not starting
- Port conflict
- Build errors preventing server start

#### Solutions

**A. Increase timeout:**
```typescript
// playwright.config.ts
webServer: {
  timeout: 180 * 1000, // 3 minutes
}
```

**B. Add detailed logging:**
```typescript
webServer: {
  stdout: 'pipe',  // Show all output
  stderr: 'pipe',  // Show all errors
}
```

**C. Check build step:**
```yaml
- name: Build application
  run: npm run build

- name: Check build output
  run: ls -la dist/
```

**D. Verify dev server command:**
```bash
# Test locally with CI=true
CI=true npm run dev
```

### 3. Test Timeouts

#### Symptoms
```
Error: Test timeout of 30000ms exceeded
Error: page.waitForSelector: Timeout 30000ms exceeded
```

#### Causes
- Slow network in CI
- Resource-intensive 3D rendering
- Animation delays
- Unreliable selectors

#### Solutions

**A. Increase test timeout:**
```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60 * 1000, // 1 minute per test
});
```

**B. Increase expect timeout:**
```typescript
expect: {
  timeout: 10000, // 10 seconds
}
```

**C. Use more specific timeouts:**
```typescript
// In test file
test('slow 3D operation', async ({ page }) => {
  test.setTimeout(90000); // 90 seconds for this specific test

  await page.goto('/');
  await page.waitForSelector('canvas', { timeout: 30000 });
});
```

**D. Optimize WebGL operations:**
```typescript
// Wait for Three.js scene to be ready
await page.evaluate(() => {
  return new Promise((resolve) => {
    const checkScene = () => {
      if (window.scene?.children?.length > 0) {
        resolve();
      } else {
        requestAnimationFrame(checkScene);
      }
    };
    checkScene();
  });
});
```

### 4. WebGL/Three.js Rendering Issues

#### Symptoms
```
Error: WebGL not supported
Error: Failed to create WebGL context
Warning: Using software rendering
```

#### Causes
- CI environment lacks GPU
- WebGL disabled in headless mode
- Browser flags missing

#### Solutions

**A. Enable software rendering:**
```typescript
// playwright.config.ts
use: {
  launchOptions: {
    args: [
      '--enable-webgl',
      '--use-gl=swiftshader',
      '--enable-accelerated-2d-canvas',
    ],
  },
}
```

**B. Mock WebGL in tests when appropriate:**
```typescript
// For non-visual tests
await page.addInitScript(() => {
  window.WebGLRenderingContext = class MockWebGL {};
});
```

**C. Use headed mode for debugging:**
```yaml
- name: Run E2E tests (headed for debugging)
  run: npm run test:e2e:headed
```

### 5. Screenshot/Video Artifacts Missing

#### Symptoms
- No artifacts uploaded
- Empty artifact files
- 404 on artifact download

#### Causes
- Artifacts generated in wrong directory
- Permissions issues
- Path misconfiguration

#### Solutions

**A. Verify artifact paths:**
```yaml
- name: Upload screenshots
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: test-screenshots-${{ matrix.browser }}-${{ matrix.os }}
    path: tests/e2e/screenshots/  # Must match playwright.config.ts
    if-no-files-found: warn  # Add this to debug
```

**B. Check Playwright output directories:**
```typescript
// playwright.config.ts
reporter: [
  ['html', { outputFolder: 'tests/e2e/reports/html' }],
],
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

**C. List files before upload:**
```yaml
- name: Debug - List artifact directories
  if: always()
  run: |
    echo "Screenshots:"
    ls -R tests/e2e/screenshots/ || echo "No screenshots"
    echo "Videos:"
    ls -R tests/e2e/videos/ || echo "No videos"
```

### 6. Flaky Tests

#### Symptoms
- Tests pass locally, fail in CI
- Tests fail randomly
- Different results across browsers

#### Causes
- Race conditions
- Timing dependencies
- Network instability
- Resource constraints

#### Solutions

**A. Enable auto-wait:**
```typescript
// Playwright automatically waits, but ensure you're using it
await page.click('button'); // Good - auto-waits
await page.locator('button').click(); // Better - explicit locator
```

**B. Use stable selectors:**
```typescript
// Bad - fragile selectors
await page.click('div > div > button');

// Good - data attributes
await page.click('[data-testid="submit-button"]');

// Better - accessible selectors
await page.click('button:has-text("Submit")');
```

**C. Increase retries:**
```typescript
// playwright.config.ts
retries: process.env.CI ? 3 : 0, // Retry up to 3 times
```

**D. Add explicit waits for network:**
```typescript
await page.waitForLoadState('networkidle');
await page.waitForResponse(response =>
  response.url().includes('/api/') && response.status() === 200
);
```

### 7. Quality Gate Failures

#### Symptoms
```
❌ Test pass rate below 90% threshold
Error: Cannot read property 'suites' of undefined
```

#### Causes
- Test failures bringing pass rate down
- Missing test results JSON
- Incorrect JSON parsing

#### Solutions

**A. Debug quality gate script:**
```yaml
- name: Check test pass rate
  run: |
    cat test-results/test-results-chromium-ubuntu-latest/results.json
    node -e "
      const fs = require('fs');
      const resultsPath = 'test-results/test-results-chromium-ubuntu-latest/results.json';

      if (!fs.existsSync(resultsPath)) {
        console.error('Results file not found');
        process.exit(1);
      }

      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      console.log(JSON.stringify(results, null, 2));
    "
```

**B. Verify results.json structure:**
```bash
# Download artifact locally and inspect
unzip test-results-chromium-ubuntu-latest.zip
cat results.json | jq .
```

**C. Temporarily disable quality gate:**
```yaml
# For debugging only
- name: Check test pass rate
  continue-on-error: true
  run: |
    # ... quality check script
```

### 8. Matrix Job Failures

#### Symptoms
- Only specific OS/browser combinations fail
- Inconsistent results across matrix

#### Causes
- OS-specific behavior
- Browser-specific rendering
- Path separator differences (Windows)

#### Solutions

**A. Add OS-specific conditions:**
```yaml
- name: Install dependencies (Windows)
  if: runner.os == 'Windows'
  run: npm ci --legacy-peer-deps

- name: Install dependencies (Unix)
  if: runner.os != 'Windows'
  run: npm ci
```

**B. Use cross-platform paths:**
```typescript
import path from 'path';

const screenshotPath = path.join(
  process.cwd(),
  'tests',
  'e2e',
  'screenshots',
  'image.png'
);
```

**C. Debug matrix-specific issues:**
```yaml
- name: Debug environment
  run: |
    echo "OS: ${{ matrix.os }}"
    echo "Browser: ${{ matrix.browser }}"
    echo "Node: $(node --version)"
    echo "npm: $(npm --version)"
    npx playwright --version
```

### 9. Permission Denied Errors

#### Symptoms
```
Error: EACCES: permission denied, mkdir 'tests/e2e/reports'
Error: EPERM: operation not permitted
```

#### Causes
- Insufficient directory permissions
- File locks (especially Windows)

#### Solutions

**A. Create directories with proper permissions:**
```yaml
- name: Setup test directories
  run: |
    mkdir -p tests/e2e/reports tests/e2e/screenshots tests/e2e/videos
    chmod -R 755 tests/e2e/
```

**B. Windows-specific fix:**
```yaml
- name: Setup test directories (Windows)
  if: runner.os == 'Windows'
  run: |
    if not exist "tests\e2e\reports" mkdir tests\e2e\reports
    if not exist "tests\e2e\screenshots" mkdir tests\e2e\screenshots
```

### 10. Out of Memory Errors

#### Symptoms
```
Error: JavaScript heap out of memory
FATAL ERROR: Reached heap limit Allocation failed
```

#### Causes
- Large test suite
- Memory leaks in tests
- Insufficient CI resources

#### Solutions

**A. Increase Node.js memory:**
```yaml
- name: Run E2E tests
  run: NODE_OPTIONS="--max-old-space-size=4096" npm run test:e2e
```

**B. Reduce parallel workers:**
```typescript
// playwright.config.ts
workers: process.env.CI ? 1 : undefined,
```

**C. Split test execution:**
```yaml
- name: Run critical tests
  run: npx playwright test tests/e2e/critical/

- name: Run remaining tests
  run: npx playwright test --ignore-snapshots tests/e2e/critical/
```

## Debugging Workflow

### Step 1: Identify the Failure Point

```yaml
# Add debug output to each step
- name: Step Name
  run: |
    set -x  # Enable verbose mode
    command here
    echo "✅ Step completed successfully"
```

### Step 2: Download All Artifacts

```bash
# From GitHub Actions UI
1. Click on failed workflow run
2. Scroll to "Artifacts" section
3. Download all artifacts
4. Extract and inspect
```

### Step 3: Reproduce Locally with CI Environment

```bash
# Set CI environment variable
export CI=true

# Use exact Node version
nvm use 18

# Clean install
rm -rf node_modules package-lock.json
npm install

# Run tests exactly as CI does
npm run test:e2e:chromium
```

### Step 4: Enable Debug Mode

```yaml
# In workflow file
- name: Run E2E tests with debug
  run: DEBUG=pw:api npm run test:e2e
  env:
    CI: true
    PWDEBUG: 1
```

### Step 5: Use Trace Viewer

```bash
# Download trace artifact
# Then locally:
npx playwright show-trace trace.zip
```

## Performance Optimization Tips

### Reduce CI Time

1. **Cache Dependencies**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

2. **Run Only Changed Tests**
```yaml
- name: Get changed files
  id: changed-files
  uses: tj-actions/changed-files@v40

- name: Run affected tests
  run: npx playwright test ${{ steps.changed-files.outputs.all_changed_files }}
```

3. **Skip Redundant Builds**
```yaml
on:
  pull_request:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### Monitor Resource Usage

```yaml
- name: Monitor resources during tests
  run: |
    (while true; do ps aux --sort=-%mem | head -10; sleep 10; done) &
    MONITOR_PID=$!
    npm run test:e2e
    kill $MONITOR_PID
```

## Getting Help

### Information to Provide

When reporting CI issues, include:

1. **Workflow run URL**
2. **Error message** (complete stack trace)
3. **Downloaded artifacts** (screenshots, videos, traces)
4. **OS/Browser combination** that failed
5. **Playwright version** (`npx playwright --version`)
6. **Node version** from workflow logs
7. **Does it work locally?** Yes/No

### Useful Commands

```bash
# Check Playwright system requirements
npx playwright install --dry-run

# Validate playwright.config.ts
npx playwright test --list

# Show Playwright configuration
npx playwright show-config

# Check for Playwright updates
npm outdated @playwright/test
```

## Related Resources

- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Three.js Testing Guide](https://threejs.org/docs/#manual/en/introduction/Testing)
- [E2E Integration Guide](./e2e-integration.md)
