# Grass and Terrain Implementation Guide

This guide consolidates implementation details for grass rendering and terrain systems.

## Grass System

### Architecture
The grass system uses instanced rendering to display thousands of grass blades efficiently.

**Key Components:**
- `GrassAdaptive.tsx` - Adaptive grass density component
- `InstancedGrassLayer.tsx` - Core instancing logic
- Shader-based wind animation
- LOD management

### Implementation Steps

1. **Initialize Grass Instances**
```typescript
const grassGeometry = new THREE.PlaneGeometry(width, height);
const instancedMesh = new THREE.InstancedMesh(
  grassGeometry,
  grassMaterial,
  instanceCount
);
```

2. **Position Grass Blades**
- Distribute across court areas
- Avoid overlap with hard surfaces
- Randomize rotation and scale

3. **Apply Wind Animation**
- Vertex shader displacement
- Time-based sinusoidal movement
- Configurable wind strength

### Performance Optimization

**Adaptive Density:**
- High density near camera (< 50m)
- Medium density mid-range (50-100m)
- Low density far range (> 100m)

**Culling:**
- Frustum culling for off-screen instances
- Distance-based LOD switching

### Configuration Options

```typescript
interface GrassConfig {
  density: 'low' | 'medium' | 'high';
  windStrength: number;
  grassHeight: number;
  grassWidth: number;
  grassColor: THREE.Color;
}
```

## Clay Court Implementation

### Material Setup
Clay courts use a specialized material that simulates the granular texture of clay.

**Material Properties:**
- Base color: #C76448 (terra cotta red)
- Roughness: 0.8 (high diffuse reflection)
- Metalness: 0.0 (non-metallic)
- Normal map for surface texture

### Visual Effects
- Particle effects for ball impact
- Moisture variation (lighter when wet)
- Court markings in white paint

### Implementation
```typescript
const clayMaterial = new THREE.MeshStandardMaterial({
  color: 0xC76448,
  roughness: 0.8,
  metalness: 0.0,
  normalMap: clayNormalTexture,
  normalScale: new THREE.Vector2(0.5, 0.5)
});
```

## Texture System

### Texture Loading
Progressive texture loading prioritizes visible surfaces:

1. **Priority 1**: Court surfaces (immediate view)
2. **Priority 2**: Building exteriors
3. **Priority 3**: Environmental details (grass, trees)

### Texture Optimization
- Mipmapping for distant objects
- Compression (DXT/ASTC formats)
- Lazy loading for off-screen textures

### Texture Atlas
Combine small textures into atlases to reduce draw calls:
- Court line markings
- Building signage
- UI icons

## Quick Reference

### Common Tasks

**Adjust grass density:**
```typescript
setGrassDensity('medium');
```

**Change clay court color:**
```typescript
clayMaterial.color.setHex(0xB85438);
```

**Toggle wind animation:**
```typescript
grassMaterial.uniforms.windStrength.value = enabled ? 1.0 : 0.0;
```

### Troubleshooting

**Grass not rendering:**
- Check instance count > 0
- Verify geometry is valid
- Ensure material is assigned

**Performance issues:**
- Reduce grass density
- Enable frustum culling
- Check LOD distances

**Clay texture looks flat:**
- Verify normal map is loaded
- Check normalScale values
- Ensure proper lighting
