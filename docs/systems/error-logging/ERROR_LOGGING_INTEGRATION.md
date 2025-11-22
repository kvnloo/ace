# Quick Integration Guide

Fast setup for adding error logging to the 3D Tennis Map.

## Step 1: Wrap Your App

Update `/home/kvn/workspace/ace/App.tsx`:

```tsx
import ErrorBoundary from './components/ErrorBoundary';
import DebugLogger from './components/DebugLogger';
import ThreeScene from './components/ThreeScene';
import { FeatureData } from './types';

function App() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureData | null>(null);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Optional: Send to analytics
        console.error('Caught by ErrorBoundary:', error);
      }}
    >
      {/* Debug Logger - toggle with button in bottom-right */}
      <DebugLogger
        enabled={import.meta.env.DEV}
        maxLogs={100}
        persistLogs={true}
        showPerformance={true}
      />

      {/* Your existing app */}
      <div className="min-h-screen bg-slate-900">
        <ThreeScene onFeatureSelect={setSelectedFeature} />
        {/* ... rest of your app */}
      </div>
    </ErrorBoundary>
  );
}

export default App;
```

## Step 2: Add Three.js Error Logging

Update `/home/kvn/workspace/ace/components/ThreeScene.tsx`:

Add WebGL context loss detection:

```tsx
// Add inside ThreeScene component, after imports
const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect }) => {
  // ... existing state ...

  // Add WebGL error handling
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.error('WebGL context lost');

      if (window.debugLogger) {
        window.debugLogger.logError({
          type: 'webgl_context_lost',
          message: 'WebGL rendering context was lost',
          data: { statusMessage: (event as WebGLContextEvent).statusMessage }
        });
      }
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');

      if (window.debugLogger) {
        window.debugLogger.logInfo({
          type: 'webgl_context_restored',
          message: 'WebGL context successfully restored'
        });
      }
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  // ... rest of component ...
};
```

## Step 3: Test It

### Trigger React Error

Add a test button temporarily:

```tsx
<button onClick={() => { throw new Error('Test error'); }}>
  Test Error Boundary
</button>
```

### Trigger Console Error

Open browser console:

```javascript
console.error('Test error logging', { data: 'test' });
```

### View Debug Logger

Click the bug icon (🐛) in the bottom-right corner.

### Simulate WebGL Context Loss

In browser console:

```javascript
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
gl?.getExtension('WEBGL_lose_context')?.loseContext();
```

## Step 4: Production Configuration

Create `/home/kvn/workspace/ace/config/debug.ts`:

```typescript
export const DEBUG_CONFIG = {
  enabled: import.meta.env.DEV ||
           localStorage.getItem('debug_mode') === 'true' ||
           new URLSearchParams(window.location.search).get('debug') === 'true',

  maxLogs: import.meta.env.DEV ? 200 : 50,
  persistLogs: import.meta.env.DEV,
  showPerformance: import.meta.env.DEV
};
```

Update App.tsx:

```tsx
import { DEBUG_CONFIG } from './config/debug';

<DebugLogger {...DEBUG_CONFIG} />
```

## Step 5: Enable in Production (Optional)

Users can enable debug mode in production:

1. Open browser console
2. Run: `localStorage.setItem('debug_mode', 'true')`
3. Reload page
4. Debug panel will be available

Or use URL parameter:
```
https://yoursite.com/?debug=true
```

## Step 6: Verify Installation

Check that these files exist:

- ✅ `/components/ErrorBoundary.tsx`
- ✅ `/components/DebugLogger.tsx`
- ✅ `/types/debug.d.ts`
- ✅ `/docs/ERROR_LOGGING_SYSTEM.md`
- ✅ `/docs/ERROR_LOGGING_EXAMPLES.md`

## Done!

Your 3D map now has:

- ✅ React error boundary with fallback UI
- ✅ Console error/warning interception
- ✅ WebGL context loss detection
- ✅ Real-time FPS/memory monitoring
- ✅ Persistent error logging
- ✅ Visual debug overlay
- ✅ Error export/download functionality

## Quick Commands

```javascript
// Enable debug mode
localStorage.setItem('debug_mode', 'true');
location.reload();

// Get all logs
window.debugLogger?.getLogs();

// Clear logs
window.debugLogger?.clearLogs();

// Log custom error
window.debugLogger?.logError({
  type: 'custom_error',
  message: 'Something went wrong',
  data: { detail: 'Additional info' }
});
```

## Next Steps

- Read full documentation: `/docs/ERROR_LOGGING_SYSTEM.md`
- See usage examples: `/docs/ERROR_LOGGING_EXAMPLES.md`
- Add custom error types for your domain
- Integrate with error tracking service (Sentry, etc.)
- Add automated tests for error scenarios

## Keyboard Shortcuts

When debug mode is enabled:

- Press bug icon (🐛) to toggle debug panel
- Use browser DevTools for detailed inspection

## Troubleshooting

**Debug logger not showing?**
- Check that `enabled={true}` in DebugLogger props
- Verify no console errors blocking initialization

**Performance HUD not showing memory?**
- Memory API requires Chrome/Edge with flag enabled
- Go to `chrome://flags/#enable-precise-memory-info`

**WebGL context loss not detected?**
- Ensure DebugLogger mounts after Canvas renders
- Check canvas elements exist in DOM

---

For detailed documentation and advanced usage, see:
- `/docs/ERROR_LOGGING_SYSTEM.md`
- `/docs/ERROR_LOGGING_EXAMPLES.md`
