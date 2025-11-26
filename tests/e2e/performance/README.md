# Performance Benchmarking Tests

This directory contains performance benchmarking tests that measure critical performance metrics and ensure the application maintains high performance standards.

## Test Suites

### `core-metrics.perf.spec.ts`
Measures Core Web Vitals:
- **Time to Interactive (TTI)**: < 3500ms
- **First Contentful Paint (FCP)**: < 1800ms
- **Largest Contentful Paint (LCP)**: < 2500ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 300ms
- **First Input Delay (FID)**: < 100ms

Also measures:
- Initial page load performance
- 3D scene initialization time
- Interaction responsiveness
- JavaScript coverage

### `3d-rendering.perf.spec.ts`
Measures Three.js rendering performance:
- **Frame rate (FPS)**: Target > 50fps average, > 30fps minimum
- **Frame drops**: Monitor and minimize
- **Memory usage**: < 200MB increase during rendering
- **Render time per frame**: < 16.67ms (60fps target)
- **GPU performance**: Capabilities and limitations

Tests scenarios:
- Idle scene rendering
- Camera movement FPS
- Complex scene handling
- Memory profiling during 3D operations

### `memory-profiling.perf.spec.ts`
Measures memory usage patterns:
- **Memory leak detection**: Growth rate < 1MB/s
- **Interaction memory**: Retained < 5MB after GC
- **Scene change impact**: < 20MB growth over 5s
- **Extended session stability**: Monitor heap snapshots

## Running Tests

```bash
# Run all performance tests
npm run test:e2e:performance

# Run with headed browser (watch performance)
npm run test:e2e:performance:headed

# Run specific test file
npx playwright test tests/e2e/performance/core-metrics.perf.spec.ts

# Generate performance report
npm run test:perf:report
```

## Performance Budgets

| Metric | Budget | Importance |
|--------|--------|------------|
| Time to Interactive | < 3500ms | Critical |
| First Contentful Paint | < 1800ms | Critical |
| Largest Contentful Paint | < 2500ms | Critical |
| Cumulative Layout Shift | < 0.1 | Critical |
| Average FPS | > 50fps | High |
| Minimum FPS | > 30fps | High |
| Memory Growth | < 200MB | Medium |
| Frame Render Time | < 16.67ms | High |

## Performance Report

After running tests, generate a comprehensive HTML report:

```bash
npm run test:perf:report
```

The report includes:
- Performance metrics vs. budgets
- Historical trends (last 30 runs)
- Test result summaries
- Pass/fail status for each metric

Report location: `tests/e2e/reports/performance-report.html`

## Understanding Results

### Console Output
Each test prints detailed metrics:
```
=== Performance Metrics ===
First Contentful Paint: 1245.32ms
Largest Contentful Paint: 2103.45ms
Time to Interactive: 3012.67ms
Average FPS: 58.42
Min FPS: 52.10
```

### HTML Report
Open with `npm run test:perf:report` to see:
- Visual performance scores
- Trend graphs
- Budget comparisons
- Failed test details

### Investigating Failures

1. **Check console output** for specific metric values
2. **Review HTML report** for visual trends
3. **Run with `--headed`** to observe performance visually
4. **Use browser DevTools** for deeper profiling:
   ```bash
   npx playwright test --debug
   # Then use DevTools Performance tab
   ```

## Best Practices

1. **Stabilize before measuring**: Wait for scene initialization
2. **Multiple samples**: Average measurements over multiple runs
3. **Consistent environment**: Run on same hardware for comparisons
4. **Monitor trends**: Track performance over time, not just absolute values
5. **Profile bottlenecks**: Use DevTools to identify specific issues

## CI/CD Integration

Performance tests run automatically in CI but may have:
- Different budgets for CI vs. local (hardware variations)
- Trend monitoring instead of strict budgets
- Automatic report artifacts uploaded

See [Visual Regression Guide](../../docs/testing/visual-regression-guide.md) for CI configuration examples.

## Troubleshooting

### Memory measurements unavailable
- Enable Chrome flag: `--enable-precise-memory-info`
- Check if running in Chromium (required for memory API)

### Inconsistent FPS
- Increase measurement duration
- Ensure scene has stabilized
- Check for background processes affecting performance

### Performance varies across machines
- Use relative thresholds (% of baseline)
- Set CI-specific budgets
- Focus on trends rather than absolute values

## Adding New Benchmarks

To add a new performance test:

1. Create `your-test.perf.spec.ts` in this directory
2. Follow existing patterns for measuring
3. Add to performance report generator if needed
4. Update this README with new metrics
5. Set appropriate budgets in test file

Example:
```typescript
test('measures my new feature performance', async ({ page }) => {
  await page.goto('/');

  const startTime = Date.now();
  // ... perform operation ...
  const duration = Date.now() - startTime;

  console.log(`Feature load time: ${duration}ms`);
  expect(duration).toBeLessThan(1000); // 1s budget
});
```
