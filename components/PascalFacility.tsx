import React, { useCallback, useEffect, useRef, useState } from 'react';
import { nodeRegistry, registerNode, useScene } from '@pascal-app/core';
import { builtinPlugin } from '@pascal-app/nodes';
import { Viewer, useViewer } from '@pascal-app/viewer';
import { useFrame, useThree } from '@react-three/fiber';
import { FeatureData } from '../types';
import { generateLawnTechScene } from '../facility/generateScene';
import {
  AnnotationMode,
  BUILDING_ID,
  FEATURES,
  FloorLevel,
  levelNodeId,
} from '../facility/program';
import { ControlsOverlay, SketchFallback } from './facility/SketchMap';

for (const definition of builtinPlugin.nodes ?? []) {
  if (!nodeRegistry.has(definition.kind)) registerNode(definition);
}

declare global {
  interface Window {
    __PASCAL_BACKEND__?: string;
    __PASCAL_STATUS__?: string;
    __PASCAL_DEBUG__?: Record<string, unknown>;
  }
}

function probeWebGLPaint(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const opts: WebGLContextAttributes = {
      preserveDrawingBuffer: true,
      antialias: false,
    };
    const gl = (canvas.getContext('webgl2', opts) ||
      canvas.getContext('webgl', opts) ||
      canvas.getContext('experimental-webgl', opts)) as WebGLRenderingContext | null;
    if (!gl) return false;
    if (typeof gl.isContextLost === 'function' && gl.isContextLost()) return false;
    gl.viewport(0, 0, 16, 16);
    gl.clearColor(0.15, 0.55, 0.22, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const px = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const painted = px[0] > 10 || px[1] > 20 || px[2] > 10;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return painted;
  } catch {
    return false;
  }
}

class WebGLErrorBoundary extends React.Component<
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
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function PaintGuard({ onPainted, onBlank }: { onPainted: () => void; onBlank: () => void }) {
  const { gl } = useThree();
  const frames = useRef(0);
  const settled = useRef(false);

  useFrame(() => {
    if (settled.current) return;
    frames.current += 1;
    if (frames.current < 24) return;
    settled.current = true;
    try {
      const ctx = gl.getContext();
      const w = ctx.drawingBufferWidth;
      const h = ctx.drawingBufferHeight;
      if (w < 2 || h < 2) {
        onBlank();
        return;
      }
      const px = new Uint8Array(4);
      const samples: Array<[number, number]> = [
        [0.5, 0.5],
        [0.4, 0.45],
        [0.6, 0.45],
        [0.5, 0.38],
        [0.5, 0.6],
      ];
      let lit = false;
      for (const [u, v] of samples) {
        ctx.readPixels(Math.floor(w * u), Math.floor(h * v), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
        if (px[0] + px[1] + px[2] > 18) {
          lit = true;
          break;
        }
      }
      if (lit) onPainted();
      else onBlank();
    } catch {
      onBlank();
    }
  });

  return null;
}

function CameraFramer({ floor }: { floor: FloorLevel }) {
  const { camera, invalidate } = useThree();
  React.useLayoutEffect(() => {
    if (floor === 'ALL') {
      camera.position.set(180, 70, 180);
      camera.lookAt(0, 18, 0);
    } else {
      const y = floor * 10 + 18;
      camera.position.set(90, y + 24, 90);
      camera.lookAt(0, y, 0);
    }
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, floor, invalidate]);
  return null;
}

function applyFloorMode(floor: FloorLevel) {
  const viewer = useViewer.getState();
  viewer.setRenderContext('viewer');
  viewer.setWallMode('cutaway');
  viewer.setShowZones(true);
  viewer.setShowGrid(false);
  viewer.setShadows(false);
  if (floor === 'ALL') {
    viewer.setLevelMode('exploded');
    viewer.setSelection({ buildingId: BUILDING_ID, levelId: null, zoneId: null, selectedIds: [] });
    return;
  }
  viewer.setLevelMode('solo');
  viewer.setSelection({
    buildingId: BUILDING_ID,
    levelId: levelNodeId(floor),
    zoneId: null,
    selectedIds: [],
  });
}

type PascalFacilityProps = {
  onFeatureSelect: (feature: FeatureData) => void;
};

const PascalFacility: React.FC<PascalFacilityProps> = ({ onFeatureSelect }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<FloorLevel>('ALL');
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('LABELS');
  const [attempt3d, setAttempt3d] = useState(() => probeWebGLPaint());
  const [webglLive, setWebglLive] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [failReason, setFailReason] = useState('WebGL did not paint');

  useEffect(() => {
    let cancelled = false;
    window.__PASCAL_BACKEND__ = 'webgl2';
    try {
      const { nodes, rootNodeIds } = generateLawnTechScene();
      useScene.getState().setScene(nodes, rootNodeIds);
      useScene.getState().setReadOnly(true);
      applyFloorMode(activeFloor);
      if (!cancelled) {
        window.__PASCAL_STATUS__ = 'ready';
        setStatus('ready');
      }
    } catch (error) {
      console.error('[PascalFacility]', error);
      if (!cancelled) {
        setStatus('error');
        setFailReason(error instanceof Error ? error.message : 'Pascal scene failed');
        setAttempt3d(false);
      }
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status === 'ready') applyFloorMode(activeFloor);
  }, [activeFloor, status]);

  useEffect(() => {
    if (!attempt3d || webglLive) return;
    const timer = window.setTimeout(() => {
      setAttempt3d(false);
      setFailReason('Pascal viewer did not paint');
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [attempt3d, webglLive]);

  const handleSelect = useCallback(
    (feature: FeatureData) => {
      setSelectedId(feature.id);
      onFeatureSelect(feature);
      if (feature.id.includes('ground')) setActiveFloor(0);
      if (feature.id.includes('level1')) setActiveFloor(1);
      if (feature.id.includes('level2')) setActiveFloor(2);
      if (feature.id.includes('level3')) setActiveFloor(3);
    },
    [onFeatureSelect],
  );

  const fallback = (
    <SketchFallback
      activeFloor={activeFloor}
      setActiveFloor={setActiveFloor}
      annotationMode={annotationMode}
      setAnnotationMode={setAnnotationMode}
      selectedId={selectedId}
      onSelect={handleSelect}
      reason={failReason}
    />
  );

  if (status !== 'ready' || !attempt3d) {
    return <div className="w-full h-full absolute inset-0">{fallback}</div>;
  }

  return (
    <div className="w-full h-full absolute inset-0">
      {!webglLive && fallback}
      <WebGLErrorBoundary
        onFail={() => {
          setAttempt3d(false);
          setWebglLive(false);
          setFailReason('Pascal viewer crashed');
        }}
      >
        <div className={`absolute inset-0 ${webglLive ? 'z-[1]' : 'z-0 opacity-0 pointer-events-none'}`}>
          <Viewer
            selectionManager="custom"
            sceneReadyKey="ace-lawntech"
            disablePostFx
            maxFps={30}
            defaultRender={{ textures: true }}
            onSceneReadyChange={(ready) => {
              if (!ready) return;
            }}
          >
            <CameraFramer floor={activeFloor} />
            <PaintGuard
              onPainted={() => setWebglLive(true)}
              onBlank={() => {
                setAttempt3d(false);
                setFailReason('Pascal viewer did not paint');
              }}
            />
          </Viewer>
        </div>
      </WebGLErrorBoundary>
      {webglLive && (
        <>
          <ControlsOverlay
            activeFloor={activeFloor}
            setActiveFloor={setActiveFloor}
            annotationMode={annotationMode}
            setAnnotationMode={setAnnotationMode}
          />
          {annotationMode !== 'NONE' && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-3xl px-4 z-10">
              {FEATURES.filter((f) => {
                if (activeFloor === 'ALL') return true;
                if (activeFloor === 0) return f.id.includes('ground');
                if (activeFloor === 1) return f.id.includes('level1');
                if (activeFloor === 2) return f.id.includes('level2');
                if (activeFloor === 3) return f.id.includes('level3');
                return true;
              }).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelect(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                    selectedId === f.id
                      ? 'bg-tennis-yellow text-black border-tennis-yellow'
                      : 'bg-slate-900/80 text-white border-white/20'
                  }`}
                >
                  {f.icon} {f.title}
                </button>
              ))}
            </div>
          )}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/45 text-[10px] pointer-events-none select-none font-mono text-center tracking-widest uppercase">
            Naperville pretotype · Pascal facility · envelope inferred
          </div>
        </>
      )}
    </div>
  );
};

export default PascalFacility;
