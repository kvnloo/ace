/**
 * Asset Definitions - Complete catalog of all 3D assets in the ACE facility
 *
 * Performance Cost Scale:
 * 1-2: Minimal (simple meshes, static lighting)
 * 3-4: Low (textured meshes, basic shaders)
 * 5-6: Medium (animated objects, particle systems)
 * 7-8: High (complex physics, advanced shaders)
 * 9-10: Very High (volumetric effects, real-time GI)
 */

export type AssetType =
  | 'court'
  | 'grass'
  | 'lighting'
  | 'weather'
  | 'effects'
  | 'ui'
  | 'building'
  | 'character'
  | 'physics';

export interface AssetDefinition {
  /** Unique asset identifier */
  id: string;

  /** Human-readable name */
  name: string;

  /** Asset category */
  type: AssetType;

  /** Short description */
  description: string;

  /** Performance cost estimate (1-10 scale) */
  performanceCost: number;

  /** Asset dependencies (must be enabled first) */
  dependencies: string[];

  /** Default enabled state */
  defaultEnabled: boolean;

  /** Component path (if applicable) */
  componentPath?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Complete asset catalog
 */
export const ASSET_DEFINITIONS: AssetDefinition[] = [
  // ========================================
  // COURTS
  // ========================================
  {
    id: 'tennis-court-1',
    name: 'Tennis Court 1',
    type: 'court',
    description: 'Primary tennis court with full regulation dimensions',
    performanceCost: 4,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/TennisCourt',
    metadata: {
      courtType: 'hard',
      dimensions: { width: 23.77, length: 10.97 },
      polyCount: 2000
    }
  },
  {
    id: 'tennis-court-2',
    name: 'Tennis Court 2',
    type: 'court',
    description: 'Second tennis court',
    performanceCost: 4,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/TennisCourt',
    metadata: {
      courtType: 'hard',
      polyCount: 2000
    }
  },
  {
    id: 'tennis-court-3',
    name: 'Tennis Court 3',
    type: 'court',
    description: 'Third tennis court',
    performanceCost: 4,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/TennisCourt',
    metadata: {
      courtType: 'hard',
      polyCount: 2000
    }
  },
  {
    id: 'tennis-court-4',
    name: 'Tennis Court 4',
    type: 'court',
    description: 'Fourth tennis court',
    performanceCost: 4,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/TennisCourt',
    metadata: {
      courtType: 'hard',
      polyCount: 2000
    }
  },
  {
    id: 'court-lines',
    name: 'Court Line Markings',
    type: 'court',
    description: 'Regulation line markings for all courts',
    performanceCost: 1,
    dependencies: ['tennis-court-1', 'tennis-court-2', 'tennis-court-3', 'tennis-court-4'],
    defaultEnabled: true,
    metadata: {
      lineWidth: 0.05,
      color: 'white'
    }
  },
  {
    id: 'court-net',
    name: 'Tennis Net',
    type: 'court',
    description: 'Regulation height tennis nets with physics',
    performanceCost: 3,
    dependencies: ['tennis-court-1', 'tennis-court-2', 'tennis-court-3', 'tennis-court-4'],
    defaultEnabled: true,
    metadata: {
      height: 0.914,
      hasPhysics: true
    }
  },
  {
    id: 'court-surface',
    name: 'Court Surface Material',
    type: 'court',
    description: 'High-quality court surface with PBR textures',
    performanceCost: 3,
    dependencies: ['tennis-court-1', 'tennis-court-2', 'tennis-court-3', 'tennis-court-4'],
    defaultEnabled: true,
    metadata: {
      textureResolution: 2048,
      pbrMaps: ['albedo', 'normal', 'roughness', 'ao']
    }
  },

  // ========================================
  // GRASS SYSTEM
  // ========================================
  {
    id: 'grass-blades',
    name: 'Grass Blade Geometry',
    type: 'grass',
    description: 'Instanced grass blade meshes',
    performanceCost: 6,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/RoboticGrassSystem',
    metadata: {
      instanceCount: 50000,
      shaderType: 'custom',
      hasWind: true
    }
  },
  {
    id: 'grass-physics',
    name: 'Grass Physics Simulation',
    type: 'grass',
    description: 'Wind and interaction physics for grass',
    performanceCost: 5,
    dependencies: ['grass-blades'],
    defaultEnabled: true,
    metadata: {
      windSpeed: 2.0,
      interactionRadius: 1.0
    }
  },
  {
    id: 'robotic-mowers',
    name: 'Robotic Lawn Mowers',
    type: 'grass',
    description: 'Autonomous mowing robots with pathfinding',
    performanceCost: 7,
    dependencies: ['grass-blades'],
    defaultEnabled: true,
    componentPath: 'components/RoboticGrassSystem',
    metadata: {
      mowerCount: 4,
      hasPathfinding: true,
      hasAnimation: true
    }
  },
  {
    id: 'growth-visualization',
    name: 'Grass Growth Visualization',
    type: 'grass',
    description: 'Real-time grass growth height mapping',
    performanceCost: 4,
    dependencies: ['grass-blades', 'robotic-mowers'],
    defaultEnabled: true,
    metadata: {
      updateFrequency: 1000,
      heatMapEnabled: true
    }
  },

  // ========================================
  // LIGHTING
  // ========================================
  {
    id: 'ambient-light',
    name: 'Ambient Light',
    type: 'lighting',
    description: 'Global ambient illumination',
    performanceCost: 1,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/LightingSystem',
    metadata: {
      intensity: 0.3,
      color: '#ffffff'
    }
  },
  {
    id: 'directional-light',
    name: 'Directional Sun Light',
    type: 'lighting',
    description: 'Primary directional light simulating sun',
    performanceCost: 2,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/LightingSystem',
    metadata: {
      intensity: 1.0,
      castShadows: true,
      shadowMapSize: 2048
    }
  },
  {
    id: 'spot-lights',
    name: 'Court Spot Lights',
    type: 'lighting',
    description: 'Stadium-style court lighting',
    performanceCost: 5,
    dependencies: ['tennis-court-1', 'tennis-court-2', 'tennis-court-3', 'tennis-court-4'],
    defaultEnabled: true,
    componentPath: 'components/LightingSystem',
    metadata: {
      lightCount: 16,
      castShadows: true,
      angle: Math.PI / 6
    }
  },
  {
    id: 'dynamic-shadows',
    name: 'Dynamic Shadow System',
    type: 'lighting',
    description: 'Real-time shadow rendering',
    performanceCost: 7,
    dependencies: ['directional-light', 'spot-lights'],
    defaultEnabled: true,
    metadata: {
      shadowMapSize: 2048,
      cascadeLevels: 3
    }
  },
  {
    id: 'hdr-environment',
    name: 'HDR Environment Map',
    type: 'lighting',
    description: 'High dynamic range environment lighting',
    performanceCost: 4,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/LightingSystem',
    metadata: {
      textureResolution: 1024,
      format: 'RGBE'
    }
  },

  // ========================================
  // WEATHER
  // ========================================
  {
    id: 'weather-particles',
    name: 'Weather Particle System',
    type: 'weather',
    description: 'Rain and snow particle effects',
    performanceCost: 6,
    dependencies: [],
    defaultEnabled: false,
    componentPath: 'components/WeatherSystem',
    metadata: {
      maxParticles: 10000,
      types: ['rain', 'snow']
    }
  },
  {
    id: 'clouds',
    name: 'Volumetric Clouds',
    type: 'weather',
    description: 'Procedural cloud system',
    performanceCost: 8,
    dependencies: [],
    defaultEnabled: false,
    componentPath: 'components/WeatherSystem',
    metadata: {
      cloudCount: 20,
      volumetric: true
    }
  },
  {
    id: 'fog-system',
    name: 'Atmospheric Fog',
    type: 'weather',
    description: 'Distance-based fog rendering',
    performanceCost: 3,
    dependencies: [],
    defaultEnabled: false,
    componentPath: 'components/WeatherSystem',
    metadata: {
      density: 0.005,
      color: '#c8d5e0'
    }
  },
  {
    id: 'wind-effects',
    name: 'Wind System',
    type: 'weather',
    description: 'Wind simulation affecting vegetation',
    performanceCost: 4,
    dependencies: ['grass-blades'],
    defaultEnabled: true,
    componentPath: 'components/WeatherSystem',
    metadata: {
      strength: 2.0,
      turbulence: 0.5
    }
  },

  // ========================================
  // EFFECTS
  // ========================================
  {
    id: 'particle-systems',
    name: 'General Particle Systems',
    type: 'effects',
    description: 'Dust, impact, and ambient particles',
    performanceCost: 5,
    dependencies: [],
    defaultEnabled: true,
    metadata: {
      maxParticles: 5000
    }
  },
  {
    id: 'post-processing',
    name: 'Post-Processing Stack',
    type: 'effects',
    description: 'Screen-space effects pipeline',
    performanceCost: 6,
    dependencies: [],
    defaultEnabled: true,
    metadata: {
      effects: ['ssao', 'bloom', 'tonemap']
    }
  },
  {
    id: 'bloom-effects',
    name: 'Bloom Effect',
    type: 'effects',
    description: 'Luminous bloom post-process',
    performanceCost: 4,
    dependencies: ['post-processing'],
    defaultEnabled: true,
    metadata: {
      threshold: 0.9,
      strength: 0.5
    }
  },
  {
    id: 'motion-blur',
    name: 'Motion Blur',
    type: 'effects',
    description: 'Camera motion blur effect',
    performanceCost: 5,
    dependencies: ['post-processing'],
    defaultEnabled: false,
    metadata: {
      samples: 8,
      intensity: 0.5
    }
  },

  // ========================================
  // UI/HUD
  // ========================================
  {
    id: 'performance-hud',
    name: 'Performance HUD',
    type: 'ui',
    description: 'FPS and performance metrics overlay',
    performanceCost: 1,
    dependencies: [],
    defaultEnabled: true,
    metadata: {
      updateInterval: 100
    }
  },
  {
    id: 'heat-map-overlay',
    name: 'Heat Map Overlay',
    type: 'ui',
    description: 'Tactical heat map visualization',
    performanceCost: 3,
    dependencies: ['tennis-court-1', 'tennis-court-2', 'tennis-court-3', 'tennis-court-4'],
    defaultEnabled: false,
    componentPath: 'components/HeatMapOverlay',
    metadata: {
      resolution: 64,
      opacity: 0.7
    }
  },
  {
    id: 'player-markers',
    name: 'Player Position Markers',
    type: 'ui',
    description: '3D player position indicators',
    performanceCost: 2,
    dependencies: [],
    defaultEnabled: true,
    metadata: {
      markerCount: 4
    }
  },

  // ========================================
  // BUILDING COMPONENTS
  // ========================================
  {
    id: 'reception-area',
    name: 'Reception Area',
    type: 'building',
    description: 'Main entrance and reception facility',
    performanceCost: 5,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/ReceptionArea',
    metadata: {
      polyCount: 15000
    }
  },
  {
    id: 'cognitive-lab',
    name: 'Cognitive Enhancement Lab',
    type: 'building',
    description: 'AI-powered training facility',
    performanceCost: 6,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/CognitiveLab',
    metadata: {
      polyCount: 20000,
      hasInterior: true
    }
  },
  {
    id: 'bms-control-room',
    name: 'BMS Control Room',
    type: 'building',
    description: 'Building Management System control center',
    performanceCost: 5,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/BMSControlRoom',
    metadata: {
      polyCount: 12000,
      hasScreens: true
    }
  },
  {
    id: 'transport-pods',
    name: 'Transport Pod System',
    type: 'building',
    description: 'Automated transportation network',
    performanceCost: 7,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/TransportPods',
    metadata: {
      podCount: 6,
      hasAnimation: true,
      hasPathfinding: true
    }
  },

  // ========================================
  // CHARACTERS
  // ========================================
  {
    id: 'character-system',
    name: 'Character Animation System',
    type: 'character',
    description: 'Player and NPC character rendering',
    performanceCost: 8,
    dependencies: [],
    defaultEnabled: true,
    componentPath: 'components/CharacterSystem',
    metadata: {
      maxCharacters: 8,
      hasIK: true,
      hasFacialAnimation: true
    }
  },

  // ========================================
  // PHYSICS
  // ========================================
  {
    id: 'physics-engine',
    name: 'Physics Simulation',
    type: 'physics',
    description: 'Real-time physics calculations',
    performanceCost: 6,
    dependencies: [],
    defaultEnabled: true,
    metadata: {
      solver: 'rapier',
      maxBodies: 100
    }
  }
];

/**
 * Get asset definition by ID
 */
export function getAssetDefinition(id: string): AssetDefinition | undefined {
  return ASSET_DEFINITIONS.find(asset => asset.id === id);
}

/**
 * Get all assets of a specific type
 */
export function getAssetsByType(type: AssetType): AssetDefinition[] {
  return ASSET_DEFINITIONS.filter(asset => asset.type === type);
}

/**
 * Calculate total performance cost for a set of asset IDs
 */
export function calculateTotalCost(assetIds: string[]): number {
  return assetIds.reduce((total, id) => {
    const asset = getAssetDefinition(id);
    return total + (asset?.performanceCost || 0);
  }, 0);
}
