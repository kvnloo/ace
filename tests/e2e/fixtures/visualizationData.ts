/**
 * Test fixtures for visualization data
 */

export const mockHeatMapData = {
  courtId: 'court-1',
  data: [
    { x: 0, y: 0, intensity: 0.8 },
    { x: 5, y: 5, intensity: 0.6 },
    { x: 10, y: 10, intensity: 0.9 },
    { x: 15, y: 15, intensity: 0.4 },
    { x: 20, y: 20, intensity: 0.7 }
  ],
  timestamp: new Date().toISOString()
};

export const mockWeatherEffects = {
  enabled: true,
  type: 'clear',
  intensity: 0.5,
  windDirection: 45,
  windSpeed: 5
};

export const mockCameraPresets = {
  top: {
    position: { x: 0, y: 50, z: 0 },
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    fov: 75
  },
  side: {
    position: { x: 30, y: 10, z: 0 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    fov: 60
  },
  perspective: {
    position: { x: 20, y: 15, z: 20 },
    rotation: { x: -Math.PI / 6, y: Math.PI / 4, z: 0 },
    fov: 50
  }
};

export const mock3DSceneConfig = {
  courtDimensions: {
    length: 23.77,
    width: 10.97
  },
  surfaceType: 'hard',
  lighting: {
    ambient: 0.5,
    directional: 0.8,
    shadows: true
  },
  gridLines: true,
  netHeight: 0.914
};
