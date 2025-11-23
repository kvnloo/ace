# E2E Test Suite - ACE Facility

Comprehensive end-to-end testing for the ACE facility tennis court management system.

## Test Structure

```
tests/e2e/
├── critical/              # Critical user journey tests
│   ├── court-navigation.spec.ts   # Court navigation flow (8 tests)
│   ├── ai-chat.spec.ts            # AI chat interaction (9 tests)
│   └── visualization.spec.ts      # 3D visualization controls (11 tests)
├── pages/                 # Page Object Models
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── CourtViewPage.ts
│   ├── AIChatPage.ts
│   └── VisualizationPage.ts
├── fixtures/              # Test data and mocks
│   ├── courtData.ts
│   ├── chatData.ts
│   └── visualizationData.ts
├── helpers/               # Test utilities
│   └── testHelpers.ts
├── screenshots/           # Test screenshots
└── __snapshots__/        # Visual regression snapshots
```

## Test Coverage

### Court Navigation Flow (8 tests)
- ✅ Navigate from home to court view
- ✅ Select tennis court and view details
- ✅ Load 3D visualization within 5 seconds
- ✅ Display court information accurately
- ✅ Handle court selection transitions smoothly
- ✅ Show loading state during data fetch
- ✅ Maintain performance metrics
- ✅ Mobile viewport navigation

**Performance Target**: <5s per test execution

### AI Chat Interaction (9 tests)
- ✅ Open AI chat interface
- ✅ Send message and receive response
- ✅ Persist chat history
- ✅ Handle failed API calls gracefully
- ✅ Handle multiple rapid messages
- ✅ Display typing indicator during response
- ✅ Clear input after sending message
- ✅ Handle empty message submission
- ✅ Mobile viewport functionality

**Key Features**: Error handling, message persistence, API mocking

### Visualization Controls (11 tests)
- ✅ Access 3D visualization
- ✅ Toggle heat map overlay
- ✅ Change camera angle (top, side, perspective)
- ✅ Toggle weather effects
- ✅ Respond to all UI controls
- ✅ Reset view to default
- ✅ Handle mouse drag for camera rotation
- ✅ Maintain 3D rendering performance
- ✅ Handle rapid control changes
- ✅ Mobile viewport support
- ✅ Touch gesture support

**Performance Target**: <3s for all control operations

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Specific Test Suite
```bash
npx playwright test tests/e2e/critical/court-navigation.spec.ts
npx playwright test tests/e2e/critical/ai-chat.spec.ts
npx playwright test tests/e2e/critical/visualization.spec.ts
```

### Watch Mode
```bash
npx playwright test --ui
```

### Headed Mode (see browser)
```bash
npx playwright test --headed
```

### Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Mobile Testing
```bash
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari
```

### Debug Mode
```bash
npx playwright test --debug
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report tests/e2e/reports/html
```

## Page Object Model Pattern

All tests use the Page Object Model pattern for maintainability:

```typescript
// Example usage
import { HomePage } from '../pages/HomePage';
import { CourtViewPage } from '../pages/CourtViewPage';

test('navigate to court view', async ({ page }) => {
  const homePage = new HomePage(page);
  const courtViewPage = new CourtViewPage(page);

  await homePage.navigate();
  await homePage.goToCourtView();
  await expect(courtViewPage.courtList).toBeVisible();
});
```

## Mocking API Responses

Tests use fixtures for consistent, fast testing:

```typescript
import { mockCourtData } from '../fixtures/courtData';
import { mockAPI } from '../helpers/testHelpers';

test.beforeEach(async ({ page }) => {
  await mockAPI(page, '**/api/courts', mockCourtData);
});
```

## Visual Regression Testing

Snapshots are automatically captured and compared:

```typescript
await expect(page).toHaveScreenshot('court-view-page.png');
```

Update snapshots after intentional UI changes:
```bash
npx playwright test --update-snapshots
```

## Performance Testing

All tests include performance assertions:

```typescript
const startTime = Date.now();
await courtViewPage.waitFor3DSceneLoad(5000);
const loadTime = Date.now() - startTime;
expect(loadTime).toBeLessThan(5000);
```

## CI/CD Integration

Tests are configured for CI/CD environments:
- Automatic retries on failure (2x in CI)
- Video recording on failure
- Trace collection for debugging
- Parallel execution disabled in CI (configurable)

## Accessibility Testing

Accessibility snapshots are available via helpers:
```typescript
import { checkAccessibility } from '../helpers/testHelpers';
const a11yTree = await checkAccessibility(page);
```

## Best Practices

1. **Use Page Objects**: Encapsulate page interactions
2. **Mock External APIs**: Fast, reliable tests
3. **Performance Targets**: <5s execution per test
4. **Visual Snapshots**: Catch UI regressions
5. **Mobile Testing**: Test responsive layouts
6. **Error Handling**: Test failure scenarios
7. **Clean Test Data**: Use fixtures for consistency

## Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Check if API mocks are configured correctly
- Verify WebGL support in test environment

### Visual Regression Failures
- Review screenshot diffs in test reports
- Update snapshots if changes are intentional
- Check viewport sizes match expectations

### 3D Rendering Issues
- Ensure WebGL is available in test browser
- Check for console errors during test
- Verify canvas element is visible

## Contributing

When adding new tests:
1. Create page objects for new pages
2. Add fixtures for test data
3. Follow existing test patterns
4. Include performance assertions
5. Add mobile viewport tests
6. Update this README

## Test Statistics

- **Total Test Cases**: 28
- **Page Objects**: 5
- **Test Fixtures**: 3
- **Test Helpers**: 12 utility functions
- **Target Execution Time**: <5s per test
- **Supported Browsers**: Chrome, Firefox, Safari
- **Mobile Devices**: Pixel 5, iPhone 12
