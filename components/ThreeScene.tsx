import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { FeatureData } from '../types';
import { CAMPUS_BLUEPRINT, getCampusCamera, Vec3 } from './campusBlueprint';

type Quality = 'balanced' | 'performance';
type CameraMode = 'arrival' | 'orbit';

const glass = { color: '#b9e5e6', transmission: 0.72, opacity: 0.64, transparent: true, roughness: 0.13, metalness: 0.08, thickness: 1.3 };
const structure = { color: '#f4f0e8', roughness: 0.46, metalness: 0.02 };

function CameraDirector({ mode, controlsRef }: { mode: CameraMode; controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const destination = getCampusCamera(mode);
  const moving = useRef(true);

  useEffect(() => { moving.current = mode === 'arrival'; }, [mode]);
  useFrame((_, delta) => {
    if (!moving.current || !controlsRef.current) return;
    const alpha = 1 - Math.exp(-3.2 * delta);
    camera.position.lerp(new THREE.Vector3(...destination.position), alpha);
    controlsRef.current.target.lerp(new THREE.Vector3(...destination.target), alpha);
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    perspectiveCamera.fov = THREE.MathUtils.lerp(perspectiveCamera.fov, destination.fov, alpha);
    perspectiveCamera.updateProjectionMatrix();
    controlsRef.current.update();
    if (camera.position.distanceTo(new THREE.Vector3(...destination.position)) < 0.05) moving.current = false;
  });
  return null;
}

function Court({ position, color }: { position: Vec3; color: string }) {
  return <group position={position}>
    <RoundedBox args={[40, 0.8, 28]} radius={1.4} smoothness={4} receiveShadow><meshStandardMaterial color={color} roughness={0.78} /></RoundedBox>
    {[ -12, 0, 12 ].map((x) => <mesh key={x} position={[x, 0.44, 0]}><boxGeometry args={[0.28, 0.05, 24]} /><meshBasicMaterial color="#f7f3e8" /></mesh>)}
    {[-11, 11].map((z) => <mesh key={z} position={[0, 0.44, z]}><boxGeometry args={[36, 0.05, 0.28]} /><meshBasicMaterial color="#f7f3e8" /></mesh>)}
    <mesh position={[0, 1.5, 0]}><boxGeometry args={[38, 2.5, 0.12]} /><meshStandardMaterial color="#e9eef0" transparent opacity={0.55} wireframe /></mesh>
  </group>;
}

function LivingWall({ position, quality }: { position: Vec3; quality: Quality }) {
  const rows = quality === 'balanced' ? 8 : 5;
  return <group position={position}>
    <RoundedBox args={[34, 26, 1.1]} radius={2} smoothness={4}><meshStandardMaterial color="#214d36" roughness={0.95} /></RoundedBox>
    {Array.from({ length: rows }).map((_, i) => <mesh key={i} position={[0, -10 + i * (20 / (rows - 1)), 0.7]}>
      <boxGeometry args={[31, 1.35, 0.75]} /><meshStandardMaterial color={i % 2 ? '#4c7a43' : '#6d914e'} roughness={1} />
    </mesh>)}
  </group>;
}

function Tower({ position, size, side, quality }: { position: Vec3; size: Vec3; side: 'west' | 'east'; quality: Quality }) {
  return <group position={position}>
    <RoundedBox args={size} radius={13} smoothness={quality === 'balanced' ? 10 : 5} castShadow receiveShadow>
      <meshPhysicalMaterial {...glass} envMapIntensity={0.65} />
    </RoundedBox>
    {CAMPUS_BLUEPRINT.floorElevations.map((y, i) => <RoundedBox key={y} position={[0, y - position[1], 0]} args={[size[0] + 2.2, 1.35, size[2] + 2.2]} radius={7} smoothness={5} castShadow>
      <meshStandardMaterial color={i === 4 ? '#e9e1d1' : '#f7f4ed'} roughness={0.38} />
    </RoundedBox>)}
    {Array.from({ length: 9 }).map((_, i) => <mesh key={i} position={[-22 + i * 5.5, 1, 33.5]}><boxGeometry args={[0.38, 54, 0.45]} /><meshStandardMaterial color="#d8e1df" /></mesh>)}
    <mesh position={[0, 35, 0]} rotation={[0, 0, side === 'west' ? -0.06 : 0.06]}><boxGeometry args={[40, 2, 54]} /><meshStandardMaterial color="#e7ddc9" roughness={0.45} /></mesh>
  </group>;
}

function Arch({ z, height }: { z: number; height: number }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-68, 1, z), new THREE.Vector3(-62, height * 0.62, z),
    new THREE.Vector3(0, height, z), new THREE.Vector3(62, height * 0.62, z), new THREE.Vector3(68, 1, z),
  ]), [z, height]);
  return <mesh castShadow><tubeGeometry args={[curve, 96, 2.25, 10, false]} /><meshStandardMaterial {...structure} /></mesh>;
}

function Architecture({ quality }: { quality: Quality }) {
  return <group>
    {CAMPUS_BLUEPRINT.towers.map((tower) => <Tower key={tower.id} {...tower} quality={quality} />)}
    <RoundedBox position={[0, 23, 0]} args={[32, 46, 54]} radius={9} smoothness={8} castShadow>
      <meshPhysicalMaterial {...glass} transmission={0.86} opacity={0.5} />
    </RoundedBox>
    {CAMPUS_BLUEPRINT.arches.map((arch) => <Arch key={arch.id} {...arch} />)}
    {CAMPUS_BLUEPRINT.bridges.map((bridge) => <group key={bridge.id} position={[0, bridge.y, 0]}>
      <RoundedBox args={[44, 3.2, 14]} radius={2.5} smoothness={5}><meshStandardMaterial {...structure} /></RoundedBox>
      <mesh position={[0, 2.1, 0]}><boxGeometry args={[39, 3.5, 12]} /><meshPhysicalMaterial {...glass} opacity={0.48} /></mesh>
    </group>)}
    {CAMPUS_BLUEPRINT.livingWalls.map((wall) => <LivingWall key={wall.id} {...wall} quality={quality} />)}
    <RoundedBox position={[0, 1.2, 31]} args={[52, 2.2, 30]} radius={6} smoothness={5}><meshStandardMaterial color="#ded6c8" roughness={0.7} /></RoundedBox>
  </group>;
}

function Site({ quality }: { quality: Quality }) {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[360, 320]} /><meshStandardMaterial color="#b8c1b2" roughness={0.95} /></mesh>
    <mesh position={[0, 0.08, 42]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[210, 70]} /><meshStandardMaterial color="#ded9cc" roughness={0.9} /></mesh>
    {CAMPUS_BLUEPRINT.courts.map((court) => <Court key={court.id} {...court} />)}
    {Array.from({ length: quality === 'balanced' ? 30 : 16 }).map((_, i) => {
      const x = -145 + (i % 15) * 20.5; const z = i < 15 ? -82 : 124;
      return <group key={i} position={[x, 0, z]}><mesh position={[0, 3, 0]}><cylinderGeometry args={[0.45, 0.65, 6, 8]} /><meshStandardMaterial color="#79583a" /></mesh><mesh position={[0, 8, 0]}><icosahedronGeometry args={[4.5, 1]} /><meshStandardMaterial color="#477044" roughness={1} /></mesh></group>;
    })}
  </group>;
}

function CampusScene({ quality, mode }: { quality: Quality; mode: CameraMode }) {
  const controlsRef = useRef<any>(null);
  const capture = new URLSearchParams(window.location.search).get('camera') === 'arrival';
  const arrivalCamera = getCampusCamera('arrival');
  return <Canvas shadows dpr={quality === 'balanced' ? [1, 1.5] : 1} camera={{ position: arrivalCamera.position, fov: arrivalCamera.fov }} gl={{ antialias: quality === 'balanced', toneMapping: THREE.ACESFilmicToneMapping }}>
    <color attach="background" args={['#dce9eb']} /><fog attach="fog" args={['#dce9eb', 210, 390]} />
    <hemisphereLight intensity={1.8} color="#f7fbff" groundColor="#81927c" />
    <directionalLight position={[-95, 150, 95]} intensity={3.1} castShadow shadow-mapSize={quality === 'balanced' ? [2048, 2048] : [1024, 1024]} shadow-camera-left={-180} shadow-camera-right={180} shadow-camera-top={150} shadow-camera-bottom={-150} />
    <Environment preset="city" environmentIntensity={0.55} />
    <Site quality={quality} /><Architecture quality={quality} />
    {quality === 'balanced' && <ContactShadows position={[0, 0.1, 0]} opacity={0.34} scale={300} blur={2.5} far={65} />}
    <OrbitControls ref={controlsRef} makeDefault enabled={!capture && mode === 'orbit'} target={getCampusCamera('arrival').target} minDistance={75} maxDistance={280} maxPolarAngle={Math.PI / 2.05} onStart={() => undefined} />
    <CameraDirector mode={capture ? 'arrival' : mode} controlsRef={controlsRef} />
  </Canvas>;
}

interface ThreeSceneProps { onFeatureSelect: (feature: FeatureData) => void }

const ThreeScene: React.FC<ThreeSceneProps> = () => {
  const params = new URLSearchParams(window.location.search);
  const [quality, setQuality] = useState<Quality>(params.get('quality') === 'performance' ? 'performance' : 'balanced');
  const [mode, setMode] = useState<CameraMode>('arrival');
  return <div className="absolute inset-0 bg-[#dce9eb]">
    <CampusScene quality={quality} mode={mode} />
    <div className="absolute left-6 top-28 z-20 rounded-2xl border border-white/60 bg-slate-950/70 p-2 shadow-2xl backdrop-blur-xl" aria-label="Campus view controls">
      <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">Exterior study</div>
      <div className="flex gap-1">{(['arrival', 'orbit'] as const).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider ${mode === item ? 'bg-tennis-yellow text-slate-950' : 'text-white hover:bg-white/10'}`}>{item}</button>)}</div>
      <div className="mt-2 flex gap-1 border-t border-white/10 pt-2">{(['balanced', 'performance'] as const).map((item) => <button key={item} onClick={() => setQuality(item)} className={`rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${quality === item ? 'bg-white text-slate-950' : 'text-white/60 hover:bg-white/10'}`}>{item}</button>)}</div>
    </div>
    <div className="pointer-events-none absolute bottom-7 left-7 rounded-xl border border-white/60 bg-white/75 px-4 py-3 text-slate-900 shadow-lg backdrop-blur-md"><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-800">ACE Performance Campus</div><div className="mt-1 text-sm font-semibold">Reference-bound exterior blockout · daylight study</div></div>
  </div>;
};

export default ThreeScene;
