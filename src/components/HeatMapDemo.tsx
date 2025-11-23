import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { Activity, Map, TrendingUp, Target, Zap } from 'lucide-react';
import HeatMapOverlay, { HeatMapDataType, HeatMapMode, HeatMapPattern } from './HeatMapOverlay';

/**
 * Heat Map Demonstration Component
 *
 * Interactive demo showcasing heat map visualization capabilities:
 * - Multiple court types with different data visualizations
 * - Side-by-side comparison mode
 * - Pattern recognition alerts
 * - Performance metrics dashboard
 */

interface CourtDemo {
  id: string;
  name: string;
  type: 'hard' | 'clay' | 'grass' | 'wood';
  position: [number, number, number];
  dataType: HeatMapDataType;
  color: string;
}

const DEMO_COURTS: CourtDemo[] = [
  {
    id: 'court_hard_1',
    name: 'Hard Court - Player Movement',
    type: 'hard',
    position: [0, 0, 0],
    dataType: 'player_position',
    color: '#3b82f6',
  },
  {
    id: 'court_clay_1',
    name: 'Clay Court - Ball Impact',
    type: 'clay',
    position: [15, 0, 0],
    dataType: 'ball_impact',
    color: '#ea580c',
  },
  {
    id: 'court_grass_1',
    name: 'Grass Court - Serve Placement',
    type: 'grass',
    position: [30, 0, 0],
    dataType: 'serve_placement',
    color: '#4d7c0f',
  },
];

const SimpleTennisCourt: React.FC<{
  position: [number, number, number];
  type: 'hard' | 'clay' | 'grass' | 'wood';
  color: string;
}> = ({ position, type, color }) => {
  const courtWidth = 10;
  const courtLength = 22;

  return (
    <group position={position}>
      {/* Court Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[courtWidth, courtLength]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Court Lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8.23, 21]} />
        <meshBasicMaterial color="white" wireframe opacity={0.8} transparent />
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[8.2, 20.9]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </mesh>

      {/* Net */}
      <group position={[0, 1, 0]}>
        <mesh position={[-courtWidth / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[courtWidth / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[courtWidth, 1.8, 0.02]} />
          <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
        </mesh>
      </group>
    </group>
  );
};

const HeatMapDemo: React.FC = () => {
  const [activeCourt, setActiveCourt] = useState<string | null>(null);
  const [detectedPatterns, setDetectedPatterns] = useState<Map<string, HeatMapPattern[]>>(new Map());
  const [showAllMaps, setShowAllMaps] = useState(true);
  const [globalDataType, setGlobalDataType] = useState<HeatMapDataType>('player_position');

  const handlePatternDetected = (courtId: string) => (pattern: HeatMapPattern) => {
    setDetectedPatterns((prev) => {
      const updated = new Map(prev);
      const patterns = updated.get(courtId) || [];
      updated.set(courtId, [...patterns, pattern]);
      return updated;
    });
  };

  const totalPatterns = Array.from(detectedPatterns.values()).reduce(
    (sum, patterns) => sum + patterns.length,
    0
  );

  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-tennis-yellow rounded-lg">
                <Activity className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">Heat Map Analytics</h1>
                <p className="text-white/80 text-sm">Court Usage & Player Movement Visualization</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <Map className="w-4 h-4 text-tennis-yellow" />
                <span className="text-white text-sm font-medium">{DEMO_COURTS.length} Courts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm font-medium">{totalPatterns} Patterns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="absolute top-24 left-6 z-10 bg-slate-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4 w-80">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-tennis-yellow" />
            <h3 className="text-white font-bold text-sm">Visualization Controls</h3>
          </div>

          {/* Global Data Type Selector */}
          <div className="mb-4">
            <label className="text-xs text-white/80 mb-2 block">Global Data Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'player_position' as HeatMapDataType, label: 'Player', icon: '👤' },
                { type: 'ball_impact' as HeatMapDataType, label: 'Ball', icon: '🎾' },
                { type: 'serve_placement' as HeatMapDataType, label: 'Serve', icon: '🎯' },
                { type: 'tactical_pattern' as HeatMapDataType, label: 'Tactics', icon: '📊' },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => setGlobalDataType(type)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                    globalDataType === type
                      ? 'bg-tennis-yellow text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle All Heat Maps */}
          <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-lg">
            <span className="text-white text-sm">Show All Heat Maps</span>
            <button
              onClick={() => setShowAllMaps(!showAllMaps)}
              className={`px-4 py-1 rounded-lg text-xs font-medium transition-all ${
                showAllMaps ? 'bg-tennis-yellow text-black' : 'bg-white/10 text-white'
              }`}
            >
              {showAllMaps ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Court Selection */}
          <div>
            <label className="text-xs text-white/80 mb-2 block">Court Focus</label>
            <div className="space-y-2">
              {DEMO_COURTS.map((court) => (
                <button
                  key={court.id}
                  onClick={() => setActiveCourt(activeCourt === court.id ? null : court.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeCourt === court.id
                      ? 'bg-tennis-yellow text-black'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: court.color }}
                      />
                      <span className="text-sm font-medium">{court.name}</span>
                    </div>
                    {detectedPatterns.get(court.id) && (
                      <span className="text-xs bg-black/20 px-2 py-0.5 rounded">
                        {detectedPatterns.get(court.id)!.length} patterns
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Alerts */}
      {totalPatterns > 0 && (
        <div className="absolute top-24 right-6 z-10 bg-slate-900/95 backdrop-blur-md rounded-xl border border-green-500/30 shadow-2xl p-4 w-80">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-green-400" />
            <h3 className="text-white font-bold text-sm">Pattern Detection</h3>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {Array.from(detectedPatterns.entries()).map(([courtId, patterns]) =>
              patterns.map((pattern, idx) => (
                <div
                  key={`${courtId}-${idx}`}
                  className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-green-400 text-xs font-bold">{pattern.name}</span>
                    <span className="text-white/80 text-xs">
                      {(pattern.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-white/90 text-xs">{pattern.description}</p>
                  <div className="mt-2 text-xs text-white/80">
                    Court: {DEMO_COURTS.find(c => c.id === courtId)?.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[20, 25, 30]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[20, 40, 20]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Environment preset="sunset" />

        {/* Ground Grid */}
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={100}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />

        {/* Demo Courts with Heat Maps */}
        {DEMO_COURTS.map((court) => {
          const isActive = !activeCourt || activeCourt === court.id;
          const opacity = isActive ? 1 : 0.3;

          return (
            <group key={court.id} opacity={opacity}>
              <SimpleTennisCourt
                position={court.position}
                type={court.type}
                color={court.color}
              />

              {showAllMaps && (
                <HeatMapOverlay
                  position={court.position}
                  courtWidth={10}
                  courtLength={22}
                  courtId={court.id}
                  courtType={court.type}
                  initialMode="historical"
                  initialDataType={globalDataType}
                  showControls={activeCourt === court.id}
                  onPatternDetected={handlePatternDetected(court.id)}
                />
              )}
            </group>
          );
        })}

        <OrbitControls
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={10}
          maxDistance={100}
          target={[15, 0, 0]}
        />
      </Canvas>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/80 text-xs font-mono text-center pointer-events-none select-none">
        HEAT MAP ANALYTICS v1.0 • REAL-TIME COURT INTELLIGENCE
      </div>
    </div>
  );
};

export default HeatMapDemo;
