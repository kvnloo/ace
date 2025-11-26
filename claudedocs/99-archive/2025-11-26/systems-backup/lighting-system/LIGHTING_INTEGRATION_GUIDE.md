# Lighting System Integration Guide

## Quick Start

### 1. Basic Integration with ThreeScene

Replace the existing lighting in `/components/ThreeScene.tsx`:

```typescript
// BEFORE (lines ~1409-1418):
<ambientLight intensity={0.4} />
<directionalLight
    position={[-80, 150, 100]}
    intensity={2}
    castShadow
    shadow-mapSize={[2048, 2048]}
>
    <orthographicCamera attach="shadow-camera" args={[-150, 150, 150, -150]} />
</directionalLight>
<Environment preset="park" />

// AFTER:
import { LightingSystem } from './LightingSystem';

// Inside your Canvas:
<LightingSystem showControls={true} />
```

### 2. Remove Redundant Lighting

Remove or comment out these lines from `ThreeScene.tsx`:

```typescript
// Line 1409: <ambientLight intensity={0.4} />
// Lines 1410-1418: <directionalLight ... />
// Line 1419: <Environment preset="park" /> (optional - can keep for reflections)
```

### 3. Update Material Properties

Ensure all meshes in your scene have proper material properties for PBR lighting:

```typescript
// Courts, floors, buildings should use:
<meshStandardMaterial
  color="#yourColor"
  roughness={0.6}      // 0 = mirror, 1 = matte
  metalness={0.1}      // 0 = non-metal, 1 = metal
  receiveShadow={true} // Enable shadow receiving
/>
```

## Advanced Integration

### Syncing with Floor Selection

Adjust lighting based on active floor view:

```typescript
// In ThreeScene component
const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');

// Determine lighting config based on floor
const lightingConfig = useMemo(() => {
  if (activeFloor === 'ALL') {
    return {
      timeOfDay: 'day' as const,
      mode: 'sports' as const,
    };
  } else if (activeFloor === 0) {
    // Ground floor - show court lighting
    return {
      timeOfDay: 'day' as const,
      mode: 'sports' as const,
      courtLightsEnabled: true,
    };
  } else {
    // Upper floors - ambient lighting
    return {
      timeOfDay: 'day' as const,
      mode: 'maintenance' as const,
      ambientIntensity: 0.8,
    };
  }
}, [activeFloor]);

// Apply to LightingSystem
<LightingSystem
  showControls={true}
  initialConfig={lightingConfig}
/>
```

### Time-Based Automation

Auto-adjust lighting based on real time:

```typescript
import { useEffect, useState } from 'react';
import type { TimeOfDay } from './LightingSystem';

function useAutoTimeOfDay(): TimeOfDay {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 8) setTimeOfDay('dawn');
      else if (hour >= 8 && hour < 17) setTimeOfDay('day');
      else if (hour >= 17 && hour < 20) setTimeOfDay('dusk');
      else setTimeOfDay('night');
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return timeOfDay;
}

// Usage:
const autoTime = useAutoTimeOfDay();

<LightingSystem
  initialConfig={{ timeOfDay: autoTime }}
/>
```

### Custom Event Lighting

Create dramatic lighting for special events:

```typescript
// Tournament/Championship Mode
const championshipLighting = {
  timeOfDay: 'night' as const,
  mode: 'event' as const,
  floodlightsEnabled: true,
  courtLightsEnabled: true,
  bloomStrength: 2.0,
  fogDensity: 0.003,
  ambientIntensity: 0.3,
};

// Sunset Match Mode
const sunsetLighting = {
  timeOfDay: 'dusk' as const,
  mode: 'sports' as const,
  bloomStrength: 1.5,
  fogDensity: 0.002,
};

// Early Morning Practice
const morningLighting = {
  timeOfDay: 'dawn' as const,
  mode: 'maintenance' as const,
  courtLightsEnabled: true,
};

// Apply based on event type:
<LightingSystem initialConfig={championshipLighting} />
```

### Performance Optimization

For mobile or lower-end devices:

```typescript
import { useState, useEffect } from 'react';

function useDeviceQuality() {
  const [quality, setQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');

  useEffect(() => {
    // Detect device capabilities
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasGPU = (window.navigator as any).gpu !== undefined;
    const pixelRatio = window.devicePixelRatio || 1;

    if (isMobile) {
      setQuality('low');
    } else if (!hasGPU || pixelRatio < 2) {
      setQuality('medium');
    } else {
      setQuality('ultra');
    }
  }, []);

  return quality;
}

// Usage:
const deviceQuality = useDeviceQuality();

<LightingSystem
  initialConfig={{
    quality: deviceQuality,
    bloomStrength: deviceQuality === 'low' ? 0 : 0.5,
    fogDensity: deviceQuality === 'low' ? 0 : 0.001,
  }}
/>
```

### UI Position Adjustment

If the lighting controls overlap with existing UI:

```typescript
// Option 1: Disable controls and use your own UI
<LightingSystem showControls={false} />

// Create custom controls elsewhere:
const [config, setConfig] = useState(defaultConfig);

<YourCustomUI
  config={config}
  onChange={(newConfig) => setConfig(newConfig)}
/>

// Option 2: Adjust control panel position
// Edit LightingControlPanel component (line ~420):
// Change: className="absolute top-40 right-6..."
// To: className="absolute bottom-8 right-6..."
```

## Migration Checklist

### Pre-Integration
- [ ] Backup current ThreeScene.tsx
- [ ] Review existing lighting setup
- [ ] Check material properties on all meshes
- [ ] Test current scene performance

### Integration Steps
- [ ] Import LightingSystem component
- [ ] Add LightingSystem to Canvas
- [ ] Remove old lighting (ambient, directional)
- [ ] Update mesh materials for PBR
- [ ] Enable receiveShadow on floors/courts
- [ ] Test all time presets
- [ ] Test all lighting modes
- [ ] Verify performance metrics

### Post-Integration
- [ ] Adjust fog density for scene
- [ ] Tune bloom strength
- [ ] Set quality based on target devices
- [ ] Document custom configurations
- [ ] Update README with lighting info

## Example: Full Integration

```typescript
// ThreeScene.tsx (modified)
import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { LightingSystem } from './LightingSystem';
import type { LightingConfig } from './LightingSystem';

const ThreeScene: React.FC<ThreeSceneProps> = ({ onFeatureSelect }) => {
  const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
  const [lightingMode, setLightingMode] = useState<'auto' | 'manual'>('auto');

  // Auto-adjust lighting based on context
  const lightingConfig = useMemo((): Partial<LightingConfig> => {
    if (lightingMode === 'auto') {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;

      return {
        timeOfDay: isDaytime ? 'day' : 'night',
        mode: activeFloor === 0 ? 'sports' : 'maintenance',
        quality: 'high',
        floodlightsEnabled: !isDaytime,
        courtLightsEnabled: true,
      };
    }
    return {}; // Manual mode - use UI controls
  }, [activeFloor, lightingMode]);

  return (
    <div className="w-full h-full absolute inset-0">
      {/* Existing UI controls */}
      <ControlsOverlay
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        // ... other props
      />

      {/* Lighting mode toggle */}
      <div className="absolute top-8 right-8 z-10">
        <button
          onClick={() => setLightingMode(m => m === 'auto' ? 'manual' : 'auto')}
          className="px-4 py-2 bg-slate-900/90 text-white rounded-lg"
        >
          {lightingMode === 'auto' ? '🤖 Auto' : '👤 Manual'}
        </button>
      </div>

      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[180, 100, 180]} fov={35} />

        {/* NEW: Advanced Lighting System */}
        <LightingSystem
          showControls={lightingMode === 'manual'}
          initialConfig={lightingConfig}
        />

        {/* Scene content */}
        <group>
          <BuildingShell activeFloor={activeFloor} />
          <CampusGrounds />

          {/* Floors with proper materials */}
          {(activeFloor === 'ALL' || activeFloor === 0) && (
            <GroundFloor
              active={activeFloor === 0}
              showMeasurements={showMeasurements}
              showLabels={showLabels}
            />
          )}
          {/* ... other floors */}

          {/* Contact shadows for grounding */}
          <ContactShadows
            position={[0, -0.2, 0]}
            opacity={0.4}
            scale={400}
            blur={3}
            far={20}
            color="#000"
          />
        </group>

        <OrbitControls
          enablePan
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={400}
          makeDefault
        />
      </Canvas>
    </div>
  );
};
```

## Troubleshooting Integration Issues

### Issue: Scene is too dark

**Solution:**
```typescript
<LightingSystem
  initialConfig={{
    ambientIntensity: 0.8,  // Increase from default 0.5
    bloomStrength: 1.0,     // Add bloom glow
  }}
/>
```

### Issue: Shadows not appearing

**Check:**
1. Canvas has `shadows` prop: `<Canvas shadows>`
2. Meshes have `receiveShadow`: `<mesh receiveShadow>`
3. Quality not set to 'low': `quality: 'medium'` or higher
4. Shadow camera bounds include your scene

**Fix:**
```typescript
// Ensure proper shadow setup
<Canvas
  shadows
  gl={{ shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } }}
>
```

### Issue: Performance drops

**Solution:**
```typescript
<LightingSystem
  initialConfig={{
    quality: 'medium',      // Reduce from 'high'
    floodlightsEnabled: false,  // Disable if not needed
    bloomStrength: 0,       // Disable bloom
    fogDensity: 0,          // Disable fog
  }}
/>
```

### Issue: Lighting controls overlap UI

**Solutions:**

1. **Disable controls:**
```typescript
<LightingSystem showControls={false} />
```

2. **Move controls:** Edit `LightingControlPanel` position
3. **Create custom controls:** Build your own UI with state management

### Issue: Colors look washed out

**Solution:**
```typescript
// Adjust tone mapping in LightingSystem component
// Or override in your scene:
<EffectComposer>
  <ToneMapping
    adaptive
    middleGrey={0.4}  // Lower for more contrast
    maxLuminance={8.0}  // Lower for less brightness
  />
</EffectComposer>
```

## Best Practices

### 1. Material Setup
```typescript
// Good - PBR-ready materials
<meshStandardMaterial
  color="#3b82f6"
  roughness={0.6}
  metalness={0.1}
/>

// Avoid - MeshBasicMaterial ignores lighting
<meshBasicMaterial color="#3b82f6" />
```

### 2. Shadow Optimization
```typescript
// Cast shadows only on important objects
<mesh castShadow={isImportant} receiveShadow>
  <geometryType />
  <meshStandardMaterial />
</mesh>
```

### 3. Quality Tiers
```typescript
const qualityPresets = {
  mobile: { quality: 'low', bloom: 0, fog: 0 },
  desktop: { quality: 'high', bloom: 0.5, fog: 0.001 },
  highEnd: { quality: 'ultra', bloom: 1.5, fog: 0.002 },
};
```

### 4. Conditional Rendering
```typescript
// Only render expensive effects when needed
{showDramaticLighting && (
  <LightingSystem
    initialConfig={{
      mode: 'event',
      bloomStrength: 2.0,
    }}
  />
)}
```

## Testing Integration

### Visual Tests
1. Test all 4 time presets (dawn, day, dusk, night)
2. Test all 4 modes (natural, sports, event, maintenance)
3. Verify shadows appear correctly
4. Check bloom doesn't blow out colors
5. Ensure fog doesn't obscure important features

### Performance Tests
```typescript
// Monitor FPS
useFrame(() => {
  const fps = 1 / clock.getDelta();
  if (fps < 30) console.warn('Low FPS:', fps);
});

// Check render time
const startTime = performance.now();
// ... render
const renderTime = performance.now() - startTime;
console.log('Render time:', renderTime, 'ms');
```

### Compatibility Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Next Steps

After successful integration:

1. **Customize presets** - Adjust colors/intensities for your brand
2. **Create scenes** - Build preset configurations for different scenarios
3. **Add transitions** - Animate between lighting states
4. **Optimize further** - Profile and optimize for your target devices
5. **Document** - Update your project README with lighting features

## Support

For issues or questions:
- Check `/docs/LIGHTING_SYSTEM.md` for full documentation
- Review `/tests/LightingSystem.test.tsx` for usage examples
- See `/components/LightingDemo.tsx` for standalone demo
