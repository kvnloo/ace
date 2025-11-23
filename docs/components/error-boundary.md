# ErrorBoundary

## Overview
Production-ready React error boundary component that catches JavaScript errors anywhere in the component tree. Provides comprehensive error logging, user-friendly fallback UI, and debugging tools including error reporting and automatic recovery.

## Location
- **Path**: `/src/components/ErrorBoundary.tsx`
- **Category**: Error Handling / System Component
- **Type**: React Class Component

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `ReactNode` | ✓ | Child components to protect with error boundary |
| fallbackUI | `ReactNode` | ✗ | Custom fallback UI (uses default if not provided) |
| onError | `(error: Error, errorInfo: ErrorInfo) => void` | ✗ | Custom error handler callback |

## State Interface
```typescript
interface State {
  hasError: boolean;        // Whether an error has been caught
  error: Error | null;      // The caught error object
  errorInfo: ErrorInfo | null;  // React component stack
  errorId: string;          // Unique error identifier
  copied: boolean;          // Clipboard copy status
}
```

## Features

### Error Capture
- Catches all React errors in child component tree
- Captures full error stack trace
- Records React component stack
- Generates unique error ID for tracking

### Error Persistence
- Stores errors in localStorage (last 10 errors)
- Includes environment metadata:
  - User agent
  - URL
  - Viewport dimensions
  - Timestamp
  - Component stack
- Automatic size management (prevents storage overflow)

### Error Reporting
- **Copy to Clipboard** - Full error report with one click
- **Download Report** - Export as .txt file
- **DebugLogger Integration** - Auto-logs to DebugLogger if available
- **Console Logging** - Development-friendly console output

### User Interface
- Modern glass-morphism design
- Gradient error header
- Expandable stack traces
- Color-coded error severity
- Responsive button actions
- Success feedback animations

### Recovery Options
- **Try Recovery** - Attempt to clear error and resume
- **Manual Reload** - User can reload page
- **Error Details** - Full transparency for debugging
- **Help Text** - User guidance

## Usage Example

### Basic Wrapping
```tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThreeScene />
      <UI />
    </ErrorBoundary>
  );
}
```

### With Custom Handler
```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Send to error tracking service
    analytics.trackError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }}
>
  <YourApp />
</ErrorBoundary>
```

### With Custom Fallback
```tsx
<ErrorBoundary
  fallbackUI={
    <div className="custom-error">
      <h1>Oops! Something went wrong</h1>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  }
>
  <CriticalComponent />
</ErrorBoundary>
```

### Nested Boundaries
```tsx
function App() {
  return (
    <ErrorBoundary> {/* Top-level catch-all */}
      <Header />

      <ErrorBoundary> {/* Scene-specific boundary */}
        <ThreeScene />
      </ErrorBoundary>

      <ErrorBoundary> {/* UI-specific boundary */}
        <Controls />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

## Error Report Format

### Clipboard Export
```
🔴 Error Report
ID: err_1234567890_abc123def
Time: 2024-01-15T10:30:00.000Z

Error Message:
Cannot read property 'position' of undefined

Stack Trace:
[Full JavaScript stack trace]

Component Stack:
[React component hierarchy]

Browser: Mozilla/5.0...
URL: https://example.com/app
Viewport: 1920x1080
```

### Downloaded File
```
Error Report - err_1234567890_abc123def
Generated: 2024-01-15T10:30:00.000Z

ERROR DETAILS
=============
Message: Cannot read property 'position' of undefined
Type: TypeError

STACK TRACE
===========
[Full stack trace with line numbers]

COMPONENT STACK
===============
[React component hierarchy with file paths]

ENVIRONMENT
===========
User Agent: Mozilla/5.0...
URL: https://example.com/app
Screen: 1920x1080
Viewport: 1920x1080
```

## Integration with DebugLogger

If DebugLogger is available globally, errors are automatically logged:

```typescript
window.debugLogger.logError({
  type: 'react_error',
  message: error.message,
  stack: error.stack,
  componentStack: errorInfo.componentStack,
  errorId: 'err_xxx',
  timestamp: Date.now()
});
```

## Method Reference

### `getDerivedStateFromError(error)`
Static method called during render phase to generate unique error ID.

### `componentDidCatch(error, errorInfo)`
Lifecycle method called after error is thrown:
1. Logs error to console
2. Updates state with error details
3. Persists to localStorage
4. Calls custom `onError` handler
5. Integrates with DebugLogger

### `persistError(error, errorInfo)`
Private method to store error in localStorage with size limits.

### `getStoredErrors()`
Retrieves all stored errors from localStorage.

### `copyErrorToClipboard()`
Copies formatted error report to clipboard with success feedback.

### `downloadErrorReport()`
Generates and downloads error report as text file.

### `handleRecover()`
Attempts to recover from error by clearing error state.

### `clearStoredErrors()`
Removes all stored errors from localStorage.

## Default Fallback UI Components

### Header Section
- Red gradient background
- Alert triangle icon
- "Application Error" title
- Contextual subtitle

### Error Details
- Unique error ID
- Error message in highlighted box
- Collapsible stack trace
- Collapsible component stack

### Action Buttons
- **Try Recovery** (Green) - Attempt to resume
- **Copy Report** (Blue) - Copy to clipboard
- **Download Report** (Gray) - Export as file

### Help Text
- Guidance for user next steps
- Error reporting instructions

## Dependencies
- **React** - Class component with error boundary lifecycle
- **lucide-react** - Icons (AlertTriangle, RefreshCw, FileText, Copy, Check)
- **DebugLogger** - Optional integration for centralized logging

## Styling
- Gradient backgrounds (slate-900 to red-900)
- Glass-morphism effects with backdrop blur
- Border glow effects
- Smooth transitions
- Responsive layout
- Custom scrollbars

## Related Components
- [DebugLogger](/docs/components/debug-logger.md) - Error logging integration
- [SafeThreeScene](/docs/components/safe-three-scene.md) - Uses ErrorBoundary
- [App](/docs/components/app.md) - Top-level error protection

## Performance Notes
- No performance impact when no errors occur
- Minimal overhead during error capture
- localStorage operations are async
- Efficient state updates

## Browser Compatibility
- All modern browsers supporting React 16.6+
- localStorage required for error persistence
- Clipboard API required for copy functionality
- Download requires Blob API support

## Best Practices
1. **Wrap at appropriate levels** - Don't wrap too broadly or too narrowly
2. **Provide custom error handlers** - Integrate with error tracking services
3. **Test error scenarios** - Verify error boundary catches expected errors
4. **Clear stored errors** - Implement periodic cleanup
5. **User communication** - Explain what happened and what to do
6. **Avoid over-recovery** - Some errors should require reload

## Common Error Types Caught
- Rendering errors
- Event handler errors
- Lifecycle method errors
- Constructor errors
- Component method errors
- Third-party library errors

## Errors NOT Caught
Error boundaries do NOT catch:
- Event handlers (use try-catch)
- Asynchronous code (callbacks, promises)
- Server-side rendering errors
- Errors in error boundary itself

## Testing
```tsx
// Trigger error for testing
function BuggyComponent() {
  throw new Error('Test error boundary!');
}

function Test() {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
}
```

## Notes
- Store error IDs for support ticket correlation
- Monitor localStorage size to prevent quota errors
- Consider sending errors to centralized logging service
- Test recovery behavior thoroughly
- Provide clear user guidance in error messages
- Keep last 10 errors only to prevent storage bloat
- Error ID format: `err_timestamp_randomhash`
