import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Eye, EyeOff } from 'lucide-react';
import HeatMapOverlay, { HeatMapDataType, HeatMapPattern } from './HeatMapOverlay';
import { getCourtTexture, type CourtSurfaceType } from '@/utils/courtTextures';
import Grass from './Grass';
import ClayCourtEffect from './ClayCourtEffect';

/**
 * Enhanced Tennis Court with Integrated Heat Map Visualization
 *
 * Combines existing court rendering with heat map analytics overlay.
 * Drop-in replacement for TennisCourt component with analytics capabilities.
 */

interface TennisCourtWithHeatMapProps {
  position: [number, number, number];
  type: 'grass' | 'hard' | 'clay' | 'wood';
  courtId?: string;
  showHeatMapByDefault?: boolean;
  enableHeatMapToggle?: boolean;
  onPatternDetected?: (pattern: HeatMapPattern) => void;
}

const Net: React.FC<{ width: number }> = ({ width }) => (
  <group position={[0, 1, 0]}>
    <mesh position={[-width / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 2]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[width / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 2]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[width, 1.8, 0.02]} />
      <meshBasicMaterial color="white" transparent opacity={0.3} wireframe />
    </mesh>
  </group>
);

const TennisCourtWithHeatMap: React.FC<TennisCourtWithHeatMapProps> = ({
  position,
  type,
  courtId = `court_${type}_${Math.random().toString(36).substr(2, 9)}`,
  showHeatMapByDefault = false,
  enableHeatMapToggle = true,
  onPatternDetected,
}) => {
  const [showHeatMap, setShowHeatMap] = useState(showHeatMapByDefault);
  const [heatMapDataType, setHeatMapDataType] = useState<HeatMapDataType>('player_position');
  const [detectedPatterns, setDetectedPatterns] = useState<HeatMapPattern[]>([]);

  const courtWidth = 10;
  const courtLength = 22;

  const colors = {
    grass: '#4d7c0f',
    hard: '#3b82f6',
    clay: '#ea580c',
    wood: '#d4a373',
  };

  const handlePatternDetected = (pattern: HeatMapPattern) => {
    setDetectedPatterns((prev) => {
      // Avoid duplicates
      if (prev.find((p) => p.id === pattern.id)) return prev;
      return [...prev, pattern];
    });

    // Notify parent component
    if (onPatternDetected) {
      onPatternDetected(pattern);
    }
  };

  // Use enhanced ClayCourtEffect for clay courts
  if (type === 'clay') {
    return (
      <group position={position}>
        <ClayCourtEffect position={[0, 0, 0]} width={courtWidth} length={courtLength} />
        <Net width={courtWidth} />

        {showHeatMap && (
          <HeatMapOverlay
            position={[0, 0, 0]}
            courtWidth={courtWidth}
            courtLength={courtLength}
            courtId={courtId}
            courtType={type}
            initialDataType={heatMapDataType}
            showControls={true}
            onPatternDetected={handlePatternDetected}
          />
        )}

        {enableHeatMapToggle && (
          <HeatMapToggleButton
            position={[courtWidth / 2 + 2, 1, courtLength / 2]}
            showHeatMap={showHeatMap}
            onToggle={() => setShowHeatMap(!showHeatMap)}
            dataType={heatMapDataType}
            onDataTypeChange={setHeatMapDataType}
            patternCount={detectedPatterns.length}
          />
        )}
      </group>
    );
  }

  // Get texture configuration for the court type
  const textureConfig = React.useMemo(() => getCourtTexture(type as CourtSurfaceType), [type]);

  return (
    <group position={position}>
      {/* Main court surface with textures */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[courtWidth, courtLength]} />
        <meshStandardMaterial
          color={textureConfig.color}
          map={textureConfig.map}
          normalMap={textureConfig.normalMap}
          roughnessMap={textureConfig.roughnessMap}
          roughness={textureConfig.roughness}
          metalness={textureConfig.metalness || 0}
        />
      </mesh>

      {/* Grass blades for grass courts */}
      {type === 'grass' && (
        <Grass
          position={[0, 0.1, 0]}
          size={[courtWidth, courtLength]}
          bladeCount={1500}
          color="#4d7c0f"
          animated={true}
        />
      )}

      {/* Court lines and boundaries */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[8, 20]} />
        <meshBasicMaterial color="white" wireframe={false} transparent opacity={0.8} />
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[7.8, 19.8]} />
          <meshBasicMaterial color={colors[type]} />
        </mesh>
      </mesh>

      <Net width={courtWidth} />

      {/* Heat Map Overlay */}
      {showHeatMap && (
        <HeatMapOverlay
          position={[0, 0, 0]}
          courtWidth={courtWidth}
          courtLength={courtLength}
          courtId={courtId}
          courtType={type}
          initialDataType={heatMapDataType}
          showControls={true}
          onPatternDetected={handlePatternDetected}
        />
      )}

      {/* Toggle Button */}
      {enableHeatMapToggle && (
        <HeatMapToggleButton
          position={[courtWidth / 2 + 2, 1, courtLength / 2]}
          showHeatMap={showHeatMap}
          onToggle={() => setShowHeatMap(!showHeatMap)}
          dataType={heatMapDataType}
          onDataTypeChange={setHeatMapDataType}
          patternCount={detectedPatterns.length}
        />
      )}
    </group>
  );
};

/**
 * Compact toggle button for heat map visibility
 */
interface HeatMapToggleButtonProps {
  position: [number, number, number];
  showHeatMap: boolean;
  onToggle: () => void;
  dataType: HeatMapDataType;
  onDataTypeChange: (type: HeatMapDataType) => void;
  patternCount: number;
}

const HeatMapToggleButton: React.FC<HeatMapToggleButtonProps> = ({
  position,
  showHeatMap,
  onToggle,
  dataType,
  onDataTypeChange,
  patternCount,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Html position={position} center distanceFactor={40}>
      <div className="relative">
        {/* Main Toggle Button */}
        <button
          onClick={onToggle}
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all shadow-2xl ${showHeatMap
              ? 'bg-tennis-yellow text-black'
              : 'bg-slate-900/95 text-white border border-white/10'
            }`}
        >
          {showHeatMap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span className="text-sm">Heat Map</span>
          {patternCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {patternCount}
            </span>
          )}
        </button>

        {/* Expanded Options */}
        {expanded && showHeatMap && (
          <div className="absolute top-full mt-2 left-0 bg-slate-900/95 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl p-3 min-w-[200px] z-50">
            <div className="text-xs text-white/50 mb-2">Data Type</div>
            <div className="space-y-1">
              {[
                { type: 'player_position' as HeatMapDataType, label: 'Player Movement', icon: '👤' },
                { type: 'ball_impact' as HeatMapDataType, label: 'Ball Impact', icon: '🎾' },
                { type: 'serve_placement' as HeatMapDataType, label: 'Serve Zones', icon: '🎯' },
                { type: 'tactical_pattern' as HeatMapDataType, label: 'Tactics', icon: '📊' },
              ].map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => onDataTypeChange(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${dataType === type
                      ? 'bg-tennis-yellow text-black'
                      : 'text-white hover:bg-white/10'
                    }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

export default TennisCourtWithHeatMap;
