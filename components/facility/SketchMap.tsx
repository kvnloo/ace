import React from 'react';
import { Layers, Ruler, Eye, Box, Maximize2 } from 'lucide-react';
import { FeatureData } from '../types';
import {
  AnnotationMode,
  FEATURES,
  FloorLevel,
  SKETCH_BY_FLOOR,
} from '../../facility/program';

export const ControlsOverlay: React.FC<{
  activeFloor: FloorLevel;
  setActiveFloor: (f: FloorLevel) => void;
  annotationMode: AnnotationMode;
  setAnnotationMode: (m: AnnotationMode) => void;
}> = ({ activeFloor, setActiveFloor, annotationMode, setAnnotationMode }) => {
  return (
    <div className="absolute top-40 left-6 z-10 flex flex-col gap-4 pointer-events-none">
      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-3 h-3" /> Floor View
        </div>
        {[
          { id: 'APEX', label: 'APEX: Campus' },
          { id: 3, label: 'L3: Lab' },
          { id: 2, label: 'L2: Social' },
          { id: 1, label: 'L1: Racquet' },
          { id: 0, label: 'G: Tennis' },
          { id: 'ALL', label: 'Full Campus' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFloor(item.id as FloorLevel)}
            className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFloor === item.id
                ? 'bg-tennis-yellow text-tennis-dark shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 pointer-events-auto shadow-2xl flex flex-col gap-1">
        <div className="px-3 py-2 text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-3 h-3" /> Overlay
        </div>
        <button
          onClick={() => setAnnotationMode('NONE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            annotationMode === 'NONE' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          <Box className="w-4 h-4" /> Clean
        </button>
        <button
          onClick={() => setAnnotationMode('LABELS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            annotationMode === 'LABELS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          <Maximize2 className="w-4 h-4" /> Labels
        </button>
        <button
          onClick={() => setAnnotationMode('MEASUREMENTS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            annotationMode === 'MEASUREMENTS' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          <Ruler className="w-4 h-4" /> Dimensions
        </button>
      </div>
    </div>
  );
};

const CourtDiagram: React.FC<{
  variant: 'tennis' | 'badminton' | 'pickle' | 'farm' | 'campus' | 'apex';
}> = ({ variant }) => {
  if (variant === 'farm') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d24] via-[#243d28] to-[#0c0d0b]">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 18px, rgba(199,237,36,0.12) 18px, rgba(199,237,36,0.12) 20px), repeating-linear-gradient(0deg, transparent 0, transparent 22px, rgba(199,237,36,0.08) 22px, rgba(199,237,36,0.08) 24px)',
          }}
        />
        <div className="absolute inset-[12%] rounded-lg border border-tennis-yellow/25 bg-[#1a3d24]/80 flex flex-col items-center justify-center gap-2">
          <span className="text-[10px] font-mono text-tennis-yellow/80 tracking-widest">
            GRASS LAB · one zone
          </span>
          <span className="text-[10px] font-mono text-white/50 tracking-widest">
            500 m² / section · count unspecified
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'apex') {
    const cells = [
      'Biometric',
      'Cognitive',
      'Movement',
      'Research',
      'Nutrition',
      'Recovery',
      'Gym',
      'Pool',
      'Clubhouse',
    ];
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1520] via-[#12141c] to-[#0c0d0b]">
        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-16">
          <div className="grid grid-cols-3 gap-2 w-full max-w-xl aspect-square">
            {cells.map((label) => (
              <div
                key={label}
                className="border border-tennis-yellow/25 bg-white/5 flex items-center justify-center"
              >
                <span className="text-[10px] font-mono tracking-widest text-white/70 uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'campus') {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2420] via-[#121816] to-[#0c0d0b]">
        <div className="absolute inset-0 flex items-center justify-center gap-4 md:gap-8 p-8">
          <div className="w-[42%] max-w-sm aspect-[7/6] border border-white/20 bg-[#3f6b1d]/40 flex flex-col items-center justify-center gap-1">
            <span className="text-[10px] font-mono text-white/70 tracking-widest">SPEC</span>
            <span className="text-sm font-bold text-white">LawnTech racquet</span>
            <span className="text-[10px] font-mono text-white/50">24 tennis · grass lab</span>
          </div>
          <div className="w-[38%] max-w-xs aspect-square border border-tennis-yellow/30 bg-white/5 grid grid-cols-3 gap-px p-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-tennis-yellow/10" />
            ))}
          </div>
        </div>
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-[10px] font-mono text-tennis-yellow/80 tracking-widest">
          VISION campus · inferred cells
        </div>
      </div>
    );
  }

  const surface =
    variant === 'pickle' ? 'bg-[#3d7a3a]' : variant === 'badminton' ? 'bg-[#1f6b4a]' : 'bg-[#3f6b1d]';

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#243528] via-[#1a2a22] to-[#0c0d0b]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(61,122,58,0.35),_transparent_70%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-20">
        <div
          className={`relative w-full max-w-xl aspect-[10/22] ${surface} rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.45)] border border-white/15`}
        >
          <div className="absolute inset-[6%] border-2 border-white/50">
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/80" />
            <div className="absolute left-[12%] right-[12%] top-[18%] bottom-[18%] border border-white/40">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-white/40" />
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
  reason = 'WebGL did not paint',
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
    <div className="w-full h-full absolute inset-0 bg-[#0c0d0b]">
      <ControlsOverlay
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        annotationMode={annotationMode}
        setAnnotationMode={setAnnotationMode}
      />
      <CourtDiagram variant={sketch.variant} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">{sketch.title}</h2>
        <p className="text-white/70 mt-3 max-w-lg">{sketch.note}</p>
        <span className="mt-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-lg border border-tennis-yellow/30 text-sm font-mono text-tennis-yellow">
          CSS SKETCH · {reason}
        </span>
        {annotationMode === 'MEASUREMENTS' && (
          <span className="mt-3 text-tennis-yellow font-mono text-xs tracking-widest">
            {sketch.variant === 'farm'
              ? '500 m² / section (origin)'
              : sketch.variant === 'apex' || sketch.variant === 'campus'
                ? 'APEX cells inferred · not origin'
                : 'envelope 140×120 m · inferred'}
          </span>
        )}
      </div>
      {visibleFeatures.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 max-w-3xl px-4 z-10">
          {visibleFeatures.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelect(f)}
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
        Naperville pretotype · VISION campus · Pascal program sketch
      </div>
    </div>
  );
};
