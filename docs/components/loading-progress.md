# LoadingProgress

## Overview
Elegant full-screen loading overlay that displays real-time asset loading progress. Shows individual asset status, overall progress percentage, and provides a polished user experience during application initialization. Integrates with LoadingProvider for centralized loading state management.

## Location
- **Path**: `/src/components/LoadingProgress.tsx`
- **Category**: UI / Loading System
- **Type**: React Functional Component

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onComplete | `() => void` | ✗ | - | Callback when all assets finish loading |
| minimumDisplayTime | `number` | ✗ | 1500 | Minimum milliseconds to show loading screen |

## Features

### Loading State Management
- Consumes LoadingProvider context
- Tracks individual asset progress
- Calculates overall completion percentage
- Displays loaded count vs total count

### Minimum Display Time
Ensures loading screen shows for minimum duration:
- Prevents flashing on fast loads
- Provides smooth user experience
- Configurable via props
- Auto-dismisses when complete + time elapsed

### Visual Components
- **Overall Progress Bar** - Animated tennis-yellow indicator
- **Asset List** - Individual asset status with icons
- **Progress Percentage** - Large, prominent display
- **Asset Counter** - Loaded/Total ratio

### Status Indicators
- ✓ **Loaded** - Check circle (white/20% opacity)
- ⏳ **Loading** - Spinning loader (tennis-yellow)
- ❌ **Error** - X circle (red)

## Usage Example

### Basic Usage
```tsx
import LoadingProgress from './components/LoadingProgress';
import { LoadingProvider } from './components/LoadingProvider';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LoadingProvider>
      {isLoading && (
        <LoadingProgress
          onComplete={() => setIsLoading(false)}
          minimumDisplayTime={2000}
        />
      )}

      <MainApp />
    </LoadingProvider>
  );
}
```

### With Three.js Scene
```tsx
function SceneLoader() {
  const { registerAsset, startLoading } = useLoading();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Register assets before loading
    registerAsset({
      id: 'court-texture',
      name: 'Tennis Court Texture',
      type: 'texture',
      priority: 'high'
    });

    startLoading();
  }, []);

  return (
    <>
      {!ready && (
        <LoadingProgress
          onComplete={() => setReady(true)}
        />
      )}

      {ready && <ThreeScene />}
    </>
  );
}
```

## Integration with LoadingProvider

### Context Consumption
```typescript
const {
  assets,           // Array of AssetItem
  overallProgress,  // 0-100 percentage
  loadedCount,      // Number of loaded assets
  totalCount,       // Total number of assets
  isLoading         // Loading state boolean
} = useLoading();
```

### Asset State Flow
1. Assets registered via `registerAsset()`
2. Loading started via `startLoading()`
3. Progress updated via `updateAssetProgress()`
4. Assets marked complete via `markAssetLoaded()`
5. Overall progress calculated automatically
6. LoadingProgress displays state
7. OnComplete called when done

## Visual Design

### Layout
- Full-screen fixed overlay (z-50)
- Centered card layout
- Dark background (slate-950)
- Maximum width: 32rem (512px)
- Padding: 1.5rem (24px)

### Card Styling
- Glass-morphism background (white/5%)
- Border: white/10% opacity
- Rounded corners (1.5rem)
- Hover effect: white/10% background
- Smooth transitions

### Progress Bar
- Height: 0.5rem (8px)
- Background: white/5%
- Fill: tennis-yellow (#DFFF4F)
- Rounded full
- Animated width transition (0.3s ease-out)

### Asset List
- Maximum height: 24rem (384px)
- Custom scrollbar styling
- Animated entry (staggered 50ms)
- Border separator (white/5%)
- Truncated long names

## Component Structure

### Header Section
```tsx
<div className="mb-8 pb-6 border-b border-white/10">
  <h2>Loading 3D Environment</h2>
  <div>{overallProgress}%</div>
  <div>{loadedCount} / {totalCount} assets</div>
  <ProgressBar />
</div>
```

### Asset List Section
```tsx
<div className="space-y-3 max-h-96 overflow-y-auto">
  <AnimatePresence mode="popLayout">
    {assets.map(asset => (
      <AssetItem key={asset.id} {...asset} />
    ))}
  </AnimatePresence>
</div>
```

### Asset Item Display
- Status icon (left)
- Asset name (truncated)
- Progress bar (if loading)
- Status text (right)

## State Management

### Internal State
- `displayStartTime` - Track when loading screen first shown
- `canDismiss` - Whether minimum time has elapsed

### Effect Hooks
1. **Minimum Display Timer**
   - Sets canDismiss after minimumDisplayTime
   - Cleanup on unmount

2. **Completion Handler**
   - Checks if all assets loaded
   - Verifies minimum time elapsed
   - Calculates remaining delay
   - Calls onComplete callback

## Data Attributes

Test-friendly data attributes:
```html
<div
  data-testid="loading-progress"
  data-progress="75"
  data-loaded="6"
  data-total="8"
>
```

## Animation Details

### Entry Animation
```typescript
{
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}
```

### Exit Animation
```typescript
{
  exit: { opacity: 0, y: -10 }
}
```

### Asset Item Animation
```typescript
{
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: index * 0.05 }
}
```

## Dependencies
- **React** - Component framework
- **framer-motion** - Animation library (motion, AnimatePresence)
- **lucide-react** - Icons (CheckCircle, XCircle, Loader2)
- **LoadingProvider** - Context provider for loading state

## Related Components
- [LoadingProvider](/docs/components/loading-provider.md) - State management
- [ThreeScene](/docs/components/three-scene.md) - Main 3D scene
- [SafeThreeScene](/docs/components/safe-three-scene.md) - Loading integration

## Performance Notes
- Minimal re-renders with proper dependencies
- Efficient list rendering with AnimatePresence
- Smooth 60fps animations
- No memory leaks (proper cleanup)
- Lightweight progress calculations

## Browser Compatibility
- Modern browsers supporting React Hooks
- Framer Motion animation support
- CSS transitions for smooth effects
- SVG icon support

## Accessibility
- Semantic HTML structure
- Clear loading states
- Visible progress indicators
- Status icons with meaning
- High contrast text

## Common Use Cases
1. **Application startup** - Initial asset loading
2. **Scene transitions** - 3D environment changes
3. **Resource loading** - Textures, models, data
4. **User feedback** - Show loading progress
5. **Performance optimization** - Prevent flash of incomplete UI

## Testing
```tsx
import { render, screen } from '@testing-library/react';
import LoadingProgress from './LoadingProgress';

test('shows loading progress', () => {
  render(
    <LoadingProvider>
      <LoadingProgress />
    </LoadingProvider>
  );

  expect(screen.getByTestId('loading-progress')).toBeInTheDocument();
  expect(screen.getByText(/Loading 3D Environment/)).toBeInTheDocument();
});
```

## Notes
- Always wrap in LoadingProvider
- Minimum display time prevents jarring transitions
- onComplete callback is optional
- Returns null when not loading and no assets
- Asset list scrollable for many items
- Progress bar animates smoothly with easing
- Status icons provide clear visual feedback
- Can be styled via Tailwind utilities
- Test data attributes for easy testing

## Best Practices
1. Set appropriate minimumDisplayTime (1500-2500ms recommended)
2. Register all assets before calling startLoading()
3. Provide onComplete callback for state management
4. Handle errors in asset loading gracefully
5. Test with various asset counts and load times
6. Ensure LoadingProvider wraps component tree
7. Consider pre-loading critical assets first
