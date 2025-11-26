# Monitoring & Operations

Production monitoring, performance tracking, and operational procedures for the ACE 3D visualization project.

## Documents in This Section

### Monitoring Systems
- **[MONITORING_SETUP_COMPLETE.md](MONITORING_SETUP_COMPLETE.md)** - Continuous error monitoring setup
- **[monitoring/monitoring_architecture.md](monitoring/monitoring_architecture.md)** - System architecture overview
- **[monitoring/IMPLEMENTATION_SUMMARY.md](monitoring/IMPLEMENTATION_SUMMARY.md)** - Monitoring implementation details

### Performance Testing
- **[PERFORMANCE_TESTING_SUMMARY.md](PERFORMANCE_TESTING_SUMMARY.md)** - Performance testing system overview
- **[monitoring/PERFORMANCE_TESTING_IMPLEMENTATION.md](monitoring/PERFORMANCE_TESTING_IMPLEMENTATION.md)** - Detailed performance testing guide
- **[monitoring/performance_quick_reference.md](monitoring/performance_quick_reference.md)** - Quick reference for performance testing

## Monitoring Capabilities

### Continuous Error Monitoring
Real-time browser error detection:
- Console errors and warnings
- Uncaught exceptions
- Failed HTTP requests
- Script errors

**Commands:**
```bash
npm run monitor:start   # Start background monitoring
npm run monitor:status  # View monitoring dashboard
npm run monitor:stop    # Stop monitoring
```

### Performance Testing
Automated performance regression testing:
- Load time measurement
- FPS tracking
- Memory usage analysis
- Web Vitals (FCP, LCP, TTI, TBT)
- Bundle size tracking

**Commands:**
```bash
npm run perf:baseline  # Capture performance baseline
npm run perf:test      # Run regression tests
npm run perf:bundle    # Analyze bundle size
```

## Quick Start

### 1. Start Monitoring
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Start monitoring
npm run monitor:start

# Check status
npm run monitor:status
```

### 2. Performance Testing
```bash
# Capture baseline (first time only)
npm run perf:baseline

# Run performance tests
npm run perf:test
```

### 3. View Dashboards
```bash
# Live monitoring dashboard
npm run monitor:watch

# Performance trends
npm run perf:trends
```

## Monitoring Architecture

```
┌─────────────────────────────────────────┐
│     Continuous Monitor (Background)      │
│  - Checks browser console every 5s      │
│  - Logs to continuous-monitor.log       │
│  - Streams JSON to error-stream.json    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Performance Testing              │
│  - Baseline capture and comparison      │
│  - Regression detection                 │
│  - CI/CD integration                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Monitoring Dashboard             │
│  - Real-time status                     │
│  - Error patterns                       │
│  - Performance metrics                  │
└─────────────────────────────────────────┘
```

## Performance Targets

### Desktop (Recommended)
| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| Load Time | < 2s | < 3s | > 5s |
| FPS | > 58 | > 55 | < 50 |
| Memory | < 80MB | < 100MB | > 200MB |
| FCP | < 800ms | < 1s | > 2s |
| LCP | < 2s | < 2.5s | > 4s |
| Bundle | < 800KB | < 1MB | > 2MB |

### Mobile
| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| Load Time | < 3s | < 4s | > 6s |
| FPS | > 55 | > 50 | < 45 |
| Memory | < 60MB | < 75MB | > 150MB |

## Alerting and Notifications

### Error Thresholds
- **Warning:** >5 errors in 60 seconds
- **Critical:** >20 errors in 60 seconds
- **Page Error:** Any uncaught exception

### Performance Thresholds
- **Load Time:** +10% regression
- **FPS:** -5% regression
- **Memory:** +15% regression
- **Bundle Size:** +5% regression

## Troubleshooting

### Monitor Won't Start
```bash
# Check if already running
npm run monitor:status

# Check logs
tail logs/continuous-monitor.log

# Restart monitoring
npm run monitor:restart
```

### Performance Tests Failing
```bash
# Verify baseline exists
ls tests/performance/baseline.json

# Re-capture baseline
npm run perf:baseline

# Check for regressions
npm run perf:test
```

## Log Files

### Monitoring Logs
- `logs/continuous-monitor.log` - Human-readable activity log
- `logs/error-stream.json` - Structured error data

### Performance Data
- `tests/performance/baseline.json` - Performance baseline
- `tests/performance/bundle-history.json` - Bundle size history
- `tests/performance/latest-results.json` - Most recent test results

## Related Documentation

- **Testing:** [../03-testing-quality/](../03-testing-quality/)
- **Workflows:** [../05-workflows/](../05-workflows/)
- **Quick Reference:** [../QUICK_REFERENCE.md](../QUICK_REFERENCE.md)

---

[← Back to Documentation Home](../README.md)
