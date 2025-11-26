# ACE Facility Testing Guide

## Test Structure

### E2E Tests (`tests/e2e/`)
- **smoke.spec.ts** - Basic app loads, page title, no console errors
- **user-journey.spec.ts** - Complete flow: load → loading screen → 3D scene → interactions
- **3d-render-check.spec.ts** - Three.js canvas rendering validation
- **console-errors.spec.ts** - Console error detection and classification
- **grass-system.spec.ts** - Grass rendering system validation
- **weather-controls.spec.ts** - Weather system UI and functionality
- **mobile.spec.ts** - Mobile viewport responsiveness
- **performance.spec.ts** - FPS, memory, load time budgets
- **accessibility.spec.ts** - WCAG compliance, keyboard navigation
- **settings.spec.ts** - Settings panel functionality
- **error-recovery.spec.ts** - Error handling and recovery flows
- **visual-validation.spec.ts** - Screenshot regression testing

### Unit Tests (`tests/unit/`)
- **services/** - FPSBatchController, PerformanceGate, types
- **debug/** - Performance tracker, debug storage, asset registry
- **loading/** - Loading phases, quality presets

## Running Tests

### E2E Tests (Playwright)
```bash
npm run test:e2e              # Headless mode
npm run test:e2e:headed       # Headed mode (visible browser)
npm run test:e2e:ui           # Playwright UI mode
npm run test:e2e:debug        # Debug mode with traces
playwright test --project=chromium  # Single browser
playwright test smoke.spec.ts       # Single test file
```

### Unit Tests (Vitest)
```bash
npm run test                  # Run all unit tests
npm run test:watch            # Watch mode
npm run test:coverage         # With coverage report
```

### View Reports
```bash
npx playwright show-report tests/e2e/reports/html
```

## Configuration

### playwright.config.ts
- **Timeout**: 90s (for 3D asset loading)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Base URL**: http://localhost:3000
- **Retries**: 2 on CI, 0 locally
- **Viewport**: 1920x1080 (desktop), device-specific (mobile)
- **Visual Regression**: 0.2% max pixel difference
- **Auto-start**: `npm run dev` via webServer config

### Key Settings
- Screenshots/videos captured on failure
- Traces on first retry
- Parallel execution (disabled on CI)
- HTML + JSON reporters
- Dark mode emulation
- 30s navigation/action timeouts

## Test Helpers

### Navigation (`helpers/navigation.ts`)
- `goToHome()` - Navigate to homepage
- `waitForScene()` - Wait for 3D scene ready

### Assertions (`helpers/assertions.ts`)
- `expectCanvasRendered()` - Verify WebGL canvas
- Custom Three.js assertions

### Console Monitoring (`helpers/consoleMonitor.ts`)
- `createConsoleMonitor()` - Track console errors/warnings
- Categorizes: asset, runtime, promise rejection errors

## Performance Budgets (`performance-budgets.json`)
- Initial load: <3s
- FPS: >55 (desktop), >30 (mobile)
- Memory: <512MB
- Asset size: <10MB total
- Grass instances: <50k per m²

## Common Patterns

### E2E Test Template
```typescript
import { test, expect } from './fixtures';
import { goToHome, waitForScene } from './helpers/navigation';

test.describe('Feature Name', () => {
  test('should verify behavior', async ({ page }) => {
    await goToHome(page);
    await waitForScene(page);
    // Test logic
  });
});
```

### Unit Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Component', () => {
  it('should behave correctly', () => {
    // Test logic
  });
});
```
