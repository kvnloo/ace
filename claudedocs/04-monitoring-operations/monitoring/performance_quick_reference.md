# Performance Testing - Quick Reference

Fast reference guide for performance testing commands and workflows.

## Commands

```bash
# Baseline Management
npm run perf:baseline          # Capture new baseline (3 runs)

# Testing
npm run perf:test             # Run regression tests

# Bundle Analysis
npm run perf:bundle           # Analyze current bundle
npm run perf:trends           # Show bundle trends

# Combined Workflow
npm run build && npm run perf:bundle && npm run dev & npm run perf:test
```

## Common Workflows

### First-Time Setup
```bash
npm run build                  # Build app
npm run dev                    # Start server
npm run perf:baseline          # Capture baseline
```

### Before PR Merge
```bash
npm run dev                    # Start server
npm run perf:test             # Test against baseline
```

### After Optimization
```bash
npm run build                  # Build optimized version
npm run perf:bundle           # Check bundle size
npm run dev                    # Start server
npm run perf:test             # Verify improvements
npm run perf:baseline          # Update baseline if better
```

### Bundle Size Check
```bash
npm run build                  # Build app
npm run perf:bundle           # Analyze bundle
npm run perf:trends           # View history
```

## Interpreting Results

### Performance Test Output

**Icons:**
- ✅ = Improvement (>5% better)
- ⚪ = No significant change
- ❌ = Regression (exceeds threshold)

**Example:**
```
✅ loadTime                 2500ms → 2200ms (-12.00%)  # Improved
⚪ fps                      59 → 58 (-1.69%)            # Acceptable
❌ memory                   85MB → 110MB (+29.41%)      # Regression
```

### Regression Thresholds

| Metric | Threshold |
|--------|-----------|
| Load Time | +10% |
| FPS | -5% |
| Memory | +15% |
| FCP/LCP/TTI | +10-15% |
| Bundle | +5% |

### Bundle Analysis Output

```
📦 Bundle Size Analysis

📊 Total Size:
   Raw: 856.42 KB
   Gzipped: 285.13 KB
   Compression: 66.71%

📜 JavaScript Files:
   Total: 680.25 KB (220.15 KB gzipped)
   Files: 8

   1. index-DxE4g7Xk.js          520.45 KB (160.22 KB gzipped)
   2. vendor-AhG8kL9p.js          159.80 KB (59.93 KB gzipped)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No baseline found | Run `npm run perf:baseline` |
| Dist folder not found | Run `npm run build` |
| Server not responding | Check `npm run dev` is running |
| Browser launch failed | Run `npx playwright install chromium` |
| Inconsistent results | Close other apps, run multiple times |

## CI/CD Integration

### GitHub Actions Workflow

```yaml
- name: Build
  run: npm run build

- name: Start server
  run: npm run dev &

- name: Wait for server
  run: npx wait-on http://localhost:5173

- name: Performance tests
  run: npm run perf:test
```

### PR Comments

GitHub Actions automatically comments on PRs with performance results.

## Files Location

```
tests/performance/
├── baseline.json              # Tracked in git
├── latest-results.json        # Ignored
├── bundle-history.json        # Ignored
└── README.md                  # Documentation

scripts/
├── performance-baseline.js    # Baseline capture
├── performance-test.js        # Regression testing
└── bundle-size.js            # Bundle analysis

.github/workflows/
└── performance-test.yml      # CI workflow
```

## Performance Targets

### Desktop
- Load: < 3s
- FPS: > 55
- Memory: < 100MB
- FCP: < 1s
- LCP: < 2.5s
- Bundle: < 1MB

### Mobile
- Load: < 4s
- FPS: > 50
- Memory: < 75MB
- FCP: < 1.5s
- LCP: < 3s

## Best Practices

1. **Capture baseline on main branch** - Ensure consistent comparison point
2. **Run tests before PRs** - Catch regressions early
3. **Investigate all regressions** - Understand why performance degraded
4. **Recapture baseline after optimizations** - Keep baseline current
5. **Track trends** - Use bundle history to spot gradual degradation
6. **Document trade-offs** - Note when performance sacrificed for features

## Environment Variables

```bash
# Custom app URL
APP_URL=http://localhost:3000 npm run perf:test

# Custom run count (baseline only)
# Edit scripts/performance-baseline.js: RUNS = 5
```

## Advanced Usage

### Custom Thresholds

Edit `scripts/performance-test.js`:
```javascript
const THRESHOLDS = {
  loadTime: 0.10,     // 10%
  fps: 0.05,          // 5%
  memory: 0.15,       // 15%
  // ... customize
};
```

### Historical Analysis

```bash
# Save timestamped results
cp tests/performance/latest-results.json \
   tests/performance/history/$(date +%Y%m%d-%H%M%S).json

# View trends
npm run perf:trends
```

### Multiple Environments

```bash
# Test different environments
APP_URL=http://localhost:5173 npm run perf:test    # Dev
APP_URL=https://staging.app npm run perf:test       # Staging
APP_URL=https://app.com npm run perf:test           # Production
```

## Related Documentation

- Full guide: `claudedocs/monitoring/performance_testing.md`
- Bundle analysis: `claudedocs/optimization/bundle_analysis.md`
- 3D optimization: `claudedocs/optimization/3d_optimization.md`

## Support

- Check test output for detailed error messages
- Review baseline.json for expected values
- Compare latest-results.json with baseline
- Check GitHub Actions logs for CI failures
