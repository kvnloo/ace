# Fallback System - Integration Guide

## Quick Start

The fallback system is now fully integrated into the ACE visualization. Here's how to use it:

### For Users

No action required! The system automatically:
1. Detects when assets fail to load
2. Switches to minimal mode (building mesh only)
3. Shows clear error message with retry option

### For Developers

The system is already integrated. To customize or extend:

## Component Hierarchy

```
App.tsx
  └─ LoadingProvider (wraps entire app)
       ├─ LoadingScreen (shows during loading)
       │    └─ Monitors: error, fallbackMode from LoadingProvider
       │
       └─ ThreeSceneWrapper (wraps 3D scene)
            ├─ ErrorBoundary (catches React errors)
            │    └─ ThreeScene (3D visualization)
            │
            └─ FallbackUI (shows on error)
                 └─ Displays when fallbackMode = true
```

## Data Flow

### Normal Loading

```typescript
// 1. User loads page
App.tsx renders

// 2. LoadingProvider initializes
const { isLoading, startLoading } = useLoading();
startLoading(); // Sets isLoading = true

// 3. LoadingScreen displays
<LoadingScreen onComplete={() => setLoadingComplete(true)} />

// 4. AssetLoader loads phases
await loader.loadPhase(LoadingPhase.ESSENTIAL);  // Building mesh
await loader.loadPhase(LoadingPhase.CORE);       // Courts, lighting
await loader.loadPhase(LoadingPhase.VISUAL);     // Textures
await loader.loadPhase(LoadingPhase.ENHANCED);   // Effects

// 5. Loading completes
finishLoading(); // Sets isLoading = false
LoadingScreen calls onComplete()

// 6. ThreeScene renders
Full 3D visualization active
```

### Fallback Flow

```typescript
// 1. Error occurs (timeout, network, GPU)
throw new Error('Asset load timeout');

// 2. Error caught by ErrorBoundary
<ErrorBoundary onError={handleSceneError}>

// 3. ThreeSceneWrapper receives error
const handleSceneError = (error: Error) => {
  setLocalError(error);
};

// 4. LoadingProvider error handler called
handleLoadingError(error);
// Sets: error = error, fallbackMode = true, isLoading = false

// 5. LoadingScreen hides
if (fallbackMode) return null;

// 6. AssetLoader loads minimal
await loader.skipToMinimal();
// Loads only ESSENTIAL phase

// 7. FallbackUI displays
{showFallback && <FallbackUI error={error} onRetry={handleRetry} />}
```

## API Reference

### LoadingProvider Context

```typescript
interface LoadingContextValue {
  // Asset tracking
  assets: AssetItem[];
  registerAsset: (asset: Omit<AssetItem, 'loaded' | 'progress'>) => void;
  updateAssetProgress: (id: string, progress: number) => void;
  markAssetLoaded: (id: string) => void;
  markAssetError: (id: string, error: string) => void;

  // Loading state
  isLoading: boolean;
  overallProgress: number;
  loadedCount: number;
  totalCount: number;
  startLoading: () => void;
  finishLoading: () => void;

  // Error handling (NEW)
  error: Error | null;
  fallbackMode: boolean;
  handleLoadingError: (error: Error) => void;
  clearError: () => void;
}
```

### Using in Components

```typescript
import { useLoading } from './components/loading/LoadingProvider';

function MyComponent() {
  const {
    error,           // Current error (if any)
    fallbackMode,    // True if in fallback mode
    handleLoadingError,  // Trigger fallback
    clearError       // Clear error and exit fallback
  } = useLoading();

  // Check if in fallback mode
  if (fallbackMode) {
    return <MinimalView />;
  }

  // Handle errors
  try {
    loadAssets();
  } catch (err) {
    handleLoadingError(err);
  }

  return <FullView />;
}
```

### AssetLoader Methods

```typescript
class AssetLoader {
  // Load all phases (normal flow)
  async start(): Promise<LoadingResult>

  // Load specific phase
  async loadPhase(phase: LoadingPhase): Promise<PhaseResult>

  // Skip to minimal mode (fallback)
  async skipToMinimal(): Promise<void>

  // Force load all (bypass performance checks)
  async forceLoadAll(): Promise<void>

  // Cancel loading
  cancel(): void
}
```

### Using AssetLoader

```typescript
import { AssetLoader } from './services/loading/AssetLoader';
import { AssetRegistry } from './utils/debug/assetRegistry';
import { DebugContext } from './debug/DebugContext';

// Create loader
const loader = new AssetLoader(
  registry,      // AssetRegistry instance
  debugContext,  // DebugContext instance
  {
    autoDegradation: true,
    minimalModeThreshold: 30,
    assetTimeout: 5000,
    phaseTimeout: 30000,
    onProgress: (progress) => {
      console.log(`Loading: ${progress.totalProgress}%`);
    }
  }
);

// Normal load
await loader.start();

// Or skip to minimal immediately
await loader.skipToMinimal();
```

## Integration Points

### 1. Error Detection

**Where errors are caught:**

```typescript
// React component errors
<ErrorBoundary onError={handleError}>
  <ThreeScene />
</ErrorBoundary>

// Asset loading errors
try {
  await loader.loadAsset(assetId);
} catch (error) {
  handleLoadingError(error);
}

// Performance degradation
if (averageFPS < minimalModeThreshold) {
  await loader.skipToMinimal();
}
```

### 2. State Management

**LoadingProvider manages all state:**

```typescript
// In LoadingProvider
const [error, setError] = useState<Error | null>(null);
const [fallbackMode, setFallbackMode] = useState(false);

const handleLoadingError = useCallback((error: Error) => {
  console.error('❌ Loading failed, activating fallback:', error);
  setError(error);
  setFallbackMode(true);
  setIsLoading(false);
}, []);
```

**Components read state:**

```typescript
// In LoadingScreen
const { fallbackMode } = useLoading();
if (fallbackMode) return null; // Hide loading screen

// In ThreeSceneWrapper
const { error, fallbackMode } = useLoading();
{fallbackMode && <FallbackUI error={error} />}
```

### 3. User Actions

**Retry button:**

```typescript
// In ThreeSceneWrapper
const handleRetry = useCallback(() => {
  console.log('🔄 Retrying asset loading...');
  setLocalError(null);
  setShowFallback(false);
  clearError();  // Clear LoadingProvider error
  window.location.reload();  // Reload page
}, [clearError]);

// In FallbackUI
<button onClick={onRetry}>
  Retry Loading
</button>
```

**Back to home:**

```typescript
// In FallbackUI
<button onClick={() => window.location.href = '/'}>
  Back to Home
</button>
```

## Customization Examples

### Custom Error Messages

```typescript
// In FallbackUI.tsx
const getErrorMessage = (error?: Error) => {
  if (error?.message.includes('timeout')) {
    return "Loading timed out. Check your internet connection.";
  }
  if (error?.message.includes('GPU')) {
    return "Your graphics card doesn't support this visualization.";
  }
  return "Some 3D assets couldn't load. Showing simplified view.";
};
```

### Custom Fallback Behavior

```typescript
// In ThreeSceneWrapper.tsx
const handleSceneError = useCallback((error: Error) => {
  // Log to analytics
  analytics.track('3d_scene_error', { error: error.message });

  // Show toast notification
  toast.error('Switching to simplified view');

  // Trigger fallback
  setLocalError(error);
  handleLoadingError(error);
}, [handleLoadingError]);
```

### Conditional Fallback

```typescript
// Only activate fallback for certain errors
const handleLoadingError = useCallback((error: Error) => {
  // Ignore minor errors
  if (error.message.includes('optional-asset')) {
    console.warn('Optional asset failed, continuing...');
    return;
  }

  // Only fallback for critical errors
  if (error.message.includes('essential') ||
      error.message.includes('timeout')) {
    setError(error);
    setFallbackMode(true);
    setIsLoading(false);
  }
}, []);
```

## Testing Integration

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { LoadingProvider } from './LoadingProvider';
import ThreeSceneWrapper from './ThreeSceneWrapper';

describe('Fallback System', () => {
  it('shows FallbackUI when error occurs', () => {
    render(
      <LoadingProvider>
        <ThreeSceneWrapper />
      </LoadingProvider>
    );

    // Trigger error
    const errorBoundary = screen.getByTestId('error-boundary');
    fireEvent.error(errorBoundary);

    // Check fallback UI appears
    expect(screen.getByText('Limited View Mode')).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
describe('3D Visualization Fallback', () => {
  it('activates fallback on network failure', () => {
    // Block asset requests
    cy.intercept('GET', '/assets/**', { forceNetworkError: true });

    // Visit page
    cy.visit('/court');

    // Should show fallback UI
    cy.contains('Limited View Mode').should('be.visible');
    cy.contains('Retry Loading').should('be.visible');

    // Building mesh should still be visible
    cy.get('canvas').should('be.visible');
  });

  it('retries loading on button click', () => {
    // Trigger fallback
    cy.visit('/court?force-error=true');
    cy.contains('Limited View Mode').should('be.visible');

    // Click retry
    cy.contains('Retry Loading').click();

    // Should reload page
    cy.url().should('eq', '/court');
  });
});
```

## Troubleshooting

### Fallback Not Activating

**Issue**: Errors occur but fallback doesn't activate

**Check:**
1. Is ErrorBoundary wrapping the component?
2. Is `handleLoadingError` being called?
3. Is LoadingProvider in the component tree?

**Debug:**
```typescript
// Add console logs
const handleLoadingError = useCallback((error: Error) => {
  console.log('🔍 handleLoadingError called:', error);
  setError(error);
  setFallbackMode(true);
}, []);
```

### Building Mesh Not Visible

**Issue**: Fallback UI shows but no building mesh

**Check:**
1. Is ESSENTIAL phase loading successfully?
2. Are building mesh files accessible?
3. Is Canvas component rendering?

**Debug:**
```typescript
// In AssetLoader
async skipToMinimal(): Promise<void> {
  console.log('⚡ Loading ESSENTIAL phase...');
  await this.loadPhase(LoadingPhase.ESSENTIAL);
  console.log('✅ ESSENTIAL phase loaded');
}
```

### Infinite Retry Loop

**Issue**: Retry keeps failing and triggering fallback

**Fix:**
```typescript
// Add retry limit
const [retryCount, setRetryCount] = useState(0);
const MAX_RETRIES = 3;

const handleRetry = useCallback(() => {
  if (retryCount >= MAX_RETRIES) {
    console.error('Max retries exceeded');
    toast.error('Please check your connection and try again later');
    return;
  }

  setRetryCount(prev => prev + 1);
  window.location.reload();
}, [retryCount]);
```

## Performance Monitoring

### Track Fallback Activations

```typescript
// In ThreeSceneWrapper
const handleSceneError = useCallback((error: Error) => {
  // Send to analytics
  analytics.track('fallback_activated', {
    error: error.message,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    gpu: navigator.gpu // If available
  });

  setLocalError(error);
  handleLoadingError(error);
}, [handleLoadingError]);
```

### Monitor Performance Impact

```typescript
// In AssetLoader
async skipToMinimal(): Promise<void> {
  const startTime = performance.now();

  await this.loadPhase(LoadingPhase.ESSENTIAL);

  const duration = performance.now() - startTime;
  console.log(`⚡ Minimal mode loaded in ${duration.toFixed(2)}ms`);

  // Log metrics
  performance.mark('fallback-complete');
  performance.measure('fallback-duration', 'fallback-start', 'fallback-complete');
}
```

---

**Integration Status**: ✅ Complete and Ready
**Documentation**: See `docs/fallback-system.md` for full details
**Support**: Check troubleshooting section above or file an issue
