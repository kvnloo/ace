# Batch Component Loading System

## Overview

The Batch Component Loading System provides progressive loading of 3D scene components based on real-time FPS monitoring. This system helps identify performance bottlenecks by loading components in tiers and monitoring their impact on frame rate.

## Key Features

- **Tiered Loading**: Components organized into 4 tiers based on visual importance
- **FPS Monitoring**: Real-time frame rate tracking with automatic adjustments
- **Manual Override**: Debug panel for manual control and testing
- **Dependency Management**: Automatic handling of component dependencies
- **Performance Correlation**: Track FPS impact of individual components

## Component Tiers

### Tier 0: Essential (Always On)
- **Target FPS**: N/A (always enabled)
- **Components**: Court geometry, basic lighting, camera controls
- **Purpose**: Minimum viable rendering

### Tier 1: Core
- **Target FPS**: 45+ FPS
- **Components**: Building structures, floor plates, bleachers, court textures
- **Purpose**: Basic facility visualization

### Tier 2: Visual
- **Target FPS**: 50+ FPS
- **Components**: Shadows, grass, trees, detailed interiors
- **Purpose**: Enhanced visual quality

### Tier 3: Enhanced
- **Target FPS**: 55+ FPS
- **Components**: Weather effects, particle systems, animations, post-processing
- **Purpose**: Maximum visual fidelity

## Usage

### Basic Integration

Components should use the `useComponentEnabled` hook to conditionally render:

```tsx
import { useComponentEnabled } from '@/hooks/useComponentEnabled';

function WeatherSystem() {
  const isEnabled = useComponentEnabled('weather-system');

  if (!isEnabled) {
    return null; // Don't render until enabled
  }

  return <WeatherEffects />;
}
```

### Multiple Component Dependencies

For components that require multiple systems:

```tsx
import { useComponentsEnabled } from '@/hooks/useComponentEnabled';

function GrassCourtSystem() {
  const allReady = useComponentsEnabled([
    'grass-system',
    'robotic-grass',
    'court-textures'
  ]);

  if (!allReady) return null;

  return <ComplexGrassSimulation />;
}
```

### Tier-Based Rendering

For components that render differently based on tier:

```tsx
import { useTierEnabled } from '@/hooks/useComponentEnabled';
import { ComponentTier } from '@/services/batch-loading/ComponentBatchManager';

function CourtRenderer() {
  const coreEnabled = useTierEnabled(ComponentTier.CORE);
  const visualEnabled = useTierEnabled(ComponentTier.VISUAL);
  const enhancedEnabled = useTierEnabled(ComponentTier.ENHANCED);

  return (
    <>
      <BasicCourt /> {/* Always rendered */}
      {coreEnabled && <CourtTextures />}
      {visualEnabled && <CourtShadows />}
      {enhancedEnabled && <CourtParticles />}
    </>
  );
}
```

## ThreeScene Integration

The main ThreeScene component should wrap conditional rendering around major components:

```tsx
// Example from ThreeScene.tsx
function ThreeScene() {
  // Essential components (always rendered)
  const courts = <TennisCourts />;

  // Core tier
  const buildingShell = useComponentEnabled('building-shell') && <BuildingShell />;
  const bleachers = useComponentEnabled('bleachers') && <BleacherSections />;

  // Visual tier
  const grass = useComponentEnabled('grass-system') && <Grass />;
  const shadows = useComponentEnabled('shadows') && <ContactShadows />;

  // Enhanced tier
  const weather = useComponentEnabled('weather-system') && <WeatherSystem />;
  const particles = useComponentEnabled('particles') && <ParticleEffects />;

  return (
    <Canvas>
      {courts}
      {buildingShell}
      {bleachers}
      {grass}
      {shadows}
      {weather}
      {particles}
    </Canvas>
  );
}
```

## Debug Control Panel

The BatchControlPanel provides manual control for testing:

```tsx
import { BatchControlPanel } from '@/components/debug/BatchControlPanel';

function App() {
  return (
    <>
      <ThreeScene />
      <BatchControlPanel
        initiallyOpen={true}
        position="bottom-right"
      />
    </>
  );
}
```

### Panel Features

- **FPS Monitor**: Real-time frame rate display
- **Tier Controls**: Enable/disable entire tiers
- **Component Toggle**: Individual component control
- **Auto-Adjust**: Automatic tier adjustment based on FPS
- **Performance Warnings**: Alerts when FPS drops below thresholds

## Performance Thresholds

The system uses these FPS thresholds for automatic adjustments:

- **Critical (< 25 FPS)**: Emergency mode - disable all non-essential
- **Low (< 40 FPS)**: Downgrade to lower tier
- **Stable (55+ FPS)**: Attempt to upgrade to higher tier

## Component Definition

New components should be added to `COMPONENT_DEFINITIONS`:

```typescript
{
  id: 'my-component',           // Unique identifier
  tier: ComponentTier.VISUAL,   // Tier placement
  displayName: 'My Component',  // UI display name
  description: 'Description',   // Tooltip text
  estimatedCost: 5,             // Expected FPS impact
  dependencies: ['other-id'],   // Required components
  category: 'effect'            // Component category
}
```

## Categories

- **court**: Tennis court related components
- **building**: Architectural structures
- **nature**: Trees, grass, natural elements
- **effect**: Visual effects and post-processing
- **system**: Core rendering systems
- **mechanical**: Animated mechanical systems

## Best Practices

1. **Start with Essential**: Always ensure Tier 0 components work perfectly
2. **Test Each Tier**: Verify performance at each tier level
3. **Monitor Dependencies**: Ensure dependent components load in correct order
4. **Profile Impact**: Use the panel to identify high-impact components
5. **Graceful Degradation**: Design components to fail gracefully when disabled

## Troubleshooting

### Components Not Loading
- Check component ID matches definition
- Verify dependencies are enabled
- Check tier is enabled in control panel

### FPS Drops When Component Enabled
- Review estimated cost vs actual impact
- Consider moving to higher tier
- Optimize component rendering
- Check for render loops

### Dependencies Not Working
- Ensure dependency IDs are correct
- Check load order in console
- Verify circular dependencies don't exist

## API Reference

### ComponentBatchManager

```typescript
// Enable/disable tiers
componentBatchManager.enableTier(tier: ComponentTier)
componentBatchManager.disableTier(tier: ComponentTier)

// Component control
componentBatchManager.enableComponent(id: string)
componentBatchManager.disableComponent(id: string)

// State queries
componentBatchManager.isComponentEnabled(id: string): boolean
componentBatchManager.isTierEnabled(tier: ComponentTier): boolean

// Performance
componentBatchManager.autoAdjustForFPS(currentFPS: number)
componentBatchManager.emergencyMode(currentFPS: number)
```

### React Hooks

```typescript
// Component state
useComponentEnabled(id: string): boolean
useComponentsEnabled(ids: string[]): boolean

// Tier state
useTierEnabled(tier: ComponentTier): boolean
useTierStats(tier: ComponentTier): TierStats

// Control hooks (for debug panels)
useComponentControl(id: string): ControlInterface
useTierControl(tier: ComponentTier): TierControlInterface

// Performance monitoring
useComponentPerformance(id: string): PerformanceData
```

## Performance Tips

1. **Batch Geometry**: Combine similar meshes when possible
2. **LOD Systems**: Use level-of-detail for complex geometries
3. **Texture Optimization**: Use compressed textures and atlases
4. **Instancing**: Use instanced rendering for repeated objects
5. **Culling**: Implement frustum culling for off-screen objects

## Future Enhancements

- [ ] Automatic component profiling
- [ ] Machine learning for optimal tier placement
- [ ] User preference persistence
- [ ] Network-based component loading
- [ ] Progressive texture quality
- [ ] Dynamic LOD adjustment
- [ ] Memory usage tracking
- [ ] Component heat mapping