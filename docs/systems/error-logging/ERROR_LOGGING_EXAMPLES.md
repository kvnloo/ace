# Error Logging System - Usage Examples

Practical examples for integrating ErrorBoundary and DebugLogger into the 3D Tennis Map.

## Table of Contents

1. [Basic Integration](#basic-integration)
2. [Three.js Specific Examples](#threejs-specific-examples)
3. [Production Configuration](#production-configuration)
4. [Advanced Usage](#advanced-usage)
5. [Testing Examples](#testing-examples)

---

## Basic Integration

### Minimal Setup

Wrap your entire app with ErrorBoundary and add DebugLogger:

```tsx
// App.tsx
import ErrorBoundary from './components/ErrorBoundary';
import DebugLogger from './components/DebugLogger';
import ThreeScene from './components/ThreeScene';

function App() {
  return (
    <ErrorBoundary>
      <DebugLogger enabled={import.meta.env.DEV} />
      <ThreeScene />
    </ErrorBoundary>
  );
}

export default App;
```

### With Custom Error Handler

Send errors to analytics or monitoring service:

```tsx
import ErrorBoundary from './components/ErrorBoundary';
import DebugLogger from './components/DebugLogger';

function App() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }

    // Send to analytics in production
    if (import.meta.env.PROD) {
      // Example: Google Analytics
      gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });

      // Example: Custom API
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      <DebugLogger enabled={true} />
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

### Nested Error Boundaries

Protect specific sections with granular error handling:

```tsx
function App() {
  return (
    <ErrorBoundary>
      <DebugLogger enabled={true} />

      <Header />

      <ErrorBoundary
        fallbackUI={
          <div className="error-message">
            3D scene failed to load. Please refresh the page.
          </div>
        }
      >
        <ThreeScene />
      </ErrorBoundary>

      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      <Footer />
    </ErrorBoundary>
  );
}
```

---

## Three.js Specific Examples

### Texture Loading Errors

Catch and log texture loading failures:

```tsx
import { useEffect } from 'react';
import * as THREE from 'three';

function TennisCourt() {
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      '/textures/court-hard.jpg',
      (texture) => {
        // Success
        material.map = texture;
        material.needsUpdate = true;

        if (window.debugLogger) {
          window.debugLogger.logInfo({
            type: 'texture_loaded',
            message: 'Court texture loaded successfully',
            data: { url: '/textures/court-hard.jpg' }
          });
        }
      },
      (progress) => {
        // Optional: Log loading progress
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading texture: ${percent.toFixed(0)}%`);
      },
      (error) => {
        // Error - automatically logged by console interception
        console.error('Failed to load court texture:', error);

        // Fallback to default color
        material.color.set('#3b82f6');
      }
    );
  }, []);

  return <mesh>{ /* court geometry */ }</mesh>;
}
```

### WebGL Context Loss Recovery

Handle WebGL context loss with automatic recovery:

```tsx
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';

function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();

      console.error('WebGL context lost');

      if (window.debugLogger) {
        window.debugLogger.logError({
          type: 'webgl_context_lost',
          message: 'WebGL context was lost - attempting recovery',
          data: {
            statusMessage: (event as WebGLContextEvent).statusMessage
          }
        });
      }

      // Attempt automatic recovery after 1 second
      setTimeout(() => {
        const gl = canvas.getContext('webgl');
        if (gl) {
          const ext = gl.getExtension('WEBGL_lose_context');
          if (ext) {
            ext.restoreContext();
          }
        }
      }, 1000);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');

      if (window.debugLogger) {
        window.debugLogger.logInfo({
          type: 'webgl_context_restored',
          message: 'WebGL context successfully restored'
        });
      }

      // Reinitialize scene if needed
      // initScene();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  return (
    <Canvas ref={canvasRef}>
      { /* scene content */ }
    </Canvas>
  );
}
```

### Geometry Creation Errors

Safely create Three.js geometries with error handling:

```tsx
import { useMemo } from 'react';
import * as THREE from 'three';

function CustomCourt() {
  const geometry = useMemo(() => {
    try {
      // Validate parameters
      if (width <= 0 || height <= 0) {
        throw new Error(`Invalid court dimensions: ${width}x${height}`);
      }

      const geo = new THREE.PlaneGeometry(width, height);

      if (window.debugLogger) {
        window.debugLogger.logInfo({
          type: 'geometry_created',
          message: 'Court geometry created',
          data: { width, height, vertices: geo.attributes.position.count }
        });
      }

      return geo;
    } catch (error) {
      console.error('Failed to create court geometry:', error);

      // Fallback to default geometry
      return new THREE.PlaneGeometry(10, 20);
    }
  }, [width, height]);

  return <mesh geometry={geometry}>{ /* material */ }</mesh>;
}
```

### Performance Monitoring

Log performance warnings for complex scenes:

```tsx
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

function PerformanceMonitor() {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const lowFpsCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const delta = now - lastTime.current;

    if (delta >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / delta);
      frameCount.current = 0;
      lastTime.current = now;

      // Log low FPS warnings
      if (fps < 30) {
        lowFpsCount.current++;

        if (lowFpsCount.current >= 3 && window.debugLogger) {
          window.debugLogger.logWarn({
            type: 'performance_degradation',
            message: `Sustained low FPS: ${fps}`,
            data: {
              fps,
              duration: lowFpsCount.current,
              timestamp: Date.now()
            }
          });
        }
      } else {
        lowFpsCount.current = 0;
      }
    }
  });

  return null;
}

// Add to scene
<Canvas>
  <PerformanceMonitor />
  { /* other scene content */ }
</Canvas>
```

---

## Production Configuration

### Environment-Based Debug Mode

Only enable debug features when needed:

```tsx
// config/debug.ts
export const DEBUG_CONFIG = {
  enabled: import.meta.env.DEV ||
           localStorage.getItem('debug_mode') === 'true' ||
           new URLSearchParams(window.location.search).get('debug') === 'true',

  maxLogs: import.meta.env.DEV ? 200 : 50,
  persistLogs: import.meta.env.DEV,
  showPerformance: import.meta.env.DEV
};

// App.tsx
import { DEBUG_CONFIG } from './config/debug';

function App() {
  return (
    <ErrorBoundary>
      <DebugLogger
        enabled={DEBUG_CONFIG.enabled}
        maxLogs={DEBUG_CONFIG.maxLogs}
        persistLogs={DEBUG_CONFIG.persistLogs}
        showPerformance={DEBUG_CONFIG.showPerformance}
      />
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

### Feature Flag Integration

Control debug features with feature flags:

```tsx
import { useFeatureFlag } from './hooks/useFeatureFlags';

function App() {
  const debugEnabled = useFeatureFlag('debug_mode');
  const performanceHUD = useFeatureFlag('performance_hud');

  return (
    <ErrorBoundary>
      <DebugLogger
        enabled={debugEnabled}
        showPerformance={performanceHUD}
      />
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

### User Preference Toggle

Let users enable/disable debug mode:

```tsx
import { useState, useEffect } from 'react';

function App() {
  const [debugMode, setDebugMode] = useState(() => {
    return localStorage.getItem('user_debug_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('user_debug_mode', debugMode.toString());
  }, [debugMode]);

  return (
    <>
      <ErrorBoundary>
        <DebugLogger enabled={debugMode} />
        <ThreeScene />
      </ErrorBoundary>

      {/* Debug toggle button */}
      <button
        onClick={() => setDebugMode(prev => !prev)}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-slate-800 text-white rounded"
      >
        Debug: {debugMode ? 'ON' : 'OFF'}
      </button>
    </>
  );
}
```

---

## Advanced Usage

### Custom Error Reporting Service

Integrate with error tracking services:

```tsx
// services/errorReporting.ts
class ErrorReportingService {
  private static instance: ErrorReportingService;
  private sessionId: string;

  private constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36)}`;
  }

  static getInstance(): ErrorReportingService {
    if (!this.instance) {
      this.instance = new ErrorReportingService();
    }
    return this.instance;
  }

  async reportError(error: Error, context?: any): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          message: error.message,
          stack: error.stack,
          context,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (e) {
      console.error('Failed to report error:', e);
    }
  }
}

export default ErrorReportingService;

// Usage in App.tsx
import ErrorReportingService from './services/errorReporting';

function App() {
  const errorService = ErrorReportingService.getInstance();

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        errorService.reportError(error, {
          componentStack: errorInfo.componentStack
        });
      }}
    >
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

### Conditional Error Boundaries

Show different fallback UIs based on error type:

```tsx
function CustomErrorFallback({ error }: { error: Error }) {
  if (error.message.includes('WebGL')) {
    return (
      <div className="error-webgl">
        <h2>WebGL Not Supported</h2>
        <p>Your browser doesn't support WebGL. Please update or use a modern browser.</p>
      </div>
    );
  }

  if (error.message.includes('texture')) {
    return (
      <div className="error-texture">
        <h2>Resource Loading Failed</h2>
        <p>Some 3D assets failed to load. The scene may appear incomplete.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="error-generic">
      <h2>Something Went Wrong</h2>
      <p>{error.message}</p>
    </div>
  );
}

// Usage
<ErrorBoundary
  fallbackUI={<CustomErrorFallback error={currentError} />}
>
  <ThreeScene />
</ErrorBoundary>
```

### Keyboard Shortcuts

Add developer shortcuts for quick debugging:

```tsx
import { useEffect } from 'react';

function App() {
  const [debugVisible, setDebugVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + Shift + D: Toggle debug panel
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDebugVisible(prev => !prev);
      }

      // Ctrl + Shift + C: Clear logs
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        window.debugLogger?.clearLogs();
        console.log('Debug logs cleared');
      }

      // Ctrl + Shift + E: Download error report
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        const logs = window.debugLogger?.getLogs();
        if (logs) {
          const blob = new Blob([JSON.stringify(logs, null, 2)], {
            type: 'application/json'
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `debug-logs-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <ErrorBoundary>
      <DebugLogger enabled={debugVisible} />
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

---

## Testing Examples

### Unit Tests

Test ErrorBoundary with React Testing Library:

```tsx
// ErrorBoundary.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  test('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  test('catches and displays error', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Application Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  test('calls onError callback', () => {
    const onError = jest.fn();
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toBe('Test error');

    spy.mockRestore();
  });

  test('recovery button resets error state', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Application Error/i)).toBeInTheDocument();

    const recoverButton = screen.getByText(/Try Recovery/i);
    fireEvent.click(recoverButton);

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/Application Error/i)).not.toBeInTheDocument();

    spy.mockRestore();
  });
});
```

### Integration Tests

Test error logging with Playwright:

```typescript
// e2e/error-logging.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Error Logging System', () => {
  test('captures and displays console errors', async ({ page }) => {
    await page.goto('/');

    // Trigger console error
    await page.evaluate(() => {
      console.error('Test error message', { data: 'test' });
    });

    // Open debug logger
    await page.click('[title="Toggle Debug Logger"]');

    // Verify error appears in log
    await expect(page.locator('text=Test error message')).toBeVisible();
  });

  test('monitors performance metrics', async ({ page }) => {
    await page.goto('/');

    // Wait for performance HUD
    await page.waitForSelector('text=FPS:');

    // Verify FPS is displayed
    const fps = await page.textContent('[data-testid="fps-value"]');
    expect(parseInt(fps || '0')).toBeGreaterThan(0);
  });

  test('error boundary shows fallback UI', async ({ page }) => {
    await page.goto('/?trigger-error=true');

    // Verify error UI
    await expect(page.locator('text=Application Error')).toBeVisible();
    await expect(page.locator('text=Try Recovery')).toBeVisible();
  });
});
```

---

## Quick Reference

### Console Commands

```javascript
// Enable debug mode
localStorage.setItem('debug_mode', 'true');
location.reload();

// Disable debug mode
localStorage.removeItem('debug_mode');
location.reload();

// Get all logs
window.debugLogger.getLogs();

// Clear logs
window.debugLogger.clearLogs();

// Log custom error
window.debugLogger.logError({
  type: 'test',
  message: 'Test error'
});

// Simulate WebGL context loss
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
gl?.getExtension('WEBGL_lose_context')?.loseContext();
```

### Keyboard Shortcuts

- `Ctrl + Shift + D`: Toggle debug panel
- `Ctrl + Shift + C`: Clear logs
- `Ctrl + Shift + E`: Download error report

### URL Parameters

```
?debug=true          - Enable debug mode
?performance=true    - Show performance HUD only
```

---

## Best Practices

1. **Always wrap app with ErrorBoundary** - Prevents white screen of death
2. **Enable debug mode conditionally** - Don't ship debug tools to production by default
3. **Log custom events** - Use window.debugLogger for domain-specific logging
4. **Monitor WebGL context** - Add context loss handlers to all Three.js scenes
5. **Persist critical errors** - Send important errors to backend for analysis
6. **Test error scenarios** - Verify error boundaries work with automated tests
7. **Limit log storage** - Set reasonable maxLogs to prevent memory issues
8. **Use error IDs** - Track specific errors across sessions

---

## License

MIT - See project LICENSE file
