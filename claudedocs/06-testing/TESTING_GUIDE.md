# Testing Guide

Comprehensive testing documentation for the ACE tennis facility visualization.

## Testing Strategy

### Test Pyramid
1. **Unit Tests** (70%) - Fast, isolated component tests
2. **Integration Tests** (20%) - Component interaction tests
3. **E2E Tests** (10%) - Full user workflow tests

### Test Coverage Goals
- Minimum 80% code coverage
- 100% critical path coverage
- All edge cases documented

## Unit Testing

### Component Tests
Test React components in isolation:

```typescript
import { render, screen } from '@testing-library/react';
import { CourtView } from './CourtView';

describe('CourtView', () => {
  it('renders court with correct dimensions', () => {
    render(<CourtView courtType="grass" />);
    const court = screen.getByTestId('tennis-court');
    expect(court).toBeInTheDocument();
  });
});
```

### Three.js Scene Tests
Test 3D rendering logic:

```typescript
describe('ThreeScene', () => {
  it('initializes scene with correct settings', () => {
    const scene = new ThreeScene(container);
    expect(scene.renderer).toBeDefined();
    expect(scene.camera.position.y).toBeGreaterThan(0);
  });
});
```

## Integration Testing

### Component Integration
Test component interactions:

```typescript
describe('Court and Overlay Integration', () => {
  it('displays heat map over selected court', () => {
    render(<CourtViewWithOverlay />);
    fireEvent.click(screen.getByText('Show Heat Map'));
    expect(screen.getByTestId('heat-map-overlay')).toBeVisible();
  });
});
```

### Data Flow Tests
Verify data flows correctly through the system:

```typescript
describe('Court Data Updates', () => {
  it('updates court status when booking changes', async () => {
    const { rerender } = render(<CourtList courts={initialCourts} />);

    // Simulate booking update
    const updatedCourts = [...initialCourts];
    updatedCourts[0].status = 'occupied';

    rerender(<CourtList courts={updatedCourts} />);

    expect(screen.getByTestId('court-0')).toHaveClass('occupied');
  });
});
```

## End-to-End Testing

### User Workflows
Test complete user journeys:

```typescript
describe('Court Booking Workflow', () => {
  it('allows user to view and book a court', async () => {
    await page.goto('http://localhost:3000');

    // Navigate to court view
    await page.click('[data-testid="3d-view-tab"]');
    await page.waitForSelector('canvas');

    // Select a court
    await page.click('[data-testid="court-1"]');

    // Verify court details shown
    expect(await page.textContent('.court-details')).toContain('Court 1');

    // Book the court
    await page.click('[data-testid="book-court-btn"]');
    await page.waitForSelector('.booking-confirmation');
  });
});
```

### Performance Tests
Verify performance requirements:

```typescript
describe('Performance Benchmarks', () => {
  it('maintains 60 FPS during camera movement', async () => {
    const fpsReadings = [];

    // Start FPS monitoring
    page.on('metrics', (metrics) => {
      fpsReadings.push(metrics.fps);
    });

    // Perform camera movement
    await animateCamera();

    const avgFps = average(fpsReadings);
    expect(avgFps).toBeGreaterThanOrEqual(60);
  });
});
```

## Testing Best Practices

### Test Organization
```
tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── services/
├── integration/
│   ├── rendering/
│   ├── data-flow/
│   └── user-interactions/
└── e2e/
    ├── workflows/
    └── performance/
```

### Writing Effective Tests

**DO:**
- Test behavior, not implementation
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Test edge cases

**DON'T:**
- Test implementation details
- Create interdependent tests
- Use hard-coded waits (use waitFor)
- Test library code
- Ignore test failures

### Test Data Management

Use fixtures for consistent test data:

```typescript
// fixtures/courts.ts
export const mockCourts = [
  {
    id: 1,
    type: 'grass',
    status: 'available',
    position: { x: 0, y: 0, z: 0 }
  },
  // ... more courts
];
```

## Coverage Reports

### Generating Coverage
```bash
npm run test:coverage
```

### Coverage Thresholds
```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## Test Execution

### Running Tests

**All tests:**
```bash
npm test
```

**Unit tests only:**
```bash
npm run test:unit
```

**Integration tests:**
```bash
npm run test:integration
```

**E2E tests:**
```bash
npm run test:e2e
```

**Watch mode:**
```bash
npm run test:watch
```

### CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Release tags

Required to pass:
- All unit tests
- All integration tests
- Coverage thresholds
- Performance benchmarks

## Test Reports

### Recent Test Results

**Test Pass Rate Progression:**
- Week 1: 78% → Week 4: 95%
- Current: 95% pass rate
- Target: 98%+ pass rate

**Coverage Metrics:**
- Overall: 87%
- Components: 92%
- Utils: 95%
- Services: 81%

### Known Issues

**Flaky Tests:**
- `3D rendering timing test` - Occasionally fails on slow CI
- `Animation smoothness test` - Frame rate varies

**Resolution:**
- Increase timeout for rendering tests
- Use more reliable performance metrics

## Troubleshooting

### Common Test Issues

**Tests fail locally but pass in CI:**
- Check for environment-specific issues
- Verify node version matches CI
- Clear cache: `npm run test:clear-cache`

**Tests timeout:**
- Increase timeout: `jest.setTimeout(10000)`
- Check for async operations without await
- Verify mock responses are resolving

**Snapshot mismatches:**
- Review snapshot diff
- Update if intentional: `npm run test:update-snapshots`
- Check for non-deterministic rendering

## Performance Testing

### Metrics to Track
- **FPS**: Target 60 FPS during all interactions
- **Memory**: Should remain stable over time
- **Load Time**: Initial render < 3 seconds
- **Asset Loading**: Progressive loading benchmarks

### Performance Test Suite

```typescript
describe('Performance Benchmarks', () => {
  it('loads scene within 3 seconds', async () => {
    const startTime = performance.now();
    await loadScene();
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  it('maintains stable memory usage', async () => {
    const initialMemory = getMemoryUsage();
    await performActions();
    const finalMemory = getMemoryUsage();
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // < 50MB
  });
});
```

## Visual Regression Testing

### Setup
Use Playwright for visual regression:

```typescript
test('court rendering matches baseline', async ({ page }) => {
  await page.goto('/3d-view');
  await page.waitForLoadState('networkidle');

  const screenshot = await page.screenshot();
  expect(screenshot).toMatchSnapshot('court-view.png');
});
```

### Updating Baselines
```bash
npm run test:visual:update
```

## Test Maintenance

### Regular Tasks
- Weekly: Review and update flaky tests
- Monthly: Update test dependencies
- Per release: Full regression test suite
- Continuous: Monitor test performance

### Test Debt Management
- Remove obsolete tests
- Refactor brittle tests
- Update documentation
- Improve coverage gaps
