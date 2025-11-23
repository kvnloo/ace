# Grass Rendering Implementation

## Overview
Restored realistic grass rendering to all grass courts (courts 12-17) using an optimized instanced mesh approach for performance.

## Implementation Details

### Grass Component (`/components/Grass.tsx`)

**Technology**: Instanced meshes with THREE.js
- **Performance**: Single draw call for thousands of grass blades
- **Visual Quality**: Realistic grass with color variation and animation
- **Optimization**: Default 1500 blades per court (configurable)

**Features**:
- Individual blade positioning with random distribution
- Height variation (0.8x to 1.2x base height)
- Color variation (85% to 100% of base color)
- Subtle wind animation with phase offsets
- Configurable blade count for performance tuning

**Props**:
```typescript
interface GrassProps {
  position: [number, number, number];  // 3D position
  size: [number, number];              // [width, depth]
  bladeCount?: number;                 // Default: 2000
  color?: string;                      // Default: '#4d7c0f'
  animated?: boolean;                  // Default: true
}
```

### Integration with ThreeScene

**Location**: Lines 434-443 in `ThreeScene.tsx`

**Courts Affected**:
- Courts 12-17 (indices where `i >= 12 && i < 18`)
- Row 3 of the ground floor (z = 12m)
- All 6 grass courts in the facility

**Positioning**:
- Y offset: 0.1m above court surface
- Covers full court dimensions (10m × 22m)
- Renders after base surface, before court lines

### Performance Considerations

**Optimizations**:
- Instanced rendering (single draw call)
- Reduced blade count (1500 vs original 2000+)
- Optional animation disable for static views
- Efficient wind calculation using phase offsets

**Rendering Cost**:
- ~1500 instances × 6 courts = 9000 total instances
- Uses vertex colors for variation (no texture lookups)
- Double-sided geometry for visibility from all angles

**Memory Impact**:
- Each blade: Transform matrix (16 floats) + Color (3 floats)
- Total per court: ~114KB instance data
- Total for 6 courts: ~684KB

### Visual Features

**Grass Appearance**:
- Base color: Dark green (#4d7c0f) matching court surface
- Blade geometry: Thin elongated quads (0.15m × 1m)
- Random rotation for natural distribution
- Color variation for realistic appearance

**Animation**:
- Wind sway frequency: ~2 Hz
- Amplitude: ±8% tilt
- Secondary motion: ±5% bend
- Staggered timing via phase offsets

### Configuration Options

**Performance Tuning**:
```typescript
// High quality (may impact FPS)
<Grass bladeCount={3000} animated={true} />

// Balanced (recommended)
<Grass bladeCount={1500} animated={true} />

// Performance mode
<Grass bladeCount={800} animated={false} />
```

**Visual Customization**:
```typescript
// Darker grass
<Grass color="#365314" />

// Lighter grass
<Grass color="#65a30d" />

// Larger area
<Grass size={[15, 30]} bladeCount={2500} />
```

## Testing

**Test Suite**: `/tests/grass-rendering.test.tsx`
- ✅ Basic rendering
- ✅ Custom blade count
- ✅ Custom color
- ✅ Default parameters

**Manual Verification**:
1. Navigate to ground floor view (G: Tennis)
2. Look for row 3 (GRASS label)
3. Verify grass blades visible on courts 12-17
4. Check wind animation is active
5. Verify performance (target: 60 FPS)

## Technical Notes

### Why Instanced Meshes?
Previous implementation may have used individual meshes or shader-based grass, which were removed for performance. Instanced meshes provide:
- Better performance than individual meshes
- More flexibility than pure shader approaches
- Easier to maintain than complex shader code
- Good balance of quality and performance

### Rendering Order
```
1. Court base plane (green #4d7c0f)
2. Grass blades (instanced mesh, y=0.1m)
3. Court lines (white, y=0.02m)
4. Net (y=1.0m)
```

### Future Enhancements
- LOD system (reduce blades at distance)
- Grass trampling effects
- Seasonal color variations
- Interaction with ball physics
- Shadow receiving optimization

## Troubleshooting

**Grass not visible**:
- Check court type is 'grass' (courts 12-17)
- Verify y-position is above base plane
- Ensure camera can see ground floor

**Performance issues**:
- Reduce bladeCount to 800-1000
- Disable animation: `animated={false}`
- Check other scene complexity

**Animation stuttering**:
- Reduce total blade count across all courts
- Profile with React DevTools
- Check for other animation conflicts

## Related Files
- `/components/Grass.tsx` - Grass component
- `/components/ThreeScene.tsx` - Integration (lines 434-443)
- `/tests/grass-rendering.test.tsx` - Unit tests
- `/components/ClayCourtEffect.tsx` - Similar enhancement for clay courts
