# Testing Documentation

Comprehensive testing guides and coverage reports for the ACE Tennis Facility project.

## Quick Links

### Test Suites
- [Loading System Tests](./loading-system-test-coverage.md) - Adaptive loading system test coverage

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test tests/unit/loading          # Unit tests
npm test tests/integration/loading   # Integration tests
npm run test:e2e adaptive-loading    # E2E tests

# With coverage
npm test -- --coverage
```

## Test Coverage Summary

| System | Tests | Coverage | Status |
|--------|-------|----------|--------|
| Adaptive Loading | 170+ | 90%+ | ✅ |
| 3D Rendering | TBD | TBD | 🔄 |
| Weather System | TBD | TBD | 🔄 |
| Character System | TBD | TBD | 🔄 |

## Documentation Index

### User Documentation
- [Adaptive Loading User Guide](/docs/features/adaptive-loading.md)
- [Troubleshooting Guide](/docs/features/troubleshooting-loading.md)

### Developer Documentation
- [API Reference](/docs/features/api-reference-loading.md)
- [Test Coverage Report](./loading-system-test-coverage.md)

### Architecture Documentation
- [Quality System Architecture](/docs/architecture/quality-system.md)
- [Performance Optimization](/docs/performance/optimization-guide.md)

## Test Standards

### Code Coverage Targets
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

### Test Characteristics
- **Fast**: Unit tests <100ms
- **Isolated**: No inter-test dependencies
- **Repeatable**: Deterministic results
- **Self-validating**: Clear pass/fail
- **Timely**: Written with code

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Achieve >80% coverage
3. Document test scenarios
4. Update this index

## Related Documentation

- [GET_STARTED.md](/docs/GET_STARTED.md) - Project overview
- [CONTRIBUTING.md](/docs/contributing/) - Contribution guidelines
- [API Documentation](/docs/api/) - API reference
