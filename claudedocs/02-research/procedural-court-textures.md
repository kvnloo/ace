# Procedural Court Textures - Research Findings

## Overview
Research into creating realistic procedural textures for tennis court surfaces using THREE.js and Canvas API. Focus on wood (indoor), clay (Roland Garros style), and grass (Wimbledon style) courts.

---

## Wood Court Textures (NBA Hardwood Style)

### Real-World Reference
- **Surface**: Maple hardwood with polyurethane finish
- **Appearance**: Light golden-brown with visible grain, high gloss
- **Characteristics**: Individual planks visible, subtle color variation between planks

### Technical Approaches Researched

#### 1. Concentric Ring Method
Simulates wood rings from tree cross-sections:
```javascript
// Generate rings based on distance from virtual tree center
const distance = Math.sqrt((x - centerX)² + (y - centerY)²);
const ring = Math.sin(distance * ringFrequency) * 0.5 + 0.5;
```
- **Pro**: Very realistic grain patterns
- **Con**: Computationally expensive, complex to tile

#### 2. Plank-Based Generation (Recommended)
Each plank generated with unique characteristics:
```javascript
const plankHeight = canvas.height / plankCount;
for (let p = 0; p < plankCount; p++) {
  const brightness = 220 + seededRandom() * 20;  // Light maple
  const warmth = 180 + seededRandom() * 30;       // Yellow undertone
  // Fill plank with base color, add grain
}
```
- **Pro**: Efficient, realistic, good for tiling
- **Con**: Requires careful seam handling

#### 3. Simplex/Perlin Noise Grain
Natural-looking grain variation:
```javascript
// 2D noise creates organic grain patterns
const grain = simplex2D(x * 0.01, y * 0.02) * 15;
// Stretch y-scale for elongated grain lines
```

### Normal Map Generation (Sobel Operator)
Convert heightmap to normal map for depth perception:
```javascript
function generateNormalFromHeight(heightData, width, height) {
  // Sobel kernels for X and Y gradients
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  // Apply kernels to get surface normals
}
```

### PBR Material Properties
```javascript
{
  roughness: 0.15,      // High gloss (polyurethane finish)
  metalness: 0,         // Wood is non-metallic
  envMapIntensity: 1.2, // Strong reflections under lights
  anisotropy: 8,        // Directional grain reflections
  color: '#c9a66b'      // Warm maple base
}
```

### Color Palette (Maple Hardwood)
- Base: `#c9a66b` (warm maple)
- Light grain: `#d4b07a`
- Dark grain: `#8b6f47`
- Knot accent: `#654321`

---

## Clay Court Textures (Roland Garros Style)

### Real-World Reference
- **Surface**: Terre battue (crushed brick/shale)
- **Appearance**: Red-brown with visible granular texture
- **Characteristics**: Rake marks, wear patterns, granular surface

### Technical Approaches Researched

#### 1. Granular Particle System
Individual particles with color variation:
```javascript
for (let i = 0; i < 500; i++) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const size = 1 + Math.random() * 2;  // 1-3px particles

  // Color variation per granule
  const colorVar = -20 + Math.random() * 40;
  ctx.fillStyle = `rgb(${200 + colorVar}, ${90 + colorVar * 0.6}, ${63 + colorVar * 0.4})`;
  ctx.fillRect(x, y, size, size);
}
```

#### 2. Rake Mark Generation
Parallel grooves with natural variation:
```javascript
const rakeSpacing = 4;  // Close spacing like real courts
for (let y = 0; y < height; y += rakeSpacing) {
  ctx.beginPath();
  ctx.moveTo(0, y);

  // Add slight waviness
  for (let x = 0; x < width; x += 20) {
    const offset = Math.sin(x * 0.05) * 0.5;
    ctx.lineTo(x, y + offset);
  }

  ctx.strokeStyle = 'rgba(160, 70, 45, 0.3)';  // Darker groove
  ctx.stroke();
}
```

#### 3. Wear Pattern Overlay
Pre-calculated wear zones:
```javascript
const wearZones = [
  { x: courtWidth/2, y: baseline, radius: 2, intensity: 0.3 },  // Baseline
  { x: courtWidth/2, y: serviceLine, radius: 1.5, intensity: 0.2 }  // Service
];
// Apply darker, more compacted appearance in wear zones
```

### Normal Map for Granular Depth
```javascript
// Each granule creates a small bump
for (let i = 0; i < granuleCount; i++) {
  // Create radial gradient for 3D bump effect
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
  gradient.addColorStop(0, 'rgba(150, 150, 255, 0.5)');  // Raised center
  gradient.addColorStop(1, 'rgba(100, 100, 200, 0.2)');  // Slopes down
}
```

### PBR Material Properties
```javascript
{
  roughness: 0.85,       // Matte, dusty surface
  metalness: 0,          // Non-metallic
  normalScale: [0.8, 0.8], // Pronounced granular bumps
  color: '#b85a3a'       // Authentic terre battue
}
```

### Color Palette (Terre Battue)
- Base: `#b85a3a` (red-brown)
- Light variation: `#c86a4a`
- Dark variation: `#a04a2a`
- Rake groove: `#8a3a20`

---

## Grass Court Textures (Wimbledon Style)

### Real-World Reference
- **Surface**: Perennial ryegrass, closely mowed
- **Appearance**: Dense green with visible blade texture
- **Characteristics**: Color variation, wear patterns, sun-bleached tips

### Technical Approaches Researched

#### 1. Instanced Geometry (Current Approach - Enhanced)
Individual blade meshes with improved distribution:
```javascript
// Clumping effect - grass grows in natural clusters
const clumpX = Math.floor(random() * 20) / 20;
const clumpZ = Math.floor(random() * 20) / 20;
const clumpOffset = random() * 0.15;

instances.push({
  x: (random() - 0.5) * width + clumpOffset * Math.cos(clumpX * Math.PI * 2),
  z: (random() - 0.5) * depth + clumpOffset * Math.sin(clumpZ * Math.PI * 2),
  height: 0.7 + random() * 0.6,      // 70-130% height variation
  lean: (random() - 0.5) * 0.25,     // Natural lean
  colorVariation: 0.9 + random() * 0.2
});
```

#### 2. Enhanced Fragment Shader
Color gradient with sun-bleaching:
```glsl
// Dark at base, light at tips
vec3 darkBase = uBaseColor * 0.7;
vec3 lightTip = uTipColor * 1.2;
vec3 finalColor = mix(darkBase, lightTip, vUv.y);

// Sun-bleached yellow tint at tips
finalColor.r += vUv.y * 0.05;
finalColor.g += vUv.y * 0.03;

// Per-blade color variation (pseudo-random from wind factor)
float colorVar = 0.88 + vWindFactor * 0.24;
finalColor *= colorVar;
```

#### 3. LOD System (For Future Enhancement)
```javascript
const LOD_LEVELS = {
  GEOMETRY: { maxDistance: 20, bladeCount: 'full' },
  BILLBOARD: { maxDistance: 50, quadCount: 'reduced' },
  TEXTURE: { maxDistance: 100, textureOnly: true }
};
```

### Blade Geometry Dimensions
```javascript
const bladeWidth = 0.008;   // ~8mm wide at base
const bladeHeight = 0.12;   // ~12cm tall (lawn grass)
const midWidth = bladeWidth * 0.4;  // Tapers toward tip
```

### PBR Material Properties
```javascript
{
  roughness: 0.85,    // Matte organic surface
  metalness: 0,       // Non-metallic
  side: THREE.DoubleSide,  // Visible from both sides
  // Custom shader handles color
}
```

### Color Palette (Lawn Grass)
- Base: `#4d7c0f` (dark green)
- Tip: `#6fa025` (lighter green)
- Sun-bleached: Add `+0.05r, +0.03g` at tips
- Variation range: 88-112% brightness

---

## Performance Considerations

### Texture Resolution
| Surface | Recommended | Notes |
|---------|-------------|-------|
| Wood | 2048x2048 | High detail for grain visibility |
| Clay | 1024x1024 | Granular texture benefits less from high res |
| Grass | N/A | Geometry-based, no diffuse texture |

### Anisotropic Filtering
- **Wood**: 8x (viewed at angles, grain detail matters)
- **Clay**: 4x (less critical)
- **Grass**: N/A (geometry)

### Pre-computation
All Canvas-based textures should be generated:
- Once at load time
- Cached in memory
- Shared across all courts of same type

### Mobile Optimization
- Consider lower resolution (512x512) for mobile
- Reduce grass blade count based on device capability
- Use simpler shaders for lower-end devices

---

## References
- THREE.js Documentation: MeshStandardMaterial, CanvasTexture
- Real tennis court photography analysis
- WebGL shader programming patterns
- Procedural texture generation algorithms
