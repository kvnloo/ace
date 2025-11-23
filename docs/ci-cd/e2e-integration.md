# E2E Testing CI/CD Integration Guide

## Overview

This guide covers the integration of Playwright E2E tests into our GitHub Actions CI/CD pipeline for the ACE Facility React + Three.js application.

## Pipeline Architecture

### Workflow Structure

Our E2E testing pipeline consists of four main jobs:

1. **e2e-tests**: Runs tests across multiple browsers and operating systems
2. **e2e-report**: Generates and publishes combined test reports
3. **quality-gates**: Validates quality metrics and enforces standards
4. **notify-failure**: Sends notifications when tests fail

### Test Matrix

```yaml
Strategy:
  - Operating Systems: Ubuntu, macOS, Windows
  - Browsers: Chromium, Firefox, WebKit
  - Parallel Execution: Yes (per browser/OS combination)
```

**Matrix Exclusions:**
- WebKit on Linux (flaky, use macOS instead)
- WebKit on Windows (limited support)

## Trigger Conditions

The E2E test workflow runs on:

- **Push events** to:
  - `main` branch
  - `develop` branch
  - `enhance/**` branches

- **Pull request events** to:
  - `main` branch
  - `develop` branch

## Test Execution Flow

### 1. Setup Phase
```bash
# Checkout code
git checkout

# Install Node.js with caching
node v18 + npm cache

# Install dependencies
npm ci

# Install browser binaries
npx playwright install --with-deps <browser>
```

### 2. Build Phase
```bash
# Build the application
npm run build
```

### 3. Test Execution Phase
```bash
# Run E2E tests for specific browser
npm run test:e2e:<browser>

# Environment:
CI=true  # Enables CI-specific configurations
```

### 4. Artifact Collection Phase

The pipeline automatically collects and uploads:

| Artifact Type | Condition | Retention |
|--------------|-----------|-----------|
| Test Results (HTML/JSON) | Always | 30 days |
| Test Videos | On Failure | 7 days |
| Screenshots | On Failure | 7 days |
| Trace Files | On Failure | 7 days |

### 5. Report Generation Phase

After all tests complete:
1. Downloads all test results from matrix jobs
2. Merges reports using Playwright's merge-reports
3. Generates combined HTML report
4. Publishes to GitHub Pages (on main branch)

## Quality Gates

The pipeline enforces the following quality standards:

### ✅ Test Pass Rate
- **Threshold**: Minimum 90% pass rate
- **Validation**: Analyzes JSON test results
- **Failure Action**: Build fails if below threshold

### ✅ Accessibility Standards
- **Validation**: Checks for accessibility violations
- **Failure Action**: Build fails on critical violations
- *Note: Implementation pending test creation*

### ✅ Performance Budgets
- **Validation**: Enforces performance thresholds
- **Failure Action**: Build fails if budgets exceeded
- *Note: Implementation pending test creation*

## NPM Scripts Reference

### Running Tests Locally

```bash
# Run all E2E tests
npm run test:e2e

# Run tests for specific browser
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run mobile tests
npm run test:e2e:mobile

# Debug mode (step-through)
npm run test:e2e:debug

# Interactive UI mode
npm run test:e2e:ui

# View last test report
npm run test:e2e:report

# Install Playwright browsers
npm run test:e2e:install
```

## CI Environment Configuration

### Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `CI` | `true` | Enables CI-specific Playwright config |
| `NODE_VERSION` | `18` | Node.js version for consistency |

### Playwright CI Optimizations

When `CI=true`, the following configurations apply:

```typescript
{
  forbidOnly: true,        // Fail if test.only found
  retries: 2,              // Retry failed tests twice
  workers: 1,              // Sequential execution (stability)
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  trace: 'on-first-retry'
}
```

## Viewing Test Results

### During CI Run

1. **GitHub Actions UI**
   - Go to repository → Actions tab
   - Select E2E Tests workflow
   - View live test execution logs

2. **Real-time Logs**
   - Expand individual jobs
   - View browser-specific test output
   - See test execution timeline

### After CI Run

1. **Artifacts**
   - Download test results, videos, screenshots
   - Available in workflow run summary
   - Organized by browser and OS

2. **HTML Reports**
   - Access combined report from artifacts
   - View GitHub Pages report (main branch)
   - URL: `https://<org>.github.io/<repo>/e2e-reports/<run-number>`

3. **Test Videos**
   - Download from artifacts (on failure)
   - Shows exact test execution
   - Includes WebGL/Three.js rendering

## GitHub Pages Report Publishing

On successful pushes to `main`:

1. Combined HTML report generated
2. Published to GitHub Pages
3. Accessible via permanent URL
4. Historical reports maintained

**Enable GitHub Pages:**
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. No additional configuration needed

## Performance Characteristics

### Expected Timings

| Job | Duration | Notes |
|-----|----------|-------|
| Setup | 2-3 min | Includes browser installation |
| Build | 1-2 min | Vite production build |
| Test Execution | 5-15 min | Depends on test count |
| Report Generation | 1-2 min | Merges all results |
| **Total** | **10-25 min** | Per matrix combination |

### Optimization Strategies

1. **Caching**
   - Node modules cached by setup-node
   - Playwright binaries cached automatically
   - Build artifacts reused when possible

2. **Parallel Execution**
   - Matrix strategy runs browsers in parallel
   - Multiple OS builds run concurrently
   - Maximum parallelism per runner limits

3. **Conditional Steps**
   - Artifacts uploaded only when needed
   - Reports generated only on completion
   - Notifications sent only on failure

## Failure Notification

### Current Implementation

The workflow logs failure messages to the GitHub Actions console:
```
❌ E2E Tests Failed
View test reports and artifacts for details
```

### Future Integrations

Uncomment and configure in `.github/workflows/e2e-tests.yml`:

**Slack:**
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"E2E tests failed on ${{ github.ref }}"}' \
  ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Discord:**
```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"content":"E2E tests failed on ${{ github.ref }}"}' \
  ${{ secrets.DISCORD_WEBHOOK_URL }}
```

**Email:**
- Use GitHub's built-in email notifications
- Settings → Notifications → Actions

## Integration with PR Workflow

### Required Checks

Configure branch protection to require E2E tests:

1. Go to Settings → Branches
2. Edit protection rule for `main`
3. Enable "Require status checks to pass"
4. Select:
   - `E2E Tests (chromium, ubuntu-latest)`
   - `E2E Tests (firefox, ubuntu-latest)`
   - `Quality Gate Validation`

### PR Comments

Future enhancement: Automatic PR comments with test results summary.

## Security Considerations

### Secrets Management

- GitHub token: Automatically provided
- Additional secrets: Add via Settings → Secrets → Actions
- Never commit secrets to repository

### Permissions

The workflow requires:
- `contents: read` - Checkout code
- `pages: write` - Publish reports
- `actions: read` - Download artifacts

## Monitoring and Maintenance

### Key Metrics to Track

1. **Test Pass Rate Trend**
   - Monitor quality-gates job
   - Track historical pass rates
   - Investigate declining trends

2. **Execution Time Trend**
   - Monitor workflow duration
   - Identify slow tests
   - Optimize as needed

3. **Flaky Test Detection**
   - Tests failing inconsistently
   - Browser-specific failures
   - OS-specific issues

### Maintenance Tasks

**Weekly:**
- Review failed test artifacts
- Update flaky test list
- Check browser version updates

**Monthly:**
- Update Playwright version
- Review and optimize test suite
- Clean up old artifacts

## Next Steps

1. **Implement actual E2E tests** (minimum 5 required)
2. **Enable GitHub Pages** for report publishing
3. **Configure branch protection** to require tests
4. **Set up failure notifications** (Slack/Discord)
5. **Add accessibility and performance tests**
6. **Implement test coverage reporting**

## Related Documentation

- [Playwright Configuration](../../playwright.config.ts)
- [E2E Test Structure](../testing/e2e-structure.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
