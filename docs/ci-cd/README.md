# CI/CD Documentation

## Overview

This directory contains documentation for the GitHub Actions CI/CD pipeline integration for E2E testing.

## Documentation Structure

### [E2E Integration Guide](./e2e-integration.md)
Complete guide to E2E testing integration in GitHub Actions, including:
- Pipeline architecture and workflow structure
- Test matrix configuration (browsers, OS)
- Quality gates and thresholds
- NPM scripts reference
- Performance optimization strategies
- GitHub Pages report publishing

### [Troubleshooting Guide](./troubleshooting.md)
Comprehensive troubleshooting reference for CI/CD issues:
- Common issues and solutions
- Browser installation failures
- WebGL/Three.js rendering issues
- Flaky test debugging
- Performance optimization tips
- Step-by-step debugging workflow

## Quick Start

### Running Tests Locally

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run all E2E tests
npm run test:e2e

# Run specific browser
npm run test:e2e:chromium

# Debug mode
npm run test:e2e:debug
```

### Viewing CI Results

1. **During CI Run**: Go to Actions tab → Select workflow run → View logs
2. **After CI Run**: Download artifacts from workflow summary
3. **HTML Reports**: Access from artifacts or GitHub Pages (main branch only)

## Key Files

- `.github/workflows/e2e-tests.yml` - GitHub Actions workflow configuration
- `playwright.config.ts` - Playwright test runner configuration
- `tests/e2e/` - E2E test directory structure
- `package.json` - NPM scripts for test execution

## Quality Standards

The CI pipeline enforces:
- ✅ **90% minimum test pass rate**
- ✅ **No accessibility violations** (when implemented)
- ✅ **Performance budgets** (when implemented)
- ✅ **Cross-browser compatibility** (Chromium, Firefox, WebKit)
- ✅ **Cross-platform testing** (Ubuntu, macOS, Windows)

## Test Execution Flow

```
1. Code pushed → PR created
2. GitHub Actions triggered
3. Test matrix spawned (browser × OS combinations)
4. Dependencies installed → Browsers installed
5. Application built → Dev server started
6. Tests executed in parallel
7. Artifacts collected (reports, videos, screenshots)
8. Quality gates validated
9. Combined report generated
10. Results published (GitHub Pages for main branch)
```

## Support and Resources

- [GitHub Actions Workflow](./.github/workflows/e2e-tests.yml)
- [Playwright Configuration](../../playwright.config.ts)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Contributing

When adding new E2E tests:
1. Follow existing test structure in `tests/e2e/`
2. Use data-testid attributes for selectors
3. Add appropriate timeouts for WebGL operations
4. Test locally before pushing to CI
5. Update documentation if adding new test patterns

## Maintenance

- **Weekly**: Review failed test artifacts
- **Monthly**: Update Playwright version, optimize slow tests
- **Quarterly**: Review and update quality thresholds

---

**Last Updated**: November 2024
**Maintained By**: CI/CD Integration Specialist
