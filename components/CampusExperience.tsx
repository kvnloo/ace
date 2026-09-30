import React from 'react';
import { FeatureData } from '../types';
import { AnnotationMode, FloorLevel } from '../facility/program';
import { SketchFallback } from './facility/SketchMap';

const PascalFacility = React.lazy(() => import('./PascalFacility'));

type Props = {
  onFeatureSelect: (feature: FeatureData) => void;
};

const CampusExperience: React.FC<Props> = ({ onFeatureSelect }) => {
  const [force3d, setForce3d] = React.useState(false);
  const [activeFloor, setActiveFloor] = React.useState<FloorLevel>('ALL');
  const [annotationMode, setAnnotationMode] = React.useState<AnnotationMode>('LABELS');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const lite = document.documentElement.dataset.aceQuality === 'lite';

  const handleSelect = (feature: FeatureData) => {
    setSelectedId(feature.id);
    onFeatureSelect(feature);
  };

  if (lite && !force3d) {
    return (
      <div className="absolute inset-0">
        <SketchFallback
          activeFloor={activeFloor}
          setActiveFloor={setActiveFloor}
          annotationMode={annotationMode}
          setAnnotationMode={setAnnotationMode}
          selectedId={selectedId}
          onSelect={handleSelect}
          reason="Lite mode · 3D deferred"
        />
        <button
          type="button"
          className="ace-campus-enable-3d"
          onClick={() => setForce3d(true)}
        >
          Enable full 3D
          <span>loads the Pascal renderer on demand</span>
        </button>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="w-full h-full bg-[#050806] grid place-items-center">
          <div className="ace-kicker">LOADING CAMPUS TWIN</div>
        </div>
      }
    >
      <PascalFacility onFeatureSelect={onFeatureSelect} />
    </React.Suspense>
  );
};

export default CampusExperience;
