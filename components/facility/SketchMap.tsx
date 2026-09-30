import React from 'react';
import { Layers, Ruler, Eye, Box, Maximize2 } from 'lucide-react';
import { FeatureData } from '../types';
import {
  AnnotationMode,
  FEATURES,
  FloorLevel,
  SKETCH_BY_FLOOR,
} from '../../facility/program';

const floors: Array<{ id: FloorLevel; label: string }> = [
  { id: 'APEX', label: 'APEX' },
  { id: 3, label: 'L3 Lab' },
  { id: 2, label: 'L2 Social' },
  { id: 1, label: 'L1 Racquet' },
  { id: 0, label: 'Ground' },
  { id: 'ALL', label: 'Campus' },
];

export const ControlsOverlay: React.FC<{
  activeFloor: FloorLevel;
  setActiveFloor: (f: FloorLevel) => void;
  annotationMode: AnnotationMode;
  setAnnotationMode: (m: AnnotationMode) => void;
}> = ({ activeFloor, setActiveFloor, annotationMode, setAnnotationMode }) => {
  return (
    <div className="ace-map-controls">
      <div className="ace-control-panel">
        <div className="ace-control-label">
          <Layers size={12} /> Floor
        </div>
        <div className="ace-control-list">
          {floors.map((item) => (
            <button
              type="button"
              aria-pressed={activeFloor === item.id}
              key={String(item.id)}
              onClick={() => setActiveFloor(item.id)}
              className="ace-floor-btn"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ace-control-panel">
        <div className="ace-control-label">
          <Eye size={12} /> Overlay
        </div>
        <div className="ace-control-list">
          <button
            type="button"
            aria-pressed={annotationMode === 'NONE'}
            onClick={() => setAnnotationMode('NONE')}
            className="ace-overlay-btn"
          >
            <Box size={14} /> Clean
          </button>
          <button
            type="button"
            aria-pressed={annotationMode === 'LABELS'}
            onClick={() => setAnnotationMode('LABELS')}
            className="ace-overlay-btn"
          >
            <Maximize2 size={14} /> Labels
          </button>
          <button
            type="button"
            aria-pressed={annotationMode === 'MEASUREMENTS'}
            onClick={() => setAnnotationMode('MEASUREMENTS')}
            className="ace-overlay-btn"
          >
            <Ruler size={14} /> Dimensions
          </button>
        </div>
      </div>
    </div>
  );
};

const CourtDiagram: React.FC<{
  variant: 'tennis' | 'badminton' | 'pickle' | 'farm' | 'campus' | 'apex';
}> = ({ variant }) => {
  if (variant === 'farm') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#15281b] via-[#111913] to-[#050806]">
        <div
          className="absolute inset-0 opacity-50"
          aria-hidden="true"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 18px, rgba(220,255,69,0.13) 18px, rgba(220,255,69,0.13) 19px), repeating-linear-gradient(0deg, transparent 0, transparent 22px, rgba(220,255,69,0.06) 22px, rgba(220,255,69,0.06) 23px)',
          }}
        />
        <div className="absolute inset-[12%] border border-tennis-yellow/25 bg-black/20 flex flex-col items-center justify-center gap-2 text-center px-3">
          <span className="ace-kicker">GRASS LAB · ONE ZONE</span>
          <span className="ace-mono text-[9px] text-white/50 tracking-widest uppercase">
            500 m² / section · count unspecified
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'apex') {
    const cells = ['Biometric', 'Cognitive', 'Movement', 'Research', 'Nutrition', 'Recovery', 'Gym', 'Pool', 'Clubhouse'];
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#101411] via-[#090d0a] to-[#050806]">
        <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-16">
          <div className="grid grid-cols-3 gap-px w-full max-w-xl aspect-square border border-white/10 bg-white/10">
            {cells.map((label, index) => (
              <div key={label} className="bg-[#050806]/95 flex flex-col items-center justify-center min-w-0 p-2">
                <span className="ace-mono text-[8px] text-tennis-yellow/70 mb-2">{String(index + 1).padStart(2, '0')}</span>
                <span className="ace-display text-[11px] sm:text-sm tracking-[0.08em] text-white/70 uppercase text-center break-words">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'campus') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#111812] via-[#090d0a] to-[#050806]">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 sm:gap-8 p-5 sm:p-8">
          <div className="w-[48%] sm:w-[42%] max-w-sm aspect-[7/6] border border-white/20 bg-tennis-yellow/[0.055] flex flex-col items-center justify-center gap-2 text-center px-2">
            <span className="ace-mono text-[9px] text-white/50 tracking-widest">SPEC / RACQUET</span>
            <span className="ace-display text-xl sm:text-3xl font-light uppercase text-white">Origin campus</span>
            <span className="hidden sm:block ace-mono text-[9px] text-white/40">24 tennis · grass lab</span>
          </div>
          <div className="w-[42%] sm:w-[38%] max-w-xs aspect-square border border-tennis-yellow/30 bg-white/[0.02] grid grid-cols-3 gap-px p-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/[0.04] bg-tennis-yellow/[0.055]" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-[17%] left-1/2 -translate-x-1/2 ace-mono text-[9px] text-tennis-yellow/70 tracking-widest whitespace-nowrap uppercase">
          VISION / HUMAN PERFORMANCE WING
        </div>
      </div>
    );
  }

  const surface = variant === 'pickle' ? 'bg-[#315f31]' : variant === 'badminton' ? 'bg-[#174a37]' : 'bg-[#36551d]';

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#162019] via-[#0d130f] to-[#050806]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,255,69,0.10),_transparent_68%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-20">
        <div className={`relative h-[68%] sm:h-auto sm:w-full sm:max-w-xl aspect-[10/22] ${surface} shadow-[0_0_90px_rgba(0,0,0,0.55)] border border-white/15`}>
          <div className="absolute inset-[6%] border border-white/55">
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/70" />
            <div className="absolute left-[12%] right-[12%] top-[18%] bottom-[18%] border border-white/35">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/25" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SketchFallback: React.FC<{
  activeFloor: FloorLevel;
  setActiveFloor: (f: FloorLevel) => void;
  annotationMode: AnnotationMode;
  setAnnotationMode: (m: AnnotationMode) => void;
  selectedId: string | null;
  onSelect: (feature: FeatureData) => void;
  reason?: string;
}> = ({
  activeFloor,
  setActiveFloor,
  annotationMode,
  setAnnotationMode,
  selectedId,
  onSelect,
  reason = '3D fallback active',
}) => {
  const sketch = SKETCH_BY_FLOOR[String(activeFloor)] ?? SKETCH_BY_FLOOR.ALL;
  const showLabels = annotationMode === 'LABELS' || annotationMode === 'MEASUREMENTS';
  const visibleFeatures = FEATURES.filter((f) => {
    if (!showLabels) return false;
    if (activeFloor === 'ALL') return true;
    if (activeFloor === 0) return f.id.includes('ground');
    if (activeFloor === 1) return f.id.includes('level1');
    if (activeFloor === 2) return f.id.includes('level2');
    if (activeFloor === 3) return f.id.includes('level3');
    if (activeFloor === 'APEX') return f.id.includes('apex');
    return true;
  });

  return (
    <div className="w-full h-full absolute inset-0 bg-[#050806]">
      <ControlsOverlay
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        annotationMode={annotationMode}
        setAnnotationMode={setAnnotationMode}
      />
      <CourtDiagram variant={sketch.variant} />

      <div className="absolute top-20 sm:top-6 right-3 sm:right-6 pointer-events-none text-right max-w-[72vw] z-10">
        <span className="inline-block border border-white/15 bg-black/45 backdrop-blur-md px-3 py-2 ace-mono text-[8px] sm:text-[9px] text-tennis-yellow/80 tracking-widest uppercase">
          CSS FALLBACK · {reason}
        </span>
        {annotationMode === 'MEASUREMENTS' && (
          <div className="mt-2 ace-mono text-[8px] sm:text-[9px] text-white/45 tracking-wider uppercase">
            {sketch.variant === 'farm'
              ? '500 m² / section · origin'
              : sketch.variant === 'apex' || sketch.variant === 'campus'
                ? 'APEX cells inferred · not origin'
                : 'envelope 140 × 120 m · inferred'}
          </div>
        )}
      </div>

      {sketch.variant !== 'apex' && sketch.variant !== 'campus' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center pt-20">
          <p className="ace-kicker">{activeFloor === 'ALL' ? 'CAMPUS' : `LEVEL ${String(activeFloor).toUpperCase()}`}</p>
          <h2 className="ace-display text-5xl md:text-7xl font-extralight uppercase text-white mt-3 leading-[0.9]">{sketch.title}</h2>
          <p className="text-white/55 mt-4 max-w-lg text-sm sm:text-base">{sketch.note}</p>
        </div>
      )}

      {visibleFeatures.length > 0 && (
        <div className="ace-feature-strip">
          {visibleFeatures.map((f) => (
            <button
              type="button"
              aria-pressed={selectedId === f.id}
              key={f.id}
              onClick={() => onSelect(f)}
              className="ace-feature-btn"
            >
              <span className="ace-feature-dot" aria-hidden="true" />{f.title}
            </button>
          ))}
        </div>
      )}

      <div className="ace-map-stamp">
        PRETOTYPE · VISION CAMPUS<br />
        PASCAL PROGRAM SKETCH
      </div>
    </div>
  );
};
