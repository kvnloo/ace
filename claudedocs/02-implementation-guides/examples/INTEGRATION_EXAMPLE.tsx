/**
 * INTEGRATION EXAMPLE
 *
 * This file demonstrates how to integrate heat maps into the existing ThreeScene.tsx
 * Copy the relevant sections into your ThreeScene.tsx file
 */

import React, { useState } from 'react';
import TennisCourtWithHeatMap from '../components/TennisCourtWithHeatMap';
import HeatMapOverlay, { HeatMapPattern } from '../components/HeatMapOverlay';
import { Activity } from 'lucide-react';

// ============================================================================
// STEP 1: Add state management to your scene component
// ============================================================================

const ThreeSceneWithHeatMaps = () => {
  // Add these state variables to ThreeScene component
  const [showHeatMaps, setShowHeatMaps] = useState(false);
  const [heatMapDataType, setHeatMapDataType] = useState<'player_position' | 'ball_impact' | 'serve_placement' | 'tactical_pattern'>('player_position');
  const [detectedPatterns, setDetectedPatterns] = useState<Map<string, HeatMapPattern[]>>(new Map());

  // Pattern detection handler
  const handlePatternDetected = (courtId: string) => (pattern: HeatMapPattern) => {
    setDetectedPatterns((prev) => {
      const updated = new Map(prev);
      const patterns = updated.get(courtId) || [];
      if (!patterns.find(p => p.id === pattern.id)) {
        updated.set(courtId, [...patterns, pattern]);
      }
      return updated;
    });
  };

  return null; // See below for implementation
};

// ============================================================================
// STEP 2: Update GroundFloor component to use TennisCourtWithHeatMap
// ============================================================================

const GroundFloorWithHeatMaps = ({
  active,
  showMeasurements,
  showLabels,
  showHeatMaps, // NEW PROP
  heatMapDataType, // NEW PROP
  onPatternDetected, // NEW PROP
}: {
  active: boolean;
  showMeasurements: boolean;
  showLabels: boolean;
  showHeatMaps?: boolean;
  heatMapDataType?: 'player_position' | 'ball_impact' | 'serve_placement' | 'tactical_pattern';
  onPatternDetected?: (courtId: string) => (pattern: HeatMapPattern) => void;
}) => {
  const courts = [];

  for (let i = 0; i < 24; i++) {
    let type: 'hard' | 'clay' | 'grass' | 'wood' = 'hard';
    if (i >= 6 && i < 12) type = 'clay';
    if (i >= 12 && i < 18) type = 'grass';
    if (i >= 18) type = 'wood';

    const row = Math.floor(i / 6);
    const col = i % 6;
    const courtId = `ground_court_${i}`;

    courts.push(
      showHeatMaps ? (
        // NEW: Use enhanced component with heat map
        <TennisCourtWithHeatMap
          key={i}
          type={type}
          position={[-35 + col * 14, 0.1, -40 + row * 26]}
          courtId={courtId}
          showHeatMapByDefault={true}
          enableHeatMapToggle={false} // Controlled globally
          onPatternDetected={onPatternDetected?.(courtId)}
        />
      ) : (
        // EXISTING: Original TennisCourt component
        <TennisCourt
          key={i}
          type={type}
          position={[-35 + col * 14, 0.1, -40 + row * 26]}
        />
      )
    );
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Existing FloorPlate */}
      <FloorPlate
        position={[0, 0, 0]}
        size={[BUILDING_WIDTH - 10, BUILDING_DEPTH - 10]}
        level={0}
        isActiveFloor={active}
        showMeasurements={showMeasurements}
      />

      {/* Courts with optional heat maps */}
      {courts}

      {/* Existing components (seating, reception, locker rooms, etc.) */}
    </group>
  );
};

// ============================================================================
// STEP 3: Add heat map controls to ControlsOverlay
// ============================================================================

const ControlsOverlayWithHeatMaps = ({
  activeFloor,
  setActiveFloor,
  annotationMode,
  setAnnotationMode,
  showHeatMaps, // NEW PROP
  setShowHeatMaps, // NEW PROP
  heatMapDataType, // NEW PROP
  setHeatMapDataType, // NEW PROP
  totalPatterns, // NEW PROP
}: {
  activeFloor: FloorLevel;
  setActiveFloor: (f: FloorLevel) => void;
  annotationMode: AnnotationMode;
  setAnnotationMode: (m: AnnotationMode) => void;
  showHeatMaps?: boolean;
  setShowHeatMaps?: (show: boolean) => void;
  heatMapDataType?: 'player_position' | 'ball_impact' | 'serve_placement' | 'tactical_pattern';
  setHeatMapDataType?: (type: 'player_position' | 'ball_impact' | 'serve_placement' | 'tactical_pattern') => void;
  totalPatterns?: number;
}) => {
  return (
    <div className="absolute top-40 left-6 z-10 flex flex-col gap-4 pointer-events-none">
      {/* Existing Floor Selector */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        {/* ... existing floor controls ... */}
      </div>

      {/* Existing Annotation Toggles */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        {/* ... existing annotation controls ... */}
      </div>

      {/* NEW: Heat Map Controls */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3 h-3" /> Heat Maps
        </div>

        {/* Toggle Heat Maps */}
        <button
          onClick={() => setShowHeatMaps?.(!showHeatMaps)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            showHeatMaps
              ? 'bg-tennis-yellow text-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          {showHeatMaps ? 'Enabled' : 'Disabled'}
          {totalPatterns && totalPatterns > 0 && (
            <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {totalPatterns}
            </span>
          )}
        </button>

        {/* Data Type Selector (when enabled) */}
        {showHeatMaps && (
          <div className="px-2 pb-2 space-y-1">
            <div className="text-xs text-white/30 mb-1">Data Type</div>
            {[
              { type: 'player_position' as const, label: 'Player', icon: '👤' },
              { type: 'ball_impact' as const, label: 'Ball', icon: '🎾' },
              { type: 'serve_placement' as const, label: 'Serve', icon: '🎯' },
              { type: 'tactical_pattern' as const, label: 'Tactics', icon: '📊' },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setHeatMapDataType?.(type)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  heatMapDataType === type
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:bg-white/10'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// STEP 4: Update main ThreeScene component
// ============================================================================

const ThreeSceneComplete = ({ onFeatureSelect }: { onFeatureSelect: (feature: FeatureData) => void }) => {
  // EXISTING STATE
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('LABELS');
  const controlsRef = useRef<any>(null);
  const isAnimatingRef = useRef(false);

  // NEW STATE FOR HEAT MAPS
  const [showHeatMaps, setShowHeatMaps] = useState(false);
  const [heatMapDataType, setHeatMapDataType] = useState<'player_position' | 'ball_impact' | 'serve_placement' | 'tactical_pattern'>('player_position');
  const [detectedPatterns, setDetectedPatterns] = useState<Map<string, HeatMapPattern[]>>(new Map());

  // Pattern detection handler
  const handlePatternDetected = (courtId: string) => (pattern: HeatMapPattern) => {
    setDetectedPatterns((prev) => {
      const updated = new Map(prev);
      const patterns = updated.get(courtId) || [];
      if (!patterns.find(p => p.id === pattern.id)) {
        updated.set(courtId, [...patterns, pattern]);
      }
      return updated;
    });
  };

  // Calculate total patterns
  const totalPatterns = Array.from(detectedPatterns.values()).reduce(
    (sum, patterns) => sum + patterns.length,
    0
  );

  const showLabels = annotationMode === 'LABELS';
  const showMeasurements = annotationMode === 'MEASUREMENTS';

  return (
    <div className="w-full h-full absolute inset-0">
      {/* UPDATED: Controls with heat map options */}
      <ControlsOverlayWithHeatMaps
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        annotationMode={annotationMode}
        setAnnotationMode={setAnnotationMode}
        showHeatMaps={showHeatMaps}
        setShowHeatMaps={setShowHeatMaps}
        heatMapDataType={heatMapDataType}
        setHeatMapDataType={setHeatMapDataType}
        totalPatterns={totalPatterns}
      />

      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [180, 100, 180], fov: 35 }}>
        <CameraRig activeFloor={activeFloor} controlsRef={controlsRef} isAnimatingRef={isAnimatingRef} />
        <PerspectiveCamera makeDefault fov={40} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[-80, 150, 100]}
          intensity={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        >
          <orthographicCamera attach="shadow-camera" args={[-150, 150, 150, -150]} />
        </directionalLight>
        <Environment preset="park" />

        <group>
          <BuildingShell activeFloor={activeFloor} />
          <CampusGrounds />

          {/* UPDATED: Pass heat map props to floor components */}
          {(activeFloor === 'ALL' || activeFloor === 0) && (
            <GroundFloorWithHeatMaps
              active={activeFloor === 0}
              showMeasurements={showMeasurements}
              showLabels={showLabels}
              showHeatMaps={showHeatMaps}
              heatMapDataType={heatMapDataType}
              onPatternDetected={handlePatternDetected}
            />
          )}
          {(activeFloor === 'ALL' || activeFloor === 1) && <LevelOne active={activeFloor === 1} showMeasurements={showMeasurements} />}
          {(activeFloor === 'ALL' || activeFloor === 2) && <LevelTwo active={activeFloor === 2} showMeasurements={showMeasurements} />}
          {(activeFloor === 'ALL' || activeFloor === 3) && <LevelThree active={activeFloor === 3} showMeasurements={showMeasurements} />}

          {/* Existing markers */}
          {FEATURES.map((f) => {
            // ... existing marker code ...
          })}

          <ContactShadows position={[0, -0.2, 0]} opacity={0.6} scale={400} blur={3} far={20} color="#000" />
        </group>

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={400}
          makeDefault
          onStart={() => { isAnimatingRef.current = false; }}
        />
      </Canvas>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 text-xs pointer-events-none select-none font-mono text-center">
        ECO-FACILITY VIEWER v3.4 • HEAT MAP ANALYTICS
        {totalPatterns > 0 && (
          <div className="text-tennis-yellow mt-1">
            {totalPatterns} tactical patterns detected
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ALTERNATIVE: Simple overlay approach (no component replacement)
// ============================================================================

// If you prefer to keep existing TennisCourt components unchanged,
// you can overlay heat maps conditionally:

const SimpleOverlayApproach = () => {
  const courts = []; // Your existing court array

  return (
    <group>
      {/* Existing courts */}
      {courts.map((court, i) => (
        <TennisCourt key={i} {...court} />
      ))}

      {/* Conditional heat map overlays */}
      {showHeatMaps && courts.map((court, i) => (
        <HeatMapOverlay
          key={`heatmap_${i}`}
          position={court.position}
          courtWidth={10}
          courtLength={22}
          courtId={`court_${i}`}
          courtType={court.type}
          initialDataType={heatMapDataType}
          showControls={i === 0} // Only show controls on first court
        />
      ))}
    </group>
  );
};

export {
  ThreeSceneWithHeatMaps,
  GroundFloorWithHeatMaps,
  ControlsOverlayWithHeatMaps,
  ThreeSceneComplete,
  SimpleOverlayApproach,
};

/**
 * IMPLEMENTATION STEPS:
 *
 * 1. Import required components at top of ThreeScene.tsx:
 *    import TennisCourtWithHeatMap from './TennisCourtWithHeatMap';
 *    import HeatMapOverlay, { HeatMapPattern } from './HeatMapOverlay';
 *    import { Activity } from 'lucide-react';
 *
 * 2. Add state variables to ThreeScene component (see STEP 1)
 *
 * 3. Update GroundFloor component to accept new props (see STEP 2)
 *
 * 4. Update ControlsOverlay component to include heat map controls (see STEP 3)
 *
 * 5. Update main ThreeScene component with heat map state management (see STEP 4)
 *
 * 6. Test by toggling heat maps on/off via controls panel
 *
 * 7. Replace mock data with real tracking data when available
 */
