# Clay Court Enhancement Implementation

## Overview
Enhanced clay tennis courts with realistic texture and particle effects to differentiate from other court types.

## Implementation Details

### Components Created
- **ClayCourtEffect.tsx** - Standalone component for clay court rendering with texture and particles

### Features Implemented

#### 1. Realistic Clay Texture
- **Procedural Texture Generation**: Canvas-based texture with noise for authentic clay appearance
- **Color Variation**: Base orange clay (#ea580c) with randomized pixel variations
- **Dirt Patches**: Radial gradients for subtle dirt accumulation patterns
- **Tiling**: 4x4 repeat pattern for seamless appearance

#### 2. Surface Detail
- **Normal Mapping**: Procedurally generated bumps for surface depth
- **Roughness Mapping**: High roughness (0.95) with variation for realistic light scattering
- **No Metalness**: Matte finish appropriate for clay material

#### 3. Particle System
- **Count**: 150 particles (performance-optimized)
- **Behavior**: Subtle upward drift simulating dust
- **Reset Logic**: Particles regenerate when exceeding bounds
- **Rendering**: Additive blending for realistic dust appearance
- **Opacity**: Low (0.3) for subtle effect

### Performance Considerations
- Particle count limited to 150 for 60fps performance
- Texture generation cached using useMemo
- Canvas textures are 256-512px (balance quality/memory)
- BufferGeometry for efficient particle rendering
- Additive blending with depthWrite: false

### Integration
Modified `ThreeScene.tsx`:
- Import ClayCourtEffect component
- Conditional rendering in TennisCourt component
- Clay courts (indices 6-11) automatically use enhanced component
- Outdoor plaza clay court also enhanced

### Court Distribution
- **Courts 0-5**: Hard courts (blue)
- **Courts 6-11**: Clay courts (enhanced with texture/particles)
- **Courts 12-17**: Grass courts
- **Courts 18-23**: Wood courts

## Visual Differences from Other Courts
1. **Hard Courts**: Flat blue surface, low roughness
2. **Clay Courts**: Textured orange with particles, high roughness
3. **Grass Courts**: Green with grass component
4. **Wood Courts**: Brown with low roughness (polished)

## Future Enhancements
- Add scuff marks from ball impacts
- Implement wind-affected particle movement
- Increase particle density for action sequences
- Add moisture variation for wet clay appearance
