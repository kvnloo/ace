# LoadingProvider

## Overview
React Context provider for centralized asset loading state management. Handles registration, progress tracking, and completion status for all loading assets. Provides priority-based asset organization and comprehensive loading lifecycle management.

## Location
- **Path**: `/src/components/LoadingProvider.tsx`
- **Category**: State Management / Loading System
- **Type**: React Context Provider

## Exported Types

### AssetPriority
```typescript
type AssetPriority = 'high' | 'medium' | 'low';
```

### AssetItem
```typescript
interface AssetItem {
  id: string;
  name: string;
  type: 'texture' | 'model' | 'environment' | 'data';
  priority: AssetPriority;
  loaded: boolean;
  progress: number;  // 0-100
  error?: string;
}
```

### LoadingContextValue
```typescript
interface LoadingContextValue {
  assets: AssetItem[];
  registerAsset: (asset: Omit<AssetItem, 'loaded' | 'progress'>) => void;
  updateAssetProgress: (id: string, progress: number) => void;
  markAssetLoaded: (id: string) => void;
  markAssetError: (id: string, error: string) => void;
  isLoading: boolean;
  overallProgress: number;
  loadedCount: number;
  totalCount: number;
  startLoading: () => void;
  finishLoading: () => void;
}
```

## Context Hook

### useLoading()
Custom hook to access loading context.

**Returns**: `LoadingContextValue`

**Throws**: Error if used outside LoadingProvider

```typescript
import { useLoading } from './components/LoadingProvider';

function Component() {
  const { registerAsset, overallProgress } = useLoading();
  // Use loading context
}
```

## Provider Component

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `ReactNode` | ✓ | Child components to receive context |

## API Methods

### registerAsset()
Register a new asset for loading tracking.

**Parameters**:
```typescript
(asset: {
  id: string;        // Unique identifier
  name: string;      // Display name
  type: 'texture' | 'model' | 'environment' | 'data';
  priority: AssetPriority;
}) => void
```

**Features**:
- Prevents duplicate registration
- Priority-based insertion (high → medium → low)
- Auto-initializes loaded: false, progress: 0
- Locked after startLoading() called

**Example**:
```typescript
registerAsset({
  id: 'court-texture-1',
  name: 'Tennis Court Base Texture',
  type: 'texture',
  priority: 'high'
});
```

### updateAssetProgress()
Update loading progress for specific asset.

**Parameters**: `(id: string, progress: number) => void`

**Behavior**:
- Clamps progress to 0-100 range
- Updates only matching asset ID
- Triggers re-render with new progress

**Example**:
```typescript
updateAssetProgress('court-texture-1', 45);
```

### markAssetLoaded()
Mark asset as successfully loaded.

**Parameters**: `(id: string) => void`

**Effects**:
- Sets loaded: true
- Sets progress: 100
- Updates loadedCount

**Example**:
```typescript
markAssetLoaded('court-texture-1');
```

### markAssetError()
Mark asset as failed with error message.

**Parameters**: `(id: string, error: string) => void`

**Effects**:
- Sets error property
- Sets loaded: true (to count as complete)
- Sets progress: 100

**Example**:
```typescript
markAssetError('court-texture-1', 'Failed to fetch texture');
```

### startLoading()
Begin loading process and lock asset registration.

**Effects**:
- Sets isLoading: true
- Locks asset registration (prevents new assets)
- Should be called after all assets registered

**Example**:
```typescript
// Register all assets first
registerAsset({ ... });
registerAsset({ ... });

// Then start loading
startLoading();
```

### finishLoading()
Mark loading process as complete.

**Effects**:
- Sets isLoading: false
- Does NOT unlock registration
- Typically called by LoadingProgress

**Example**:
```typescript
finishLoading();
```

## Computed Properties

### overallProgress
Average progress across all assets (0-100).

**Calculation**: `sum(asset.progress) / assets.length`

**Returns**: `number`

### loadedCount
Number of loaded assets.

**Calculation**: `assets.filter(a => a.loaded).length`

**Returns**: `number`

### totalCount
Total number of registered assets.

**Returns**: `number`

## Usage Example

### Basic Setup
```tsx
import { LoadingProvider } from './components/LoadingProvider';
import LoadingProgress from './components/LoadingProgress';

function App() {
  return (
    <LoadingProvider>
      <LoadingProgress />
      <YourApp />
    </LoadingProvider>
  );
}
```

### Asset Loading Workflow
```tsx
function AssetLoader() {
  const {
    registerAsset,
    updateAssetProgress,
    markAssetLoaded,
    markAssetError,
    startLoading
  } = useLoading();

  useEffect(() => {
    // 1. Register assets
    registerAsset({
      id: 'texture-1',
      name: 'Court Texture',
      type: 'texture',
      priority: 'high'
    });

    registerAsset({
      id: 'model-1',
      name: '3D Court Model',
      type: 'model',
      priority: 'high'
    });

    // 2. Start loading
    startLoading();

    // 3. Load assets with progress tracking
    loadTextureWithProgress('texture-1', (progress) => {
      updateAssetProgress('texture-1', progress);
    }).then(() => {
      markAssetLoaded('texture-1');
    }).catch((error) => {
      markAssetError('texture-1', error.message);
    });

  }, []);

  return null;
}
```

### Three.js Integration
```tsx
import { useGLTF } from '@react-three/fiber';

function CourtModel() {
  const { registerAsset, markAssetLoaded } = useLoading();

  useEffect(() => {
    registerAsset({
      id: 'court-model',
      name: 'Tennis Court 3D Model',
      type: 'model',
      priority: 'high'
    });
  }, []);

  const { scene } = useGLTF('/models/court.glb', undefined, undefined, (xhr) => {
    const progress = (xhr.loaded / xhr.total) * 100;
    updateAssetProgress('court-model', progress);

    if (progress === 100) {
      markAssetLoaded('court-model');
    }
  });

  return <primitive object={scene} />;
}
```

## Priority System

Assets are organized by priority for better UX:

### High Priority (Loaded First)
- Critical textures
- Main 3D models
- Essential UI assets

### Medium Priority (Loaded Second)
- Secondary models
- Additional textures
- Non-critical data

### Low Priority (Loaded Last)
- Decorative elements
- Optional features
- Background assets

### Implementation
```typescript
const priorityOrder = { high: 0, medium: 1, low: 2 };

// Assets inserted in priority order
const insertIndex = prev.findIndex(
  a => priorityOrder[a.priority] > priorityOrder[newAsset.priority]
);
```

## State Management

### Internal State
- `assets` - Array of AssetItem
- `isLoading` - Boolean loading flag
- `registrationLocked` - Ref to prevent late registration

### State Updates
All updates use functional setState for consistency:
```typescript
setAssets(prev =>
  prev.map(asset =>
    asset.id === id ? { ...asset, progress } : asset
  )
);
```

## Registration Locking

### Purpose
Prevents assets from being registered after loading starts.

### Behavior
```typescript
const registrationLocked = useRef(false);

const registerAsset = useCallback((asset) => {
  if (registrationLocked.current) {
    console.warn('Asset registration locked');
    return;
  }
  // Register asset
}, []);
```

### Why Lock?
- Ensures all assets known before loading
- Prevents race conditions
- Maintains accurate progress calculations
- Predictable loading behavior

## Error Handling

### Duplicate Registration
Silently ignored - uses first registration only.

### Invalid IDs
No validation - caller responsible for unique IDs.

### Progress Clamping
Automatically clamps to 0-100 range.

### Hook Outside Provider
Throws descriptive error:
```
Error: useLoading must be used within LoadingProvider
```

## Dependencies
- **React** - Context API, Hooks (useState, useCallback, useContext)

## Related Components
- [LoadingProgress](/docs/components/loading-progress.md) - Visual progress display
- [ThreeScene](/docs/components/three-scene.md) - Asset loading integration
- [SafeThreeScene](/docs/components/safe-three-scene.md) - Loading coordination

## Performance Notes
- useCallback for all methods (prevents re-renders)
- Efficient array operations
- Minimal context updates
- Priority-based insertion (O(n) worst case)
- No unnecessary re-renders

## Browser Compatibility
- All browsers supporting React 16.8+ (Hooks)
- Context API support
- No special browser features required

## Common Use Cases
1. **Application initialization** - Track all startup assets
2. **Scene loading** - 3D model and texture loading
3. **Progressive enhancement** - Load assets by priority
4. **User feedback** - Show accurate loading progress
5. **Error tracking** - Monitor failed assets

## Testing
```tsx
import { render } from '@testing-library/react';
import { LoadingProvider, useLoading } from './LoadingProvider';

function TestComponent() {
  const { registerAsset, assets } = useLoading();

  useEffect(() => {
    registerAsset({
      id: 'test',
      name: 'Test Asset',
      type: 'texture',
      priority: 'high'
    });
  }, []);

  return <div>{assets.length}</div>;
}

test('registers asset', () => {
  const { getByText } = render(
    <LoadingProvider>
      <TestComponent />
    </LoadingProvider>
  );

  expect(getByText('1')).toBeInTheDocument();
});
```

## Best Practices
1. **Register early** - Before startLoading()
2. **Unique IDs** - Use consistent naming scheme
3. **Priority usage** - Load critical assets first
4. **Error handling** - Always catch and report errors
5. **Progress updates** - Update frequently for smooth UX
6. **Cleanup** - Call markAssetLoaded when complete
7. **Provider placement** - Wrap entire app or scene

## Common Patterns

### Bulk Registration
```typescript
const assets = [
  { id: 'tex-1', name: 'Texture 1', type: 'texture', priority: 'high' },
  { id: 'tex-2', name: 'Texture 2', type: 'texture', priority: 'medium' },
  { id: 'model-1', name: 'Model 1', type: 'model', priority: 'high' },
];

useEffect(() => {
  assets.forEach(registerAsset);
  startLoading();
}, []);
```

### Progress Calculation
```typescript
const { overallProgress } = useLoading();

// Overall progress automatically calculated
console.log(`Loading: ${overallProgress.toFixed(1)}%`);
```

### Conditional Rendering
```typescript
const { loadedCount, totalCount } = useLoading();

if (loadedCount === totalCount) {
  return <Scene />;
}

return <LoadingProgress />;
```

## Notes
- Context must wrap all components using loading state
- Registration locked after startLoading() - plan ahead
- Progress is average, not weighted by file size
- Assets organized by priority automatically
- No automatic retry on errors
- Supports unlimited number of assets
- Type-safe with TypeScript
- Lightweight with minimal overhead
