/**
 * Progressive Component Loading Example
 *
 * Demonstrates how to integrate React Three Fiber components with the AssetLoader
 * progressive loading system using the useAssetEnabled hook.
 */

import { useAssetEnabled, useAssetsEnabled, useAssetState } from '../../hooks/useAssetEnabled';

/**
 * EXAMPLE 1: Simple component with single asset dependency
 *
 * This component only renders when its asset is enabled by the loading system.
 */
export function TennisCourt({ id = 'tennis-court-1', position = [0, 0, 0] }) {
  const isEnabled = useAssetEnabled(id);

  // Don't render until AssetLoader enables this component
  if (!isEnabled) {
    return null;
  }

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[23.77, 0.1, 10.97]} />
        <meshStandardMaterial color="#2d5a3d" />
      </mesh>
    </group>
  );
}

/**
 * EXAMPLE 2: Component with multiple dependencies
 *
 * Court lines only render when ALL tennis courts are loaded.
 */
export function CourtLines() {
  const allCourtsEnabled = useAssetsEnabled([
    'tennis-court-1',
    'tennis-court-2',
    'tennis-court-3',
    'tennis-court-4'
  ]);

  if (!allCourtsEnabled) {
    return null;
  }

  return (
    <group>
      {/* White line markings across all courts */}
      <mesh position={[0, 0.11, 0]}>
        <planeGeometry args={[100, 0.05]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
}

/**
 * EXAMPLE 3: Progressive detail component
 *
 * Grass renders at different quality levels based on which assets are enabled.
 */
export function GrassSystem() {
  const bladesEnabled = useAssetEnabled('grass-blades');
  const physicsEnabled = useAssetEnabled('grass-physics');
  const mowersEnabled = useAssetEnabled('robotic-mowers');

  // Phase 1: No grass (disabled)
  if (!bladesEnabled) {
    return null;
  }

  // Phase 2: Static grass blades
  return (
    <group>
      <GrassBlades />

      {/* Phase 3: Add physics/wind */}
      {physicsEnabled && <GrassPhysics />}

      {/* Phase 4: Add robotic mowers */}
      {mowersEnabled && <RoboticMowers />}
    </group>
  );
}

/**
 * EXAMPLE 4: Debug component showing asset state
 *
 * Useful for development to see what's enabled.
 */
export function AssetDebugOverlay({ assetId }: { assetId: string }) {
  const { enabled, asset } = useAssetState(assetId);

  if (!asset) {
    return <div>Asset not found: {assetId}</div>;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        padding: '8px',
        background: enabled ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
        border: `2px solid ${enabled ? 'green' : 'red'}`,
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}
    >
      <div><strong>{asset.name}</strong></div>
      <div>Status: {enabled ? '✅ Enabled' : '❌ Disabled'}</div>
      <div>Cost: {asset.performanceCost}/10</div>
      <div>Type: {asset.type}</div>
    </div>
  );
}

/**
 * EXAMPLE 5: Fallback component for failed assets
 *
 * Shows a simple fallback when the real asset fails to load.
 */
export function FallbackCourt({ id = 'tennis-court-1' }) {
  const { enabled, asset } = useAssetState(id);

  // If asset is successfully enabled, don't show fallback
  if (enabled && asset) {
    return null;
  }

  // Show simple fallback mesh
  return (
    <mesh>
      <boxGeometry args={[23.77, 0.1, 10.97]} />
      <meshBasicMaterial color="#444" wireframe />
    </mesh>
  );
}

// Placeholder components for the example
function GrassBlades() {
  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#3a5f2d" />
    </mesh>
  );
}

function GrassPhysics() {
  return null; // Physics system, no visual component
}

function RoboticMowers() {
  return (
    <group>
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[i * 10, 0.5, 0]}>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="#ff6600" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * USAGE IN MAIN SCENE:
 *
 * ```tsx
 * import { TennisCourt, CourtLines, GrassSystem } from './components/examples/ProgressiveComponent.example';
 * import { AssetLoader } from './services/loading/AssetLoader';
 *
 * function Scene() {
 *   useEffect(() => {
 *     // Start progressive loading
 *     const loader = new AssetLoader(assetRegistry, debugContext);
 *     loader.start();
 *   }, []);
 *
 *   return (
 *     <Canvas>
 *       {/* These components will progressively appear as AssetLoader enables them */}
 *       <TennisCourt id="tennis-court-1" position={[0, 0, 0]} />
 *       <TennisCourt id="tennis-court-2" position={[30, 0, 0]} />
 *       <TennisCourt id="tennis-court-3" position={[0, 0, 30]} />
 *       <TennisCourt id="tennis-court-4" position={[30, 0, 30]} />
 *
 *       <CourtLines />
 *       <GrassSystem />
 *     </Canvas>
 *   );
 * }
 * ```
 *
 * LOADING SEQUENCE:
 * 1. Page loads, all components return null (disabled)
 * 2. AssetLoader.start() begins
 * 3. Phase ESSENTIAL enables tennis courts 1-4
 * 4. Components detect via useAssetEnabled, re-render
 * 5. Phase CORE enables court-lines
 * 6. CourtLines component renders after all dependencies met
 * 7. Phase VISUAL enables grass-blades
 * 8. GrassSystem renders static grass
 * 9. Phase ENHANCED enables grass-physics and robotic-mowers
 * 10. GrassSystem adds animated elements
 */
