import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Filter, TrendingUp } from 'lucide-react';

/**
 * Heat Map Overlay for Court Usage and Player Movement Visualization
 *
 * Features:
 * - Color-coded intensity maps for ball impacts, player positions, and tactical patterns
 * - Time-based filtering with date range selection
 * - Historical data playback with timeline scrubbing
 * - Pattern recognition displays for hot zones and strategic insights
 * - Real-time heat map rendering on court surfaces
 * - Performance optimized with WebGL shaders
 */

// --- Types & Interfaces ---

export type HeatMapDataType = 'ball_impact' | 'player_position' | 'tactical_pattern' | 'serve_placement';
export type HeatMapMode = 'realtime' | 'historical' | 'comparison';

export interface HeatPoint {
  x: number;           // Court x position (0-10m for singles)
  z: number;           // Court z position (0-22m)
  intensity: number;   // 0-1 normalized intensity
  timestamp: number;   // Unix timestamp in milliseconds
  type: HeatMapDataType;
  metadata?: {
    playerName?: string;
    shotType?: string;
    speed?: number;
    spin?: number;
  };
}

export interface CourtHeatData {
  courtId: string;
  courtType: 'hard' | 'clay' | 'grass' | 'wood';
  points: HeatPoint[];
  timeRange: {
    start: number;
    end: number;
  };
}

export interface HeatMapPattern {
  id: string;
  name: string;
  description: string;
  zones: Array<{ x: number; z: number; radius: number }>;
  frequency: number;
  confidence: number; // 0-1
}

interface HeatMapOverlayProps {
  position: [number, number, number];
  courtWidth: number;
  courtLength: number;
  courtId?: string;
  courtType?: 'hard' | 'clay' | 'grass' | 'wood';
  initialMode?: HeatMapMode;
  initialDataType?: HeatMapDataType;
  showControls?: boolean;
  onPatternDetected?: (pattern: HeatMapPattern) => void;
}

// --- Mock Data Generator (Replace with real data source) ---

const generateMockHeatData = (courtId: string, dataType: HeatMapDataType, timeRange: { start: number; end: number }): HeatPoint[] => {
  const points: HeatPoint[] = [];
  const numPoints = 500 + Math.floor(Math.random() * 500);

  for (let i = 0; i < numPoints; i++) {
    const timestamp = timeRange.start + Math.random() * (timeRange.end - timeRange.start);

    // Generate realistic court positions based on data type
    let x: number, z: number, intensity: number;

    switch (dataType) {
      case 'ball_impact':
        // Ball impacts tend to cluster in service boxes and baseline
        if (Math.random() > 0.5) {
          // Service box impacts
          x = 2 + Math.random() * 6;
          z = 6 + Math.random() * 6;
        } else {
          // Baseline impacts
          x = 1 + Math.random() * 8;
          z = 18 + Math.random() * 3;
        }
        intensity = 0.3 + Math.random() * 0.7;
        break;

      case 'player_position':
        // Players tend to stay near center and baseline
        x = 3 + Math.random() * 4; // Center bias
        z = Math.random() > 0.7 ? 2 + Math.random() * 8 : 14 + Math.random() * 6;
        intensity = 0.2 + Math.random() * 0.8;
        break;

      case 'serve_placement':
        // Serves target specific zones
        x = Math.random() > 0.5 ? 1 + Math.random() * 3 : 6 + Math.random() * 3;
        z = 4 + Math.random() * 2;
        intensity = 0.5 + Math.random() * 0.5;
        break;

      case 'tactical_pattern':
        // Strategic zones (cross-court, down-the-line)
        const pattern = Math.random();
        if (pattern < 0.33) {
          // Cross-court
          x = 1 + Math.random() * 4;
          z = 8 + Math.random() * 8;
        } else if (pattern < 0.66) {
          // Down-the-line
          x = 7 + Math.random() * 2;
          z = 10 + Math.random() * 10;
        } else {
          // Net approach
          x = 3 + Math.random() * 4;
          z = 8 + Math.random() * 4;
        }
        intensity = 0.4 + Math.random() * 0.6;
        break;

      default:
        x = Math.random() * 10;
        z = Math.random() * 22;
        intensity = Math.random();
    }

    points.push({
      x,
      z,
      intensity,
      timestamp,
      type: dataType,
      metadata: {
        playerName: `Player ${Math.floor(Math.random() * 4) + 1}`,
        shotType: ['forehand', 'backhand', 'serve', 'volley'][Math.floor(Math.random() * 4)],
        speed: 60 + Math.random() * 80,
        spin: Math.random() * 3000,
      },
    });
  }

  return points;
};

// --- Pattern Recognition Engine ---

const detectHotZones = (points: HeatPoint[], gridSize: number = 20): HeatMapPattern[] => {
  const patterns: HeatMapPattern[] = [];
  const grid: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));

  // Build heat grid
  points.forEach((point) => {
    const gridX = Math.floor((point.x / 10) * gridSize);
    const gridZ = Math.floor((point.z / 22) * gridSize);
    if (gridX >= 0 && gridX < gridSize && gridZ >= 0 && gridZ < gridSize) {
      grid[gridZ][gridX] += point.intensity;
    }
  });

  // Find local maxima (hot zones)
  const threshold = Math.max(...grid.flat()) * 0.6;

  for (let z = 1; z < gridSize - 1; z++) {
    for (let x = 1; x < gridSize - 1; x++) {
      const value = grid[z][x];
      if (value > threshold) {
        // Check if local maximum
        const neighbors = [
          grid[z-1][x], grid[z+1][x], grid[z][x-1], grid[z][x+1],
          grid[z-1][x-1], grid[z-1][x+1], grid[z+1][x-1], grid[z+1][x+1]
        ];

        if (value >= Math.max(...neighbors)) {
          const worldX = (x / gridSize) * 10;
          const worldZ = (z / gridSize) * 22;

          patterns.push({
            id: `zone_${patterns.length}`,
            name: `Hot Zone ${patterns.length + 1}`,
            description: `High activity area at (${worldX.toFixed(1)}m, ${worldZ.toFixed(1)}m)`,
            zones: [{ x: worldX, z: worldZ, radius: 1.5 }],
            frequency: value,
            confidence: Math.min(value / threshold, 1.0),
          });
        }
      }
    }
  }

  return patterns.slice(0, 5); // Return top 5 patterns
};

// --- Heat Map Shader ---

const heatMapVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const heatMapFragmentShader = `
  uniform sampler2D heatTexture;
  uniform float opacity;
  varying vec2 vUv;

  // Color gradient: blue -> cyan -> green -> yellow -> red
  vec3 heatMapColor(float value) {
    if (value < 0.25) {
      // Blue to Cyan
      return mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), value * 4.0);
    } else if (value < 0.5) {
      // Cyan to Green
      return mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (value - 0.25) * 4.0);
    } else if (value < 0.75) {
      // Green to Yellow
      return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (value - 0.5) * 4.0);
    } else {
      // Yellow to Red
      return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (value - 0.75) * 4.0);
    }
  }

  void main() {
    float heat = texture2D(heatTexture, vUv).r;

    if (heat < 0.01) {
      discard; // Don't render areas with no heat
    }

    vec3 color = heatMapColor(heat);
    gl_FragColor = vec4(color, heat * opacity);
  }
`;

// --- Main Component ---

const HeatMapOverlay: React.FC<HeatMapOverlayProps> = ({
  position,
  courtWidth,
  courtLength,
  courtId = 'court_1',
  courtType = 'hard',
  initialMode = 'historical',
  initialDataType = 'player_position',
  showControls = true,
  onPatternDetected,
}) => {
  // --- State Management ---
  const [mode, setMode] = useState<HeatMapMode>(initialMode);
  const [dataType, setDataType] = useState<HeatMapDataType>(initialDataType);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeRange, setTimeRange] = useState({
    start: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    end: Date.now(),
  });
  const [heatData, setHeatData] = useState<HeatPoint[]>([]);
  const [patterns, setPatterns] = useState<HeatMapPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.7);
  const [showPatterns, setShowPatterns] = useState(true);

  // --- Refs ---
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const playbackSpeed = useRef(1.0);

  // --- Load Data ---
  useEffect(() => {
    const data = generateMockHeatData(courtId, dataType, timeRange);
    setHeatData(data);
    setCurrentTime(timeRange.start);

    // Detect patterns
    const detectedPatterns = detectHotZones(data);
    setPatterns(detectedPatterns);

    // Notify parent
    if (onPatternDetected && detectedPatterns.length > 0) {
      detectedPatterns.forEach(pattern => onPatternDetected(pattern));
    }
  }, [courtId, dataType, timeRange]);

  // --- Generate Heat Texture ---
  const heatTexture = useMemo(() => {
    const resolution = 256;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, resolution, resolution);

    // Filter points by current time in historical mode
    const visiblePoints = mode === 'historical'
      ? heatData.filter(p => p.timestamp <= currentTime)
      : heatData;

    // Create heat map with gaussian blur
    const imageData = ctx.createImageData(resolution, resolution);
    const data = imageData.data;

    visiblePoints.forEach((point) => {
      const px = Math.floor((point.x / courtWidth) * resolution);
      const pz = Math.floor((point.z / courtLength) * resolution);
      const radius = 15; // Blur radius in pixels
      const sigma = radius / 3;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const x = px + dx;
          const z = pz + dy;

          if (x >= 0 && x < resolution && z >= 0 && z < resolution) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            const gaussian = Math.exp(-(dist * dist) / (2 * sigma * sigma));
            const contribution = point.intensity * gaussian;

            const idx = (z * resolution + x) * 4;
            data[idx] = Math.min(255, data[idx] + contribution * 255); // Red channel for heat
          }
        }
      }
    });

    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [heatData, currentTime, mode, courtWidth, courtLength]);

  // --- Animation Loop (Playback) ---
  useFrame((state, delta) => {
    if (isPlaying && mode === 'historical') {
      const newTime = currentTime + delta * 1000 * playbackSpeed.current * 60; // 60x speed

      if (newTime >= timeRange.end) {
        setCurrentTime(timeRange.start);
        setIsPlaying(false);
      } else {
        setCurrentTime(newTime);
      }
    }

    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.heatTexture.value = heatTexture;
      materialRef.current.uniforms.opacity.value = opacity;
    }
  });

  // --- Event Handlers ---
  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleReset = () => {
    setCurrentTime(timeRange.start);
    setIsPlaying(false);
  };

  const handleTimeChange = (value: number) => {
    setCurrentTime(value);
    setIsPlaying(false);
  };

  const handleDataTypeChange = (type: HeatMapDataType) => {
    setDataType(type);
    setIsPlaying(false);
  };

  const handleSpeedChange = (delta: number) => {
    playbackSpeed.current = Math.max(0.25, Math.min(4, playbackSpeed.current + delta));
  };

  // --- Render ---
  return (
    <group position={position}>
      {/* Heat Map Mesh */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[courtWidth / 2, 0.05, courtLength / 2]}
      >
        <planeGeometry args={[courtWidth, courtLength]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={heatMapVertexShader}
          fragmentShader={heatMapFragmentShader}
          uniforms={{
            heatTexture: { value: heatTexture },
            opacity: { value: opacity },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Pattern Visualization (Hot Zone Markers) */}
      {showPatterns && patterns.map((pattern, idx) => (
        <group key={pattern.id}>
          {pattern.zones.map((zone, zoneIdx) => (
            <mesh
              key={zoneIdx}
              position={[zone.x, 0.1, zone.z]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={() => setSelectedPattern(pattern.id)}
            >
              <ringGeometry args={[zone.radius * 0.9, zone.radius, 32]} />
              <meshBasicMaterial
                color={selectedPattern === pattern.id ? '#DFFF4F' : '#ff0000'}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          {/* Pattern Label */}
          <Html
            position={[pattern.zones[0].x, 0.5, pattern.zones[0].z]}
            center
            distanceFactor={20}
            style={{ pointerEvents: 'none' }}
          >
            <div className="px-2 py-1 bg-black/80 text-white text-xs rounded border border-red-500 whitespace-nowrap">
              {pattern.name}
              <div className="text-xs text-gray-400">
                {(pattern.confidence * 100).toFixed(0)}% confidence
              </div>
            </div>
          </Html>
        </group>
      ))}

      {/* Control Panel */}
      {showControls && (
        <Html
          position={[courtWidth / 2, 1, courtLength + 2]}
          center
          distanceFactor={40}
        >
          <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl min-w-[400px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-tennis-yellow" />
                <h3 className="text-white font-bold text-sm">Heat Map Analytics</h3>
              </div>
              <div className="text-xs text-white/50">
                {heatData.filter(p => p.timestamp <= currentTime).length} / {heatData.length} events
              </div>
            </div>

            {/* Data Type Selector */}
            <div className="mb-4">
              <label className="text-xs text-white/50 mb-2 block">Data Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'player_position' as HeatMapDataType, label: 'Player Position' },
                  { type: 'ball_impact' as HeatMapDataType, label: 'Ball Impact' },
                  { type: 'serve_placement' as HeatMapDataType, label: 'Serve Placement' },
                  { type: 'tactical_pattern' as HeatMapDataType, label: 'Tactical Patterns' },
                ].map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => handleDataTypeChange(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      dataType === type
                        ? 'bg-tennis-yellow text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Controls */}
            {mode === 'historical' && (
              <>
                <div className="mb-4">
                  <label className="text-xs text-white/50 mb-2 block">
                    Timeline: {new Date(currentTime).toLocaleDateString()}
                  </label>
                  <input
                    type="range"
                    min={timeRange.start}
                    max={timeRange.end}
                    value={currentTime}
                    onChange={(e) => handleTimeChange(Number(e.target.value))}
                    className="w-full accent-tennis-yellow"
                  />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="flex items-center gap-2 px-4 py-2 bg-tennis-yellow text-black rounded-lg font-medium hover:bg-tennis-yellow/80 transition-all"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeedChange(-0.25)}
                      className="px-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-white text-xs font-mono min-w-[40px] text-center">
                      {playbackSpeed.current.toFixed(2)}x
                    </span>
                    <button
                      onClick={() => handleSpeedChange(0.25)}
                      className="px-2 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Opacity Control */}
            <div className="mb-4">
              <label className="text-xs text-white/50 mb-2 block">
                Opacity: {(opacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-tennis-yellow"
              />
            </div>

            {/* Pattern Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/50">Show Hot Zones</label>
              <button
                onClick={() => setShowPatterns(!showPatterns)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  showPatterns ? 'bg-tennis-yellow text-black' : 'bg-white/10 text-white'
                }`}
              >
                {showPatterns ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Detected Patterns Summary */}
            {patterns.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-xs text-white/50 mb-2">
                  Detected Patterns ({patterns.length})
                </div>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      onClick={() => setSelectedPattern(pattern.id)}
                      className={`p-2 rounded-lg cursor-pointer transition-all ${
                        selectedPattern === pattern.id
                          ? 'bg-tennis-yellow/20 border border-tennis-yellow'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white text-xs font-medium">{pattern.name}</div>
                      <div className="text-white/50 text-xs truncate">{pattern.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Color Legend */}
      <Html
        position={[-1, 1, courtLength / 2]}
        distanceFactor={40}
      >
        <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-xl">
          <div className="text-xs text-white/50 mb-2">Intensity</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-20 rounded" style={{
              background: 'linear-gradient(to top, rgb(0, 0, 255), rgb(0, 255, 255), rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0))'
            }} />
            <div className="text-xs text-white space-y-2">
              <div>High</div>
              <div className="text-white/50">Med</div>
              <div>Low</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default HeatMapOverlay;
