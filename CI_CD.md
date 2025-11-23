# CI/CD Pipeline Documentation

## Overview

This project uses a comprehensive CI/CD pipeline built with GitHub Actions to ensure code quality, performance, and reliable deployments. The pipeline consists of three main workflows that work together to maintain high standards while enabling rapid development.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Pipeline                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │   Test & QA      │  │  Quality Gates   │  │  Deploy   │ │
│  │  (test.yml)      │  │  (quality.yml)   │  │(deploy.yml)│ │
│  └──────────────────┘  └──────────────────┘  └───────────┘ │
│           │                     │                    │       │
│  ┌────────▼─────────┐  ┌───────▼────────┐  ┌────────▼────┐ │
│  │ • Lint           │  │ • Bundle Size  │  │ • Build     │ │
│  │ • Format         │  │ • Performance  │  │ • Deploy    │ │
│  │ • Type Check     │  │ • A11y Audit   │  │   to Pages  │ │
│  │ • Unit Tests     │  │ • Code Metrics │  │             │ │
│  │ • E2E Tests      │  └────────────────┘  └─────────────┘ │
│  │ • Build Verify   │                                       │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflows

### 1. Test & Quality Checks (`test.yml`)

**Purpose:** Ensure code quality, correctness, and functionality before merging

**Triggers:**
- Push to `main` or `dev` branches
- Pull requests targeting `main` or `dev`

**Jobs:**

#### Lint Check
- **Runtime:** ~2-3 minutes
- **Tools:** ESLint with TypeScript, React, and accessibility plugins
- **Checks:**
  - TypeScript code quality
  - React best practices
  - Hook usage patterns
  - Accessibility (jsx-a11y)
  - Import organization
- **Artifacts:** ESLint JSON report

#### Format Check
- **Runtime:** ~1-2 minutes
- **Tools:** Prettier
- **Checks:**
  - Code formatting consistency
  - Line endings (LF)
  - Trailing commas
  - Semicolons and quotes
- **Config:** `.prettierrc`

#### Type Check
- **Runtime:** ~2-3 minutes
- **Tools:** TypeScript Compiler (tsc)
- **Checks:**
  - Strict type safety
  - No implicit any
  - Strict null checks
  - Function types
- **Config:** `tsconfig.json`

#### Unit Tests
- **Runtime:** ~3-5 minutes
- **Tools:** Vitest with React Testing Library
- **Coverage Requirements:**
  - Lines: 70%
  - Functions: 70%
  - Branches: 70%
  - Statements: 70%
- **Outputs:**
  - Coverage report (HTML, LCOV, JSON)
  - Codecov integration (if configured)
- **Artifacts:** Coverage reports

#### E2E Tests
- **Runtime:** ~10-15 minutes per browser
- **Tools:** Playwright
- **Browsers Tested:**
  - Chromium
  - Firefox
  - WebKit (Safari)
- **Features:**
  - Parallel execution across browsers
  - Screenshot on failure
  - Video recording on retry
  - 2 retries on CI
- **Artifacts:**
  - Playwright reports
  - Test results
  - Screenshots/videos

#### Build Verification
- **Runtime:** ~3-5 minutes per environment
- **Environments:**
  - Production (`/ace/`)
  - Development (`/ace/dev/`)
- **Checks:**
  - Successful build completion
  - Output validation (dist/ directory)
  - Entry point verification (index.html)
  - Bundle analysis
- **Artifacts:**
  - Build output
  - Bundle statistics

**Status:** ✅ Must pass for PR merge

---

### 2. Quality Gates & Performance (`quality.yml`)

**Purpose:** Monitor quality metrics, performance, and accessibility without blocking deployment

**Triggers:**
- Push to `main` or `dev` branches
- Pull requests targeting `main` or `dev`

**Jobs:**

#### Bundle Size Analysis
- **Runtime:** ~3-5 minutes
- **Metrics:**
  - Total bundle size
  - Individual asset sizes
  - Large file detection (>500KB threshold)
- **Reporting:**
  - GitHub Actions summary
  - PR comment with breakdown
  - Trend tracking
- **Tools:** Custom analysis script
- **Artifacts:** Bundle stats visualization

#### Performance Budget Check
- **Runtime:** ~5-10 minutes
- **Tools:** Lighthouse CI
- **Metrics Monitored:**
  - **LCP (Largest Contentful Paint):** Target <2.5s, Threshold <4.0s
  - **FID (First Input Delay):** Target <100ms, Threshold <300ms
  - **CLS (Cumulative Layout Shift):** Target <0.1, Threshold <0.25
  - **TTFB (Time to First Byte):** Target <800ms, Threshold <1.8s
  - **INP (Interaction to Next Paint):** Target <200ms, Threshold <500ms
- **Lighthouse Scores:**
  - Performance: >90
  - Accessibility: >90
  - Best Practices: >90
  - SEO: >90
- **Configuration:** Dynamic `lighthouserc.json`
- **Artifacts:** Lighthouse reports

#### Accessibility Audit
- **Runtime:** ~3-5 minutes
- **Tools:**
  - axe-core via axe-playwright
  - ESLint jsx-a11y rules
- **Checks:**
  - WCAG 2.1 Level AA compliance
  - Keyboard navigation
  - ARIA labels and roles
  - Color contrast ratios
  - Alternative text
  - Focus management
- **Severity Levels:**
  - Critical/Serious: Reported as warnings
  - Moderate/Minor: Logged for review
- **Artifacts:** Accessibility report

#### Code Quality Metrics
- **Runtime:** ~1-2 minutes
- **Statistics:**
  - Total TypeScript files
  - Lines of code
  - Component count
  - Code health indicators
- **Checks:**
  - TypeScript strict mode enabled
  - ESLint configuration
  - Prettier integration
  - Test coverage trends

**Status:** ⚠️ Informational (warnings don't block deployment)

---

### 3. Build and Deploy (`deploy.yml`)

**Purpose:** Automated deployment to GitHub Pages

**Triggers:**
- Push to `main` branch (production)
- Push to `dev` branch (preview)

**Process:**

1. **Build Main Branch**
   - Checkout `main`
   - Install dependencies
   - Build with base path `/ace/`
   - Copy to deploy directory

2. **Build Dev Branch**
   - Checkout `dev`
   - Install dependencies
   - Build with base path `/ace/dev/`
   - Copy to deploy/dev subdirectory

3. **Deploy to GitHub Pages**
   - Upload combined artifact
   - Deploy to gh-pages branch
   - Concurrent deployment protection

**Deployment URLs:**
- Production: https://kvnloo.github.io/ace/
- Development: https://kvnloo.github.io/ace/dev/

**Status:** ✅ Independent of test workflows

---

## How to View Results

### GitHub Actions Dashboard

1. **Navigate to Actions tab:**
   ```
   https://github.com/kvnloo/ace/actions
   ```

2. **Select a workflow:**
   - "Test & Quality Checks" - View test results
   - "Quality Gates & Performance" - View metrics
   - "Build and Deploy to GitHub Pages" - View deployments

3. **View workflow run:**
   - Click on any run to see details
   - Expand jobs to see individual steps
   - Check job summaries for formatted reports

### Status Badges

The README displays real-time status badges:

```markdown
[![Test & Quality Checks](https://github.com/kvnloo/ace/actions/workflows/test.yml/badge.svg)](https://github.com/kvnloo/ace/actions/workflows/test.yml)
[![Quality Gates](https://github.com/kvnloo/ace/actions/workflows/quality.yml/badge.svg)](https://github.com/kvnloo/ace/actions/workflows/quality.yml)
[![Deploy](https://github.com/kvnloo/ace/actions/workflows/deploy.yml/badge.svg)](https://github.com/kvnloo/ace/actions/workflows/deploy.yml)
```

### Pull Request Checks

On pull requests, you'll see:

1. **Required Checks:**
   - All test jobs must pass
   - Green checkmarks required for merge

2. **Status Checks:**
   - Lint Check ✅
   - Format Check ✅
   - Type Check ✅
   - Unit Tests ✅
   - E2E Tests ✅
   - Build Verification ✅

3. **PR Comments:**
   - Bundle size analysis
   - Coverage reports
   - Performance metrics

### Artifacts

Download detailed reports from workflow runs:

1. **Test Workflow Artifacts:**
   - `eslint-report` - Detailed linting results
   - `coverage-report` - Full coverage HTML report
   - `playwright-report-{browser}` - E2E test reports
   - `test-results-{browser}` - Raw test results
   - `build-{environment}` - Build output
   - `bundle-stats-{environment}` - Bundle analysis

2. **Quality Workflow Artifacts:**
   - `bundle-analysis` - Interactive bundle visualization
   - `lighthouse-reports` - Lighthouse CI reports

**Retention:** Artifacts are kept for 7-30 days depending on type

---

## Local Development Workflow

### Run Checks Locally

Before pushing, run the same checks locally:

```bash
# Lint check
npm run lint

# Format check
npm run format:check

# Fix formatting
npm run format

# Type check
npx tsc --noEmit

# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests (all browsers)
npm run test:e2e

# E2E tests (specific browser)
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit

# Build verification
npm run build
```

### Pre-commit Checklist

- [ ] Code is formatted (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] Types are correct (`npx tsc --noEmit`)
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)

---

## Performance Optimization

### Fast Feedback

The pipeline is optimized for quick feedback:

1. **Parallel Execution:**
   - All test jobs run simultaneously
   - E2E tests run in parallel across browsers
   - Independent job execution

2. **Caching:**
   - npm dependencies cached
   - Playwright browsers cached
   - Build artifacts cached

3. **Early Termination:**
   - Jobs fail fast on errors
   - Cancel in-progress runs for updated PRs
   - Timeouts prevent hanging jobs

### Expected Runtimes

| Job | Duration |
|-----|----------|
| Lint | 2-3 min |
| Format | 1-2 min |
| Type Check | 2-3 min |
| Unit Tests | 3-5 min |
| E2E Tests | 10-15 min/browser |
| Build | 3-5 min |
| Quality Gates | 10-15 min total |
| **Total (parallel)** | **15-20 min** |

---

## Configuration Files

### Workflow Configurations

- `.github/workflows/test.yml` - Test and QA pipeline
- `.github/workflows/quality.yml` - Quality gates and performance
- `.github/workflows/deploy.yml` - Deployment pipeline

### Tool Configurations

- `eslint.config.js` - ESLint rules and plugins
- `.prettierrc` - Prettier formatting rules
- `tsconfig.json` - TypeScript compiler options
- `vitest.config.ts` - Vitest test configuration
- `playwright.config.ts` - Playwright E2E configuration
- `package.json` - Performance budgets (performanceBudgets section)

---

## Troubleshooting

### Common Issues

#### 1. Lint Failures

```bash
# Check locally
npm run lint

# Auto-fix issues
npm run lint:fix

# View detailed report
npm run lint:report
```

#### 2. Format Failures

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format
```

#### 3. Type Errors

```bash
# Check types
npx tsc --noEmit

# Watch mode for development
npx tsc --noEmit --watch
```

#### 4. Test Failures

```bash
# Run specific test file
npm test -- path/to/test.test.ts

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui
```

#### 5. E2E Test Failures

```bash
# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

#### 6. Build Failures

```bash
# Build with verbose output
npm run build -- --logLevel=info

# Build with bundle analysis
npm run build:analyze
```

### GitHub Actions Issues

#### Workflow Not Running

- Check branch name matches trigger conditions
- Verify workflow file syntax (YAML)
- Check repository settings → Actions → General

#### Secrets Not Available

- Configure secrets in repository settings
- Secrets required:
  - `CODECOV_TOKEN` (optional, for coverage reports)

#### Artifact Upload Failures

- Check artifact size limits (500MB max)
- Verify path exists before upload
- Check retention days setting

---

## Best Practices

### For Developers

1. **Run checks before pushing:**
   ```bash
   npm run format && npm run lint && npx tsc --noEmit && npm test
   ```

2. **Write tests for new features:**
   - Unit tests for logic
   - Integration tests for components
   - E2E tests for critical user flows

3. **Monitor bundle size:**
   - Check bundle analysis reports
   - Use code splitting for large dependencies
   - Lazy load non-critical components

4. **Keep coverage high:**
   - Aim for >70% coverage
   - Test edge cases
   - Focus on critical paths

### For Reviewers

1. **Check CI status:**
   - All checks must be green
   - Review coverage reports
   - Check bundle size changes

2. **Review quality metrics:**
   - Performance scores
   - Accessibility issues
   - Code complexity

3. **Test locally:**
   - Pull the PR branch
   - Run tests locally
   - Test in browser

---

## Continuous Improvement

### Metrics to Monitor

1. **Test Reliability:**
   - Flaky test rate
   - Test execution time
   - Coverage trends

2. **Performance:**
   - Core Web Vitals
   - Bundle size trends
   - Build times

3. **Quality:**
   - Lint violations
   - Type errors
   - Accessibility issues

### Future Enhancements

- [ ] Visual regression testing
- [ ] Automated dependency updates (Dependabot)
- [ ] Performance regression detection
- [ ] Automated changelog generation
- [ ] Release automation
- [ ] Canary deployments
- [ ] A/B testing infrastructure

---

## Support

### Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [ESLint Documentation](https://eslint.org/)

### Getting Help

1. Check workflow run logs for error details
2. Review this documentation
3. Search GitHub Issues
4. Contact the team via repository issues

---

## Summary

This CI/CD pipeline provides:

✅ **Fast Feedback** - Parallel execution, <20 minute total runtime
✅ **Comprehensive Testing** - Lint, format, type, unit, E2E, and build checks
✅ **Quality Gates** - Bundle size, performance, and accessibility monitoring
✅ **Clear Reporting** - Status badges, PR comments, detailed artifacts
✅ **Non-Blocking** - Quality gates inform but don't block deployment
✅ **Automated Deployment** - Push to main/dev automatically deploys

The pipeline ensures high code quality while maintaining developer velocity and enabling rapid iteration.
