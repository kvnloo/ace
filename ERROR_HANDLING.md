# Error Handling & Offline Support Documentation

This document provides comprehensive information about the error handling and offline support systems implemented in the LawnTech Dynamics application.

## Table of Contents

- [Overview](#overview)
- [Error Boundary System](#error-boundary-system)
- [Offline Support](#offline-support)
- [Network Status Detection](#network-status-detection)
- [API Error Handling](#api-error-handling)
- [Component Reference](#component-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The LawnTech Dynamics application implements a comprehensive error handling and offline support system designed to:

- **Gracefully degrade** when services are unavailable
- **Provide clear, user-friendly error messages** that match our brand aesthetics
- **Maintain functionality** even when network connectivity is lost
- **Recover automatically** when connectivity is restored
- **Log errors appropriately** for debugging and monitoring

### Key Features

1. **React Error Boundaries** - Catch and handle JavaScript errors in components
2. **Offline Detection** - Real-time network status monitoring
3. **Graceful API Failures** - Smart error handling for Gemini AI service
4. **User-Friendly Messages** - Brand-consistent error communication
5. **Automatic Recovery** - Seamless reconnection handling

---

## Error Boundary System

### ErrorBoundary Component

**Location:** `/home/user/ace/components/ErrorBoundary.tsx`

The ErrorBoundary component is a React class component that catches JavaScript errors anywhere in the child component tree.

#### Features

- Catches runtime errors in React components
- Displays beautiful error UI matching brand aesthetics
- Shows detailed error information in development mode
- Provides quick recovery actions (refresh, go home)
- Automatic error logging to console

#### Implementation

The ErrorBoundary wraps the entire application in `/home/user/ace/index.tsx`:

```tsx
import ErrorBoundary from './components/ErrorBoundary';

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

#### Error Display

When an error occurs, users see:

- **Production Mode:**
  - Clean error message
  - Refresh and Home buttons
  - Support contact information

- **Development Mode:**
  - All of the above, plus:
  - Detailed error message
  - Full stack trace
  - Component stack trace
  - Recovery attempt option (without reload)

#### Custom Error UI

You can provide a custom fallback UI:

```tsx
<ErrorBoundary fallback={<CustomErrorComponent />}>
  <YourComponent />
</ErrorBoundary>
```

---

## Offline Support

### OfflineIndicator Component

**Location:** `/home/user/ace/components/OfflineIndicator.tsx`

A notification banner that appears when the user loses internet connectivity.

#### Features

- Real-time network status monitoring
- Smooth animations using Framer Motion
- Non-intrusive fixed positioning
- Auto-dismiss when connection restored
- Shows "reconnected" confirmation message

#### Visual Design

- **Offline State:** Red banner with WifiOff icon and warning message
- **Reconnected State:** Green banner with Wifi icon and success message (3 seconds)
- **Styling:** Backdrop blur, rounded corners, brand-consistent colors

#### Usage

The component is automatically included in the main App component:

```tsx
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  return (
    <div>
      <OfflineIndicator />
      {/* Rest of your app */}
    </div>
  );
}
```

### OfflineFallback Component

**Location:** `/home/user/ace/components/OfflineFallback.tsx`

A full-page fallback component for when the application cannot load due to network issues.

#### Features

- Beautiful offline UI with animated icons
- Customizable title and message
- Retry functionality
- Helpful troubleshooting tips
- Responsive design

#### Props

```tsx
interface OfflineFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}
```

#### Usage Examples

**Default usage:**
```tsx
<OfflineFallback />
```

**Custom configuration:**
```tsx
<OfflineFallback
  title="Service Temporarily Unavailable"
  message="We're performing maintenance. Please try again in a few minutes."
  onRetry={() => window.location.reload()}
/>
```

**Component-level usage:**
```tsx
function MyComponent() {
  const { isOnline } = useNetworkStatus();

  if (!isOnline) {
    return <OfflineFallback />;
  }

  return <div>Your component content</div>;
}
```

---

## Network Status Detection

### useNetworkStatus Hook

**Location:** `/home/user/ace/hooks/useNetworkStatus.ts`

A custom React hook for detecting and monitoring network status.

#### Features

- Real-time online/offline detection
- Tracks if user was previously offline
- Provides network quality information (when available)
- Cross-browser compatible
- Uses Network Information API when available

#### Return Value

```tsx
interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  downlink?: number;        // Bandwidth estimate in Mb/s
  effectiveType?: string;   // '2g', '3g', '4g', etc.
  saveData?: boolean;       // User's data saver preference
}
```

#### Usage

```tsx
import useNetworkStatus from '../hooks/useNetworkStatus';

function MyComponent() {
  const { isOnline, wasOffline, effectiveType } = useNetworkStatus();

  if (!isOnline) {
    return <p>You are offline</p>;
  }

  if (wasOffline) {
    return <p>Welcome back! You were offline.</p>;
  }

  return <p>Connection: {effectiveType || 'unknown'}</p>;
}
```

#### Browser Support

- **Online/Offline Detection:** All modern browsers
- **Network Information API:** Chrome, Edge, Opera (limited browser support)
- **Graceful Degradation:** Falls back to basic online/offline in unsupported browsers

---

## API Error Handling

### Gemini Service Error Handling

**Location:** `/home/user/ace/services/geminiService.ts`

The Gemini AI service implements comprehensive error handling with classified error types and user-friendly messages.

#### Error Types

```tsx
enum GeminiErrorType {
  NO_API_KEY = 'NO_API_KEY',           // API key not configured
  NETWORK_ERROR = 'NETWORK_ERROR',     // Connection issues
  RATE_LIMIT = 'RATE_LIMIT',           // Too many requests
  INVALID_RESPONSE = 'INVALID_RESPONSE', // Malformed response
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',     // Unclassified errors
}
```

#### Error Classification

The service automatically classifies errors based on error messages:

- **Network Errors:** Connection, timeout, offline issues
- **Rate Limit Errors:** Quota exceeded, too many requests
- **Invalid Response Errors:** Parsing, malformed data
- **Unknown Errors:** Everything else

#### User-Friendly Messages

Each error type has a brand-consistent, user-friendly message:

| Error Type | User Message |
|------------|-------------|
| NO_API_KEY | "I'm currently offline (API Key missing). Our AI concierge will be back soon!" |
| NETWORK_ERROR | "It seems you're experiencing connection issues. Please check your internet and try again." |
| RATE_LIMIT | "We're experiencing high demand right now. Please wait a moment and try again." |
| INVALID_RESPONSE | "I'm having trouble understanding that request. Could you try rephrasing?" |
| UNKNOWN_ERROR | "Our autonomous systems are currently recalibrating. Please try again in a moment." |

#### Service Availability Check

```tsx
import { isGeminiServiceAvailable } from './services/geminiService';

if (isGeminiServiceAvailable()) {
  // Service is ready to use
} else {
  // Service is unavailable (no API key or offline)
}
```

#### Error Logging

All errors are logged with comprehensive information:

```javascript
{
  type: 'NETWORK_ERROR',
  message: 'Failed to fetch',
  stack: '...',
  originalError: Error { ... },
  timestamp: '2025-11-23T10:30:45.123Z'
}
```

---

## Component Reference

### Quick Reference Table

| Component | Purpose | Location |
|-----------|---------|----------|
| ErrorBoundary | Catch React errors | `/components/ErrorBoundary.tsx` |
| OfflineIndicator | Show offline status banner | `/components/OfflineIndicator.tsx` |
| OfflineFallback | Full-page offline UI | `/components/OfflineFallback.tsx` |
| useNetworkStatus | Network detection hook | `/hooks/useNetworkStatus.ts` |

### Integration Points

1. **Application Root** (`/index.tsx`)
   - ErrorBoundary wraps entire app

2. **Main App Component** (`/App.tsx`)
   - OfflineIndicator at top level

3. **AI Chat Service** (`/services/geminiService.ts`)
   - Comprehensive error handling
   - Network status checking
   - User-friendly error messages

---

## Best Practices

### When to Use Each Component

#### ErrorBoundary
- ✅ Wrap entire application (already implemented)
- ✅ Wrap lazy-loaded route components
- ✅ Wrap third-party components
- ❌ Don't wrap every single component (performance overhead)

#### OfflineIndicator
- ✅ Use once at app root level (already implemented)
- ❌ Don't use multiple instances

#### OfflineFallback
- ✅ Use for features requiring internet
- ✅ Use for lazy-loaded components
- ✅ Use as Suspense fallback for network-dependent features
- ❌ Don't use for local-only features

#### useNetworkStatus
- ✅ Use in components that need network awareness
- ✅ Use to conditionally render features
- ✅ Use to show degraded functionality messages
- ❌ Don't use in every component (use at feature level)

### Error Message Guidelines

When writing error messages, follow these principles:

1. **Be Clear:** Explain what happened in simple terms
2. **Be Helpful:** Suggest what users can do next
3. **Be Positive:** Frame issues as temporary, solvable
4. **Be On-Brand:** Use LawnTech's autonomous/futuristic tone
5. **Be Concise:** Keep messages under 2 sentences when possible

#### Good Examples
✅ "Our autonomous systems are currently recalibrating. Please try again in a moment."
✅ "Connection lost. Check your internet and we'll be right back!"
✅ "High demand detected. Waiting for capacity..."

#### Bad Examples
❌ "ERROR: Network failure at line 42"
❌ "Something went wrong. Contact administrator."
❌ "undefined is not a function"

### Progressive Enhancement

Implement features with graceful degradation:

```tsx
function AIFeature() {
  const { isOnline } = useNetworkStatus();
  const isServiceAvailable = isGeminiServiceAvailable();

  if (!isOnline) {
    return <OfflineFallback />;
  }

  if (!isServiceAvailable) {
    return (
      <div>
        <p>AI Chat is temporarily unavailable.</p>
        <p>Browse our facility specs while you wait!</p>
      </div>
    );
  }

  return <AIChat />;
}
```

---

## Troubleshooting

### Common Issues

#### 1. ErrorBoundary Not Catching Errors

**Problem:** Some errors aren't being caught by ErrorBoundary.

**Possible Causes:**
- Error occurred outside React component lifecycle
- Error in event handler (ErrorBoundary doesn't catch these)
- Error in async code without proper try/catch

**Solution:**
```tsx
// For event handlers, wrap in try/catch
const handleClick = async () => {
  try {
    await someAsyncOperation();
  } catch (error) {
    console.error('Error in handler:', error);
    // Show error to user
  }
};
```

#### 2. OfflineIndicator Not Showing

**Problem:** Offline banner doesn't appear when disconnecting.

**Debugging Steps:**
1. Check browser console for `navigator.onLine` value
2. Verify component is mounted in App.tsx
3. Check z-index conflicts with other fixed elements
4. Test in different browsers (some have delayed offline events)

**Solution:**
```tsx
// Manually test network detection
console.log('Online status:', navigator.onLine);
window.addEventListener('offline', () => console.log('Offline!'));
window.addEventListener('online', () => console.log('Online!'));
```

#### 3. API Errors Not User-Friendly

**Problem:** Technical error messages showing to users.

**Check:**
- Verify error classification in `classifyError()` function
- Check error message patterns match actual API errors
- Add console logs to see raw error messages

**Solution:**
Update error patterns in `/services/geminiService.ts`:
```tsx
// Add new error patterns
if (errorMessage.includes('your-new-error-pattern')) {
  return GeminiErrorType.YOUR_TYPE;
}
```

#### 4. Service Availability Check Incorrect

**Problem:** `isGeminiServiceAvailable()` returns wrong status.

**Debugging:**
```tsx
console.log('API Key exists:', !!process.env.API_KEY);
console.log('Navigator online:', navigator.onLine);
console.log('Service available:', isGeminiServiceAvailable());
```

---

## Testing Error Scenarios

### Simulating Offline Mode

#### In Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Select "Offline" from throttling dropdown
4. Refresh page or trigger network requests

#### Programmatically
```javascript
// In browser console
window.dispatchEvent(new Event('offline'));
// Restore
window.dispatchEvent(new Event('online'));
```

### Testing Error Boundary

```tsx
// Create a component that throws an error
function ErrorThrower() {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error!');
  }

  return (
    <button onClick={() => setShouldError(true)}>
      Trigger Error
    </button>
  );
}

// Use in development
<ErrorBoundary>
  <ErrorThrower />
</ErrorBoundary>
```

### Testing API Errors

```tsx
// Mock different error types in geminiService.ts
export const sendQueryToConcierge = async () => {
  // Uncomment to test different scenarios:

  // throw new Error('network error');
  // throw new Error('rate limit exceeded');
  // throw new Error('invalid json parse error');
  // return null; // Test invalid response

  // Normal operation...
};
```

---

## Future Enhancements

### Potential Improvements

1. **Error Reporting Service**
   - Integrate Sentry or similar for production error tracking
   - Add error reporting in ErrorBoundary's `componentDidCatch`

2. **Offline Data Persistence**
   - Cache API responses using Service Workers
   - Store user interactions for sync when back online

3. **Retry Logic**
   - Implement exponential backoff for API calls
   - Auto-retry failed requests when connection restored

4. **User Preferences**
   - Allow users to dismiss error messages
   - Remember user's error message preferences

5. **Analytics**
   - Track error frequency and types
   - Monitor network status patterns
   - Measure user recovery success rates

---

## Support & Contribution

### Reporting Issues

If you encounter errors not handled gracefully:

1. Check browser console for detailed error logs
2. Note the timestamp and error type
3. Document steps to reproduce
4. Check this guide's troubleshooting section
5. File an issue with error details

### Contributing

When adding new features:

1. Wrap new async operations in try/catch
2. Use appropriate error handling components
3. Provide user-friendly error messages
4. Test offline scenarios
5. Update this documentation

---

## Version History

- **v1.0.0** (2025-11-23)
  - Initial error handling implementation
  - ErrorBoundary component
  - OfflineIndicator component
  - OfflineFallback component
  - useNetworkStatus hook
  - Comprehensive Gemini API error handling
  - Initial documentation

---

*For more information about the LawnTech Dynamics application, see the main [README.md](/home/user/ace/README.md).*
