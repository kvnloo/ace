# Error Logging System Documentation

Comprehensive error handling and debugging infrastructure for the 3D Tennis Map.

## Overview

The error logging system provides production-ready error boundaries, performance monitoring, and debug logging for the React + Three.js application.

## Components

### 1. ErrorBoundary.tsx

React error boundary that catches all component errors and provides graceful failure recovery.

#### Features

- **Full Error Capture**: Catches all React component errors with complete stack traces
- **Component Tree Logging**: Records which components failed in the hierarchy
- **Persistent Storage**: Saves errors to localStorage for debugging after page reload
- **User-Friendly Fallback**: Beautiful error UI with recovery options
- **Error Reporting**: Copy/download error reports for bug tracking
- **Automatic Recovery**: Attempt to recover without full page reload

#### Usage

```tsx
import ErrorBoundary from './components/ErrorBoundary';

// Wrap your app or components
function App() {
  return (
    <ErrorBoundary onError={(error, info) => {
      // Optional: Send to error tracking service
      console.log('Error caught:', error);
    }}>
      <ThreeScene />
    </ErrorBoundary>
  );
}
```

#### Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode;           // Components to protect
  fallbackUI?: ReactNode;         // Custom error UI (optional)
  onError?: (                     // Custom error handler (optional)
    error: Error,
    errorInfo: ErrorInfo
  ) => void;
}
```

#### Error Persistence

Errors are stored in localStorage with the following structure:

```json
{
  "errorId": "err_1234567890_abc123",
  "timestamp": "2025-11-22T12:00:00.000Z",
  "message": "Cannot read property 'position' of undefined",
  "stack": "Error: Cannot read property...",
  "componentStack": "in TennisCourt (at ThreeScene.tsx:567)...",
  "userAgent": "Mozilla/5.0...",
  "url": "https://example.com/",
  "viewport": { "width": 1920, "height": 1080 }
}
```

#### Recovery Actions

1. **Try Recovery**: Resets error boundary state and attempts to re-render
2. **Copy Report**: Copies formatted error report to clipboard
3. **Download Report**: Downloads error details as `.txt` file
4. **Manual Reload**: User can refresh page if recovery fails

---

### 2. DebugLogger.tsx

Visual debug overlay with console interception, performance monitoring, and WebGL error tracking.

#### Features

- **Console Interception**: Captures all console.error, console.warn calls
- **Global Error Handlers**: Catches window.onerror and unhandledrejection events
- **WebGL Context Loss Detection**: Monitors canvas elements for WebGL failures
- **Performance Monitoring**: Real-time FPS, frame time, memory usage tracking
- **Persistent Logging**: Saves logs to localStorage across sessions
- **Visual Debug Panel**: Collapsible overlay with log filtering and export
- **Global API**: Programmatic logging via window.debugLogger

#### Usage

```tsx
import DebugLogger from './components/DebugLogger';

function App() {
  return (
    <>
      <DebugLogger
        enabled={true}              // Enable/disable logging
        maxLogs={100}               // Maximum stored logs
        persistLogs={true}          // Save to localStorage
        showPerformance={true}      // Show performance HUD
      />
      <ThreeScene />
    </>
  );
}
```

#### Props

```typescript
interface DebugLoggerProps {
  enabled?: boolean;           // Enable debug logger (default: true)
  maxLogs?: number;            // Max logs to store (default: 100)
  persistLogs?: boolean;       // Save to localStorage (default: true)
  showPerformance?: boolean;   // Show FPS/memory HUD (default: true)
}
```

#### Global API

```typescript
// Log custom errors
window.debugLogger.logError({
  type: 'three_js_error',
  message: 'Failed to load texture',
  data: { textureUrl: '/path/to/texture.png' },
  stack: new Error().stack
});

// Log warnings
window.debugLogger.logWarn({
  type: 'performance_warning',
  message: 'Low FPS detected',
  data: { fps: 25 }
});

// Log info
window.debugLogger.logInfo({
  type: 'scene_loaded',
  message: '3D scene initialized'
});

// Get all logs
const logs = window.debugLogger.getLogs();

// Clear all logs
window.debugLogger.clearLogs();
```

#### Performance Monitoring

The debug logger automatically tracks:

- **FPS (Frames Per Second)**: Updated every second
- **Frame Time**: Time to render each frame in milliseconds
- **Memory Usage**: JavaScript heap size in MB (if available)
- **WebGL Context Status**: Detects context lost/restored events

Performance HUD shows color-coded FPS:
- 🟢 Green: 50+ FPS (smooth)
- 🟡 Yellow: 30-49 FPS (moderate)
- 🔴 Red: <30 FPS (poor)

#### Log Levels

- **error**: Critical errors requiring immediate attention
- **warn**: Warnings that may indicate problems
- **info**: Informational messages
- **debug**: Detailed debugging information

#### Log Types

Auto-detected log types:
- `console_error`: Intercepted console.error calls
- `console_warn`: Intercepted console.warn calls
- `window_error`: Global window errors
- `unhandled_rejection`: Promise rejections
- `webgl_context_lost`: WebGL context lost events
- `webgl_context_restored`: WebGL context restored
- `performance`: Performance warnings (low FPS)
- `custom`: User-defined log entries

#### Export/Download

**Download as JSON**:
```json
{
  "exportedAt": "2025-11-22T12:00:00.000Z",
  "performance": {
    "fps": 60,
    "memory": 128,
    "frameTime": 16.67,
    "webglContextLost": false
  },
  "logs": [ /* log entries */ ]
}
```

---

## Integration Example

### Complete Setup

```tsx
// App.tsx
import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import DebugLogger from './components/DebugLogger';
import ThreeScene from './components/ThreeScene';

function App() {
  const [debugEnabled, setDebugEnabled] = useState(
    import.meta.env.DEV || localStorage.getItem('debug_mode') === 'true'
  );

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Optional: Send to error tracking service
        if (window.debugLogger) {
          window.debugLogger.logError({
            type: 'react_error_boundary',
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
          });
        }

        // Send to analytics/Sentry
        // trackError(error, errorInfo);
      }}
    >
      <DebugLogger
        enabled={debugEnabled}
        maxLogs={100}
        persistLogs={true}
        showPerformance={true}
      />

      <ThreeScene />
    </ErrorBoundary>
  );
}

export default App;
```

### Three.js Error Integration

```tsx
// In ThreeScene.tsx or useEffect hooks
import { useEffect } from 'react';

// Log Three.js texture loading errors
textureLoader.load(
  '/path/to/texture.png',
  (texture) => {
    // Success
  },
  undefined,
  (error) => {
    console.error('Texture loading failed:', error);
    // Automatically captured by DebugLogger
  }
);

// Log geometry errors
try {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
} catch (error) {
  console.error('Geometry creation failed:', error);
  // Automatically captured by DebugLogger
}

// Custom performance logging
useEffect(() => {
  const checkPerformance = setInterval(() => {
    if (window.debugLogger) {
      const fps = /* calculate FPS */;
      if (fps < 30) {
        window.debugLogger.logWarn({
          type: 'performance_degradation',
          message: `FPS dropped to ${fps}`,
          data: { fps, sceneObjects: scene.children.length }
        });
      }
    }
  }, 5000);

  return () => clearInterval(checkPerformance);
}, []);
```

---

## Production Configuration

### Environment-Based Toggle

```tsx
// Enable debug logger only in development or when explicitly enabled
const debugEnabled =
  import.meta.env.DEV ||
  localStorage.getItem('debug_mode') === 'true' ||
  window.location.search.includes('debug=true');

<DebugLogger enabled={debugEnabled} />
```

### Toggle Debug Mode

```typescript
// Enable debug mode in production console
localStorage.setItem('debug_mode', 'true');
window.location.reload();

// Disable debug mode
localStorage.removeItem('debug_mode');
window.location.reload();
```

### URL Parameter

```
https://example.com/?debug=true
```

---

## Keyboard Shortcuts

Add keyboard shortcuts for quick debugging:

```tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl + Shift + D: Toggle debug logger
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      setDebugEnabled(prev => !prev);
    }

    // Ctrl + Shift + C: Clear logs
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      window.debugLogger?.clearLogs();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## WebGL Context Loss Handling

The system automatically detects WebGL context loss. Handle it in your Three.js code:

```tsx
useEffect(() => {
  const canvas = document.querySelector('canvas');

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    console.error('WebGL context lost');

    // Attempt recovery
    setTimeout(() => {
      renderer.forceContextRestore();
    }, 1000);
  };

  const handleContextRestored = () => {
    console.log('WebGL context restored');
    // Reinitialize scene
    initializeScene();
  };

  canvas?.addEventListener('webglcontextlost', handleContextLost);
  canvas?.addEventListener('webglcontextrestored', handleContextRestored);

  return () => {
    canvas?.removeEventListener('webglcontextlost', handleContextLost);
    canvas?.removeEventListener('webglcontextrestored', handleContextRestored);
  };
}, [renderer]);
```

---

## Error Tracking Integration

### Sentry Integration

```tsx
import * as Sentry from '@sentry/react';

<ErrorBoundary
  onError={(error, errorInfo) => {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }}
>
  <App />
</ErrorBoundary>
```

### Custom Analytics

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Send to custom analytics
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    });
  }}
>
  <App />
</ErrorBoundary>
```

---

## Performance Best Practices

1. **Disable in Production**: Set `enabled={false}` for production builds unless explicitly enabled
2. **Limit Log Count**: Use `maxLogs={50}` to reduce memory footprint
3. **Disable Persistence**: Set `persistLogs={false}` for privacy-sensitive apps
4. **Conditional Performance**: Only show performance HUD when debugging

---

## Testing

### Manual Testing

1. Trigger React error:
```tsx
// Add to any component
throw new Error('Test error boundary');
```

2. Trigger console error:
```tsx
console.error('Test console interception', { data: 'test' });
```

3. Trigger unhandled rejection:
```tsx
Promise.reject(new Error('Test unhandled rejection'));
```

4. Simulate WebGL context loss:
```tsx
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
gl?.getExtension('WEBGL_lose_context')?.loseContext();
```

### Automated Testing

```typescript
// ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

test('catches and displays error', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/Application Error/i)).toBeInTheDocument();
  expect(screen.getByText(/Test error/i)).toBeInTheDocument();
});
```

---

## Troubleshooting

### Issue: Logs not persisting

**Solution**: Check localStorage quota
```typescript
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage not available:', e);
}
```

### Issue: Performance HUD not showing memory

**Solution**: Memory API only available in Chrome/Edge with specific flags:
```
chrome://flags/#enable-precise-memory-info
```

### Issue: WebGL context loss not detected

**Solution**: Ensure canvas elements exist before DebugLogger mounts:
```tsx
// Mount DebugLogger after Canvas renders
{canvasReady && <DebugLogger />}
```

---

## API Reference

### ErrorBoundary

#### Methods

- `componentDidCatch(error, errorInfo)`: Lifecycle method that catches errors
- `getDerivedStateFromError(error)`: Updates state when error occurs
- `persistError(error, errorInfo)`: Saves error to localStorage
- `copyErrorToClipboard()`: Copies error report to clipboard
- `downloadErrorReport()`: Downloads error as text file
- `handleRecover()`: Attempts to recover from error

#### State

```typescript
interface State {
  hasError: boolean;         // Whether error occurred
  error: Error | null;       // Error object
  errorInfo: ErrorInfo | null; // React error info
  errorId: string;           // Unique error identifier
  copied: boolean;           // Clipboard copy status
}
```

### DebugLogger

#### Global API

```typescript
window.debugLogger = {
  logError: (data: LogData) => void;
  logWarn: (data: LogData) => void;
  logInfo: (data: LogData) => void;
  clearLogs: () => void;
  getLogs: () => LogEntry[];
}
```

#### Types

```typescript
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  type: string;
  message: string;
  stack?: string;
  data?: any;
}

interface PerformanceMetrics {
  fps: number;
  memory: number;
  frameTime: number;
  webglContextLost: boolean;
}
```

---

## License

MIT - See project LICENSE file
