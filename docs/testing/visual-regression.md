# Visual Regression Testing Strategy

## Overview
Comprehensive visual regression testing approach for ACE Tennis Management System to ensure consistent UI appearance across code changes, browsers, and devices.

---

## Component Snapshot Strategy

### Snapshot Organization

```
tests/
└── e2e/
    └── visual/
        ├── baselines/          # Reference screenshots
        │   ├── chromium/
        │   ├── firefox/
        │   └── webkit/
        ├── snapshots/          # Current test snapshots
        │   ├── chromium/
        │   ├── firefox/
        │   └── webkit/
        └── diffs/              # Visual difference images
            ├── chromium/
            ├── firefox/
            └── webkit/
```

### Component Categorization

**Critical Components** (Snapshot on every test run):
- Court status cards
- Navigation header
- Weather widget
- BMS sensor dashboard
- AI chat interface
- Theme toggle
- Alert notifications

**Standard Components** (Snapshot on PR/deploy):
- Form inputs
- Buttons
- Tables
- Modal dialogs
- Cards
- Charts

**Low-Priority Components** (Weekly baseline updates):
- Footer
- Static text sections
- Icons
- Loading spinners

---

## Baseline Image Management

### Creating Baselines

```bash
# Initial baseline generation
npm run test:visual:baseline

# Update baselines after approved changes
npm run test:visual:update

# Update specific component baselines
npm run test:visual:update -- --grep "Court Status Card"
```

### Baseline Storage Strategy

**Version Control**:
- Store baselines in Git LFS (Large File Storage)
- Track only chromium baselines in Git by default
- Generate firefox/webkit baselines in CI

**Baseline File Naming**:
```
{component-name}--{viewport}--{theme}--{state}.png

Examples:
court-status-card--desktop--light--available.png
weather-widget--mobile--dark--loading.png
bms-dashboard--tablet--light--normal.png
```

**Baseline Versioning**:
```
baselines/
├── v1.0.0/
│   ├── chromium/
│   ├── firefox/
│   └── webkit/
├── v1.1.0/
│   ├── chromium/
│   ├── firefox/
│   └── webkit/
└── current -> v1.1.0/  # Symlink to latest
```

### Baseline Update Process

1. **Code Change Made**
2. **Visual Test Fails** (diff detected)
3. **Manual Review**:
   - Is the change intentional? → Approve and update baseline
   - Is the change a bug? → Fix code and re-run test
4. **Update Baseline**:
   ```bash
   npm run test:visual:update -- --component="Court Status Card"
   ```
5. **Commit New Baseline**:
   ```bash
   git add tests/e2e/visual/baselines/
   git commit -m "chore: Update visual baselines for Court Status Card redesign"
   ```

---

## Diff Threshold Configuration

### Pixel Difference Thresholds

**Component-Specific Thresholds**:

```typescript
// tests/e2e/visual/config.ts
export const visualConfig = {
  // Critical UI components - strict thresholds
  'court-status-card': {
    maxDiffPixelRatio: 0.001,    // 0.1% pixel difference allowed
    maxDiffPixels: 100,           // Max 100 pixels different
    threshold: 0.1                // Color difference threshold
  },

  // Charts and dynamic content - relaxed thresholds
  'bms-chart': {
    maxDiffPixelRatio: 0.02,     // 2% pixel difference allowed
    maxDiffPixels: 2000,          // Max 2000 pixels different
    threshold: 0.3                // Higher color tolerance
  },

  // Text-heavy components - medium thresholds
  'chat-message': {
    maxDiffPixelRatio: 0.005,    // 0.5% pixel difference allowed
    maxDiffPixels: 500,           // Max 500 pixels different
    threshold: 0.2                // Medium color tolerance
  },

  // Default for all other components
  'default': {
    maxDiffPixelRatio: 0.01,     // 1% pixel difference allowed
    maxDiffPixels: 1000,          // Max 1000 pixels different
    threshold: 0.2                // Default color tolerance
  }
}
```

### Threshold Justification

**Why Different Thresholds?**

- **Strict (0.001)**: Critical UI that must be pixel-perfect
  - Status indicators (color-coded)
  - Navigation elements
  - Alert badges

- **Medium (0.005-0.01)**: Standard UI components
  - Text content (anti-aliasing variations)
  - Forms and inputs
  - Buttons

- **Relaxed (0.02+)**: Dynamic/animated content
  - Charts with real-time data
  - Loading animations
  - Transition states

### Ignoring Specific Regions

```typescript
// Ignore dynamic regions that shouldn't be compared
await page.screenshot({
  path: 'baseline.png',
  mask: [
    page.locator('.timestamp'),      // Ignore timestamps
    page.locator('.loading-spinner'), // Ignore animations
    page.locator('.ad-banner')        // Ignore third-party content
  ]
});
```

---

## Cross-Browser Testing Approach

### Browser Matrix

**Primary Browsers** (Full visual regression):
- **Chromium** (Desktop + Mobile viewports)
- **Firefox** (Desktop + Mobile viewports)
- **WebKit/Safari** (Desktop + Mobile viewports)

**Secondary Browsers** (Smoke tests only):
- Chrome (n-1, n-2 versions)
- Firefox ESR
- Safari iOS (latest)

### Browser-Specific Baselines

**Why Separate Baselines?**

Different browsers render fonts, shadows, and anti-aliasing differently:

- **Font Rendering**: Chromium vs Firefox vs WebKit
- **Sub-pixel Rendering**: Safari handles differently
- **Shadow Rendering**: Blur radius variations
- **Text Anti-aliasing**: Different algorithms

**Baseline Structure**:
```
baselines/
├── chromium/
│   ├── court-status-card--desktop.png
│   └── weather-widget--mobile.png
├── firefox/
│   ├── court-status-card--desktop.png
│   └── weather-widget--mobile.png
└── webkit/
    ├── court-status-card--desktop.png
    └── weather-widget--mobile.png
```

### Test Execution Strategy

**Local Development**:
```bash
# Test only Chromium (fastest feedback)
npm run test:visual -- --project=chromium

# Test all browsers
npm run test:visual -- --project=chromium --project=firefox --project=webkit
```

**CI/CD Pipeline**:
```yaml
# .github/workflows/visual-regression.yml
jobs:
  visual-tests:
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - run: npm run test:visual -- --project=${{ matrix.browser }}
```

**Parallel Execution**:
- Run browser tests in parallel for speed
- 3 browser jobs = 3x faster than sequential

---

## Screenshot Naming Conventions

### File Naming Format

```
{component-name}--{viewport}--{theme}--{state}--{browser}.png
```

**Component Name**:
- Kebab-case
- Descriptive and unique
- Examples: `court-status-card`, `weather-widget`, `bms-sensor-grid`

**Viewport**:
- `desktop` (1920x1080)
- `tablet` (768x1024)
- `mobile` (375x667)
- `mobile-landscape` (667x375)

**Theme**:
- `light`
- `dark`
- `high-contrast`

**State**:
- `default` (normal/idle state)
- `hover` (hover state)
- `focus` (focused state)
- `active` (active/pressed state)
- `disabled` (disabled state)
- `loading` (loading state)
- `error` (error state)
- `success` (success state)

**Browser** (optional, for cross-browser):
- `chromium`
- `firefox`
- `webkit`

### Examples

```
✅ Good Names:
court-status-card--desktop--light--available.png
weather-widget--mobile--dark--loading.png
bms-dashboard--tablet--light--normal.png
chat-interface--desktop--dark--typing.png
alert-notification--mobile--light--error.png

❌ Bad Names:
screenshot1.png
test.png
court-card.png (missing viewport, theme, state)
Desktop-Light-Available-Court.png (inconsistent casing)
```

---

## Viewport and Device Coverage

### Standard Viewports

**Desktop**:
```typescript
{ width: 1920, height: 1080 }  // Full HD
{ width: 1366, height: 768 }   // Common laptop
{ width: 2560, height: 1440 }  // 2K monitor
```

**Tablet**:
```typescript
{ width: 768, height: 1024 }   // iPad portrait
{ width: 1024, height: 768 }   // iPad landscape
{ width: 834, height: 1194 }   // iPad Pro portrait
```

**Mobile**:
```typescript
{ width: 375, height: 667 }    // iPhone SE
{ width: 390, height: 844 }    // iPhone 12/13
{ width: 414, height: 896 }    // iPhone 11 Pro Max
{ width: 360, height: 640 }    // Android (common)
```

### Responsive Breakpoints

Match breakpoints from Tailwind CSS config:

```typescript
const breakpoints = {
  sm: 640,    // min-width
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}
```

Test at breakpoint boundaries:
- 639px (just before sm)
- 640px (sm)
- 767px (just before md)
- 768px (md)
- etc.

---

## Component State Coverage

### State Matrix

For each critical component, test:

1. **Default State**: Normal, idle appearance
2. **Hover State**: Mouse hover (desktop only)
3. **Focus State**: Keyboard focus
4. **Active State**: Button pressed, input typing
5. **Disabled State**: Non-interactive state
6. **Loading State**: Data fetching, skeleton screens
7. **Error State**: Validation errors, API failures
8. **Success State**: Successful operations
9. **Empty State**: No data available
10. **Populated State**: Data loaded and displayed

### Example: Court Status Card States

```typescript
// Test file: court-status-card.visual.spec.ts
test.describe('Court Status Card - Visual Regression', () => {
  test('default state - available', async ({ page }) => {
    await page.goto('/courts');
    const card = page.locator('[data-testid="court-001"]');
    await expect(card).toHaveScreenshot('court-status-card--desktop--light--available.png');
  });

  test('playing state', async ({ page }) => {
    await loadFixture('court-playing.json');
    await page.goto('/courts');
    const card = page.locator('[data-testid="court-001"]');
    await expect(card).toHaveScreenshot('court-status-card--desktop--light--playing.png');
  });

  test('maintenance state', async ({ page }) => {
    await loadFixture('court-maintenance.json');
    await page.goto('/courts');
    const card = page.locator('[data-testid="court-001"]');
    await expect(card).toHaveScreenshot('court-status-card--desktop--light--maintenance.png');
  });

  test('hover state', async ({ page }) => {
    await page.goto('/courts');
    const card = page.locator('[data-testid="court-001"]');
    await card.hover();
    await expect(card).toHaveScreenshot('court-status-card--desktop--light--hover.png');
  });
});
```

---

## Testing Workflow

### Developer Workflow

**1. Make UI Changes**
```bash
# Work on feature branch
git checkout -b feature/court-status-redesign
# Make changes to Court Status Card component
```

**2. Run Visual Tests Locally**
```bash
# Run visual tests for changed components
npm run test:visual -- --grep "Court Status Card"

# Check diff images
open tests/e2e/visual/diffs/chromium/
```

**3. Review Diffs**
- If diffs are intentional → Update baselines
- If diffs are bugs → Fix code and re-run

**4. Update Baselines (if approved)**
```bash
npm run test:visual:update -- --grep "Court Status Card"
git add tests/e2e/visual/baselines/
git commit -m "chore: Update Court Status Card visual baselines"
```

**5. Push and Create PR**
```bash
git push origin feature/court-status-redesign
# Create PR
```

### CI/CD Workflow

**Pull Request Checks**:
```yaml
name: Visual Regression Tests

on: [pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:visual -- --project=${{ matrix.browser }}

      # Upload diff images on failure
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: visual-diffs-${{ matrix.browser }}
          path: tests/e2e/visual/diffs/${{ matrix.browser }}/

      # Comment on PR with diff links
      - uses: actions/github-script@v6
        if: failure()
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: '❌ Visual regression tests failed. Check artifacts for diff images.'
            })
```

**Main Branch**:
- Full visual regression suite (all browsers, all viewports)
- Update baseline library on successful merges
- Archive old baselines for rollback

---

## Performance Optimization

### Reducing Snapshot Count

**Smart Selection**:
- Don't snapshot every viewport for every component
- Critical components: Test all viewports
- Standard components: Test desktop + mobile only
- Simple components: Test desktop only

**Conditional Snapshots**:
```typescript
// Only snapshot on changed files
const changedFiles = getChangedFiles();
if (changedFiles.includes('CourtStatusCard.tsx')) {
  await runVisualTests('court-status-card');
}
```

### Parallel Execution

**Playwright Workers**:
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : 2,  // More workers in CI
  fullyParallel: true,
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});
```

**Estimated Times**:
- Sequential: 20 minutes (120 snapshots)
- 4 Workers: 5 minutes (4x speedup)
- Browser Matrix (3 browsers x 4 workers): 5 minutes total

---

## Troubleshooting

### Common Issues

**1. Font Rendering Differences**
```typescript
// Solution: Use consistent font loading
await page.addStyleTag({
  content: `
    @font-face {
      font-family: 'Test Font';
      src: url('/fonts/test-font.woff2');
      font-display: block;  // Ensure font loads before screenshot
    }
  `
});
await page.waitForLoadState('networkidle');
```

**2. Animation/Transition Flakiness**
```typescript
// Solution: Disable animations for snapshots
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
});
```

**3. Dynamic Timestamps**
```typescript
// Solution: Mock dates
await page.addInitScript(() => {
  Date.now = () => new Date('2025-01-22T15:00:00Z').getTime();
});
```

**4. Third-Party Content**
```typescript
// Solution: Block external resources
await page.route('**/*', route => {
  const url = route.request().url();
  if (url.includes('ads.google.com') || url.includes('analytics')) {
    route.abort();
  } else {
    route.continue();
  }
});
```

---

## Best Practices

### ✅ Do

- Use descriptive, consistent naming for snapshots
- Test both light and dark themes
- Test critical user journeys end-to-end
- Review diffs carefully before updating baselines
- Store baselines in version control
- Use Git LFS for large baseline libraries
- Run visual tests in CI on every PR
- Test responsive layouts at breakpoint boundaries
- Mask dynamic content (timestamps, animations)
- Use fixture data for consistent screenshots

### ❌ Don't

- Snapshot entire pages (too brittle, slow)
- Ignore small pixel differences without investigation
- Update baselines without review
- Test every possible state combination (diminishing returns)
- Run visual tests on every file save (too slow)
- Store baselines outside version control
- Use production data for visual tests (inconsistent)
- Snapshot during animations or transitions
- Test browser-specific bugs with visual regression (use functional tests)

---

## Maintenance Schedule

**Weekly**:
- Review and update low-priority component baselines
- Clean up old baseline versions (keep last 3)
- Check for flaky visual tests

**Monthly**:
- Full baseline audit and cleanup
- Review diff thresholds and adjust if needed
- Update visual testing documentation
- Archive superseded baselines

**Quarterly**:
- Evaluate new browsers/devices to add
- Review and optimize test execution time
- Update visual regression strategy based on learnings

---

## Metrics & Reporting

### Key Metrics

- **Total Snapshots**: 120
- **Test Execution Time**: ~5 minutes (parallel)
- **Baseline Storage Size**: ~50 MB (Git LFS)
- **False Positive Rate**: <2% (target)
- **Coverage**: 85% of UI components

### Reporting Dashboard

```
Visual Regression Summary:
✅ Passed: 115/120 (95.8%)
❌ Failed: 5/120 (4.2%)
⏭️  Skipped: 0

Failed Components:
- Court Status Card (Desktop, Light, Hover)
- Weather Widget (Mobile, Dark, Loading)
- BMS Dashboard (Tablet, Light, Normal)
- Chat Interface (Desktop, Dark, Typing)
- Alert Notification (Mobile, Light, Error)

Artifacts:
- Diff Images: /visual-diffs/
- Baseline Comparison: /baseline-comparison.html
```

---

This visual regression strategy ensures consistent UI quality while balancing coverage, performance, and maintainability.
