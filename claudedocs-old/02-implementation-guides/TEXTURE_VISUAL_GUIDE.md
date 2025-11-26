# Court Texture Visual Guide

## Quick Reference

### Before vs After

**BEFORE** (Flat Colors Only):
- Wood courts: Solid brown (#d4a373) - no detail
- Hard courts: Solid blue (#3b82f6) - no detail
- All courts: Flat, unrealistic appearance

**AFTER** (Realistic Textures):
- Wood courts: Grain patterns, plank divisions, depth
- Hard courts: Concrete aggregate, cracks, professional appearance
- Enhanced: Normal maps add 3D relief without extra geometry

## Court Surface Details

### Wood Courts (Courts 18-23)

**Visual Features**:
```
┌─────────────────────────────────┐
│ ═══ ═══ ═══ ═══ ═══ ═══ ═══ ═══ │  ← Horizontal grain lines
│ ═══ ═══ ═══ ═══ ═══ ═══ ═══ ═══ │    (with natural waviness)
│ ║   ║   ║   ║   ║   ║   ║   ║   │  ← Vertical plank separations
│ ═══ ═══ ═══ ═══ ═══ ═══ ═══ ═══ │
│ ═══ ═══ ═══ ═══ ═══ ═══ ═══ ═══ │
└─────────────────────────────────┘

Color: Warm brown (#8B6F47)
Finish: Semi-gloss (roughness 0.3)
Texture: 40 grain lines, 8 planks
Normal: Raised grain with depth
```

**Close-up Details**:
- Individual wood grain lines visible
- Plank boundaries create natural divisions
- Subtle color variation from noise
- Normal mapping creates shadow/highlight on grain

**Distance View**:
- Repeating plank pattern (4x8 UV repeat)
- Cohesive wood floor appearance
- Reflects light appropriately for indoor court

### Hard/Concrete Courts (Courts 0-5)

**Visual Features**:
```
┌─────────────────────────────────┐
│ ∴∵∴∵∴ ╱ ∴∵∴∵∴ ∵∴∵∴∵ ╲ ∴∵∴∵∴   │  ← Aggregate particles
│ ∵∴∵∴  ╱  ∴∵∴∵∴ ∴∵∴∵  ╲  ∵∴∵   │    and crack patterns
│ ∴∵∴∵ ╱   ∵∴∵∴∵ ∵∴∵∴   ╲ ∴∵∴   │
│ ∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵   │  ← 3000 aggregate dots
│ ∴∵∴∵∴∵∴∵∴ ╱ ∵∴∵∴∵∴∵ ╲ ∴∵∴∵∴   │    15 crack patterns
└─────────────────────────────────┘

Color: Blue-tinted (#4A7BA7)
Finish: Matte (roughness 0.7)
Texture: Aggregate + cracks
Normal: Bumpy concrete surface
```

**Close-up Details**:
- Small aggregate particles (3000 total)
- Random size and brightness variation
- Irregular crack patterns showing wear
- Authentic concrete/hard court appearance

**Distance View**:
- Professional blue hard court color
- Texture adds realism without overwhelming
- Appropriate for outdoor tournament appearance

### Grass Courts (Courts 12-17)

**Visual Features**:
```
┌─────────────────────────────────┐
│ 🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿   │  ← Individual grass blades
│ 🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿   │    (1500 per court)
│ 🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿   │
│ 🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿   │  ← Animated movement
│ 🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿   │    (wind effect)
└─────────────────────────────────┘

Color: Deep green (#4d7c0f)
Finish: Matte (roughness 0.85)
Special: Uses Grass component
Effect: 1500 individual blades with animation
```

**Details**:
- Advanced grass rendering system
- Individual blade geometry
- Wind animation for realism
- Natural grass appearance

### Clay Courts (Courts 6-11)

**Visual Features**:
```
┌─────────────────────────────────┐
│ ▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒   │  ← Granular texture
│ ▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░   │    and particle effects
│ ░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓   │
│ ▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒   │  ← Clay dust simulation
│ ▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░▓▓▒▒░░   │
└─────────────────────────────────┘

Color: Orange-red (#ea580c)
Finish: Matte (roughness 0.9)
Special: Uses ClayCourtEffect component
Effect: Advanced shader-based clay appearance
```

**Details**:
- Specialized clay rendering component
- Granular texture simulation
- Realistic European clay court appearance

## Texture Quality Comparison

### Resolution & Detail

| Court Type | Texture Size | UV Repeat | Visual Detail | Performance |
|------------|-------------|-----------|---------------|-------------|
| Wood       | 512x512     | 4x8       | High (grain+planks) | Excellent |
| Hard       | 512x512     | 2x2       | High (aggregate+cracks) | Excellent |
| Grass      | Component   | N/A       | Very High (1500 blades) | Good |
| Clay       | Component   | N/A       | High (shader effects) | Good |

### Normal Mapping Impact

**Without Normal Maps**:
- Flat surface appearance
- No depth perception
- Basic lighting response

**With Normal Maps**:
- 3D surface relief
- Realistic depth without geometry
- Enhanced lighting/shadows
- Professional quality appearance

## Viewing Distance Recommendations

### Close-Up View (< 20 units)
- **Wood**: Individual grain lines and planks clearly visible
- **Hard**: Aggregate particles and crack patterns apparent
- **Grass**: Individual blades and animation visible
- **Clay**: Granular texture detail visible

### Medium View (20-50 units)
- **Wood**: Cohesive wood floor pattern, plank divisions clear
- **Hard**: Professional hard court appearance with subtle detail
- **Grass**: Dense grass field with natural movement
- **Clay**: Unified clay surface with texture variation

### Far View (> 50 units)
- **Wood**: Warm brown wood floor appearance
- **Hard**: Blue professional hard court
- **Grass**: Green grass lawn
- **Clay**: Orange-red clay court

All maintain appropriate color and material properties at all distances.

## Lighting Interaction

### Wood Courts
- **Reflections**: Subtle semi-gloss reflections (roughness 0.3)
- **Highlights**: Grain patterns catch light direction
- **Shadows**: Normal map creates micro-shadows on grain

### Hard Courts
- **Reflections**: Minimal, matte appearance (roughness 0.7)
- **Highlights**: Aggregate creates subtle variation
- **Shadows**: Bumpy normal map adds surface complexity

### Grass Courts
- **Reflections**: Natural matte grass (roughness 0.85)
- **Highlights**: Individual blades catch light
- **Shadows**: Blade geometry creates realistic shadows

### Clay Courts
- **Reflections**: Very matte, dusty appearance (roughness 0.9)
- **Highlights**: Minimal, authentic clay surface
- **Shadows**: Granular texture creates subtle variation

## Technical Quality Metrics

### Texture Sharpness
- Wood: ★★★★★ (Clear grain patterns at all zoom levels)
- Hard: ★★★★☆ (Good detail, could be higher res for extreme zoom)
- Grass: ★★★★★ (Geometric detail is infinite resolution)
- Clay: ★★★★☆ (Shader-based, scales well)

### Realism
- Wood: ★★★★★ (Authentic wood floor appearance)
- Hard: ★★★★★ (Professional hard court quality)
- Grass: ★★★★★ (Advanced grass rendering)
- Clay: ★★★★★ (Realistic European clay)

### Performance Impact
- Wood: ★★★★★ (Negligible, cached texture)
- Hard: ★★★★★ (Negligible, cached texture)
- Grass: ★★★☆☆ (1500 blades = moderate geometry cost)
- Clay: ★★★★☆ (Shader complexity, good overall)

## Visual Examples (Text Representation)

### Wood Court Grain Pattern
```
════════════════════════════════════
────────────────────────────────────
════════════════════════════════════
────────────────────────────────────
║       ║       ║       ║       ║
(Horizontal grain with vertical planks)
```

### Hard Court Aggregate
```
∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴
∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵
∴∵∴∵∴∵∴∵∴∵╱╲∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵∴∵
(Random particles with crack patterns)
```

### Grass Court Blades
```
🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿
🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿🌿
(Individual animated grass blades)
```

## Optimization Notes

### Why 512x512 Resolution?
- **Quality**: Sufficient detail for 10x22m court surfaces
- **Performance**: Small enough to load/render quickly
- **Memory**: ~1MB per texture, well within limits
- **UV Repeat**: Tiling creates larger effective resolution

### Why Procedural Generation?
- **No Dependencies**: No external texture file loading
- **Consistent**: Works offline, no network required
- **Flexible**: Easy to modify parameters
- **Fast**: Generated once, cached forever

### Why Canvas Instead of WebGL?
- **Simplicity**: Easier to understand and modify
- **Compatibility**: Works on all browsers
- **One-Time**: Generated at startup, not per-frame
- **Sufficient**: Quality is excellent for this use case

## Future Potential

### Enhanced Wood Texture
- Knots and wood imperfections
- Variable plank widths
- Wear patterns in high-traffic areas
- Seasonal color variation

### Enhanced Hard Court Texture
- More detailed crack networks
- Paint wear patterns
- Line paint detail
- Surface weathering

### Next-Generation Features
- PBR material workflow
- Physically-based roughness maps
- Ambient occlusion baking
- Detail texture for extreme zoom
- Dynamic dirt/wear simulation

## Conclusion

The texture system successfully transforms flat-color courts into realistic, professional-quality surfaces:

✅ Wood courts: Authentic wood floor with grain and planks
✅ Hard courts: Professional concrete with aggregate and wear
✅ Grass courts: Advanced blade rendering with animation
✅ Clay courts: Realistic granular clay appearance

All while maintaining excellent performance and visual quality at all viewing distances.
