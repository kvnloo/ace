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
 * Generate procedural wood grain texture using canvas
 */
const generateWoodTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base wood color - warm brown
  const baseColor = '#8B6F47';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Wood grain lines (horizontal planks)
  const grainLines = 40;
  for (let i = 0; i < grainLines; i++) {
    const y = (i / grainLines) * 512;
    const variation = Math.random() * 0.3;

    // Darker grain lines
    ctx.strokeStyle = `rgba(101, 67, 33, ${0.3 + variation})`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);

    // Add natural waviness to grain
    for (let x = 0; x < 512; x += 10) {
      const offset = Math.sin(x * 0.05 + i) * 3;
      ctx.lineTo(x, y + offset);
    }
    ctx.stroke();
  }

  // Add plank separations (vertical lines every ~50-80px)
  const planks = 8;
  for (let i = 0; i < planks; i++) {
    const x = (i / planks) * 512 + Math.random() * 20;
    ctx.strokeStyle = 'rgba(70, 50, 30, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Add subtle noise/texture variation
  const imageData = ctx.getImageData(0, 0, 512, 512);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }
  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8); // Repeat to show multiple planks
  texture.needsUpdate = true;

  return texture;
};

/**
 * Generate procedural wood normal map for depth
 */
const generateWoodNormalMap = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Neutral normal map base (light blue/purple)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  // Add grain depth variations (lighter = raised, darker = recessed)
  const grainLines = 40;
  for (let i = 0; i < grainLines; i++) {
    const y = (i / grainLines) * 512;

    // Create subtle depth variations
    ctx.strokeStyle = `rgba(100, 100, 200, ${0.2 + Math.random() * 0.2})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);

    for (let x = 0; x < 512; x += 10) {
      const offset = Math.sin(x * 0.05 + i) * 2;
      ctx.lineTo(x, y + offset);
    }
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
        color: new THREE.Color('#d4a373'),
        map: getCachedTexture('wood_diffuse', generateWoodTexture),
        normalMap: getCachedTexture('wood_normal', generateWoodNormalMap),
        roughness: 0.3,
        metalness: 0.1,
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
        color: new THREE.Color('#ea580c'),
        roughness: 0.9,
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
