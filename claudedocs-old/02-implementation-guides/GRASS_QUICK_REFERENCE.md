# Grass Component - Quick Reference

## Usage

```typescript
import Grass from './Grass';

<Grass
  position={[x, y, z]}
  size={[width, depth]}
  bladeCount={1500}     // Optional, default: 2000
  color="#4d7c0f"       // Optional, default: '#4d7c0f'
  animated={true}       // Optional, default: true
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `[number, number, number]` | Required | 3D position [x, y, z] |
| `size` | `[number, number]` | Required | Area size [width, depth] |
| `bladeCount` | `number` | `2000` | Number of grass blades |
| `color` | `string` | `'#4d7c0f'` | Base grass color |
| `animated` | `boolean` | `true` | Enable wind animation |

## Current Implementation

### Grass Courts (12-17)
```typescript
{type === 'grass' && (
  <Grass
    position={[0, 0.1, 0]}
    size={[10, 22]}
    bladeCount={1500}
    color="#4d7c0f"
    animated={true}
  />
)}
```

### Court Positions
- Court 12: `[-35, 0.1, 12]`
- Court 13: `[-21, 0.1, 12]`
- Court 14: `[-7, 0.1, 12]`
- Court 15: `[7, 0.1, 12]`
- Court 16: `[21, 0.1, 12]`
- Court 17: `[35, 0.1, 12]`

## Performance Presets

### High Quality
```typescript
<Grass bladeCount={3000} animated={true} />
// Use for: Marketing, screenshots, demos
// Impact: May drop below 60 FPS on low-end devices
```

### Balanced (Current)
```typescript
<Grass bladeCount={1500} animated={true} />
// Use for: Production, general use
// Impact: Maintains 60 FPS on most devices
```

### Performance
```typescript
<Grass bladeCount={800} animated={false} />
// Use for: Mobile, low-end devices, many courts
// Impact: Minimal performance impact
```

## Visual Customization

### Color Variations
```typescript
// Darker grass (forest green)
<Grass color="#365314" />

// Default grass (dark green)
<Grass color="#4d7c0f" />

// Lighter grass (lime green)
<Grass color="#65a30d" />

// Spring grass (bright green)
<Grass color="#84cc16" />
```

### Size Adjustments
```typescript
// Tennis court (current)
<Grass size={[10, 22]} />

// Larger field
<Grass size={[20, 40]} bladeCount={3000} />

// Smaller patch
<Grass size={[5, 5]} bladeCount={500} />
```

## Troubleshooting

### Grass Not Visible
1. Check y-position is above base surface
2. Verify court type is 'grass'
3. Ensure camera can see the area
4. Check bladeCount > 0

### Performance Issues
1. Reduce bladeCount: `bladeCount={800}`
2. Disable animation: `animated={false}`
3. Check total scene complexity
4. Profile with browser DevTools

### Animation Stuttering
1. Reduce total blade count across all courts
2. Check for other heavy animations
3. Verify 60 FPS baseline without grass
4. Consider static grass: `animated={false}`

## Technical Details

### Rendering Method
- Instanced mesh (single draw call)
- Blade geometry: Quad (0.15m × 1m)
- Material: MeshStandardMaterial with vertex colors
- Double-sided rendering

### Memory Usage
- Per blade: ~19 floats (76 bytes)
- 1500 blades: ~114KB
- 6 courts: ~684KB total

### Animation System
- Wind frequency: ~2 Hz
- Sway amplitude: ±8%
- Bend amplitude: ±5%
- Phase-based timing (natural variation)

## Examples

### Basic Usage
```typescript
// Minimal configuration
<Grass position={[0, 0, 0]} size={[10, 10]} />
```

### Full Configuration
```typescript
// All options specified
<Grass
  position={[0, 0.1, 0]}
  size={[10, 22]}
  bladeCount={1500}
  color="#4d7c0f"
  animated={true}
/>
```

### Multiple Grass Areas
```typescript
// Different grass patches
<>
  <Grass position={[-10, 0, 0]} size={[8, 8]} bladeCount={1000} />
  <Grass position={[10, 0, 0]} size={[8, 8]} bladeCount={1000} />
  <Grass position={[0, 0, 15]} size={[12, 12]} bladeCount={1500} />
</>
```

## Related Documentation
- `/claudedocs/GRASS_IMPLEMENTATION.md` - Technical details
- `/claudedocs/COURT_LAYOUT.md` - Court positioning
- `/claudedocs/GRASS_RESTORATION_SUMMARY.md` - Implementation summary
- `/tests/grass-rendering.test.tsx` - Test suite
