import * as THREE from 'three';

/**
 * Court Texture System
 * Provides realistic texture generation for different court surfaces
 */

export type CourtSurfaceType = 'grass' | 'hard' | 'clay' | 'wood';

interface CourtTexture {
  color: THREE.Color;
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  roughnessMap?: THREE.Texture;
  roughness: number;
  metalness?: number;
}

/**
 * Generate realistic NBA-style maple hardwood texture
 * Uses plank-based generation with individual color variation and natural grain patterns
 */
const generateWoodTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const plankCount = 10;
  const plankHeight = size / plankCount;

  // Seeded random for consistency
  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Generate each plank with unique characteristics
  for (let p = 0; p < plankCount; p++) {
    const y = p * plankHeight;

    // Per-plank color variation (maple tones - warm golden-brown)
    const brightness = 200 + seededRandom() * 25;
    const warmth = 160 + seededRandom() * 30;
    const baseR = Math.min(255, brightness + 20);
    const baseG = warmth;
    const baseB = Math.max(60, warmth - 60);

    // Fill plank base
    ctx.fillStyle = `rgb(${baseR}, ${baseG}, ${baseB})`;
    ctx.fillRect(0, y, size, plankHeight);

    // Add grain lines with natural variation
    const grainCount = 60 + Math.floor(seededRandom() * 20);
    for (let g = 0; g < grainCount; g++) {
      const grainY = y + seededRandom() * plankHeight;
      const grainDarkness = 20 + seededRandom() * 30;

      ctx.strokeStyle = `rgba(${baseR - grainDarkness}, ${baseG - grainDarkness}, ${baseB - grainDarkness}, ${0.3 + seededRandom() * 0.3})`;
      ctx.lineWidth = 0.5 + seededRandom() * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, grainY);

      // Add natural waviness to grain
      for (let x = 0; x < size; x += 20) {
        const offset = Math.sin(x * 0.003 + p * 0.5 + g * 0.1) * 3;
        ctx.lineTo(x, grainY + offset);
      }
      ctx.stroke();
    }

    // Add occasional darker grain accent lines
    const accentCount = 3 + Math.floor(seededRandom() * 4);
    for (let a = 0; a < accentCount; a++) {
      const accentY = y + seededRandom() * plankHeight;
      ctx.strokeStyle = `rgba(${baseR - 50}, ${baseG - 50}, ${baseB - 30}, ${0.4 + seededRandom() * 0.2})`;
      ctx.lineWidth = 1 + seededRandom() * 2;
      ctx.beginPath();
      ctx.moveTo(0, accentY);
      for (let x = 0; x < size; x += 30) {
        const offset = Math.sin(x * 0.004 + a * 2) * 2;
        ctx.lineTo(x, accentY + offset);
      }
      ctx.stroke();
    }

    // Add plank separation line
    if (p > 0) {
      ctx.strokeStyle = 'rgba(80, 60, 40, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
  }

  // Add subtle noise for texture depth
  const imageData = ctx.getImageData(0, 0, size, size);
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

/**
 * Generate wood normal map using Sobel-derived approach
 * Creates depth from grain patterns for realistic lighting interaction
 */
const generateWoodNormalMap = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const size = 2048;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Generate heightmap first (grayscale where brighter = raised)
  ctx.fillStyle = '#808080';  // Neutral gray = flat surface
  ctx.fillRect(0, 0, size, size);

  // Seeded random matching diffuse texture
  let seed = 54321;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const plankCount = 10;
  const plankHeight = size / plankCount;

  // Generate height variations for each plank's grain
  for (let p = 0; p < plankCount; p++) {
    const y = p * plankHeight;
    const grainCount = 60 + Math.floor(seededRandom() * 20);

    for (let g = 0; g < grainCount; g++) {
      const grainY = y + seededRandom() * plankHeight;
      const height = 100 + seededRandom() * 55;  // Grayscale height value

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

    // Plank edges are slightly raised
    if (p > 0) {
      ctx.strokeStyle = 'rgb(140, 140, 140)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
  }

  // Convert heightmap to normal map via Sobel operator
  const heightData = ctx.getImageData(0, 0, size, size);
  const normalData = ctx.createImageData(size, size);

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const idx = (y * size + x) * 4;

      // Sample neighboring heights for Sobel
      const tl = heightData.data[((y - 1) * size + (x - 1)) * 4];
      const t = heightData.data[((y - 1) * size + x) * 4];
      const tr = heightData.data[((y - 1) * size + (x + 1)) * 4];
      const l = heightData.data[(y * size + (x - 1)) * 4];
      const r = heightData.data[(y * size + (x + 1)) * 4];
      const bl = heightData.data[((y + 1) * size + (x - 1)) * 4];
      const b = heightData.data[((y + 1) * size + x) * 4];
      const br = heightData.data[((y + 1) * size + (x + 1)) * 4];

      // Sobel X gradient
      const dX = (tr + 2 * r + br) - (tl + 2 * l + bl);
      // Sobel Y gradient
      const dY = (bl + 2 * b + br) - (tl + 2 * t + tr);

      // Normalize and encode as RGB normal map
      const strength = 2.0;
      normalData.data[idx] = Math.min(255, Math.max(0, 128 + dX / strength));      // R = X
      normalData.data[idx + 1] = Math.min(255, Math.max(0, 128 + dY / strength));  // G = Y
      normalData.data[idx + 2] = 255;  // B = Z (always pointing up)
      normalData.data[idx + 3] = 255;  // A
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

/**
 * Generate procedural concrete/hard court texture
 */
const generateConcreteTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base concrete color - blue-tinted hard court
  const baseColor = '#4A7BA7';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Add concrete aggregate texture (small random dots)
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2;
    const brightness = Math.random() * 40 - 20;

    ctx.fillStyle = `rgba(${74 + brightness}, ${123 + brightness}, ${167 + brightness}, ${0.3 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add subtle cracks and wear patterns
  const cracks = 15;
  for (let i = 0; i < cracks; i++) {
    const startX = Math.random() * 512;
    const startY = Math.random() * 512;

    ctx.strokeStyle = `rgba(30, 50, 80, ${0.2 + Math.random() * 0.2})`;
    ctx.lineWidth = 0.5 + Math.random();
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    // Create irregular crack pattern
    let x = startX;
    let y = startY;
    for (let j = 0; j < 5; j++) {
      x += (Math.random() - 0.5) * 100;
      y += (Math.random() - 0.5) * 100;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Add subtle noise for realistic surface variation
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;

  return texture;
};

/**
 * Generate procedural concrete normal map
 */
const generateConcreteNormalMap = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Neutral base
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  // Add bumpy texture for concrete aggregate
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 3 + 1;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(150, 150, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(100, 100, 200, 0.1)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;

  return texture;
};

/**
 * Generate realistic Roland Garros style terre battue clay texture
 * Features granular particles, rake marks, and authentic color variation
 */
const generateClayTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base terre battue color
  ctx.fillStyle = '#b85a3a';
  ctx.fillRect(0, 0, size, size);

  // Seeded random for consistency
  let seed = 67890;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Granular particles (600+ for authentic look)
  for (let i = 0; i < 800; i++) {
    const x = seededRandom() * size;
    const y = seededRandom() * size;
    const particleSize = 1 + seededRandom() * 2.5;

    // Color variation per granule (±25 RGB)
    const colorVar = -25 + seededRandom() * 50;
    const r = Math.min(255, Math.max(0, 184 + colorVar));
    const g = Math.min(255, Math.max(0, 90 + colorVar * 0.6));
    const b = Math.min(255, Math.max(0, 58 + colorVar * 0.4));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, particleSize, particleSize);
  }

  // Add larger granules for variety
  for (let i = 0; i < 150; i++) {
    const x = seededRandom() * size;
    const y = seededRandom() * size;
    const particleSize = 2 + seededRandom() * 3;

    const colorVar = -15 + seededRandom() * 30;
    const r = Math.min(255, Math.max(0, 175 + colorVar));
    const g = Math.min(255, Math.max(0, 85 + colorVar * 0.5));
    const b = Math.min(255, Math.max(0, 55 + colorVar * 0.3));

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
    ctx.beginPath();
    ctx.arc(x, y, particleSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rake marks - parallel grooves with natural variation
  const rakeSpacing = 4;
  ctx.strokeStyle = 'rgba(140, 55, 30, 0.2)';
  ctx.lineWidth = 1;

  for (let y = 0; y < size; y += rakeSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);

    // Add slight waviness to simulate hand-raked appearance
    for (let x = 0; x < size; x += 25) {
      const offset = Math.sin(x * 0.015 + y * 0.008) * 0.8;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Secondary lighter rake highlight
  ctx.strokeStyle = 'rgba(200, 100, 60, 0.1)';
  for (let y = 2; y < size; y += rakeSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x < size; x += 25) {
      const offset = Math.sin(x * 0.015 + y * 0.008) * 0.8;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Subtle overall noise for texture depth
  const imageData = ctx.getImageData(0, 0, size, size);
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

/**
 * Generate clay court normal map for granular bump appearance
 */
const generateClayNormalMap = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Neutral base (flat surface)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, size, size);

  // Seeded random matching diffuse texture
  let seed = 11111;
  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Granular bumps
  for (let i = 0; i < 800; i++) {
    const x = seededRandom() * size;
    const y = seededRandom() * size;
    const bumpSize = 2 + seededRandom() * 3;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, bumpSize);
    gradient.addColorStop(0, 'rgba(160, 160, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(140, 140, 245, 0.2)');
    gradient.addColorStop(1, 'rgba(120, 120, 230, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, bumpSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Larger bump features
  for (let i = 0; i < 150; i++) {
    const x = seededRandom() * size;
    const y = seededRandom() * size;
    const bumpSize = 3 + seededRandom() * 4;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, bumpSize);
    gradient.addColorStop(0, 'rgba(150, 150, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(128, 128, 240, 0.05)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, bumpSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rake groove normals - subtle horizontal lines
  const rakeSpacing = 4;
  for (let y = 0; y < size; y += rakeSpacing) {
    ctx.strokeStyle = 'rgba(100, 100, 200, 0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  texture.needsUpdate = true;

  return texture;
};

/**
 * Texture cache to avoid regenerating textures
 */
const textureCache: Map<string, THREE.Texture> = new Map();

/**
 * Get or create texture with caching
 */
const getCachedTexture = (key: string, generator: () => THREE.Texture): THREE.Texture => {
  if (!textureCache.has(key)) {
    textureCache.set(key, generator());
  }
  return textureCache.get(key)!;
};

/**
 * Get complete material configuration for a court surface type
 */
export const getCourtTexture = (type: CourtSurfaceType): CourtTexture => {
  switch (type) {
    case 'wood':
      return {
        color: new THREE.Color('#c9a66b'),  // Warmer maple tone
        map: getCachedTexture('wood_diffuse', generateWoodTexture),
        normalMap: getCachedTexture('wood_normal', generateWoodNormalMap),
        roughness: 0.15,  // Glossy varnished surface
        metalness: 0,     // Wood is not metallic
      };

    case 'hard':
      return {
        color: new THREE.Color('#3b82f6'),
        map: getCachedTexture('concrete_diffuse', generateConcreteTexture),
        normalMap: getCachedTexture('concrete_normal', generateConcreteNormalMap),
        roughness: 0.7,
        metalness: 0.0,
      };

    case 'clay':
      return {
        color: new THREE.Color('#b85a3a'),  // Authentic terre battue red-brown
        map: getCachedTexture('clay_diffuse', generateClayTexture),
        normalMap: getCachedTexture('clay_normal', generateClayNormalMap),
        roughness: 0.85,  // Matte dusty surface
        metalness: 0.0,
      };

    case 'grass':
      return {
        color: new THREE.Color('#4d7c0f'),
        roughness: 0.85,
        metalness: 0.0,
      };
  }
};

/**
 * Cleanup textures when no longer needed
 */
export const disposeCourtTextures = (): void => {
  textureCache.forEach((texture) => {
    texture.dispose();
  });
  textureCache.clear();
};
