# Debug Utilities - Asset Registry

Centralized tracking system for all 3D assets in the ACE facility.

## Overview

The Asset Registry provides:
- **Centralized tracking** of all 3D components (courts, grass, lighting, weather, etc.)
- **Dependency management** with automatic enable/disable propagation
- **Performance budgeting** with cost estimation
- **Circular dependency detection** to prevent invalid configurations
- **Runtime state management** with enable/disable toggles

## Quick Start

```typescript
import { assetRegistry } from '@/utils/debug';

// Check if asset is enabled
if (assetRegistry.isEnabled('grass-blades')) {
  // Render grass
}

// Enable asset (auto-enables dependencies)
assetRegistry.enable('robotic-mowers');
// -> Also enables 'grass-blades' dependency

// Get performance cost
const budget = assetRegistry.getBudgetStatus();
console.log(`Scene cost: ${budget.current}/${budget.max}`);
// -> Scene cost: 42/100

// Get all enabled assets
const enabled = assetRegistry.getEnabled();
console.log(`Active assets: ${enabled.length}`);
```

## Asset Categories

### Courts (7 assets)
- `tennis-court-1` through `tennis-court-4` - Regulation tennis courts
- `court-lines` - Line markings
- `court-net` - Tennis nets with physics
- `court-surface` - PBR court materials

### Grass System (4 assets)
- `grass-blades` - Instanced grass geometry
- `grass-physics` - Wind and interaction simulation
- `robotic-mowers` - Autonomous mowing robots
- `growth-visualization` - Growth height mapping

### Lighting (5 assets)
- `ambient-light` - Global ambient
- `directional-light` - Sun simulation
- `spot-lights` - Stadium lighting
- `dynamic-shadows` - Real-time shadows
- `hdr-environment` - HDR environment map

### Weather (4 assets)
- `weather-particles` - Rain/snow effects
- `clouds` - Volumetric clouds
- `fog-system` - Atmospheric fog
- `wind-effects` - Wind simulation

### Effects (4 assets)
- `particle-systems` - General particles
- `post-processing` - Screen-space effects
- `bloom-effects` - Bloom post-process
- `motion-blur` - Camera motion blur

### UI/HUD (3 assets)
- `performance-hud` - FPS overlay
- `heat-map-overlay` - Tactical visualization
- `player-markers` - Position indicators

### Building Components (4 assets)
- `reception-area` - Main entrance
- `cognitive-lab` - AI training facility
- `bms-control-room` - BMS center
- `transport-pods` - Automated transport

### Characters (1 asset)
- `character-system` - Character animation

### Physics (1 asset)
- `physics-engine` - Physics simulation

## API Reference

### AssetRegistry Class

#### Query Methods

```typescript
// Get asset by ID
const asset = assetRegistry.get('grass-blades');

// Get all assets
const all = assetRegistry.getAll();

// Get by type
const courts = assetRegistry.getByType('court');

// Get enabled/disabled
const enabled = assetRegistry.getEnabled();
const disabled = assetRegistry.getDisabled();

// Check enabled state
const isEnabled = assetRegistry.isEnabled('grass-blades');
```

#### Control Methods

```typescript
// Enable asset (auto-enables dependencies)
assetRegistry.enable('robotic-mowers');

// Disable asset (auto-disables dependents)
assetRegistry.disable('grass-blades');

// Toggle state
const newState = assetRegistry.toggle('weather-particles');
```

#### Dependency Methods

```typescript
// Get direct dependencies
const deps = assetRegistry.getDependencies('robotic-mowers');
// -> [{ id: 'grass-blades', ... }]

// Get dependents
const dependents = assetRegistry.getDependents('grass-blades');
// -> [{ id: 'robotic-mowers', ... }, { id: 'grass-physics', ... }]

// Get full dependency tree
const tree = assetRegistry.getDependencyTree('robotic-mowers');
// -> ['grass-blades']

// Validate dependencies
const valid = assetRegistry.validateDependencies('robotic-mowers');
// -> true

// Check for circular dependencies
const cycles = assetRegistry.getCircularDependencies();
// -> [] (empty if none found)
```

#### Performance Methods

```typescript
// Get total cost
const cost = assetRegistry.getTotalCost();
// -> 42

// Get cost by type
const costs = assetRegistry.getCostByType();
// -> { court: 15, grass: 18, lighting: 9, ... }

// Get budget status
const budget = assetRegistry.getBudgetStatus(100);
// -> {
//      current: 42,
//      max: 100,
//      percentage: 42,
//      remaining: 58,
//      status: 'ok'
//    }
```

#### Statistics Methods

```typescript
// Get stats
const stats = assetRegistry.getStats();
// -> {
//      total: 33,
//      enabled: 24,
//      disabled: 9,
//      byType: { court: 7, grass: 4, ... },
//      totalCost: 42,
//      averageCost: 1.75
//    }

// Export full state
const state = assetRegistry.export();
// -> {
//      timestamp: 1234567890,
//      assets: [...],
//      stats: {...},
//      budget: {...}
//    }
```

#### Management Methods

```typescript
// Register new asset
assetRegistry.register({
  id: 'new-asset',
  name: 'New Asset',
  type: 'effects',
  description: 'Custom effect',
  performanceCost: 5,
  dependencies: [],
  defaultEnabled: false
});

// Unregister asset
assetRegistry.unregister('new-asset');

// Reset to defaults
assetRegistry.reset();

// Clear all (use with caution!)
assetRegistry.clear();
```

## Performance Cost Scale

| Range | Level | Examples |
|-------|-------|----------|
| 1-2 | Minimal | Simple meshes, static lighting |
| 3-4 | Low | Textured meshes, basic shaders |
| 5-6 | Medium | Animated objects, particle systems |
| 7-8 | High | Complex physics, advanced shaders |
| 9-10 | Very High | Volumetric effects, real-time GI |

## Dependency Rules

### Automatic Propagation

**Enabling an asset:**
1. Checks for circular dependencies
2. Enables all dependencies first (recursively)
3. Enables the target asset
4. Returns success/failure

**Disabling an asset:**
1. Disables all dependents first (recursively)
2. Disables the target asset

### Example Dependency Chain

```typescript
// robotic-mowers depends on grass-blades

assetRegistry.disable('grass-blades');
// 1. Disables robotic-mowers (dependent)
// 2. Disables grass-physics (dependent)
// 3. Disables growth-visualization (dependent)
// 4. Disables grass-blades

assetRegistry.enable('robotic-mowers');
// 1. Enables grass-blades (dependency)
// 2. Enables robotic-mowers
```

## Browser Console Access

The registry is exposed globally for debugging:

```javascript
// Access registry
window.assetRegistry

// Quick utilities
window.debug.stats()
window.debug.budget()
window.debug.enabled()
window.debug.disabled()
window.debug.validateCircular()
```

## Usage in Components

```typescript
import { assetRegistry } from '@/utils/debug';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [enabled, setEnabled] = useState(
    assetRegistry.isEnabled('grass-blades')
  );

  const handleToggle = () => {
    const newState = assetRegistry.toggle('grass-blades');
    setEnabled(newState);
  };

  return (
    <div>
      <p>Grass: {enabled ? 'ON' : 'OFF'}</p>
      <button onClick={handleToggle}>Toggle</button>
    </div>
  );
}
```

## Performance Budget Management

```typescript
// Set budget warning thresholds
const budget = assetRegistry.getBudgetStatus(100);

if (budget.status === 'critical') {
  // Over 90% of budget
  console.error('Performance budget exceeded!');
} else if (budget.status === 'warning') {
  // Over 75% of budget
  console.warn('Approaching performance limit');
}

// Disable expensive assets to free budget
assetRegistry.disable('volumetric-clouds');
assetRegistry.disable('motion-blur');
```

## Validation

```typescript
// Check for issues
const cycles = assetRegistry.getCircularDependencies();
if (cycles.length > 0) {
  console.error('Circular dependencies:', cycles);
}

// Validate all dependencies exist
for (const asset of assetRegistry.getAll()) {
  if (!assetRegistry.validateDependencies(asset.id)) {
    console.error(`Invalid dependencies for ${asset.id}`);
  }
}
```

## Thread Safety

The AssetRegistry is implemented as a singleton with thread-safe operations:
- Single instance accessed via `AssetRegistry.getInstance()`
- All state mutations are synchronous
- No race conditions in enable/disable operations

## Best Practices

1. **Always check enabled state** before rendering expensive components
2. **Use dependencies** to enforce rendering requirements
3. **Monitor performance budget** to prevent slowdowns
4. **Validate on startup** to catch configuration errors early
5. **Reset to defaults** when testing different scenarios

## Future Enhancements

- [ ] Asset preloading hints
- [ ] Runtime performance measurement integration
- [ ] Automatic quality scaling based on budget
- [ ] Asset group presets (low/medium/high quality)
- [ ] Historical state tracking
- [ ] Integration with PerformanceTracker
