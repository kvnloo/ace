# Realistic Tennis Court Textures - Implementation Specification

## Overview
Technical specification for implementing realistic procedural textures for wood, clay, and grass tennis court surfaces.

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/utils/courtTextures.ts` | Major Rewrite | Enhanced wood and clay texture generators |
| `src/components/GrassAdaptive.tsx` | Enhancement | Improved shader and distribution |
| `src/components/InstancedTennisCourtsFull.tsx` | Minor Update | Clay material properties |

---

## Wood Texture Implementation

### File: `src/utils/courtTextures.ts`

#### Function: `generateWoodTexture()`

**Current Implementation Issues:**
- Simple grain lines without realistic pattern
- No plank color variation
- 512x512 resolution insufficient

**New Implementation:**

```typescript
const generateWoodTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  const plankCount = 10;
  const plankHeight = canvas.height / plankCount;

  // Seeded random for consistency
  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Generate each plank with unique characteristics
  for (let p = 0; p < plankCount; p++) {
    const y = p * plankHeight;

    // Per-plank color variation (maple tones)
    const brightness = 200 + seededRandom() * 25;
    const warmth = 160 + seededRandom() * 30;
    const baseR = Math.min(255, brightness + 20);
    const baseG = warmth;
    const baseB = Math.max(60, warmth - 60);

    // Fill plank base
    ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
    ctx.fillRect(0, y, canvas.width, plankHeight);

    // Add grain lines with Simplex-like pattern
    const grainCount = 60 + Math.floor(seededRandom() * 20);
    for (let g = 0; g < grainCount; g++) {
      const grainY = y + seededRandom() * plankHeight;
      const grainDarkness = 20 + seededRandom() * 30;

      ctx.strokeStyle = `rgba(${baseR - grainDarkness}, ${baseG - grainDarkness}, ${baseB - grainDarkness}, ${0.3 + seededRandom() * 0.3})`;
      ctx.lineWidth = 0.5 + seededRandom() * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, grainY);

      // Add natural waviness
      for (let x = 0; x < canvas.width; x += 20) {
        const offset = Math.sin(x * 0.003 + p * 0.5 + g * 0.1) * 3;
        ctx.lineTo(x, grainY + offset);
      }
      ctx.stroke();
    }

    // Add plank separation line
    if (p > 0) {
      ctx.strokeStyle = 'rgba(80, 60, 40, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  // Add subtle noise for texture
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (seededRandom() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
};
```

#### Function: `generateWoodNormalMap()`

**New Implementation with Sobel:**

```typescript
const generateWoodNormalMap = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Generate heightmap first
  ctx.fillStyle = '#808080';  // Neutral gray = flat
  ctx.fillRect(0, 0, size, size);

  // Add grain height variations
  let seed = 54321;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const plankCount = 10;
  const plankHeight = size / plankCount;

  for (let p = 0; p < plankCount; p++) {
    const y = p * plankHeight;
    const grainCount = 60 + Math.floor(seededRandom() * 20);

    for (let g = 0; g < grainCount; g++) {
      const grainY = y + seededRandom() * plankHeight;
      const height = 100 + seededRandom() * 55;  // Grayscale height

      ctx.strokeStyle = `rgb(${height}, ${height}, ${height})`;
      ctx.lineWidth = 1 + seededRandom() * 2;
      ctx.beginPath();
      ctx.moveTo(0, grainY);

      for (let x = 0; x < size; x += 20) {
        const offset = Math.sin(x * 0.003 + p * 0.5 + g * 0.1) * 3;
        ctx.lineTo(x, grainY + offset);
      }
      ctx.stroke();
    }
  }

  // Convert heightmap to normal map via Sobel
  const heightData = ctx.getImageData(0, 0, size, size);
  const normalData = ctx.createImageData(size, size);

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = (y * size + x) * 4;

      // Sobel X gradient
      const tl = heightData.data[((y - 1) * size + (x - 1)) * 4];
      const l = heightData.data[(y * size + (x - 1)) * 4];
      const bl = heightData.data[((y + 1) * size + (x - 1)) * 4];
      const tr = heightData.data[((y - 1) * size + (x + 1)) * 4];
      const r = heightData.data[(y * size + (x + 1)) * 4];
      const br = heightData.data[((y + 1) * size + (x + 1)) * 4];

      const dX = (tr + 2 * r + br) - (tl + 2 * l + bl);

      // Sobel Y gradient
      const t = heightData.data[((y - 1) * size + x) * 4];
      const b = heightData.data[((y + 1) * size + x) * 4];
      const dY = (bl + 2 * b + br) - (tl + 2 * t + tr);

      // Normalize and encode as RGB
      const strength = 2.0;
      normalData.data[idx] = Math.min(255, Math.max(0, 128 + dX / strength));
      normalData.data[idx + 1] = Math.min(255, Math.max(0, 128 + dY / strength));
      normalData.data[idx + 2] = 255;  // Z always points up
      normalData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(normalData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.needsUpdate = true;

  return texture;
};
```

---

## Clay Texture Implementation

### File: `src/utils/courtTextures.ts`

#### New Function: `generateClayTexture()`

```typescript
const generateClayTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base terre battue color
  ctx.fillStyle = '#b85a3a';
  ctx.fillRect(0, 0, 1024, 1024);

  let seed = 67890;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Granular particles (500+)
  for (let i = 0; i < 600; i++) {
    const x = seededRandom() * 1024;
    const y = seededRandom() * 1024;
    const size = 1 + seededRandom() * 2;

    // Color variation per granule
    const colorVar = -20 + seededRandom() * 40;
    const r = Math.min(255, Math.max(0, 184 + colorVar));
    const g = Math.min(255, Math.max(0, 90 + colorVar * 0.6));
    const b = Math.min(255, Math.max(0, 58 + colorVar * 0.4));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, size, size);
  }

  // Rake marks
  const rakeSpacing = 4;
  ctx.strokeStyle = 'rgba(140, 60, 35, 0.25)';
  ctx.lineWidth = 1;

  for (let y = 0; y < 1024; y += rakeSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);

    for (let x = 0; x < 1024; x += 30) {
      const offset = Math.sin(x * 0.02 + y * 0.01) * 0.8;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Subtle noise
  const imageData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (seededRandom() - 0.5) * 12;
    data[i] = Math.max(0, Math.min(255, data[i] + noise));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  texture.needsUpdate = true;

  return texture;
};
```

#### New Function: `generateClayNormalMap()`

```typescript
const generateClayNormalMap = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Neutral base
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 1024, 1024);

  let seed = 11111;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Granular bumps
  for (let i = 0; i < 600; i++) {
    const x = seededRandom() * 1024;
    const y = seededRandom() * 1024;
    const size = 2 + seededRandom() * 3;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(160, 160, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(120, 120, 230, 0.1)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rake groove normals
  const rakeSpacing = 4;
  for (let y = 0; y < 1024; y += rakeSpacing) {
    ctx.strokeStyle = 'rgba(100, 100, 200, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  texture.needsUpdate = true;

  return texture;
};
```

---

## Grass Shader Enhancement

### File: `src/components/GrassAdaptive.tsx`

#### Updated Fragment Shader

```glsl
const grassFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;

  varying vec3 vColor;
  varying vec2 vUv;
  varying float vWindFactor;

  void main() {
    // Enhanced color gradient: much darker at base, lighter at tips
    vec3 darkBase = uBaseColor * 0.65;   // Darker base
    vec3 lightTip = uTipColor * 1.25;    // Brighter tips
    vec3 finalColor = mix(darkBase, lightTip, vUv.y);

    // Per-blade color variation (wider range)
    float colorVar = 0.88 + vWindFactor * 0.24;
    finalColor *= colorVar;

    // Sun-bleached yellow tint at tips (enhanced)
    finalColor.r += vUv.y * vUv.y * 0.06;  // Quadratic for more tip emphasis
    finalColor.g += vUv.y * vUv.y * 0.04;

    // Subtle ambient occlusion at base
    float ao = 0.7 + vUv.y * 0.3;
    finalColor *= ao;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
```

#### Updated Distribution Algorithm

```typescript
const generateGrassPositions = (
  count: number,
  width: number,
  depth: number,
  seed: number = 12345
) => {
  const instances = [];
  let s = seed;
  const random = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };

  // Create clump centers
  const clumpCount = Math.floor(count / 50);
  const clumps = [];
  for (let c = 0; c < clumpCount; c++) {
    clumps.push({
      x: (random() - 0.5) * width,
      z: (random() - 0.5) * depth,
      radius: 0.1 + random() * 0.2
    });
  }

  for (let i = 0; i < count; i++) {
    // 70% chance to be near a clump
    let x, z;
    if (random() < 0.7 && clumps.length > 0) {
      const clump = clumps[Math.floor(random() * clumps.length)];
      const angle = random() * Math.PI * 2;
      const dist = random() * clump.radius;
      x = clump.x + Math.cos(angle) * dist;
      z = clump.z + Math.sin(angle) * dist;
    } else {
      x = (random() - 0.5) * width;
      z = (random() - 0.5) * depth;
    }

    instances.push({
      x: Math.max(-width/2, Math.min(width/2, x)),
      z: Math.max(-depth/2, Math.min(depth/2, z)),
      height: 0.7 + random() * 0.6,      // 70-130% height
      rotation: random() * Math.PI * 2,
      lean: (random() - 0.5) * 0.3,      // Increased lean
      scale: 0.7 + random() * 0.6,       // More width variation
      colorVariation: 0.85 + random() * 0.3
    });
  }

  return instances;
};
```

---

## Material Property Updates

### Wood Court Material
```typescript
case 'wood':
  return {
    color: new THREE.Color('#c9a66b'),
    map: getCachedTexture('wood_diffuse', generateWoodTexture),
    normalMap: getCachedTexture('wood_normal', generateWoodNormalMap),
    roughness: 0.15,
    metalness: 0,
  };
```

### Clay Court Material
```typescript
case 'clay':
  return {
    color: new THREE.Color('#b85a3a'),
    map: getCachedTexture('clay_diffuse', generateClayTexture),
    normalMap: getCachedTexture('clay_normal', generateClayNormalMap),
    roughness: 0.85,
    metalness: 0,
  };
```

---

## Testing Checklist

### Visual Tests
- [ ] Wood planks visually distinct with color variation
- [ ] Wood grain pattern natural and non-repetitive
- [ ] Wood surface has glossy appearance under light
- [ ] Clay granular texture visible at close range
- [ ] Clay rake marks clearly visible
- [ ] Clay has matte, dusty appearance
- [ ] Grass blades show clumping pattern
- [ ] Grass color varies blade-to-blade
- [ ] Grass tips appear sun-bleached

### Performance Tests
- [ ] Initial load time acceptable (< 2 seconds added)
- [ ] No frame rate regression
- [ ] Texture memory within budget (< 50MB total)

### Compatibility Tests
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Chrome (mobile)
