# Visual Regression Tests

This directory contains visual regression tests that capture screenshots and compare them against baseline images to detect unintended UI changes.

## Test Suites

### `court-view.visual.spec.ts`
Tests the 3D tennis court visualization:
- Court overview rendering
- Grass detail quality
- Court lines and markings
- Weather effects integration
- Night lighting scenes
- Multiple camera angles

### `bms-dashboard.visual.spec.ts`
Tests the Building Management System dashboard:
- Dashboard layout and panels
- Sensor data visualizations
- Irrigation control UI
- Environmental data displays
- Alert notification styling
- Historical charts rendering
- System status indicators

### `mobile-responsive.visual.spec.ts`
Tests responsive design across devices:
- iPhone 12, iPhone SE (portrait)
- Pixel 5 (various orientations)
- iPad Mini (tablet layout)
- Touch interaction controls
- Mobile navigation menus

### `theme-variations.visual.spec.ts`
Tests theme consistency:
- Dark theme (default)
- Light theme
- Theme transitions
- Contrast modes
- UI control theming

## Running Tests

```bash
# Run all visual regression tests
npm run test:e2e:visual

# Run with headed browser (watch tests)
npm run test:e2e:visual:headed

# Update baseline images (after intentional changes)
npm run test:e2e:visual:update

# Run specific test file
npx playwright test tests/e2e/visual/court-view.visual.spec.ts
```

## Updating Baselines

When you make intentional UI changes:

1. Review the visual diff in the test report
2. Verify changes are intentional and correct
3. Update baselines: `npm run test:e2e:visual:update`
4. Verify tests pass with new baselines
5. Commit updated snapshots to Git

## Configuration

Visual regression settings are in `playwright.config.ts`:
- **Max pixel difference**: 0.2% (configurable per test)
- **Animations**: Disabled for consistency
- **Scale**: CSS pixels
- **Snapshot path**: `tests/e2e/__snapshots__/`

## Best Practices

1. **Disable animations**: Always disable animations before screenshots
2. **Wait for stability**: Use `waitForLoadState('networkidle')`
3. **Consistent environment**: Tests run in `visual-regression` project (Chromium only)
4. **Descriptive names**: Use clear screenshot names
5. **Appropriate thresholds**: Balance strictness with practicality

See [Visual Regression Guide](../../docs/testing/visual-regression-guide.md) for detailed documentation.
