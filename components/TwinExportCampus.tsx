import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Edges, Line, OrbitControls } from '@react-three/drei';
import type { FeatureData } from '../types';
import { courtFeature, roomFeature } from '../twin/adapter';
import type { PublicCampusExport, TwinCourt, TwinRoom } from '../twin/types';
import TwinExportFallback from './twin/TwinExportFallback';

type Props = {
  data: PublicCampusExport;
  selectedId: string | null;
  onSelect: (feature: FeatureData) => void;
};

class TwinWebGLErrorBoundary extends React.Component<
  { onFail: () => void; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const Court: React.FC<{
  court: TwinCourt;
  active: boolean;
  hovered: boolean;
  onHover: (id: number | null) => void;
  onSelect: () => void;
  kitchenDepth: number;
  netHeight: number;
}> = ({ court, active, hovered, onHover, onSelect, kitchenDepth, netHeight }) => {
  const signal = active || hovered;
  const kitchenW = court.orientation === 'v' ? court.width : kitchenDepth;
  const kitchenD = court.orientation === 'v' ? kitchenDepth : court.depth;
  const kitchenOffset = court.orientation === 'v'
    ? [0, 0, kitchenDepth / 2] as [number, number, number]
    : [kitchenDepth / 2, 0, 0] as [number, number, number];
  const netSize = court.orientation === 'v'
    ? [court.width, netHeight, 0.035] as [number, number, number]
    : [0.035, netHeight, court.depth] as [number, number, number];

  return (
    <group
      position={[court.x, 0, court.z]}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(court.id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[court.width, 0.09, court.depth]} />
        <meshStandardMaterial
          color={signal ? '#41644a' : '#294a3a'}
          roughness={0.82}
          metalness={0.02}
        />
        <Edges color={signal ? '#DFFF4F' : '#7b9892'} threshold={15} />
      </mesh>

      {[-1, 1].map((direction) => (
        <mesh
          key={direction}
          position={[
            kitchenOffset[0] * direction,
            0.097,
            kitchenOffset[2] * direction,
          ]}
        >
          <boxGeometry args={[kitchenW, 0.012, kitchenD]} />
          <meshBasicMaterial color="#163c51" transparent opacity={0.42} />
        </mesh>
      ))}

      <mesh position={[0, netHeight / 2 + 0.09, 0]}>
        <boxGeometry args={netSize} />
        <meshBasicMaterial color="#dce7e5" transparent opacity={0.34} />
      </mesh>
    </group>
  );
};

const Room: React.FC<{
  room: TwinRoom;
  active: boolean;
  onSelect: () => void;
}> = ({ room, active, onSelect }) => (
  <mesh
    position={[room.x, 1.1, room.z]}
    onClick={(event) => {
      event.stopPropagation();
      onSelect();
    }}
  >
    <boxGeometry args={[room.width, 2.2, room.depth]} />
    <meshStandardMaterial
      color={active ? '#DFFF4F' : '#7490a1'}
      transparent
      opacity={active ? 0.16 : 0.065}
      roughness={0.62}
    />
    <Edges color={active ? '#DFFF4F' : '#6e8ca6'} threshold={15} />
  </mesh>
);

const FacilityModel: React.FC<Props> = ({ data, selectedId, onSelect }) => {
  const [hoveredCourt, setHoveredCourt] = React.useState<number | null>(null);
  const { courtArea, officeWing, entrance } = data.facility;

  return (
    <group>
      <mesh position={[8, -0.08, 0]}>
        <boxGeometry args={[68, 0.12, 66]} />
        <meshStandardMaterial color="#09182a" roughness={1} />
      </mesh>

      <mesh position={[0, -0.015, 0]}>
        <boxGeometry args={[courtArea.width, 0.05, courtArea.depth]} />
        <meshStandardMaterial color="#0c2033" roughness={0.98} />
        <Edges color="#45657a" threshold={15} />
      </mesh>

      <mesh position={[officeWing.x, 1.7, officeWing.z]}>
        <boxGeometry args={[officeWing.width, 3.4, officeWing.depth]} />
        <meshStandardMaterial color="#173049" transparent opacity={0.14} roughness={0.78} />
        <Edges color="#55748a" threshold={15} />
      </mesh>

      {data.facility.fireZoneZ.map((z) => (
        <Line
          key={z}
          points={[
            [-courtArea.width / 2, 0.08, z],
            [courtArea.width / 2, 0.08, z],
          ]}
          color="#9fd7e8"
          transparent
          opacity={0.16}
          lineWidth={1}
        />
      ))}

      {data.courts.map((court) => (
        <Court
          key={court.id}
          court={court}
          active={selectedId === `court-${court.id}`}
          hovered={hoveredCourt === court.id}
          onHover={setHoveredCourt}
          onSelect={() => onSelect(courtFeature(court))}
          kitchenDepth={data.courtSpec.kitchenDepth}
          netHeight={data.courtSpec.netHeight}
        />
      ))}

      {data.rooms.map((room) => (
        <Room
          key={room.id}
          room={room}
          active={selectedId === `room-${room.id}`}
          onSelect={() => onSelect(roomFeature(room))}
        />
      ))}

      <mesh position={[entrance.x, 0.13, entrance.z]}>
        <boxGeometry args={[entrance.width, 0.12, 0.5]} />
        <meshBasicMaterial color="#DFFF4F" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

const TwinExportCampus: React.FC<Props> = ({ data, selectedId, onSelect }) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <TwinExportFallback
        data={data}
        selectedId={selectedId}
        onSelect={onSelect}
        reason="WebGL unavailable · structural export fallback"
      />
    );
  }

  return (
    <div className="ace-real-twin absolute inset-0">
      {!ready && (
        <TwinExportFallback
          data={data}
          selectedId={selectedId}
          onSelect={onSelect}
          reason="Resolving exported geometry"
        />
      )}

      <TwinWebGLErrorBoundary onFail={() => setFailed(true)}>
        <div className={`absolute inset-0 transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Canvas
            camera={{ position: [58, 48, 72], fov: 42, near: 0.1, far: 220 }}
            frameloop="demand"
            dpr={[1, 1.4]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            onCreated={() => setReady(true)}
          >
            <color attach="background" args={['#071426']} />
            <hemisphereLight intensity={1.25} color="#e9f1ed" groundColor="#071426" />
            <directionalLight position={[18, 42, 24]} intensity={1.2} color="#eef5e9" />
            <FacilityModel data={data} selectedId={selectedId} onSelect={onSelect} />
            <OrbitControls
              makeDefault
              enableDamping
              dampingFactor={0.075}
              target={[8, 0, 0]}
              minDistance={34}
              maxDistance={118}
              maxPolarAngle={Math.PI / 2.04}
              autoRotate={false}
            />
          </Canvas>
        </div>
      </TwinWebGLErrorBoundary>

      <div className="ace-twin-export-badge">
        <span>ACE DIGITAL TWIN · STRUCTURAL EXPORT</span>
        <small>{data.source.exportId} · SPEC geometry · runtime state excluded</small>
      </div>
      <div className="ace-twin-hint">drag to orbit · scroll to zoom · select geometry for context</div>
    </div>
  );
};

export default TwinExportCampus;
