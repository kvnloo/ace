# Lighting System Quick Reference Card

## Import & Setup

```typescript
import { LightingSystem } from './components/LightingSystem';

<Canvas shadows>
  <LightingSystem />
</Canvas>
```

## Common Configurations

### Championship Night
```typescript
{ timeOfDay: 'night', mode: 'event', bloomStrength: 2.0 }
```

### Sunny Practice
```typescript
{ timeOfDay: 'day', mode: 'sports', quality: 'high' }
```

### Sunset Ambiance
```typescript
{ timeOfDay: 'dusk', mode: 'sports', fogDensity: 0.002 }
```

### Maintenance Check
```typescript
{ timeOfDay: 'day', mode: 'maintenance', courtLightsEnabled: true }
```

### Mobile Performance
```typescript
{ quality: 'low', bloomStrength: 0, fogDensity: 0 }
```

## Light Counts

| Type | Count | Purpose |
|------|-------|---------|
| Directional | 1 | Sun/Moon |
| Hemisphere | 1 | Ambient sky |
| Spot (Flood) | 16 | Stadium perimeter |
| Spot (Court) | 96 | Individual courts |
| Point (Ambient) | 32 | Facility lighting |
| **TOTAL** | **146** | |

## Time Presets

| Time | Sky | Sun | Fog | Shadow |
|------|-----|-----|-----|--------|
| Dawn | Orange | 1.2 | 0.002 | 0.3 |
| Day | Blue | 2.5 | 0.0008 | 0.5 |
| Dusk | Red | 1.0 | 0.0015 | 0.4 |
| Night | Dark | 0.3 | 0.001 | 0.7 |

## Modes

| Mode | Flood | Court | Ambient | Bloom | Use Case |
|------|-------|-------|---------|-------|----------|
| Natural | ❌ | ❌ | ❌ | 0 | Arch viz |
| Sports | 🌙 | ✅ | ⚡ | 0.5 | Default |
| Event | ✅ | ✅ | ⚡ | 2.0 | Tournament |
| Maintenance | ❌ | ✅ | ✅ | 0 | Inspection |

Legend: ✅ Always on | 🌙 Night only | ⚡ Moderate | ❌ Disabled

## Quality Levels

| Quality | Shadow Map | Bloom | FPS Target | Device |
|---------|------------|-------|------------|--------|
| Low | 256×256 | No | 30+ | Mobile |
| Medium | 512×512 | Basic | 60 | Web |
| High | 1024×1024 | Full | 60+ | Desktop |
| Ultra | 2048×2048 | Max | Uncapped | High-end |

## Props Quick Ref

```typescript
interface LightingSystemProps {
  showControls?: boolean;
  initialConfig?: {
    timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
    mode?: 'natural' | 'sports' | 'event' | 'maintenance';
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    floodlightsEnabled?: boolean;
    courtLightsEnabled?: boolean;
    ambientIntensity?: number;  // 0-1
    fogDensity?: number;         // 0-0.005
    bloomStrength?: number;      // 0-2
  };
}
```

## Slider Ranges

| Control | Min | Max | Step | Default |
|---------|-----|-----|------|---------|
| Fog Density | 0 | 0.005 | 0.0001 | 0.001 |
| Bloom Strength | 0 | 2 | 0.1 | 0.5 |
| Ambient Intensity | 0 | 1 | 0.1 | 0.5 |

## Troubleshooting Matrix

| Problem | Solution |
|---------|----------|
| Too dark | `ambientIntensity: 0.8` |
| No shadows | `<Canvas shadows>` + `quality: 'medium'` |
| Low FPS | `quality: 'low'`, disable bloom/fog |
| Washed out | Lower `bloomStrength` |
| Harsh shadows | Use `dusk` or `dawn` time |

## Performance Targets

| Metric | Low | Medium | High | Ultra |
|--------|-----|--------|------|-------|
| FPS | 30+ | 60 | 60+ | Uncapped |
| Shadow Mem | 2MB | 8MB | 16MB | 20MB |
| Update Time | <10ms | <8ms | <5ms | <5ms |
| Render Time | <33ms | <16ms | <16ms | <8ms |

## Light Positions (Key)

**Floodlights:**
- North: 5 @ (X, 25, -55)
- South: 5 @ (X, 25, 55)
- East: 3 @ (65, 25, Z)
- West: 3 @ (-65, 25, Z)

**Court Lights:**
- 4 per court @ 12m height
- 24 courts × 4 = 96 lights

**Ambient:**
- Reception: (0, 8, 48)
- Levels 1-3: 8 per floor

## Material Requirements

```typescript
<meshStandardMaterial
  color="#yourColor"
  roughness={0.6}    // Required for PBR
  metalness={0.1}    // 0=non-metal, 1=metal
/>

<mesh receiveShadow>  // For floors
<mesh castShadow>     // For objects (selective)
```

## Integration Checklist

- [ ] Import LightingSystem
- [ ] Add to Canvas with `shadows`
- [ ] Remove old lights (ambient, directional)
- [ ] Update materials to meshStandardMaterial
- [ ] Enable receiveShadow on floors
- [ ] Test all time presets
- [ ] Test all modes
- [ ] Check performance
- [ ] Set quality for target device

## Files

| File | Purpose |
|------|---------|
| `/components/LightingSystem.tsx` | Main component |
| `/components/LightingDemo.tsx` | Standalone demo |
| `/docs/LIGHTING_SYSTEM.md` | Full documentation |
| `/docs/LIGHTING_INTEGRATION_GUIDE.md` | Integration steps |
| `/docs/LIGHTING_VISUAL_REFERENCE.md` | Diagrams |
| `/tests/LightingSystem.test.tsx` | Unit tests |

## Commands

```bash
# Run tests
npm test tests/LightingSystem.test.tsx

# Type check
npm run type-check

# Build
npm run build
```

## Key Metrics

- **Total Lights**: 146 dynamic lights
- **Shadow Maps**: 17 maps, ~20MB memory
- **Post-Processing**: Bloom + Tone Mapping
- **Fog**: Exponential (THREE.FogExp2)
- **Performance**: 60 FPS @ 1080p (high quality)

## Common Use Cases

**Match Day (Day)**
```typescript
<LightingSystem initialConfig={{
  timeOfDay: 'day', mode: 'sports'
}} />
```

**Evening Match**
```typescript
<LightingSystem initialConfig={{
  timeOfDay: 'night', mode: 'sports',
  floodlightsEnabled: true
}} />
```

**Tournament Final**
```typescript
<LightingSystem initialConfig={{
  timeOfDay: 'night', mode: 'event',
  bloomStrength: 2.0, fogDensity: 0.003
}} />
```

**Facility Tour**
```typescript
<LightingSystem initialConfig={{
  timeOfDay: 'day', mode: 'maintenance',
  quality: 'ultra'
}} />
```

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile | iOS 14+ | ⚠️ Low/Medium |

## Tips

1. **Start with medium quality** - Optimize later
2. **Use event mode sparingly** - High performance cost
3. **Disable shadows on small objects** - Big performance gain
4. **Match lighting to scene purpose** - Day for arch, night for drama
5. **Test on target devices** - Mobile requires low/medium
6. **Cache light positions** - useMemo for performance
7. **Disable bloom on mobile** - Significant FPS boost
8. **Use fog sparingly** - Adds depth but costs FPS

---

**Last Updated**: 2025-11-22
**Version**: 1.0.0
**Status**: Production Ready ✅
