# Core Architecture Documentation

This document consolidates the core architectural decisions and specifications for the ACE tennis facility visualization system.

## Court Layout

The facility uses a standardized tennis court layout based on ITF (International Tennis Federation) specifications.

### Court Dimensions
- **Total court size**: 36.6m × 18.3m (120ft × 60ft)
- **Playing area**: 23.77m × 10.97m (78ft × 36ft)
- **Service boxes**: 6.40m × 4.11m (21ft × 13.5ft)
- **Net height**: 0.914m (3ft) at center, 1.07m (3.5ft) at posts

### Court Positions & Labels
All courts are positioned in a grid layout with consistent spacing:
- Courts are numbered sequentially
- Each court has distinct surface type (grass, clay, hard court)
- Labels are positioned above courts in 3D space for visibility

### 3D Rendering Architecture

The 3D visualization uses Three.js with the following key components:

**Core Systems:**
- Scene management (ThreeScene.tsx)
- Camera controls (OrbitControls)
- Lighting system (dynamic day/night cycle)
- Instanced rendering for performance

**Performance Optimizations:**
- Instance batching for repeated elements (courts, grass blades)
- Level-of-detail (LOD) system
- Frustum culling
- Texture atlasing

**Coordinate System:**
- Y-axis: vertical (up)
- X-axis: horizontal (left-right)
- Z-axis: depth (forward-back)
- Origin at facility center

## Material System

### Grass Rendering
- Adaptive grass density based on camera distance
- Wind animation using vertex shaders
- Multiple LOD levels for performance
- Texture-based variation for realism

### Court Surfaces
**Clay Courts:**
- Reddish-brown color (#C76448)
- Rough texture with particle effects
- Moisture variation support

**Grass Courts:**
- Natural green tones
- Striped mowing patterns
- Seasonal color variation

**Hard Courts:**
- Acrylic surface appearance
- Line markings in white
- Consistent color (typically blue or green)

## Component Integration

### Loading System
Progressive loading architecture:
1. Essential geometry (courts, buildings)
2. Textures and materials
3. Environmental elements (grass, trees)
4. Interactive features (overlays, controls)

### State Management
- React Context for global state
- Local component state for UI interactions
- Three.js scene graph for 3D object hierarchy

### Performance Monitoring
Real-time tracking of:
- FPS (frames per second)
- Memory usage
- Asset loading progress
- Render statistics

## References
- Court specifications based on ITF standards
- Three.js rendering follows WebGL best practices
- Material system optimized for web performance
